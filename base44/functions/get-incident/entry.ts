import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, failure, json, loadActiveMembers, loadIncidentTasks, loadIncidentTimeline, safeTimelineUpdate } from './coordination.ts';
import { safeIncident, safeService } from './operations.ts';

const capabilitiesForRole = (role: string) => {
  if (role === 'admin') return ['CREATE_TASK', 'CLAIM_TASK', 'UPDATE_OWN_TASK', 'REASSIGN_TASK', 'ADD_INTERNAL_NOTE'];
  if (role === 'incident_manager') return ['CREATE_TASK', 'CLAIM_TASK', 'UPDATE_OWN_TASK', 'REASSIGN_TASK', 'ADD_INTERNAL_NOTE'];
  if (role === 'responder') return ['CREATE_TASK', 'CLAIM_TASK', 'UPDATE_OWN_TASK', 'ADD_INTERNAL_NOTE'];
  return ['ADD_INTERNAL_NOTE'];
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorizeActiveMembership(base44, input.organizationId);
    const incident = await base44.asServiceRole.entities.Incident.get(input.incidentId);
    if (!incident || incident.organization_id !== access.organizationId) throw { code: 'INCIDENT_NOT_FOUND', status: 404 };
    const service = incident.service_id ? await base44.asServiceRole.entities.Service.get(incident.service_id) : null;
    const reporter = await base44.asServiceRole.entities.User.get(incident.reporter_user_id);
    const commander = incident.commander_user_id ? await base44.asServiceRole.entities.User.get(incident.commander_user_id) : null;
    const timeline = await loadIncidentTimeline(base44, access.organizationId, incident.id, 'desc');
    const tasks = await loadIncidentTasks(base44, access.organizationId, incident.id, {});
    const members = await loadActiveMembers(base44, access.organizationId);
    return json({
      incident: safeIncident(incident),
      service: service && service.organization_id === access.organizationId ? safeService(service) : null,
      reporter: reporter ? { id: reporter.id, displayName: reporter.full_name ?? undefined, email: reporter.email ?? undefined } : null,
      commander: commander ? { id: commander.id, displayName: commander.full_name ?? undefined, email: commander.email ?? undefined } : null,
      tasks: tasks.tasks,
      taskSummary: tasks.summary,
      timeline: timeline.items.map(safeTimelineUpdate),
      updates: timeline.items.map(safeTimelineUpdate),
      assignmentOptions: members,
      capabilities: capabilitiesForRole(access.membership.role),
    });
  } catch (error) {
    return failure(error);
  }
});
