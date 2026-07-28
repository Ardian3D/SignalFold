import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, failure, json, loadIncidentTimeline } from './coordination.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorizeActiveMembership(base44, input.organizationId);
    const incident = await base44.asServiceRole.entities.Incident.get(input.incidentId);
    if (!incident || incident.organization_id !== access.organizationId) throw { code: 'INCIDENT_NOT_FOUND', status: 404 };
    const direction = input.direction === 'asc' ? 'asc' : 'desc';
    return json(await loadIncidentTimeline(base44, access.organizationId, incident.id, direction));
  } catch (error) {
    return failure(error);
  }
});

