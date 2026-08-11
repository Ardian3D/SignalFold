import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LiveIncidentRoom } from '@/features/operations/OperationalViews';

const suggestion = {
  summary: 'Checkout payments failing after deployment.',
  severitySuggestion: 'SEV1',
  category: 'payments',
  impact: '37 customers impacted.',
  confidence: 0.82,
  riskFlags: ['payment_failure'],
  clarifyingQuestions: ['Is the gateway reporting errors?'],
  recommendedTasks: [{ title: 'Compare deployment changes', description: 'Diff recent release', priority: 'critical' }],
  immediateNextAction: 'Prepare rollback.',
};

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

const gateway = {
  listServices: vi.fn().mockResolvedValue([]),
  createService: vi.fn(),
  updateService: vi.fn(),
  listIncidents: vi.fn().mockResolvedValue({ incidents: [], nextCursor: null }),
  getIncident: vi.fn().mockResolvedValue({
    incident: incidentBase,
    service: { id: 'service-1', organizationId: 'org-1', name: 'Payments API', slug: 'payments-api', criticality: 'critical', operationalStatus: 'operational', tags: [], isActive: true, isDemo: false },
    updates: [],
    tasks: [],
    taskSummary: { total: 0, todo: 0, inProgress: 0, blocked: 0, done: 0, cancelled: 0, criticalOpen: 0, overdue: 0, unassigned: 0 },
    timeline: [],
    assignmentOptions: [{ membershipId: 'm1', userId: 'user-1', displayName: 'Alex Rivera', role: 'admin', status: 'active' }],
    commanderOptions: [{ membershipId: 'm1', userId: 'user-1', displayName: 'Alex Rivera', role: 'admin', status: 'active' }],
    openCriticalTaskCount: 0,
    allowedTransitions: ['triaging', 'investigating', 'closed'],
    authority: { canChangeStatus: true, canChangeSeverity: true, canAssignCommander: true, canResolve: false, canClose: false },
    capabilities: ['CHANGE_INCIDENT_STATUS', 'CHANGE_SEVERITY', 'ASSIGN_COMMANDER', 'RUN_AI_TRIAGE', 'CREATE_TASK', 'ADD_INTERNAL_NOTE'],
    aiSuggestion: undefined,
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
  changeIncidentState: vi.fn(),
  changeIncidentSeverity: vi.fn(),
  assignIncidentCommander: vi.fn(),
  resolveIncident: vi.fn(),
  analyzeIncident: vi.fn(),
  applyIncidentAnalysis: vi.fn(),
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

describe('Phase 07 AI triage UI', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows ANALYZE WITH AI for authorized managers/admins without firing on mount', async () => {
    renderRoom();
    await waitFor(() => expect(gateway.getIncident).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByRole('button', { name: 'ANALYZE WITH AI' })).toBeInTheDocument());
    expect(gateway.analyzeIncident).not.toHaveBeenCalled();
  });

  it('does not call analyze on every render', async () => {
    renderRoom();
    await waitFor(() => expect(screen.getByRole('button', { name: 'ANALYZE WITH AI' })).toBeInTheDocument());
    expect(gateway.analyzeIncident).not.toHaveBeenCalled();
  });

  it('submits analysis on explicit click and shows suggestion metadata', async () => {
    const user = userEvent.setup();
    gateway.analyzeIncident.mockResolvedValueOnce({ suggestion, cached: false, model: 'deepseek-v4-flash', promptVersion: 'triage-v1', reviewStatus: 'pending' });
    renderRoom();
    await waitFor(() => expect(screen.getByRole('button', { name: 'ANALYZE WITH AI' })).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'ANALYZE WITH AI' }));
    await waitFor(() => expect(gateway.analyzeIncident).toHaveBeenCalledTimes(1));
    expect(gateway.analyzeIncident.mock.calls[0][0]).toMatchObject({ organizationId: 'org-1', incidentId: 'incident-1' });
    expect(gateway.analyzeIncident.mock.calls[0][0]).not.toHaveProperty('forceRegenerate');
  });

  it('renders an existing AI suggestion with review-required provenance', async () => {
    gateway.getIncident.mockResolvedValueOnce({
      incident: incidentBase,
      service: null,
      updates: [],
      tasks: [],
      taskSummary: { total: 0, todo: 0, inProgress: 0, blocked: 0, done: 0, cancelled: 0, criticalOpen: 0, overdue: 0, unassigned: 0 },
      timeline: [],
      assignmentOptions: [],
      openCriticalTaskCount: 0,
      allowedTransitions: ['triaging', 'investigating', 'closed'],
      authority: { canChangeStatus: true, canChangeSeverity: true, canAssignCommander: true, canResolve: false, canClose: false },
      capabilities: ['RUN_AI_TRIAGE'],
      aiSuggestion: { aiRunId: 'run-1', analysis: suggestion, review: { status: 'pending' }, model: 'deepseek-v4-flash', promptVersion: 'triage-v1', generatedAt: '2026-08-11T10:00:00.000Z', confidence: 0.82 },
    });
    renderRoom();
    await waitFor(() => expect(screen.getByText('AI SUGGESTION')).toBeInTheDocument());
    expect(screen.getByText(/REVIEW PENDING/i)).toBeInTheDocument();
    expect(screen.getByText(/DEEPSEEK-V4-FLASH/i)).toBeInTheDocument();
    expect(screen.getByText(/82% CONFIDENCE/i)).toBeInTheDocument();
    expect(screen.getByText('Checkout payments failing after deployment.')).toBeInTheDocument();
    expect(screen.getByLabelText('Task title 1')).toHaveValue('Compare deployment changes');
  });

  it('requires explicit apply after review and does not mutate incident directly', async () => {
    const user = userEvent.setup();
    gateway.getIncident.mockResolvedValueOnce({
      incident: incidentBase,
      service: null,
      updates: [],
      tasks: [],
      taskSummary: { total: 0, todo: 0, inProgress: 0, blocked: 0, done: 0, cancelled: 0, criticalOpen: 0, overdue: 0, unassigned: 0 },
      timeline: [],
      assignmentOptions: [],
      openCriticalTaskCount: 0,
      allowedTransitions: ['triaging', 'investigating', 'closed'],
      authority: { canChangeStatus: true, canChangeSeverity: true, canAssignCommander: true, canResolve: false, canClose: false },
      capabilities: ['RUN_AI_TRIAGE'],
      aiSuggestion: { aiRunId: 'run-1', analysis: suggestion, review: { status: 'pending' }, model: 'deepseek-v4-flash', promptVersion: 'triage-v1', generatedAt: '2026-08-11T10:00:00.000Z', confidence: 0.82 },
    });
    renderRoom();
    await waitFor(() => expect(screen.getByText('AI SUGGESTION')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'REVIEW SUGGESTIONS' }));
    await user.click(screen.getAllByRole('button', { name: 'APPLY REVIEWED SUGGESTIONS' })[0]);
    await waitFor(() => expect(gateway.applyIncidentAnalysis).toHaveBeenCalledTimes(1));
    const input = gateway.applyIncidentAnalysis.mock.calls[0][0];
    expect(input).toMatchObject({ organizationId: 'org-1', incidentId: 'incident-1', aiRunId: 'run-1' });
    expect(gateway.changeIncidentSeverity).not.toHaveBeenCalled();
    expect(gateway.changeIncidentState).not.toHaveBeenCalled();
  });

  it('keeps Incident Room tabs to Timeline / Tasks / Details', async () => {
    renderRoom();
    await waitFor(() => expect(screen.getByRole('tab', { name: 'TIMELINE' })).toBeInTheDocument());
    expect(screen.getByRole('tab', { name: 'TASKS' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'DETAILS' })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'AI TRIAGE' })).toBeNull();
    expect(document.querySelectorAll('[role="tab"]').length).toBe(3);
  });

  it('shows a safe error message on analysis failure without disabling manual controls', async () => {
    const user = userEvent.setup();
    gateway.analyzeIncident.mockRejectedValueOnce(new Error('AI_TIMEOUT'));
    renderRoom();
    await waitFor(() => expect(screen.getByRole('button', { name: 'ANALYZE WITH AI' })).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'ANALYZE WITH AI' }));
    await waitFor(() => expect(screen.getByText(/AI ANALYSIS COULD NOT BE COMPLETED/i)).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'CHANGE STATUS' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CHANGE SEVERITY' })).toBeInTheDocument();
  });

  it('does not render raw ids or unsafe html', async () => {
    gateway.getIncident.mockResolvedValueOnce({
      incident: incidentBase,
      service: null,
      updates: [],
      tasks: [],
      taskSummary: { total: 0, todo: 0, inProgress: 0, blocked: 0, done: 0, cancelled: 0, criticalOpen: 0, overdue: 0, unassigned: 0 },
      timeline: [],
      assignmentOptions: [],
      openCriticalTaskCount: 0,
      allowedTransitions: ['triaging', 'investigating', 'closed'],
      authority: { canChangeStatus: true, canChangeSeverity: true, canAssignCommander: true, canResolve: false, canClose: false },
      capabilities: ['RUN_AI_TRIAGE'],
      aiSuggestion: { aiRunId: 'run-1', analysis: { ...suggestion, summary: '<b>bold</b> plain', impact: 'impact <script>alert(1)</script>' }, review: { status: 'pending' }, model: 'deepseek-v4-flash', promptVersion: 'triage-v1', generatedAt: '2026-08-11T10:00:00.000Z', confidence: 0.82 },
    });
    renderRoom();
    await waitFor(() => expect(screen.getByText('AI SUGGESTION')).toBeInTheDocument());
    expect(document.querySelector('script')).toBeNull();
    expect(document.querySelectorAll('script').length).toBe(0);
    expect(screen.getByLabelText('AI summary')).toHaveValue('<b>bold</b> plain');
  });

  it('requires explicit confirmation before regeneration', async () => {
    const user = userEvent.setup();
    gateway.getIncident.mockResolvedValueOnce({
      incident: incidentBase,
      service: null,
      updates: [],
      tasks: [],
      taskSummary: { total: 0, todo: 0, inProgress: 0, blocked: 0, done: 0, cancelled: 0, criticalOpen: 0, overdue: 0, unassigned: 0 },
      timeline: [],
      assignmentOptions: [],
      openCriticalTaskCount: 0,
      allowedTransitions: ['triaging', 'investigating', 'closed'],
      authority: { canChangeStatus: true, canChangeSeverity: true, canAssignCommander: true, canResolve: false, canClose: false },
      capabilities: ['RUN_AI_TRIAGE'],
      aiSuggestion: { aiRunId: 'run-1', analysis: suggestion, review: { status: 'pending' }, model: 'deepseek-v4-flash', promptVersion: 'triage-v1', generatedAt: '2026-08-11T10:00:00.000Z', confidence: 0.82 },
    });
    renderRoom();
    await waitFor(() => expect(screen.getByText('AI SUGGESTION')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'REGENERATE' }));
    expect(gateway.analyzeIncident).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'CONFIRM REGENERATE' }));
    await waitFor(() => expect(gateway.analyzeIncident).toHaveBeenCalledTimes(1));
    expect(gateway.analyzeIncident.mock.calls[0][0]).toMatchObject({ forceRegenerate: true, confirmRegenerate: true });
  });
});
