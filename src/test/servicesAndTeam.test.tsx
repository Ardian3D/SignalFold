import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { AppShell } from '@/layouts/AppShell';
import { ServicesPage } from '@/pages/ServicesPage';
import { TeamPage } from '@/pages/TeamPage';
import { FeedbackStateProvider } from '@/context/FeedbackStateContext';

describe('Services and Team Foundation Read-Only Pages & Routing', () => {
  it('verifies SERVICES and TEAM are rendered as enabled preview links in the AppShell', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app']}>
          <AppShell>
            <div>Dashboard Main Content</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    // Verify links are rendered
    const servicesLink = screen.getAllByRole('link').find((link) => link.textContent?.includes('SERVICES'));
    const teamLink = screen.getAllByRole('link').find((link) => link.textContent?.includes('TEAM'));

    expect(servicesLink).toBeInTheDocument();
    expect(teamLink).toBeInTheDocument();

    expect(servicesLink?.getAttribute('href')).toBe('/app/services');
    expect(teamLink?.getAttribute('href')).toBe('/app/team');

    // Verify they display the PREVIEW state badge
    expect(servicesLink?.textContent).toContain('PREVIEW');
    expect(teamLink?.textContent).toContain('PREVIEW');
  });

  it('renders /app/services read-only catalog with four canonical services and summary panels', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/services']}>
          <Routes>
            <Route 
              path="/app/services" 
              element={
                <AppShell>
                  <ServicesPage />
                </AppShell>
              } 
            />
          </Routes>
        </MemoryRouter>
      </AppProviders>
    );

    // Breadcrumbs
    expect(screen.getAllByText('SERVICES')[0]).toBeInTheDocument();
    expect(screen.getAllByText('SERVICE CATALOG')[0]).toBeInTheDocument();

    // 4 canonical services
    expect(screen.getByText('CHECKOUT WEB')).toBeInTheDocument();
    expect(screen.getByText('PAYMENTS API')).toBeInTheDocument();
    expect(screen.getByText('ORDER PROCESSOR')).toBeInTheDocument();
    expect(screen.getByText('CUSTOMER PORTAL')).toBeInTheDocument();

    // Specific subsection on the payments API
    expect(screen.getByText('AVAILABLE FRONTEND INCIDENT REFERENCE')).toBeInTheDocument();
    expect(screen.getByText('SF-2026-0042')).toBeInTheDocument();
    expect(screen.getByText('CANONICAL DEMO INCIDENT')).toBeInTheDocument();
    expect(screen.getByText('OPEN RELATED INCIDENT')).toBeInTheDocument();

    // Summary panel on the right rail
    expect(screen.getByText('SERVICE CATALOG SUMMARY')).toBeInTheDocument();
    expect(screen.getByText('SERVICE CATALOG SUMMARY').nextElementSibling?.textContent).toContain('NORTHSTAR COMMERCE');
    expect(screen.getByText('SERVICE CATALOG SUMMARY').nextElementSibling?.textContent).toContain('CANONICAL FRONTEND SEED');

    // Management Console Readiness
    expect(screen.getByText('SERVICE MANAGEMENT READINESS')).toBeInTheDocument();
    expect(screen.getByText('ADMIN AUTHORITY AND BACKEND RECORDS REQUIRED')).toBeInTheDocument();
  });

  it('renders /app/team read-only directory complying with the canonical specifications without invented members', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/team']}>
          <Routes>
            <Route 
              path="/app/team" 
              element={
                <AppShell>
                  <TeamPage />
                </AppShell>
              } 
            />
          </Routes>
        </MemoryRouter>
      </AppProviders>
    );

    // Breadcrumbs
    expect(screen.getAllByText('TEAM')[0]).toBeInTheDocument();
    expect(screen.getAllByText('TEAM & MEMBERSHIP')[0]).toBeInTheDocument();

    // Verify NO invented members are rendered
    expect(screen.queryByText('SARA CHEN')).not.toBeInTheDocument();
    expect(screen.queryByText('ALEX RIVERA')).not.toBeInTheDocument();
    expect(screen.queryByText('JAMAL WASHINGTON')).not.toBeInTheDocument();
    expect(screen.queryByText('ELENA ROSTOVA')).not.toBeInTheDocument();

    // Verify NO Cognito references, fake user pools or Cognito identity IDs are mentioned
    expect(screen.queryByText(/COGNITO/i)).not.toBeInTheDocument();

    // No emails, avatars, IDs, or fake job titles are rendered
    expect(screen.queryByText('LEAD SITE RELIABILITY ENGINEER')).not.toBeInTheDocument();
    expect(screen.queryByText('PRINCIPAL INFRASTRUCTURE ENGINEER')).not.toBeInTheDocument();
    expect(screen.queryByText('SENIOR SOFTWARE ENGINEER (PAYMENTS)')).not.toBeInTheDocument();
    expect(screen.queryByText('SITE RELIABILITY ENGINEER')).not.toBeInTheDocument();

    // Member Directory is NOT LOADED
    expect(screen.getAllByText('MEMBER DIRECTORY')[0]).toBeInTheDocument();
    expect(screen.getByText('MEMBERSHIP DATA NOT LOADED')).toBeInTheDocument();
    expect(screen.getByText('SIGNALFOLD DOES NOT INVENT ORGANIZATION MEMBERS.')).toBeInTheDocument();

    // Active Members is NOT AVAILABLE
    expect(screen.getAllByText('ACTIVE MEMBERS')[0]).toBeInTheDocument();
    expect(screen.getAllByText('NOT AVAILABLE')[0]).toBeInTheDocument();

    // Presence is REALTIME NOT CONNECTED
    expect(screen.getAllByText('REALTIME NOT CONNECTED')[0]).toBeInTheDocument();

    // Current Operator Context
    expect(screen.getByText('CURRENT OPERATOR CONTEXT')).toBeInTheDocument();
    expect(screen.getByText('CURRENT OPERATOR')).toBeInTheDocument();
    expect(screen.getByText('ORGANIZATION MEMBERSHIP').nextElementSibling?.textContent).toBe('NOT VERIFIED');
    expect(screen.getAllByText('NOT LOADED').some(el => el.textContent === 'NOT LOADED')).toBe(true);

    // Exactly four role references render
    expect(screen.getByText('ORGANIZATION ROLE REFERENCE')).toBeInTheDocument();
    expect(screen.getByText('01 / REPORTER')).toBeInTheDocument();
    expect(screen.getByText('02 / RESPONDER')).toBeInTheDocument();
    expect(screen.getByText('03 / INCIDENT MANAGER')).toBeInTheDocument();
    expect(screen.getByText('04 / ORGANIZATION ADMIN')).toBeInTheDocument();

    // Roles are labelled as references, not assignments
    expect(screen.getByText('SCHEMA AND AUTHORITY REFERENCE ONLY')).toBeInTheDocument();

    // No commander candidate appears, no ASSIGN COMMANDER IN ROOM on Team page
    expect(screen.queryByText('AVAILABLE FRONTEND COMMANDER ASSIGNMENT')).not.toBeInTheDocument();
    expect(screen.queryByText('ASSIGN COMMANDER IN ROOM')).not.toBeInTheDocument();

    // Management actions remain disabled
    expect(screen.getByText('TEAM MANAGEMENT READINESS')).toBeInTheDocument();
    const inviteButton = screen.getByRole('button', { name: /INVITE MEMBER/i });
    const changeRoleButton = screen.getByRole('button', { name: /CHANGE MEMBER ROLE/i });
    const deactivateButton = screen.getByRole('button', { name: /DEACTIVATE MEMBER/i });
    expect(inviteButton).toBeDisabled();
    expect(changeRoleButton).toBeDisabled();
    expect(deactivateButton).toBeDisabled();
    expect(screen.getByText('ORGANIZATION ADMIN AUTHORITY REQUIRED')).toBeInTheDocument();

    // Membership Directory Contract renders
    expect(screen.getByText('MEMBERSHIP DIRECTORY CONTRACT')).toBeInTheDocument();
    expect(screen.getByText('FRONTEND VISIBILITY DOES NOT GRANT ORGANIZATION AUTHORITY.')).toBeInTheDocument();

    // Responsive class check for 360px viewport
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 360 });
    window.dispatchEvent(new Event('resize'));

    const rootContainer = screen.getByText('MEMBERSHIP DATA NOT LOADED').closest('.max-w-7xl');
    expect(rootContainer).toBeInTheDocument();
    // Verify responsive styling doesn't lock to wide layouts
    expect(rootContainer).not.toHaveClass('w-[1200px]');

    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalWidth });
  });

  it('integrates Services page with global feedback system under loading state', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/services?previewUiState=loading&previewUiScope=services']}>
          <FeedbackStateProvider>
            <Routes>
              <Route path="/app/services" element={<ServicesPage />} />
            </Routes>
          </FeedbackStateProvider>
        </MemoryRouter>
      </AppProviders>
    );
    expect(screen.getByText('LOADING WORKSPACE DATA')).toBeInTheDocument();
  });

  it('integrates Services page with global feedback system under empty state', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/services?previewUiState=empty&previewUiScope=services']}>
          <FeedbackStateProvider>
            <Routes>
              <Route path="/app/services" element={<ServicesPage />} />
            </Routes>
          </FeedbackStateProvider>
        </MemoryRouter>
      </AppProviders>
    );
    expect(screen.getByText('NO INCIDENT RECORDS')).toBeInTheDocument();
  });

  it('integrates Services page with global feedback system under unexpected_error state', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/services?previewUiState=unexpected-error&previewUiScope=services']}>
          <FeedbackStateProvider>
            <Routes>
              <Route path="/app/services" element={<ServicesPage />} />
            </Routes>
          </FeedbackStateProvider>
        </MemoryRouter>
      </AppProviders>
    );
    expect(screen.getByText('SIGNALFOLD COULD NOT RENDER THIS WORKSPACE')).toBeInTheDocument();
  });

  it('integrates Team page with global feedback system under loading state', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/team?previewUiState=loading&previewUiScope=team']}>
          <FeedbackStateProvider>
            <Routes>
              <Route path="/app/team" element={<TeamPage />} />
            </Routes>
          </FeedbackStateProvider>
        </MemoryRouter>
      </AppProviders>
    );
    expect(screen.getByText('LOADING WORKSPACE DATA')).toBeInTheDocument();
  });

  it('integrates Team page with global feedback system under empty state', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/team?previewUiState=empty&previewUiScope=team']}>
          <FeedbackStateProvider>
            <Routes>
              <Route path="/app/team" element={<TeamPage />} />
            </Routes>
          </FeedbackStateProvider>
        </MemoryRouter>
      </AppProviders>
    );
    expect(screen.getByText('NO INCIDENT RECORDS')).toBeInTheDocument();
  });

  it('integrates Team page with global feedback system under unexpected_error state', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/team?previewUiState=unexpected-error&previewUiScope=team']}>
          <FeedbackStateProvider>
            <Routes>
              <Route path="/app/team" element={<TeamPage />} />
            </Routes>
          </FeedbackStateProvider>
        </MemoryRouter>
      </AppProviders>
    );
    expect(screen.getByText('SIGNALFOLD COULD NOT RENDER THIS WORKSPACE')).toBeInTheDocument();
  });
});
