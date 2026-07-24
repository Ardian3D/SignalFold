import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { RootLayout } from '@/components/layout/RootLayout';
import { AppShell } from '@/layouts/AppShell';
import { CreateIncidentPage } from '@/pages/CreateIncidentPage';

// Test Router containing the Create Incident page
const getTestRouter = (initialPath: string) => {
  return createMemoryRouter(
    [
      {
        path: '/app',
        element: (
          <RootLayout>
            <AppShell>
              <div>Mock Dashboard Page</div>
            </AppShell>
          </RootLayout>
        ),
      },
      {
        path: '/app/incidents',
        element: (
          <RootLayout>
            <AppShell>
              <div>Mock Incidents List Page</div>
            </AppShell>
          </RootLayout>
        ),
      },
      {
        path: '/app/incidents/new',
        element: (
          <RootLayout>
            <AppShell>
              <CreateIncidentPage />
            </AppShell>
          </RootLayout>
        ),
      },
    ],
    { initialEntries: [initialPath] }
  );
};

describe('Create Incident Page Frontend Tests', () => {
  it('renders the complete Create Incident header, breadcrumbs, and service status', () => {
    const router = getTestRouter('/app/incidents/new');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // 1. Breadcrumbs (use getAllByText as elements can render in multiple places e.g. sidebar and main content)
    expect(screen.getAllByText('NORTHSTAR COMMERCE').length).toBeGreaterThan(0);
    expect(screen.getAllByText('NEW').length).toBeGreaterThan(0);

    // 2. Headings & Titles
    expect(screen.getAllByText('NEW INCIDENT').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: 'REPORT AN INCIDENT.' })).toBeInTheDocument();

    // 3. Supporting text
    expect(screen.getByText(/Capture the first reliable account of an operational issue/i)).toBeInTheDocument();

    // 4. Creation Service status
    expect(screen.getByText('CREATION SERVICE / NOT CONNECTED')).toBeInTheDocument();
  });

  it('verifies all expected form sections, input fields, labels, and help texts are rendered', () => {
    const router = getTestRouter('/app/incidents/new');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Form Legends / Section headings
    expect(screen.getByText('01 / INCIDENT IDENTITY')).toBeInTheDocument();
    expect(screen.getByText('02 / OPERATIONAL CONTEXT')).toBeInTheDocument();
    expect(screen.getByText('03 / REPORTER & TRIAGE')).toBeInTheDocument();

    // Fields and Labels
    expect(screen.getByLabelText('TITLE *')).toBeInTheDocument();
    expect(screen.getByLabelText('DESCRIPTION *')).toBeInTheDocument();
    expect(screen.getByLabelText('AFFECTED SERVICE')).toBeInTheDocument();
    expect(screen.getByLabelText('OBSERVED START TIME')).toBeInTheDocument();
    expect(screen.getByLabelText('IMPACT HINT')).toBeInTheDocument();
    expect(screen.getByLabelText('ANALYZE AFTER INCIDENT CREATION')).toBeInTheDocument();

    // Textarea help text
    expect(screen.getByText(/Optional initial context. Final customer and business impact remains subject/i)).toBeInTheDocument();
  });

  it('triggers local form validation errors on submission and checks aria attributes', () => {
    const router = getTestRouter('/app/incidents/new');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Get the primary submit button
    const submitBtns = screen.getAllByRole('button');
    const submitBtn = submitBtns.find(b => b.textContent === 'CREATE INCIDENT');
    expect(submitBtn).toBeDefined();

    fireEvent.click(submitBtn!);

    // Empty fields validation errors
    const titleErr = screen.getByText('Incident title is required.');
    const descErr = screen.getByText('Incident description is required.');

    expect(titleErr).toBeInTheDocument();
    expect(descErr).toBeInTheDocument();

    // Check accessible roles & attributes
    expect(titleErr).toHaveAttribute('role', 'alert');
    expect(descErr).toHaveAttribute('role', 'alert');

    const titleInput = screen.getByLabelText('TITLE *');
    expect(titleInput).toHaveAttribute('aria-invalid', 'true');
    expect(titleInput).toHaveAttribute('aria-describedby', 'incident-title-error');

    // Test minimum characters validations
    fireEvent.change(titleInput, { target: { value: 'Bad' } });
    fireEvent.change(screen.getByLabelText('DESCRIPTION *'), { target: { value: 'Short desc' } });

    fireEvent.click(submitBtn!);

    expect(screen.getByText('Use at least 5 characters.')).toBeInTheDocument();
    expect(screen.getByText('Use at least 20 characters.')).toBeInTheDocument();
  });

  it('renders the complete Reporting Contract panel and local form summary in real time', () => {
    const router = getTestRouter('/app/incidents/new');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Reporting Contract items
    expect(screen.getByText('REPORTING CONTRACT')).toBeInTheDocument();
    expect(screen.getByText('BACKEND REQUIREMENT DEFINITION')).toBeInTheDocument();
    expect(screen.getByText('PERSIST FIRST. ANALYZE SECOND.')).toBeInTheDocument();
    expect(screen.getByText('HUMAN AUTHORITY')).toBeInTheDocument();

    // Local Form Summary default state has two 'NOT PROVIDED' values (Title and Observed Start)
    expect(screen.getAllByText('NOT PROVIDED')).toHaveLength(2);

    const serviceSummaryVal = screen.getByText('NOT SELECTED');
    expect(serviceSummaryVal).toBeInTheDocument();

    // Input changes reflect in the Live Summary instantly
    const titleInput = screen.getByLabelText('TITLE *');
    fireEvent.change(titleInput, { target: { value: 'Database Outage' } });

    const serviceSelect = screen.getByLabelText('AFFECTED SERVICE');
    fireEvent.change(serviceSelect, { target: { value: 'Payments API' } });

    // Since 'Payments API' is an option AND in the summary, check that we have 2 occurrences
    expect(screen.getAllByText('Payments API')).toHaveLength(2);

    // Only 1 'NOT PROVIDED' remains (Observed Start)
    expect(screen.getAllByText('NOT PROVIDED')).toHaveLength(1);
    expect(screen.getByText('Database Outage')).toBeInTheDocument();
  });

  it('successfully validates and processes submission showing simulated load and live status', async () => {
    vi.useFakeTimers();
    const router = getTestRouter('/app/incidents/new');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Populate valid data
    fireEvent.change(screen.getByLabelText('TITLE *'), { target: { value: 'Major API Timeout' } });
    fireEvent.change(screen.getByLabelText('DESCRIPTION *'), { target: { value: 'We are observing major connection timeouts from Checkout Web to Payments API since 5 minutes ago.' } });

    const submitBtns = screen.getAllByRole('button');
    const submitBtn = submitBtns.find(b => b.textContent === 'CREATE INCIDENT');
    expect(submitBtn).toBeDefined();

    // Submit the form
    await act(async () => {
      fireEvent.click(submitBtn!);
    });

    // Submitting state
    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveTextContent('VALIDATING...');

    // Fast-forward processing timer
    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    // Submitting state restored
    expect(submitBtn).not.toBeDisabled();
    expect(submitBtn).toHaveTextContent('CREATE INCIDENT');

    // Success Status is rendered
    expect(screen.getByText('INCIDENT CREATION SERVICE NOT CONNECTED')).toBeInTheDocument();
    expect(screen.getByText(/Frontend validation completed. During backend integration, the incident will be created/i)).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('verifies secondary navigation actions (Cancel, Return to Dashboard)', () => {
    const router = getTestRouter('/app/incidents/new');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    const cancelLink = screen.getByRole('link', { name: 'CANCEL REPORT' });
    expect(cancelLink).toBeInTheDocument();
    expect(cancelLink).toHaveAttribute('href', '/app/incidents');

    const dashboardLink = screen.getByRole('link', { name: 'RETURN TO DASHBOARD' });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute('href', '/app');
  });
});
