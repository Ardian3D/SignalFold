import type { DashboardOverview } from '@/features/dashboard/domain/dashboardTypes';
import type {
  AssignIncidentCommanderInput,
  ChangeIncidentSeverityInput,
  ChangeIncidentStateInput,
  IncidentAuthorityCapabilities,
  ResolveIncidentInput,
} from '@/features/incidents/domain/incidentAuthorityTypes';
import type {
  AnalyzeIncidentInput,
  AnalyzeIncidentResult,
  ApplyIncidentAnalysisInput,
  ApplyIncidentAnalysisResult,
  AiSuggestion,
} from '@/features/incidents/domain/incidentAiTypes';
import type { Incident, IncidentCreateInput, IncidentFilters, IncidentStatus, IncidentUpdate } from '@/features/incidents/domain/incidentTypes';
import type { Service, ServiceInput } from '@/features/services/domain/serviceTypes';
import type { IncidentTask, IncidentTaskFilters, TaskSummary } from '@/features/tasks/domain/taskTypes';
import type { IncidentTimeline } from '@/features/timeline/domain/timelineTypes';
import type { SafeOrganizationMember } from '@/features/organization/domain/organizationTypes';
import type { IncidentRealtimeEvent, IncidentRealtimeScope } from '../domain/realtimeTypes';
import type {
  ApprovePostmortemInput,
  CreatePostmortemDraftInput,
  GeneratePostmortemInput,
  GeneratePostmortemResult,
  PostmortemActionResult,
  PostmortemReadModel,
  ReturnPostmortemToDraftInput,
  SavePostmortemDraftInput,
  SubmitPostmortemForReviewInput,
} from '@/features/postmortem/domain/postmortemTypes';

export type IncidentListResult = { incidents: Incident[]; nextCursor: string | null };
export type IncidentReadModel = {
  incident: Incident;
  service: Service | null;
  updates: IncidentUpdate[];
  tasks: IncidentTask[];
  taskSummary: TaskSummary;
  timeline: IncidentUpdate[];
  assignmentOptions: SafeOrganizationMember[];
  commanderOptions?: SafeOrganizationMember[];
  openCriticalTaskCount?: number;
  allowedTransitions?: IncidentStatus[];
  authority?: IncidentAuthorityCapabilities;
  capabilities: string[];
  aiSuggestion?: AiSuggestion;
  postmortem?: { status: string; version: number; generatedByAi: boolean; approvedAt?: string | null } | null;
};
export interface OperationalGateway {
  listServices(organizationId: string, includeInactive?: boolean): Promise<Service[]>;
  createService(organizationId: string, input: ServiceInput): Promise<Service>;
  updateService(organizationId: string, serviceId: string, input: Partial<ServiceInput> & { isActive?: boolean; requestId: string }): Promise<Service>;
  listIncidents(organizationId: string, filters?: IncidentFilters): Promise<IncidentListResult>;
  getIncident(organizationId: string, incidentId: string): Promise<IncidentReadModel>;
  createIncident(organizationId: string, input: IncidentCreateInput): Promise<Incident>;
  getDashboardOverview(organizationId: string): Promise<DashboardOverview>;
  listIncidentTasks(organizationId: string, incidentId: string, filters?: IncidentTaskFilters): Promise<{ tasks: IncidentTask[]; nextCursor: string | null; summary: TaskSummary }>;
  createIncidentTask(input: { organizationId: string; incidentId: string; title: string; description?: string; priority: IncidentTask['priority']; assigneeUserId?: string; dueAt?: string; requestId: string }): Promise<IncidentTask>;
  claimTask(input: { organizationId: string; incidentId: string; taskId: string; expectedStatus: 'todo'; requestId: string }): Promise<IncidentTask>;
  unclaimTask(input: { organizationId: string; incidentId: string; taskId: string; expectedStatus: 'in_progress'; requestId: string }): Promise<IncidentTask>;
  assignIncidentTask(input: { organizationId: string; incidentId: string; taskId: string; assigneeUserId: string | null; requestId: string }): Promise<IncidentTask>;
  updateIncidentTask(input: { organizationId: string; incidentId: string; taskId: string; title?: string; description?: string; priority?: IncidentTask['priority']; status?: IncidentTask['status']; dueAt?: string | null; blockingReason?: string | null; completionNote?: string; confirmCriticalCompletion?: boolean; requestId: string }): Promise<IncidentTask>;
  addIncidentNote(input: { organizationId: string; incidentId: string; message: string; requestId: string }): Promise<IncidentUpdate>;
  listIncidentTimeline(organizationId: string, incidentId: string, direction?: 'desc' | 'asc'): Promise<IncidentTimeline>;
  listTeamTaskLoad(organizationId: string): Promise<Array<SafeOrganizationMember & TaskSummary>>;
  seedDemoData(organizationId: string, requestId: string): Promise<{ organizationId: string; created: number }>;
  resetDemoData(organizationId: string, requestId: string, confirmation: string): Promise<{ deleted: number }>;
  changeIncidentState(input: ChangeIncidentStateInput): Promise<Incident>;
  changeIncidentSeverity(input: ChangeIncidentSeverityInput): Promise<Incident>;
  assignIncidentCommander(input: AssignIncidentCommanderInput): Promise<Incident>;
  resolveIncident(input: ResolveIncidentInput): Promise<Incident>;
  analyzeIncident(input: AnalyzeIncidentInput): Promise<AnalyzeIncidentResult>;
  applyIncidentAnalysis(input: ApplyIncidentAnalysisInput): Promise<ApplyIncidentAnalysisResult>;
  getPostmortem(organizationId: string, incidentId: string): Promise<PostmortemReadModel>;
  generatePostmortem(input: GeneratePostmortemInput): Promise<GeneratePostmortemResult>;
  savePostmortemDraft(input: SavePostmortemDraftInput): Promise<PostmortemActionResult>;
  submitPostmortemForReview(input: SubmitPostmortemForReviewInput): Promise<PostmortemActionResult>;
  returnPostmortemToDraft(input: ReturnPostmortemToDraftInput): Promise<PostmortemActionResult>;
  approvePostmortem(input: ApprovePostmortemInput): Promise<PostmortemActionResult>;
  createPostmortemDraft(input: CreatePostmortemDraftInput): Promise<PostmortemActionResult>;
  subscribeToIncidentRoom(scope: IncidentRealtimeScope, listener: (event: IncidentRealtimeEvent) => void): () => void;
}
