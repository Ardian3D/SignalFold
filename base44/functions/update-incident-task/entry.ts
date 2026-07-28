import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, clean, failure, json, requestId, safeTask } from './coordination.ts';
import { appendTaskEvent, canUseTaskRole, loadTaskById } from './task-workflow.ts';

const priorities = ['critical', 'high', 'medium', 'low'] as const;
const statuses = ['todo', 'in_progress', 'blocked', 'done', 'cancelled'] as const;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorizeActiveMembership(base44, input.organizationId);
    const task = await loadTaskById(base44, access.organizationId, input.incidentId, input.taskId);
    const rid = requestId(input.requestId);
    if (!rid) throw { code: 'VALIDATION_FAILED', status: 400 };
    const isManager = ['incident_manager', 'admin'].includes(access.membership.role);
    const isOwner = task.assignee_user_id === access.user.id;
    if (!isManager && !isOwner) throw { code: 'TASK_NOT_OWNED', status: 403 };
    if (!isManager && !canUseTaskRole(access.membership.role, 'claim')) throw { code: 'TASK_UPDATE_FORBIDDEN', status: 403 };
    if (['done', 'cancelled'].includes(task.status) && input.status && input.status !== task.status) throw { code: 'TASK_TERMINAL', status: 400 };
    const changes: Record<string, unknown> = {};
    const metadata: Record<string, unknown> = { request_id: rid, task_id: task.id, task_title: task.title };
    let eventType: string | null = null;

    if (input.title !== undefined) {
      if (!isManager) throw { code: 'TASK_UPDATE_FORBIDDEN', status: 403 };
      const title = clean(input.title, 160);
      if (title.length < 3) throw { code: 'VALIDATION_FAILED', status: 400 };
      changes.title = title;
    }
    if (input.description !== undefined) {
      if (!isManager) throw { code: 'TASK_UPDATE_FORBIDDEN', status: 403 };
      changes.description = clean(input.description, 2000) || undefined;
    }
    if (input.priority !== undefined) {
      if (!isManager) throw { code: 'TASK_UPDATE_FORBIDDEN', status: 403 };
      if (!priorities.includes(input.priority)) throw { code: 'VALIDATION_FAILED', status: 400 };
      changes.priority = input.priority;
    }
    if (input.dueAt !== undefined) {
      if (!isManager) throw { code: 'TASK_UPDATE_FORBIDDEN', status: 403 };
      if (input.dueAt && Number.isNaN(Date.parse(input.dueAt))) throw { code: 'VALIDATION_FAILED', status: 400 };
      changes.due_at = input.dueAt || null;
    }

    const currentStatus = task.status;
    const requestedStatus = input.status as typeof statuses[number] | undefined;
    if (requestedStatus && requestedStatus !== currentStatus) {
      if (!statuses.includes(requestedStatus)) throw { code: 'INVALID_TASK_TRANSITION', status: 400 };
      if (requestedStatus === 'cancelled' && !isManager) throw { code: 'TASK_UPDATE_FORBIDDEN', status: 403 };
      if (requestedStatus === 'blocked') {
        const reason = clean(input.blockingReason, 1000);
        if (reason.length < 3) throw { code: 'BLOCKING_REASON_REQUIRED', status: 400 };
        changes.blocking_reason = reason;
        changes.completed_at = null;
        changes.status = 'blocked';
        metadata.blocking_reason = reason;
        eventType = 'task_blocked';
      } else if (currentStatus === 'blocked' && requestedStatus !== 'blocked') {
        changes.blocking_reason = null;
        changes.status = requestedStatus;
        if (requestedStatus === 'done') {
          if (task.priority === 'critical' && input.confirmCriticalCompletion !== true) throw { code: 'CRITICAL_TASK_CONFIRMATION_REQUIRED', status: 400 };
          changes.completed_at = new Date().toISOString();
          eventType = 'task_completed';
        } else if (requestedStatus === 'in_progress') {
          eventType = 'task_unblocked';
        } else {
          eventType = 'task_updated';
        }
      } else if (requestedStatus === 'done') {
        if (task.priority === 'critical' && input.confirmCriticalCompletion !== true) throw { code: 'CRITICAL_TASK_CONFIRMATION_REQUIRED', status: 400 };
        if (!isOwner && !isManager) throw { code: 'TASK_UPDATE_FORBIDDEN', status: 403 };
        changes.completed_at = new Date().toISOString();
        changes.blocking_reason = null;
        changes.status = 'done';
        eventType = 'task_completed';
      } else if (requestedStatus === 'cancelled') {
        changes.status = 'cancelled';
        changes.completed_at = null;
        changes.blocking_reason = null;
        eventType = 'task_cancelled';
      } else {
        changes.status = requestedStatus;
        eventType = 'task_updated';
      }
    }

    if (input.completionNote !== undefined) {
      changes.completion_note = clean(input.completionNote, 2000) || null;
    }
    if (input.blockingReason !== undefined && requestedStatus !== 'blocked') {
      changes.blocking_reason = clean(input.blockingReason, 1000) || null;
      if (!eventType) eventType = 'task_updated';
      metadata.blocking_reason = changes.blocking_reason ?? undefined;
    }

    const hasMetadataChange = ['title', 'description', 'priority', 'due_at', 'completion_note'].some(field => field in changes);
    const updated = await base44.asServiceRole.entities.IncidentTask.update(task.id, changes);
    if (!eventType && hasMetadataChange) eventType = 'task_updated';
    if (eventType) {
      await appendTaskEvent(base44, {
        organizationId: access.organizationId,
        incidentId: input.incidentId,
        taskId: task.id,
        eventType,
        message: eventType === 'task_completed'
          ? `Task ${updated.title} was completed.`
          : eventType === 'task_blocked'
            ? `Task ${updated.title} was blocked.`
            : eventType === 'task_cancelled'
              ? `Task ${updated.title} was cancelled.`
              : `Task ${updated.title} was updated.`,
        actorUserId: access.user.id,
        metadata,
        requestId: rid,
      });
    }
    return json({ task: safeTask(updated) });
  } catch (error) {
    return failure(error);
  }
});

