import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LiveIncidentRoom } from '@/features/operations/OperationalViews';

const gateway = {
  listServices: vi.fn().mockResolvedValue([]),
  createService: vi.fn(),
  updateService: vi.fn(),
  listIncidents: vi.fn().mockResolvedValue({ incidents: [], nextCursor: null }),
  getIncident: vi.fn().mockResolvedValue({
    incident: {
      id: 'incident-1',
      organizationId: 'org-1',
      code: 'SF-2026-0001',
      title: 'Checkout failure',
      description: 'Customers cannot complete checkout.',
      source: 'manual',
      reporterUserId: 'user-1',
      severity: 'SEV1',
      severitySource: 'rule_baseline',
      status: 'investigating',
      reportedAt: '2026-07-27T10:00:00.000Z',
      recoveryVerified: false,
      publicVisibility: 'private',
      isDemo: false,
      reopenedCount: 0,
    },
    service: {
      id: 'service-1',
      organizationId: 'org-1',
      name: 'Payments API',
      slug: 'payments-api',
      criticality: 'critical',
      operationalStatus: 'degraded',
      tags: [],
      isActive: true,
      isDemo: false,
    },
    updates: [],
    tasks: [],
    taskSummary: { total: 0, todo: 0, inProgress: 0, blocked: 0, done: 0, cancelled: 0, criticalOpen: 0, overdue: 0, unassigned: 0 },
    timeline: [],
    assignmentOptions: [{ membershipId: 'm1', userId: 'user-1', displayName: 'Alex Rivera', role: 'admin', status: 'active' }],
    commanderOptions: [{ membershipId: 'm1', userId: 'user-1', displayName: 'Alex Rivera', role: 'admin', status: 'active' }],
    openCriticalTaskCount: 0,
    allowedTransitions: ['identified', 'monitoring'],
    authority: { canChangeStatus: true, canChangeSeverity: true, canAssignCommander: true, canResolve: true, canClose: false },
    capabilities: ['CHANGE_INCIDENT_STATUS', 'CHANGE_SEVERITY', 'ASSIGN_COMMANDER', 'RESOLVE_INCIDENT', 'CREATE_TASK', 'ADD_INTERNAL_NOTE'],
  }),
  createIncident: vi.fn(),
  getDashboardOverview: vi.fn(),
  listIncidentTasks: vi.fn().mockResolvedValue({ tasks: [], nextCursor: null, summary: { total: 0, todo: 0, inProgress: 0, blocked: 0, done: 0, cancelled: 0, criticalOpen: 0, overdue: 0, unassigned: 0 } }),
  createIncidentTask: vi.fn(),
  claimTask: vi.fn(),
  unclaimTask: vi.fn(),
  assignIncidentTask: vi.fn(),
  updateIncidentTask: vi.fn(),
  addIncidentNote: vi.fn(),
  listIncidentTimeline: vi.fn().mockResolvedValue({ items: [], nextCursor: null, direction: 'desc' }),
  seedDemoData: vi.fn(),
  resetDemoData: vi.fn(),
  changeIncidentState: vi.fn().mockResolvedValue({ id: 'incident-1', organizationId: 'org-1', code: 'SF-2026-0001', title: 'Checkout failure', description: 'Customers cannot complete checkout.', source: 'manual', reporterUserId: 'user-1', severity: 'SEV1', severitySource: 'rule_baseline', status: 'identified', reportedAt: '2026-07-27T10:00:00.000Z', recoveryVerified: false, publicVisibility: 'private', isDemo: false, reopenedCount: 0 }),
  changeIncidentSeverity: vi.fn(),
  assignIncidentCommander: vi.fn(),
  resolveIncident: vi.fn().mockResolvedValue({ id: 'incident-1', organizationId: 'org-1', code: 'SF-2026-0001', title: 'Checkout failure', description: 'Customers cannot complete checkout.', source: 'manual', reporterUserId: 'user-1', severity: 'SEV1', severitySource: 'rule_baseline', status: 'resolved', reportedAt: '2026-07-27T10:00:00.000Z', resolvedAt: '2026-07-27T12:00:00.000Z', recoveryVerified: true, resolutionSummary: 'Restored checkout.', rootCauseKnown: 'yes', remainingRisk: 'None known', publicVisibility: 'private', isDemo: false, reopenedCount: 0 }),
};

vi.mock('@/features/operations/operationalGateway', () => ({ getOperationalGateway: () => gateway }));
vi.mock('@/features/organization/OrganizationProvider', () => ({
  useOrganization: () => ({
    context: {
      organization: { id: 'org-1', name: 'Acme', slug: 'acme', defaultTimezone: 'UTC', incidentPrefix: 'SF', publicStatusEnabled: false, createdByUserId: 'user-1', isDemo: false },
      membership: { userId: 'user-1', role: 'admin', status: 'active' },
    },
    members: [{ membershipId: 'm1', userId: 'user-1', displayName: 'Alex Rivera', role: 'admin', status: 'active' }],
    refreshMembers: vi.fn(),
    selectActiveOrganization: vi.fn(),
  }),
}));

const renderRoom = () =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}>
      <MemoryRouter initialEntries={['/app/incidents/incident-1']}>
        <Routes>
          <Route path="/app/incidents/:incidentId" element={<LiveIncidentRoom />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

describe('Phase 06 incident authority UI', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders compact authority actions with outlined/primary treatments', async () => {
    renderRoom();
    expect(await screen.findByRole('button', { name: 'CHANGE STATUS' })).toHaveClass('border-[#D6FF3F]/40');
    expect(screen.getByRole('button', { name: 'CHANGE SEVERITY' })).toHaveClass('border-[#D6FF3F]/40');
    expect(screen.getByRole('button', { name: 'ASSIGN COMMANDER' })).toHaveClass('border-[#D6FF3F]/40');
    expect(screen.getByRole('button', { name: 'RESOLVE INCIDENT' })).toHaveClass('bg-[#D6FF3F]');
  });

  it('submits a status change through the gateway without optimistic success', async () => {
    const user = userEvent.setup();
    renderRoom();
    await user.click(await screen.findByRole('button', { name: 'CHANGE STATUS' }));
    await user.selectOptions(screen.getByLabelText('Target status'), 'identified');
    await user.click(screen.getByRole('button', { name: 'SUBMIT STATUS' }));
    await waitFor(() => expect(gateway.changeIncidentState).toHaveBeenCalledTimes(1));
    expect(gateway.changeIncidentState.mock.calls[0][0]).toMatchObject({
      organizationId: 'org-1',
      incidentId: 'incident-1',
      expectedStatus: 'investigating',
      targetStatus: 'identified',
    });
  });

  it('requires recovery verification and critical override before resolve submit', async () => {
    const user = userEvent.setup();
    gateway.getIncident.mockResolvedValueOnce({
      ...gateway.getIncident.mock.results[0]?.value,
      openCriticalTaskCount: 1,
      incident: {
        ...(await gateway.getIncident('org-1', 'incident-1')).incident,
        status: 'investigating',
      },
      authority: { canChangeStatus: true, canChangeSeverity: true, canAssignCommander: true, canResolve: true, canClose: false },
      service: {
        id: 'service-1',
        organizationId: 'org-1',
        name: 'Payments API',
        slug: 'payments-api',
        criticality: 'critical',
        operationalStatus: 'degraded',
        tags: [],
        isActive: true,
        isDemo: false,
      },
      updates: [],
      tasks: [],
      taskSummary: { total: 0, todo: 0, inProgress: 0, blocked: 0, done: 0, cancelled: 0, criticalOpen: 1, overdue: 0, unassigned: 0 },
      timeline: [],
      assignmentOptions: [{ membershipId: 'm1', userId: 'user-1', displayName: 'Alex Rivera', role: 'admin', status: 'active' }],
      commanderOptions: [{ membershipId: 'm1', userId: 'user-1', displayName: 'Alex Rivera', role: 'admin', status: 'active' }],
      allowedTransitions: ['identified', 'monitoring'],
      capabilities: ['RESOLVE_INCIDENT'],
    });

    renderRoom();
    await user.click(await screen.findByRole('button', { name: 'RESOLVE INCIDENT' }));
    await user.type(screen.getByLabelText('Resolution summary'), 'Restored checkout path.');
    await user.type(screen.getByLabelText('Remaining risk'), 'None known');
    await user.click(screen.getByRole('button', { name: 'CONFIRM RESOLUTION' }));
    expect(gateway.resolveIncident).not.toHaveBeenCalled();
    expect(screen.getByText(/RECOVERY VERIFICATION/i)).toBeInTheDocument();
  });
});
