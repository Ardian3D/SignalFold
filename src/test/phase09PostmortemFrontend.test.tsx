import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PostmortemPage } from '@/pages/PostmortemPage';
import { projectPostmortem } from '@/features/operations/adapters/Base44OperationalGateway';

const postmortemRecord = (overrides: Record<string, unknown> = {}) => ({
  id: 'pm-1',
  organizationId: 'org-1',
  incidentId: 'incident-1',
  status: 'draft',
  executiveSummary: 'Checkout payment failures were resolved after rollback.',
  impact: '37 customers could not complete card payments.',
  detection: 'Incoming customer reports after the latest deployment.',
  timelineSummary: [{ at: '2026-07-27T10:00:00.000Z', event: 'Incident created.' }],
  rootCause: 'Regression introduced by the latest deployment.',
  contributingFactors: ['Deployment change scope not isolated.'],
  resolution: 'Rollback restored service.',
  wentWell: ['Signals were consolidated.'],
  wentPoorly: ['Detection depended on customer reports.'],
  preventiveActions: [{ title: 'Improve payment failure detection', ownerRole: 'Payments API owner', priority: 'high', suggestedDueInDays: 14 }],
  unknowns: ['Exact customer count remains unverified.'],
  generatedByAi: true,
  aiRunId: 'run-1',
  version: 1,
  approvedAt: undefined,
  isDemo: false,
  ...overrides,
});

const gateway = {
  getPostmortem: vi.fn(),
  generatePostmortem: vi.fn(),
  savePostmortemDraft: vi.fn(),
  submitPostmortemForReview: vi.fn(),
  returnPostmortemToDraft: vi.fn(),
  approvePostmortem: vi.fn(),
  createPostmortemDraft: vi.fn(),
};

vi.mock('@/features/operations/operationalGateway', () => ({ getOperationalGateway: () => gateway }));
vi.mock('@/features/organization/OrganizationProvider', () => ({
  useOrganization: () => ({ context: { organization: { id: 'org-1', name: 'Northstar Commerce' }, membership: { role: 'admin', userId: 'user-1' } }, members: [], refreshMembers: vi.fn() }),
}));

const client = () => new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
const renderPage = (clientInstance: QueryClient) => render(
  <QueryClientProvider client={clientInstance}>
    <MemoryRouter initialEntries={['/app/incidents/incident-1/postmortem']}>
      <Routes>
        <Route path="/app/incidents/:incidentId/postmortem" element={<PostmortemPage />} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>,
);

describe('Phase 09 Postmortem editor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'navigator', { value: { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } }, configurable: true });
  });

  it('shows eligibility state for an unresolved incident without a postmortem', async () => {
    gateway.getPostmortem.mockResolvedValue({ postmortem: null, incidentStatus: 'reported' });
    renderPage(client());
    await screen.findByText(/POSTMORTEM ELIGIBILITY/i);
    expect(screen.getByText(/RESOLVED or CLOSED/i)).toBeInTheDocument();
    expect(screen.queryByText('GENERATE POSTMORTEM')).not.toBeInTheDocument();
  });

  it('offers generate and manual draft actions for an eligible resolved incident with no postmortem', async () => {
    gateway.getPostmortem.mockResolvedValue({ postmortem: null, incidentStatus: 'resolved' });
    renderPage(client());
    await screen.findByText('GENERATE POSTMORTEM');
    expect(screen.getByText('CREATE MANUAL DRAFT')).toBeInTheDocument();
  });

  it('shows AI-generated provenance and version for a generated draft', async () => {
    gateway.getPostmortem.mockResolvedValue({ postmortem: postmortemRecord(), incidentStatus: 'resolved', model: 'deepseek-v4-flash', promptVersion: 'postmortem-v1', generatedAt: '2026-07-27T10:00:00.000Z', canEdit: true, canApprove: false });
    renderPage(client());
    await screen.findByText('AI-GENERATED DRAFT');
    expect(screen.getByText(/VERSION 1/i)).toBeInTheDocument();
    expect(screen.getByText(/deepseek-v4-flash/i)).toBeInTheDocument();
    expect(screen.getByText(/postmortem-v1/i)).toBeInTheDocument();
    expect(screen.getByText('SAVE DRAFT')).toBeInTheDocument();
    expect(screen.getByText('SUBMIT FOR REVIEW')).toBeInTheDocument();
  });

  it('saves a human draft without calling AI or creating an AiRun', async () => {
    gateway.getPostmortem.mockResolvedValue({ postmortem: postmortemRecord(), incidentStatus: 'resolved', canEdit: true });
    gateway.savePostmortemDraft.mockResolvedValue({ postmortem: postmortemRecord({ executiveSummary: 'Edited summary' }) });
    renderPage(client());
    await screen.findByText('SAVE DRAFT');
    const summary = screen.getByLabelText(/EXECUTIVE SUMMARY/i);
    await userEvent.clear(summary);
    await userEvent.type(summary, 'Edited summary');
    await userEvent.click(screen.getByText('SAVE DRAFT'));
    await waitFor(() => expect(gateway.savePostmortemDraft).toHaveBeenCalledTimes(1));
    expect(gateway.generatePostmortem).not.toHaveBeenCalled();
    await screen.findByText('DRAFT SAVED');
  });

  it('requires confirmation before regeneration', async () => {
    gateway.getPostmortem.mockResolvedValue({ postmortem: postmortemRecord(), incidentStatus: 'resolved', canEdit: true });
    renderPage(client());
    await screen.findByText('REGENERATE');
    await userEvent.click(screen.getByText('REGENERATE'));
    expect(await screen.findByText(/REGENERATION CONFIRMATION/i)).toBeInTheDocument();
    expect(gateway.generatePostmortem).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText('CONFIRM REGENERATE'));
    await waitFor(() => expect(gateway.generatePostmortem).toHaveBeenCalledWith(expect.objectContaining({ forceRegenerate: true, confirmRegenerate: true })));
  });

  it('shows in-review state with approval control for authorized managers', async () => {
    gateway.getPostmortem.mockResolvedValue({ postmortem: postmortemRecord({ status: 'in_review' }), incidentStatus: 'resolved', canEdit: false, canApprove: true });
    renderPage(client());
    await screen.findByText('IN REVIEW');
    expect(screen.getByText('APPROVE POSTMORTEM')).toBeInTheDocument();
    expect(screen.getByText('RETURN TO DRAFT')).toBeInTheDocument();
    expect(screen.queryByText('SAVE DRAFT')).not.toBeInTheDocument();
    expect(screen.queryByText('REGENERATE')).not.toBeInTheDocument();
  });

  it('approves a postmortem in review', async () => {
    gateway.getPostmortem.mockResolvedValue({ postmortem: postmortemRecord({ status: 'in_review' }), incidentStatus: 'resolved', canApprove: true });
    gateway.approvePostmortem.mockResolvedValue({ postmortem: postmortemRecord({ status: 'approved', approvedByUserId: 'user-1', approvedAt: '2026-07-27T12:00:00.000Z' }) });
    renderPage(client());
    await screen.findByText('APPROVE POSTMORTEM');
    await userEvent.click(screen.getByText('APPROVE POSTMORTEM'));
    await waitFor(() => expect(gateway.approvePostmortem).toHaveBeenCalledTimes(1));
    expect(gateway.generatePostmortem).not.toHaveBeenCalled();
    await screen.findByText('APPROVED');
  });

  it('renders an approved postmortem as read-only without edit, regenerate, submit, or return controls', async () => {
    gateway.getPostmortem.mockResolvedValue({ postmortem: postmortemRecord({ status: 'approved', approvedByUserId: 'user-1', approvedAt: '2026-07-27T12:00:00.000Z' }), incidentStatus: 'resolved', approverName: 'Alex Rivera' });
    renderPage(client());
    await screen.findByText('APPROVED');
    expect(screen.getByText(/Alex Rivera/i)).toBeInTheDocument();
    expect(screen.queryByText('SAVE DRAFT')).not.toBeInTheDocument();
    expect(screen.queryByText('REGENERATE')).not.toBeInTheDocument();
    expect(screen.queryByText('SUBMIT FOR REVIEW')).not.toBeInTheDocument();
    expect(screen.queryByText('RETURN TO DRAFT')).not.toBeInTheDocument();
    expect(screen.getByText('COPY POSTMORTEM')).toBeInTheDocument();
    const summary = screen.getByLabelText(/EXECUTIVE SUMMARY/i);
    expect(summary).toBeDisabled();
  });

  it('supports copying a postmortem without any server mutation', async () => {
    gateway.getPostmortem.mockResolvedValue({ postmortem: postmortemRecord({ status: 'approved', approvedAt: '2026-07-27T12:00:00.000Z' }), incidentStatus: 'resolved' });
    renderPage(client());
    await screen.findByText('COPY POSTMORTEM');
    await userEvent.click(screen.getByText('COPY POSTMORTEM'));
    await waitFor(() => expect(window.navigator.clipboard.writeText).toHaveBeenCalledTimes(1));
    expect(gateway.approvePostmortem).not.toHaveBeenCalled();
    expect(gateway.savePostmortemDraft).not.toHaveBeenCalled();
    await screen.findByText('COPIED');
  });

  it('shows a manual draft with no AI provenance', async () => {
    gateway.getPostmortem.mockResolvedValue({ postmortem: postmortemRecord({ generatedByAi: false, aiRunId: undefined }), incidentStatus: 'resolved', canEdit: true });
    renderPage(client());
    await screen.findByText('POSTMORTEM RECORD');
    expect(screen.queryByText('AI-GENERATED DRAFT')).not.toBeInTheDocument();
    expect(screen.getByText('SAVE DRAFT')).toBeInTheDocument();
  });

  it('shows an AI error state with manual fallback after generation failure', async () => {
    gateway.getPostmortem.mockResolvedValue({ postmortem: null, incidentStatus: 'resolved' });
    gateway.generatePostmortem.mockRejectedValue(new Error('AI_FAILURE'));
    renderPage(client());
    await screen.findByText('GENERATE POSTMORTEM');
    await userEvent.click(screen.getByText('GENERATE POSTMORTEM'));
    await waitFor(() => expect(gateway.generatePostmortem).toHaveBeenCalledTimes(1));
    await screen.findByText(/AI POSTMORTEM GENERATION COULD NOT BE COMPLETED/i);
    expect(screen.getByText('CREATE MANUAL DRAFT')).toBeInTheDocument();
  });

  it('supports the return-to-draft workflow', async () => {
    gateway.getPostmortem.mockResolvedValue({ postmortem: postmortemRecord({ status: 'in_review' }), incidentStatus: 'resolved', canEdit: false, canApprove: true });
    gateway.returnPostmortemToDraft.mockResolvedValue({ postmortem: postmortemRecord({ status: 'draft' }) });
    renderPage(client());
    await screen.findByText('RETURN TO DRAFT');
    await userEvent.click(screen.getByText('RETURN TO DRAFT'));
    await waitFor(() => expect(gateway.returnPostmortemToDraft).toHaveBeenCalledTimes(1));
    expect(gateway.generatePostmortem).not.toHaveBeenCalled();
  });

  it('does not render raw postmortem IDs in visible content', async () => {
    gateway.getPostmortem.mockResolvedValue({ postmortem: postmortemRecord(), incidentStatus: 'resolved', canEdit: true });
    const { container } = renderPage(client());
    await screen.findByText('SAVE DRAFT');
    expect(container.textContent).not.toContain('pm-1');
    expect(container.textContent).not.toContain('run-1');
  });
});

describe('Phase 09 projectPostmortem adapter', () => {
  it('projects snake_case backend records with provenance and approval fields', () => {
    const projected = projectPostmortem({
      id: 'p1',
      organization_id: 'org-1',
      incident_id: 'incident-1',
      status: 'approved',
      executive_summary: 'S',
      impact: 'I',
      timeline_summary: [{ at: 'a', event: 'e' }],
      root_cause: 'R',
      resolution: 'R',
      generated_by_ai: true,
      ai_run_id: 'run-1',
      version: 2,
      approved_by_user_id: 'user-1',
      approved_at: '2026-07-27T12:00:00.000Z',
      is_demo: false,
    });
    expect(projected.organizationId).toBe('org-1');
    expect(projected.incidentId).toBe('incident-1');
    expect(projected.status).toBe('approved');
    expect(projected.generatedByAi).toBe(true);
    expect(projected.aiRunId).toBe('run-1');
    expect(projected.version).toBe(2);
    expect(projected.approvedAt).toBe('2026-07-27T12:00:00.000Z');
    expect(projected.executiveSummary).toBe('S');
  });

  it('does not expose raw provider internals through the projection', () => {
    const projected = projectPostmortem({ id: 'p1', organization_id: 'org-1', incident_id: 'incident-1', status: 'draft', generated_by_ai: true, version: 1, is_demo: false, reasoning_content: 'secret', api_key: 'secret' });
    expect(JSON.stringify(projected)).not.toContain('reasoning_content');
    expect(JSON.stringify(projected)).not.toContain('api_key');
    expect(JSON.stringify(projected)).not.toContain('secret');
  });
});
