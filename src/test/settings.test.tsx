import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { AppShell } from '@/layouts/AppShell';
import { SettingsPage } from '@/pages/SettingsPage';
import { FeedbackStateProvider } from '@/context/FeedbackStateContext';

describe('Settings Foundation Read-Only Page & Routing', () => {
  it('verifies SETTINGS is rendered as an enabled preview link in the AppShell', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app']}>
          <AppShell>
            <div>Dashboard Main Content</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    // Verify settings link is rendered
    const settingsLink = screen.getAllByRole('link').find((link) => link.textContent?.includes('SETTINGS'));
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink?.getAttribute('href')).toBe('/app/settings');

    // Verify it displays the PREVIEW state badge when inactive
    expect(settingsLink?.textContent).toContain('PREVIEW');
  });

  it('renders /app/settings read-only view with correct breadcrumbs, titles, status cards and sections', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/settings']}>
          <Routes>
            <Route 
              path="/app/settings" 
              element={
                <AppShell>
                  <SettingsPage />
                </AppShell>
              } 
            />
          </Routes>
        </MemoryRouter>
      </AppProviders>
    );

    // Breadcrumbs and headers
    expect(screen.getAllByText('SETTINGS')[0]).toBeInTheDocument();
    expect(screen.getByText('NORTHSTAR COMMERCE / SETTINGS')).toBeInTheDocument();
    expect(screen.getByText('WORKSPACE SETTINGS')).toBeInTheDocument();
    expect(screen.getByText('USER & ORGANIZATION CONFIGURATION / FRONTEND PREVIEW')).toBeInTheDocument();
    expect(screen.getByText(/Review the user-preference and organization-setting fields/i)).toBeInTheDocument();

    // Header Status Panel
    expect(screen.getAllByText('SETTINGS MODE')[0]).toBeInTheDocument();
    expect(screen.getAllByText('READ-ONLY PREVIEW')[0]).toBeInTheDocument();
    expect(screen.getAllByText('NOT CONNECTED')[0]).toBeInTheDocument();
    expect(screen.getAllByText('NOT LOADED')[0]).toBeInTheDocument();
    expect(screen.getAllByText('PERSISTENCE')[0]).toBeInTheDocument();
    expect(screen.getByText('BACKEND REQUIRED')).toBeInTheDocument();

    // Section 01: Application Mode
    expect(screen.getByText('01 / APPLICATION MODE')).toBeInTheDocument();
    expect(screen.getAllByText('APPLICATION')[0]).toBeInTheDocument();
    expect(screen.getAllByText('SIGNALFOLD')[0]).toBeInTheDocument();
    expect(screen.getAllByText('FRONTEND MODE')[0]).toBeInTheDocument();
    expect(screen.getAllByText('MOCK')[0]).toBeInTheDocument();
    expect(screen.getAllByText('WORKSPACE SOURCE')[0]).toBeInTheDocument();
    expect(screen.getAllByText('BACKEND PLATFORM')[0]).toBeInTheDocument();
    expect(screen.getAllByText('AI PROVIDER')[0]).toBeInTheDocument();
    expect(screen.getAllByText('ENVIRONMENT SECRET STATUS')[0]).toBeInTheDocument();
    expect(screen.getByText('NO SECRETS EXPOSED')).toBeInTheDocument();
    expect(screen.getByText('FRONTEND MOCK MODE MUST NOT BE PRESENTED AS BACKEND AUTHORITY.')).toBeInTheDocument();

    // Section 02: User Preferences
    expect(screen.getByText('02 / USER PREFERENCES')).toBeInTheDocument();
    expect(screen.getAllByText('IDENTITY')[0]).toBeInTheDocument();
    expect(screen.getAllByText('CURRENT OPERATOR')[0]).toBeInTheDocument();
    expect(screen.getAllByText('DISPLAY NAME')[0]).toBeInTheDocument();
    expect(screen.getAllByText('NOT LOADED').some(el => el.textContent === 'NOT LOADED')).toBe(true);
    expect(screen.getAllByText('TIMEZONE')[0]).toBeInTheDocument();
    expect(screen.getAllByText('DEFAULT ORGANIZATION')[0]).toBeInTheDocument();
    expect(screen.getAllByText('NOT VERIFIED')[0]).toBeInTheDocument();
    expect(screen.getAllByText('CURRENT FRONTEND APPEARANCE')[0]).toBeInTheDocument();
    
    // Theme options and preference storage copy
    expect(screen.getByText('USER PREFERENCE STORAGE REQUIRED')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'LIGHT' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'DARK' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'SYSTEM' })).toBeDisabled();

    // Section 03: Organization Settings
    expect(screen.getByText('03 / ORGANIZATION SETTINGS')).toBeInTheDocument();
    expect(screen.getAllByText('ORGANIZATION NAME')[0]).toBeInTheDocument();
    expect(screen.getAllByText('ORGANIZATION RECORD')[0]).toBeInTheDocument();
    expect(screen.getByText('ORGANIZATION ADMIN AUTHORITY REQUIRED')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'EDIT ORGANIZATION SETTINGS' })).toBeDisabled();

    // Section 04: Incident Configuration Reference
    expect(screen.getByText('04 / INCIDENT CONFIGURATION REFERENCE')).toBeInTheDocument();
    expect(screen.getAllByText('INITIAL INCIDENT STATUS')[0]).toBeInTheDocument();
    expect(screen.getAllByText('REPORTED')[0]).toBeInTheDocument();
    expect(screen.getAllByText('STATE TRANSITIONS')[0]).toBeInTheDocument();
    expect(screen.getAllByText('SERVER CONTROLLED')[0]).toBeInTheDocument();
    expect(screen.getByText('ORGANIZATION SETTINGS MUST NOT OVERRIDE INCIDENT SAFETY RULES.')).toBeInTheDocument();

    // Section 05: Notification Readiness
    expect(screen.getByText('05 / NOTIFICATION READINESS')).toBeInTheDocument();
    expect(screen.getByText('USER RECORD AND NOTIFICATION BACKEND REQUIRED')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'MANAGE NOTIFICATION PREFERENCES' })).toBeDisabled();

    // Section 06: Demo Workspace
    expect(screen.getByText('06 / DEMO WORKSPACE')).toBeInTheDocument();
    expect(screen.getByText('CANONICAL MOCK SEED')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'LOAD DEMO WORKSPACE' })[0]).toBeDisabled();
    expect(screen.getByRole('button', { name: 'RESET DEMO WORKSPACE' })).toBeDisabled();
    expect(screen.getByText('ADMIN AUTHORITY AND BACKEND DEMO FUNCTION REQUIRED')).toBeInTheDocument();

    // Right Rail: Readiness, Operator Context & Security Contract
    expect(screen.getByText('SETTINGS READINESS')).toBeInTheDocument();
    expect(screen.getAllByText('CURRENT OPERATOR CONTEXT')[0]).toBeInTheDocument();
    expect(screen.getByText('07 / AUTHORITY CONTRACT')).toBeInTheDocument();
    expect(screen.getByText('VIEWING SETTINGS DOES NOT GRANT AUTHORITY TO CHANGE THEM.')).toBeInTheDocument();
    expect(screen.getByText(/Base44 must verify user identity/i)).toBeInTheDocument();

    // Confirm that there is NO invented details or Cognito strings
    expect(screen.queryByText('SARA CHEN')).not.toBeInTheDocument();
    expect(screen.queryByText('ALEX RIVERA')).not.toBeInTheDocument();
    expect(screen.queryByText('JAMAL WASHINGTON')).not.toBeInTheDocument();
    expect(screen.queryByText('ELENA ROSTOVA')).not.toBeInTheDocument();
    expect(screen.queryByText(/COGNITO/i)).not.toBeInTheDocument();
  });

  it('integrates Settings page with global feedback system under loading state', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/settings?previewUiState=loading&previewUiScope=settings']}>
          <FeedbackStateProvider>
            <Routes>
              <Route path="/app/settings" element={<SettingsPage />} />
            </Routes>
          </FeedbackStateProvider>
        </MemoryRouter>
      </AppProviders>
    );
    expect(screen.getByText('LOADING WORKSPACE DATA')).toBeInTheDocument();
  });

  it('integrates Settings page with global feedback system under forbidden state', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/settings?previewUiState=forbidden&previewUiScope=settings']}>
          <FeedbackStateProvider>
            <Routes>
              <Route path="/app/settings" element={<SettingsPage />} />
            </Routes>
          </FeedbackStateProvider>
        </MemoryRouter>
      </AppProviders>
    );
    expect(screen.getByText('ACCESS DENIED')).toBeInTheDocument();
    expect(screen.getByText(/The current authenticated identity does not have verified authority/i)).toBeInTheDocument();
  });

  it('integrates Settings page with global feedback system under network-error state', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/settings?previewUiState=network-error&previewUiScope=settings']}>
          <FeedbackStateProvider>
            <Routes>
              <Route path="/app/settings" element={<SettingsPage />} />
            </Routes>
          </FeedbackStateProvider>
        </MemoryRouter>
      </AppProviders>
    );
    expect(screen.getByText('WORKSPACE DATA COULD NOT BE LOADED')).toBeInTheDocument();
    expect(screen.getByText(/SignalFold could not retrieve the requested workspace data/i)).toBeInTheDocument();
  });
});
