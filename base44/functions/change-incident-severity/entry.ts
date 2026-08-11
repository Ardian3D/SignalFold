import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, clean, failure, json, requestId } from './coordination.ts';
import {
  appendAuthorityEvent,
  canMutateIncidentAuthority,
  loadIncidentForOrg,
  safeIncidentAuthority,
  severities,
} from './incident-authority.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorizeActiveMembership(base44, input.organizationId);
    if (!canMutateIncidentAuthority(access.membership.role)) throw { code: 'FORBIDDEN', status: 403 };
    const rid = requestId(input.requestId);
    if (!rid) throw { code: 'VALIDATION_FAILED', status: 400 };
    const expectedSeverity = clean(input.expectedSeverity, 8).toUpperCase();
    const newSeverity = clean(input.newSeverity, 8).toUpperCase();
    const reason = clean(input.reason, 1000);
    if (!severities.has(expectedSeverity) || !severities.has(newSeverity) || reason.length < 1) throw { code: 'VALIDATION_FAILED', status: 400 };
    if (expectedSeverity === newSeverity) throw { code: 'INCIDENT_SEVERITY_UNCHANGED', status: 400 };

    const priorEvent = await base44.asServiceRole.entities.IncidentUpdate.filter({
      organization_id: access.organizationId,
      incident_id: input.incidentId,
      request_id: rid,
      event_type: 'severity_changed',
    });
    if (priorEvent[0]) {
      const incident = await loadIncidentForOrg(base44, access.organizationId, input.incidentId);
      return json({ incident: safeIncidentAuthority(incident), reconciled: true });
    }

    const incident = await loadIncidentForOrg(base44, access.organizationId, input.incidentId);
    if (String(incident.status) === 'closed') throw { code: 'INCIDENT_ALREADY_CLOSED', status: 409 };
    if (String(incident.severity) !== expectedSeverity) throw { code: 'INCIDENT_SEVERITY_CONFLICT', status: 409 };

    const result = await base44.asServiceRole.entities.Incident.updateMany(
      { id: incident.id, organization_id: access.organizationId, severity: expectedSeverity },
      { $set: { severity: newSeverity, severity_source: 'human', request_id: rid } },
    );
    if ((result?.updated ?? 0) === 0) {
      const current = await loadIncidentForOrg(base44, access.organizationId, input.incidentId);
      if (String(current.severity) === newSeverity) return json({ incident: safeIncidentAuthority(current), reconciled: true });
      throw { code: 'INCIDENT_SEVERITY_CONFLICT', status: 409 };
    }

    const updated = await loadIncidentForOrg(base44, access.organizationId, input.incidentId);
    await appendAuthorityEvent(base44, {
      organizationId: access.organizationId,
      incidentId: incident.id,
      eventType: 'severity_changed',
      message: `Incident ${updated.code} severity changed from ${expectedSeverity} to ${newSeverity}. ${reason}`,
      actorUserId: access.user.id,
      metadata: {
        previous_severity: expectedSeverity,
        new_severity: newSeverity,
        reason,
        ai_assisted: false,
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
