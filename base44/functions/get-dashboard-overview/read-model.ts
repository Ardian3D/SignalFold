import { canonicalActivityIdentity, loadActiveMembers, safeTimelineUpdate, taskSummary } from './coordination.ts';

const field = (record: any, camel: string, snake: string) => String(record?.[camel] ?? record?.[snake] ?? '').trim();
const eventType = (record: any) => field(record, 'eventType', 'event_type').toLowerCase().replace(/[\s-]+/g, '_');
const task = (record: any) => ({
  id: String(record.id),
  organizationId: String(record.organization_id),
  incidentId: String(record.incident_id),
  title: String(record.title),
  description: typeof record.description === 'string' ? record.description : undefined,
  priority: String(record.priority),
  status: String(record.status),
  assigneeUserId: typeof record.assignee_user_id === 'string' && record.assignee_user_id.trim() ? record.assignee_user_id : undefined,
  createdByUserId: typeof record.created_by_user_id === 'string' && record.created_by_user_id.trim() ? record.created_by_user_id : undefined,
  source: String(record.source),
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

export const normalizeActivity = (record: any) => ({
  id: field(record, 'id', 'id'),
  organizationId: field(record, 'organizationId', 'organization_id'),
  incidentId: field(record, 'incidentId', 'incident_id'),
  eventType: eventType(record),
  actorType: field(record, 'actorType', 'actor_type') || 'system',
  visibility: field(record, 'visibility', 'visibility') || 'internal',
  message: field(record, 'message', 'message'),
  occurredAt: field(record, 'occurredAt', 'occurred_at'),
  isDemo: record.isDemo === true || record.is_demo === true,
  requestId: field(record, 'requestId', 'request_id') || undefined,
});

export const projectActivity = (records: any[], limit = 20) => {
  const normalized = records
    .map(normalizeActivity)
    .filter((item) => item.id && item.organizationId && item.incidentId && item.eventType && item.occurredAt)
    .sort((a, b) => Date.parse(a.occurredAt) - Date.parse(b.occurredAt) || a.id.localeCompare(b.id));

  const seen = new Map<string, any>();
  for (const item of normalized) {
    const identity = canonicalActivityIdentity({ organizationId: item.organizationId, incidentId: item.incidentId, eventType: item.eventType, id: item.id });
    if (!seen.has(identity)) seen.set(identity, item);
  }

  return [...seen.values()]
    .sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt) || a.id.localeCompare(b.id))
    .slice(0, limit);
};

export async function loadDashboardReadModel(base44: any, organizationId: string) {
  const incidents = await base44.asServiceRole.entities.Incident.filter({ organization_id: organizationId }, '-reported_at', 200, 0);
  const services = await base44.asServiceRole.entities.Service.filter({ organization_id: organizationId });
  const rawUpdates = await base44.asServiceRole.entities.IncidentUpdate.filter({ organization_id: organizationId }, '-occurred_at', 200, 0);
  const taskRows = await base44.asServiceRole.entities.IncidentTask.filter({ organization_id: organizationId }, '-created_date', 200, 0);
  const tasks = taskRows.map(task);
  const members = await loadActiveMembers(base44, organizationId);
  const summary = taskSummary(tasks);
  const teamLoad = members.map((member) => ({
    ...member,
    ...(() => {
      const mine = tasks.filter((item: any) => item.assigneeUserId === member.userId && !['done', 'cancelled'].includes(item.status));
      return {
        total: mine.length,
        todo: mine.filter((item: any) => item.status === 'todo').length,
        inProgress: mine.filter((item: any) => item.status === 'in_progress').length,
        blocked: mine.filter((item: any) => item.status === 'blocked').length,
        done: mine.filter((item: any) => item.status === 'done').length,
        cancelled: mine.filter((item: any) => item.status === 'cancelled').length,
        criticalOpen: mine.filter((item: any) => item.priority === 'critical').length,
        overdue: mine.filter((item: any) => item.dueAt && Date.parse(item.dueAt) < Date.now()).length,
        unassigned: summary.unassigned,
      };
    })(),
  }));
  return {
    incidents,
    services,
    rawUpdates,
    tasks,
    teamLoad,
    activity: projectActivity(rawUpdates, 20),
    taskSummary: summary,
  };
}
