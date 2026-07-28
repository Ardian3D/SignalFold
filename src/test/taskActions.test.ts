import { describe, expect, it } from 'vitest';
import { getTaskActionVisibility, type IncidentTask } from '@/features/tasks/domain/taskTypes';

const task = (overrides: Partial<IncidentTask>): IncidentTask => ({
  id: 'task-1',
  organizationId: 'org-1',
  incidentId: 'incident-1',
  title: 'Coordinate rollback',
  priority: 'medium',
  status: 'todo',
  source: 'human',
  orderIndex: 1,
  isDemo: false,
  ...overrides,
});

describe('task action visibility', () => {
  it('matches the canonical transition contract', () => {
    for (const priority of ['high', 'medium', 'low'] as const) {
      expect(getTaskActionVisibility(task({ priority, status: 'in_progress', assigneeUserId: 'user-1' }), 'admin', 'user-1')).toMatchObject({
        canComplete: true,
        requiresCriticalCompletionConfirmation: false,
      });
    }
    expect(getTaskActionVisibility(task({ priority: 'high', status: 'todo' }), 'reporter', 'user-1')).toMatchObject({
      canClaim: false,
      canComplete: false,
      canAssign: false,
      canBlock: false,
      canResume: false,
      requiresCriticalCompletionConfirmation: false,
      isTerminal: false,
    });
    expect(getTaskActionVisibility(task({ status: 'todo' }), 'admin', 'user-1')).toMatchObject({ canClaim: true, canComplete: false, canAssign: true, canBlock: true, canResume: false, requiresCriticalCompletionConfirmation: false, isTerminal: false });
    expect(getTaskActionVisibility(task({ priority: 'critical', status: 'todo' }), 'admin', 'user-1')).toMatchObject({ canComplete: false, requiresCriticalCompletionConfirmation: false });
    expect(getTaskActionVisibility(task({ status: 'todo' }), 'responder', 'user-1')).toMatchObject({ canClaim: true, canComplete: false, canAssign: false, canBlock: false, canResume: false, requiresCriticalCompletionConfirmation: false, isTerminal: false });
    expect(getTaskActionVisibility(task({ status: 'in_progress', assigneeUserId: 'user-1' }), 'responder', 'user-1')).toMatchObject({ canClaim: false, canUnclaim: true, canComplete: true, canBlock: true, canResume: false, requiresCriticalCompletionConfirmation: false, isTerminal: false });
    expect(getTaskActionVisibility(task({ priority: 'critical', status: 'in_progress', assigneeUserId: 'user-1' }), 'admin', 'user-1')).toMatchObject({ canComplete: true, requiresCriticalCompletionConfirmation: true });
    expect(getTaskActionVisibility(task({ status: 'blocked', assigneeUserId: 'user-1' }), 'responder', 'user-1')).toMatchObject({ canResume: true, canComplete: false, requiresCriticalCompletionConfirmation: false });
    expect(getTaskActionVisibility(task({ status: 'done' }), 'admin', 'user-1')).toMatchObject({ isTerminal: true, canClaim: false, canUnclaim: false, canAssign: false, canBlock: false, canResume: false, canComplete: false });
    expect(getTaskActionVisibility(task({ status: 'cancelled' }), 'admin', 'user-1')).toMatchObject({ isTerminal: true, canClaim: false, canUnclaim: false, canAssign: false, canBlock: false, canResume: false, canComplete: false });
  });
});
