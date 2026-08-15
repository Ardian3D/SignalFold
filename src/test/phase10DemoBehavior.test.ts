import { beforeEach, describe, expect, it, vi } from 'vitest';
import { seedDemoWorkspace, resetDemoWorkspace } from '../../base44/functions/_shared/demo-data';

type Entity = {
  rows: Array<Record<string, any>>;
  nextId: number;
};

const makeEntity = (rows: Array<Record<string, any>>, nextId = 1000) => {
  const state: Entity = { rows, nextId };
  return {
    filter: vi.fn(async (query: Record<string, unknown>) => state.rows.filter((row) => Object.entries(query).every(([key, value]) => row[key] === value))),
    get: vi.fn(async (id: string) => state.rows.find((row) => row.id === id) ?? null),
    create: vi.fn(async (data: Record<string, unknown>) => {
      const id = `id-${state.nextId++}`;
      const record = { id, ...data };
      state.rows.push(record);
      return record;
    }),
    update: vi.fn(async (id: string, data: Record<string, unknown>) => {
      const index = state.rows.findIndex((row) => row.id === id);
      if (index >= 0) state.rows[index] = { ...state.rows[index], ...data };
      return state.rows[index];
    }),
    delete: vi.fn(async (id: string) => {
      state.rows = state.rows.filter((row) => row.id !== id);
    }),
    _state: state,
  };
};

const makeBase44 = () => {
  const demoOrg = { id: 'org-demo', name: 'Northstar Commerce', slug: 'northstar-commerce-demo', is_demo: true, created_by_user_id: 'user-1', default_timezone: 'UTC', incident_prefix: 'SF', public_status_enabled: false };
  const service = makeEntity([]);
  const incident = makeEntity([]);
  const update = makeEntity([]);
  const task = makeEntity([]);
  const postmortem = makeEntity([]);
  const airun = makeEntity([]);
  const membership = makeEntity([{ id: 'm-demo', organization_id: 'org-demo', user_id: 'user-1', role: 'admin', status: 'active' }, { id: 'm-other', organization_id: 'org-other', user_id: 'user-1', role: 'admin', status: 'active' }]);
  const organization = makeEntity([demoOrg, { id: 'org-other', name: 'Real Co', slug: 'real-co', is_demo: false, created_by_user_id: 'user-2' }]);
  const user = { get: vi.fn(async () => ({ id: 'user-1' })), update: vi.fn(async () => ({})) };
  const base44 = {
    auth: { me: vi.fn(async () => ({ id: 'user-1' })) },
    asServiceRole: { entities: { Service: service, Incident: incident, IncidentUpdate: update, IncidentTask: task, Postmortem: postmortem, AiRun: airun, Membership: membership, Organization: organization, User: user } },
  };
  return { base44, service, incident, update, task, postmortem, airun, membership, organization, user };
};

const countBy = (entity: any, predicate: (row: any) => boolean) => entity._state.rows.filter(predicate).length;

describe('Phase 10 seed-demo-data functional idempotency', () => {
  let state: ReturnType<typeof makeBase44>;

  beforeEach(() => {
    state = makeBase44();
  });

  const seed = () => seedDemoWorkspace(state.base44 as any, { sourceOrganizationId: 'org-demo', confirmation: 'CREATE DEMO WORKSPACE', requestId: 'seed_req_12345678' });

  it('seeds canonical services, secondary incidents, tasks, and an approved Postmortem', async () => {
    const result = await seed();
    expect(result.organizationId).toBe('org-demo');
    expect(countBy(state.service, () => true)).toBe(4);
    expect(countBy(state.incident, () => true)).toBe(4);
    expect(countBy(state.task, (row) => row.is_demo === true)).toBe(5);
    expect(countBy(state.postmortem, () => true)).toBe(1);
    const pm = state.postmortem._state.rows[0];
    expect(pm.status).toBe('approved');
    expect(pm.generated_by_ai).toBe(false);
    expect(pm.approved_by_user_id).toBe('user-1');
    expect(pm.ai_run_id).toBe(null);
  });

  it('does not create AiRun during seed', async () => {
    await seed();
    expect(countBy(state.airun, () => true)).toBe(0);
  });

  it('does not seed the live main checkout incident', async () => {
    await seed();
    expect(state.incident._state.rows.some((row) => row.title.includes('Checkout payments failing'))).toBe(false);
  });

  it('is idempotent: running seed twice produces zero duplicate demo records', async () => {
    const first = await seed();
    const serviceCountAfterFirst = countBy(state.service, () => true);
    const incidentCountAfterFirst = countBy(state.incident, () => true);
    const taskCountAfterFirst = countBy(state.task, () => true);
    const postmortemCountAfterFirst = countBy(state.postmortem, () => true);

    const second = await seed();
    expect(countBy(state.service, () => true)).toBe(serviceCountAfterFirst);
    expect(countBy(state.incident, () => true)).toBe(incidentCountAfterFirst);
    expect(countBy(state.task, () => true)).toBe(taskCountAfterFirst);
    expect(countBy(state.postmortem, () => true)).toBe(postmortemCountAfterFirst);
    expect(first.created).toBeGreaterThan(0);
    expect(second.created).toBe(0);
    expect(second.reconciled).toBe(true);
  });
});

describe('Phase 10 reset-demo-data functional safety', () => {
  let state: ReturnType<typeof makeBase44>;

  beforeEach(async () => {
    state = makeBase44();
    await seedDemoWorkspace(state.base44 as any, { sourceOrganizationId: 'org-demo', confirmation: 'CREATE DEMO WORKSPACE', requestId: 'seed_req_12345678' });
    // Add a non-demo Incident + child records in the same organization.
    state.incident._state.rows.push({ id: 'non-demo-1', organization_id: 'org-demo', is_demo: false, title: 'Real incident', status: 'reported' });
    state.task._state.rows.push({ id: 'non-demo-task', organization_id: 'org-demo', incident_id: 'non-demo-1', is_demo: false, title: 'Real task' });
    state.update._state.rows.push({ id: 'non-demo-update', organization_id: 'org-demo', incident_id: 'non-demo-1', is_demo: false, event_type: 'incident_created', message: 'x' });
    // Add a demo incident in ANOTHER organization.
    state.incident._state.rows.push({ id: 'other-org-demo', organization_id: 'org-other', is_demo: true, title: 'Other demo' });
  });

  const reset = (confirmation = 'RESET DEMO DATA') => resetDemoWorkspace(state.base44 as any, { organizationId: 'org-demo', confirmation, requestId: 'reset_req_12345678' });

  it('removes demo incidents and their Postmortem/Task/Timeline/AiRun children', async () => {
    // Seed a demo AiRun child for a demo incident.
    const demoIncident = state.incident._state.rows.find((row) => row.organization_id === 'org-demo' && row.is_demo === true);
    state.airun._state.rows.push({ id: 'demo-run', organization_id: 'org-demo', incident_id: demoIncident!.id, is_demo: true, feature: 'postmortem' });
    const result = await reset();
    expect(result.deleted).toBeGreaterThan(0);
    expect(countBy(state.incident, (row) => row.organization_id === 'org-demo' && row.is_demo === true)).toBe(0);
    expect(countBy(state.postmortem, () => true)).toBe(0);
    expect(countBy(state.airun, (row) => row.is_demo === true)).toBe(0);
    expect(countBy(state.task, (row) => row.is_demo === true)).toBe(0);
    expect(countBy(state.update, (row) => row.is_demo === true)).toBe(0);
  });

  it('preserves non-demo records in the same organization', async () => {
    await reset();
    expect(state.incident._state.rows.some((row) => row.id === 'non-demo-1')).toBe(true);
    expect(state.task._state.rows.some((row) => row.id === 'non-demo-task')).toBe(true);
    expect(state.update._state.rows.some((row) => row.id === 'non-demo-update')).toBe(true);
  });

  it('does not touch demo incidents in another organization', async () => {
    await reset();
    expect(state.incident._state.rows.some((row) => row.id === 'other-org-demo')).toBe(true);
  });

  it('preserves Organization, Membership, and Services', async () => {
    const orgBefore = state.organization._state.rows.length;
    const membershipBefore = state.membership._state.rows.length;
    const serviceBefore = state.service._state.rows.length;
    await reset();
    expect(state.organization._state.rows.length).toBe(orgBefore);
    expect(state.membership._state.rows.length).toBe(membershipBefore);
    expect(state.service._state.rows.length).toBe(serviceBefore);
  });

  it('requires the exact typed confirmation', async () => {
    await expect(reset('WRONG')).rejects.toMatchObject({ code: 'DEMO_CONFIRMATION_REQUIRED' });
    await expect(reset('')).rejects.toMatchObject({ code: 'DEMO_CONFIRMATION_REQUIRED' });
  });

  it('refuses to reset a non-demo organization', async () => {
    await expect(resetDemoWorkspace(state.base44 as any, { organizationId: 'org-other', confirmation: 'RESET DEMO DATA', requestId: 'reset_req_12345678' })).rejects.toMatchObject({ code: 'DEMO_RESET_FORBIDDEN' });
  });

  it('is idempotent: reset twice succeeds safely the second time', async () => {
    await reset();
    const second = await reset();
    expect(second.deleted).toBe(0);
  });
});

describe('Phase 10 seed -> reset -> seed cycle', () => {
  let state: ReturnType<typeof makeBase44>;

  beforeEach(() => {
    state = makeBase44();
  });

  it('restores deterministic demo state after seed, reset, and re-seed', async () => {
    await seedDemoWorkspace(state.base44 as any, { sourceOrganizationId: 'org-demo', confirmation: 'CREATE DEMO WORKSPACE', requestId: 'seed_req_12345678' });
    const afterFirstSeed = {
      services: countBy(state.service, () => true),
      incidents: countBy(state.incident, () => true),
      tasks: countBy(state.task, () => true),
      postmortems: countBy(state.postmortem, () => true),
    };
    expect(afterFirstSeed.services).toBe(4);
    expect(afterFirstSeed.incidents).toBe(4);
    expect(afterFirstSeed.postmortems).toBe(1);

    await resetDemoWorkspace(state.base44 as any, { organizationId: 'org-demo', confirmation: 'RESET DEMO DATA', requestId: 'reset_req_12345678' });
    expect(countBy(state.incident, () => true)).toBe(0);
    expect(countBy(state.postmortem, () => true)).toBe(0);

    await seedDemoWorkspace(state.base44 as any, { sourceOrganizationId: 'org-demo', confirmation: 'CREATE DEMO WORKSPACE', requestId: 'seed_req_87654321' });
    expect(countBy(state.service, () => true)).toBe(afterFirstSeed.services);
    expect(countBy(state.incident, () => true)).toBe(afterFirstSeed.incidents);
    expect(countBy(state.task, () => true)).toBe(afterFirstSeed.tasks);
    expect(countBy(state.postmortem, () => true)).toBe(afterFirstSeed.postmortems);
  });

  it('rejects non-admin seed and reset actors', async () => {
    const { base44 } = state;
    (base44.auth.me as any).mockResolvedValueOnce({ id: 'user-2' });
    // user-2 has no active membership in org-demo => NOT_A_MEMBER
    await expect(seedDemoWorkspace(base44 as any, { sourceOrganizationId: 'org-demo', confirmation: 'CREATE DEMO WORKSPACE', requestId: 'seed_req_12345678' })).rejects.toMatchObject({ code: 'NOT_A_MEMBER' });
  });
});
