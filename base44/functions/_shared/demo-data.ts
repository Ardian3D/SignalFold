import { clean, requestId, slugify } from './coordination.ts';

export const DEMO_SEED_CONFIRMATION = 'CREATE DEMO WORKSPACE';
export const DEMO_RESET_CONFIRMATION = 'RESET DEMO DATA';

// Canonical demo services (PRD 25.2)
const demoServices: Array<[string, string]> = [
  ['Checkout Web', 'high'],
  ['Payments API', 'critical'],
  ['Order Processor', 'high'],
  ['Customer Portal', 'medium'],
];

// Secondary / history seed records (PRD 25.5). The main checkout-payments
// Incident is deliberately NOT seeded so the presenter creates it live.
const secondaryIncidents: Array<{
  key: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  service: string | null;
  ageDays: number;
}> = [
  { key: 'active-sev2', title: 'Order processing delays exceed normal thresholds', description: 'Order processing latency is elevated and requires active operational investigation.', severity: 'SEV2', status: 'investigating', service: 'Order Processor', ageDays: 1 },
  { key: 'resolved-sample', title: 'Customer portal login latency recovered', description: 'Customer portal latency returned to normal after a safe configuration rollback.', severity: 'SEV3', status: 'resolved', service: 'Customer Portal', ageDays: 6 },
  { key: 'historical-1', title: 'Intermittent webhook delivery delay', description: 'A historical low-priority webhook delivery delay was monitored and closed.', severity: 'SEV4', status: 'closed', service: null, ageDays: 12 },
  { key: 'historical-2', title: 'Checkout web asset cache expired', description: 'Static checkout assets were briefly stale after a cache policy change and self-recovered.', severity: 'SEV4', status: 'closed', service: 'Checkout Web', ageDays: 20 },
];

const activeTasks: Array<[string, string, string, string | null]> = [
  ['Monitor order processor queue depth.', 'high', 'in_progress', 'creator'],
  ['Compare recent order processor releases.', 'medium', 'todo', null],
  ['Prepare queue back-pressure rollback plan.', 'medium', 'done', 'creator'],
];

const resolvedTasks: Array<[string, string, string, string | null]> = [
  ['Compare customer portal configuration changes.', 'high', 'done', 'creator'],
  ['Verify portal login latency baseline.', 'medium', 'done', 'creator'],
];

export const resolvedPostmortemFixture = {
  executive_summary: 'Customer portal login latency returned to normal after a safe configuration rollback. No customer data was exposed and no payments were affected.',
  impact: 'Portal login latency was elevated for a limited window; no confirmed customer data loss or financial impact was recorded.',
  detection: 'Detected through portal latency monitoring and authenticated user reports.',
  timeline_summary: [
    { at: '2026-07-21T09:00:00.000Z', event: 'Incident reported.' },
    { at: '2026-07-21T09:40:00.000Z', event: 'Configuration comparison started.' },
    { at: '2026-07-21T11:15:00.000Z', event: 'Safe rollback applied.' },
    { at: '2026-07-21T11:30:00.000Z', event: 'Portal latency verified back to baseline.' },
  ],
  root_cause: 'A configuration change to portal caching reduced cache hit rates, causing elevated login latency until rolled back.',
  contributing_factors: ['Caching policy change deployed without a staged rollout.'],
  resolution: 'The caching configuration was rolled back and portal login latency was verified back to the expected baseline.',
  went_well: ['Monitoring detected the regression quickly.', 'Rollback restored service promptly.'],
  went_poorly: ['The caching change was not staged before full rollout.'],
  preventive_actions: [
    { title: 'Require staged rollout for portal caching changes', ownerRole: 'Customer Portal owner', priority: 'high', suggestedDueInDays: 14 },
    { title: 'Add latency regression check to portal change pipeline', ownerRole: 'Engineering lead', priority: 'medium', suggestedDueInDays: 30 },
  ],
  unknowns: [],
};

const incidentExists = (rows: any[], title: string) => rows.some((incident: any) => incident.title === title);
const taskExists = (rows: any[], title: string) => rows.some((task: any) => task.title === title);

export async function appendDemoTaskEvent(base44: any, params: {
  organizationId: string;
  incidentId: string;
  taskId: string;
  eventType: string;
  message: string;
  actorUserId?: string;
  metadata?: Record<string, unknown>;
  isDemo?: boolean;
  requestId?: string;
}) {
  const rid = params.requestId ? requestId(params.requestId) : null;
  if (rid) {
    const existing = await base44.asServiceRole.entities.IncidentUpdate.filter({ organization_id: params.organizationId, incident_id: params.incidentId, request_id: rid, event_type: params.eventType });
    if (existing[0]) return existing[0];
  }
  return base44.asServiceRole.entities.IncidentUpdate.create({
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
}

export async function seedDemoWorkspace(base44: any, input: { sourceOrganizationId?: string; confirmation?: string; requestId?: string }) {
  const user = await base44.auth.me();
  if (!user) throw { code: 'UNAUTHENTICATED', status: 401 };
  const sourceOrgId = clean(input.sourceOrganizationId, 128);
  if (!sourceOrgId) throw { code: 'VALIDATION_FAILED', status: 400 };
  const memberships = await base44.asServiceRole.entities.Membership.filter({ organization_id: sourceOrgId, user_id: user.id, status: 'active' });
  const membership = memberships[0];
  if (!membership) throw { code: 'NOT_A_MEMBER', status: 403 };
  if (membership.role !== 'admin') throw { code: 'FORBIDDEN', status: 403 };
  const rid = requestId(input.requestId);
  if (input.confirmation !== DEMO_SEED_CONFIRMATION || !rid) throw { code: 'DEMO_CONFIRMATION_REQUIRED', status: 400 };

  const ownedMemberships = await base44.asServiceRole.entities.Membership.filter({ user_id: user.id, status: 'active' });
  let demoOrg: any = null;
  for (const item of ownedMemberships) {
    const organization = await base44.asServiceRole.entities.Organization.get(item.organization_id);
    if (organization?.is_demo && organization?.created_by_user_id === user.id) {
      demoOrg = organization;
      break;
    }
  }

  if (!demoOrg) {
    const collisions = await base44.asServiceRole.entities.Organization.filter({ slug: 'northstar-commerce-demo' });
    demoOrg = await base44.asServiceRole.entities.Organization.create({
      name: 'Northstar Commerce',
      slug: collisions.length ? `northstar-commerce-demo-${collisions.length + 1}` : 'northstar-commerce-demo',
      default_timezone: 'UTC',
      incident_prefix: 'SF',
      public_status_enabled: false,
      created_by_user_id: user.id,
      is_demo: true,
      settings: { use_case: 'demo' },
    });
    await base44.asServiceRole.entities.Membership.create({
      organization_id: demoOrg.id,
      user_id: user.id,
      role: 'admin',
      status: 'active',
      joined_at: new Date().toISOString(),
      display_title: 'Demo workspace owner',
    });
  }

  const org = demoOrg;
  let created = 0;

  let existingServices = await base44.asServiceRole.entities.Service.filter({ organization_id: org.id, is_demo: true });
  for (const [name, criticality] of demoServices) {
    if (!existingServices.some((service: any) => service.name === name)) {
      await base44.asServiceRole.entities.Service.create({
        organization_id: org.id,
        name,
        slug: slugify(name),
        criticality,
        operational_status: 'operational',
        tags: [],
        is_active: true,
        is_demo: true,
        request_id: `demo-service-${slugify(name)}`,
      });
      created += 1;
    }
  }
  existingServices = await base44.asServiceRole.entities.Service.filter({ organization_id: org.id, is_demo: true });
  const serviceByName = new Map<string, any>(existingServices.map((service: any) => [service.name, service]));

  const existingIncidents = await base44.asServiceRole.entities.Incident.filter({ organization_id: org.id, is_demo: true });
  for (let index = 0; index < secondaryIncidents.length; index += 1) {
    const spec = secondaryIncidents[index];
    if (incidentExists(existingIncidents, spec.title)) continue;
    const now = new Date(Date.now() - spec.ageDays * 86_400_000).toISOString();
    const code = `SF-${new Date().getUTCFullYear()}-${String(40 + index).padStart(4, '0')}`;
    const incident = await base44.asServiceRole.entities.Incident.create({
      organization_id: org.id,
      code,
      title: spec.title,
      description: spec.description,
      source: 'demo',
      service_id: spec.service ? serviceByName.get(spec.service)?.id : undefined,
      reporter_user_id: user.id,
      severity: spec.severity,
      severity_source: 'rule_baseline',
      status: spec.status,
      reported_at: now,
      resolved_at: spec.status === 'resolved' || spec.status === 'closed' ? new Date(Date.now() - spec.ageDays * 86_400_000 + 2 * 3_600_000).toISOString() : undefined,
      closed_at: spec.status === 'closed' ? new Date(Date.now() - spec.ageDays * 86_400_000 + 4 * 3_600_000).toISOString() : undefined,
      recovery_verified: spec.status === 'resolved' || spec.status === 'closed',
      public_visibility: 'private',
      is_demo: true,
      reopened_count: 0,
      request_id: `demo-incident-${spec.key}`,
    });
    await base44.asServiceRole.entities.IncidentUpdate.create({
      organization_id: org.id,
      incident_id: incident.id,
      event_type: spec.status === 'resolved' ? 'incident_resolved' : spec.status === 'closed' ? 'incident_closed' : 'incident_seeded',
      actor_type: 'system',
      visibility: 'internal',
      message: `Demo incident ${incident.code} seeded.`,
      metadata: { code: incident.code, status: spec.status, severity: spec.severity },
      occurred_at: now,
      is_demo: true,
      request_id: `demo-incident-event-${spec.key}`,
    });
    created += 1;

    if (spec.key === 'active-sev2') {
      const existingTasks = await base44.asServiceRole.entities.IncidentTask.filter({ organization_id: org.id, incident_id: incident.id, is_demo: true });
      for (let taskIndex = 0; taskIndex < activeTasks.length; taskIndex += 1) {
        const [title, priority, status, assignment] = activeTasks[taskIndex];
        if (taskExists(existingTasks, title)) continue;
        const task = await base44.asServiceRole.entities.IncidentTask.create({
          organization_id: org.id,
          incident_id: incident.id,
          title,
          description: `${title} for ${incident.code}`,
          priority,
          status,
          source: 'system',
          order_index: taskIndex + 1,
          assignee_user_id: assignment === 'creator' ? user.id : '',
          created_by_user_id: assignment === 'creator' ? user.id : undefined,
          claimed_at: status === 'in_progress' ? new Date().toISOString() : undefined,
          completed_at: status === 'done' ? new Date().toISOString() : undefined,
          ai_run_id: undefined,
          is_demo: true,
          request_id: `demo-task-active-${taskIndex}`,
        });
        await appendDemoTaskEvent(base44, { organizationId: org.id, incidentId: incident.id, taskId: task.id, eventType: 'task_created', message: `Task ${task.title} was created.`, actorUserId: user.id, metadata: { task_id: task.id, task_title: task.title, priority, request_id: `demo-task-active-${taskIndex}` }, isDemo: true, requestId: `demo-task-active-${taskIndex}` });
        if (assignment === 'creator') {
          await appendDemoTaskEvent(base44, { organizationId: org.id, incidentId: incident.id, taskId: task.id, eventType: 'task_assigned', message: `Task ${task.title} was assigned.`, actorUserId: user.id, metadata: { task_id: task.id, task_title: task.title, assignee_user_id: user.id, request_id: `demo-task-active-${taskIndex}` }, isDemo: true, requestId: `demo-task-active-${taskIndex}-assigned` });
        }
      }
    }

    if (spec.key === 'resolved-sample') {
      const existingTasks = await base44.asServiceRole.entities.IncidentTask.filter({ organization_id: org.id, incident_id: incident.id, is_demo: true });
      for (let taskIndex = 0; taskIndex < resolvedTasks.length; taskIndex += 1) {
        const [title, priority, status, assignment] = resolvedTasks[taskIndex];
        if (taskExists(existingTasks, title)) continue;
        const task = await base44.asServiceRole.entities.IncidentTask.create({
          organization_id: org.id,
          incident_id: incident.id,
          title,
          description: `${title} for ${incident.code}`,
          priority,
          status,
          source: 'system',
          order_index: taskIndex + 1,
          assignee_user_id: assignment === 'creator' ? user.id : '',
          created_by_user_id: assignment === 'creator' ? user.id : undefined,
          claimed_at: new Date(Date.now() - 5 * 86_400_000).toISOString(),
          completed_at: new Date(Date.now() - 5 * 86_400_000 + 3_600_000).toISOString(),
          ai_run_id: undefined,
          is_demo: true,
          request_id: `demo-task-resolved-${taskIndex}`,
        });
        await appendDemoTaskEvent(base44, { organizationId: org.id, incidentId: incident.id, taskId: task.id, eventType: 'task_created', message: `Task ${task.title} was created.`, actorUserId: user.id, metadata: { task_id: task.id, task_title: task.title, priority, request_id: `demo-task-resolved-${taskIndex}` }, isDemo: true, requestId: `demo-task-resolved-${taskIndex}` });
        await appendDemoTaskEvent(base44, { organizationId: org.id, incidentId: incident.id, taskId: task.id, eventType: 'task_completed', message: `Task ${task.title} was completed.`, actorUserId: user.id, metadata: { task_id: task.id, task_title: task.title, priority, request_id: `demo-task-resolved-${taskIndex}` }, isDemo: true, requestId: `demo-task-resolved-${taskIndex}-completed` });
      }

      const existingPostmortems = await base44.asServiceRole.entities.Postmortem.filter({ organization_id: org.id, incident_id: incident.id });
      if (existingPostmortems.length === 0) {
        const now = new Date().toISOString();
        await base44.asServiceRole.entities.Postmortem.create({
          organization_id: org.id,
          incident_id: incident.id,
          status: 'approved',
          ...resolvedPostmortemFixture,
          generated_by_ai: false,
          ai_run_id: null,
          version: 1,
          approved_by_user_id: user.id,
          approved_at: now,
          is_demo: true,
          request_id: `demo-postmortem-${spec.key}`,
        });
        created += 1;
      }
    }
  }

  await base44.asServiceRole.entities.User.update(user.id, { default_organization_id: org.id });
  return { organizationId: org.id, created, reconciled: created === 0 };
}

export async function resetDemoWorkspace(base44: any, input: { organizationId?: string; confirmation?: string; requestId?: string }) {
  const user = await base44.auth.me();
  if (!user) throw { code: 'UNAUTHENTICATED', status: 401 };
  const orgId = clean(input.organizationId, 128);
  if (!orgId) throw { code: 'VALIDATION_FAILED', status: 400 };
  const memberships = await base44.asServiceRole.entities.Membership.filter({ organization_id: orgId, user_id: user.id, status: 'active' });
  const membership = memberships[0];
  if (!membership) throw { code: 'NOT_A_MEMBER', status: 403 };
  if (membership.role !== 'admin') throw { code: 'FORBIDDEN', status: 403 };
  if (input.confirmation !== DEMO_RESET_CONFIRMATION || !requestId(input.requestId)) throw { code: 'DEMO_CONFIRMATION_REQUIRED', status: 400 };
  const organization = await base44.asServiceRole.entities.Organization.get(orgId);
  if (!organization?.is_demo) throw { code: 'DEMO_RESET_FORBIDDEN', status: 403 };

  let deleted = 0;
  const demoIncidents = await base44.asServiceRole.entities.Incident.filter({ organization_id: orgId, is_demo: true });
  const demoIncidentIds = new Set(demoIncidents.map((incident: any) => incident.id));

  for (const incident of demoIncidents) {
    const incidentId = incident.id;
    const postmortems = await base44.asServiceRole.entities.Postmortem.filter({ organization_id: orgId, incident_id: incidentId });
    for (const record of postmortems) {
      await base44.asServiceRole.entities.Postmortem.delete(record.id);
      deleted += 1;
    }
    const tasks = await base44.asServiceRole.entities.IncidentTask.filter({ organization_id: orgId, incident_id: incidentId, is_demo: true });
    for (const task of tasks) {
      await base44.asServiceRole.entities.IncidentTask.delete(task.id);
      deleted += 1;
    }
    const updates = await base44.asServiceRole.entities.IncidentUpdate.filter({ organization_id: orgId, incident_id: incidentId, is_demo: true });
    for (const update of updates) {
      await base44.asServiceRole.entities.IncidentUpdate.delete(update.id);
      deleted += 1;
    }
    const aiRuns = await base44.asServiceRole.entities.AiRun.filter({ organization_id: orgId, incident_id: incidentId });
    for (const run of aiRuns) {
      if (run.is_demo === true) {
        await base44.asServiceRole.entities.AiRun.delete(run.id);
        deleted += 1;
      }
    }
    await base44.asServiceRole.entities.Incident.delete(incidentId);
    deleted += 1;
  }

  return { deleted, demoIncidentsRemoved: demoIncidentIds.size };
}
