import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { Base44OperationalGateway } from '@/features/operations/adapters/Base44OperationalGateway';
import { loadDashboardReadModel } from '../../base44/functions/get-dashboard-overview/read-model';

vi.mock('@/integrations/base44/config', () => ({ getBase44RuntimeConfig: () => ({ isConfigured: true }) }));

const invoke = vi.fn();
vi.mock('@/integrations/base44/client', () => ({ getBase44Client: () => ({ functions: { invoke } }) }));

const updates = [
  {
    id: 'update-3',
    organization_id: 'org-1',
    incident_id: 'incident-1',
    event_type: 'incident_created',
    actor_type: 'user',
    visibility: 'internal',
    message: 'Incident SF-2026-0001 was reported.',
    occurred_at: '2026-07-27T10:00:02.000Z',
    is_demo: false,
  },
  {
    id: 'update-2',
    organization_id: 'org-1',
    incident_id: 'incident-1',
    event_type: 'incident_created',
    actor_type: 'user',
    visibility: 'internal',
    message: 'Incident SF-2026-0001 was reported.',
    occurred_at: '2026-07-27T10:00:01.000Z',
    is_demo: false,
  },
  {
    id: 'update-1',
    organization_id: 'org-1',
    incident_id: 'incident-1',
    event_type: 'incident_created',
    actor_type: 'user',
    visibility: 'internal',
    message: 'Incident SF-2026-0001 was reported.',
    occurred_at: '2026-07-27T10:00:00.000Z',
    is_demo: false,
  },
];

const makeBase44 = () => {
  const failWrite = vi.fn(() => {
    throw new Error('Dashboard read path attempted a write');
  });
  return {
    asServiceRole: {
      entities: {
        Incident: { filter: vi.fn().mockResolvedValue([]), create: failWrite, update: failWrite, delete: failWrite },
        Service: { filter: vi.fn().mockResolvedValue([]), create: failWrite, update: failWrite, delete: failWrite },
        IncidentTask: { filter: vi.fn().mockResolvedValue([]), create: failWrite, update: failWrite, delete: failWrite },
        IncidentUpdate: { filter: vi.fn().mockResolvedValue([...updates]), create: failWrite, update: failWrite, delete: failWrite },
        Membership: { filter: vi.fn().mockResolvedValue([]), create: failWrite, update: failWrite, delete: failWrite },
        User: { get: vi.fn(), create: failWrite, update: failWrite, delete: failWrite },
      },
    },
    failWrite,
  };
};

describe('Phase 04 Dashboard read path', () => {
  it('performs zero writes for one Dashboard overview read and leaves duplicate persistence unchanged', async () => {
    const base44 = makeBase44();
    const before = updates.length;
    const result = await loadDashboardReadModel(base44, 'org-1');
    expect(result.activity).toHaveLength(1);
    expect(result.activity[0].id).toBe('update-1');
    expect(result.taskSummary).toMatchObject({ total: 0, todo: 0, inProgress: 0, blocked: 0 });
    expect(updates).toHaveLength(before);
    expect(base44.failWrite).not.toHaveBeenCalled();
  });

  it('performs zero writes for five sequential Dashboard overview reads', async () => {
    const base44 = makeBase44();
    for (let index = 0; index < 5; index += 1) await loadDashboardReadModel(base44, 'org-1');
    expect(base44.asServiceRole.entities.IncidentUpdate.filter).toHaveBeenCalledTimes(5);
    expect(base44.asServiceRole.entities.IncidentTask.filter).toHaveBeenCalledTimes(5);
    expect(base44.failWrite).not.toHaveBeenCalled();
  });

  it('performs zero writes for concurrent Dashboard overview reads', async () => {
    const base44 = makeBase44();
    await Promise.all(Array.from({ length: 5 }, () => loadDashboardReadModel(base44, 'org-1')));
    expect(base44.asServiceRole.entities.IncidentUpdate.filter).toHaveBeenCalledTimes(5);
    expect(base44.asServiceRole.entities.IncidentTask.filter).toHaveBeenCalledTimes(5);
    expect(base44.failWrite).not.toHaveBeenCalled();
  });

  it('Dashboard adapter invokes only get-dashboard-overview', async () => {
    invoke.mockResolvedValueOnce({ data: { activeIncidentsCount: 0 } });
    await new Base44OperationalGateway().getDashboardOverview('org-1');
    expect(invoke).toHaveBeenCalledTimes(1);
    expect(invoke).toHaveBeenCalledWith('get-dashboard-overview', { organizationId: 'org-1' });
    expect(invoke).not.toHaveBeenCalledWith('create-incident', expect.anything());
  });

  it('get-dashboard-overview source has no IncidentUpdate mutation calls', () => {
    const source = readFileSync(resolve(process.cwd(), 'base44/functions/get-dashboard-overview/entry.ts'), 'utf8');
    expect(source).not.toMatch(/IncidentUpdate\.(create|update|delete)/);
    expect(source).not.toMatch(/append|reconcile|upsert|fallback/i);
  });

  it('create-incident retry path returns the existing incident without appending an update', () => {
    const source = readFileSync(resolve(process.cwd(), 'base44/functions/create-incident/entry.ts'), 'utf8');
    const priorBranch = source.match(/if \(prior\[0\]\) \{[\s\S]*?return json\(\{ incident: safeIncident\(prior\[0\]\), reconciled: true \}\);[\s\S]*?\n    \}/)?.[0] ?? '';
    expect(priorBranch).toContain('reconciled: true');
    expect(priorBranch).not.toContain('appendCreation');
    expect(priorBranch).not.toContain('IncidentUpdate.create');
  });
});
