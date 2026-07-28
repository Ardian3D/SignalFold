import type { IncidentTask, IncidentTaskFilters, TaskSummary } from '../domain/taskTypes';
import type { SafeOrganizationMember } from '@/features/organization/domain/organizationTypes';

export type TaskListResult = {
  tasks: IncidentTask[];
  nextCursor: string | null;
  summary: TaskSummary;
};

export type TaskCreateInput = {
  organizationId: string;
  incidentId: string;
  title: string;
  description?: string;
  priority: IncidentTask['priority'];
  assigneeUserId?: string;
  dueAt?: string;
  requestId: string;
};

export type TaskUpdateInput = {
  organizationId: string;
  incidentId: string;
  taskId: string;
  title?: string;
  description?: string;
  priority?: IncidentTask['priority'];
  status?: IncidentTask['status'];
  dueAt?: string | null;
  blockingReason?: string | null;
  completionNote?: string;
  confirmCriticalCompletion?: boolean;
  requestId: string;
};

export type TaskAssignInput = {
  organizationId: string;
  incidentId: string;
  taskId: string;
  assigneeUserId: string | null;
  requestId: string;
};

export type TaskClaimInput = {
  organizationId: string;
  incidentId: string;
  taskId: string;
  expectedStatus: 'todo';
  requestId: string;
};

export type TaskUnclaimInput = {
  organizationId: string;
  incidentId: string;
  taskId: string;
  expectedStatus: 'in_progress';
  requestId: string;
};

export interface TaskGateway {
  listIncidentTasks(organizationId: string, incidentId: string, filters?: IncidentTaskFilters): Promise<TaskListResult>;
  createIncidentTask(input: TaskCreateInput): Promise<IncidentTask>;
  claimTask(input: TaskClaimInput): Promise<IncidentTask>;
  unclaimTask(input: TaskUnclaimInput): Promise<IncidentTask>;
  assignIncidentTask(input: TaskAssignInput): Promise<IncidentTask>;
  updateIncidentTask(input: TaskUpdateInput): Promise<IncidentTask>;
  listTeamTaskLoad(organizationId: string): Promise<Array<SafeOrganizationMember & TaskSummary>>;
}

