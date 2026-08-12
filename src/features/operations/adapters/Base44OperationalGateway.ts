import { getBase44Client } from '@/integrations/base44/client';
import { getBase44RuntimeConfig } from '@/integrations/base44/config';
import type { DashboardOverview } from '@/features/dashboard/domain/dashboardTypes';
import type { Incident, IncidentCreateInput, IncidentFilters, IncidentUpdate } from '@/features/incidents/domain/incidentTypes';
import type { Service, ServiceInput } from '@/features/services/domain/serviceTypes';
import type { IncidentTask, IncidentTaskFilters, TaskSummary } from '@/features/tasks/domain/taskTypes';
import type { IncidentTimeline } from '@/features/timeline/domain/timelineTypes';
import type { SafeOrganizationMember } from '@/features/organization/domain/organizationTypes';
import type { IncidentReadModel, OperationalGateway } from '../ports/OperationalGateway';
import type { AiSuggestion, AnalyzeIncidentInput, AnalyzeIncidentResult, ApplyIncidentAnalysisInput, ApplyIncidentAnalysisResult } from '@/features/incidents/domain/incidentAiTypes';
import type { IncidentRealtimeEvent, IncidentRealtimeScope, RealtimeChangeType } from '../domain/realtimeTypes';

const unwrap = (value: unknown): unknown => value && typeof value === 'object' && 'data' in value ? (value as { data: unknown }).data : value;
const invoke = async (name: string, input: Record<string, unknown>) => {
  const client = getBase44Client(getBase44RuntimeConfig());
  if (!client) throw new Error('SERVICE_UNAVAILABLE');
  return unwrap(await client.functions.invoke(name as never, input)) as Record<string, unknown>;
};

const text = (record: Record<string, unknown>, camel: string, snake: string) => String(record[camel] ?? record[snake] ?? '').trim();
const bool = (record: Record<string, unknown>, camel: string, snake: string) => record[camel] === true || record[snake] === true;

export const projectService = (record: Record<string, unknown>): Service => ({
  id: String(record.id),
  organizationId: String(record.organization_id ?? record.organizationId),
  name: String(record.name),
  slug: String(record.slug),
  description: typeof record.description === 'string' ? record.description : undefined,
  criticality: (record.criticality ?? record.criticality) as Service['criticality'],
  operationalStatus: (record.operational_status ?? record.operationalStatus) as Service['operationalStatus'],
  ownerUserId: typeof (record.owner_user_id ?? record.ownerUserId) === 'string' ? String(record.owner_user_id ?? record.ownerUserId) : undefined,
  tags: Array.isArray(record.tags) ? record.tags.map(String) : [],
  isActive: bool(record, 'isActive', 'is_active'),
  isDemo: bool(record, 'isDemo', 'is_demo'),
  createdAt: typeof (record.created_date ?? record.createdAt) === 'string' ? String(record.created_date ?? record.createdAt) : undefined,
  updatedAt: typeof (record.updated_date ?? record.updatedAt) === 'string' ? String(record.updated_date ?? record.updatedAt) : undefined,
});

export const projectIncident = (record: Record<string, unknown>): Incident => {
  const riskFlagsValue = record.ai_risk_flags ?? record.aiRiskFlags;
  const riskFlags: string[] = Array.isArray(riskFlagsValue) ? (riskFlagsValue as unknown[]).map((value: unknown) => String(value)) : [];
  return {
    id: String(record.id),
    organizationId: String(record.organization_id ?? record.organizationId),
    code: String(record.code),
    title: String(record.title),
    description: String(record.description),
    source: (record.source ?? record.source) as Incident['source'],
    serviceId: typeof (record.service_id ?? record.serviceId) === 'string' ? String(record.service_id ?? record.serviceId) : undefined,
    reporterUserId: String(record.reporter_user_id ?? record.reporterUserId),
  commanderUserId: typeof (record.commander_user_id ?? record.commanderUserId) === 'string' ? String(record.commander_user_id ?? record.commanderUserId) : undefined,
  severity: (record.severity ?? record.severity) as Incident['severity'],
  severitySource: (record.severity_source ?? record.severitySource) as Incident['severitySource'],
  status: (record.status ?? record.status) as Incident['status'],
  category: typeof (record.category ?? record.category) === 'string' ? String(record.category ?? record.category) as Incident['category'] : undefined,
  impactSummary: typeof (record.impact_summary ?? record.impactSummary) === 'string' ? String(record.impact_summary ?? record.impactSummary) : undefined,
  affectedUsersEstimate: typeof (record.affected_users_estimate ?? record.affectedUsersEstimate) === 'number' ? Number(record.affected_users_estimate ?? record.affectedUsersEstimate) : undefined,
  observedStartAt: typeof (record.observed_start_at ?? record.observedStartAt) === 'string' ? String(record.observed_start_at ?? record.observedStartAt) : undefined,
  reportedAt: String(record.reported_at ?? record.reportedAt),
  acknowledgedAt: typeof (record.acknowledged_at ?? record.acknowledgedAt) === 'string' ? String(record.acknowledged_at ?? record.acknowledgedAt) : undefined,
  resolvedAt: typeof (record.resolved_at ?? record.resolvedAt) === 'string' ? String(record.resolved_at ?? record.resolvedAt) : undefined,
  closedAt: typeof (record.closed_at ?? record.closedAt) === 'string' ? String(record.closed_at ?? record.closedAt) : undefined,
  recoveryVerified: bool(record, 'recoveryVerified', 'recovery_verified'),
  resolutionSummary: typeof (record.resolution_summary ?? record.resolutionSummary) === 'string' ? String(record.resolution_summary ?? record.resolutionSummary) : undefined,
  rootCauseKnown: typeof (record.root_cause_known ?? record.rootCauseKnown) === 'string' ? String(record.root_cause_known ?? record.rootCauseKnown) as Incident['rootCauseKnown'] : undefined,
  remainingRisk: typeof (record.remaining_risk ?? record.remainingRisk) === 'string' ? String(record.remaining_risk ?? record.remainingRisk) : undefined,
  resolutionOverrideReason: typeof (record.resolution_override_reason ?? record.resolutionOverrideReason) === 'string' && String(record.resolution_override_reason ?? record.resolutionOverrideReason).trim() ? String(record.resolution_override_reason ?? record.resolutionOverrideReason) : undefined,
  aiSummary: typeof (record.ai_summary ?? record.aiSummary) === 'string' ? String(record.ai_summary ?? record.aiSummary) : undefined,
  aiConfidence: typeof (record.ai_confidence ?? record.aiConfidence) === 'number' ? Number(record.ai_confidence ?? record.aiConfidence) : undefined,
  aiRiskFlags: riskFlags,
  aiAnalysisVersion: typeof (record.ai_analysis_version ?? record.aiAnalysisVersion) === 'string' ? String(record.ai_analysis_version ?? record.aiAnalysisVersion) : undefined,
  aiLastAnalyzedAt: typeof (record.ai_last_analyzed_at ?? record.aiLastAnalyzedAt) === 'string' ? String(record.ai_last_analyzed_at ?? record.aiLastAnalyzedAt) : undefined,
  publicVisibility: (record.public_visibility ?? record.publicVisibility) as Incident['publicVisibility'],
  isDemo: bool(record, 'isDemo', 'is_demo'),
  reopenedCount: Number(record.reopened_count ?? record.reopenedCount ?? 0),
  createdAt: typeof (record.created_date ?? record.createdAt) === 'string' ? String(record.created_date ?? record.createdAt) : undefined,
  updatedAt: typeof (record.updated_date ?? record.updatedAt) === 'string' ? String(record.updated_date ?? record.updatedAt) : undefined,
  };
};

export const projectTask = (record: Record<string, unknown>): IncidentTask => ({
  id: String(record.id),
  organizationId: String(record.organization_id ?? record.organizationId),
  incidentId: String(record.incident_id ?? record.incidentId),
  title: String(record.title),
  description: typeof record.description === 'string' ? record.description : undefined,
  priority: (record.priority ?? record.priority) as IncidentTask['priority'],
  status: (record.status ?? record.status) as IncidentTask['status'],
  assigneeUserId: typeof (record.assignee_user_id ?? record.assigneeUserId) === 'string' && String(record.assignee_user_id ?? record.assigneeUserId).trim() ? String(record.assignee_user_id ?? record.assigneeUserId) : undefined,
  createdByUserId: typeof (record.created_by_user_id ?? record.createdByUserId) === 'string' && String(record.created_by_user_id ?? record.createdByUserId).trim() ? String(record.created_by_user_id ?? record.createdByUserId) : undefined,
  source: (record.source ?? record.source) as IncidentTask['source'],
  orderIndex: Number(record.order_index ?? record.orderIndex ?? 0),
  dueAt: typeof (record.due_at ?? record.dueAt) === 'string' && String(record.due_at ?? record.dueAt).trim() ? String(record.due_at ?? record.dueAt) : undefined,
  claimedAt: typeof (record.claimed_at ?? record.claimedAt) === 'string' && String(record.claimed_at ?? record.claimedAt).trim() ? String(record.claimed_at ?? record.claimedAt) : undefined,
  completedAt: typeof (record.completed_at ?? record.completedAt) === 'string' && String(record.completed_at ?? record.completedAt).trim() ? String(record.completed_at ?? record.completedAt) : undefined,
  blockingReason: typeof (record.blocking_reason ?? record.blockingReason) === 'string' ? String(record.blocking_reason ?? record.blockingReason) : undefined,
  completionNote: typeof (record.completion_note ?? record.completionNote) === 'string' ? String(record.completion_note ?? record.completionNote) : undefined,
  aiRunId: typeof (record.ai_run_id ?? record.aiRunId) === 'string' ? String(record.ai_run_id ?? record.aiRunId) : undefined,
  createdAt: typeof (record.created_date ?? record.createdAt) === 'string' ? String(record.created_date ?? record.createdAt) : undefined,
  updatedAt: typeof (record.updated_date ?? record.updatedAt) === 'string' ? String(record.updated_date ?? record.updatedAt) : undefined,
  isDemo: bool(record, 'isDemo', 'is_demo'),
});

const projectUpdate = (record: Record<string, unknown>): IncidentUpdate => ({
  id: String(record.id),
  organizationId: String(record.organization_id ?? record.organizationId),
  incidentId: String(record.incident_id ?? record.incidentId),
  eventType: String(record.event_type ?? record.eventType),
  actorUserId: typeof (record.actor_user_id ?? record.actorUserId) === 'string' ? String(record.actor_user_id ?? record.actorUserId) : undefined,
  actorType: (record.actor_type ?? record.actorType) as IncidentUpdate['actorType'],
  visibility: (record.visibility ?? record.visibility) as IncidentUpdate['visibility'],
  message: String(record.message),
  occurredAt: String(record.occurred_at ?? record.occurredAt),
  isDemo: bool(record, 'isDemo', 'is_demo'),
  requestId: typeof (record.request_id ?? record.requestId) === 'string' ? String(record.request_id ?? record.requestId) : undefined,
  metadata: record.metadata && typeof record.metadata === 'object' ? (record.metadata as Record<string, unknown>) : undefined,
});

const projectMember = (record: Record<string, unknown>): SafeOrganizationMember => ({
  membershipId: String(record.membershipId ?? record.id ?? record.membership_id ?? ''),
  userId: String(record.userId ?? record.user_id ?? ''),
  displayName: typeof (record.displayName ?? record.display_name) === 'string' ? String(record.displayName ?? record.display_name) : undefined,
  email: typeof record.email === 'string' ? record.email : undefined,
  displayTitle: typeof (record.displayTitle ?? record.display_title) === 'string' ? String(record.displayTitle ?? record.display_title) : undefined,
  role: (record.role ?? record.role) as SafeOrganizationMember['role'],
  status: (record.status ?? record.status) as SafeOrganizationMember['status'],
  joinedAt: typeof (record.joinedAt ?? record.joined_at) === 'string' ? String(record.joinedAt ?? record.joined_at) : undefined,
});

const projectTaskSummary = (record: Record<string, unknown>): TaskSummary => ({
  total: Number(record.total ?? 0),
  todo: Number(record.todo ?? 0),
  inProgress: Number(record.inProgress ?? record.in_progress ?? 0),
  blocked: Number(record.blocked ?? 0),
  done: Number(record.done ?? 0),
  cancelled: Number(record.cancelled ?? 0),
  criticalOpen: Number(record.criticalOpen ?? record.critical_open ?? 0),
  overdue: Number(record.overdue ?? 0),
  unassigned: Number(record.unassigned ?? 0),
});

const projectTeamLoad = (record: Record<string, unknown>): SafeOrganizationMember & TaskSummary => ({
  ...projectMember(record),
  ...projectTaskSummary(record),
});

const projectTimeline = (record: Record<string, unknown>): IncidentUpdate => projectUpdate(record);

const projectAssignmentOptions = (records: unknown[]) => records.map(item => projectMember(item as Record<string, unknown>));

const projectAiSuggestion = (record: Record<string, unknown>): AiSuggestion => {
  const analysis = record.analysis && typeof record.analysis === 'object' ? record.analysis as Record<string, unknown> : null;
  const review = record.review && typeof record.review === 'object' ? record.review as Record<string, unknown> : {};
  return {
    aiRunId: String(record.aiRunId ?? record.ai_run_id ?? ''),
    analysis: projectAiAnalysis(analysis),
    review: {
      status: (review.status === 'applied' ? 'applied' : 'pending'),
      reviewedAt: typeof review.reviewedAt === 'string' ? review.reviewedAt : undefined,
      wasEdited: review.wasEdited === true,
      appliedTaskCount: typeof review.appliedTaskCount === 'number' ? review.appliedTaskCount : undefined,
      severityChanged: review.severityChanged === true,
      statusChanged: review.statusChanged === true,
    },
    model: String(record.model ?? ''),
    promptVersion: String(record.promptVersion ?? record.prompt_version ?? ''),
    generatedAt: String(record.generatedAt ?? record.generated_at ?? ''),
    confidence: Number(record.confidence ?? analysis?.confidence ?? 0),
  };
};

const projectAiAnalysis = (analysis: Record<string, unknown> | null): AiSuggestion['analysis'] => {
  const riskFlagsValue = analysis?.riskFlags ?? analysis?.risk_flags;
  const questionsValue = analysis?.clarifyingQuestions ?? analysis?.clarifying_questions;
  const tasksValue = analysis?.recommendedTasks ?? analysis?.recommended_tasks;
  const riskFlags: AiSuggestion['analysis']['riskFlags'] = Array.isArray(riskFlagsValue) ? (riskFlagsValue as unknown[]).map((value: unknown) => String(value) as AiSuggestion['analysis']['riskFlags'][number]) : [];
  const clarifyingQuestions: string[] = Array.isArray(questionsValue) ? (questionsValue as unknown[]).map((value: unknown) => String(value)) : [];
  const recommendedTasks: AiSuggestion['analysis']['recommendedTasks'] = Array.isArray(tasksValue) ? (tasksValue as Record<string, unknown>[]).map((item: Record<string, unknown>) => ({ title: String(item.title ?? ''), description: String(item.description ?? ''), priority: (item.priority ?? 'medium') as AiSuggestion['analysis']['recommendedTasks'][number]['priority'] })) : [];
  return {
    summary: String(analysis?.summary ?? ''),
    severitySuggestion: (analysis?.severitySuggestion ?? analysis?.severity_suggestion ?? 'SEV3') as AiSuggestion['analysis']['severitySuggestion'],
    category: (analysis?.category ?? 'unknown') as AiSuggestion['analysis']['category'],
    impact: String(analysis?.impact ?? ''),
    confidence: Number(analysis?.confidence ?? 0),
    riskFlags,
    clarifyingQuestions,
    recommendedTasks,
    immediateNextAction: String(analysis?.immediateNextAction ?? analysis?.immediate_next_action ?? ''),
  };
};

export class Base44OperationalGateway implements OperationalGateway {
  async listServices(organizationId: string, includeInactive = false) {
    const result = await invoke('list-services', { organizationId, includeInactive });
    return ((result.services ?? []) as Record<string, unknown>[]).map(projectService);
  }

  async createService(organizationId: string, input: ServiceInput) {
    return projectService((await invoke('create-service', { organizationId, ...input })).service as Record<string, unknown>);
  }

  async updateService(organizationId: string, serviceId: string, input: Partial<ServiceInput> & { isActive?: boolean; requestId: string }) {
    return projectService((await invoke('update-service', { organizationId, serviceId, ...input })).service as Record<string, unknown>);
  }

  async listIncidents(organizationId: string, filters: IncidentFilters = {}) {
    const result = await invoke('list-incidents', { organizationId, ...filters });
    return { incidents: ((result.incidents ?? []) as Record<string, unknown>[]).map(projectIncident), nextCursor: typeof result.nextCursor === 'string' ? result.nextCursor : null };
  }

  async getIncident(organizationId: string, incidentId: string): Promise<IncidentReadModel> {
    const result = await invoke('get-incident', { organizationId, incidentId });
    const authority = result.authority && typeof result.authority === 'object' ? result.authority as Record<string, unknown> : null;
    return {
      incident: projectIncident(result.incident as Record<string, unknown>),
      service: result.service ? projectService(result.service as Record<string, unknown>) : null,
      updates: ((result.updates ?? result.timeline ?? []) as Record<string, unknown>[]).map(projectUpdate),
      tasks: ((result.tasks ?? []) as Record<string, unknown>[]).map(projectTask),
      taskSummary: projectTaskSummary(result.taskSummary as Record<string, unknown> ?? {}),
      timeline: ((result.timeline ?? result.updates ?? []) as Record<string, unknown>[]).map(projectTimeline),
      assignmentOptions: projectAssignmentOptions((result.assignmentOptions ?? []) as unknown[]),
      commanderOptions: projectAssignmentOptions((result.commanderOptions ?? result.assignmentOptions ?? []) as unknown[]),
      openCriticalTaskCount: Number(result.openCriticalTaskCount ?? 0),
      allowedTransitions: Array.isArray(result.allowedTransitions) ? result.allowedTransitions.map(String) as Incident['status'][] : [],
      authority: authority ? {
        canChangeStatus: authority.canChangeStatus === true,
        canChangeSeverity: authority.canChangeSeverity === true,
        canAssignCommander: authority.canAssignCommander === true,
        canResolve: authority.canResolve === true,
        canClose: authority.canClose === true,
      } : undefined,
      capabilities: Array.isArray(result.capabilities) ? result.capabilities.map(String) : [],
      aiSuggestion: result.aiSuggestion && typeof result.aiSuggestion === 'object' ? projectAiSuggestion(result.aiSuggestion as Record<string, unknown>) : undefined,
    };
  }

  async createIncident(organizationId: string, input: IncidentCreateInput) {
    return projectIncident((await invoke('create-incident', { organizationId, ...input })).incident as Record<string, unknown>);
  }

  async getDashboardOverview(organizationId: string) {
    const result = await invoke('get-dashboard-overview', { organizationId });
    return {
      ...result,
      activeIncidents: ((result.activeIncidents ?? []) as Record<string, unknown>[]).map(projectIncident),
      needsAttention: ((result.needsAttention ?? []) as Record<string, unknown>[]).map(projectIncident),
      recentActivity: ((result.recentActivity ?? []) as Record<string, unknown>[]).map(projectUpdate),
      recentIncidents: ((result.recentIncidents ?? []) as Record<string, unknown>[]).map(projectIncident),
      taskSummary: projectTaskSummary((result.taskSummary ?? {}) as Record<string, unknown>),
      teamLoad: ((result.teamLoad ?? []) as Record<string, unknown>[]).map(projectTeamLoad),
    } as DashboardOverview;
  }

  async listIncidentTasks(organizationId: string, incidentId: string, filters: IncidentTaskFilters = {}) {
    const result = await invoke('list-incident-tasks', { organizationId, incidentId, ...filters });
    return {
      tasks: ((result.tasks ?? []) as Record<string, unknown>[]).map(projectTask),
      nextCursor: typeof result.nextCursor === 'string' ? result.nextCursor : null,
      summary: projectTaskSummary(result.summary as Record<string, unknown> ?? {}),
    };
  }

  async createIncidentTask(input: { organizationId: string; incidentId: string; title: string; description?: string; priority: IncidentTask['priority']; assigneeUserId?: string; dueAt?: string; requestId: string }) {
    return projectTask((await invoke('create-incident-task', input)).task as Record<string, unknown>);
  }

  async claimTask(input: { organizationId: string; incidentId: string; taskId: string; expectedStatus: 'todo'; requestId: string }) {
    return projectTask((await invoke('claim-task', input)).task as Record<string, unknown>);
  }

  async unclaimTask(input: { organizationId: string; incidentId: string; taskId: string; expectedStatus: 'in_progress'; requestId: string }) {
    return projectTask((await invoke('unclaim-task', input)).task as Record<string, unknown>);
  }

  async assignIncidentTask(input: { organizationId: string; incidentId: string; taskId: string; assigneeUserId: string | null; requestId: string }) {
    return projectTask((await invoke('assign-incident-task', input)).task as Record<string, unknown>);
  }

  async updateIncidentTask(input: { organizationId: string; incidentId: string; taskId: string; title?: string; description?: string; priority?: IncidentTask['priority']; status?: IncidentTask['status']; dueAt?: string | null; blockingReason?: string | null; completionNote?: string; confirmCriticalCompletion?: boolean; requestId: string }) {
    return projectTask((await invoke('update-incident-task', input)).task as Record<string, unknown>);
  }

  async addIncidentNote(input: { organizationId: string; incidentId: string; message: string; requestId: string }) {
    return projectTimeline((await invoke('add-incident-note', input)).update as Record<string, unknown>);
  }

  async listIncidentTimeline(organizationId: string, incidentId: string, direction: 'desc' | 'asc' = 'desc'): Promise<IncidentTimeline> {
    const result = await invoke('list-incident-timeline', { organizationId, incidentId, direction });
    return {
      items: ((result.items ?? []) as Record<string, unknown>[]).map(projectTimeline),
      nextCursor: typeof result.nextCursor === 'string' ? result.nextCursor : null,
      direction: (result.direction === 'asc' ? 'asc' : 'desc') as 'desc' | 'asc',
    };
  }

  async listTeamTaskLoad(organizationId: string) {
    return (await this.getDashboardOverview(organizationId)).teamLoad;
  }

  async seedDemoData(organizationId: string, requestId: string) {
    return (await invoke('seed-demo-data', { sourceOrganizationId: organizationId, confirmation: 'CREATE DEMO WORKSPACE', requestId })) as { organizationId: string; created: number };
  }

  async resetDemoData(organizationId: string, requestId: string) {
    return (await invoke('reset-demo-data', { organizationId, confirmation: 'RESET DEMO DATA', requestId })) as { deleted: number };
  }

  async changeIncidentState(input: import('@/features/incidents/domain/incidentAuthorityTypes').ChangeIncidentStateInput) {
    return projectIncident((await invoke('change-incident-state', input as unknown as Record<string, unknown>)).incident as Record<string, unknown>);
  }

  async changeIncidentSeverity(input: import('@/features/incidents/domain/incidentAuthorityTypes').ChangeIncidentSeverityInput) {
    return projectIncident((await invoke('change-incident-severity', input as unknown as Record<string, unknown>)).incident as Record<string, unknown>);
  }

  async assignIncidentCommander(input: import('@/features/incidents/domain/incidentAuthorityTypes').AssignIncidentCommanderInput) {
    return projectIncident((await invoke('assign-incident-commander', input as unknown as Record<string, unknown>)).incident as Record<string, unknown>);
  }

  async resolveIncident(input: import('@/features/incidents/domain/incidentAuthorityTypes').ResolveIncidentInput) {
    return projectIncident((await invoke('resolve-incident', input as unknown as Record<string, unknown>)).incident as Record<string, unknown>);
  }

  async analyzeIncident(input: AnalyzeIncidentInput): Promise<AnalyzeIncidentResult> {
    const result = await invoke('analyze-incident', input as unknown as Record<string, unknown>) as Record<string, unknown>;
    const suggestion = result.suggestion && typeof result.suggestion === 'object' ? result.suggestion as Record<string, unknown> : null;
    return {
      suggestion: suggestion ? projectAiAnalysis(suggestion) : null,
      cached: result.cached === true,
      model: String(result.model ?? ''),
      promptVersion: String(result.promptVersion ?? result.prompt_version ?? ''),
      reviewStatus: (result.reviewStatus === 'applied' ? 'applied' : 'pending'),
      repaired: result.repaired === true,
    };
  }

  async applyIncidentAnalysis(input: ApplyIncidentAnalysisInput): Promise<ApplyIncidentAnalysisResult> {
    const result = await invoke('apply-incident-analysis', input as unknown as Record<string, unknown>) as Record<string, unknown>;
    const review = result.review && typeof result.review === 'object' ? result.review as Record<string, unknown> : {};
    return {
      review: {
        status: (review.status === 'applied' ? 'applied' : 'pending'),
        reviewedAt: typeof review.reviewedAt === 'string' ? review.reviewedAt : undefined,
        wasEdited: review.wasEdited === true,
        appliedTaskCount: typeof review.appliedTaskCount === 'number' ? review.appliedTaskCount : undefined,
        severityChanged: review.severityChanged === true,
        statusChanged: review.statusChanged === true,
      },
      createdTasks: Array.isArray(result.createdTasks) ? result.createdTasks.map((item: Record<string, unknown>) => ({ id: String(item.id ?? ''), title: String(item.title ?? ''), priority: String(item.priority ?? ''), source: String(item.source ?? 'ai') })) : [],
      severityChanged: result.severityChanged === true,
      statusChanged: result.statusChanged === true,
    };
  }

  subscribeToIncidentRoom(scope: IncidentRealtimeScope, listener: (event: IncidentRealtimeEvent) => void): () => void {
    const client = getBase44Client(getBase44RuntimeConfig());
    if (!client) return () => undefined;
    const unsubscribes: Array<() => void> = [];

    const onIncident = (event: Record<string, unknown>) => {
      const data = event.data && typeof event.data === 'object' ? event.data as Record<string, unknown> : {};
      const id = String(event.id ?? data.id ?? '');
      const organizationId = String(data.organization_id ?? data.organizationId ?? '');
      if (id === scope.incidentId && organizationId === scope.organizationId) {
        listener({ entity: 'incident', changeType: (event.type as RealtimeChangeType) ?? 'update', recordId: id, timestamp: typeof event.timestamp === 'string' ? event.timestamp : undefined, organizationId, incidentId: id });
      }
    };

    const onTask = (event: Record<string, unknown>) => {
      const data = event.data && typeof event.data === 'object' ? event.data as Record<string, unknown> : {};
      const id = String(event.id ?? data.id ?? '');
      const organizationId = String(data.organization_id ?? data.organizationId ?? '');
      const incidentId = String(data.incident_id ?? data.incidentId ?? '');
      if (organizationId === scope.organizationId && incidentId === scope.incidentId) {
        listener({ entity: 'task', changeType: (event.type as RealtimeChangeType) ?? 'update', recordId: id, timestamp: typeof event.timestamp === 'string' ? event.timestamp : undefined, organizationId, incidentId });
      }
    };

    const onUpdate = (event: Record<string, unknown>) => {
      const data = event.data && typeof event.data === 'object' ? event.data as Record<string, unknown> : {};
      const id = String(event.id ?? data.id ?? '');
      const organizationId = String(data.organization_id ?? data.organizationId ?? '');
      const incidentId = String(data.incident_id ?? data.incidentId ?? '');
      if (organizationId === scope.organizationId && incidentId === scope.incidentId) {
        listener({ entity: 'timeline', changeType: (event.type as RealtimeChangeType) ?? 'create', recordId: id, timestamp: typeof event.timestamp === 'string' ? event.timestamp : undefined, organizationId, incidentId });
      }
    };

    try {
      unsubscribes.push(client.entities.Incident.subscribe(onIncident as never));
    } catch {
      // subscription setup failure is non-fatal; remaining subscriptions continue
    }
    try {
      unsubscribes.push(client.entities.IncidentTask.subscribe(onTask as never));
    } catch {
      // ignore
    }
    try {
      unsubscribes.push(client.entities.IncidentUpdate.subscribe(onUpdate as never));
    } catch {
      // ignore
    }

    return () => {
      for (const unsubscribe of unsubscribes) {
        try { unsubscribe(); } catch { /* ignore */ }
      }
    };
  }
}
