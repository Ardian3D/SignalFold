import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LiveIncidentRoom } from '@/features/operations/OperationalViews';
import type { IncidentRealtimeEvent } from '@/features/operations/domain/realtimeTypes';

const incidentBase = {
  id: 'incident-1',
  organizationId: 'org-1',
  code: 'SF-2026-0001',
  title: 'Checkout failure',
  description: 'Customers cannot complete checkout.',
  source: 'manual',
  reporterUserId: 'user-1',
  severity: 'SEV3',
  severitySource: 'rule_baseline',
  status: 'reported',
  reportedAt: '2026-07-27T10:00:00.000Z',
  recoveryVerified: false,
  publicVisibility: 'private',
  isDemo: false,
  reopenedCount: 0,
};

let roomListener: ((event: IncidentRealtimeEvent) => void) | null = null;
const unsubscribeMock = vi.fn();
const subscribeMock = vi.fn((_scope: unknown, listener: (event: IncidentRealtimeEvent) => void) => {
  roomListener = listener;
  return unsubscribeMock;
});

const emit = (event: IncidentRealtimeEvent) => {
  act(() => { if (roomListener) roomListener(event); });
};

vi.mock('@/features/auth/AuthProvider', () => ({ useAuth: () => ({ state: { status: 'AUTHENTICATED' }, isMockMode: false }) }));
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

const incidentReadModel = (timeline: unknown[]) => ({
  incident: incidentBase,
  service: null,
  updates: timeline,
  tasks: [],
  taskSummary: { total: 0, todo: 0, inProgress: 0, blocked: 0, done: 0, cancelled: 0, criticalOpen: 0, overdue: 0, unassigned: 0 },
  timeline,
  assignmentOptions: [],
  openCriticalTaskCount: 0,
  allowedTransitions: ['triaging', 'investigating', 'closed'],
  authority: { canChangeStatus: true, canChangeSeverity: true, canAssignCommander: true, canResolve: false, canClose: false },
  capabilities: ['CHANGE_INCIDENT_STATUS', 'CHANGE_SEVERITY', 'ASSIGN_COMMANDER', 'ADD_INTERNAL_NOTE'],
  aiSuggestion: undefined,
});

const fullGateway = {
  listServices: vi.fn().mockResolvedValue([]),
  createService: vi.fn(),
  updateService: vi.fn(),
  listIncidents: vi.fn().mockResolvedValue({ incidents: [], nextCursor: null }),
  getIncident: vi.fn(),
  createIncident: vi.fn(),
  getDashboardOverview: vi.fn(),
  listIncidentTasks: vi.fn().mockResolvedValue({ tasks: [], nextCursor: null, summary: { total: 0, todo: 0, inProgress: 0, blocked: 0, done: 0, cancelled: 0, criticalOpen: 0, overdue: 0, unassigned: 0 } }),
  createIncidentTask: vi.fn(),
  claimTask: vi.fn(),
  unclaimTask: vi.fn(),
  assignIncidentTask: vi.fn(),
  updateIncidentTask: vi.fn(),
  addIncidentNote: vi.fn(),
  listIncidentTimeline: vi.fn(),
  seedDemoData: vi.fn(),
  resetDemoData: vi.fn(),
  changeIncidentState: vi.fn(),
  changeIncidentSeverity: vi.fn(),
  assignIncidentCommander: vi.fn(),
  resolveIncident: vi.fn(),
  analyzeIncident: vi.fn(),
  applyIncidentAnalysis: vi.fn(),
  subscribeToIncidentRoom: subscribeMock,
};

vi.mock('@/features/operations/operationalGateway', () => ({ getOperationalGateway: () => fullGateway }));

const timeline = [
  { id: 'u-1', organizationId: 'org-1', incidentId: 'incident-1', eventType: 'incident_created', actorType: 'user', visibility: 'internal', message: 'Incident reported.', occurredAt: '2026-07-27T10:00:00.000Z', isDemo: false },
];

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

describe('Phase 08 Incident Room realtime UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    roomListener = null;
    fullGateway.getIncident.mockResolvedValue(incidentReadModel(timeline));
    fullGateway.listIncidentTimeline.mockResolvedValue({ items: timeline, nextCursor: null, direction: 'desc' });
  });

  it('shows the LIVE marker on a timeline item received via realtime', async () => {
    renderRoom();
    await waitFor(() => expect(screen.getByText('INCIDENT TIMELINE')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Incident reported.')).toBeInTheDocument());
    expect(screen.queryByText('LIVE')).toBeNull();
    // Simulate a realtime IncidentUpdate
    emit({ entity: 'timeline', changeType: 'create', recordId: 'u-2', organizationId: 'org-1', incidentId: 'incident-1' });
    fullGateway.listIncidentTimeline.mockResolvedValue({ items: [
      { id: 'u-2', organizationId: 'org-1', incidentId: 'incident-1', eventType: 'internal_note_added', actorType: 'user', visibility: 'internal', message: 'Live note arrived.', occurredAt: new Date().toISOString(), isDemo: false },
      ...timeline,
    ], nextCursor: null, direction: 'desc' });
    await waitFor(() => expect(screen.getByText('LIVE')).toBeInTheDocument());
  });

  it('does not mark initial page-load timeline events as LIVE', async () => {
    renderRoom();
    await waitFor(() => expect(screen.getByText('Incident reported.')).toBeInTheDocument());
    expect(screen.queryByText('LIVE')).toBeNull();
  });

  it('shows the disconnected banner with exact safe wording when offline', async () => {
    renderRoom();
    await waitFor(() => expect(screen.getByText('INCIDENT TIMELINE')).toBeInTheDocument());
    act(() => { window.dispatchEvent(new Event('offline')); });
    await waitFor(() => expect(screen.getByText('Realtime disconnected — retrying.')).toBeInTheDocument());
    act(() => { window.dispatchEvent(new Event('online')); });
    await waitFor(() => expect(screen.queryByText('Realtime disconnected — retrying.')).toBeNull());
  });

  it('keeps the Incident Room mounted (no full page reload) on realtime events', async () => {
    renderRoom();
    await waitFor(() => expect(screen.getByText('INCIDENT TIMELINE')).toBeInTheDocument());
    const url = window.location.href;
    emit({ entity: 'task', changeType: 'create', recordId: 'task-1', organizationId: 'org-1', incidentId: 'incident-1' });
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(window.location.href).toBe(url);
  });

  it('keeps tabs Timeline / Tasks / Details intact', async () => {
    renderRoom();
    await waitFor(() => expect(screen.getByRole('tab', { name: 'TIMELINE' })).toBeInTheDocument());
    expect(screen.getByRole('tab', { name: 'TASKS' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'DETAILS' })).toBeInTheDocument();
    expect(document.querySelectorAll('[role="tab"]').length).toBe(3);
  });
});
