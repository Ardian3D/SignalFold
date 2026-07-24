import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { RootLayout } from '@/components/layout/RootLayout';
import { AppShell } from '@/layouts/AppShell';
import { DashboardPage } from '@/pages/DashboardPage';
import { IncidentsPage } from '@/pages/IncidentsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Simple test router configuration
const getTestRouter = (initialPath: string) => {
  return createMemoryRouter(
    [
      {
        path: '/app',
        element: (
          <RootLayout>
            <AppShell>
              <DashboardPage />
            </AppShell>
          </RootLayout>
        ),
      },
      {
        path: '/app/incidents',
        element: (
          <RootLayout>
            <AppShell>
              <IncidentsPage />
            </AppShell>
          </RootLayout>
        ),
      },
      {
        path: '*',
        element: (
          <RootLayout>
            <NotFoundPage />
          </RootLayout>
        ),
      },
    ],
    { initialEntries: [initialPath] }
  );
};

describe('Incidents Page & Filter Toolbar Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('/app/incidents renders IncidentsPage inside AppShell and does not render NotFoundPage', () => {
    const router = getTestRouter('/app/incidents');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Header checks
    expect(screen.getByText('INCIDENT REGISTRY / FRONTEND PREVIEW')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'INCIDENTS', level: 2 })).toBeInTheDocument();
    expect(screen.queryByText('404 / SIGNAL LOST')).not.toBeInTheDocument();
  });

  it('verifies that INCIDENTS navigation becomes active and DASHBOARD is not active', () => {
    const router = getTestRouter('/app/incidents');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // In the AppShell desktop sidebar, find active navigation links
    // DASHBOARD should NOT have aria-current="page"
    const dashboardLink = screen.getAllByRole('link').find(
      (el) => el.textContent?.includes('DASHBOARD')
    );
    expect(dashboardLink).not.toHaveAttribute('aria-current', 'page');

    // INCIDENTS should have aria-current="page"
    const incidentsLink = screen.getAllByRole('link').find(
      (el) => el.textContent?.includes('INCIDENTS')
    );
    expect(incidentsLink).toHaveAttribute('aria-current', 'page');
  });

  it('verifies that all filter controls, search, and canonical options render correctly', () => {
    const router = getTestRouter('/app/incidents');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Search input exists
    const searchInput = screen.getByLabelText('SEARCH INCIDENTS');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search title, code, or description');

    // Severity select exists and has correct canonical options
    const severitySelect = screen.getByLabelText('SEVERITY');
    expect(severitySelect).toBeInTheDocument();
    expect(severitySelect).toHaveValue('ALL');
    const severityOptions = Array.from(severitySelect.querySelectorAll('option')).map(o => o.value);
    expect(severityOptions).toEqual(['ALL', 'SEV1', 'SEV2', 'SEV3', 'SEV4']);

    // Status select exists and has correct canonical options
    const statusSelect = screen.getByLabelText('STATUS');
    expect(statusSelect).toBeInTheDocument();
    const statusOptions = Array.from(statusSelect.querySelectorAll('option')).map(o => o.value);
    expect(statusOptions).toEqual(['ALL', 'reported', 'triaging', 'investigating', 'identified', 'monitoring', 'resolved', 'closed']);

    // Service select exists with correct canonical service options
    const serviceSelect = screen.getByLabelText('SERVICE');
    expect(serviceSelect).toBeInTheDocument();
    const serviceOptions = Array.from(serviceSelect.querySelectorAll('option')).map(o => o.value);
    expect(serviceOptions).toEqual(['ALL', 'Checkout Web', 'Payments API', 'Order Processor', 'Customer Portal']);

    // Commander select exists with uninvented options only
    const commanderSelect = screen.getByLabelText('COMMANDER');
    expect(commanderSelect).toBeInTheDocument();
    const commanderOptions = Array.from(commanderSelect.querySelectorAll('option')).map(o => o.value);
    expect(commanderOptions).toEqual(['ALL', 'UNASSIGNED']);

    // Sort selects render with correct defaults
    const sortSelect = screen.getByLabelText('SORT BY');
    expect(sortSelect).toBeInTheDocument();
    expect(sortSelect).toHaveValue('UPDATED TIME');

    const directionSelect = screen.getByLabelText('SORT DIRECTION');
    expect(directionSelect).toBeInTheDocument();
    expect(directionSelect).toHaveValue('DESCENDING');
  });

  it('verifies search and filters update local state and query parameters in URL', () => {
    const router = getTestRouter('/app/incidents');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Change search value
    const searchInput = screen.getByLabelText('SEARCH INCIDENTS');
    fireEvent.change(searchInput, { target: { value: 'database error' } });
    expect(searchInput).toHaveValue('database error');
    expect(router.state.location.search).toContain('q=database+error');

    // Change severity option
    const severitySelect = screen.getByLabelText('SEVERITY');
    fireEvent.change(severitySelect, { target: { value: 'SEV1' } });
    expect(severitySelect).toHaveValue('SEV1');
    expect(router.state.location.search).toContain('severity=SEV1');

    // Change status option
    const statusSelect = screen.getByLabelText('STATUS');
    fireEvent.change(statusSelect, { target: { value: 'investigating' } });
    expect(statusSelect).toHaveValue('investigating');
    expect(router.state.location.search).toContain('status=investigating');
  });

  it('verifies refresh initialization reads valid URL filter values', () => {
    // Start router with pre-populated URL params
    const router = getTestRouter('/app/incidents?q=latency&severity=SEV2&status=triaging&service=Payments+API&commander=UNASSIGNED&sort=CREATED+TIME&direction=ASCENDING');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Verify correct parsing of values in form fields
    expect(screen.getByLabelText('SEARCH INCIDENTS')).toHaveValue('latency');
    expect(screen.getByLabelText('SEVERITY')).toHaveValue('SEV2');
    expect(screen.getByLabelText('STATUS')).toHaveValue('triaging');
    expect(screen.getByLabelText('SERVICE')).toHaveValue('Payments API');
    expect(screen.getByLabelText('COMMANDER')).toHaveValue('UNASSIGNED');
    expect(screen.getByLabelText('SORT BY')).toHaveValue('CREATED TIME');
    expect(screen.getByLabelText('SORT DIRECTION')).toHaveValue('ASCENDING');
  });

  it('verifies invalid URL parameter values fall back safely to defaults', () => {
    // Start router with garbage URL params
    const router = getTestRouter('/app/incidents?severity=GARBAGE&status=WRONG&service=MOCK&commander=INVALID&sort=UNKNOWN&direction=SIDEWAYS');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Fallbacks verified
    expect(screen.getByLabelText('SEVERITY')).toHaveValue('ALL');
    expect(screen.getByLabelText('STATUS')).toHaveValue('ALL');
    expect(screen.getByLabelText('SERVICE')).toHaveValue('ALL');
    expect(screen.getByLabelText('COMMANDER')).toHaveValue('ALL');
    expect(screen.getByLabelText('SORT BY')).toHaveValue('UPDATED TIME');
    expect(screen.getByLabelText('SORT DIRECTION')).toHaveValue('DESCENDING');
  });

  it('verifies Reset Filters restores defaults, removes Incident params, and preserves unrelated ones', () => {
    // Start router with valid incident list params and an unrelated query param
    const router = getTestRouter('/app/incidents?q=latency&severity=SEV1&status=investigating&unrelated=123');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    expect(screen.getByLabelText('SEARCH INCIDENTS')).toHaveValue('latency');
    expect(screen.getByLabelText('SEVERITY')).toHaveValue('SEV1');

    // Trigger reset
    const resetButton = screen.getAllByRole('button', { name: 'RESET FILTERS' })[0];
    fireEvent.click(resetButton);

    // Verify local form fields have returned to defaults
    expect(screen.getByLabelText('SEARCH INCIDENTS')).toHaveValue('');
    expect(screen.getByLabelText('SEVERITY')).toHaveValue('ALL');
    expect(screen.getByLabelText('STATUS')).toHaveValue('ALL');

    // Verify known search parameters are deleted but unrelated 'unrelated' parameter is preserved
    const finalSearch = router.state.location.search;
    expect(finalSearch).not.toContain('q=');
    expect(finalSearch).not.toContain('severity=');
    expect(finalSearch).not.toContain('status=');
    expect(finalSearch).toContain('unrelated=123');
  });

  it('verifies exactly three mock records render by default with their key details', () => {
    const router = getTestRouter('/app/incidents');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Three mock records render
    expect(screen.getAllByText('SF-2026-0042')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Checkout payments failing after latest deployment')[0]).toBeInTheDocument();
    expect(screen.getAllByText('ACTIVE SEV2 SEED RECORD')[0]).toBeInTheDocument();
    expect(screen.getAllByText('RESOLVED INCIDENT SEED RECORD')[0]).toBeInTheDocument();

    // Canonical details for SF-2026-0042
    expect(screen.getAllByText('Customers cannot complete card payments after the latest deployment.')[0]).toBeInTheDocument();
    expect(screen.getAllByText('PAYMENTS API')[0]).toBeInTheDocument();
    expect(screen.getAllByText('UNASSIGNED')[0]).toBeInTheDocument();
    expect(screen.getAllByText('37 REPORTS / 12 MINUTES')[0]).toBeInTheDocument();
    expect(screen.getAllByText('5 RECOMMENDED')[0]).toBeInTheDocument();
    expect(screen.getAllByText('AI SUGGESTION / SEV1')[0]).toBeInTheDocument();
    expect(screen.getAllByText('HUMAN CONFIRMATION REQUIRED')[0]).toBeInTheDocument();

    // Active SEV2 seed details (uninvented details check)
    expect(screen.getAllByText('SEV2')[0]).toBeInTheDocument();
    expect(screen.getAllByText('An additional active SEV2 incident exists in the canonical demo workspace. Detailed identity has not yet been specified.')[0]).toBeInTheDocument();

    // Resolved seed details (uninvented details check)
    expect(screen.getAllByText('RESOLVED')[0]).toBeInTheDocument();
    expect(screen.getAllByText('APPROVED')[0]).toBeInTheDocument(); // APPROVED Postmortem
  });

  it('verifies search filters records locally and results count updates', () => {
    const router = getTestRouter('/app/incidents');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    const searchInput = screen.getByLabelText('SEARCH INCIDENTS');
    
    // Search for "Checkout" matches only SF-2026-0042
    fireEvent.change(searchInput, { target: { value: 'Checkout' } });
    expect(screen.getAllByText('SF-2026-0042')[0]).toBeInTheDocument();
    expect(screen.queryByText('ACTIVE SEV2 SEED RECORD')).not.toBeInTheDocument();
    expect(screen.queryByText('RESOLVED INCIDENT SEED RECORD')).not.toBeInTheDocument();
    expect(screen.getByText('SHOWING 1 OF 3')).toBeInTheDocument();
  });

  it('verifies service filter matches Payments API and commander filter matches UNASSIGNED correctly', () => {
    const router = getTestRouter('/app/incidents');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // 1. Service filter to "Payments API" matches only SF-2026-0042
    const serviceSelect = screen.getByLabelText('SERVICE');
    fireEvent.change(serviceSelect, { target: { value: 'Payments API' } });
    expect(screen.getAllByText('SF-2026-0042')[0]).toBeInTheDocument();
    expect(screen.queryByText('ACTIVE SEV2 SEED RECORD')).not.toBeInTheDocument();

    // 2. Commander filter to "UNASSIGNED" matches SF-2026-0042
    const commanderSelect = screen.getByLabelText('COMMANDER');
    fireEvent.change(commanderSelect, { target: { value: 'UNASSIGNED' } });
    expect(screen.getAllByText('SF-2026-0042')[0]).toBeInTheDocument();
  });

  it('verifies SEV1 filtering does not falsely match SF-2026-0042 since it is only an AI SUGGESTION', () => {
    const router = getTestRouter('/app/incidents');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    const severitySelect = screen.getByLabelText('SEVERITY');
    fireEvent.change(severitySelect, { target: { value: 'SEV1' } });

    // Should display empty state because SF-2026-0042's severity is NOT confirmed SEV1 (it is an AI SUGGESTION)
    expect(screen.getByText('NO MATCHING MOCK RECORDS')).toBeInTheDocument();
    expect(screen.queryByText('SF-2026-0042')).not.toBeInTheDocument();
  });

  it('verifies no-match empty state and Reset Filters functionality', () => {
    const router = getTestRouter('/app/incidents');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    const searchInput = screen.getByLabelText('SEARCH INCIDENTS');
    fireEvent.change(searchInput, { target: { value: 'completely non-existent incident content' } });

    // Empty state displays
    expect(screen.getByText('NO MATCHING MOCK RECORDS')).toBeInTheDocument();
    expect(screen.getByText('No canonical frontend records match the current filters. Adjust or reset the Incident List controls.')).toBeInTheDocument();

    // Trigger reset via the empty state reset button
    const resetBtn = screen.getAllByRole('button', { name: 'RESET FILTERS' })[0];
    fireEvent.click(resetBtn);

    // Restores all three records
    expect(screen.getAllByText('SF-2026-0042')[0]).toBeInTheDocument();
    expect(screen.getAllByText('ACTIVE SEV2 SEED RECORD')[0]).toBeInTheDocument();
    expect(screen.getAllByText('RESOLVED INCIDENT SEED RECORD')[0]).toBeInTheDocument();
  });

  it('verifies time sorting displays notice and does not generate timestamps, actions are disabled', () => {
    const router = getTestRouter('/app/incidents');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    const sortSelect = screen.getByLabelText('SORT BY');
    fireEvent.change(sortSelect, { target: { value: 'CREATED TIME' } });

    // Notice renders
    expect(screen.getByText('TIME SORT / LIMITED MOCK DATA')).toBeInTheDocument();

    // Actions are disabled
    const buttons = screen.getAllByRole('button', { name: /ROUTE NOT AVAILABLE/i });
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('verifies stable canonical mock order is preserved across sorting and default modes', () => {
    const router = getTestRouter('/app/incidents');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // 1. Default unfiltered order
    let headings = screen.getAllByRole('heading', { level: 4 });
    expect(headings[0]).toHaveTextContent('Checkout payments failing after latest deployment');
    expect(headings[1]).toHaveTextContent('ACTIVE SEV2 SEED RECORD');
    expect(headings[2]).toHaveTextContent('RESOLVED INCIDENT SEED RECORD');

    // 2. Sorting by UPDATED TIME / DESCENDING
    const sortSelect = screen.getByLabelText('SORT BY');
    const directionSelect = screen.getByLabelText('SORT DIRECTION');

    fireEvent.change(sortSelect, { target: { value: 'UPDATED TIME' } });
    fireEvent.change(directionSelect, { target: { value: 'DESCENDING' } });

    headings = screen.getAllByRole('heading', { level: 4 });
    expect(headings[0]).toHaveTextContent('Checkout payments failing after latest deployment');
    expect(headings[1]).toHaveTextContent('ACTIVE SEV2 SEED RECORD');
    expect(headings[2]).toHaveTextContent('RESOLVED INCIDENT SEED RECORD');

    // 3. Sorting by UPDATED TIME / ASCENDING
    fireEvent.change(directionSelect, { target: { value: 'ASCENDING' } });
    headings = screen.getAllByRole('heading', { level: 4 });
    expect(headings[0]).toHaveTextContent('Checkout payments failing after latest deployment');
    expect(headings[1]).toHaveTextContent('ACTIVE SEV2 SEED RECORD');
    expect(headings[2]).toHaveTextContent('RESOLVED INCIDENT SEED RECORD');

    // 4. Sorting by CREATED TIME
    fireEvent.change(sortSelect, { target: { value: 'CREATED TIME' } });
    headings = screen.getAllByRole('heading', { level: 4 });
    expect(headings[0]).toHaveTextContent('Checkout payments failing after latest deployment');
    expect(headings[1]).toHaveTextContent('ACTIVE SEV2 SEED RECORD');
    expect(headings[2]).toHaveTextContent('RESOLVED INCIDENT SEED RECORD');

    // 5. Reset filters restores canonical order
    const resetBtn = screen.getAllByRole('button', { name: 'RESET FILTERS' })[0];
    fireEvent.click(resetBtn);

    headings = screen.getAllByRole('heading', { level: 4 });
    expect(headings[0]).toHaveTextContent('Checkout payments failing after latest deployment');
    expect(headings[1]).toHaveTextContent('ACTIVE SEV2 SEED RECORD');
    expect(headings[2]).toHaveTextContent('RESOLVED INCIDENT SEED RECORD');
  });

  it('verifies SF-2026-0042 non-wrapping identity treatment and container-responsive layout structures', () => {
    const originalInnerWidth = window.innerWidth;

    try {
      // 1. Constrained Desktop / Tablet layout (700px <= width < 1280px)
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
      const router1 = getTestRouter('/app/incidents');
      const { unmount: unmount1 } = render(
        <AppProviders>
          <RouterProvider router={router1} />
        </AppProviders>
      );

      // Verify non-wrapping code element exists and has whitespace-nowrap
      const codeElement = screen.getAllByText('SF-2026-0042')[0];
      expect(codeElement).toBeInTheDocument();
      expect(codeElement).toHaveClass('whitespace-nowrap');

      // Verify Layout 2 is active (includes "SERVICE:" label)
      expect(screen.getAllByText('SERVICE:')[0]).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
      unmount1();

      // 2. Mobile layout (width < 700px)
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 390 });
      const router2 = getTestRouter('/app/incidents');
      const { unmount: unmount2 } = render(
        <AppProviders>
          <RouterProvider router={router2} />
        </AppProviders>
      );
      // Under 700px width, Layout 1 (Mobile) is used, so the colons in labels (e.g. "SERVICE:") do not exist, but "SERVICE" does.
      expect(screen.queryByText('SERVICE:')).not.toBeInTheDocument();
      expect(screen.getAllByText('SERVICE')[0]).toBeInTheDocument();
      expect(screen.getAllByText('SF-2026-0042')[0]).toHaveClass('whitespace-nowrap');
      unmount2();

      // 3. Wide desktop layout (width >= 1280px)
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1440 });
      const router3 = getTestRouter('/app/incidents');
      const { unmount: unmount3 } = render(
        <AppProviders>
          <RouterProvider router={router3} />
        </AppProviders>
      );
      // Verify complete 8-column semantic table is used
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByText('SF-2026-0042')[0]).toHaveClass('whitespace-nowrap');
      unmount3();
    } finally {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalInnerWidth });
    }
  });

  it('verifies Dashboard route remains unchanged and unknown routes still render NotFoundPage', () => {
    // 1. Dashboard Page is intact
    const dashboardRouter = getTestRouter('/app');
    render(
      <AppProviders>
        <RouterProvider router={dashboardRouter} />
      </AppProviders>
    );
    expect(screen.getByRole('heading', { name: 'DASHBOARD', level: 1 })).toBeInTheDocument();

    // 2. Unknown route renders 404
    const unknownRouter = getTestRouter('/app/unknown-route-here');
    const { unmount } = render(
      <AppProviders>
        <RouterProvider router={unknownRouter} />
      </AppProviders>
    );
    expect(screen.getByText('404 / SIGNAL LOST')).toBeInTheDocument();
    unmount();
  });
});
