export const TASK_PRIORITIES = ['critical', 'high', 'medium', 'low'] as const;
export const TASK_STATUSES = ['todo', 'in_progress', 'blocked', 'done', 'cancelled'] as const;
export const TASK_SOURCES = ['human', 'ai', 'system'] as const;

export type TaskPriority = typeof TASK_PRIORITIES[number];
export type TaskStatus = typeof TASK_STATUSES[number];
export type TaskSource = typeof TASK_SOURCES[number];

export type IncidentTask = {
  id: string;
  organizationId: string;
  incidentId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeUserId?: string;
  createdByUserId?: string;
  source: TaskSource;
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
  requestId?: string;
};

export type IncidentTaskFilters = {
  status?: TaskStatus[];
  assigneeUserId?: string;
  priority?: TaskPriority[];
  includeCancelled?: boolean;
  cursor?: string;
  limit?: number;
};

export type TaskSummary = {
  total: number;
  todo: number;
  inProgress: number;
  blocked: number;
  done: number;
  cancelled: number;
  criticalOpen: number;
  overdue: number;
  unassigned: number;
};

export type TaskTransitionResult = 'ok' | 'conflict' | 'forbidden' | 'invalid';

export type TaskActionVisibility = {
  canClaim: boolean;
  canUnclaim: boolean;
  canAssign: boolean;
  canBlock: boolean;
  canResume: boolean;
  canComplete: boolean;
  requiresCriticalCompletionConfirmation: boolean;
  isTerminal: boolean;
};

type TaskActionRole = 'reporter' | 'responder' | 'incident_manager' | 'admin' | string | null | undefined;

const managerRoles = new Set(['incident_manager', 'admin']);
const claimRoles = new Set(['responder', 'incident_manager', 'admin']);

export function getTaskActionVisibility(task: IncidentTask, role: TaskActionRole, currentUserId: string): TaskActionVisibility {
  const isTerminal = task.status === 'done' || task.status === 'cancelled';
  const isManager = typeof role === 'string' && managerRoles.has(role);
  const canClaimRole = typeof role === 'string' && claimRoles.has(role);
  const isAssignedToCurrentUser = Boolean(task.assigneeUserId) && task.assigneeUserId === currentUserId;
  const canUpdateOwnProgress = canClaimRole && isAssignedToCurrentUser;
  const canComplete = task.status === 'in_progress' && (isManager || canUpdateOwnProgress);

  return {
    canClaim: task.status === 'todo' && !task.assigneeUserId && canClaimRole,
    canUnclaim: task.status === 'in_progress' && (isManager || isAssignedToCurrentUser),
    canAssign: !isTerminal && isManager,
    canBlock: (task.status === 'todo' || task.status === 'in_progress') && (isManager || canUpdateOwnProgress),
    canResume: task.status === 'blocked' && (isManager || canUpdateOwnProgress),
    canComplete,
    requiresCriticalCompletionConfirmation: task.priority === 'critical' && canComplete,
    isTerminal,
  };
}
