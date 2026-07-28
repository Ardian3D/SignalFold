import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, clean, failure, json, requestId, safeTimelineUpdate } from './coordination.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorizeActiveMembership(base44, input.organizationId);
    const rid = requestId(input.requestId);
    if (!rid) throw { code: 'VALIDATION_FAILED', status: 400 };
    const incident = await base44.asServiceRole.entities.Incident.get(input.incidentId);
    if (!incident || incident.organization_id !== access.organizationId) throw { code: 'INCIDENT_NOT_FOUND', status: 404 };
    const message = clean(input.message, 5000);
    if (message.length < 1) throw { code: 'NOTE_EMPTY', status: 400 };
    const prior = await base44.asServiceRole.entities.IncidentUpdate.filter({ organization_id: access.organizationId, incident_id: incident.id, request_id: rid, event_type: 'internal_note_added' });
    if (prior[0]) return json({ update: safeTimelineUpdate(prior[0]), reconciled: true });
    const update = await base44.asServiceRole.entities.IncidentUpdate.create({
      organization_id: access.organizationId,
      incident_id: incident.id,
      event_type: 'internal_note_added',
      actor_user_id: access.user.id,
      actor_type: 'user',
      visibility: 'internal',
      message,
      metadata: { request_id: rid },
      occurred_at: new Date().toISOString(),
      is_demo: false,
      request_id: rid,
    });
    return json({ update: safeTimelineUpdate(update) }, 201);
  } catch (error) {
    return failure(error);
  }
});

