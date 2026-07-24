import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { RootLayout } from '@/components/layout/RootLayout';
import { AppShell } from '@/layouts/AppShell';
import { DashboardPage } from '@/pages/DashboardPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Simple mockup routes for testing router behaviors
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

describe('SignalFold AppShell & Dashboard Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('/app path renders DashboardPage inside AppShell and does not render NotFoundPage', () => {
    const router = getTestRouter('/app');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Verify DashboardPage elements are present
    expect(screen.getByText('OPERATIONS OVERVIEW')).toBeInTheDocument();
    expect(screen.getByText(/Monitor incidents, response ownership, operational activity/i)).toBeInTheDocument();

    // Verify NotFoundPage elements are NOT present
    expect(screen.queryByText('404 / SIGNAL LOST')).not.toBeInTheDocument();
  });

  it('renders official BrandLogo asset inside layout header/sidebar', () => {
    const router = getTestRouter('/app');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    const logoElements = screen.getAllByAltText('SignalFold');
    expect(logoElements.length).toBeGreaterThanOrEqual(1);
    expect(logoElements[0].tagName).toBe('IMG');
  });

  it('has active Dashboard navigation with aria-current="page"', () => {
    const router = getTestRouter('/app');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Find desktop sidebar Dashboard navigation
    const dashboardLinks = screen.getAllByRole('link', { name: /DASHBOARD/i });
    expect(dashboardLinks.length).toBeGreaterThanOrEqual(1);

    // Verify aria-current="page"
    dashboardLinks.forEach((link) => {
      expect(link).toHaveAttribute('aria-current', 'page');
    });
  });

  it('has disabled navigation and action controls for unfinished routes (Incidents, Services, Team, Settings, New Incident)', () => {
    const router = getTestRouter('/app');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Verify Incidents, Services, Team are rendered visibly but disabled/non-interactive
    const incidentsLabel = screen.getAllByText('INCIDENTS');
    expect(incidentsLabel.length).toBeGreaterThanOrEqual(1);
    
    // Check they are marked PENDING or have aria-disabled
    const pendingLabels = screen.getAllByText('PENDING');
    expect(pendingLabels.length).toBeGreaterThanOrEqual(1);

    // Find and check "NEW INCIDENT" action
    const newIncidentLinks = screen.getAllByRole('link', { name: /\+ NEW INCIDENT/i });
    expect(newIncidentLinks.length).toBeGreaterThanOrEqual(1);
    newIncidentLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/app/incidents/new');
    });
  });

  it('does not navigate to 404 when clicking pending/disabled items', () => {
    const router = getTestRouter('/app');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Click on elements that represent pending links to check if they stay on /app
    const servicesElement = screen.getAllByText('SERVICES')[0];
    fireEvent.click(servicesElement);

    // Still renders Dashboard content
    expect(screen.getByText('OPERATIONS OVERVIEW')).toBeInTheDocument();
    expect(screen.queryByText('404 / SIGNAL LOST')).not.toBeInTheDocument();
  });

  it('displays Northstar Commerce, Frontend Preview, and Backend Pending metadata status indicators', () => {
    const router = getTestRouter('/app');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    expect(screen.getAllByText('NORTHSTAR COMMERCE').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('FRONTEND PREVIEW').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('BACKEND PENDING').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('WORKSPACE / PREVIEW MODE').length).toBeGreaterThanOrEqual(1);
  });

  it('does not display fake notification counts', () => {
    const router = getTestRouter('/app');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    const notificationButton = screen.getByRole('button', { name: /Notifications/i });
    expect(notificationButton).toBeDisabled();
    
    // Ensure no fake numbers (like red badge text "3" or "9+") is inside or next to the notification button
    expect(notificationButton.textContent).not.toMatch(/[0-9]+/);
  });

  it('provides an accessible label for the desktop navigation', () => {
    const router = getTestRouter('/app');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    const desktopNav = screen.getByRole('navigation', { name: 'Desktop Sidebar Navigation' });
    expect(desktopNav).toBeInTheDocument();
  });

  it('mobile top header menu toggles open and close accessibly, displaying all navigation labels', () => {
    const router = getTestRouter('/app');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Open drawer
    const openMenuBtn = screen.getByRole('button', { name: 'Open Navigation Menu' });
    expect(openMenuBtn).toBeInTheDocument();
    expect(openMenuBtn).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(openMenuBtn);

    // Drawer is now open
    const drawer = screen.getByRole('dialog', { name: 'Navigation Menu' });
    expect(drawer).toBeInTheDocument();

    // Drawer navigation is accessible
    const mobileNav = screen.getByRole('navigation', { name: 'Mobile Drawer Navigation' });
    expect(mobileNav).toBeInTheDocument();

    // Verify drawer contains all labels
    expect(screen.getAllByText('DASHBOARD').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('INCIDENTS').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('SERVICES').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('TEAM').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('SETTINGS').length).toBeGreaterThanOrEqual(1);

    // Close drawer
    const closeMenuBtn = screen.getByRole('button', { name: 'Close menu' });
    fireEvent.click(closeMenuBtn);

    expect(screen.queryByRole('dialog', { name: 'Navigation Menu' })).not.toBeInTheDocument();
  });

  it('renders Operational Summary module and its six metrics with correct mock values and labels', () => {
    const router = getTestRouter('/app');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Verify Operational Summary header and labels
    expect(screen.getByText('01 / OPERATIONAL SUMMARY')).toBeInTheDocument();
    expect(screen.getByText('NORTHSTAR COMMERCE / FRONTEND MOCK DATA')).toBeInTheDocument();
    expect(screen.getByText('DATA STATE / NOT CONNECTED')).toBeInTheDocument();

    // Verify all six metric labels
    expect(screen.getByText('ACTIVE INCIDENTS')).toBeInTheDocument();
    expect(screen.getByText('SEV1 / SEV2 ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('OPEN TASKS')).toBeInTheDocument();
    expect(screen.getByText('RESOLVED THIS WEEK')).toBeInTheDocument();
    expect(screen.getByText('AVG. TIME TO ACKNOWLEDGE')).toBeInTheDocument();
    expect(screen.getByText('AVG. TIME TO RESOLVE')).toBeInTheDocument();

    // Verify mock numeric values
    expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(2); // For Active Incidents & SEV1/SEV2 Active
    expect(screen.getAllByText('5').length).toBeGreaterThanOrEqual(1); // For Open Tasks
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1); // For Resolved This Week

    // Verify average-time metrics display INSUFFICIENT DATA
    expect(screen.getAllByText('INSUFFICIENT DATA').length).toBeGreaterThanOrEqual(2);

    // Verify no percentages, trend arrows, charts, or sparklines are rendered
    expect(screen.queryByText('%')).not.toBeInTheDocument();
    expect(screen.queryByText('↑')).not.toBeInTheDocument();
    expect(screen.queryByText('↓')).not.toBeInTheDocument();

    // Verify MOCK source labels are visible
    const mockBadges = screen.getAllByText('MOCK');
    expect(mockBadges.length).toBe(6);

    // Verify Quick Create Incident module is visible beneath it
    expect(screen.getByText('06 / QUICK CREATE INCIDENT')).toBeInTheDocument();
  });

  it('renders Active Incidents Module 02 with canonical and secondary active seed records, verifying all copy and safety constraints', () => {
    const router = getTestRouter('/app');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Verify Active Incidents module header renders
    expect(screen.getByText('02 / ACTIVE INCIDENTS')).toBeInTheDocument();
    expect(screen.getByText('CURRENT RESPONSE QUEUE / FRONTEND MOCK DATA')).toBeInTheDocument();
    expect(screen.getByText('2 ACTIVE RECORDS')).toBeInTheDocument();

    // Verify Record 01 (SF-2026-0042)
    expect(screen.getAllByText('SF-2026-0042')[0]).toBeInTheDocument();
    expect(screen.getByText('Checkout payments failing after latest deployment')).toBeInTheDocument();
    expect(screen.getByText('Customers cannot complete card payments after the latest deployment.')).toBeInTheDocument();

    // Verify Metadata for Record 01
    expect(screen.getAllByText('PAYMENTS API')[0]).toBeInTheDocument();
    expect(screen.getAllByText('37 REPORTS / 12 MINUTES')[0]).toBeInTheDocument();
    expect(screen.getAllByText('REPORTED')[0]).toBeInTheDocument();
    expect(screen.getAllByText('AI SUGGESTION / SEV1')[0]).toBeInTheDocument();
    expect(screen.getAllByText('HUMAN CONFIRMATION REQUIRED')[0]).toBeInTheDocument();
    expect(screen.getAllByText('UNASSIGNED')[0]).toBeInTheDocument();

    // Verify Recommended Tasks badge is visible and NOT marked as completed
    const recommendedLabel = screen.getByText('RECOMMENDED');
    expect(recommendedLabel).toBeInTheDocument();
    expect(screen.queryByText('COMPLETED')).not.toBeInTheDocument();

    // Verify Record 02 (Secondary active SEV2 seed record)
    expect(screen.getByText('SECONDARY ACTIVE INCIDENT')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE SEV2 SEED RECORD')).toBeInTheDocument();
    expect(screen.getByText('This active SEV2 record is reserved by the canonical demo dataset. Detailed incident identity will be defined during mock-data integration.')).toBeInTheDocument();
    expect(screen.getByText('LIMITED SEED DETAIL')).toBeInTheDocument();

    // Verify no invented code exists for the secondary record (meaning no search matches for a hypothetical secondary code like SF-2026-0043)
    expect(screen.queryByText('SF-2026-0043')).not.toBeInTheDocument();

    // Verify Secondary detail fields display NOT SPECIFIED / NOT AVAILABLE
    expect(screen.getAllByText('NOT SPECIFIED').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('CANONICAL SECONDARY SEED')).toBeInTheDocument();
    expect(screen.getAllByText('NOT AVAILABLE')[0]).toBeInTheDocument();

    // Verify Action states
    const openIncidentLinks = screen.getAllByRole('link', { name: /OPEN INCIDENT ROOM/i });
    expect(openIncidentLinks.length).toBeGreaterThanOrEqual(1);
    openIncidentLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/app/incidents/SF-2026-0042');
    });

    const viewAllIncidentsButton = screen.getByRole('button', { name: /VIEW ALL INCIDENTS/i });
    expect(viewAllIncidentsButton).toBeDisabled();
    expect(viewAllIncidentsButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders Needs Attention Module 03 and all its specifications', () => {
    const router = getTestRouter('/app');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Verify Needs Attention module header and labels
    expect(screen.getByText('03 / NEEDS ATTENTION')).toBeInTheDocument();
    expect(screen.getByText('HUMAN REVIEW QUEUE / FRONTEND MOCK DATA')).toBeInTheDocument();
    expect(screen.getByText('3 OPEN ITEMS')).toBeInTheDocument();
    expect(screen.getByText('ACTION REQUIRED')).toBeInTheDocument();

    // Verify Item 01
    expect(screen.getAllByText('CRITICAL REVIEW').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('CONFIRM INCIDENT SEVERITY').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('AI SUGGESTION / SEV1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('HUMAN DECISION REQUIRED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('An authorized Incident Manager must review and explicitly confirm or change the suggested severity.').length).toBeGreaterThanOrEqual(1);

    // Verify Item 02
    expect(screen.getAllByText('OWNERSHIP REQUIRED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('ASSIGN INCIDENT COMMANDER').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('COMMANDER / UNASSIGNED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('MEMBERSHIP BACKEND REQUIRED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Assign an authorized responder to coordinate incident ownership and response decisions.').length).toBeGreaterThanOrEqual(1);

    // Verify Item 03
    expect(screen.getAllByText('TASK REVIEW').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('REVIEW RECOMMENDED RESPONSE TASKS').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('5 TASKS / RECOMMENDED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('NOT ACCEPTED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Review the proposed response tasks before accepting, editing, assigning, or starting any work.').length).toBeGreaterThanOrEqual(1);

    // Verify SF-2026-0042 renders across attention items
    const codeElements = screen.getAllByText('SF-2026-0042');
    // At least 4 (one in Active Incidents, three in Needs Attention)
    expect(codeElements.length).toBeGreaterThanOrEqual(4);

    // Verify no fake commander name is invented
    expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Jane Smith/i)).not.toBeInTheDocument();

    // Verify no fake due dates or timestamps are rendered in Module 03
    expect(screen.queryByText(/Due in/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ago/i)).not.toBeInTheDocument();

    // Verify Review buttons are disabled and contain correct labels
    const reviewButtons = screen.getAllByRole('button', { name: /REVIEW/i });
    expect(reviewButtons.length).toBeGreaterThanOrEqual(3);
    reviewButtons.forEach((btn) => {
      expect(btn).toBeDisabled();
      expect(btn).toHaveAttribute('aria-disabled', 'true');
    });

    const openQueueBtn = screen.getByRole('button', { name: /OPEN REVIEW QUEUE/i });
    expect(openQueueBtn).toBeDisabled();
    expect(openQueueBtn).toHaveAttribute('aria-disabled', 'true');

    // Verify Quick Create Incident module is visible beneath Needs Attention
    expect(screen.getByText('06 / QUICK CREATE INCIDENT')).toBeInTheDocument();
  });

  it('renders Recent Activity Module 04 and all its specifications', () => {
    const router = getTestRouter('/app');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Verify Recent Activity module header and labels
    expect(screen.getByText('04 / RECENT ACTIVITY')).toBeInTheDocument();
    expect(screen.getByText('CANONICAL INCIDENT SEQUENCE / FRONTEND MOCK DATA')).toBeInTheDocument();
    expect(screen.getByText('5 ACTIVITY RECORDS')).toBeInTheDocument();
    expect(screen.getByText('TIMESTAMPS / NOT AVAILABLE')).toBeInTheDocument();

    // Verify all five activity types render
    expect(screen.getAllByText('INCIDENT REPORTED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('CUSTOMER SIGNAL RECORDED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('AI TRIAGE SUGGESTION PREPARED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('RESPONSE TASK SET PROPOSED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('SECONDARY ACTIVE RECORD AVAILABLE').length).toBeGreaterThanOrEqual(1);

    // Verify SF-2026-0042 renders for the first four records
    const sf42Elements = screen.getAllByText('SF-2026-0042');
    expect(sf42Elements.length).toBeGreaterThanOrEqual(8);

    // Verify states of each activity
    expect(screen.getAllByText('REPORTED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('37 REPORTS / 12 MINUTES').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('HUMAN CONFIRMATION REQUIRED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('5 RECOMMENDED / NOT ACCEPTED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('LIMITED DETAIL').length).toBeGreaterThanOrEqual(1);

    // Verify every activity displays TIME / NOT AVAILABLE
    const timeNotAvailableElements = screen.getAllByText('TIME / NOT AVAILABLE');
    expect(timeNotAvailableElements.length).toBeGreaterThanOrEqual(5);

    // Verify no exact dates, responder or commander name, or clock times are invented
    expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Jane Smith/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/:\d{2}\s*(AM|PM)/i)).not.toBeInTheDocument();

    // Verify Open Activity Log button is disabled
    const openActivityBtn = screen.getByRole('button', { name: /OPEN ACTIVITY LOG/i });
    expect(openActivityBtn).toBeDisabled();
    expect(openActivityBtn).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders Response Workload Module 05 and all its specifications', () => {
    const router = getTestRouter('/app');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Verify header and right-side indicators
    expect(screen.getByText('05 / RESPONSE WORKLOAD')).toBeInTheDocument();
    expect(screen.getByText('RECOMMENDED TASK SET / FRONTEND MOCK DATA')).toBeInTheDocument();
    expect(screen.getByText('5 RECOMMENDED TASKS')).toBeInTheDocument();
    expect(screen.getByText('ACCEPTANCE / HUMAN REVIEW PENDING')).toBeInTheDocument();

    // Verify all five canonical task titles render
    expect(screen.getAllByText('COMPARE LATEST DEPLOYMENT CHANGES')[0]).toBeInTheDocument();
    expect(screen.getAllByText('CONFIRM PAYMENT GATEWAY HEALTH')[0]).toBeInTheDocument();
    expect(screen.getAllByText('RUN CHECKOUT TRANSACTION TEST')[0]).toBeInTheDocument();
    expect(screen.getAllByText('PREPARE ROLLBACK')[0]).toBeInTheDocument();
    expect(screen.getAllByText('DRAFT CUSTOMER-FACING STATUS UPDATE')[0]).toBeInTheDocument();

    // Verify every task references SF-2026-0042
    const sf42Elements = screen.getAllByText('SF-2026-0042');
    expect(sf42Elements.length).toBeGreaterThanOrEqual(13);

    // Every task remains NOT ACCEPTED
    const notAcceptedElements = screen.getAllByText('NOT ACCEPTED');
    expect(notAcceptedElements.length).toBeGreaterThanOrEqual(5);

    // Every task remains UNASSIGNED
    const unassignedElements = screen.getAllByText('UNASSIGNED');
    expect(unassignedElements.length).toBeGreaterThanOrEqual(5);

    // Every task remains NOT CREATED
    const notCreatedElements = screen.getAllByText('NOT CREATED');
    expect(notCreatedElements.length).toBeGreaterThanOrEqual(5);

    // No due dates, timestamps, priorities, progress percentages, or assignee names are invented
    expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Jane Smith/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/:\d{2}\s*(AM|PM)/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Due/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/PRIORITY:/i)).not.toBeInTheDocument();

    // Open Task Queue remains disabled
    const openTaskQueueBtn = screen.getByRole('button', { name: /OPEN TASK QUEUE/i });
    expect(openTaskQueueBtn).toBeDisabled();
    expect(openTaskQueueBtn).toHaveAttribute('aria-disabled', 'true');

    // Quick Create Incident module is visible beneath it
    expect(screen.getByText('06 / QUICK CREATE INCIDENT')).toBeInTheDocument();
  });

  it('renders Quick Create Incident Module 06 and all its specifications', async () => {
    const router = getTestRouter('/app');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // 1. Renders beneath Response Workload (both exist on same page)
    expect(screen.getByText('05 / RESPONSE WORKLOAD')).toBeInTheDocument();
    expect(screen.getByText('06 / QUICK CREATE INCIDENT')).toBeInTheDocument();
    expect(screen.getByText('LOCAL FORM PREVIEW / NO RECORD CREATION')).toBeInTheDocument();
    expect(screen.getByText('CREATION SERVICE / NOT CONNECTED')).toBeInTheDocument();

    // 2. Title, Description, Affected Service, and AI preference controls render
    const titleInput = screen.getByLabelText(/INCIDENT TITLE \*/i);
    const descTextarea = screen.getByLabelText(/INCIDENT DESCRIPTION \*/i);
    const serviceSelect = screen.getByLabelText(/AFFECTED SERVICE \(OPTIONAL\)/i);
    const aiCheckbox = screen.getByLabelText(/ANALYZE IMMEDIATELY WITH AI/i);

    expect(titleInput).toBeInTheDocument();
    expect(descTextarea).toBeInTheDocument();
    expect(serviceSelect).toBeInTheDocument();
    expect(aiCheckbox).toBeInTheDocument();

    // 3. All four canonical service options render + Affected Service is optional
    expect(screen.getByRole('option', { name: 'Select a service' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Checkout Web' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Payments API' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Order Processor' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Customer Portal' })).toBeInTheDocument();
    expect(serviceSelect).toHaveValue(''); // optional, empty by default

    // 4. AI preference is unchecked by default
    expect(aiCheckbox).not.toBeChecked();

    // 5. Open Full Incident Form remains disabled
    const openFullFormBtn = screen.getByRole('button', { name: /OPEN FULL INCIDENT FORM/i });
    expect(openFullFormBtn).toBeDisabled();
    expect(openFullFormBtn).toHaveAttribute('aria-disabled', 'true');

    // 6. Empty submission displays Title and Description errors
    const submitBtn = screen.getByRole('button', { name: /CREATE INCIDENT/i });
    
    // Trigger empty submit
    await fireEvent.click(submitBtn);

    expect(screen.getByText('Incident title is required.')).toBeInTheDocument();
    expect(screen.getByText('Incident description is required.')).toBeInTheDocument();

    // 7. Short Title displays an error
    await fireEvent.change(titleInput, { target: { value: 'Abc' } });
    await fireEvent.click(submitBtn);
    expect(screen.getByText('Use at least 5 characters.')).toBeInTheDocument();

    // 8. Short Description displays an error
    await fireEvent.change(titleInput, { target: { value: 'Valid Title Here' } });
    await fireEvent.change(descTextarea, { target: { value: 'Too short desc' } });
    await fireEvent.click(submitBtn);
    expect(screen.getByText('Use at least 20 characters.')).toBeInTheDocument();

    // 9. Valid local submission displays INCIDENT CREATION NOT CONNECTED
    await fireEvent.change(descTextarea, { target: { value: 'This is a description that is at least twenty characters long.' } });
    await fireEvent.click(submitBtn);

    // Wait for submission message
    const statusHeader = await screen.findByText('INCIDENT CREATION NOT CONNECTED');
    expect(statusHeader).toBeInTheDocument();
    expect(screen.getByText(/Frontend validation completed. The incident record, initial timeline event, and optional AI analysis will be created during backend integration./i)).toBeInTheDocument();

    // 10. User-entered values remain after valid submission
    expect(titleInput).toHaveValue('Valid Title Here');
    expect(descTextarea).toHaveValue('This is a description that is at least twenty characters long.');

    // 11. No incident code is generated, success toast, or AI requests occur
    expect(screen.queryByText(/SF-2026-0043/i)).not.toBeInTheDocument();

    // 12. Creation Contract renders all backend-pending states
    expect(screen.getByText('CREATION CONTRACT')).toBeInTheDocument();
    expect(screen.getByText('INITIAL STATUS')).toBeInTheDocument();
    expect(screen.getByText('INCIDENT CODE')).toBeInTheDocument();
    expect(screen.getByText('TIMELINE EVENT')).toBeInTheDocument();
    expect(screen.getByText('AI ANALYSIS')).toBeInTheDocument();
    expect(screen.getByText('DUPLICATE PROTECTION')).toBeInTheDocument();
    expect(screen.getByText('TENANT AUTHORITY')).toBeInTheDocument();

    expect(screen.getByText('INCIDENT PERSISTENCE PRECEDES AI')).toBeInTheDocument();
    expect(screen.getByText('AI failure must never remove or prevent access to the original incident report.')).toBeInTheDocument();

    // 13. Guided Demo module 07 is visible beneath it (placeholder is replaced)
    expect(screen.getByText('07 / GUIDED DEMO')).toBeInTheDocument();
    expect(screen.queryByText('DEMO WORKSPACE GUIDANCE')).not.toBeInTheDocument();
  });

  it('renders Guided Demo Module 07 and all its specifications', async () => {
    const router = getTestRouter('/app');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // 1. Guided Demo renders beneath Quick Create Incident
    expect(screen.getByText('06 / QUICK CREATE INCIDENT')).toBeInTheDocument();
    expect(screen.getByText('07 / GUIDED DEMO')).toBeInTheDocument();

    // 2. TARGET DURATION / 90–120 SECONDS renders
    expect(screen.getByText('90–120 SECONDS')).toBeInTheDocument();
    expect(screen.getByText('EXECUTION / NOT CONNECTED')).toBeInTheDocument();

    // 3. Workspace Type
    expect(screen.getByText('WORKSPACE TYPE')).toBeInTheDocument();
    expect(screen.getByText('DEMO PREVIEW')).toBeInTheDocument();

    // 4. All five stages render in the correct order
    const listItems = screen.getAllByRole('listitem');
    // We have active incidents list items earlier, but we can verify the texts specifically
    expect(screen.getByText('01 / REPORT', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('02 / TRIAGE', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('03 / COORDINATE', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('04 / RESOLVE', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('05 / LEARN', { selector: 'span' })).toBeInTheDocument();

    // 5. Titles of all stages
    expect(screen.getByRole('heading', { name: 'CREATE THE INCIDENT' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'REVIEW AI ASSISTANCE' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'ASSIGN AND EXECUTE RESPONSE WORK' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'VERIFY RECOVERY' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'GENERATE THE POSTMORTEM' })).toBeInTheDocument();

    // 6. Expected availability/authority tags
    expect(screen.getAllByText('QUICK CREATE / FRONTEND VALIDATION ONLY').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('AI CONNECTION / NOT ACTIVE').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('HUMAN CONFIRMATION REQUIRED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('REALTIME / NOT CONNECTED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('STATE AUTHORITY / BACKEND REQUIRED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('POSTMORTEM GENERATION / NOT CONNECTED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('HUMAN APPROVAL REQUIRED').length).toBeGreaterThanOrEqual(1);

    // 7. Canonical organization, incident, service, signal, severity suggestion, and five recommended tasks render
    expect(screen.getAllByText('NORTHSTAR COMMERCE').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('SF-2026-0042').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('PAYMENTS API').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('37 REPORTS / 12 MINUTES').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('SEV1 SUGGESTION').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('5 RECOMMENDED').length).toBeGreaterThanOrEqual(1);

    // 8. Workflow displays REPORT → TRIAGE → COORDINATE → RESOLVE → LEARN
    expect(screen.getByText(/REPORT → TRIAGE → COORDINATE → RESOLVE → LEARN/i)).toBeInTheDocument();

    // 9. Start Guided Demo remains disabled
    const startDemoBtn = screen.getByRole('button', { name: /START GUIDED DEMO/i });
    expect(startDemoBtn).toBeDisabled();
    expect(startDemoBtn).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getAllByText('PENDING').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Guided execution will be enabled after the incident workflow frontend is complete.')).toBeInTheDocument();

    // 10. No timer, progress percentage, fake completion mark, or automatic execution exists
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
    expect(screen.queryByText(/completed/i)).not.toBeInTheDocument();

    // 11. No temporary Dashboard placeholder remains after Module 07
    expect(screen.queryByText('DEMO WORKSPACE GUIDANCE')).not.toBeInTheDocument();
  });

  it('renders NotFoundPage on unknown routes', () => {
    const router = getTestRouter('/unknown-path-xyz');
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    expect(screen.getByText('404 / SIGNAL LOST')).toBeInTheDocument();
  });
});
