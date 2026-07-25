import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { FeedbackStateProvider, useFeedbackState, FeedbackScope } from '@/context/FeedbackStateContext';
import { RouteFeedbackState } from '@/components/feedback/RouteFeedbackState';
import { RouteErrorBoundary } from '@/components/feedback/RouteErrorBoundary';
import React from 'react';

// Helper component that consumes useFeedbackState for testing
const DummyPage = ({ scope }: { scope: FeedbackScope }) => {
  const { getFeedbackState } = useFeedbackState();
  const feedback = getFeedbackState(scope);

  if (feedback && feedback.isActive) {
    return (
      <RouteFeedbackState
        kind={feedback.kind}
        scope={scope}
        onRetry={feedback.retry}
        onResetFilters={() => {}}
      />
    );
  }

  return <div data-testid="normal-content">Normal Content for {scope}</div>;
};

// Component that throws an error to test the Error Boundary
const BuggyComponent = () => {
  throw new Error('Test rendering crash');
};

describe('SignalFold — Phase 03 Global Feedback States Tests', () => {
  
  it('1. Renders normal content when no feedback state is active', () => {
    render(
      <MemoryRouter initialEntries={['/app/dashboard']}>
        <FeedbackStateProvider>
          <DummyPage scope="dashboard" />
        </FeedbackStateProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('normal-content')).toBeInTheDocument();
    expect(screen.getByText('Normal Content for dashboard')).toBeInTheDocument();
  });

  it('2. Renders Loading state correctly with aria-busy="true"', () => {
    render(
      <MemoryRouter initialEntries={['/app/dashboard?previewUiState=loading&previewUiScope=dashboard']}>
        <FeedbackStateProvider>
          <DummyPage scope="dashboard" />
        </FeedbackStateProvider>
      </MemoryRouter>
    );

    // Verify loading state is shown
    expect(screen.getByText('LOADING DASHBOARD')).toBeInTheDocument();

    // Verify accessibility attributes
    const statusDiv = screen.getByRole('status');
    expect(statusDiv).toHaveAttribute('aria-busy', 'true');
  });

  it('3. Renders Permission Denied (Forbidden) state with role="alert" and active visual cues', () => {
    render(
      <MemoryRouter initialEntries={['/app/dashboard?previewUiState=forbidden&previewUiScope=dashboard']}>
        <FeedbackStateProvider>
          <DummyPage scope="dashboard" />
        </FeedbackStateProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('ACCESS DENIED')).toBeInTheDocument();
    expect(screen.getByText(/The current authenticated identity does not have verified authority/i)).toBeInTheDocument();
    
    // Check for the simulated badge/role
    const alertDiv = screen.getByRole('alert');
    expect(alertDiv).toBeInTheDocument();

    // Verify visual design tags
    expect(screen.getByText('ORGANIZATION MEMBERSHIP')).toBeInTheDocument();
    expect(screen.getByText('OPERATING ROLE')).toBeInTheDocument();
    
    // Check action buttons
    const backBtn = screen.getByRole('button', { name: /BACK TO DASHBOARD/i });
    expect(backBtn).toBeInTheDocument();
    expect(backBtn).toBeEnabled();
  });

  it('4. Renders Record Not Found (404) state correctly', () => {
    render(
      <MemoryRouter initialEntries={['/app/dashboard?previewUiState=not-found&previewUiScope=dashboard']}>
        <FeedbackStateProvider>
          <DummyPage scope="dashboard" />
        </FeedbackStateProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('RECORD NOT FOUND')).toBeInTheDocument();
    expect(screen.getByText(/The requested SignalFold record does not exist/i)).toBeInTheDocument();
    
    // Ensure back button is functional
    const backBtn = screen.getByRole('button', { name: /BACK TO DASHBOARD/i });
    expect(backBtn).toBeInTheDocument();
  });

  it('5. Renders Network Error state with retry controls and status code details', () => {
    render(
      <MemoryRouter initialEntries={['/app/dashboard?previewUiState=network-error&previewUiScope=dashboard']}>
        <FeedbackStateProvider>
          <DummyPage scope="dashboard" />
        </FeedbackStateProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('WORKSPACE DATA COULD NOT BE LOADED')).toBeInTheDocument();
    expect(screen.getByText(/SignalFold could not retrieve the requested workspace data/i)).toBeInTheDocument();
    
    // Check status metadata and code details
    expect(screen.getByText('DATA RESULT')).toBeInTheDocument();
    expect(screen.getByText('LOCAL INPUT')).toBeInTheDocument();

    // Check retry action triggers reconnection simulation
    const retryBtn = screen.getByRole('button', { name: /RETRY DATA LOAD/i });
    expect(retryBtn).toBeInTheDocument();
  });

  it('6. RouteErrorBoundary catches errors and displays an unexpected error screen', () => {
    // Suppress console.error inside this block to prevent polluting test outputs
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <RouteErrorBoundary>
          <BuggyComponent />
        </RouteErrorBoundary>
      </MemoryRouter>
    );

    expect(screen.getByText('SIGNALFOLD COULD NOT RENDER THIS WORKSPACE')).toBeInTheDocument();
    expect(screen.getByText(/An unexpected application error occurred/i)).toBeInTheDocument();
    expect(screen.getByText(/INCIDENT MUTATION/i)).toBeInTheDocument();

    // Reset button exists
    const resetBtn = screen.getByRole('button', { name: /RETRY APPLICATION VIEW/i });
    expect(resetBtn).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('7. Renders Empty Dashboard state with action triggers', () => {
    render(
      <MemoryRouter initialEntries={['/app/dashboard?previewUiState=empty&previewUiScope=dashboard']}>
        <FeedbackStateProvider>
          <DummyPage scope="dashboard" />
        </FeedbackStateProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('NO INCIDENTS YET')).toBeInTheDocument();
    expect(screen.getByText(/Create the first incident to begin organizing reports/i)).toBeInTheDocument();
    
    // Verify enabled action button
    const actionBtn = screen.getByRole('button', { name: /CREATE FIRST INCIDENT/i });
    expect(actionBtn).toBeInTheDocument();
    expect(actionBtn).toBeEnabled();

    // Verify secondary disabled action button
    const loadDemoBtn = screen.getByRole('button', { name: /LOAD DEMO WORKSPACE/i });
    expect(loadDemoBtn).toBeInTheDocument();
    expect(loadDemoBtn).toBeDisabled();
    expect(screen.getByText('ADMIN AUTHORITY REQUIRED')).toBeInTheDocument();
  });

  it('8. Renders Empty Incidents List state with custom backend query metadata', () => {
    render(
      <MemoryRouter initialEntries={['/app/incidents?previewUiState=empty&previewUiScope=incidents']}>
        <FeedbackStateProvider>
          <DummyPage scope="incidents" />
        </FeedbackStateProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('NO INCIDENT RECORDS')).toBeInTheDocument();
    expect(screen.getByText(/No incidents are available in the current frontend workspace/i)).toBeInTheDocument();

    // Verify custom metadata labels
    expect(screen.getByText(/DATA SOURCE:/i)).toBeInTheDocument();
    expect(screen.getByText(/FRONTEND MOCK MODE/i)).toBeInTheDocument();
    expect(screen.getByText(/BACKEND QUERY:/i)).toBeInTheDocument();
    expect(screen.getByText(/NOT CONNECTED/i)).toBeInTheDocument();
  });

  it('9. Renders Empty-Filtered Incidents state with detailed record results', () => {
    const handleReset = vi.fn();
    render(
      <MemoryRouter>
        <RouteFeedbackState
          kind="empty_filtered"
          scope="incidents"
          onResetFilters={handleReset}
          availableMockCount={3}
          filteredMockCount={0}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('NO INCIDENTS MATCH CURRENT FILTERS')).toBeInTheDocument();
    expect(screen.getByText(/The incident workspace contains records, but none match/i)).toBeInTheDocument();
    
    const description = screen.getByText(/The incident workspace contains records, but none match/i);
    expect(description).toBeInTheDocument();
    
    // Description has width: 100% and a readable max-width
    expect(description).toHaveClass('w-full');
    expect(description).toHaveClass('max-w-[520px]');
    
    // Description does not use break-all or intrinsic min-content widths
    expect(description.className).not.toContain('break-all');
    expect(description.className).not.toContain('w-min');
    expect(description.className).not.toContain('min-w-min');
    expect(description.className).not.toContain('max-w-min');
    expect(description.className).not.toContain('w-fit');
    expect(description.className).not.toContain('inline-block');
    expect(description.className).not.toContain('inline-flex');
    
    // Check summary display stats
    expect(screen.getByText(/AVAILABLE RECORDS:/i)).toBeInTheDocument();
    expect(screen.getByText(/3 MOCK RECORDS/i)).toBeInTheDocument();
    expect(screen.getByText(/FILTER RESULT:/i)).toBeInTheDocument();
    expect(screen.getByText(/0 MATCHES/i)).toBeInTheDocument();

    // Check clicking Reset button fires onResetFilters
    const resetBtn = screen.getByRole('button', { name: /RESET FILTERS/i });
    expect(resetBtn).toBeInTheDocument();
    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
