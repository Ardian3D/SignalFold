import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, clean, failure, json, requestId } from './coordination.ts';
import {
  appendAuthorityEvent,
  canMutateIncidentAuthority,
  isAllowedTransition,
  loadIncidentForOrg,
  safeIncidentAuthority,
  statuses,
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
    const targetStatus = clean(input.targetStatus, 32);
    const reason = clean(input.reason, 1000);
    if (!statuses.has(expectedStatus) || !statuses.has(targetStatus)) throw { code: 'VALIDATION_FAILED', status: 400 };
    if (targetStatus === 'resolved') throw { code: 'INVALID_STATE_TRANSITION', status: 400 };
    if (expectedStatus === targetStatus) throw { code: 'INCIDENT_STATUS_UNCHANGED', status: 400 };
    if (!isAllowedTransition(expectedStatus, targetStatus)) throw { code: 'INVALID_STATE_TRANSITION', status: 400 };

    const priorEvent = await base44.asServiceRole.entities.IncidentUpdate.filter({
      organization_id: access.organizationId,
      incident_id: input.incidentId,
      request_id: rid,
      event_type: targetStatus === 'closed' ? 'incident_closed' : 'status_changed',
    });
    if (priorEvent[0]) {
      const incident = await loadIncidentForOrg(base44, access.organizationId, input.incidentId);
      return json({ incident: safeIncidentAuthority(incident), reconciled: true });
    }

    const incident = await loadIncidentForOrg(base44, access.organizationId, input.incidentId);
    if (incident.status === 'closed') throw { code: 'INCIDENT_ALREADY_CLOSED', status: 409 };
    if (String(incident.status) !== expectedStatus) throw { code: 'INCIDENT_STATE_CONFLICT', status: 409 };
    if (targetStatus === 'closed' && expectedStatus === 'resolved') {
      if (!incident.resolution_summary || incident.recovery_verified !== true) throw { code: 'INVALID_STATE_TRANSITION', status: 400 };
    }

    const patch: Record<string, unknown> = { status: targetStatus, request_id: rid };
    if (expectedStatus === 'reported' && !incident.acknowledged_at) patch.acknowledged_at = new Date().toISOString();
    if (targetStatus === 'closed') patch.closed_at = new Date().toISOString();

    const result = await base44.asServiceRole.entities.Incident.updateMany(
      { id: incident.id, organization_id: access.organizationId, status: expectedStatus },
      { $set: patch },
    );
    if ((result?.updated ?? 0) === 0) {
      const current = await loadIncidentForOrg(base44, access.organizationId, input.incidentId);
      if (String(current.status) === targetStatus) return json({ incident: safeIncidentAuthority(current), reconciled: true });
      throw { code: 'INCIDENT_STATE_CONFLICT', status: 409 };
    }

    const updated = await loadIncidentForOrg(base44, access.organizationId, input.incidentId);
    const eventType = targetStatus === 'closed' ? 'incident_closed' : 'status_changed';
    const message = targetStatus === 'closed'
      ? `Incident ${updated.code} was closed.`
      : `Incident ${updated.code} status changed from ${expectedStatus} to ${targetStatus}.`;
    await appendAuthorityEvent(base44, {
      organizationId: access.organizationId,
      incidentId: incident.id,
      eventType,
      message: reason ? `${message} ${reason}` : message,
      actorUserId: access.user.id,
      metadata: {
        previous_status: expectedStatus,
        new_status: targetStatus,
        reason: reason || undefined,
        request_id: rid,
      },
      isDemo: updated.is_demo === true,
      requestId: rid,
    });
    return json({ incident: safeIncidentAuthority(updated) });
  } catch (error) {
    return failure(error);
  }
});
