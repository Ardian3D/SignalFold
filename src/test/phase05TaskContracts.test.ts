import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { TASK_PRIORITIES, TASK_SOURCES, TASK_STATUSES } from '@/features/tasks/domain/taskTypes';
import { INCIDENT_UPDATE_EVENTS } from '@/features/incidents/domain/incidentTypes';
import { loadIncidentTasks, loadIncidentTimeline, taskSummary } from '../../base44/functions/_shared/coordination';

const root = resolve(process.cwd());
const schema = (name: string) => JSON.parse(readFileSync(resolve(root, 'base44/entities', name), 'utf8').replace(/\/\/.*$/gm, '')) as Record<string, any>;
const source = (path: string) => readFileSync(resolve(root, path), 'utf8');

describe('Phase 05 task and timeline contracts', () => {
  it('preserves the full Phase 05 entity manifest and excludes later resources', () => {
    expect(readdirSync(resolve(root, 'base44/entities')).sort()).toEqual(['User.jsonc', 'incident-task.jsonc', 'incident-update.jsonc', 'incident.jsonc', 'membership.jsonc', 'organization.jsonc', 'service.jsonc'].sort());
    expect(readdirSync(resolve(root, 'base44/entities')).some(file => /postmortem|airun|notification|audit/i.test(file))).toBe(false);
  });

  it('defines canonical task schema, enums, and direct-write denial', () => {
    const task = schema('incident-task.jsonc');
    expect(task.required).toEqual(expect.arrayContaining(['organization_id', 'incident_id', 'title', 'priority', 'status', 'source', 'order_index', 'is_demo']));
    expect(task.properties.priority.enum).toEqual(TASK_PRIORITIES);
    expect(task.properties.status.enum).toEqual(TASK_STATUSES);
    expect(task.properties.source.enum).toEqual(TASK_SOURCES);
    expect(task.properties.ai_run_id).toBeTruthy();
    expect(task.rls).toEqual({ create: false, read: false, update: false, delete: false });
  });

  it('extends IncidentUpdate for task and internal-note events without direct writes', () => {
    const update = schema('incident-update.jsonc');
    for (const event of ['task_created', 'task_claimed', 'task_unclaimed', 'task_assigned', 'task_reassigned', 'task_blocked', 'task_completed', 'task_cancelled', 'internal_note_added']) {
      expect(update.properties.event_type.enum).toContain(event);
      expect(INCIDENT_UPDATE_EVENTS).toContain(event);
    }
    expect(update.properties.request_id).toBeTruthy();
    expect(update.rls).toEqual({ create: false, read: false, update: false, delete: false });
  });

  it('summarizes open, blocked, overdue, critical, and unassigned tasks deterministically', () => {
    const tasks = [
      { id: '1', organizationId: 'org', incidentId: 'inc', title: 'A', priority: 'critical', status: 'todo', source: 'human', orderIndex: 1, dueAt: '2020-01-01T00:00:00.000Z', isDemo: false },
      { id: '2', organizationId: 'org', incidentId: 'inc', title: 'B', priority: 'high', status: 'in_progress', source: 'human', orderIndex: 2, assigneeUserId: 'u1', isDemo: false },
      { id: '3', organizationId: 'org', incidentId: 'inc', title: 'C', priority: 'medium', status: 'blocked', source: 'human', orderIndex: 3, isDemo: false },
      { id: '4', organizationId: 'org', incidentId: 'inc', title: 'D', priority: 'low', status: 'done', source: 'human', orderIndex: 4, isDemo: false },
    ] as const;
    expect(taskSummary([...tasks])).toMatchObject({ total: 4, todo: 1, inProgress: 1, blocked: 1, done: 1, criticalOpen: 1, overdue: 1, unassigned: 2 });
  });

  it('reads tasks and timelines without writes and preserves distinct non-creation events', async () => {
    const failWrite = vi.fn(() => { throw new Error('read path attempted write'); });
    const base44 = {
      asServiceRole: {
        entities: {
          IncidentTask: { filter: vi.fn().mockResolvedValue([
            { id: 'task-1', organization_id: 'org-1', incident_id: 'incident-1', title: 'Compare deployment', priority: 'critical', status: 'todo', source: 'human', order_index: 1, assignee_user_id: '', is_demo: false },
            { id: 'task-2', organization_id: 'org-1', incident_id: 'incident-1', title: 'Gateway health', priority: 'high', status: 'cancelled', source: 'human', order_index: 2, assignee_user_id: '', is_demo: false },
          ]), create: failWrite, update: failWrite, delete: failWrite },
          IncidentUpdate: { filter: vi.fn().mockResolvedValue([
            { id: 'u1', organization_id: 'org-1', incident_id: 'incident-1', event_type: 'incident_created', actor_type: 'user', visibility: 'internal', message: 'Incident reported.', occurred_at: '2026-07-27T10:00:00.000Z', is_demo: false },
            { id: 'u2', organization_id: 'org-1', incident_id: 'incident-1', event_type: 'incident_created', actor_type: 'user', visibility: 'internal', message: 'Incident reported.', occurred_at: '2026-07-27T10:00:01.000Z', is_demo: false },
            { id: 'u3', organization_id: 'org-1', incident_id: 'incident-1', event_type: 'task_created', actor_type: 'user', visibility: 'internal', message: 'Task created.', occurred_at: '2026-07-27T10:00:02.000Z', is_demo: false },
            { id: 'u4', organization_id: 'org-1', incident_id: 'incident-1', event_type: 'task_completed', actor_type: 'user', visibility: 'internal', message: 'Task completed.', occurred_at: '2026-07-27T10:00:03.000Z', is_demo: false },
          ]), create: failWrite, update: failWrite, delete: failWrite },
        },
      },
    };
    const taskResult = await loadIncidentTasks(base44, 'org-1', 'incident-1', {});
    expect(taskResult.tasks.map(task => task.id)).toEqual(['task-1']);
    expect(taskResult.summary).toMatchObject({ total: 1, todo: 1 });
    const timeline = await loadIncidentTimeline(base44, 'org-1', 'incident-1');
    expect(timeline.items.map(item => item.eventType)).toEqual(['task_completed', 'task_created', 'incident_created']);
    expect(failWrite).not.toHaveBeenCalled();
  });

  it('keeps Dashboard reads free of task/timeline writes and uses create-side event appends only', () => {
    expect(source('base44/functions/get-dashboard-overview/entry.ts')).not.toMatch(/Incident(Task|Update)\.(create|update|delete)/);
    expect(source('base44/functions/get-dashboard-overview/read-model.ts')).not.toMatch(/Incident(Task|Update)\.(create|update|delete)/);
    expect(source('base44/functions/create-incident-task/entry.ts')).toContain('IncidentTask.create');
    expect(source('base44/functions/create-incident-task/entry.ts')).toContain('task_created');
    expect(source('base44/functions/add-incident-note/entry.ts')).toContain('internal_note_added');
  });

  it('uses the Base44 updateMany conditional primitive for task claiming', () => {
    const claim = source('base44/functions/claim-task/entry.ts');
    expect(claim).toContain('IncidentTask.updateMany');
    expect(claim).toContain("status: 'todo'");
    expect(claim).toContain("assignee_user_id: ''");
    expect(claim).toContain('TASK_ALREADY_CLAIMED');
  });
});
