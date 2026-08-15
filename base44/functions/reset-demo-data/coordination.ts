export const json = (body: Record<string, unknown>, status = 200) => Response.json(body, { status });
export const clean = (value: unknown, max = 5000) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
export const slugify = (value: string) => clean(value, 120).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'signalfold';
export const requestId = (value: unknown) => {
  const id = clean(value, 128);
  return /^[A-Za-z0-9_-]{8,128}$/.test(id) ? id : null;
};
export const failure = (error: unknown) => {
  const value = error as { code?: string; status?: number };
  return json({ error: value.code ?? 'UNKNOWN' }, value.status ?? 500);
};

export async function authorizeActiveMembership(base44: any, organizationId: unknown, requireAdmin = false) {
  const user = await base44.auth.me();
  if (!user) throw { code: 'UNAUTHENTICATED', status: 401 };
  const id = clean(organizationId, 128);
  if (!id) throw { code: 'VALIDATION_FAILED', status: 400 };
  const memberships = await base44.asServiceRole.entities.Membership.filter({ organization_id: id, user_id: user.id, status: 'active' });
  const membership = memberships[0];
  if (!membership) throw { code: 'NOT_A_MEMBER', status: 403 };
  if (requireAdmin && membership.role !== 'admin' && membership.role !== 'incident_manager') throw { code: 'FORBIDDEN', status: 403 };
  return { user, membership, organizationId: id };
}

export const canonicalEventType = (value: unknown) => clean(value, 128).toLowerCase().replace(/[\s-]+/g, '_');
export const canonicalActivityIdentity = (record: { organizationId: string; incidentId: string; eventType: string; id: string }) =>
  record.eventType === 'incident_created' ? `${record.organizationId}:${record.incidentId}:incident_created` : `id:${record.id}`;

const read = (record: Record<string, unknown>, camel: string, snake: string) => String(record[camel] ?? record[snake] ?? '').trim();

export type SafeTask = {
  id: string;
  organizationId: string;
  incidentId: string;
  title: string;
  description?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'blocked' | 'done' | 'cancelled';
  assigneeUserId?: string;
  createdByUserId?: string;
  source: 'human' | 'ai' | 'system';
  orderIndex: number;
  dueAt?: string;
  claimedAt?: string;
  completedAt?: string;
  blockingReason?: string;
  completionNote?: string;
  aiRunId?: string;
  createdAt?: string;
  updatedAt?: string;
  isDemo: boolean;
};

export type SafeTimelineUpdate = {
  id: string;
  organizationId: string;
  incidentId: string;
  eventType: string;
  actorUserId?: string;
  actorType: 'user' | 'system' | 'ai';
  visibility: 'internal' | 'public';
  message: string;
  occurredAt: string;
  isDemo: boolean;
  requestId?: string;
  metadata?: Record<string, unknown>;
};

export const safeTask = (record: Record<string, unknown>): SafeTask => ({
  id: String(record.id),
  organizationId: String(record.organization_id),
  incidentId: String(record.incident_id),
  title: String(record.title),
  description: typeof record.description === 'string' ? record.description : undefined,
  priority: String(record.priority) as SafeTask['priority'],
  status: String(record.status) as SafeTask['status'],
  assigneeUserId: typeof record.assignee_user_id === 'string' && record.assignee_user_id.trim() ? record.assignee_user_id : undefined,
  createdByUserId: typeof record.created_by_user_id === 'string' && record.created_by_user_id.trim() ? record.created_by_user_id : undefined,
  source: String(record.source) as SafeTask['source'],
  orderIndex: Number(record.order_index ?? 0),
  dueAt: typeof record.due_at === 'string' && record.due_at.trim() ? record.due_at : undefined,
  claimedAt: typeof record.claimed_at === 'string' && record.claimed_at.trim() ? record.claimed_at : undefined,
  completedAt: typeof record.completed_at === 'string' && record.completed_at.trim() ? record.completed_at : undefined,
  blockingReason: typeof record.blocking_reason === 'string' ? record.blocking_reason : undefined,
  completionNote: typeof record.completion_note === 'string' ? record.completion_note : undefined,
  aiRunId: typeof record.ai_run_id === 'string' ? record.ai_run_id : undefined,
  createdAt: typeof record.created_date === 'string' ? record.created_date : undefined,
  updatedAt: typeof record.updated_date === 'string' ? record.updated_date : undefined,
  isDemo: record.is_demo === true,
});

export const safeTimelineUpdate = (record: Record<string, unknown>): SafeTimelineUpdate => ({
  id: String(record.id),
  organizationId: read(record, 'organizationId', 'organization_id'),
  incidentId: read(record, 'incidentId', 'incident_id'),
  eventType: canonicalEventType(record.eventType ?? record.event_type),
  actorUserId: read(record, 'actorUserId', 'actor_user_id') || undefined,
  actorType: (read(record, 'actorType', 'actor_type') || 'system') as SafeTimelineUpdate['actorType'],
  visibility: (read(record, 'visibility', 'visibility') || 'internal') as SafeTimelineUpdate['visibility'],
  message: read(record, 'message', 'message'),
  occurredAt: read(record, 'occurredAt', 'occurred_at'),
  isDemo: record.isDemo === true || record.is_demo === true,
  requestId: read(record, 'requestId', 'request_id') || undefined,
  metadata: record.metadata && typeof record.metadata === 'object' ? (record.metadata as Record<string, unknown>) : undefined,
});

export const taskPriorityOrder: Record<SafeTask['priority'], number> = { critical: 0, high: 1, medium: 2, low: 3 };
export const taskStatusOrder: Record<SafeTask['status'], number> = { todo: 0, in_progress: 1, blocked: 2, done: 3, cancelled: 4 };

export function sortTasks(tasks: SafeTask[]) {
  return [...tasks].sort((a, b) =>
    taskStatusOrder[a.status] - taskStatusOrder[b.status] ||
    taskPriorityOrder[a.priority] - taskPriorityOrder[b.priority] ||
    a.orderIndex - b.orderIndex ||
    Date.parse(a.createdAt ?? '') - Date.parse(b.createdAt ?? '') ||
    a.id.localeCompare(b.id),
  );
}

export function taskSummary(tasks: SafeTask[]) {
  const active = tasks.filter(task => !['done', 'cancelled'].includes(task.status));
  const overdue = active.filter(task => task.dueAt && Date.parse(task.dueAt) < Date.now()).length;
  const criticalOpen = active.filter(task => task.priority === 'critical').length;
  return {
    total: tasks.length,
    todo: tasks.filter(task => task.status === 'todo').length,
    inProgress: tasks.filter(task => task.status === 'in_progress').length,
    blocked: tasks.filter(task => task.status === 'blocked').length,
    done: tasks.filter(task => task.status === 'done').length,
    cancelled: tasks.filter(task => task.status === 'cancelled').length,
    criticalOpen,
    overdue,
    unassigned: active.filter(task => !task.assigneeUserId).length,
  };
}

export function memberTaskSummary(member: { membershipId: string; userId: string; displayName?: string; email?: string; displayTitle?: string; role: string; status: string; joinedAt?: string }, tasks: SafeTask[]) {
  const mine = tasks.filter(task => task.assigneeUserId === member.userId && !['done', 'cancelled'].includes(task.status));
  return {
    ...member,
    total: mine.length,
    todo: mine.filter(task => task.status === 'todo').length,
    inProgress: mine.filter(task => task.status === 'in_progress').length,
    blocked: mine.filter(task => task.status === 'blocked').length,
    criticalOpen: mine.filter(task => task.priority === 'critical').length,
    open: mine.length,
  };
}

export async function loadActiveMembers(base44: any, organizationId: string) {
  const memberships = await base44.asServiceRole.entities.Membership.filter({ organization_id: organizationId });
  const members = await Promise.all(memberships.map(async (membership: any) => {
    const user = await base44.asServiceRole.entities.User.get(membership.user_id);
    return {
      membershipId: membership.id,
      userId: membership.user_id,
      displayName: user?.full_name ?? undefined,
      email: user?.email ?? undefined,
      displayTitle: membership.display_title ?? undefined,
      role: membership.role,
      status: membership.status,
      joinedAt: membership.joined_at ?? undefined,
    };
  }));
  return members.filter((member: { status: string }) => member.status === 'active');
}

export async function loadIncidentTasks(base44: any, organizationId: string, incidentId: string, filters: {
  status?: string[];
  assigneeUserId?: string;
  priority?: string[];
  includeCancelled?: boolean;
}) {
  const rows = await base44.asServiceRole.entities.IncidentTask.filter({ organization_id: organizationId, incident_id: incidentId }) as Record<string, unknown>[];
  const tasks: SafeTask[] = rows.map((row: Record<string, unknown>) => safeTask(row));
  const filtered = tasks.filter((task: SafeTask) => {
    if (!filters.includeCancelled && task.status === 'cancelled') return false;
    if (filters.status?.length && !filters.status.includes(task.status)) return false;
    if (filters.assigneeUserId && task.assigneeUserId !== filters.assigneeUserId) return false;
    if (filters.priority?.length && !filters.priority.includes(task.priority)) return false;
    return true;
  });
  return { tasks: sortTasks(filtered), summary: taskSummary(filtered), nextCursor: null as string | null };
}

export async function loadIncidentTimeline(base44: any, organizationId: string, incidentId: string, direction: 'desc' | 'asc' = 'desc') {
  const rows = await base44.asServiceRole.entities.IncidentUpdate.filter({ organization_id: organizationId, incident_id: incidentId });
  const normalized = rows.map((row: Record<string, unknown>) => safeTimelineUpdate(row)).filter((row: SafeTimelineUpdate) => row.organizationId === organizationId && row.incidentId === incidentId && row.eventType);
  const byIdentity = new Map<string, SafeTimelineUpdate>();
  for (const row of normalized) {
    const key = canonicalActivityIdentity({ organizationId: row.organizationId, incidentId: row.incidentId, eventType: row.eventType, id: row.id });
    if (!byIdentity.has(key)) byIdentity.set(key, row);
  }
  const items = [...byIdentity.values()].sort((a, b) => direction === 'asc'
    ? Date.parse(a.occurredAt) - Date.parse(b.occurredAt) || a.id.localeCompare(b.id)
    : Date.parse(b.occurredAt) - Date.parse(a.occurredAt) || a.id.localeCompare(b.id));
  return { items, nextCursor: null as string | null, direction };
}
