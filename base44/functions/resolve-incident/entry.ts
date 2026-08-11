import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, clean, failure, json, requestId } from './coordination.ts';
import {
  appendAuthorityEvent,
  canMutateIncidentAuthority,
  countOpenCriticalTasks,
  loadIncidentForOrg,
  resolvableStatuses,
  rootCauseValues,
  safeIncidentAuthority,
} from './incident-authority.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorizeActiveMembership(base44, input.organizationId);
    if (!canMutateIncidentAuthority(access.membership.role)) throw { code: 'FORBIDDEN', status: 403 };
    const rid = requestId(input.requestId);
    if (!rid) throw { code: 'VALIDATION_FAILED', status: 400 };
    const expectedStatus = clean(input.expectedStatus, 32);
    const resolutionSummary = clean(input.resolutionSummary, 2000);
    const rootCauseKnown = clean(input.rootCauseKnown, 16).toLowerCase();
    const remainingRisk = clean(input.remainingRisk, 1000);
    const overrideReason = clean(input.overrideReason, 1000);
    if (!resolvableStatuses.has(expectedStatus)) throw { code: 'INVALID_STATE_TRANSITION', status: 400 };
    if (resolutionSummary.length < 5 || remainingRisk.length < 1 || !rootCauseValues.has(rootCauseKnown)) throw { code: 'VALIDATION_FAILED', status: 400 };
    if (input.recoveryVerified !== true) throw { code: 'RECOVERY_NOT_VERIFIED', status: 400 };

    const priorEvent = await base44.asServiceRole.entities.IncidentUpdate.filter({
      organization_id: access.organizationId,
      incident_id: input.incidentId,
      request_id: rid,
      event_type: 'incident_resolved',
    });
    if (priorEvent[0]) {
      const incident = await loadIncidentForOrg(base44, access.organizationId, input.incidentId);
      return json({ incident: safeIncidentAuthority(incident), reconciled: true });
    }

    const incident = await loadIncidentForOrg(base44, access.organizationId, input.incidentId);
    if (String(incident.status) !== expectedStatus) throw { code: 'INCIDENT_STATE_CONFLICT', status: 409 };
    const openCritical = await countOpenCriticalTasks(base44, access.organizationId, incident.id);
    let overrideUsed = false;
    if (openCritical > 0) {
      if (input.overrideOpenCriticalTasks !== true || overrideReason.length < 3) throw { code: 'OPEN_CRITICAL_TASKS', status: 409, openCriticalTasks: openCritical };
      overrideUsed = true;
    }

    const patch: Record<string, unknown> = {
      status: 'resolved',
      resolved_at: new Date().toISOString(),
      resolution_summary: resolutionSummary,
      root_cause_known: rootCauseKnown,
      recovery_verified: true,
      remaining_risk: remainingRisk,
      resolution_override_reason: overrideUsed ? overrideReason : '',
      request_id: rid,
    };
    if (!incident.acknowledged_at) patch.acknowledged_at = new Date().toISOString();

    const result = await base44.asServiceRole.entities.Incident.updateMany(
      { id: incident.id, organization_id: access.organizationId, status: expectedStatus },
      { $set: patch },
    );
    if ((result?.updated ?? 0) === 0) {
      const current = await loadIncidentForOrg(base44, access.organizationId, input.incidentId);
      if (String(current.status) === 'resolved') return json({ incident: safeIncidentAuthority(current), reconciled: true });
      throw { code: 'INCIDENT_STATE_CONFLICT', status: 409 };
    }

    const updated = await loadIncidentForOrg(base44, access.organizationId, input.incidentId);
    await appendAuthorityEvent(base44, {
      organizationId: access.organizationId,
      incidentId: incident.id,
      eventType: 'incident_resolved',
      message: `Incident ${updated.code} was resolved.`,
      actorUserId: access.user.id,
      metadata: {
        previous_status: expectedStatus,
        new_status: 'resolved',
        root_cause_known: rootCauseKnown,
        recovery_verified: true,
        open_critical_tasks: openCritical,
        override_used: overrideUsed,
        override_reason: overrideUsed ? overrideReason : undefined,
        request_id: rid,
      },
      isDemo: updated.is_demo === true,
      requestId: rid,
    });

    let serviceRestored = false;
    if (input.restoreServiceOperational === true && updated.service_id) {
      const service = await base44.asServiceRole.entities.Service.get(updated.service_id);
      if (service && service.organization_id === access.organizationId && service.operational_status !== 'operational') {
        await base44.asServiceRole.entities.Service.update(service.id, { operational_status: 'operational' });
        serviceRestored = true;
      }
    }

    return json({ incident: safeIncidentAuthority(updated), serviceRestored });
  } catch (error) {
    const value = error as { code?: string; status?: number; openCriticalTasks?: number };
    if (value.code === 'OPEN_CRITICAL_TASKS') {
      return json({ error: 'OPEN_CRITICAL_TASKS', openCriticalTasks: value.openCriticalTasks ?? 0 }, 409);
    }
    return failure(error);
  }
});
