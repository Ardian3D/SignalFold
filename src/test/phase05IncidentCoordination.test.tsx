import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LiveDashboard, LiveIncidentRoom } from '@/features/operations/OperationalViews';

const gateway = {
  listServices: vi.fn().mockResolvedValue([]),
  createService: vi.fn(),
  updateService: vi.fn(),
  listIncidents: vi.fn().mockResolvedValue({ incidents: [], nextCursor: null }),
  getIncident: vi.fn().mockResolvedValue({
    incident: { id: 'incident-1', organizationId: 'org-1', code: 'SF-2026-0001', title: 'Checkout failure', description: 'Customers cannot complete checkout.', source: 'manual', reporterUserId: 'user-1', severity: 'SEV1', severitySource: 'rule_baseline', status: 'reported', reportedAt: '2026-07-27T10:00:00.000Z', recoveryVerified: false, publicVisibility: 'private', isDemo: false, reopenedCount: 0 },
    service: { id: 'service-1', organizationId: 'org-1', name: 'Payments API', slug: 'payments-api', criticality: 'critical', operationalStatus: 'operational', tags: [], isActive: true, isDemo: false },
    updates: [
      { id: 'update-1', organizationId: 'org-1', incidentId: 'incident-1', eventType: 'incident_created', actorType: 'user', visibility: 'internal', message: 'Incident reported.', occurredAt: '2026-07-27T10:00:00.000Z', isDemo: false },
    ],
    tasks: [
      { id: 'task-1', organizationId: 'org-1', incidentId: 'incident-1', title: 'Compare deployment changes', priority: 'critical', status: 'todo', source: 'human', orderIndex: 1, dueAt: '2026-07-28T15:00:00.000Z', isDemo: false },
    ],
    taskSummary: { total: 1, todo: 1, inProgress: 0, blocked: 0, done: 0, cancelled: 0, criticalOpen: 1, overdue: 0, unassigned: 1 },
    timeline: [
      { id: 'update-1', organizationId: 'org-1', incidentId: 'incident-1', eventType: 'incident_created', actorType: 'user', visibility: 'internal', message: 'Incident reported.', occurredAt: '2026-07-27T10:00:00.000Z', isDemo: false },
    ],
    assignmentOptions: [{ membershipId: 'm1', userId: 'user-1', displayName: 'Alex Rivera', role: 'admin', status: 'active' }],
    capabilities: ['CREATE_TASK', 'CLAIM_TASK', 'UPDATE_OWN_TASK', 'REASSIGN_TASK', 'ADD_INTERNAL_NOTE'],
  }),
  createIncident: vi.fn(),
  getDashboardOverview: vi.fn().mockResolvedValue({
    activeIncidentsCount: 1,
    sev1Sev2Active: 1,
    openTasks: 1,
    taskDataAvailable: true,
    taskSummary: { total: 1, todo: 1, inProgress: 0, blocked: 0, done: 0, cancelled: 0, criticalOpen: 1, overdue: 0, unassigned: 1 },
    resolvedThisWeek: 0,
    averageTimeToAcknowledge: null,
    averageTimeToResolve: null,
    activeIncidents: [{ id: 'incident-1', organizationId: 'org-1', code: 'SF-2026-0001', title: 'Checkout failure', description: 'Customers cannot complete checkout.', source: 'manual', reporterUserId: 'user-1', severity: 'SEV1', severitySource: 'rule_baseline', status: 'reported', reportedAt: '2026-07-27T10:00:00.000Z', recoveryVerified: false, publicVisibility: 'private', isDemo: false, reopenedCount: 0 }],
    needsAttention: [{ id: 'incident-1', organizationId: 'org-1', code: 'SF-2026-0001', title: 'Checkout failure', description: 'Customers cannot complete checkout.', source: 'manual', reporterUserId: 'user-1', severity: 'SEV1', severitySource: 'rule_baseline', status: 'reported', reportedAt: '2026-07-27T10:00:00.000Z', recoveryVerified: false, publicVisibility: 'private', isDemo: false, reopenedCount: 0 }],
    recentActivity: [{ id: 'update-1', organizationId: 'org-1', incidentId: 'incident-1', eventType: 'incident_created', actorType: 'user', visibility: 'internal', message: 'Incident reported.', occurredAt: '2026-07-27T10:00:00.000Z', isDemo: false }],
    recentIncidents: [{ id: 'incident-1', organizationId: 'org-1', code: 'SF-2026-0001', title: 'Checkout failure', description: 'Customers cannot complete checkout.', source: 'manual', reporterUserId: 'user-1', severity: 'SEV1', severitySource: 'rule_baseline', status: 'reported', reportedAt: '2026-07-27T10:00:00.000Z', recoveryVerified: false, publicVisibility: 'private', isDemo: false, reopenedCount: 0 }],
    serviceSummary: { operational: 1, degraded: 0, outage: 0, maintenance: 0 },
    teamLoad: [{ membershipId: 'm1', userId: 'user-1', displayName: 'Alex Rivera', role: 'admin', status: 'active', joinedAt: '2026-07-27T09:00:00.000Z', total: 1, todo: 1, inProgress: 0, blocked: 0, done: 0, cancelled: 0, criticalOpen: 1, overdue: 0, unassigned: 1 }],
    quickCreateCapability: true,
    demoWorkspaceState: { isDemo: false, canSeed: true },
  }),
  listIncidentTasks: vi.fn().mockResolvedValue({ tasks: [{ id: 'task-1', organizationId: 'org-1', incidentId: 'incident-1', title: 'Compare deployment changes', priority: 'critical', status: 'todo', source: 'human', orderIndex: 1, dueAt: '2026-07-28T15:00:00.000Z', isDemo: false }], nextCursor: null, summary: { total: 1, todo: 1, inProgress: 0, blocked: 0, done: 0, cancelled: 0, criticalOpen: 1, overdue: 0, unassigned: 1 } }),
  createIncidentTask: vi.fn().mockResolvedValue({ id: 'task-2', organizationId: 'org-1', incidentId: 'incident-1', title: 'Confirm payment gateway health', priority: 'high', status: 'todo', source: 'human', orderIndex: 2, isDemo: false }),
  claimTask: vi.fn().mockResolvedValue({ id: 'task-1', organizationId: 'org-1', incidentId: 'incident-1', title: 'Compare deployment changes', priority: 'critical', status: 'in_progress', source: 'human', orderIndex: 1, assigneeUserId: 'user-1', isDemo: false }),
  unclaimTask: vi.fn(),
  assignIncidentTask: vi.fn(),
  updateIncidentTask: vi.fn(),
  addIncidentNote: vi.fn().mockResolvedValue({ id: 'update-2', organizationId: 'org-1', incidentId: 'incident-1', eventType: 'internal_note_added', actorType: 'user', visibility: 'internal', message: 'Investigating now.', occurredAt: '2026-07-27T10:05:00.000Z', isDemo: false }),
  listIncidentTimeline: vi.fn().mockResolvedValue({ items: [{ id: 'update-2', organizationId: 'org-1', incidentId: 'incident-1', eventType: 'internal_note_added', actorType: 'user', visibility: 'internal', message: 'Investigating now.', occurredAt: '2026-07-27T10:05:00.000Z', isDemo: false }, { id: 'update-1', organizationId: 'org-1', incidentId: 'incident-1', eventType: 'incident_created', actorType: 'user', visibility: 'internal', message: 'Incident reported.', occurredAt: '2026-07-27T10:00:00.000Z', isDemo: false }], nextCursor: null, direction: 'desc' }),
  seedDemoData: vi.fn(),
  resetDemoData: vi.fn(),
};

vi.mock('@/features/operations/operationalGateway', () => ({ getOperationalGateway: () => gateway }));
vi.mock('@/features/organization/OrganizationProvider', () => ({
  useOrganization: () => ({
    context: { organization: { id: 'org-1', name: 'Acme', slug: 'acme', defaultTimezone: 'UTC', incidentPrefix: 'SF', publicStatusEnabled: false, createdByUserId: 'user-1', isDemo: false }, membership: { userId: 'user-1', role: 'admin', status: 'active' } },
    members: [{ membershipId: 'm1', userId: 'user-1', displayName: 'Alex Rivera', role: 'admin', status: 'active' }],
    refreshMembers: vi.fn(),
    selectActiveOrganization: vi.fn(),
  }),
}));

const renderIncidentRoom = () =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}>
      <MemoryRouter initialEntries={['/app/incidents/incident-1']}>
        <Routes>
          <Route path="/app/incidents/:incidentId" element={<LiveIncidentRoom />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

const renderDashboard = () =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}>
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route path="/app" element={<LiveDashboard />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

describe('Phase 05 live coordination surfaces', () => {
  beforeEach(() => vi.clearAllMocks());

  it('preserves the incident room tab shell and renders coordination inside the approved tabs', async () => {
    const user = userEvent.setup();
    renderIncidentRoom();

    expect(await screen.findByText('SF-2026-0001')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'TIMELINE' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'TIMELINE' })).toHaveClass('cursor-pointer', 'focus-visible:outline', 'text-[#D6FF3F]');
    expect(screen.getByRole('tab', { name: 'TASKS' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: 'TASKS' })).toHaveClass('cursor-pointer', 'text-[#A8AAA3]');
    expect(screen.getByRole('tab', { name: 'DETAILS' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: 'DETAILS' })).toHaveClass('cursor-pointer', 'text-[#A8AAA3]');
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(screen.getByLabelText('Timeline order')).toBeVisible();
    expect(screen.getByLabelText('Timeline order')).toHaveClass('cursor-pointer', 'focus-visible:outline');
    expect(screen.getByRole('button', { name: 'ADD INTERNAL NOTE' })).toHaveClass('inline-flex', 'min-h-[36px]', 'border', 'border-[#D6FF3F]/40', 'focus-visible:outline');
    expect(screen.getByText('Investigating now.')).toBeInTheDocument();
    expect(screen.queryByText('Compare deployment changes')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Internal note')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Task title')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'ADD INTERNAL NOTE' }));
    expect(screen.getByRole('button', { name: 'CLOSE NOTE' })).toHaveClass('inline-flex', 'border-[#242522]', 'focus-visible:outline');
    expect(screen.getByLabelText('Internal note')).toBeVisible();

    await user.type(screen.getByLabelText('Internal note'), 'Investigating now.');
    await user.click(screen.getByRole('button', { name: 'ADD INTERNAL NOTE' }));
    await waitFor(() => expect(gateway.addIncidentNote).toHaveBeenCalledTimes(1));
    expect(gateway.addIncidentNote.mock.calls[0][0]).toMatchObject({ organizationId: 'org-1', incidentId: 'incident-1', message: 'Investigating now.' });

    await user.click(screen.getByRole('tab', { name: 'TASKS' }));
    expect(screen.getByRole('tab', { name: 'TASKS' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(await screen.findByText('Compare deployment changes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'REFRESH' })).toHaveClass('inline-flex', 'min-h-[32px]', 'border-[#242522]', 'bg-[#141513]', 'focus-visible:outline');
    expect(screen.getByRole('button', { name: 'CREATE TASK' })).toHaveClass('inline-flex', 'border-[#D6FF3F]/40', 'bg-[#D6FF3F]/10', 'focus-visible:outline');
    expect(screen.getByText(/DUE/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'COMPLETE' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('CONFIRM CRITICAL')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Internal note')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Task title')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'CREATE TASK' }));
    expect(screen.getByRole('button', { name: 'CLOSE TASK FORM' })).toHaveClass('inline-flex', 'border-[#242522]', 'focus-visible:outline');
    expect(screen.getByLabelText('Task title')).toBeVisible();
    expect(screen.getByLabelText('Task description')).toBeVisible();
    expect(screen.getByLabelText('Task priority')).toBeVisible();
    expect(screen.getByLabelText('Task priority')).toHaveClass('cursor-pointer', 'focus-visible:outline');
    expect(screen.getByLabelText('Task due time')).toBeVisible();

    await user.type(screen.getByLabelText('Task title'), 'Prepare rollback');
    await user.type(screen.getByLabelText('Task description'), 'Ready the rollback steps.');
    await user.selectOptions(screen.getByLabelText('Task priority'), 'high');
    expect(screen.getByRole('button', { name: 'CREATE TASK' })).toHaveClass('inline-flex', 'bg-[#D6FF3F]', 'focus-visible:outline');
    await user.click(screen.getByRole('button', { name: 'CREATE TASK' }));
    await waitFor(() => expect(gateway.createIncidentTask).toHaveBeenCalledTimes(1));
    expect(gateway.createIncidentTask.mock.calls[0][0]).toMatchObject({ organizationId: 'org-1', incidentId: 'incident-1', title: 'Prepare rollback', priority: 'high' });

    const claimButton = screen.getByRole('button', { name: 'CLAIM' });
    expect(claimButton).toHaveClass('inline-flex', 'min-h-[36px]', 'border', 'border-[#D6FF3F]/40', 'font-mono', 'font-bold', 'focus-visible:outline');
    await user.click(claimButton);
    await waitFor(() => expect(gateway.claimTask).toHaveBeenCalledTimes(1));

    await user.click(screen.getByRole('tab', { name: 'DETAILS' }));
    expect(screen.getByRole('tab', { name: 'DETAILS' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(screen.getByText('INCIDENT DETAILS')).toBeInTheDocument();
    expect(screen.getByText('PUBLIC VISIBILITY')).toBeInTheDocument();
    expect(screen.queryByLabelText('Task title')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Internal note')).not.toBeInTheDocument();
  });

  it('does not fabricate a due time when the task DTO omits dueAt', async () => {
    const user = userEvent.setup();
    gateway.listIncidentTasks.mockResolvedValueOnce({ tasks: [{ id: 'task-no-due', organizationId: 'org-1', incidentId: 'incident-1', title: 'Task without due time', priority: 'high', status: 'todo', source: 'human', orderIndex: 2, isDemo: false }], nextCursor: null, summary: { total: 1, todo: 1, inProgress: 0, blocked: 0, done: 0, cancelled: 0, criticalOpen: 0, overdue: 0, unassigned: 1 } });

    renderIncidentRoom();
    await user.click(await screen.findByRole('tab', { name: 'TASKS' }));
    expect(await screen.findByText('Task without due time')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/DUE/)).not.toBeInTheDocument());
  });

  it('disables claim while the mutation is pending to prevent duplicate interaction', async () => {
    const user = userEvent.setup();
    gateway.claimTask.mockImplementationOnce(() => new Promise(() => undefined));

    renderIncidentRoom();
    await user.click(await screen.findByRole('tab', { name: 'TASKS' }));
    const claimButton = await screen.findByRole('button', { name: 'CLAIM' });

    await user.click(claimButton);
    await waitFor(() => expect(claimButton).toBeDisabled());
    expect(gateway.claimTask).toHaveBeenCalledTimes(1);
  });

  it('renders unclaim as an approved outlined button and disables pending duplicate interaction', async () => {
    const user = userEvent.setup();
    gateway.listIncidentTasks.mockResolvedValueOnce({ tasks: [{ id: 'task-in-progress', organizationId: 'org-1', incidentId: 'incident-1', title: 'Claimed task', priority: 'high', status: 'in_progress', assigneeUserId: 'user-1', source: 'human', orderIndex: 3, isDemo: false }], nextCursor: null, summary: { total: 1, todo: 0, inProgress: 1, blocked: 0, done: 0, cancelled: 0, criticalOpen: 0, overdue: 0, unassigned: 0 } });
    gateway.unclaimTask.mockImplementationOnce(() => new Promise(() => undefined));

    renderIncidentRoom();
    await user.click(await screen.findByRole('tab', { name: 'TASKS' }));
    const unclaimButton = await screen.findByRole('button', { name: 'UNCLAIM' });
    expect(unclaimButton).toHaveClass('inline-flex', 'min-h-[36px]', 'border', 'border-[#242522]', 'font-mono', 'font-bold', 'focus-visible:outline');

    await user.click(unclaimButton);
    await waitFor(() => expect(unclaimButton).toBeDisabled());
    expect(gateway.unclaimTask).toHaveBeenCalledTimes(1);
  });

  it('renders in-progress task mutation actions with approved warning and primary treatments', async () => {
    const user = userEvent.setup();
    gateway.listIncidentTasks.mockResolvedValueOnce({ tasks: [{ id: 'task-progress', organizationId: 'org-1', incidentId: 'incident-1', title: 'In progress task', priority: 'high', status: 'in_progress', assigneeUserId: 'user-1', source: 'human', orderIndex: 4, isDemo: false }], nextCursor: null, summary: { total: 1, todo: 0, inProgress: 1, blocked: 0, done: 0, cancelled: 0, criticalOpen: 0, overdue: 0, unassigned: 0 } });

    renderIncidentRoom();
    await user.click(await screen.findByRole('tab', { name: 'TASKS' }));

    expect(await screen.findByText('In progress task')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'MARK BLOCKED' })).toHaveClass('inline-flex', 'border-amber-500/50', 'text-amber-400', 'focus-visible:outline');
    expect(screen.getByRole('button', { name: 'COMPLETE' })).toHaveClass('inline-flex', 'bg-[#D6FF3F]', 'text-black', 'focus-visible:outline');
    expect(screen.queryByLabelText('CONFIRM CRITICAL')).not.toBeInTheDocument();
  });

  it('shows the task-aware dashboard summary and team load', async () => {
    renderDashboard();
    expect(await screen.findByText('OPEN TASKS')).toBeInTheDocument();
    expect(screen.getByText('RESOLVED THIS WEEK')).toBeInTheDocument();
    expect(screen.getByText('RECENT ACTIVITY')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE INCIDENTS')).toBeInTheDocument();
    expect(screen.getByText('NEEDS ATTENTION · 1 INCIDENTS')).toBeInTheDocument();
    expect(screen.getByText('TEAM LOAD · 1 ACTIVE MEMBERS')).toBeInTheDocument();
    expect(screen.queryByText('BLOCKED TASKS')).not.toBeInTheDocument();
  });
});
