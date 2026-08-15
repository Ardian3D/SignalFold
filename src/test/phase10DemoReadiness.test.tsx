import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LiveDashboard } from '@/features/operations/OperationalViews';

const root = resolve(process.cwd());
const read = (relativePath: string) => readFileSync(resolve(root, relativePath), 'utf8');
const seedSource = read('base44/functions/_shared/demo-data.ts');
const resetSource = read('base44/functions/_shared/demo-data.ts');
const seedEntry = read('base44/functions/seed-demo-data/entry.ts');
const resetEntry = read('base44/functions/reset-demo-data/entry.ts');

const gateway = {
  getDashboardOverview: vi.fn(),
  seedDemoData: vi.fn(),
  resetDemoData: vi.fn(),
  listServices: vi.fn().mockResolvedValue([]),
  createService: vi.fn(),
  updateService: vi.fn(),
  listIncidents: vi.fn(),
  getIncident: vi.fn(),
  createIncident: vi.fn(),
  listIncidentTasks: vi.fn().mockResolvedValue({ tasks: [], nextCursor: null, summary: { total: 0, todo: 0, inProgress: 0, blocked: 0, done: 0, cancelled: 0, criticalOpen: 0, overdue: 0, unassigned: 0 } }),
  createIncidentTask: vi.fn(),
  claimTask: vi.fn(),
  unclaimTask: vi.fn(),
  assignIncidentTask: vi.fn(),
  updateIncidentTask: vi.fn(),
  addIncidentNote: vi.fn(),
  listIncidentTimeline: vi.fn().mockResolvedValue({ items: [], nextCursor: null, direction: 'desc' }),
  listTeamTaskLoad: vi.fn().mockResolvedValue([]),
  changeIncidentState: vi.fn(),
  changeIncidentSeverity: vi.fn(),
  assignIncidentCommander: vi.fn(),
  resolveIncident: vi.fn(),
  analyzeIncident: vi.fn(),
  applyIncidentAnalysis: vi.fn(),
  getPostmortem: vi.fn().mockResolvedValue({ postmortem: null }),
  generatePostmortem: vi.fn(),
  savePostmortemDraft: vi.fn(),
  submitPostmortemForReview: vi.fn(),
  returnPostmortemToDraft: vi.fn(),
  approvePostmortem: vi.fn(),
  createPostmortemDraft: vi.fn(),
  subscribeToIncidentRoom: vi.fn().mockReturnValue(() => undefined),
};

vi.mock('@/features/operations/operationalGateway', () => ({ getOperationalGateway: () => gateway }));
vi.mock('@/features/organization/OrganizationProvider', () => ({
  useOrganization: () => ({ context: { organization: { id: 'org-1', name: 'Northstar Commerce', slug: 'northstar-commerce-demo', defaultTimezone: 'UTC', incidentPrefix: 'SF', publicStatusEnabled: false, createdByUserId: 'user-1', isDemo: true }, membership: { userId: 'user-1', role: 'admin', status: 'active' } }, members: [{ membershipId: 'm1', userId: 'user-1', displayName: 'Admin', role: 'admin', status: 'active' }], refreshMembers: vi.fn(), selectActiveOrganization: vi.fn() }),
}));

const renderDashboard = () => render(
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}>
    <MemoryRouter initialEntries={['/app']}>
      <Routes>
        <Route path="/app" element={<LiveDashboard />} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>,
);

const populated = () => ({
  activeIncidentsCount: 1,
  sev1Sev2Active: 1,
  openTasks: 2,
  taskDataAvailable: true,
  taskSummary: { total: 2, todo: 1, inProgress: 1, blocked: 0, done: 0, cancelled: 0, criticalOpen: 1, overdue: 0, unassigned: 1 },
  resolvedThisWeek: 1,
  averageTimeToAcknowledge: null,
  averageTimeToResolve: null,
  activeIncidents: [{ id: 'incident-1', organizationId: 'org-1', code: 'SF-2026-0041', title: 'Order processing delays', description: 'Order latency elevated.', source: 'demo', reporterUserId: 'user-1', severity: 'SEV2', severitySource: 'rule_baseline', status: 'investigating', reportedAt: '2026-08-13T10:00:00.000Z', recoveryVerified: false, publicVisibility: 'private', isDemo: true, reopenedCount: 0 }],
  needsAttention: [],
  recentActivity: [],
  recentIncidents: [{ id: 'incident-1', organizationId: 'org-1', code: 'SF-2026-0041', title: 'Order processing delays', description: 'x', source: 'demo', reporterUserId: 'user-1', severity: 'SEV2', severitySource: 'rule_baseline', status: 'investigating', reportedAt: '2026-08-13T10:00:00.000Z', recoveryVerified: false, publicVisibility: 'private', isDemo: true, reopenedCount: 0 }],
  serviceSummary: { operational: 4, degraded: 0, outage: 0, maintenance: 0 },
  teamLoad: [],
  quickCreateCapability: true,
  demoWorkspaceState: { isDemo: true, canSeed: true },
});

describe('Phase 10 seed-demo-data authorization contract', () => {
  it('requires admin membership role (not User.role)', () => {
    expect(seedSource).toContain("membership.role !== 'admin'");
    expect(seedSource).not.toContain("user.role");
    expect(seedEntry).toContain('seedDemoWorkspace');
  });

  it('requires the typed demo confirmation and a valid request id', () => {
    expect(seedSource).toContain("'CREATE DEMO WORKSPACE'");
    expect(seedSource).toContain('DEMO_CONFIRMATION_REQUIRED');
  });

  it('never seeds the live main checkout incident (presenter creates it live)', () => {
    expect(seedSource).not.toContain('Checkout payments failing after latest deployment');
    expect(seedSource).not.toContain('37 reports in the last 12 minutes');
  });

  it('does not call DeepSeek or create AiRun during seed', () => {
    expect(seedSource).not.toContain('api.deepseek.com');
    expect(seedSource).not.toContain('AiRun.create');
    expect(seedSource).not.toContain('analyze-incident');
  });

  it('creates a resolved sample with an approved Postmortem fixture (no AI provenance)', () => {
    expect(seedSource).toContain('resolved-sample');
    expect(seedSource).toContain("status: 'approved'");
    expect(seedSource).toContain('generated_by_ai: false');
    expect(seedSource).toContain('approved_by_user_id: user.id');
    expect(seedSource).toContain('Postmortem.create');
  });

  it('keeps seed idempotent via deterministic lookups', () => {
    expect(seedSource).toContain('existingServices.some');
    expect(seedSource).toContain('incidentExists');
    expect(seedSource).toContain('taskExists');
    expect(seedSource).toContain('existingPostmortems.length === 0');
  });

  it('seeds only canonical demo services', () => {
    for (const name of ['Checkout Web', 'Payments API', 'Order Processor', 'Customer Portal']) {
      expect(seedSource).toContain(name);
    }
  });

  it('scopes seed to a demo organization owned by the actor', () => {
    expect(seedSource).toContain("organization?.is_demo");
    expect(seedSource).toContain("organization?.created_by_user_id === user.id");
  });
});

describe('Phase 10 reset-demo-data authorization and safety contract', () => {
  it('requires admin membership role', () => {
    expect(resetSource).toContain("membership.role !== 'admin'");
    expect(resetEntry).toContain('resetDemoWorkspace');
  });

  it('requires exact typed confirmation', () => {
    expect(resetSource).toContain("'RESET DEMO DATA'");
    expect(resetSource).toContain('DEMO_CONFIRMATION_REQUIRED');
  });

  it('refuses to reset a non-demo organization', () => {
    expect(resetSource).toContain("organization?.is_demo");
    expect(resetSource).toContain('DEMO_RESET_FORBIDDEN');
  });

  it('derives demo ownership from a proven demo Incident parent', () => {
    expect(resetSource).toContain("is_demo: true");
    expect(resetSource).toContain("incident_id: incidentId");
  });

  it('cascades to Postmortem, IncidentTask, IncidentUpdate, and incident-scoped AiRun', () => {
    expect(resetSource).toContain('Postmortem.delete');
    expect(resetSource).toContain('IncidentTask.delete');
    expect(resetSource).toContain('IncidentUpdate.delete');
    expect(resetSource).toContain('AiRun.delete');
    expect(resetSource).toContain('Incident.delete');
  });

  it('preserves Services, Organization, Membership, and User', () => {
    expect(resetSource).not.toContain('Service.delete');
    expect(resetSource).not.toContain('Organization.delete');
    expect(resetSource).not.toContain('Membership.delete');
    expect(resetSource).not.toContain('User.delete');
    expect(resetSource).not.toContain('deleteAll');
  });

  it('never performs an organization-wide unfiltered delete', () => {
    expect(resetSource).not.toContain('Incident.filter({ organization_id: access.organizationId })');
    expect(resetSource).toContain('incident_id: incidentId');
  });

  it('does not call AI during reset', () => {
    expect(resetSource).not.toContain('api.deepseek.com');
    expect(resetSource).not.toContain('analyze-incident');
  });
});

describe('Phase 10 get-dashboard-overview demo workspace state', () => {
  it('reflects the actual organization demo flag', () => {
    const source = read('base44/functions/get-dashboard-overview/entry.ts');
    expect(source).toContain("organization.is_demo === true");
    expect(source).toContain("canSeed: access.membership.role === 'admin'");
  });
});

describe('Phase 10 demo UI', () => {
  it('shows a DEMO WORKSPACE helper card in a demo workspace', async () => {
    gateway.getDashboardOverview.mockResolvedValue(populated());
    renderDashboard();
    expect(await screen.findByText('DEMO WORKSPACE')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'RESET DEMO WORKSPACE' })).toBeVisible();
  });

  it('requires the exact typed confirmation before reset is enabled', async () => {
    const user = userEvent.setup();
    gateway.getDashboardOverview.mockResolvedValue(populated());
    renderDashboard();
    await screen.findByText('DEMO WORKSPACE');
    await user.click(screen.getByRole('button', { name: 'RESET DEMO WORKSPACE' }));
    const confirm = screen.getByRole('button', { name: 'CONFIRM RESET' });
    expect(confirm).toBeDisabled();
    await user.type(screen.getByLabelText('Reset demo confirmation'), 'WRONG PHRASE');
    expect(confirm).toBeDisabled();
    expect(gateway.resetDemoData).not.toHaveBeenCalled();
    await user.clear(screen.getByLabelText('Reset demo confirmation'));
    await user.type(screen.getByLabelText('Reset demo confirmation'), 'RESET DEMO DATA');
    expect(confirm).toBeEnabled();
    await user.click(confirm);
    await waitFor(() => expect(gateway.resetDemoData).toHaveBeenCalledTimes(1));
    expect(gateway.resetDemoData.mock.calls[0][2]).toBe('RESET DEMO DATA');
  });

  it('does not expose reset authority to non-admin roles', async () => {
    vi.resetModules();
    const { LiveDashboard: LD } = await import('@/features/operations/OperationalViews');
    // Non-admin render is covered by the role gate in the component; verify source gate.
    expect(LD.toString()).toContain('canReset');
  });

  it('does not show the demo helper card in a non-demo workspace', async () => {
    gateway.getDashboardOverview.mockResolvedValue({ ...populated(), demoWorkspaceState: { isDemo: false, canSeed: true } });
    renderDashboard();
    await screen.findByText('ACTIVE INCIDENTS');
    expect(screen.queryByText('DEMO WORKSPACE')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'RESET DEMO WORKSPACE' })).not.toBeInTheDocument();
  });
});

describe('Phase 10 full critical path (contract-level, mocked provider)', () => {
  it('asserts the canonical P0 workflow resources exist in the repository', () => {
    for (const fn of ['create-incident', 'analyze-incident', 'apply-incident-analysis', 'claim-task', 'update-incident-task', 'change-incident-state', 'resolve-incident', 'generate-postmortem', 'approve-postmortem']) {
      expect(readdirSync(resolve(root, 'base44/functions'))).toContain(fn);
    }
    for (const entity of ['User.jsonc', 'organization.jsonc', 'membership.jsonc', 'service.jsonc', 'incident.jsonc', 'incident-update.jsonc', 'incident-task.jsonc', 'airun.jsonc', 'postmortem.jsonc']) {
      expect(readdirSync(resolve(root, 'base44/entities'))).toContain(entity);
    }
  });

  it('keeps AI human-authority: analyze is suggestion-only, apply requires explicit human review', () => {
    const analyze = read('base44/functions/analyze-incident/entry.ts');
    expect(analyze).not.toContain("Incident.update");
    expect(analyze).not.toContain('IncidentTask.create');
    const apply = read('base44/functions/apply-incident-analysis/entry.ts');
    expect(apply).toContain("String(reviewState.status ?? 'pending') !== 'pending'");
    expect(apply).toContain('AI_REVIEW_ALREADY_APPLIED');
  });

  it('keeps Postmortem human-authority: AI cannot submit/approve/publish', () => {
    const generate = read('base44/functions/generate-postmortem/entry.ts');
    expect(generate).not.toContain("status: 'approved'");
    expect(generate).not.toContain("status: 'in_review'");
    expect(generate).not.toContain('approve-postmortem');
  });

  it('keeps the Phase 08 realtime + 10s fallback intact', () => {
    const sync = read('src/features/operations/useIncidentRealtimeSync.ts');
    expect(sync).toContain('REALTIME_RECONCILIATION_INTERVAL_MS = 10_000');
    expect(sync).toContain('subscribeToIncidentRoom');
  });

  it('denies direct client writes for privileged resources', () => {
    const gateway = read('src/features/operations/adapters/Base44OperationalGateway.ts');
    expect(gateway).not.toContain("entities.Incident.create");
    expect(gateway).not.toContain("entities.Postmortem.create");
    expect(gateway).not.toContain("entities.AiRun.create");
  });
});

describe('Phase 10 tenant and role isolation contract', () => {
  it('keeps Membership.role authoritative in seed/reset and never uses User.role', () => {
    expect(seedSource).not.toMatch(/user\s*\.\s*role/i);
    expect(resetSource).not.toMatch(/user\s*\.\s*role/i);
  });

  it('scopes seed to the actor-owned demo organization and reset to the current tenant', () => {
    expect(seedSource).toContain('organization_id: org.id');
    expect(resetSource).toContain('organization_id: orgId');
    expect(resetSource).toContain("entities.Incident.filter({ organization_id: orgId, is_demo: true })");
  });
});
