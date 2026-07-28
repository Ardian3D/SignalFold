import { canonicalEventType, clean, loadActiveMembers, requestId, safeTask, safeTimelineUpdate } from './coordination.ts';

export const taskRoles = {
  create: new Set(['responder', 'incident_manager', 'admin']),
  claim: new Set(['responder', 'incident_manager', 'admin']),
  note: new Set(['reporter', 'responder', 'incident_manager', 'admin']),
  assign: new Set(['incident_manager', 'admin']),
};

export function canUseTaskRole(role: string, action: keyof typeof taskRoles) {
  return taskRoles[action].has(role);
}

export async function loadTaskById(base44: any, organizationId: string, incidentId: string, taskId: string) {
  const task = await base44.asServiceRole.entities.IncidentTask.get(taskId);
  if (!task || task.organization_id !== organizationId || task.incident_id !== incidentId) throw { code: 'TASK_NOT_FOUND', status: 404 };
  return task;
}

export async function appendTaskEvent(base44: any, params: {
  organizationId: string;
  incidentId: string;
  taskId: string;
  eventType: string;
  message: string;
  actorUserId?: string;
  metadata?: Record<string, unknown>;
  isDemo?: boolean;
  requestId?: string;
  visibility?: 'internal' | 'public';
  actorType?: 'user' | 'system' | 'ai';
}) {
  const normalizedEventType = canonicalEventType(params.eventType);
  const rid = params.requestId ? requestId(params.requestId) : null;
  if (rid) {
    const existing = await base44.asServiceRole.entities.IncidentUpdate.filter({ organization_id: params.organizationId, incident_id: params.incidentId, request_id: rid, event_type: normalizedEventType });
    if (existing[0]) return safeTimelineUpdate(existing[0]);
  }
  const record = await base44.asServiceRole.entities.IncidentUpdate.create({
    organization_id: params.organizationId,
    incident_id: params.incidentId,
    event_type: normalizedEventType,
    actor_user_id: params.actorUserId,
    actor_type: params.actorType ?? 'user',
    visibility: params.visibility ?? 'internal',
    message: clean(params.message, 1000),
    metadata: params.metadata ?? {},
    occurred_at: new Date().toISOString(),
    is_demo: params.isDemo === true,
    request_id: rid ?? undefined,
  });
  return safeTimelineUpdate(record);
}

export async function resolveTaskAssignee(base44: any, organizationId: string, assigneeUserId: string | null | undefined) {
  if (!assigneeUserId) return null;
  const members = await loadActiveMembers(base44, organizationId);
  const member = members.find((item) => item.userId === assigneeUserId);
  if (!member) throw { code: 'ASSIGNEE_NOT_ACTIVE', status: 400 };
  return assigneeUserId;
}

export function normalizeTaskRows(rows: any[]) {
  return rows.map((row) => safeTask(row));
}
