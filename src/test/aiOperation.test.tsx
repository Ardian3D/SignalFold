import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { AppShell } from '@/layouts/AppShell';
import { IncidentRoomPage } from '@/pages/IncidentRoomPage';
import { PostmortemFoundationPage } from '@/pages/PostmortemFoundationPage';

describe('Global States Phase 02 - AI Failure, Timeout & Retry Foundation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // Default state checks
  it('verifies default frontend behaviour remains unchanged when no query parameter is provided', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/incidents/SF-2026-0042']}>
          <AppShell>
            <IncidentRoomPage />
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    // AI Triage Review header exists
    expect(screen.getByText('AI TRIAGE REVIEW')).toBeInTheDocument();

    // No pending, error, fallback, or retry states should be visible by default
    expect(screen.queryByText('AI TRIAGE REQUEST IN PROGRESS')).not.toBeInTheDocument();
    expect(screen.queryByText('AI SERVICE UNAVAILABLE')).not.toBeInTheDocument();
    expect(screen.queryByText('AI REQUEST TIMED OUT')).not.toBeInTheDocument();
    expect(screen.queryByText('AI RESPONSE COULD NOT BE VALIDATED')).not.toBeInTheDocument();
    expect(screen.queryByText('AI REQUEST RATE LIMITED')).not.toBeInTheDocument();
    expect(screen.queryByText('CACHED TRIAGE RESULT AVAILABLE')).not.toBeInTheDocument();
    expect(screen.queryByText('RETRY AI OPERATION')).not.toBeInTheDocument();

    // The regular structured suggested content is visible
    expect(screen.getAllByText(/Customers cannot complete card payments/i).length).toBeGreaterThan(0);
    // But the cached warning is NOT visible
    expect(screen.queryByText('CACHED FRONTEND FALLBACK — NON-AUTHORITATIVE DEMO RESULT')).not.toBeInTheDocument();
  });

  // Incident Triage - Pending State
  it('verifies pending state under incident triage displays correct messages and roles', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/incidents/SF-2026-0042?previewAiOperation=triage&previewAiState=pending']}>
          <AppShell>
            <IncidentRoomPage />
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    // AI Operation Pending Banner should be rendered
    const pendingBanner = screen.getByRole('status');
    expect(pendingBanner).toBeInTheDocument();
    expect(pendingBanner).toHaveAttribute('aria-live', 'polite');
    
    expect(screen.getByText('AI TRIAGE REQUEST IN PROGRESS')).toBeInTheDocument();
    expect(screen.getByText(/SignalFold is waiting for a structured AI response/)).toBeInTheDocument();
    
    // Check some metadata are loaded
    expect(screen.getByText('PROVIDER')).toBeInTheDocument();
    expect(screen.getByText('DEEPSEEK')).toBeInTheDocument();
    expect(screen.getByText('OPERATION')).toBeInTheDocument();
    expect(screen.getByText('INCIDENT_TRIAGE')).toBeInTheDocument();

    // The disabled cancel request button
    const cancelBtn = screen.getByRole('button', { name: 'CANCEL REQUEST' });
    expect(cancelBtn).toBeDisabled();
    expect(screen.getByText('NO REAL REQUEST EXISTS')).toBeInTheDocument();
  });

  // Incident Triage - Error States & Retry
  it('verifies unavailable state, error detail code, retry button, and transition to pending', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/incidents/SF-2026-0042?previewAiOperation=triage&previewAiState=unavailable']}>
          <AppShell>
            <IncidentRoomPage />
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    // Should render with alert role
    const alertBanner = screen.getByRole('alert');
    expect(alertBanner).toBeInTheDocument();

    expect(screen.getByText('AI SERVICE UNAVAILABLE')).toBeInTheDocument();
    expect(screen.getByText('AI_UNAVAILABLE')).toBeInTheDocument();
    expect(screen.getByText(/DeepSeek cannot currently be reached/)).toBeInTheDocument();

    // Verify structured suggestions are preserved
    expect(screen.getAllByText(/Customers cannot complete card payments/i).length).toBeGreaterThan(0);
    // Verify cached notice is also rendered
    expect(screen.getByText('CACHED FRONTEND FALLBACK — NON-AUTHORITATIVE DEMO RESULT')).toBeInTheDocument();

    // Click RETRY AI OPERATION
    const retryBtn = screen.getByRole('button', { name: 'Retry AI Operation as Frontend Preview' });
    expect(retryBtn).toBeInTheDocument();
    
    fireEvent.click(retryBtn);

    // State transitions to pending
    expect(screen.getByText('AI TRIAGE REQUEST IN PROGRESS')).toBeInTheDocument();
    expect(screen.queryByText('AI SERVICE UNAVAILABLE')).not.toBeInTheDocument();
  });

  // Incident Triage - Timeout State
  it('verifies timeout state with correct copy, detail code, and fallback action', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/incidents/SF-2026-0042?previewAiOperation=triage&previewAiState=timeout']}>
          <AppShell>
            <IncidentRoomPage />
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    expect(screen.getByText('AI REQUEST TIMED OUT')).toBeInTheDocument();
    expect(screen.getByText('AI_TIMEOUT')).toBeInTheDocument();
    expect(screen.getByText(/No structured triage response was received within the expected operation window/)).toBeInTheDocument();

    // Click USE CACHED DEMO RESULT
    const fallbackBtn = screen.getByRole('button', { name: 'Use Cached Demo Result' });
    expect(fallbackBtn).toBeInTheDocument();

    fireEvent.click(fallbackBtn);

    // State transitions to fallback_available
    expect(screen.getByText('CACHED TRIAGE RESULT AVAILABLE')).toBeInTheDocument();
    expect(screen.getByText('CACHED AI OUTPUT REMAINS A SUGGESTION, NOT A DECISION.')).toBeInTheDocument();
    expect(screen.getByText(/SignalFold is showing the existing cached demonstration result/)).toBeInTheDocument();
    expect(screen.queryByText('AI REQUEST TIMED OUT')).not.toBeInTheDocument();
  });

  // Incident Triage - Invalid Response State
  it('verifies invalid_response state copy and detail code', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/incidents/SF-2026-0042?previewAiOperation=triage&previewAiState=invalid']}>
          <AppShell>
            <IncidentRoomPage />
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    expect(screen.getByText('AI RESPONSE COULD NOT BE VALIDATED')).toBeInTheDocument();
    expect(screen.getByText('AI_INVALID_RESPONSE')).toBeInTheDocument();
    expect(screen.getByText(/The provider response did not satisfy/)).toBeInTheDocument();
  });

  // Incident Triage - Rate Limited State
  it('verifies rate-limited state copy and detail code', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/incidents/SF-2026-0042?previewAiOperation=triage&previewAiState=rate-limited']}>
          <AppShell>
            <IncidentRoomPage />
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    expect(screen.getByText('AI REQUEST RATE LIMITED')).toBeInTheDocument();
    expect(screen.getByText('RATE_LIMITED')).toBeInTheDocument();
    expect(screen.getByText(/The AI provider cannot accept another request yet/)).toBeInTheDocument();
  });

  // Incident Triage - Dismiss notice
  it('verifies triage feedback notice can be dismissed', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/incidents/SF-2026-0042?previewAiOperation=triage&previewAiState=unavailable']}>
          <AppShell>
            <IncidentRoomPage />
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    expect(screen.getByText('AI SERVICE UNAVAILABLE')).toBeInTheDocument();

    const dismissBtn = screen.getByRole('button', { name: 'Dismiss AI operation notice' });
    expect(dismissBtn).toBeInTheDocument();

    fireEvent.click(dismissBtn);

    // Notice should disappear
    expect(screen.queryByText('AI SERVICE UNAVAILABLE')).not.toBeInTheDocument();
    // But cached content warning remains hidden too because the banner is dismissed
    expect(screen.queryByText('CACHED FRONTEND FALLBACK — NON-AUTHORITATIVE DEMO RESULT')).not.toBeInTheDocument();
    // Structured content is still fully visible
    expect(screen.getAllByText(/Customers cannot complete card payments/i).length).toBeGreaterThan(0);
  });

  // Postmortem context
  it('verifies postmortem state under generation readiness drawer', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/incidents/resolved-seed/postmortem?previewAiOperation=postmortem&previewAiState=unavailable']}>
          <AppShell>
            <PostmortemFoundationPage />
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    // Open readiness drawer
    const openReadinessBtn = screen.getByRole('button', { name: /REVIEW GENERATION READINESS/i });
    expect(openReadinessBtn).toBeInTheDocument();
    fireEvent.click(openReadinessBtn);

    // Readiness drawer is now open, check if feedback is rendered inside
    const alertBanner = screen.getByRole('alert');
    expect(alertBanner).toBeInTheDocument();
    
    expect(screen.getByText('AI SERVICE UNAVAILABLE')).toBeInTheDocument();
    expect(screen.getByText('AI_UNAVAILABLE')).toBeInTheDocument();
    expect(screen.getByText(/DeepSeek cannot currently be reached/)).toBeInTheDocument();

    // For postmortem, fallback button should NOT be rendered (no demo content fallback exists)
    expect(screen.queryByRole('button', { name: 'Use Cached Demo Result' })).not.toBeInTheDocument();

    // Verify layout order: beneath metadata and before Record Eligibility
    // The drawer is visible, and includes standard components
    expect(screen.getByText('01 / RECORD ELIGIBILITY')).toBeInTheDocument();

    // Click retry
    const retryBtn = screen.getByRole('button', { name: 'Retry AI Operation as Frontend Preview' });
    fireEvent.click(retryBtn);

    // Transitions to pending
    expect(screen.getByText('POSTMORTEM DRAFT REQUEST IN PROGRESS')).toBeInTheDocument();
    expect(screen.queryByText('AI SERVICE UNAVAILABLE')).not.toBeInTheDocument();
  });
});
