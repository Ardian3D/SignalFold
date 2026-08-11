import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, clean, failure, json, requestId } from './coordination.ts';
import {
  appendAuthorityEvent,
  canMutateIncidentAuthority,
  loadIncidentForOrg,
  resolveCommanderCandidate,
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

    const priorEvent = await base44.asServiceRole.entities.IncidentUpdate.filter({
      organization_id: access.organizationId,
      incident_id: input.incidentId,
      request_id: rid,
    });
    if (priorEvent[0] && ['commander_assigned', 'commander_reassigned', 'commander_unassigned'].includes(String(priorEvent[0].event_type))) {
      const incident = await loadIncidentForOrg(base44, access.organizationId, input.incidentId);
      return json({ incident: safeIncidentAuthority(incident), reconciled: true });
    }

    const incident = await loadIncidentForOrg(base44, access.organizationId, input.incidentId);
    if (String(incident.status) === 'closed') throw { code: 'INCIDENT_ALREADY_CLOSED', status: 409 };
    const currentCommander = typeof incident.commander_user_id === 'string' && incident.commander_user_id.trim() ? incident.commander_user_id : null;
    if (input.expectedCommanderUserId !== undefined) {
      const expected = input.expectedCommanderUserId ? clean(input.expectedCommanderUserId, 128) : null;
      if ((currentCommander ?? null) !== (expected || null)) throw { code: 'COMMANDER_CONFLICT', status: 409 };
    }
    const nextCommander = await resolveCommanderCandidate(base44, access.organizationId, input.commanderUserId ? clean(input.commanderUserId, 128) : null);
    if ((currentCommander ?? null) === (nextCommander ?? null)) throw { code: 'COMMANDER_UNCHANGED', status: 400 };

    const result = await base44.asServiceRole.entities.Incident.updateMany(
      { id: incident.id, organization_id: access.organizationId, commander_user_id: currentCommander ?? null },
      { $set: { commander_user_id: nextCommander ?? null, request_id: rid } },
    );
    if ((result?.updated ?? 0) === 0) {
      const current = await loadIncidentForOrg(base44, access.organizationId, input.incidentId);
      const now = typeof current.commander_user_id === 'string' && current.commander_user_id.trim() ? current.commander_user_id : null;
      if (now === (nextCommander ?? null)) return json({ incident: safeIncidentAuthority(current), reconciled: true });
      throw { code: 'COMMANDER_CONFLICT', status: 409 };
    }

    const updated = await loadIncidentForOrg(base44, access.organizationId, input.incidentId);
    let eventType = 'commander_reassigned';
    let message = `Incident ${updated.code} commander was reassigned.`;
    if (!currentCommander && nextCommander) {
      eventType = 'commander_assigned';
      message = `Incident ${updated.code} commander was assigned.`;
    } else if (currentCommander && !nextCommander) {
      eventType = 'commander_unassigned';
      message = `Incident ${updated.code} commander was unassigned.`;
    }
    await appendAuthorityEvent(base44, {
      organizationId: access.organizationId,
      incidentId: incident.id,
      eventType,
      message,
      actorUserId: access.user.id,
      metadata: {
        previous_commander_user_id: currentCommander ?? undefined,
        commander_user_id: nextCommander ?? undefined,
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
