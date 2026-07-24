import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { AppProviders } from '@/app/providers';

describe('SignalFold OnboardingPage', () => {
  it('/app/onboarding renders OnboardingPage and does not render NotFoundPage', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/onboarding']}>
          <Routes>
            <Route path="/app/onboarding" element={<OnboardingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      </AppProviders>
    );

    // Verify main headline
    expect(screen.getByRole('heading', { name: /ESTABLISH YOUR/i })).toBeInTheDocument();
    // Verify 404 heading from NotFoundPage is NOT displayed
    expect(screen.queryByRole('heading', { name: /404/i })).not.toBeInTheDocument();
  });

  it('unknown routes still render NotFoundPage', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/unknown-route-xyz']}>
          <Routes>
            <Route path="/app/onboarding" element={<OnboardingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      </AppProviders>
    );

    expect(screen.getAllByText(/404/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the official BrandLogo and all three progress steps with correct active/inactive states', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/onboarding']}>
          <OnboardingPage />
        </MemoryRouter>
      </AppProviders>
    );

    // Official BrandLogo img asset is visible
    const logoElement = screen.getByAltText('SignalFold');
    expect(logoElement).toBeInTheDocument();
    expect(logoElement.tagName).toBe('IMG');

    // All three progress steps are rendered
    expect(screen.getAllByText('ORGANIZATION').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('ROLE & USE CASE')).toBeInTheDocument();
    expect(screen.getByText('REVIEW & ENTER')).toBeInTheDocument();

    // Step 01 is visually active
    expect(screen.getByText('ACTIVE STEP')).toBeInTheDocument();

    // Step 02 and Step 03 are inactive and not clickable
    expect(screen.getByText('NEXT STEP')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });

  it('has Create Organization selected by default and switches fields on Join selection', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/onboarding']}>
          <OnboardingPage />
        </MemoryRouter>
      </AppProviders>
    );

    // Default label is displayed
    expect(screen.getByLabelText('ORGANIZATION NAME')).toBeInTheDocument();
    expect(screen.queryByLabelText('WORKSPACE INVITATION')).not.toBeInTheDocument();

    // Verify radio-group accessibility roles
    const createRadio = screen.getByRole('radio', { name: /CREATE NEW/i });
    const joinRadio = screen.getByRole('radio', { name: /JOIN EXISTING/i });

    expect(createRadio).toHaveAttribute('aria-checked', 'true');
    expect(joinRadio).toHaveAttribute('aria-checked', 'false');

    // Click on join existing
    fireEvent.click(joinRadio);

    // Verify fields toggle correctly
    expect(screen.queryByLabelText('ORGANIZATION NAME')).not.toBeInTheDocument();
    expect(screen.getByLabelText('WORKSPACE INVITATION')).toBeInTheDocument();
    expect(joinRadio).toHaveAttribute('aria-checked', 'true');
    expect(createRadio).toHaveAttribute('aria-checked', 'false');
  });

  it('validates Organization Name in CREATE NEW mode', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/onboarding']}>
          <OnboardingPage />
        </MemoryRouter>
      </AppProviders>
    );

    const submitBtn = screen.getByRole('button', { name: 'CONTINUE TO ROLE' });
    
    // Submit empty org name
    fireEvent.click(submitBtn);
    expect(screen.getByText('Organization name is required.')).toBeInTheDocument();

    // Submit too short name
    const input = screen.getByLabelText('ORGANIZATION NAME');
    fireEvent.change(input, { target: { value: 'A' } });
    fireEvent.click(submitBtn);
    expect(screen.getByText('Organization name must contain at least 2 characters.')).toBeInTheDocument();
  });

  it('validates Workspace Invitation in JOIN EXISTING mode', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/onboarding']}>
          <OnboardingPage />
        </MemoryRouter>
      </AppProviders>
    );

    const joinRadio = screen.getByRole('radio', { name: /JOIN EXISTING/i });
    fireEvent.click(joinRadio);

    const submitBtn = screen.getByRole('button', { name: 'CONTINUE TO ROLE' });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Invitation link or code is required.')).toBeInTheDocument();
  });

  it('preserves user entered values when switching between paths', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/onboarding']}>
          <OnboardingPage />
        </MemoryRouter>
      </AppProviders>
    );

    const orgInput = screen.getByLabelText('ORGANIZATION NAME') as HTMLInputElement;
    fireEvent.change(orgInput, { target: { value: 'SignalFold Labs' } });

    // Switch to Join
    const joinRadio = screen.getByRole('radio', { name: /JOIN EXISTING/i });
    fireEvent.click(joinRadio);

    const inviteInput = screen.getByLabelText('WORKSPACE INVITATION') as HTMLInputElement;
    fireEvent.change(inviteInput, { target: { value: 'INVITE-999-XYZ' } });

    // Switch back to Create
    const createRadio = screen.getByRole('radio', { name: /CREATE NEW/i });
    fireEvent.click(createRadio);

    // Verify Org input value is preserved
    const orgInputAgain = screen.getByLabelText('ORGANIZATION NAME') as HTMLInputElement;
    expect(orgInputAgain.value).toBe('SignalFold Labs');

    // Switch to Join again and verify Invitation is preserved
    fireEvent.click(joinRadio);
    const inviteInputAgain = screen.getByLabelText('WORKSPACE INVITATION') as HTMLInputElement;
    expect(inviteInputAgain.value).toBe('INVITE-999-XYZ');
  });

  it('has correct secondary route links', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/onboarding']}>
          <OnboardingPage />
        </MemoryRouter>
      </AppProviders>
    );

    // BACK TO ACCOUNT CREATION -> /signup
    const backBtn = screen.getByRole('link', { name: 'BACK TO ACCOUNT CREATION' });
    expect(backBtn).toHaveAttribute('href', '/signup');

    // RETURN HOME -> /
    const homeBtn = screen.getByRole('link', { name: 'RETURN HOME' });
    expect(homeBtn).toHaveAttribute('href', '/');
  });

  it('valid Step 01 submission moves to Step 02, preserves Step 01 values, and updates progress layout', async () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/onboarding']}>
          <OnboardingPage />
        </MemoryRouter>
      </AppProviders>
    );

    const orgInput = screen.getByLabelText('ORGANIZATION NAME');
    fireEvent.change(orgInput, { target: { value: 'SignalFold Labs' } });

    const submitBtn = screen.getByRole('button', { name: 'CONTINUE TO ROLE' });
    fireEvent.click(submitBtn);

    // Verify loading state
    expect(screen.getByRole('button', { name: 'PROCESSING...' })).toBeInTheDocument();

    // Switched to Step 02 after timeout
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'ROLE & USE CASE' })).toBeInTheDocument();
    }, { timeout: 1200 });

    // Step 01 displays "VALIDATED LOCALLY" in progress rail
    expect(screen.getByText('VALIDATED LOCALLY')).toBeInTheDocument();

    // Step 02 displays "ACTIVE STEP" in progress rail
    const activeSteps = screen.getAllByText('ACTIVE STEP');
    expect(activeSteps.length).toBeGreaterThanOrEqual(1);

    // Step 03 remains inactive "NEXT STEP"
    expect(screen.getByText('NEXT STEP')).toBeInTheDocument();

    // All four role options are rendered
    expect(screen.getByText('REPORTER')).toBeInTheDocument();
    expect(screen.getByText('RESPONDER')).toBeInTheDocument();
    expect(screen.getByText('INCIDENT MANAGER')).toBeInTheDocument();
    expect(screen.getByText('ORGANIZATION ADMIN')).toBeInTheDocument();

    // All four use-case options are rendered
    expect(screen.getByText('INCIDENT REPORTING')).toBeInTheDocument();
    expect(screen.getByText('RESPONSE COORDINATION')).toBeInTheDocument();
    expect(screen.getByText('TECHNICAL RESPONSE')).toBeInTheDocument();
    expect(screen.getByText('OPERATIONAL OVERSIGHT')).toBeInTheDocument();

    // Default selections: None
    const reporterRadio = screen.getByRole('radio', { name: /REPORTER/i }) as HTMLInputElement;
    const incidentReportingRadio = screen.getByRole('radio', { name: /INCIDENT REPORTING/i }) as HTMLInputElement;
    expect(reporterRadio.checked).toBe(false);
    expect(incidentReportingRadio.checked).toBe(false);

    // Submit empty Step 02 displays both validation errors
    const step2SubmitBtn = screen.getByRole('button', { name: 'CONTINUE TO REVIEW' });
    fireEvent.click(step2SubmitBtn);
    expect(screen.getByText('Please select a primary operating role.')).toBeInTheDocument();
    expect(screen.getByText('Please select a primary use case.')).toBeInTheDocument();

    // Select role and use case
    fireEvent.click(reporterRadio);
    expect(reporterRadio.checked).toBe(true);
    fireEvent.click(incidentReportingRadio);
    expect(incidentReportingRadio.checked).toBe(true);

    // Optional team or function accepts input
    const teamInput = screen.getByLabelText('TEAM OR FUNCTION') as HTMLInputElement;
    fireEvent.change(teamInput, { target: { value: 'Platform Engineering' } });
    expect(teamInput.value).toBe('Platform Engineering');

    // Context preview displays choices using font-mono layout (IBM Plex Mono)
    expect(screen.getAllByText('REPORTER').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('INCIDENT REPORTING').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('NOT ASSIGNED')).toBeInTheDocument();
    expect(screen.getByText('NOT CREATED')).toBeInTheDocument();

    // Submit Step 02 successfully
    fireEvent.click(step2SubmitBtn);
    expect(screen.getByRole('button', { name: 'PROCESSING...' })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'REVIEW & ENTER' })).toBeInTheDocument();
    }, { timeout: 1200 });

    // Step 01 and Step 02 show VALIDATED LOCALLY in progress rail
    const validatedRails = screen.getAllByText('VALIDATED LOCALLY');
    expect(validatedRails.length).toBeGreaterThanOrEqual(2);

    // Step 03 shows ACTIVE STEP
    expect(screen.getAllByText('ACTIVE STEP').length).toBeGreaterThanOrEqual(1);

    // Verify review page content and sections
    expect(screen.getByRole('heading', { name: '01 / ORGANIZATION' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '02 / OPERATING CONTEXT' })).toBeInTheDocument();

    // Verify values displayed
    expect(screen.getByText('CREATE NEW ORGANIZATION')).toBeInTheDocument();
    expect(screen.getByText('SignalFold Labs')).toBeInTheDocument();
    expect(screen.getByText('REPORTER')).toBeInTheDocument();
    expect(screen.getByText('INCIDENT REPORTING')).toBeInTheDocument();
    expect(screen.getByText('Platform Engineering')).toBeInTheDocument();

    // Verify setup readiness checklist
    expect(screen.getByText('SETUP READINESS CHECKLIST')).toBeInTheDocument();
    expect(screen.getAllByText('ORGANIZATION CONTEXT').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('OPERATING ROLE').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('PRIMARY USE CASE').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('MEMBERSHIP AUTHORITY').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('DATA PERSISTENCE').length).toBeGreaterThanOrEqual(1);

    // Click "ENTER WORKSPACE"
    const enterBtn = screen.getByRole('button', { name: 'ENTER WORKSPACE' });
    fireEvent.click(enterBtn);

    // Verify preparing state
    expect(screen.getByRole('button', { name: 'PREPARING WORKSPACE PREVIEW...' })).toBeInTheDocument();

    // Verify "WORKSPACE ENTRY NOT CONNECTED" warning shows up after timeout
    await waitFor(() => {
      expect(screen.getByText('WORKSPACE ENTRY NOT CONNECTED')).toBeInTheDocument();
    }, { timeout: 1200 });

    // Click EDIT ORGANIZATION to return to Step 1
    const editOrgBtn = screen.getByRole('button', { name: 'Edit Organization Setup' });
    fireEvent.click(editOrgBtn);

    // Returns to Step 01
    expect(screen.getByRole('heading', { name: 'ORGANIZATION' })).toBeInTheDocument();
    const restoredOrgInput = screen.getByLabelText('ORGANIZATION NAME') as HTMLInputElement;
    expect(restoredOrgInput.value).toBe('SignalFold Labs');

    // Go back to Step 2
    const continueToRoleBtn = screen.getByRole('button', { name: 'CONTINUE TO ROLE' });
    fireEvent.click(continueToRoleBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'ROLE & USE CASE' })).toBeInTheDocument();
    }, { timeout: 1200 });

    const restoredReporterRadio = screen.getByRole('radio', { name: /REPORTER/i }) as HTMLInputElement;
    const restoredIncidentReportingRadio = screen.getByRole('radio', { name: /INCIDENT REPORTING/i }) as HTMLInputElement;
    const restoredTeamInput = screen.getByLabelText('TEAM OR FUNCTION') as HTMLInputElement;

    expect(restoredReporterRadio.checked).toBe(true);
    expect(restoredIncidentReportingRadio.checked).toBe(true);
    expect(restoredTeamInput.value).toBe('Platform Engineering');

    // Go to Step 3 again
    const continueToReviewBtn = screen.getByRole('button', { name: 'CONTINUE TO REVIEW' });
    fireEvent.click(continueToReviewBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'REVIEW & ENTER' })).toBeInTheDocument();
    }, { timeout: 1200 });

    // Click "EDIT ROLE & USE CASE" to go to Step 2
    const editRoleBtn = screen.getByRole('button', { name: 'Edit Role and Use Case Setup' });
    fireEvent.click(editRoleBtn);

    expect(screen.getByRole('heading', { name: 'ROLE & USE CASE' })).toBeInTheDocument();
  }, 15000);
});
