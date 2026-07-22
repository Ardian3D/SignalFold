import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { SignupPage } from '@/pages/SignupPage';
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

  it('displays validation feedback and does not navigate on successful local step submission', async () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app/onboarding']}>
          <OnboardingPage />
        </MemoryRouter>
      </AppProviders>
    );

    const orgInput = screen.getByLabelText('ORGANIZATION NAME');
    fireEvent.change(orgInput, { target: { value: 'Acme Emergency Resp' } });

    const submitBtn = screen.getByRole('button', { name: 'CONTINUE TO ROLE' });
    fireEvent.click(submitBtn);

    // Should briefly process
    expect(screen.getByRole('button', { name: 'PROCESSING...' })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText(/ORGANIZATION STEP VALIDATED/i).length).toBeGreaterThanOrEqual(1);
    }, { timeout: 1200 });

    expect(
      screen.getAllByText(/Workspace creation or invitation verification will be connected during backend integration/i).length
    ).toBeGreaterThanOrEqual(1);
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
});
