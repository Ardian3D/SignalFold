import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { RootLayout } from '@/components/layout/RootLayout';
import { AppShell } from '@/layouts/AppShell';
import { IncidentsPage } from '@/pages/IncidentsPage';
import { ResolvedIncidentPage } from '@/pages/ResolvedIncidentPage';
import { PostmortemFoundationPage } from '@/pages/PostmortemFoundationPage';
import { IncidentRoomPage } from '@/pages/IncidentRoomPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Simple test router configuration covering all the routes
const getTestRouter = (initialPath: string) => {
  return createMemoryRouter(
    [
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
        path: '/app/incidents/resolved-seed',
        element: (
          <RootLayout>
            <AppShell>
              <ResolvedIncidentPage />
            </AppShell>
          </RootLayout>
        ),
      },
      {
        path: '/app/incidents/resolved-seed/postmortem',
        element: (
          <RootLayout>
            <AppShell>
              <PostmortemFoundationPage />
            </AppShell>
          </RootLayout>
        ),
      },
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

describe('Resolved Incident Seed & Postmortem Foundation Phase 01 Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Incident List Integration', () => {
    it('verifies resolved seed record details in lists are correct and row action is enabled', () => {
      const router = getTestRouter('/app/incidents');
      render(
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      );

      // Verify row with title RESOLVED INCIDENT SEED RECORD exists
      const seedTitle = screen.getByText('RESOLVED INCIDENT SEED RECORD');
      expect(seedTitle).toBeInTheDocument();

      // Resolved seed record remains RESOLVED and Postmortem remains APPROVED
      const resolvedBadges = screen.getAllByText('RESOLVED');
      expect(resolvedBadges.length).toBeGreaterThan(0);

      const approvedBadges = screen.getAllByText('APPROVED');
      expect(approvedBadges.length).toBeGreaterThan(0);

      // OPEN RESOLVED RECORD action is enabled (since it is a Link, it should be in document)
      const openSeedBtn = screen.getAllByText('OPEN RESOLVED RECORD').find(
        (el) => el.tagName === 'A'
      );
      expect(openSeedBtn).toBeInTheDocument();
      expect(openSeedBtn).toHaveAttribute('href', '/app/incidents/resolved-seed');

      // Active SEV2 seed route remains unavailable (ROUTE NOT AVAILABLE)
      const disabledBtns = screen.getAllByRole('button').filter(
        (el) => el.textContent === 'ROUTE NOT AVAILABLE'
      );
      expect(disabledBtns.length).toBeGreaterThan(0);
      disabledBtns.forEach((btn) => {
        expect(btn).toBeDisabled();
      });

      // No resolved incident code, service, severity, commander, or timestamp is invented
      expect(screen.queryByText('SF-2026-0043')).not.toBeInTheDocument();
    });
  });

  describe('Resolved Incident Record Route', () => {
    it('/app/incidents/resolved-seed renders with limited canonical seed data', () => {
      const router = getTestRouter('/app/incidents/resolved-seed');
      render(
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      );

      // Main header and labels
      expect(screen.getByText('RESOLVED INCIDENT RECORD')).toBeInTheDocument();
      expect(screen.getByText('LIMITED CANONICAL SEED DATA / FRONTEND PREVIEW')).toBeInTheDocument();

      // Route key is explicitly not an official incident code
      expect(screen.getAllByText('resolved-seed').length).toBeGreaterThan(0);
      expect(screen.getByText('This route key identifies the frontend demo record. It is not an official SignalFold incident code.')).toBeInTheDocument();

      // Status is RESOLVED and Postmortem is APPROVED
      const resolvedBadges = screen.getAllByText('RESOLVED');
      expect(resolvedBadges.length).toBeGreaterThan(0);

      const approvedBadges = screen.getAllByText('APPROVED');
      expect(approvedBadges.length).toBeGreaterThan(0);

      // Register view verification
      const incidentCodeDt = screen.getByText('INCIDENT CODE');
      expect(incidentCodeDt).toBeInTheDocument();
      const notSpecifiedElements = screen.getAllByText('NOT SPECIFIED');
      expect(notSpecifiedElements.length).toBeGreaterThan(0);

      const titleDt = screen.getByText('TITLE');
      expect(titleDt).toBeInTheDocument();

      const descDt = screen.getByText('DESCRIPTION');
      expect(descDt).toBeInTheDocument();
      const notAvailableElements = screen.getAllByText('NOT AVAILABLE');
      expect(notAvailableElements.length).toBeGreaterThan(0);

      // No fake Timeline, tasks, responders, or controls render
      expect(screen.queryByText('AI TRIAGE REVIEW')).not.toBeInTheDocument();
      expect(screen.queryByText('RESPONSE TASKS')).not.toBeInTheDocument();
      expect(screen.queryByText('INCIDENT METADATA')).not.toBeInTheDocument();
      expect(screen.queryByText('INCIDENT TIMELINE LEDGER')).not.toBeInTheDocument();
    });

    it('navigates to approved postmortem foundation on OPEN POSTMORTEM action click', () => {
      const router = getTestRouter('/app/incidents/resolved-seed');
      render(
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      );

      const openPostmortemBtns = screen.getAllByRole('button').filter(
        (el) => el.textContent === 'OPEN POSTMORTEM'
      );
      expect(openPostmortemBtns.length).toBeGreaterThan(0);

      // Clicking OPEN POSTMORTEM navigates correctly
      fireEvent.click(openPostmortemBtns[0]);
      expect(screen.getByText('APPROVED RECORD ACCESS / CONTENT FOUNDATION')).toBeInTheDocument();
    });
  });

  describe('Postmortem Phase 01 Workspace Route', () => {
    
    it('/app/incidents/resolved-seed/postmortem renders with correct header and metadata elements', () => {
      const router = getTestRouter('/app/incidents/resolved-seed/postmortem');
      render(
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      );

      // Page Title & Header
      expect(screen.getByRole('heading', { name: 'POSTMORTEM', level: 2 })).toBeInTheDocument();
      expect(screen.getByText('APPROVED RECORD ACCESS / CONTENT FOUNDATION')).toBeInTheDocument();

      // Approved Status Indicators
      const approvedBadges = screen.getAllByText('APPROVED');
      expect(approvedBadges.length).toBeGreaterThan(0);

      // Record summary details are kept
      expect(screen.getByText('POSTMORTEM RECORD SUMMARY')).toBeInTheDocument();
      expect(screen.getByText('APPROVAL SOURCE')).toBeInTheDocument();
      expect(screen.getByText('APPROVER')).toBeInTheDocument();
      expect(screen.getByText('APPROVED AT')).toBeInTheDocument();
      expect(screen.getByText('VERSION')).toBeInTheDocument();

      // Content remains NOT LOADED
      const notLoadedElements = screen.getAllByText('NOT LOADED');
      expect(notLoadedElements.length).toBeGreaterThan(0);
    });

    it('displays compact section index containing all 11 sections', () => {
      const router = getTestRouter('/app/incidents/resolved-seed/postmortem');
      render(
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      );

      const canonicalSections = [
        "01 / EXECUTIVE SUMMARY",
        "02 / CUSTOMER & BUSINESS IMPACT",
        "03 / DETECTION",
        "04 / TIMELINE",
        "05 / ROOT CAUSE",
        "06 / CONTRIBUTING FACTORS",
        "07 / RESOLUTION",
        "08 / WHAT WENT WELL",
        "09 / WHAT WENT POORLY",
        "10 / PREVENTIVE ACTIONS",
        "11 / OWNERS & DUE DATES"
      ];

      // Verifies all 11 exist exactly once in the navigation list, queried by unique IDs to avoid dropdown duplication
      canonicalSections.forEach((sectionName, i) => {
        const btn = document.getElementById(`section-btn-${i}`);
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveTextContent(sectionName);
      });
    });

    it('sets first section (01 / EXECUTIVE SUMMARY) active by default', () => {
      const router = getTestRouter('/app/incidents/resolved-seed/postmortem');
      render(
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      );

      // Selected element should have aria-current="true"
      const firstSectionBtn = document.getElementById('section-btn-0');
      expect(firstSectionBtn).toHaveAttribute('aria-current', 'true');

      // The inspection position shows "01 OF 11"
      expect(screen.getAllByText('01 OF 11').length).toBeGreaterThan(0);

      // Section Purpose schema reference shows Executive Summary context
      expect(screen.getByText('Concise overview of the incident, impact, response, and outcome.')).toBeInTheDocument();
    });

    it('renders exact empty/unavailable attributes inside Active Section Inspection panel', () => {
      const router = getTestRouter('/app/incidents/resolved-seed/postmortem');
      render(
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      );

      // Technical detail headers in inspection panel
      expect(screen.getByText('SECTION NUMBER')).toBeInTheDocument();
      expect(screen.getByText('INSPECTION MODE')).toBeInTheDocument();
      expect(screen.getByText('SOURCE RECORD')).toBeInTheDocument();
      expect(screen.getByText('AUTHORITATIVE CONTENT')).toBeInTheDocument();

      // Inspect core content body states (no lore ipsum, fake text, or writing guides exist)
      expect(screen.getByText('NO AUTHORITATIVE SECTION CONTENT LOADED')).toBeInTheDocument();
      expect(screen.getByText('The approved seed confirms this Postmortem section exists, but its authoritative document content has not been provided.')).toBeInTheDocument();
      expect(screen.getByText('SIGNALFOLD DOES NOT GENERATE PLACEHOLDER INCIDENT HISTORY.')).toBeInTheDocument();

      // Verify no payments-specific prose or custom incident codes exist
      expect(screen.queryByText('Checkout payments failing')).not.toBeInTheDocument();
      expect(screen.queryByText('Payments API')).not.toBeInTheDocument();
    });

    it('navigates section by section using next and previous buttons', () => {
      const router = getTestRouter('/app/incidents/resolved-seed/postmortem');
      render(
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      );

      const prevBtn = screen.getByRole('button', { name: 'PREVIOUS SECTION' });
      const nextBtn = screen.getByRole('button', { name: 'NEXT SECTION' });

      // Section 1: Previous is disabled
      expect(prevBtn).toBeDisabled();
      expect(nextBtn).toBeEnabled();

      // Click Next -> moves to Section 2
      fireEvent.click(nextBtn);
      expect(screen.getAllByText('02 OF 11').length).toBeGreaterThan(0);
      expect(document.getElementById('section-btn-1')).toHaveAttribute('aria-current', 'true');
      expect(prevBtn).toBeEnabled();

      // Click Previous -> moves back to Section 1
      fireEvent.click(prevBtn);
      expect(screen.getAllByText('01 OF 11').length).toBeGreaterThan(0);
      expect(prevBtn).toBeDisabled();
    });

    it('disables Next on Section 11', () => {
      const router = getTestRouter('/app/incidents/resolved-seed/postmortem');
      render(
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      );

      const endSectionBtn = document.getElementById('section-btn-10') as HTMLElement;
      fireEvent.click(endSectionBtn);

      expect(screen.getAllByText('11 OF 11').length).toBeGreaterThan(0);
      expect(screen.getByRole('button', { name: 'NEXT SECTION' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'PREVIOUS SECTION' })).toBeEnabled();
    });

    it('navigates through desktop index with arrow keys, Home, and End', () => {
      const router = getTestRouter('/app/incidents/resolved-seed/postmortem');
      render(
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      );

      const firstBtn = document.getElementById('section-btn-0') as HTMLElement;

      // Arrow Down from Section 1 -> focuses & activates Section 2
      fireEvent.keyDown(firstBtn, { key: 'ArrowDown' });
      expect(screen.getAllByText('02 OF 11').length).toBeGreaterThan(0);

      const secondBtn = document.getElementById('section-btn-1') as HTMLElement;
      
      // End key -> jumps to Section 11
      fireEvent.keyDown(secondBtn, { key: 'End' });
      expect(screen.getAllByText('11 OF 11').length).toBeGreaterThan(0);

      const eleventhBtn = document.getElementById('section-btn-10') as HTMLElement;

      // Home key -> jumps back to Section 1
      fireEvent.keyDown(eleventhBtn, { key: 'Home' });
      expect(screen.getAllByText('01 OF 11').length).toBeGreaterThan(0);
    });

    it('verifies the refactored section-navigation footer layout and constraints', () => {
      const router = getTestRouter('/app/incidents/resolved-seed/postmortem');
      render(
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      );

      // Section Position renders with leading-zero format and above the navigation buttons
      const posLabel = screen.getByText('SECTION POSITION');
      const posVal = screen.getAllByText('01 OF 11')[0];
      expect(posLabel).toBeInTheDocument();
      expect(posVal).toBeInTheDocument();

      // Position text does not render inside either button
      const prevBtn = screen.getByRole('button', { name: 'PREVIOUS SECTION' });
      const nextBtn = screen.getByRole('button', { name: 'NEXT SECTION' });
      expect(prevBtn).toHaveTextContent('PREVIOUS SECTION');
      expect(nextBtn).toHaveTextContent('NEXT SECTION');
      expect(prevBtn).not.toHaveTextContent('01 OF 11');
      expect(nextBtn).not.toHaveTextContent('01 OF 11');

      // Previous and Next remain separate controls
      expect(prevBtn).not.toBe(nextBtn);

      // Previous is disabled on section 01
      expect(prevBtn).toBeDisabled();
      expect(nextBtn).toBeEnabled();

      // Mobile stacks both navigation buttons (grid configuration checks)
      const buttonsContainer = prevBtn.parentElement;
      expect(buttonsContainer).toHaveClass('grid');
      expect(buttonsContainer).toHaveClass('grid-cols-1');
      expect(buttonsContainer).toHaveClass('min-[520px]:grid-cols-2');

      // Click next -> displays 02 OF 11
      fireEvent.click(nextBtn);
      expect(screen.getAllByText('02 OF 11').length).toBeGreaterThan(0);

      // Next is disabled on section 11
      const endSectionBtn = document.getElementById('section-btn-10') as HTMLElement;
      fireEvent.click(endSectionBtn);
      expect(screen.getAllByText('11 OF 11').length).toBeGreaterThan(0);
      expect(screen.getByRole('button', { name: 'NEXT SECTION' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'PREVIOUS SECTION' })).toBeEnabled();
    });

    it('opens and closes metadata drawer cleanly and accessibly', () => {
      const router = getTestRouter('/app/incidents/resolved-seed/postmortem');
      render(
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      );

      const viewMetaBtn = screen.getByRole('button', { name: 'VIEW DOCUMENT METADATA' });
      expect(viewMetaBtn).toBeInTheDocument();

      // Click opens drawer
      fireEvent.click(viewMetaBtn);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'POSTMORTEM METADATA' })).toBeInTheDocument();

      // Ensure all specific metadata attributes are printed inside the dialog/drawer container
      expect(dialog).toHaveTextContent('INCIDENT RECORD');
      expect(dialog).toHaveTextContent('RESOLVED SEED RECORD');
      expect(dialog).toHaveTextContent('PERSISTENCE');
      expect(dialog).toHaveTextContent('NOT CONNECTED');
      expect(dialog).toHaveTextContent('AUTHORITY');
      expect(dialog).toHaveTextContent('NOT VERIFIED');

      // Escape close works
      fireEvent.keyDown(dialog, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Click close works
      fireEvent.click(viewMetaBtn);
      const closeBtn = screen.getByRole('button', { name: 'CLOSE METADATA' });
      fireEvent.click(closeBtn);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('editor readiness and contract controls remain strictly disabled', () => {
      const router = getTestRouter('/app/incidents/resolved-seed/postmortem');
      render(
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      );

      expect(screen.getByText('EDITOR READINESS')).toBeInTheDocument();
      expect(screen.getByText('BACKEND RECORD AND AUTHORITY REQUIRED')).toBeInTheDocument();

      const editBtn = screen.getByRole('button', { name: 'EDIT POSTMORTEM' });
      expect(editBtn).toBeDisabled();

      const regenBtn = screen.getByRole('button', { name: 'REGENERATE DRAFT' });
      expect(regenBtn).toBeDisabled();

      const approveBtn = screen.getByRole('button', { name: 'APPROVE POSTMORTEM' });
      expect(approveBtn).toBeDisabled();

      const publishBtn = screen.getByRole('button', { name: 'PUBLISH POSTMORTEM' });
      expect(publishBtn).toBeDisabled();
    });

    it('BACK TO RESOLVED RECORD navigation link is functional', () => {
      const router = getTestRouter('/app/incidents/resolved-seed/postmortem');
      render(
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      );

      const backLink = screen.getByRole('link', { name: 'BACK TO RESOLVED RECORD' });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/app/incidents/resolved-seed');
    });
  });

  describe('Incidental Checks', () => {
    it('verifies existing active Incident Room remains unchanged', () => {
      const router = getTestRouter('/app/incidents/SF-2026-0042');
      render(
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      );

      expect(screen.getByText('Checkout payments failing after latest deployment')).toBeInTheDocument();
      expect(screen.getAllByText('SF-2026-0042').length).toBeGreaterThan(0);
    });

    it('verifies unknown paths still use existing Not Found behavior', () => {
      const router = getTestRouter('/app/incidents/unknown-unspecified-path');
      render(
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      );

      expect(screen.getByText('404 / SIGNAL LOST')).toBeInTheDocument();
    });
  });
});
