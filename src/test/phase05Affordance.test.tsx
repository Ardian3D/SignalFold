import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  compactNeutralActionButton,
  limeActionButton,
  neutralActionButton,
  primaryActionButton,
  secondaryActionButton,
  tabButton,
  tabButtonActive,
  tabButtonInactive,
  warningActionButton,
} from '@/components/ui/operationalActions';
import { Button } from '@/components/ui/Button';
import { LiveDashboard, LiveIncidentRoom, LiveServices } from '@/features/operations/OperationalViews';

const gateway = {
  listServices: vi.fn().mockResolvedValue([
    {
      id: 'service-1',
      organizationId: 'org-1',
      name: 'Payments API',
      slug: 'payments-api',
      criticality: 'critical',
      operationalStatus: 'operational',
      tags: [],
      isActive: true,
      isDemo: false,
    },
  ]),
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
      status: 'reported',
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
      operationalStatus: 'operational',
      tags: [],
      isActive: true,
      isDemo: false,
    },
    updates: [
      {
        id: 'update-1',
        organizationId: 'org-1',
        incidentId: 'incident-1',
        eventType: 'incident_created',
        actorType: 'user',
        visibility: 'internal',
        message: 'Incident reported.',
        occurredAt: '2026-07-27T10:00:00.000Z',
        isDemo: false,
      },
    ],
    tasks: [
      {
        id: 'task-1',
        organizationId: 'org-1',
        incidentId: 'incident-1',
        title: 'Compare deployment changes',
        priority: 'critical',
        status: 'todo',
        source: 'human',
        orderIndex: 1,
        dueAt: '2026-07-28T15:00:00.000Z',
        isDemo: false,
      },
    ],
    taskSummary: {
      total: 1,
      todo: 1,
      inProgress: 0,
      blocked: 0,
      done: 0,
      cancelled: 0,
      criticalOpen: 1,
      overdue: 0,
      unassigned: 1,
    },
    timeline: [
      {
        id: 'update-1',
        organizationId: 'org-1',
        incidentId: 'incident-1',
        eventType: 'incident_created',
        actorType: 'user',
        visibility: 'internal',
        message: 'Incident reported.',
        occurredAt: '2026-07-27T10:00:00.000Z',
        isDemo: false,
      },
    ],
    assignmentOptions: [
      {
        membershipId: 'm1',
        userId: 'user-1',
        displayName: 'Alex Rivera',
        role: 'admin',
        status: 'active',
      },
    ],
    capabilities: [
      'CREATE_TASK',
      'CLAIM_TASK',
      'UPDATE_OWN_TASK',
      'REASSIGN_TASK',
      'ADD_INTERNAL_NOTE',
    ],
  }),
  createIncident: vi.fn(),
  getDashboardOverview: vi.fn().mockResolvedValue({
    activeIncidentsCount: 1,
    sev1Sev2Active: 1,
    openTasks: 1,
    taskDataAvailable: true,
    taskSummary: {
      total: 1,
      todo: 1,
      inProgress: 0,
      blocked: 0,
      done: 0,
      cancelled: 0,
      criticalOpen: 1,
      overdue: 0,
      unassigned: 1,
    },
    resolvedThisWeek: 0,
    averageTimeToAcknowledge: null,
    averageTimeToResolve: null,
    activeIncidents: [
      {
        id: 'incident-1',
        organizationId: 'org-1',
        code: 'SF-2026-0001',
        title: 'Checkout failure',
        description: 'Customers cannot complete checkout.',
        source: 'manual',
        reporterUserId: 'user-1',
        severity: 'SEV1',
        severitySource: 'rule_baseline',
        status: 'reported',
        reportedAt: '2026-07-27T10:00:00.000Z',
        recoveryVerified: false,
        publicVisibility: 'private',
        isDemo: false,
        reopenedCount: 0,
      },
    ],
    needsAttention: [],
    recentActivity: [
      {
        id: 'update-1',
        organizationId: 'org-1',
        incidentId: 'incident-1',
        eventType: 'incident_created',
        actorType: 'user',
        visibility: 'internal',
        message: 'Incident reported.',
        occurredAt: '2026-07-27T10:00:00.000Z',
        isDemo: false,
      },
    ],
    recentIncidents: [
      {
        id: 'incident-1',
        organizationId: 'org-1',
        code: 'SF-2026-0001',
        title: 'Checkout failure',
        description: 'Customers cannot complete checkout.',
        source: 'manual',
        reporterUserId: 'user-1',
        severity: 'SEV1',
        severitySource: 'rule_baseline',
        status: 'reported',
        reportedAt: '2026-07-27T10:00:00.000Z',
        recoveryVerified: false,
        publicVisibility: 'private',
        isDemo: false,
        reopenedCount: 0,
      },
    ],
    serviceSummary: { operational: 1, degraded: 0, outage: 0, maintenance: 0 },
    teamLoad: [],
    quickCreateCapability: true,
    demoWorkspaceState: { isDemo: false, canSeed: true },
  }),
  listIncidentTasks: vi.fn().mockResolvedValue({
    tasks: [
      {
        id: 'task-1',
        organizationId: 'org-1',
        incidentId: 'incident-1',
        title: 'Compare deployment changes',
        priority: 'critical',
        status: 'todo',
        source: 'human',
        orderIndex: 1,
        dueAt: '2026-07-28T15:00:00.000Z',
        isDemo: false,
      },
    ],
    nextCursor: null,
    summary: {
      total: 1,
      todo: 1,
      inProgress: 0,
      blocked: 0,
      done: 0,
      cancelled: 0,
      criticalOpen: 1,
      overdue: 0,
      unassigned: 1,
    },
  }),
  createIncidentTask: vi.fn(),
  claimTask: vi.fn(),
  unclaimTask: vi.fn(),
  assignIncidentTask: vi.fn(),
  updateIncidentTask: vi.fn(),
  addIncidentNote: vi.fn(),
  listIncidentTimeline: vi.fn().mockResolvedValue({
    items: [
      {
        id: 'update-1',
        organizationId: 'org-1',
        incidentId: 'incident-1',
        eventType: 'incident_created',
        actorType: 'user',
        visibility: 'internal',
        message: 'Incident reported.',
        occurredAt: '2026-07-27T10:00:00.000Z',
        isDemo: false,
      },
    ],
    nextCursor: null,
    direction: 'desc',
  }),
  seedDemoData: vi.fn(),
  resetDemoData: vi.fn(),
};

vi.mock('@/features/operations/operationalGateway', () => ({
  getOperationalGateway: () => gateway,
}));

vi.mock('@/features/organization/OrganizationProvider', () => ({
  useOrganization: () => ({
    context: {
      organization: {
        id: 'org-1',
        name: 'Acme',
        slug: 'acme',
        defaultTimezone: 'UTC',
        incidentPrefix: 'SF',
        publicStatusEnabled: false,
        createdByUserId: 'user-1',
        isDemo: false,
      },
      membership: { userId: 'user-1', role: 'admin', status: 'active' },
    },
    members: [
      {
        membershipId: 'm1',
        userId: 'user-1',
        displayName: 'Alex Rivera',
        role: 'admin',
        status: 'active',
      },
    ],
    refreshMembers: vi.fn(),
    selectActiveOrganization: vi.fn(),
  }),
}));

const renderRoom = () =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        })
      }
    >
      <MemoryRouter initialEntries={['/app/incidents/incident-1']}>
        <Routes>
          <Route path="/app/incidents/:incidentId" element={<LiveIncidentRoom />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

const renderDashboard = () =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        })
      }
    >
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route path="/app" element={<LiveDashboard />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

const renderServices = () =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        })
      }
    >
      <MemoryRouter initialEntries={['/app/services']}>
        <Routes>
          <Route path="/app/services" element={<LiveServices />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

describe('Phase 05 interactive affordance audit', () => {
  beforeEach(() => vi.clearAllMocks());

  it('exports shared operational action primitives with distinct treatments', () => {
    expect(primaryActionButton).toContain('bg-[#D6FF3F]');
    expect(primaryActionButton).toContain('cursor-pointer');
    expect(primaryActionButton).toContain('focus-visible:outline');
    expect(primaryActionButton).toContain('disabled:cursor-not-allowed');

    expect(secondaryActionButton).toContain('border-[#D6FF3F]/40');
    expect(limeActionButton).toBe(secondaryActionButton);

    expect(neutralActionButton).toContain('border-[#242522]');
    expect(neutralActionButton).toContain('bg-[#141513]');
    expect(compactNeutralActionButton).toContain('min-h-[32px]');
    expect(compactNeutralActionButton).toContain('border-[#242522]');

    expect(warningActionButton).toContain('border-amber-500/50');
    expect(tabButton).toContain('cursor-pointer');
    expect(tabButtonActive).toContain('text-[#D6FF3F]');
    expect(tabButtonInactive).toContain('text-[#A8AAA3]');
    expect(tabButtonInactive).not.toContain('text-[#5C5E58]');
  });

  it('renders CREATE TASK, REFRESH, CLAIM, UNCLAIM, COMPLETE, and MARK BLOCKED with role-correct button treatments', async () => {
    const user = userEvent.setup();
    renderRoom();

    await user.click(await screen.findByRole('tab', { name: 'TASKS' }));

    const createOpener = await screen.findByRole('button', { name: 'CREATE TASK' });
    expect(createOpener).toHaveAttribute('type', 'button');
    expect(createOpener).toHaveClass(
      'inline-flex',
      'min-h-[36px]',
      'border',
      'border-[#D6FF3F]/40',
      'cursor-pointer',
      'focus-visible:outline',
    );

    const refresh = screen.getByRole('button', { name: 'REFRESH' });
    expect(refresh).toHaveAttribute('type', 'button');
    expect(refresh).toHaveClass(
      'inline-flex',
      'min-h-[32px]',
      'border',
      'border-[#242522]',
      'bg-[#141513]',
      'cursor-pointer',
      'focus-visible:outline',
    );

    const claim = screen.getByRole('button', { name: 'CLAIM' });
    expect(claim).toHaveClass(
      'inline-flex',
      'min-h-[36px]',
      'border',
      'border-[#D6FF3F]/40',
      'font-mono',
      'font-bold',
      'cursor-pointer',
      'focus-visible:outline',
    );

    gateway.listIncidentTasks.mockResolvedValueOnce({
      tasks: [
        {
          id: 'task-in-progress',
          organizationId: 'org-1',
          incidentId: 'incident-1',
          title: 'Claimed task',
          priority: 'high',
          status: 'in_progress',
          assigneeUserId: 'user-1',
          source: 'human',
          orderIndex: 2,
          isDemo: false,
        },
      ],
      nextCursor: null,
      summary: {
        total: 1,
        todo: 0,
        inProgress: 1,
        blocked: 0,
        done: 0,
        cancelled: 0,
        criticalOpen: 0,
        overdue: 0,
        unassigned: 0,
      },
    });
    await user.click(refresh);
    expect(await screen.findByRole('button', { name: 'UNCLAIM' })).toHaveClass(
      'inline-flex',
      'min-h-[36px]',
      'border',
      'border-[#242522]',
      'font-mono',
      'font-bold',
      'cursor-pointer',
      'focus-visible:outline',
    );
    expect(screen.getByRole('button', { name: 'MARK BLOCKED' })).toHaveClass(
      'inline-flex',
      'border-amber-500/50',
      'text-amber-400',
      'focus-visible:outline',
    );
    expect(screen.getByRole('button', { name: 'COMPLETE' })).toHaveClass(
      'inline-flex',
      'bg-[#D6FF3F]',
      'text-black',
      'focus-visible:outline',
    );
  });

  it('renders ADD INTERNAL NOTE opener as outlined lime and close/cancel as neutral', async () => {
    const user = userEvent.setup();
    renderRoom();

    const noteOpener = await screen.findByRole('button', { name: 'ADD INTERNAL NOTE' });
    expect(noteOpener).toHaveAttribute('type', 'button');
    expect(noteOpener).toHaveClass(
      'inline-flex',
      'min-h-[36px]',
      'border',
      'border-[#D6FF3F]/40',
      'cursor-pointer',
      'focus-visible:outline',
    );

    await user.click(noteOpener);
    expect(screen.getByRole('button', { name: 'CLOSE NOTE' })).toHaveClass(
      'inline-flex',
      'border-[#242522]',
      'bg-[#141513]',
      'focus-visible:outline',
    );
    expect(screen.getByRole('button', { name: 'ADD INTERNAL NOTE' })).toHaveClass(
      'inline-flex',
      'bg-[#D6FF3F]',
      'text-black',
    );
  });

  it('uses accessible tab semantics with interactive inactive tabs and visible selected state', async () => {
    const user = userEvent.setup();
    renderRoom();

    const timeline = await screen.findByRole('tab', { name: 'TIMELINE' });
    const tasks = screen.getByRole('tab', { name: 'TASKS' });
    const details = screen.getByRole('tab', { name: 'DETAILS' });

    expect(timeline).toHaveAttribute('aria-selected', 'true');
    expect(timeline).toHaveClass('cursor-pointer', 'focus-visible:outline', 'text-[#D6FF3F]');
    expect(tasks).toHaveAttribute('aria-selected', 'false');
    expect(tasks).toHaveClass('cursor-pointer', 'text-[#A8AAA3]');
    expect(details).toHaveAttribute('aria-selected', 'false');
    expect(details).toHaveClass('cursor-pointer', 'text-[#A8AAA3]');
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);

    await user.click(tasks);
    expect(tasks).toHaveAttribute('aria-selected', 'true');
    expect(tasks).toHaveClass('text-[#D6FF3F]');
    expect(timeline).toHaveAttribute('aria-selected', 'false');
    expect(timeline).toHaveClass('text-[#A8AAA3]');
  });

  it('keeps assignment select as a form control rather than an action button', async () => {
    const user = userEvent.setup();
    renderRoom();
    await user.click(await screen.findByRole('tab', { name: 'TASKS' }));

    const assign = await screen.findByLabelText('Assign Compare deployment changes');
    expect(assign.tagName).toBe('SELECT');
    expect(assign).toHaveClass('cursor-pointer', 'border', 'focus-visible:outline');
    expect(assign).not.toHaveClass('bg-[#D6FF3F]');
    expect(assign).not.toHaveClass('uppercase');
  });

  it('disables pending claim against duplicate activation', async () => {
    const user = userEvent.setup();
    gateway.claimTask.mockImplementationOnce(() => new Promise(() => undefined));
    renderRoom();
    await user.click(await screen.findByRole('tab', { name: 'TASKS' }));
    const claim = await screen.findByRole('button', { name: 'CLAIM' });
    await user.click(claim);
    await waitFor(() => expect(claim).toBeDisabled());
    expect(gateway.claimTask).toHaveBeenCalledTimes(1);
  });

  it('keeps dashboard metric labels static while active incident rows remain navigation links', async () => {
    renderDashboard();
    expect(await screen.findByText('OPEN TASKS')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'OPEN TASKS' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ACTIVE' })).not.toBeInTheDocument();

    const incidentLink = screen.getByRole('link', { name: /SF-2026-0001/ });
    expect(incidentLink).toHaveAttribute('href', '/app/incidents/incident-1');
    expect(incidentLink).toHaveClass('cursor-pointer', 'focus-visible:outline');

    // Recent activity messages stay static paragraphs.
    const activity = screen.getByText('Incident reported.');
    expect(activity.tagName).toBe('P');
    expect(activity.closest('a')).toBeNull();
    expect(activity.closest('button')).toBeNull();
  });

  it('renders ADD SERVICE as a primary semantic submit control with form-control selects', async () => {
    renderServices();
    expect(await screen.findByText('Payments API')).toBeInTheDocument();

    const submit = screen.getByRole('button', { name: 'ADD SERVICE' });
    expect(submit).toHaveAttribute('type', 'submit');
    expect(submit).toHaveClass('inline-flex', 'bg-[#D6FF3F]', 'cursor-pointer', 'focus-visible:outline');

    expect(screen.getByLabelText('Service criticality')).toHaveClass('cursor-pointer', 'focus-visible:outline');
    expect(screen.getByLabelText('Service name')).toHaveClass('focus-visible:outline');

    // Service metadata remains static text, not a button.
    expect(screen.queryByRole('button', { name: 'Payments API' })).not.toBeInTheDocument();
  });

  it('keeps the design-system Button cursor and disabled semantics honest', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(
      <Button variant="primary" onClick={onClick}>
        Action
      </Button>,
    );
    const enabled = screen.getByRole('button', { name: 'Action' });
    expect(enabled).toHaveClass('cursor-pointer');
    expect(enabled).toHaveAttribute('type', 'button');
    await user.click(enabled);
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button variant="primary" disabled onClick={onClick}>
        Action
      </Button>,
    );
    const disabled = screen.getByRole('button', { name: 'Action' });
    expect(disabled).toBeDisabled();
    expect(disabled).toHaveClass('disabled:cursor-not-allowed');
    await user.click(disabled);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders CREATE TASK submit with primary treatment when the composer is open', async () => {
    const user = userEvent.setup();
    renderRoom();
    await user.click(await screen.findByRole('tab', { name: 'TASKS' }));
    await user.click(screen.getByRole('button', { name: 'CREATE TASK' }));
    expect(screen.getByRole('button', { name: 'CLOSE TASK FORM' })).toHaveClass(
      'inline-flex',
      'border-[#242522]',
      'focus-visible:outline',
    );
    const submit = screen.getByRole('button', { name: 'CREATE TASK' });
    expect(submit).toHaveAttribute('type', 'submit');
    expect(submit).toHaveClass('inline-flex', 'bg-[#D6FF3F]', 'focus-visible:outline');
  });
});
