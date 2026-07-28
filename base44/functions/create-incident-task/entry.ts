import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, clean, failure, json, requestId, safeTask } from './coordination.ts';
import { appendTaskEvent, canUseTaskRole, resolveTaskAssignee } from './task-workflow.ts';

const priorities = ['critical', 'high', 'medium', 'low'] as const;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorizeActiveMembership(base44, input.organizationId);
    if (!canUseTaskRole(access.membership.role, 'create')) throw { code: 'TASK_UPDATE_FORBIDDEN', status: 403 };
    const rid = requestId(input.requestId);
    if (!rid) throw { code: 'VALIDATION_FAILED', status: 400 };
    const title = clean(input.title, 160);
    const description = clean(input.description, 2000);
    const priority = priorities.includes(input.priority) ? input.priority : null;
    if (title.length < 3 || !priority) throw { code: 'VALIDATION_FAILED', status: 400 };
    const incident = await base44.asServiceRole.entities.Incident.get(input.incidentId);
    if (!incident || incident.organization_id !== access.organizationId) throw { code: 'INCIDENT_NOT_FOUND', status: 404 };
    const existing = await base44.asServiceRole.entities.IncidentTask.filter({ organization_id: access.organizationId, incident_id: incident.id, request_id: rid });
    if (existing[0]) return json({ task: safeTask(existing[0]), reconciled: true });
    if (access.membership.role === 'responder' && input.assigneeUserId) throw { code: 'TASK_ASSIGNMENT_FORBIDDEN', status: 403 };
    const assigneeUserId = await resolveTaskAssignee(base44, access.organizationId, input.assigneeUserId || null);
    const count = await base44.asServiceRole.entities.IncidentTask.filter({ organization_id: access.organizationId, incident_id: incident.id });
    const task = await base44.asServiceRole.entities.IncidentTask.create({
      organization_id: access.organizationId,
      incident_id: incident.id,
      title,
      description: description || undefined,
      priority,
      status: 'todo',
      assignee_user_id: assigneeUserId ?? '',
      created_by_user_id: access.user.id,
      source: 'human',
      order_index: count.length + 1,
      due_at: input.dueAt || undefined,
      claimed_at: undefined,
      completed_at: undefined,
      blocking_reason: undefined,
      completion_note: undefined,
      ai_run_id: undefined,
      is_demo: false,
      request_id: rid,
    });
    await appendTaskEvent(base44, {
      organizationId: access.organizationId,
      incidentId: incident.id,
      taskId: task.id,
      eventType: 'task_created',
      message: `Task ${title} was created.`,
      actorUserId: access.user.id,
      metadata: { task_id: task.id, task_title: title, priority, request_id: rid },
      requestId: rid,
    });
    if (assigneeUserId) {
      await appendTaskEvent(base44, {
        organizationId: access.organizationId,
        incidentId: incident.id,
        taskId: task.id,
        eventType: 'task_assigned',
        message: `Task ${title} was assigned.`,
        actorUserId: access.user.id,
        metadata: { task_id: task.id, task_title: title, assignee_user_id: assigneeUserId, request_id: rid },
        requestId: rid,
      });
    }
    return json({ task: safeTask(task) }, 201);
  } catch (error) {
    return failure(error);
  }
});

