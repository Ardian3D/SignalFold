import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { projectIncident } from '@/features/operations/adapters/Base44OperationalGateway';
import { operationalQueryKeys } from '@/features/operations/queryKeys';
import { safeIncident as listSafeIncident } from '../../base44/functions/list-incidents/operations';
import { safeIncident as dashboardSafeIncident } from '../../base44/functions/get-dashboard-overview/operations';
import { loadDashboardReadModel } from '../../base44/functions/get-dashboard-overview/read-model';

const source = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), 'utf8');

const incidentRow = (overrides: Record<string, unknown> = {}) => ({
  id: 'incident-9',
  organization_id: 'org-1',
  code: 'SF-2026-0009',
  title: 'Payments latency',
  description: 'Checkout latency increased.',
  source: 'manual',
  service_id: 'service-1',
  reporter_user_id: 'user-1',
  commander_user_id: 'user-2',
  severity: 'SEV1',
  severity_source: 'rule_baseline',
  status: 'investigating',
  impact_summary: 'Checkout degraded',
  observed_start_at: '2026-07-27T10:00:00.000Z',
  reported_at: '2026-07-27T10:00:00.000Z',
  acknowledged_at: '2026-07-27T10:05:00.000Z',
  resolved_at: '2026-07-27T12:00:00.000Z',
  closed_at: '2026-07-27T12:30:00.000Z',
  resolution_summary: 'Failover restored checkout.',
  root_cause_known: 'yes',
  recovery_verified: true,
  remaining_risk: 'None known',
  resolution_override_reason: 'Verified downstream recovery.',
  public_visibility: 'private',
  is_demo: false,
  reopened_count: 0,
  created_date: '2026-07-27T10:00:00.000Z',
  updated_date: '2026-07-27T12:30:00.000Z',
  ...overrides,
});

const failWrite = vi.fn(() => { throw new Error('read path attempted a write'); });

const makeBase44 = (incidents: Record<string, unknown>[]) => ({
  asServiceRole: {
    entities: {
      Incident: { filter: vi.fn().mockResolvedValue(incidents), create: failWrite, update: failWrite, delete: failWrite },
      Service: { filter: vi.fn().mockResolvedValue([]), create: failWrite, update: failWrite, delete: failWrite },
      IncidentTask: { filter: vi.fn().mockResolvedValue([]), create: failWrite, update: failWrite, delete: failWrite },
      IncidentUpdate: { filter: vi.fn().mockResolvedValue([]), create: failWrite, update: failWrite, delete: failWrite },
      Membership: { filter: vi.fn().mockResolvedValue([]), create: failWrite, update: failWrite, delete: failWrite },
      User: { get: vi.fn(), create: failWrite, update: failWrite, delete: failWrite },
    },
  },
});

describe('Phase 06 Incident List propagation', () => {
  it('projects authoritative status, severity, commander, and resolution state in the list DTO', () => {
    const projected = listSafeIncident(incidentRow());
    expect(projected.status).toBe('investigating');
    expect(projected.severity).toBe('SEV1');
    expect(projected.commander_user_id).toBe('user-2');
    expect(projected.resolved_at).toBe('2026-07-27T12:00:00.000Z');
    expect(projected.closed_at).toBe('2026-07-27T12:30:00.000Z');
    expect(projected.resolution_summary).toBe('Failover restored checkout.');
    expect(projected.root_cause_known).toBe('yes');
    expect(projected.remaining_risk).toBe('None known');
    expect(projected.resolution_override_reason).toBe('Verified downstream recovery.');
  });

  it('reflects a changed status and severity in the list DTO after mutation', () => {
    const closed = listSafeIncident(incidentRow({ status: 'closed', severity: 'SEV2' }));
    expect(closed.status).toBe('closed');
    expect(closed.severity).toBe('SEV2');
    const resolved = listSafeIncident(incidentRow({ status: 'resolved' }));
    expect(resolved.status).toBe('resolved');
  });

  it('keeps commander projection readable while never exposing raw member IDs in the UI row', () => {
    const projected = listSafeIncident(incidentRow());
    expect(projected.commander_user_id).toBeTruthy();
    expect(projected.reporter_user_id).toBe('user-1');
    const ui = source('src/features/operations/OperationalViews.tsx');
    const listRow = ui.match(/LiveIncidents\(\)[\s\S]*?query\.data\.incidents\.map[\s\S]*?<\/Link>/)?.[0] ?? '';
    expect(listRow).toContain('incident.code');
    expect(listRow).not.toMatch(/reporterUserId|commanderUserId|reporter_user_id|commander_user_id/);
  });

  it('filters the list by authoritative status and severity server-side', () => {
    const entry = source('base44/functions/list-incidents/entry.ts');
    expect(entry).toContain("i.status.includes(x.status)");
    expect(entry).toContain("i.severity.includes(x.severity)");
    expect(entry).toContain("x.service_id===i.serviceId");
    expect(entry).toContain("{organization_id:a.organizationId}");
  });
});

describe('Phase 06 Dashboard propagation', () => {
  it('projects commander and resolution timestamps in dashboard incident DTOs', () => {
    const projected = dashboardSafeIncident(incidentRow());
    expect(projected.commander_user_id).toBe('user-2');
    expect(projected.status).toBe('investigating');
    expect(projected.severity).toBe('SEV1');
    expect(projected.acknowledged_at).toBe('2026-07-27T10:05:00.000Z');
    expect(projected.resolved_at).toBe('2026-07-27T12:00:00.000Z');
    expect(projected.closed_at).toBe('2026-07-27T12:30:00.000Z');
    expect(projected.resolution_summary).toBe('Failover restored checkout.');
    expect(projected.root_cause_known).toBe('yes');
    expect(projected.remaining_risk).toBe('None known');
    expect(projected.resolution_override_reason).toBe('Verified downstream recovery.');
  });

  it('computes active and resolved counts from authoritative status', () => {
    const entry = source('base44/functions/get-dashboard-overview/entry.ts');
    expect(entry).toContain("!['resolved', 'closed'].includes(incident.status)");
    expect(entry).toContain("incident.status === 'resolved' || incident.status === 'closed'");
    expect(entry).toContain("['SEV1', 'SEV2'].includes(incident.severity)");
    expect(entry).toContain("Date.parse(incident.resolved_at || incident.closed_at)");
  });

  it('counts Needs Attention from current authoritative severity and acknowledgement state', () => {
    const entry = source('base44/functions/get-dashboard-overview/entry.ts');
    expect(entry).toContain("['SEV1', 'SEV2'].includes(incident.severity) || !incident.acknowledged_at");
  });

  it('serves dashboard reads with zero writes and no activity side effects', async () => {
    const incidents = [
      incidentRow({ id: 'a', status: 'investigating' }),
      incidentRow({ id: 'b', status: 'resolved', resolved_at: new Date().toISOString() }),
      incidentRow({ id: 'c', status: 'closed', closed_at: new Date().toISOString() }),
    ];
    const base44 = makeBase44(incidents);
    const model = await loadDashboardReadModel(base44, 'org-1');
    expect(model.incidents).toHaveLength(3);
    expect(model.activity).toHaveLength(0);
    expect(base44.asServiceRole.entities.Incident.create).not.toHaveBeenCalled();
    expect(base44.asServiceRole.entities.Incident.update).not.toHaveBeenCalled();
    expect(base44.asServiceRole.entities.IncidentUpdate.create).not.toHaveBeenCalled();
  });
});

describe('Phase 06 cache invalidation', () => {
  it('invalidates the full operational scope so list and dashboard refresh after authority mutations', () => {
    const views = source('src/features/operations/OperationalViews.tsx');
    expect(views).toContain("queryClient.invalidateQueries({ queryKey: ['operations', mode, org.id] })");
    const statusChange = views.match(/const changeState = useMutation\([\s\S]*?onSuccess: async \(\) => \{[\s\S]*?\}\);/)?.[0] ?? '';
    const severityChange = views.match(/const changeSeverity = useMutation\([\s\S]*?onSuccess: async \(\) => \{[\s\S]*?\}\);/)?.[0] ?? '';
    const commanderChange = views.match(/const assignCommander = useMutation\([\s\S]*?onSuccess: async \(\) => \{[\s\S]*?\}\);/)?.[0] ?? '';
    const resolveChange = views.match(/const resolveIncident = useMutation\([\s\S]*?onSuccess: async \(\) => \{[\s\S]*?\}\);/)?.[0] ?? '';
    for (const block of [statusChange, severityChange, commanderChange, resolveChange]) {
      expect(block).toContain('invalidateIncident');
    }
  });

  it('scopes query keys by organization so workspace switches clear tenant cache', () => {
    const listKey = operationalQueryKeys.incidents('base44', 'org-1', {});
    const dashboardKey = operationalQueryKeys.dashboard('base44', 'org-1');
    const otherListKey = operationalQueryKeys.incidents('base44', 'org-2', {});
    expect(listKey.slice(0, 3)).toEqual(['operations', 'base44', 'org-1']);
    expect(dashboardKey.slice(0, 3)).toEqual(['operations', 'base44', 'org-1']);
    expect(otherListKey).not.toEqual(listKey);
  });

  it('derives authoritative dashboard reads without setTimeout-based refresh hacks', () => {
    const views = source('src/features/operations/OperationalViews.tsx');
    const dashboardBlock = views.match(/export function LiveDashboard\(\)[\s\S]*?\n}/)?.[0] ?? '';
    expect(dashboardBlock).not.toMatch(/setTimeout|setInterval/);
  });
});

describe('Phase 06 regression', () => {
  it('keeps the commander null-CAS fix in place across mutation branches', () => {
    const entry = source('base44/functions/assign-incident-commander/entry.ts');
    expect(entry).toContain('commander_user_id: currentCommander ?? null');
    expect(entry).toContain('commander_user_id: nextCommander ?? null');
    expect(entry).not.toContain("commander_user_id: currentCommander ?? ''");
    expect(entry).not.toContain("commander_user_id: nextCommander ?? ''");
  });

  it('keeps Phase 05 task and timeline read behavior unchanged', () => {
    const entry = source('base44/functions/get-dashboard-overview/read-model.ts');
    expect(entry).toContain('IncidentTask.filter');
    expect(entry).toContain('IncidentUpdate.filter');
    expect(entry).not.toMatch(/Incident(Task|Update)\.(create|update|delete)/);
  });

  it('frontend incident projection carries every authority field through the gateway', () => {
    const incident = projectIncident({
      id: 'incident-9',
      organization_id: 'org-1',
      code: 'SF-2026-0009',
      title: 'Payments latency',
      description: 'Checkout latency increased.',
      source: 'manual',
      service_id: 'service-1',
      reporter_user_id: 'user-1',
      commander_user_id: 'user-2',
      severity: 'SEV1',
      severity_source: 'rule_baseline',
      status: 'closed',
      impact_summary: 'Checkout degraded',
      observed_start_at: '2026-07-27T10:00:00.000Z',
      reported_at: '2026-07-27T10:00:00.000Z',
      acknowledged_at: '2026-07-27T10:05:00.000Z',
      resolved_at: '2026-07-27T12:00:00.000Z',
      closed_at: '2026-07-27T12:30:00.000Z',
      resolution_summary: 'Failover restored checkout.',
      root_cause_known: 'yes',
      recovery_verified: true,
      remaining_risk: 'None known',
      resolution_override_reason: 'Verified downstream recovery.',
      public_visibility: 'private',
      is_demo: false,
      reopened_count: 0,
      created_date: '2026-07-27T10:00:00.000Z',
      updated_date: '2026-07-27T12:30:00.000Z',
    });
    expect(incident.commanderUserId).toBe('user-2');
    expect(incident.status).toBe('closed');
    expect(incident.severity).toBe('SEV1');
    expect(incident.resolvedAt).toBe('2026-07-27T12:00:00.000Z');
    expect(incident.closedAt).toBe('2026-07-27T12:30:00.000Z');
    expect(incident.resolutionSummary).toBe('Failover restored checkout.');
    expect(incident.rootCauseKnown).toBe('yes');
    expect(incident.remainingRisk).toBe('None known');
    expect(incident.resolutionOverrideReason).toBe('Verified downstream recovery.');
  });
});
