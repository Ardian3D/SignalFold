import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { RootLayout } from '@/components/layout/RootLayout';
import { AppShell } from '@/layouts/AppShell';
import { IncidentRoomPage } from '@/pages/IncidentRoomPage';

const getTestRouter = () => {
  return createMemoryRouter(
    [
      {
        path: '/app/incidents/SF-2026-0042',
        element: (
          <RootLayout>
            <AppShell>
              <IncidentRoomPage />
            </AppShell>
          </RootLayout>
        ),
      },
    ],
    { initialEntries: ['/app/incidents/SF-2026-0042'] }
  );
};

describe('Incident Room Page Layout and Responsive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Incident Room page correctly with canonical identifier and header details', () => {
    const router = getTestRouter();
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Verify canonical incident code
    expect(screen.getAllByText('SF-2026-0042')[0]).toBeInTheDocument();
    
    // Verify status
    expect(screen.getByText('STATUS: REPORTED')).toBeInTheDocument();

    // Verify main description
    expect(
      screen.getByText('Checkout payments failing after latest deployment')
    ).toBeInTheDocument();
  });

  it('verifies that desktop main area uses two primary columns and no third desktop column exists', () => {
    const { container } = render(
      <AppProviders>
        <RouterProvider router={getTestRouter()} />
      </AppProviders>
    );

    // Find the main operational grid layout container
    const gridContainer = container.querySelector('#incident-room-grid');
    expect(gridContainer).toBeInTheDocument();

    // Verify classes indicating two primary columns at widths >= 1000px
    expect(gridContainer?.className).toContain('min-[1000px]:grid-cols-[minmax(0,_2fr)_minmax(320px,_1fr)]');

    // Inside the grid, there should be exactly 2 direct children:
    // 1. LEFT WORKSPACE (Timeline wrapper)
    // 2. RIGHT OPERATIONAL RAIL (Stacked operational sections wrapper)
    const directChildren = gridContainer?.children;
    expect(directChildren?.length).toBe(2);

    // Ensure Timeline is the left/dominant workspace and Metadata/Tasks/Responders are on the right rail
    const leftChild = directChildren?.[0];
    const rightChild = directChildren?.[1];

    expect(leftChild?.tagName.toLowerCase()).toBe('main');
    expect(leftChild?.id).toBe('panel-TIMELINE');
    expect(leftChild?.className).toContain('min-[1000px]:block');

    expect(rightChild?.tagName.toLowerCase()).toBe('aside');
    expect(rightChild?.className).toContain('min-[1000px]:flex');
    expect(rightChild?.className).toContain('min-[1000px]:flex-col');

    // Verify actual component nesting:
    // Inside the right rail aside element, there must be exactly 3 stacked components:
    // 1. Response Tasks (#panel-TASKS)
    // 2. Responders
    // 3. Incident Metadata (#panel-DETAILS)
    const railChildren = rightChild?.children;
    expect(railChildren?.length).toBe(3);

    // Verify each child component position and role
    expect(railChildren?.[0].id).toBe('panel-TASKS');
    expect(railChildren?.[1].textContent).toContain('RESPONDERS');
    expect(railChildren?.[2].id).toBe('panel-DETAILS');
  });

  it('verifies the redesigned Timeline structured layout and populated event ledger state', () => {
    render(
      <AppProviders>
        <RouterProvider router={getTestRouter()} />
      </AppProviders>
    );

    // Verify Header inside Timeline
    expect(screen.getByText('INCIDENT TIMELINE')).toBeInTheDocument();
    expect(screen.getByText('REALTIME / NOT CONNECTED')).toBeInTheDocument();

    // Verify Zone 1: Technical Status Rail
    expect(screen.getByText('EVENT STREAM')).toBeInTheDocument();
    expect(screen.getByText('EVENT DATA')).toBeInTheDocument();
    expect(screen.getByText('4 MOCK EVENTS')).toBeInTheDocument();
    expect(screen.getAllByText('AUTHORITY').length).toBeGreaterThan(1);
    expect(screen.getAllByText('BACKEND REQUIRED').length).toBeGreaterThan(1);
    expect(screen.getByText('ORDER')).toBeInTheDocument();
    expect(screen.getByText('OLDEST FIRST')).toBeInTheDocument();

    // Verify Zone 2: Populated Event Ledger
    expect(screen.getByText('LEDGER STATE')).toBeInTheDocument();
    expect(screen.getAllByText('FRONTEND MOCK SEQUENCE').length).toBeGreaterThan(0);

    // Verify exactly four mock timeline records exist and are in the correct order
    const listItems = within(screen.getByRole('list', { name: 'Incident Timeline Events' })).getAllByRole('listitem');
    expect(listItems.length).toBe(4);

    // Event 01: INCIDENT_CREATED
    expect(within(listItems[0]).getAllByText('INCIDENT REPORTED')[0]).toBeInTheDocument();
    expect(within(listItems[0]).getAllByText('INCIDENT_CREATED')[0]).toBeInTheDocument();
    expect(within(listItems[0]).getAllByText(/Checkout payment failures/)[0]).toBeInTheDocument();
    
    // Event 02: INCIDENT_CONTEXT_ADDED
    expect(within(listItems[1]).getAllByText('CUSTOMER SIGNAL RECORDED')[0]).toBeInTheDocument();
    expect(within(listItems[1]).getAllByText('INCIDENT_CONTEXT_ADDED')[0]).toBeInTheDocument();
    expect(within(listItems[1]).getAllByText(/documents 37 customer reports/)[0]).toBeInTheDocument();
    expect(within(listItems[1]).getAllByText('37 REPORTS / 12 MINUTES')[0]).toBeInTheDocument();

    // Event 03: AI_TRIAGE_PREVIEW
    expect(within(listItems[2]).getAllByText('AI TRIAGE SUGGESTION PREPARED')[0]).toBeInTheDocument();
    expect(within(listItems[2]).getAllByText('AI_TRIAGE_PREVIEW')[0]).toBeInTheDocument();
    expect(within(listItems[2]).getAllByText('HUMAN CONFIRMATION REQUIRED')[0]).toBeInTheDocument();

    // Event 04: TASK_RECOMMENDATIONS_PREVIEWED
    expect(within(listItems[3]).getAllByText('RESPONSE TASK SET PROPOSED')[0]).toBeInTheDocument();
    expect(within(listItems[3]).getAllByText('TASK_RECOMMENDATIONS_PREVIEWED')[0]).toBeInTheDocument();
    expect(within(listItems[3]).getAllByText('5 RECOMMENDED / NOT ACCEPTED')[0]).toBeInTheDocument();

    // Verify metadata display rules
    // TIME displaying NOT AVAILABLE
    expect(screen.getAllByText('TIME').length).toBeGreaterThanOrEqual(4);
    // PERSISTENCE displaying NOT CONNECTED
    expect(screen.getAllByText('PERSISTENCE').length).toBeGreaterThanOrEqual(4);

    // Verify unabbreviated metadata values render completely
    expect(screen.getAllByText('CANONICAL INCIDENT RECORD').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('FRONTEND AI PREVIEW').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('AI SERVICE / NOT CONNECTED').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('SUPPORT CONTEXT').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('NOT AVAILABLE').length).toBeGreaterThanOrEqual(4);
    expect(screen.getAllByText('NOT CONNECTED').length).toBeGreaterThanOrEqual(4);

    // Verify old empty-state components/elements are removed
    expect(screen.queryByText('NO TIMELINE EVENTS LOADED')).not.toBeInTheDocument();
    expect(screen.queryByText('Timeline events and internal updates will appear here after the incident record and realtime event stream are connected.')).not.toBeInTheDocument();

    // Verify Zone 3: Event-Scope Footer
    expect(screen.getByText('SUPPORTED EVENT SCOPE')).toBeInTheDocument();
    const categories = ['INCIDENT', 'STATUS', 'SEVERITY', 'TASK', 'NOTE', 'RESOLUTION'];
    categories.forEach(cat => {
      expect(screen.getAllByText(cat).length).toBeGreaterThanOrEqual(1);
    });

    // Verify Timeline Contract
    expect(screen.getByText('TIMELINE CONTRACT')).toBeInTheDocument();
    expect(screen.getByText('APPEND-ONLY EVENT HISTORY')).toBeInTheDocument();
    expect(screen.getByText(/During backend integration, authoritative incident actions will append/)).toBeInTheDocument();
  });

  it('verifies Response Tasks, Responders, and Incident Metadata share one right rail with no invented entities', () => {
    render(
      <AppProviders>
        <RouterProvider router={getTestRouter()} />
      </AppProviders>
    );

    // Response Tasks validation (uninvented, strictly matching request)
    expect(screen.getByText('RESPONSE TASKS')).toBeInTheDocument();
    expect(screen.getAllByText('5 SUGGESTIONS').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('NOT ACCEPTED').length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText('These recommendations have not been accepted as IncidentTask records. An authorized human must review them before creation, assignment, or execution.')
    ).toBeInTheDocument();

    // Responders validation (unassigned, compact, strictly matching request)
    expect(screen.getByText('RESPONDERS')).toBeInTheDocument();
    expect(screen.getByText('INCIDENT COMMANDER')).toBeInTheDocument();
    expect(screen.getAllByText('UNASSIGNED').length).toBeGreaterThan(0);
    expect(screen.getByText('CURRENT OPERATOR')).toBeInTheDocument();
    expect(screen.getByText('RESPONDER DIRECTORY')).toBeInTheDocument();
    expect(screen.getByText('MEMBERSHIP DATA NOT LOADED')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'VIEW RESPONDER CONTEXT' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ASSIGN INCIDENT COMMANDER' })).toBeDisabled();

    // Incident Metadata validation (strictly matching request)
    expect(screen.getAllByText('INCIDENT METADATA').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ORGANIZATION').length).toBeGreaterThan(0);
    expect(screen.getAllByText('NORTHSTAR COMMERCE').length).toBeGreaterThan(0);
    expect(screen.getAllByText('SERVICE').length).toBeGreaterThan(0);
    expect(screen.getAllByText('PAYMENTS API').length).toBeGreaterThan(0);
    expect(screen.getAllByText('RECORD STATE').length).toBeGreaterThan(0);
    expect(screen.getAllByText('FRONTEND MOCK').length).toBeGreaterThan(0);
    expect(screen.getAllByText('AUTHORITY').length).toBeGreaterThan(0);
    expect(screen.getAllByText('BACKEND REQUIRED').length).toBeGreaterThan(0);
  });

  it('verifies mobile tabs remain unchanged, accessible, and correctly toggle sections below 1000px', () => {
    render(
      <AppProviders>
        <RouterProvider router={getTestRouter()} />
      </AppProviders>
    );

    // Verify tabs
    const tabTimeline = screen.getByRole('tab', { name: 'TIMELINE' });
    const tabTasks = screen.getByRole('tab', { name: 'TASKS' });
    const tabDetails = screen.getByRole('tab', { name: 'DETAILS' });

    expect(tabTimeline).toBeInTheDocument();
    expect(tabTasks).toBeInTheDocument();
    expect(tabDetails).toBeInTheDocument();

    // Timeline active by default
    expect(tabTimeline).toHaveAttribute('aria-selected', 'true');
    expect(tabTasks).toHaveAttribute('aria-selected', 'false');
    expect(tabDetails).toHaveAttribute('aria-selected', 'false');

    // Click TASKS tab
    fireEvent.click(tabTasks);
    expect(tabTimeline).toHaveAttribute('aria-selected', 'false');
    expect(tabTasks).toHaveAttribute('aria-selected', 'true');

    // Click DETAILS tab
    fireEvent.click(tabDetails);
    expect(tabDetails).toHaveAttribute('aria-selected', 'true');
  });

  it('verifies the AI Triage Review panel renders all canonical content, sections, and controls are disabled with backend notice', () => {
    render(
      <AppProviders>
        <RouterProvider router={getTestRouter()} />
      </AppProviders>
    );

    // Header content
    expect(screen.getByText('AI TRIAGE REVIEW')).toBeInTheDocument();
    expect(screen.getByText('STRUCTURED SUGGESTION / FRONTEND PREVIEW')).toBeInTheDocument();
    expect(screen.getByText('AI SERVICE:')).toBeInTheDocument();
    expect(screen.getByText('MODEL TARGET:')).toBeInTheDocument();
    expect(screen.getByText('OUTPUT STATE:')).toBeInTheDocument();
    expect(screen.getByText('DEEPSEEK-V4-FLASH')).toBeInTheDocument();

    // Authority Notice
    expect(screen.getByText('AI ASSISTS. HUMANS DECIDE.')).toBeInTheDocument();
    expect(screen.getByText(/This structured preview does not change incident severity/)).toBeInTheDocument();

    // Structured Analysis sections
    expect(screen.getByText('01 / INCIDENT SUMMARY')).toBeInTheDocument();
    expect(screen.getByText(/Support has recorded 37 customer reports/)).toBeInTheDocument();
    
    expect(screen.getByText('02 / SEVERITY SUGGESTION')).toBeInTheDocument();
    expect(screen.getByText('SEV1 [AI SUGGESTION]')).toBeInTheDocument();
    expect(screen.getAllByText('HUMAN CONFIRMATION REQUIRED')[0]).toBeInTheDocument();

    expect(screen.getByText('03 / AFFECTED AREA')).toBeInTheDocument();
    expect(screen.getAllByText('PAYMENTS API')[0]).toBeInTheDocument();
    expect(screen.getByText('DEPLOYMENT RELATION:')).toBeInTheDocument();
    expect(screen.getByText('WORKING HYPOTHESIS')).toBeInTheDocument();

    expect(screen.getByText('04 / CUSTOMER & BUSINESS IMPACT')).toBeInTheDocument();
    expect(screen.getByText('NOT RECONCILED')).toBeInTheDocument();

    expect(screen.getByText('05 / CONFIDENCE')).toBeInTheDocument();
    expect(screen.getByText('CONFIDENCE SCORE: NOT AVAILABLE')).toBeInTheDocument();

    expect(screen.getByText('06 / RISK FLAGS')).toBeInTheDocument();
    expect(screen.getByText('CUSTOMER-FACING PAYMENT FAILURE')).toBeInTheDocument();
    expect(screen.getByText('BUSINESS-CRITICAL FLOW AFFECTED')).toBeInTheDocument();
    expect(screen.getByText('DEPLOYMENT CORRELATION UNCONFIRMED')).toBeInTheDocument();

    expect(screen.getByText('07 / CLARIFYING QUESTIONS')).toBeInTheDocument();
    expect(screen.getByText('DRAFT QUESTIONS / HUMAN REVIEW REQUIRED')).toBeInTheDocument();
    expect(screen.getByText(/Which deployment changes affected the Payments API/)).toBeInTheDocument();

    expect(screen.getByText('08 / SUGGESTED IMMEDIATE ACTION')).toBeInTheDocument();
    expect(screen.getByText('VERIFY PAYMENT GATEWAY HEALTH AND COMPARE THE LATEST DEPLOYMENT CHANGES.')).toBeInTheDocument();

    // Recommended Response Tasks
    expect(screen.getByText('RECOMMENDED RESPONSE TASKS')).toBeInTheDocument();
    expect(screen.getAllByText('5 SUGGESTIONS').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('NOT ACCEPTED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('COMPARE LATEST DEPLOYMENT CHANGES').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('CONFIRM PAYMENT GATEWAY HEALTH').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('RUN CHECKOUT TRANSACTION TEST').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('PREPARE ROLLBACK').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('DRAFT CUSTOMER-FACING STATUS UPDATE').length).toBeGreaterThanOrEqual(1);

    // Review Actions controls disabled
    const acceptBtn = screen.getByRole('button', { name: 'ACCEPT SEVERITY SUGGESTION' });
    const editBtn = screen.getByRole('button', { name: 'EDIT SUGGESTION' });
    const rejectBtn = screen.getByRole('button', { name: 'REJECT SUGGESTION' });
    const addTaskBtn = screen.getByRole('button', { name: 'ADD RECOMMENDED TASKS' });

    expect(acceptBtn).toBeDisabled();
    expect(acceptBtn).toHaveAttribute('aria-disabled', 'true');
    expect(editBtn).toBeDisabled();
    expect(editBtn).toHaveAttribute('aria-disabled', 'true');
    expect(rejectBtn).toBeDisabled();
    expect(rejectBtn).toHaveAttribute('aria-disabled', 'true');
    expect(addTaskBtn).toBeDisabled();
    expect(addTaskBtn).toHaveAttribute('aria-disabled', 'true');

    expect(screen.getAllByText('BACKEND AUTHORITY REQUIRED')[0]).toBeInTheDocument();
    expect(screen.getByText(/Review controls will become available after authenticated membership/)).toBeInTheDocument();

    // Output Contract
    expect(screen.getByText('OUTPUT CONTRACT')).toBeInTheDocument();
    expect(screen.getByText('STRUCTURED RESPONSE')).toBeInTheDocument();
    expect(screen.getByText('SCHEMA VALIDATION')).toBeInTheDocument();
    expect(screen.getByText('SANITIZED INPUT')).toBeInTheDocument();
    expect(screen.getByText('HIDDEN REASONING')).toBeInTheDocument();
    expect(screen.getByText('FAILURE FALLBACK')).toBeInTheDocument();
    expect(screen.getByText('AI FAILURE MUST NOT ALTER OR REMOVE THE INCIDENT REPORT.')).toBeInTheDocument();
  });

  it('verifies Response Tasks structured review queue and contract', () => {
    const { container } = render(
      <AppProviders>
        <RouterProvider router={getTestRouter()} />
      </AppProviders>
    );

    // Verify Response Tasks renders in the right operational rail (tabpanel panel-TASKS exists)
    const tasksPanel = container.querySelector('#panel-TASKS');
    expect(tasksPanel).toBeInTheDocument();

    // Verify exact header details
    expect(within(tasksPanel as HTMLElement).getByText('5 SUGGESTIONS')).toBeInTheDocument();
    expect(within(tasksPanel as HTMLElement).getByText('SUGGESTIONS')).toBeInTheDocument();
    expect(within(tasksPanel as HTMLElement).getByText('LOCAL PREVIEWS')).toBeInTheDocument();
    expect(within(tasksPanel as HTMLElement).getByText('BACKEND RECORDS')).toBeInTheDocument();
    expect(within(tasksPanel as HTMLElement).getByText('QUEUE AUTHORITY')).toBeInTheDocument();

    // Verify Authority Notice
    expect(within(tasksPanel as HTMLElement).getByText('AI TASK SUGGESTIONS')).toBeInTheDocument();
    expect(within(tasksPanel as HTMLElement).getByText(/These recommendations have not been accepted as IncidentTask records/)).toBeInTheDocument();

    // Verify exactly five task suggestions render
    const suggestionList = within(tasksPanel as HTMLElement).getByRole('list', { name: 'AI Recommended Response Tasks' });
    const items = within(suggestionList).getAllByRole('listitem');
    expect(items.length).toBe(5);

    // Check canonical order, titles and draft descriptions
    const expectedSuggestions = [
      {
        sequence: '01',
        title: 'COMPARE LATEST DEPLOYMENT CHANGES',
        desc: 'Review the latest Payments API deployment changes and identify relevant code, configuration, or dependency differences.'
      },
      {
        sequence: '02',
        title: 'CONFIRM PAYMENT GATEWAY HEALTH',
        desc: 'Verify the current health and response behavior of payment-gateway dependencies used by the Payments API.'
      },
      {
        sequence: '03',
        title: 'RUN CHECKOUT TRANSACTION TEST',
        desc: 'Run a controlled checkout transaction test to reproduce the reported card-payment failure.'
      },
      {
        sequence: '04',
        title: 'PREPARE ROLLBACK',
        desc: 'Prepare a rollback option for the latest deployment without executing it until an authorized decision is made.'
      },
      {
        sequence: '05',
        title: 'DRAFT CUSTOMER-FACING STATUS UPDATE',
        desc: 'Prepare a customer-facing status-update draft for human review without publishing it.'
      }
    ];

    expectedSuggestions.forEach((s, idx) => {
      const item = items[idx];
      expect(within(item).getByText(s.sequence)).toBeInTheDocument();
      expect(within(item).getByText(s.title)).toBeInTheDocument();
      expect(within(item).getByText(s.desc)).toBeInTheDocument();

      // Verify states
      expect(within(item).getByText('SOURCE')).toBeInTheDocument();
      expect(within(item).getByText('AI TRIAGE PREVIEW')).toBeInTheDocument();

      expect(within(item).getByText('SUGGESTION STATE')).toBeInTheDocument();
      expect(within(item).getByText('NOT ACCEPTED')).toBeInTheDocument();

      expect(within(item).getByText('TASK RECORD')).toBeInTheDocument();
      expect(within(item).getAllByText('NOT CREATED').length).toBeGreaterThanOrEqual(1);

      expect(within(item).getByText('OWNERSHIP')).toBeInTheDocument();
      expect(within(item).getByText('UNASSIGNED')).toBeInTheDocument();

      expect(within(item).getByText('STATUS')).toBeInTheDocument();
      expect(within(item).getByText('NOT APPLICABLE')).toBeInTheDocument();

      // No priority, due time, task ID, timestamp, assignee, or TODO state is present
      expect(within(item).queryByText('TODO')).not.toBeInTheDocument();
      expect(within(item).queryByText('PRIORITY')).not.toBeInTheDocument();
      expect(within(item).queryByText('DUE')).not.toBeInTheDocument();

      // Review task controls are now enabled in Phase 02
      const reviewBtn = within(item).getByRole('button', { name: /REVIEW TASK/ });
      expect(reviewBtn).toBeEnabled();
    });

    // Accept All Suggestions and Create Custom Task panel actions remain disabled
    const acceptAllBtn = within(tasksPanel as HTMLElement).getByRole('button', { name: 'ACCEPT ALL SUGGESTIONS' });
    const createCustomBtn = within(tasksPanel as HTMLElement).getByRole('button', { name: 'CREATE CUSTOM TASK' });
    expect(acceptAllBtn).toBeDisabled();
    expect(acceptAllBtn).toHaveAttribute('aria-disabled', 'true');
    expect(createCustomBtn).toBeDisabled();
    expect(createCustomBtn).toHaveAttribute('aria-disabled', 'true');

    // Authority required message
    expect(within(tasksPanel as HTMLElement).getByText('BACKEND AUTHORITY REQUIRED')).toBeInTheDocument();
    expect(within(tasksPanel as HTMLElement).getByText(/Task review and creation will become available after authenticated membership/)).toBeInTheDocument();

    // Task Contract renders
    expect(within(tasksPanel as HTMLElement).getByText('TASK CONTRACT')).toBeInTheDocument();
    expect(within(tasksPanel as HTMLElement).getByText('FUTURE SPECIFICATION')).toBeInTheDocument();
    expect(within(tasksPanel as HTMLElement).getByText('CLAIM SAFETY')).toBeInTheDocument();
    expect(within(tasksPanel as HTMLElement).getByText('SERVER REQUIRED')).toBeInTheDocument();
    expect(within(tasksPanel as HTMLElement).getByText(/Task claiming must be concurrency-safe/)).toBeInTheDocument();

    // Verify other operational rail items exist and are beneath Response Tasks
    // e.g. RESPONDERS and INCIDENT METADATA
    expect(screen.getByText('RESPONDERS')).toBeInTheDocument();
    expect(screen.getByText('INCIDENT METADATA')).toBeInTheDocument();

    // Verify timeline and AI triage remain unchanged
    expect(screen.getByText('INCIDENT TIMELINE')).toBeInTheDocument();
    expect(screen.getByText('AI TRIAGE REVIEW')).toBeInTheDocument();
  });

  it('verifies Phase 02 Task Review Drawer workflow and validation contract', () => {
    const { container } = render(
      <AppProviders>
        <RouterProvider router={getTestRouter()} />
      </AppProviders>
    );

    // Verify drawer is initially closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const tasksPanel = container.querySelector('#panel-TASKS');
    expect(tasksPanel).toBeInTheDocument();

    const suggestionList = within(tasksPanel as HTMLElement).getByRole('list', { name: 'AI Recommended Response Tasks' });
    const items = within(suggestionList).getAllByRole('listitem');

    // Click first suggestion's review button
    const reviewBtn1 = within(items[0]).getByRole('button', { name: /REVIEW TASK/ });
    fireEvent.click(reviewBtn1);

    // Verify drawer is open and has correct headings and labels
    const drawer = screen.getByRole('dialog');
    expect(drawer).toBeInTheDocument();
    expect(within(drawer).getByText('TASK REVIEW')).toBeInTheDocument();
    expect(within(drawer).getByText('AI SUGGESTION / FRONTEND PREVIEW')).toBeInTheDocument();
    expect(within(drawer).getByText('RECORD')).toBeInTheDocument();
    expect(within(drawer).getAllByText('NOT CREATED').length).toBeGreaterThanOrEqual(1);

    // Verify task identity displays
    expect(within(drawer).getAllByText('SUGGESTION')[0]).toBeInTheDocument();
    expect(within(drawer).getAllByText('01')[0]).toBeInTheDocument();
    expect(within(drawer).getAllByText('INCIDENT')[0]).toBeInTheDocument();
    expect(within(drawer).getAllByText('SF-2026-0042')[0]).toBeInTheDocument();
    expect(within(drawer).getAllByText('SOURCE')[0]).toBeInTheDocument();
    expect(within(drawer).getAllByText('AI TRIAGE PREVIEW')[0]).toBeInTheDocument();
    expect(within(drawer).getAllByText('SUGGESTION STATE')[0]).toBeInTheDocument();
    expect(within(drawer).getAllByText('NOT ACCEPTED')[0]).toBeInTheDocument();

    // Verify editable fields prefilled
    const titleInput = within(drawer).getByLabelText(/TITLE/) as HTMLInputElement;
    expect(titleInput.value).toBe('COMPARE LATEST DEPLOYMENT CHANGES');

    const descTextarea = within(drawer).getByLabelText(/DESCRIPTION/) as HTMLTextAreaElement;
    expect(descTextarea.value).toBe('Review the latest Payments API deployment changes and identify relevant code, configuration, or dependency differences.');

    // Priority select should start unselected
    const prioritySelect = within(drawer).getByLabelText(/PRIORITY/) as HTMLSelectElement;
    expect(prioritySelect.value).toBe('');

    // Assignee is disabled
    const assigneeSelect = within(drawer).getByLabelText(/ASSIGNEE/) as HTMLSelectElement;
    expect(assigneeSelect).toBeDisabled();
    expect(assigneeSelect.value).toBe('UNASSIGNED');

    // Due time is empty by default
    const dueTimeInput = within(drawer).getByLabelText(/DUE TIME/) as HTMLInputElement;
    expect(dueTimeInput.value).toBe('');

    // Future record preview
    expect(within(drawer).getByText('TASK RECORD PREVIEW')).toBeInTheDocument();
    expect(within(drawer).getByText('FUTURE RECORD PREVIEW')).toBeInTheDocument();
    expect(within(drawer).getByText('STATUS AFTER CREATION')).toBeInTheDocument();
    expect(within(drawer).getByText('TODO')).toBeInTheDocument();

    // Reset button exists, and we can edit title & description and reset them
    fireEvent.change(titleInput, { target: { value: 'EDITED TITLE' } });
    fireEvent.change(descTextarea, { target: { value: 'EDITED DESCRIPTION' } });
    expect(titleInput.value).toBe('EDITED TITLE');
    expect(descTextarea.value).toBe('EDITED DESCRIPTION');

    const resetBtn = within(drawer).getByRole('button', { name: 'RESET TO AI SUGGESTION' });
    fireEvent.click(resetBtn);

    expect(titleInput.value).toBe('COMPARE LATEST DEPLOYMENT CHANGES');
    expect(descTextarea.value).toBe('Review the latest Payments API deployment changes and identify relevant code, configuration, or dependency differences.');

    // Edit fields to trigger validation error
    // 1. Empty title validation
    fireEvent.change(titleInput, { target: { value: '' } });
    const validateBtn = within(drawer).getByRole('button', { name: 'VALIDATE TASK DRAFT' });
    fireEvent.click(validateBtn);
    expect(within(drawer).getByText('Task title is required.')).toBeInTheDocument();

    // 2. Short title validation
    fireEvent.change(titleInput, { target: { value: 'AB' } });
    fireEvent.click(validateBtn);
    expect(within(drawer).getByText('Use at least 3 characters.')).toBeInTheDocument();

    // Restore valid title, test priority unselected validation
    fireEvent.change(titleInput, { target: { value: 'VALID TITLE' } });
    fireEvent.click(validateBtn);
    expect(within(drawer).getByText('Select a task priority before creation.')).toBeInTheDocument();

    // Select priority and validate
    fireEvent.change(prioritySelect, { target: { value: 'HIGH' } });
    fireEvent.click(validateBtn);

    // Local validation succeeds
    expect(within(drawer).getByText('TASK DRAFT VALIDATED LOCALLY')).toBeInTheDocument();
    expect(within(drawer).getByText(/The reviewed suggestion is ready for backend-controlled task creation/)).toBeInTheDocument();

    // Verify CREATE TASK RECORD remains disabled
    const createBtn = within(drawer).getByRole('button', { name: 'CREATE TASK RECORD' });
    expect(createBtn).toBeDisabled();
    expect(createBtn).toHaveAttribute('aria-disabled', 'true');

    // Close drawer via CLOSE REVIEW
    const closeReviewBtn = within(drawer).getByRole('button', { name: 'CLOSE REVIEW' });
    fireEvent.click(closeReviewBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Click second suggestion's review button and check its custom details prefilled
    const reviewBtn2 = within(items[1]).getByRole('button', { name: /REVIEW TASK/ });
    fireEvent.click(reviewBtn2);
    
    const secondDrawer = screen.getByRole('dialog');
    expect(secondDrawer).toBeInTheDocument();
    expect(within(secondDrawer).getByText('02')).toBeInTheDocument();
    const secondTitleInput = within(secondDrawer).getByLabelText(/TITLE/) as HTMLInputElement;
    expect(secondTitleInput.value).toBe('CONFIRM PAYMENT GATEWAY HEALTH');

    // Close via Close button
    const closeIconBtn = within(secondDrawer).getByRole('button', { name: 'Close task review' });
    fireEvent.click(closeIconBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('verifies Phase 03 Local Task Record Preview lifecycle (creation, duplicate prevention, removal, clearing)', () => {
    const { container } = render(
      <AppProviders>
        <RouterProvider router={getTestRouter()} />
      </AppProviders>
    );

    const tasksPanel = container.querySelector('#panel-TASKS') as HTMLElement;
    expect(tasksPanel).toBeInTheDocument();

    // Verify initially no local previews
    expect(within(tasksPanel).getByText('NO LOCAL TASK PREVIEWS')).toBeInTheDocument();
    
    const countBadge = within(tasksPanel).getAllByText('0')[0]; // LOCAL PREVIEWS count
    expect(countBadge).toBeInTheDocument();

    const suggestionList = within(tasksPanel).getByRole('list', { name: 'AI Recommended Response Tasks' });
    const items = within(suggestionList).getAllByRole('listitem');

    // Open first suggestion
    const reviewBtn1 = within(items[0]).getByRole('button', { name: /REVIEW TASK/ });
    fireEvent.click(reviewBtn1);

    const drawer = screen.getByRole('dialog');
    expect(drawer).toBeInTheDocument();

    // Verify CREATE LOCAL TASK PREVIEW is initially disabled
    const createPreviewBtn = within(drawer).getByRole('button', { name: 'CREATE LOCAL TASK PREVIEW' });
    expect(createPreviewBtn).toBeDisabled();

    // Validate the draft
    const prioritySelect = within(drawer).getByLabelText(/PRIORITY/) as HTMLSelectElement;
    fireEvent.change(prioritySelect, { target: { value: 'HIGH' } });

    const validateBtn = within(drawer).getByRole('button', { name: 'VALIDATE TASK DRAFT' });
    fireEvent.click(validateBtn);

    // Verify validated alert and button enabled
    expect(within(drawer).getByText('TASK DRAFT VALIDATED LOCALLY')).toBeInTheDocument();
    expect(createPreviewBtn).toBeEnabled();

    // Create the preview
    fireEvent.click(createPreviewBtn);

    // Drawer should close
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Verify local preview element appears
    expect(within(tasksPanel).queryByText('NO LOCAL TASK PREVIEWS')).not.toBeInTheDocument();
    expect(within(tasksPanel).getByText('LP-01')).toBeInTheDocument();
    expect(within(tasksPanel).getAllByText('COMPARE LATEST DEPLOYMENT CHANGES').length).toBeGreaterThanOrEqual(2);

    // Open suggestion 01 again to try creating a duplicate
    fireEvent.click(reviewBtn1);
    const drawerDup = screen.getByRole('dialog');
    expect(within(drawerDup).getByRole('button', { name: 'CREATE LOCAL TASK PREVIEW' })).toBeDisabled();
    
    // Validate again
    const prioritySelectDup = within(drawerDup).getByLabelText(/PRIORITY/) as HTMLSelectElement;
    fireEvent.change(prioritySelectDup, { target: { value: 'CRITICAL' } });
    fireEvent.click(within(drawerDup).getByRole('button', { name: 'VALIDATE TASK DRAFT' }));
    expect(within(drawerDup).getByRole('button', { name: 'CREATE LOCAL TASK PREVIEW' })).toBeEnabled();
    
    // Attempt to create duplicate
    fireEvent.click(within(drawerDup).getByRole('button', { name: 'CREATE LOCAL TASK PREVIEW' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Verify announcement banner of duplicate warning
    expect(within(tasksPanel).getByText('LOCAL PREVIEW EXISTS')).toBeInTheDocument();
    expect(within(tasksPanel).getByText(/A local task preview for suggestion 01 already exists/)).toBeInTheDocument();

    // Open suggestion 02 to create a second unique preview
    const reviewBtn2 = within(items[1]).getByRole('button', { name: /REVIEW TASK/ });
    fireEvent.click(reviewBtn2);

    const drawer2 = screen.getByRole('dialog');
    const prioritySelect2 = within(drawer2).getByLabelText(/PRIORITY/) as HTMLSelectElement;
    fireEvent.change(prioritySelect2, { target: { value: 'LOW' } });
    fireEvent.click(within(drawer2).getByRole('button', { name: 'VALIDATE TASK DRAFT' }));
    fireEvent.click(within(drawer2).getByRole('button', { name: 'CREATE LOCAL TASK PREVIEW' }));

    // Verify we have 2 previews: LP-01 and LP-02
    expect(within(tasksPanel).getByText('LP-01')).toBeInTheDocument();
    expect(within(tasksPanel).getByText('LP-02')).toBeInTheDocument();
    expect(within(tasksPanel).getAllByText('CONFIRM PAYMENT GATEWAY HEALTH').length).toBeGreaterThanOrEqual(2);

    // Remove LP-02
    const removeBtn = within(tasksPanel).getAllByRole('button', { name: 'REMOVE LOCAL PREVIEW' })[1];
    fireEvent.click(removeBtn);

    // Only LP-01 remains
    expect(within(tasksPanel).queryByText('LP-02')).not.toBeInTheDocument();
    expect(within(tasksPanel).getByText('LP-01')).toBeInTheDocument();

    // Clear all previews
    const clearBtn = within(tasksPanel).getByRole('button', { name: 'CLEAR LOCAL PREVIEWS' });
    fireEvent.click(clearBtn);

    // Verify back to empty state
    expect(within(tasksPanel).getByText('NO LOCAL TASK PREVIEWS')).toBeInTheDocument();
  });

  it('verifies the Responder Context Drawer triggers, displays all sections correctly, and handles closing and escape key', () => {
    render(
      <AppProviders>
        <RouterProvider router={getTestRouter()} />
      </AppProviders>
    );

    // Verify drawer is initially closed
    expect(screen.queryByRole('dialog', { name: 'RESPONDER CONTEXT' })).not.toBeInTheDocument();

    // Find and click the trigger button
    const viewContextBtn = screen.getByRole('button', { name: 'VIEW RESPONDER CONTEXT' });
    expect(viewContextBtn).toBeInTheDocument();
    fireEvent.click(viewContextBtn);

    // Verify the drawer is open and has correct ARIA attributes
    const drawer = screen.getByRole('dialog');
    expect(drawer).toBeInTheDocument();
    expect(within(drawer).getByText('RESPONDER CONTEXT')).toBeInTheDocument();
    expect(within(drawer).getByText('ORGANIZATION READINESS / SYSTEM STATE')).toBeInTheDocument();

    // --- Section 1: Membership Readiness ---
    expect(within(drawer).getByText('01. MEMBERSHIP READINESS')).toBeInTheDocument();
    expect(within(drawer).getByText('AUTHENTICATED USER')).toBeInTheDocument();
    expect(within(drawer).getByText('BACKEND REQUIRED / NOT ACTIVE')).toBeInTheDocument();
    expect(within(drawer).getByText('ACTIVE ORGANIZATION MEMBERSHIP')).toBeInTheDocument();
    expect(within(drawer).getByText('BACKEND REQUIRED / NOT LOADED')).toBeInTheDocument();
    expect(within(drawer).getByText('ROLE VERIFICATION')).toBeInTheDocument();
    expect(within(drawer).getByText('BACKEND REQUIRED / NOT VERIFIED')).toBeInTheDocument();
    expect(within(drawer).getByText('COMMANDER ELIGIBILITY')).toBeInTheDocument();
    expect(within(drawer).getByText('BACKEND REQUIRED / NOT DETERMINED')).toBeInTheDocument();
    expect(within(drawer).getByText('RESPONDER DIRECTORY')).toBeInTheDocument();
    expect(within(drawer).getAllByText('NOT LOADED').length).toBeGreaterThan(0);
    expect(within(drawer).getByText('REALTIME PRESENCE')).toBeInTheDocument();
    expect(within(drawer).getAllByText('NOT CONNECTED').length).toBeGreaterThan(0);

    // --- Section 2: Role Authority Reference ---
    expect(within(drawer).getByText('02. ROLE AUTHORITY REFERENCE')).toBeInTheDocument();
    expect(within(drawer).getByText('REPORTER')).toBeInTheDocument();
    expect(within(drawer).getByText('RESPONDER')).toBeInTheDocument();
    expect(within(drawer).getByText('INCIDENT MANAGER')).toBeInTheDocument();
    expect(within(drawer).getByText('ORGANIZATION ADMIN')).toBeInTheDocument();
    expect(within(drawer).getByText(/Can report incidents and add context/)).toBeInTheDocument();
    expect(within(drawer).getByText(/Can coordinate response work and manage authorized task activity/)).toBeInTheDocument();
    expect(within(drawer).getByText(/Can control severity, status, ownership, resolution/)).toBeInTheDocument();
    expect(within(drawer).getByText(/Can manage organization membership and has incident-management/)).toBeInTheDocument();

    // --- Section 3: Directory Schema ---
    expect(within(drawer).getByText('03. DIRECTORY SCHEMA')).toBeInTheDocument();
    expect(within(drawer).getByText('SCHEMA VERIFICATION')).toBeInTheDocument();
    expect(within(drawer).getAllByText('MEMBERSHIP DATA NOT LOADED').length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText('MEMBER').length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText('ROLE').length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText('INCIDENT PARTICIPATION').length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText('PRESENCE').length).toBeGreaterThan(0);
    expect(within(drawer).getByText('NOTICE: DIRECTORY VERIFICATION ACTIVE')).toBeInTheDocument();
    expect(within(drawer).getByText(/DO NOT GENERATE FAKE DIRECTORY RECORDS/)).toBeInTheDocument();

    // --- Section 4: Participation Contract ---
    expect(within(drawer).getByText('04. PARTICIPATION CONTRACT')).toBeInTheDocument();
    expect(within(drawer).getByText('ORGANIZATION ACCESS')).toBeInTheDocument();
    expect(within(drawer).getAllByText('ACTIVE MEMBERSHIP REQUIRED').length).toBeGreaterThan(0);
    expect(within(drawer).getByText('COMMANDER ROLE')).toBeInTheDocument();
    expect(within(drawer).getAllByText('INCIDENT MANAGER OR ADMIN').length).toBeGreaterThan(0);
    expect(within(drawer).getByText('TASK ASSIGNEE')).toBeInTheDocument();
    expect(within(drawer).getAllByText('ACTIVE MEMBER REQUIRED').length).toBeGreaterThan(0);
    expect(within(drawer).getByText('CLAIM SAFETY')).toBeInTheDocument();
    expect(within(drawer).getAllByText('SERVER CONTROLLED').length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText('PRESENCE').length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText('REALTIME SUBSCRIPTION REQUIRED').length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText('AUDIT EVENT').length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText('SERVER GENERATED').length).toBeGreaterThan(0);
    expect(within(drawer).getByText('FRONTEND VISIBILITY IS NOT PERMISSION ENFORCEMENT.')).toBeInTheDocument();
    expect(within(drawer).getByText(/Backend security rules must verify tenant membership/)).toBeInTheDocument();

    // Verify closing via Close icon button
    const closeBtn = screen.getByLabelText('Close responder context');
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Reopen and close via DISMISS button
    fireEvent.click(viewContextBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    const dismissBtn = screen.getByRole('button', { name: 'DISMISS' });
    fireEvent.click(dismissBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Reopen and close via Escape Key
    fireEvent.click(viewContextBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('verifies the Phase 01 Add Incident Note Drawer triggers, validates input, allows local preview, can be cleared, and closed', () => {
    render(
      <AppProviders>
        <RouterProvider router={getTestRouter()} />
      </AppProviders>
    );

    // Verify note composer drawer is initially closed
    expect(screen.queryByRole('dialog', { name: /ADD INCIDENT NOTE/i })).not.toBeInTheDocument();

    // Find and click the ADD NOTE button in INCIDENT COMMAND CONTROLS
    const addNoteBtn = screen.getByRole('button', { name: 'ADD NOTE' });
    expect(addNoteBtn).toBeInTheDocument();
    
    // Verify LOCAL DRAFT PREVIEW badge exists next to it
    expect(screen.getByText('LOCAL DRAFT PREVIEW')).toBeInTheDocument();
    
    fireEvent.click(addNoteBtn);

    // Verify note drawer is open with correct ARIA attributes and title
    const drawer = screen.getByRole('dialog', { name: /ADD INCIDENT NOTE/i });
    expect(drawer).toBeInTheDocument();
    expect(within(drawer).getByText('ADD INCIDENT NOTE')).toBeInTheDocument();
    expect(within(drawer).getByText('OPERATIONAL NOTE / FRONTEND DRAFT')).toBeInTheDocument();

    // Verify metadata block
    expect(within(drawer).getAllByText('SF-2026-0042').length).toBeGreaterThan(0);
    expect(within(drawer).getByText('DRAFT NOT CREATED')).toBeInTheDocument();

    // Verify Section 01: Incident Context
    expect(within(drawer).getByText('01 / INCIDENT CONTEXT')).toBeInTheDocument();
    expect(within(drawer).getByText('PAYMENTS API')).toBeInTheDocument();
    expect(within(drawer).getByText('4 MOCK EVENTS / FRONTEND SEQUENCE')).toBeInTheDocument();

    // Verify Section 02: Operational Note and Textarea
    expect(within(drawer).getByText('02 / OPERATIONAL NOTE')).toBeInTheDocument();
    const textarea = within(drawer).getByLabelText(/NOTE CONTENT/i) as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe('');

    // Trigger blur on empty field to verify validation error
    fireEvent.blur(textarea);
    expect(within(drawer).getByText('NOTE CONTENT REQUIRED')).toBeInTheDocument();

    // Type some content and verify validation error is cleared and Draft State changes
    fireEvent.change(textarea, { target: { value: 'This is an operational test note.' } });
    expect(within(drawer).queryByText('NOTE CONTENT REQUIRED')).not.toBeInTheDocument();
    expect(within(drawer).getByText('LOCAL CONTENT ENTERED')).toBeInTheDocument();

    // Click PREVIEW NOTE to render local preview
    const previewBtn = within(drawer).getByRole('button', { name: 'PREVIEW NOTE' });
    fireEvent.click(previewBtn);

    // Note state should now update in the header metadata
    expect(within(drawer).getByText('LOCAL PREVIEW READY')).toBeInTheDocument();

    // Section 03: Local Note Preview should now render
    expect(within(drawer).getByText('03 / LOCAL NOTE PREVIEW')).toBeInTheDocument();
    expect(within(drawer).getAllByText('This is an operational test note.').length).toBeGreaterThanOrEqual(1);
    expect(within(drawer).getByText('LOCAL PREVIEW ONLY')).toBeInTheDocument();
    expect(within(drawer).getAllByText('CURRENT LOCAL DRAFT').length).toBeGreaterThanOrEqual(1);

    // Edit textarea to trigger "DRAFT CHANGED" preview state
    fireEvent.change(textarea, { target: { value: 'This is an operational test note. (Edited)' } });
    expect(within(drawer).getAllByText('DRAFT CHANGED').length).toBeGreaterThanOrEqual(1);

    // Re-preview note
    fireEvent.click(previewBtn);
    expect(within(drawer).getAllByText('CURRENT LOCAL DRAFT').length).toBeGreaterThanOrEqual(1);
    expect(within(drawer).getAllByText('This is an operational test note. (Edited)').length).toBeGreaterThanOrEqual(1);

    // Verify Section 04: Future Note Event and Note Authority Contract sections
    expect(within(drawer).getByText('FUTURE NOTE EVENT')).toBeInTheDocument();
    expect(within(drawer).getByText('NOTE AUTHORITY CONTRACT')).toBeInTheDocument();
    expect(within(drawer).getByText('A LOCAL DRAFT IS NOT AN INCIDENT RECORD.')).toBeInTheDocument();

    // Verify primary drawer action button remains disabled
    const addNoteRecordBtn = within(drawer).getByRole('button', { name: 'ADD NOTE TO INCIDENT' });
    expect(addNoteRecordBtn).toBeDisabled();
    expect(within(drawer).getByText('BACKEND AUTHORITY REQUIRED')).toBeInTheDocument();

    // Test CLEAR DRAFT clears state
    const clearBtn = within(drawer).getByRole('button', { name: 'CLEAR DRAFT' });
    fireEvent.click(clearBtn);

    expect(textarea.value).toBe('');
    expect(within(drawer).queryByText('03 / LOCAL NOTE PREVIEW')).not.toBeInTheDocument();
    expect(within(drawer).getByText('DRAFT NOT CREATED')).toBeInTheDocument();

    // Close the drawer via CLOSE COMPOSER
    const closeBtn = within(drawer).getByRole('button', { name: 'CLOSE COMPOSER' });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('verifies the Change Status Drawer Phase 02 workflow, accessibility, and constraints', () => {
    render(
      <AppProviders>
        <RouterProvider router={getTestRouter()} />
      </AppProviders>
    );

    // Verify incident command controls buttons states
    const addNoteBtn = screen.getByRole('button', { name: 'ADD NOTE' });
    const changeStatusBtn = screen.getByRole('button', { name: 'CHANGE STATUS' });
    const changeSeverityBtn = screen.getByRole('button', { name: 'CHANGE SEVERITY' });
    expect(addNoteBtn).toBeEnabled();
    expect(changeStatusBtn).toBeEnabled();
    expect(changeSeverityBtn).toBeEnabled();

    // Verify other authoritative controls are disabled
    const assignCommanderBtn = screen.getByRole('button', { name: 'ASSIGN COMMANDER' });
    const resolveIncidentBtn = screen.getByRole('button', { name: 'RESOLVE INCIDENT' });
    expect(assignCommanderBtn).toBeDisabled();
    expect(resolveIncidentBtn).toBeDisabled();

    // Verify support copy on the command controls panel
    expect(screen.getByText(/Authoritative incident controls remain disabled. Add Note, Change Status, and Change Severity are available as local, non-authoritative previews./i)).toBeInTheDocument();

    // Verify CHANGE STATUS opens the drawer
    fireEvent.click(changeStatusBtn);
    const drawer = screen.getByRole('dialog', { name: /CHANGE INCIDENT STATUS/i });
    expect(drawer).toBeInTheDocument();

    // Verify drawer metadata and titles
    expect(within(drawer).getByText('CHANGE INCIDENT STATUS')).toBeInTheDocument();
    expect(within(drawer).getByText('STATE TRANSITION / FRONTEND PREVIEW')).toBeInTheDocument();
    expect(within(drawer).getAllByText('SF-2026-0042').length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText('REPORTED').length).toBeGreaterThan(0);
    expect(within(drawer).getByText('NOT CREATED')).toBeInTheDocument();
    expect(within(drawer).getAllByText('NOT CONNECTED').length).toBeGreaterThan(0);

    // Verify Section 01: Current Incident State
    expect(within(drawer).getByText('01 / CURRENT INCIDENT STATE')).toBeInTheDocument();
    expect(within(drawer).getByText('PAYMENTS API')).toBeInTheDocument();
    expect(within(drawer).getByText('NOT CONFIRMED')).toBeInTheDocument();
    expect(within(drawer).getByText('UNASSIGNED')).toBeInTheDocument();
    expect(within(drawer).getAllByText('NOT VERIFIED').length).toBeGreaterThanOrEqual(1);
    expect(within(drawer).getByText('4 MOCK EVENTS / FRONTEND SEQUENCE')).toBeInTheDocument();

    // Verify Section 02: Target Status
    expect(within(drawer).getByText('02 / TARGET STATUS')).toBeInTheDocument();
    const selectControl = within(drawer).getByLabelText(/NEXT STATUS/i) as HTMLSelectElement;
    expect(selectControl).toBeInTheDocument();
    expect(selectControl.value).toBe('');

    // Verify selectable and non-selectable option existence
    const options = Array.from(selectControl.options).map(o => o.value);
    expect(options).toContain('TRIAGING');
    expect(options).toContain('INVESTIGATING');
    
    // CLOSED is visible but unavailable outside/inside the select
    expect(within(drawer).getByText('CLOSED')).toBeInTheDocument();
    expect(within(drawer).getByText('NOT AVAILABLE')).toBeInTheDocument();
    expect(within(drawer).getByText(/A CLOSED incident requires an already RESOLVED incident./i)).toBeInTheDocument();

    // Verify status transitions NOT selectable from REPORTED: IDENTIFIED, MONITORING, RESOLVED
    expect(options).not.toContain('IDENTIFIED');
    expect(options).not.toContain('MONITORING');
    expect(options).not.toContain('RESOLVED');

    // Select target is required: VALIDATE TRANSITION must be disabled if no status is selected
    const validateBtn = within(drawer).getByRole('button', { name: 'VALIDATE TRANSITION' });
    expect(validateBtn).toBeDisabled();
    expect(within(drawer).getByText('TARGET STATUS REQUIRED')).toBeInTheDocument();

    // Select TRIAGING and verify validation button becomes enabled
    fireEvent.change(selectControl, { target: { value: 'TRIAGING' } });
    expect(validateBtn).toBeEnabled();
    expect(within(drawer).queryByText('TARGET STATUS REQUIRED')).not.toBeInTheDocument();

    // Optional transition context textarea
    const textarea = within(drawer).getByLabelText(/TRANSITION CONTEXT/i) as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe('');
    fireEvent.change(textarea, { target: { value: '  This is a local transition review.  ' } });

    // Current Operator Context checks
    expect(within(drawer).getByText('CURRENT OPERATOR CONTEXT')).toBeInTheDocument();
    expect(within(drawer).getByText('CURRENT OPERATOR')).toBeInTheDocument();
    expect(within(drawer).getByText('FRONTEND PREVIEW')).toBeInTheDocument();
    expect(within(drawer).getByText('NOT DETERMINED')).toBeInTheDocument();

    // Click VALIDATE TRANSITION
    fireEvent.click(validateBtn);

    // Verify validation results
    expect(within(drawer).getByText('TRANSITION STRUCTURE VALID')).toBeInTheDocument();
    expect(within(drawer).getByText('AUTHORITY READINESS INCOMPLETE')).toBeInTheDocument();
    expect(within(drawer).getByText(/The selected state-machine path is structurally valid, but the real status change requires authenticated/i)).toBeInTheDocument();

    // Section 03 displays preview details
    expect(within(drawer).getByText('03 / LOCAL TRANSITION PREVIEW')).toBeInTheDocument();
    expect(within(drawer).getByText('LOCAL PREVIEW ONLY')).toBeInTheDocument();
    expect(within(drawer).getAllByText(/This is a local transition review/i).length).toBeGreaterThanOrEqual(1);
    expect(within(drawer).getByText('CURRENT OPERATOR / NOT VERIFIED')).toBeInTheDocument();
    expect(within(drawer).getAllByText('NOT GENERATED').length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText('NOT CREATED').length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText(/REQUIRED/i).length).toBeGreaterThan(0);

    // Future Status Event preview
    expect(within(drawer).getByText('FUTURE STATUS EVENT')).toBeInTheDocument();
    expect(within(drawer).getByText('STATUS_CHANGED')).toBeInTheDocument();
    expect(within(drawer).getByText('AUTHENTICATED INCIDENT MANAGER OR ADMIN')).toBeInTheDocument();

    // APPLY STATUS CHANGE remains disabled
    const applyBtn = within(drawer).getByRole('button', { name: 'APPLY STATUS CHANGE' });
    expect(applyBtn).toBeDisabled();
    expect(within(drawer).getAllByText('BACKEND AUTHORITY REQUIRED').length).toBeGreaterThan(0);

    // Editing selection after validation makes it stale
    fireEvent.change(selectControl, { target: { value: 'INVESTIGATING' } });
    expect(within(drawer).getAllByText('DRAFT CHANGED').length).toBeGreaterThan(0);
    expect(within(drawer).getByText('DRAFT CHANGED - RE-VALIDATION REQUIRED')).toBeInTheDocument();

    // Revalidate
    fireEvent.click(validateBtn);
    expect(within(drawer).getAllByText('CURRENT LOCAL DRAFT').length).toBeGreaterThan(0);

    // RESET PREVIEW clears everything
    const resetBtn = within(drawer).getByRole('button', { name: 'RESET PREVIEW' });
    fireEvent.click(resetBtn);
    expect(selectControl.value).toBe('');
    expect(textarea.value).toBe('');
    expect(within(drawer).queryByText('03 / LOCAL TRANSITION PREVIEW')).not.toBeInTheDocument();

    // Closing the drawer and reopen is empty
    const closeReviewBtn = within(drawer).getByRole('button', { name: 'CLOSE REVIEW' });
    fireEvent.click(closeReviewBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Reopen and check that it is empty
    fireEvent.click(changeStatusBtn);
    const reopenedDrawer = screen.getByRole('dialog', { name: /CHANGE INCIDENT STATUS/i });
    expect(reopenedDrawer).toBeInTheDocument();
    expect(within(reopenedDrawer).getByLabelText(/NEXT STATUS/i)).toHaveValue('');
    expect(within(reopenedDrawer).getByLabelText(/TRANSITION CONTEXT/i)).toHaveValue('');

    // Close using overlay click
    const overlay = document.querySelector('.bg-black\\/60');
    if (overlay) {
      fireEvent.click(overlay as HTMLElement);
    }
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Reopen and close via escape
    fireEvent.click(changeStatusBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Verify header status and timeline remains exactly unchanged
    expect(screen.getAllByText('REPORTED').length).toBeGreaterThan(0);
  });

  it('verifies the Change Severity Drawer Phase 03 workflow, accessibility, and constraints', () => {
    render(
      <AppProviders>
        <RouterProvider router={getTestRouter()} />
      </AppProviders>
    );

    // Verify incident command controls buttons states
    const addNoteBtn = screen.getByRole('button', { name: 'ADD NOTE' });
    const changeStatusBtn = screen.getByRole('button', { name: 'CHANGE STATUS' });
    const changeSeverityBtn = screen.getByRole('button', { name: 'CHANGE SEVERITY' });
    const assignCommanderBtn = screen.getByRole('button', { name: 'ASSIGN COMMANDER' });
    const resolveIncidentBtn = screen.getByRole('button', { name: 'RESOLVE INCIDENT' });

    expect(addNoteBtn).toBeEnabled();
    expect(changeStatusBtn).toBeEnabled();
    expect(changeSeverityBtn).toBeEnabled();
    expect(assignCommanderBtn).toBeDisabled();
    expect(resolveIncidentBtn).toBeDisabled();

    // Click CHANGE SEVERITY to open drawer
    fireEvent.click(changeSeverityBtn);

    const drawer = screen.getByRole('dialog', { name: /CONFIRM INCIDENT SEVERITY/i });
    expect(drawer).toBeInTheDocument();

    // Verify drawer metadata and titles
    expect(within(drawer).getByText('CONFIRM INCIDENT SEVERITY')).toBeInTheDocument();
    expect(within(drawer).getByText('HUMAN DECISION / FRONTEND PREVIEW')).toBeInTheDocument();
    expect(within(drawer).getAllByText('SF-2026-0042').length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText('NOT CONFIRMED').length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText('SEV1').length).toBeGreaterThan(0);
    expect(within(drawer).getByText('NOT CREATED')).toBeInTheDocument();
    expect(within(drawer).getAllByText('NOT CONNECTED').length).toBeGreaterThan(0);

    // Verify Section 01: Current Severity Context
    expect(within(drawer).getByText('01 / CURRENT SEVERITY CONTEXT')).toBeInTheDocument();
    expect(within(drawer).getByText('PAYMENTS API')).toBeInTheDocument();
    expect(within(drawer).getByText('DRAFT SUGGESTION')).toBeInTheDocument();
    expect(within(drawer).getByText('HUMAN CONFIRMATION REQUIRED')).toBeInTheDocument();
    expect(within(drawer).getAllByText('REPORTED').length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText('UNASSIGNED').length).toBeGreaterThan(0);
    expect(within(drawer).getByText(/DeepSeek has suggested SEV1/i)).toBeInTheDocument();

    // Verify Section 02: Select Severity Options
    expect(within(drawer).getByText('02 / SELECT SEVERITY')).toBeInTheDocument();
    expect(within(drawer).getByText('CONFIRMED SEVERITY DECISION')).toBeInTheDocument();
    
    // Check all options are rendered but none is selected by default
    const radioSev1 = document.getElementById('severity-radio-sev1') as HTMLInputElement;
    const radioSev2 = document.getElementById('severity-radio-sev2') as HTMLInputElement;
    const radioSev3 = document.getElementById('severity-radio-sev3') as HTMLInputElement;
    const radioSev4 = document.getElementById('severity-radio-sev4') as HTMLInputElement;

    expect(radioSev1).toBeInTheDocument();
    expect(radioSev2).toBeInTheDocument();
    expect(radioSev3).toBeInTheDocument();
    expect(radioSev4).toBeInTheDocument();

    expect(radioSev1.checked).toBe(false);
    expect(radioSev2.checked).toBe(false);
    expect(radioSev3.checked).toBe(false);
    expect(radioSev4.checked).toBe(false);

    // Verify Section 03: Decision Rationale
    expect(within(drawer).getByText('03 / DECISION RATIONALE')).toBeInTheDocument();
    const rationaleLabel = within(drawer).getByText('SEVERITY RATIONALE');
    expect(rationaleLabel).toBeInTheDocument();
    const rationaleTextarea = within(drawer).getByPlaceholderText(/Explain the observed impact and why the selected severity is appropriate./i) as HTMLTextAreaElement;
    expect(rationaleTextarea).toBeInTheDocument();
    expect(rationaleTextarea.value).toBe('');
    expect(within(drawer).getByText('EMPTY')).toBeInTheDocument();

    // Verify Section 04: AI Influence Declaration
    expect(within(drawer).getByText('04 / AI INFLUENCE')).toBeInTheDocument();
    const aiInfluenceCheckbox = document.getElementById('severity-checkbox-ai-influence') as HTMLInputElement;
    expect(aiInfluenceCheckbox).toBeInTheDocument();
    expect(aiInfluenceCheckbox.checked).toBe(false);
    expect(within(drawer).getAllByText('NO').length).toBeGreaterThan(0);

    // Verify operator context
    expect(within(drawer).getByText('CURRENT OPERATOR CONTEXT')).toBeInTheDocument();
    expect(within(drawer).getAllByText('FRONTEND PREVIEW').length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText('NOT DETERMINED').length).toBeGreaterThan(0);

    // Validation must fail initially because no severity selected and rationale is empty
    const validateBtn = within(drawer).getByRole('button', { name: 'VALIDATE SEVERITY DECISION' });
    expect(validateBtn).toBeDisabled();
    expect(within(drawer).getByText('SEVERITY SELECTION REQUIRED')).toBeInTheDocument();
    expect(within(drawer).getByText('SEVERITY RATIONALE REQUIRED')).toBeInTheDocument();

    // Select SEV1 but keep rationale empty
    fireEvent.click(radioSev1);
    expect(radioSev1.checked).toBe(true);
    expect(aiInfluenceCheckbox.checked).toBe(false); // AI influence must not be automatically checked
    expect(validateBtn).toBeDisabled();
    expect(within(drawer).queryByText('SEVERITY SELECTION REQUIRED')).not.toBeInTheDocument();
    expect(within(drawer).getByText('SEVERITY RATIONALE REQUIRED')).toBeInTheDocument();

    // Enter whitespace-only rationale, which should be rejected
    fireEvent.change(rationaleTextarea, { target: { value: '   ' } });
    expect(validateBtn).toBeDisabled();
    expect(within(drawer).getByText('SEVERITY RATIONALE REQUIRED')).toBeInTheDocument();

    // Enter valid rationale
    fireEvent.change(rationaleTextarea, { target: { value: 'Payments system completely offline.' } });
    expect(validateBtn).toBeEnabled();
    expect(within(drawer).queryByText('SEVERITY RATIONALE REQUIRED')).not.toBeInTheDocument();
    expect(within(drawer).getByText('LOCAL CONTENT ENTERED')).toBeInTheDocument();

    // Validate
    fireEvent.click(validateBtn);

    // Verify validation results
    expect(within(drawer).getByText('SEVERITY DECISION STRUCTURE VALID')).toBeInTheDocument();
    expect(within(drawer).getByText('AUTHORITY READINESS INCOMPLETE')).toBeInTheDocument();

    // Section 05: Preview Details
    expect(within(drawer).getByText('05 / LOCAL SEVERITY DECISION PREVIEW')).toBeInTheDocument();
    expect(within(drawer).getAllByText('CURRENT LOCAL DRAFT').length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText('Payments system completely offline.').length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText('NOT GENERATED').length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText('NOT CREATED').length).toBeGreaterThan(0);

    // Check APPLY is disabled
    const applyBtn = within(drawer).getByRole('button', { name: 'APPLY SEVERITY DECISION' });
    expect(applyBtn).toBeDisabled();
    expect(within(drawer).getAllByText('BACKEND AUTHORITY REQUIRED').length).toBeGreaterThan(0);

    // Check editing after validation makes preview stale
    fireEvent.click(radioSev2);
    expect(within(drawer).getAllByText('DRAFT CHANGED').length).toBeGreaterThan(0);
    expect(within(drawer).getByText('DRAFT CHANGED - RE-VALIDATION REQUIRED')).toBeInTheDocument();

    // Revalidate
    fireEvent.click(validateBtn);
    expect(within(drawer).getAllByText('CURRENT LOCAL DRAFT').length).toBeGreaterThan(0);

    // RESET DECISION clears everything
    const resetBtn = within(drawer).getByRole('button', { name: 'RESET DECISION' });
    fireEvent.click(resetBtn);
    expect(radioSev2.checked).toBe(false);
    expect(rationaleTextarea.value).toBe('');
    expect(aiInfluenceCheckbox.checked).toBe(false);
    expect(within(drawer).queryByText('05 / LOCAL SEVERITY DECISION PREVIEW')).not.toBeInTheDocument();

    // Close and reopen starts empty
    const closeReviewBtn = within(drawer).getByRole('button', { name: 'CLOSE REVIEW' });
    fireEvent.click(closeReviewBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Reopen and check empty
    fireEvent.click(changeSeverityBtn);
    const reopenedDrawer = screen.getByRole('dialog', { name: /CONFIRM INCIDENT SEVERITY/i });
    expect(reopenedDrawer).toBeInTheDocument();
    expect((document.getElementById('severity-radio-sev1') as HTMLInputElement).checked).toBe(false);
    expect(within(reopenedDrawer).getByPlaceholderText(/Explain the observed impact and why the selected severity is appropriate./i)).toHaveValue('');

    // Close using overlay click
    const overlay = document.querySelector('.bg-black\\/60');
    if (overlay) {
      fireEvent.click(overlay as HTMLElement);
    }
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Reopen and close via escape
    fireEvent.click(changeSeverityBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Verify incident metadata remains completely unchanged
    expect(screen.getAllByText('NOT CONFIRMED').length).toBeGreaterThan(0);
  });
});

