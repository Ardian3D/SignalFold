import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, failure, json, requestId, safeTask } from './coordination.ts';
import { appendTaskEvent, canUseTaskRole, loadTaskById } from './task-workflow.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorizeActiveMembership(base44, input.organizationId);
    if (!canUseTaskRole(access.membership.role, 'claim')) throw { code: 'TASK_UPDATE_FORBIDDEN', status: 403 };
    const rid = requestId(input.requestId);
    if (!rid) throw { code: 'VALIDATION_FAILED', status: 400 };
    const incident = await base44.asServiceRole.entities.Incident.get(input.incidentId);
    if (!incident || incident.organization_id !== access.organizationId) throw { code: 'INCIDENT_NOT_FOUND', status: 404 };
    const task = await loadTaskById(base44, access.organizationId, incident.id, input.taskId);
    if (task.status !== 'in_progress') throw { code: 'TASK_NOT_OWNED', status: 403 };
    const currentAssignee = task.assignee_user_id ?? '';
    if (currentAssignee !== access.user.id && !['incident_manager', 'admin'].includes(access.membership.role)) throw { code: 'TASK_NOT_OWNED', status: 403 };
    const priorEvent = await base44.asServiceRole.entities.IncidentUpdate.filter({ organization_id: access.organizationId, incident_id: incident.id, request_id: rid, event_type: 'task_unclaimed' });
    if (priorEvent[0]) return json({ task: safeTask(task), reconciled: true });
    const result = await base44.asServiceRole.entities.IncidentTask.updateMany(
      { id: task.id, organization_id: access.organizationId, incident_id: incident.id, status: 'in_progress' },
      { $set: { assignee_user_id: '', status: 'todo', claimed_at: null, request_id: rid } },
    );
    if ((result?.updated ?? 0) === 0) {
      const current = await loadTaskById(base44, access.organizationId, incident.id, input.taskId);
      if (current.status === 'todo' && (current.assignee_user_id ?? '') === '') return json({ task: safeTask(current), reconciled: true });
      throw { code: 'TASK_NOT_OWNED', status: 403 };
    }
    const updated = await loadTaskById(base44, access.organizationId, incident.id, input.taskId);
    await appendTaskEvent(base44, {
      organizationId: access.organizationId,
      incidentId: incident.id,
      taskId: task.id,
      eventType: 'task_unclaimed',
      message: `Task ${updated.title} was unclaimed.`,
      actorUserId: access.user.id,
      metadata: { task_id: task.id, task_title: updated.title, request_id: rid },
      requestId: rid,
    });
    return json({ task: safeTask(updated) });
  } catch (error) {
    return failure(error);
  }
});

