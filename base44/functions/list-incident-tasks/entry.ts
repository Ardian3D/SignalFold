import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, failure, json, loadIncidentTasks } from './coordination.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorizeActiveMembership(base44, input.organizationId);
    const incident = await base44.asServiceRole.entities.Incident.get(input.incidentId);
    if (!incident || incident.organization_id !== access.organizationId) throw { code: 'INCIDENT_NOT_FOUND', status: 404 };
    const result = await loadIncidentTasks(base44, access.organizationId, incident.id, {
      status: Array.isArray(input.status) ? input.status : undefined,
      assigneeUserId: typeof input.assigneeUserId === 'string' ? input.assigneeUserId : undefined,
      priority: Array.isArray(input.priority) ? input.priority : undefined,
      includeCancelled: input.includeCancelled === true,
    });
    return json(result);
  } catch (error) {
    return failure(error);
  }
});

