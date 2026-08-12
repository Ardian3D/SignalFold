import { clean, requestId, safeTimelineUpdate } from './coordination.ts';

export const authorityRoles = new Set(['incident_manager', 'admin']);
export const commanderRoles = new Set(['incident_manager', 'admin']);
export const severities = new Set(['SEV1', 'SEV2', 'SEV3', 'SEV4']);
export const statuses = new Set(['reported', 'triaging', 'investigating', 'identified', 'monitoring', 'resolved', 'closed']);
export const resolvableStatuses = new Set(['investigating', 'identified', 'monitoring']);
export const rootCauseValues = new Set(['yes', 'no', 'unknown']);

export const transitions: Record<string, string[]> = {
  reported: ['triaging', 'investigating', 'closed'],
  triaging: ['investigating', 'identified', 'closed'],
  investigating: ['identified', 'monitoring'],
  identified: ['investigating', 'monitoring'],
  monitoring: ['investigating'],
  resolved: ['closed'],
  closed: [],
};

export function canMutateIncidentAuthority(role: string) {
  return authorityRoles.has(role);
}

export function isAllowedTransition(from: string, to: string) {
  if (from === 'resolved' && to === 'investigating') return false;
  return (transitions[from] ?? []).includes(to);
}

export function safeIncidentAuthority(record: any) {
  return {
    id: record.id,
    organization_id: record.organization_id,
    code: record.code,
    title: record.title,
    description: record.description,
    source: record.source,
    service_id: record.service_id,
    reporter_user_id: record.reporter_user_id,
    commander_user_id: record.commander_user_id || undefined,
    severity: record.severity,
    severity_source: record.severity_source,
    status: record.status,
    category: record.category,
    impact_summary: record.impact_summary,
    affected_users_estimate: record.affected_users_estimate,
    observed_start_at: record.observed_start_at,
    reported_at: record.reported_at,
    acknowledged_at: record.acknowledged_at,
    resolved_at: record.resolved_at,
    closed_at: record.closed_at,
    resolution_summary: record.resolution_summary,
    root_cause_known: record.root_cause_known,
    recovery_verified: record.recovery_verified === true,
    remaining_risk: record.remaining_risk,
    resolution_override_reason: record.resolution_override_reason,
    ai_summary: record.ai_summary,
    ai_confidence: record.ai_confidence,
    ai_risk_flags: record.ai_risk_flags,
    ai_analysis_version: record.ai_analysis_version,
    ai_last_analyzed_at: record.ai_last_analyzed_at,
    public_visibility: record.public_visibility,
    is_demo: record.is_demo === true,
    reopened_count: Number(record.reopened_count ?? 0),
    created_date: record.created_date,
    updated_date: record.updated_date,
  };
}

export async function appendAuthorityEvent(base44: any, params: {
  organizationId: string;
  incidentId: string;
  eventType: string;
  message: string;
  actorUserId?: string;
  metadata?: Record<string, unknown>;
  isDemo?: boolean;
  requestId?: string;
}) {
  const rid = params.requestId ? requestId(params.requestId) : null;
  if (rid) {
    const existing = await base44.asServiceRole.entities.IncidentUpdate.filter({
      organization_id: params.organizationId,
      incident_id: params.incidentId,
      request_id: rid,
      event_type: params.eventType,
    });
    if (existing[0]) return safeTimelineUpdate(existing[0]);
  }
  const record = await base44.asServiceRole.entities.IncidentUpdate.create({
    organization_id: params.organizationId,
    incident_id: params.incidentId,
    event_type: params.eventType,
    actor_user_id: params.actorUserId,
    actor_type: 'user',
    visibility: 'internal',
    message: clean(params.message, 1000),
    metadata: params.metadata ?? {},
    occurred_at: new Date().toISOString(),
    is_demo: params.isDemo === true,
    request_id: rid ?? undefined,
  });
  return safeTimelineUpdate(record);
}

export async function countOpenCriticalTasks(base44: any, organizationId: string, incidentId: string) {
  const tasks = await base44.asServiceRole.entities.IncidentTask.filter({
    organization_id: organizationId,
    incident_id: incidentId,
    priority: 'critical',
  });
  return tasks.filter((task: any) => ['todo', 'in_progress', 'blocked'].includes(String(task.status))).length;
}

export async function loadIncidentForOrg(base44: any, organizationId: string, incidentId: string) {
  const incident = await base44.asServiceRole.entities.Incident.get(incidentId);
  if (!incident || incident.organization_id !== organizationId) throw { code: 'INCIDENT_NOT_FOUND', status: 404 };
  return incident;
}

export async function resolveCommanderCandidate(base44: any, organizationId: string, commanderUserId: string | null) {
  if (!commanderUserId) return null;
  const memberships = await base44.asServiceRole.entities.Membership.filter({
    organization_id: organizationId,
    user_id: commanderUserId,
    status: 'active',
  });
  const membership = memberships[0];
  if (!membership) throw { code: 'COMMANDER_NOT_ACTIVE', status: 400 };
  if (!commanderRoles.has(String(membership.role))) throw { code: 'COMMANDER_ROLE_INVALID', status: 400 };
  return commanderUserId;
}
