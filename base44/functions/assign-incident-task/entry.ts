import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, failure, json, requestId, safeTask } from './coordination.ts';
import { appendTaskEvent, canUseTaskRole, loadTaskById, resolveTaskAssignee } from './task-workflow.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorizeActiveMembership(base44, input.organizationId);
    if (!canUseTaskRole(access.membership.role, 'assign')) throw { code: 'TASK_ASSIGNMENT_FORBIDDEN', status: 403 };
    const rid = requestId(input.requestId);
    if (!rid) throw { code: 'VALIDATION_FAILED', status: 400 };
    const incident = await base44.asServiceRole.entities.Incident.get(input.incidentId);
    if (!incident || incident.organization_id !== access.organizationId) throw { code: 'INCIDENT_NOT_FOUND', status: 404 };
    const task = await loadTaskById(base44, access.organizationId, incident.id, input.taskId);
    if (['done', 'cancelled'].includes(task.status)) throw { code: 'TASK_TERMINAL', status: 400 };
    const nextAssignee = input.assigneeUserId === null ? '' : await resolveTaskAssignee(base44, access.organizationId, input.assigneeUserId);
    const previousAssignee = task.assignee_user_id ?? '';
    if (previousAssignee === nextAssignee) return json({ task: safeTask(task), reconciled: true });
    const nextStatus = nextAssignee === '' && task.status === 'in_progress' ? 'todo' : task.status;
    const result = await base44.asServiceRole.entities.IncidentTask.updateMany(
      { id: task.id, organization_id: access.organizationId, incident_id: incident.id },
      { $set: { assignee_user_id: nextAssignee, status: nextStatus, claimed_at: nextStatus === 'todo' ? null : task.claimed_at ?? null, request_id: rid } },
    );
    if ((result?.updated ?? 0) === 0) throw { code: 'TASK_UPDATE_FORBIDDEN', status: 403 };
    const updated = await loadTaskById(base44, access.organizationId, incident.id, input.taskId);
    await appendTaskEvent(base44, {
      organizationId: access.organizationId,
      incidentId: incident.id,
      taskId: task.id,
      eventType: previousAssignee ? 'task_reassigned' : 'task_assigned',
      message: nextAssignee ? `Task ${updated.title} was assigned.` : `Task ${updated.title} was unassigned.`,
      actorUserId: access.user.id,
      metadata: {
        task_id: task.id,
        task_title: updated.title,
        previous_assignee_user_id: previousAssignee || undefined,
        assignee_user_id: nextAssignee || undefined,
        request_id: rid,
      },
      requestId: rid,
    });
    return json({ task: safeTask(updated) });
  } catch (error) {
    return failure(error);
  }
});

