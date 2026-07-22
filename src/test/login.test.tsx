import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { AppProviders } from '@/app/providers';

describe('SignalFold LoginPage (Secure Access)', () => {
  it('renders standard system identifiers, titles, and asymmetric copy text', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/login']}>
          <LoginPage />
        </MemoryRouter>
      </AppProviders>
    );

    // Header metadata
    expect(screen.getByText('AUTHENTICATION')).toBeInTheDocument();
    expect(screen.getByText('SECURE ACCESS')).toBeInTheDocument();

    // Editorial column
    expect(screen.getByText('ACCESS / INCIDENT COMMAND')).toBeInTheDocument();
    expect(screen.getByText(/RETURN TO THE/i)).toBeInTheDocument();
    expect(screen.getByText(/COMMAND SURFACE/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        'Sign in to coordinate active incidents, manage response ownership, verify resolution, and preserve every operational decision.'
      )
    ).toBeInTheDocument();

    // Assurance rail
    expect(screen.getByText('HUMAN AUTHORITY')).toBeInTheDocument();
    expect(screen.getByText('TENANT ISOLATED')).toBeInTheDocument();
    expect(screen.getByText('ACTIONS TRACEABLE')).toBeInTheDocument();

    // Panel Header
    expect(screen.getByRole('heading', { name: 'SIGN IN' })).toBeInTheDocument();
    expect(screen.getByText('AUTHORIZED WORKSPACE ACCESS')).toBeInTheDocument();
  });

  it('renders official BrandLogo and checks relative routing configurations', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/login']}>
          <LoginPage />
        </MemoryRouter>
      </AppProviders>
    );

    // Official logo lockup
    const logoElement = screen.getByAltText('SignalFold');
    expect(logoElement).toBeInTheDocument();
    expect(logoElement.tagName).toBe('IMG');

    // Create Account route to /signup
    const createAccountLink = screen.getByRole('link', { name: /CREATE ACCOUNT/i });
    expect(createAccountLink).toHaveAttribute('href', '/signup');

    // Return Home route to /
    const returnHomeLink = screen.getByRole('link', { name: 'RETURN HOME' });
    expect(returnHomeLink).toHaveAttribute('href', '/');
  });

  it('contains email and password inputs with standard attributes', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/login']}>
          <LoginPage />
        </MemoryRouter>
      </AppProviders>
    );

    const emailInput = screen.getByLabelText('EMAIL ADDRESS') as HTMLInputElement;
    expect(emailInput).toBeInTheDocument();
    expect(emailInput.type).toBe('email');
    expect(emailInput.placeholder).toBe('name@company.com');
    expect(emailInput).toHaveAttribute('autocomplete', 'email');

    const passwordInput = screen.getByLabelText('PASSWORD') as HTMLInputElement;
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput.type).toBe('password');
    expect(passwordInput.placeholder).toBe('Enter your password');
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
  });

  it('displays required validation on empty form submission', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/login']}>
          <LoginPage />
        </MemoryRouter>
      </AppProviders>
    );

    const submitBtn = screen.getByRole('button', { name: 'SIGN IN' });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Email address is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
  });

  it('displays syntax error on invalid email address format', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/login']}>
          <LoginPage />
        </MemoryRouter>
      </AppProviders>
    );

    const emailInput = screen.getByLabelText('EMAIL ADDRESS');
    fireEvent.change(emailInput, { target: { value: 'invalid-email-no-domain' } });

    const submitBtn = screen.getByRole('button', { name: 'SIGN IN' });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('displays error on passwords under 8 characters long', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/login']}>
          <LoginPage />
        </MemoryRouter>
      </AppProviders>
    );

    const emailInput = screen.getByLabelText('EMAIL ADDRESS');
    fireEvent.change(emailInput, { target: { value: 'operator@company.com' } });

    const passwordInput = screen.getByLabelText('PASSWORD');
    fireEvent.change(passwordInput, { target: { value: 'short' } });

    const submitBtn = screen.getByRole('button', { name: 'SIGN IN' });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Password must contain at least 8 characters.')).toBeInTheDocument();
  });

  it('handles custom password SHOW/HIDE toggle safely', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/login']}>
          <LoginPage />
        </MemoryRouter>
      </AppProviders>
    );

    const passwordInput = screen.getByLabelText('PASSWORD') as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'secret-password-123' } });

    // Grab show button
    const showButton = screen.getByRole('button', { name: 'Show password' });
    expect(showButton).toBeInTheDocument();

    // Click SHOW
    fireEvent.click(showButton);
    expect(passwordInput.type).toBe('text');

    // Click HIDE
    const hideButton = screen.getByRole('button', { name: 'Hide password' });
    expect(hideButton).toBeInTheDocument();
    fireEvent.click(hideButton);
    expect(passwordInput.type).toBe('password');
  });

  it('displays backend connection pending information message after valid input submission', async () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/login']}>
          <LoginPage />
        </MemoryRouter>
      </AppProviders>
    );

    const emailInput = screen.getByLabelText('EMAIL ADDRESS');
    fireEvent.change(emailInput, { target: { value: 'incident-commander@company.com' } });

    const passwordInput = screen.getByLabelText('PASSWORD');
    fireEvent.change(passwordInput, { target: { value: 'valid-secure-password' } });

    const submitBtn = screen.getByRole('button', { name: 'SIGN IN' });
    fireEvent.click(submitBtn);

    // Displays submitting or success message after local validation processing timeout
    await waitFor(() => {
      expect(
        screen.getByText(/AUTHENTICATION SERVICE NOT CONNECTED/i)
      ).toBeInTheDocument();
    }, { timeout: 1200 });

    expect(
      screen.getAllByText(/Frontend validation completed. Backend connection will be added during integration./i).length
    ).toBeGreaterThanOrEqual(1);
  });

  it('verifies that /login renders the custom LoginPage elements and does not show 404', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      </AppProviders>
    );

    expect(screen.getByRole('heading', { name: 'SIGN IN' })).toBeInTheDocument();
    expect(screen.queryByText('THIS ROUTE')).not.toBeInTheDocument();
  });

  it('renders GoogleAuthButton and supports visual/interaction requirements', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/login']}>
          <LoginPage />
        </MemoryRouter>
      </AppProviders>
    );

    // Verify button renders with label "Continue with Google"
    const googleBtn = screen.getByRole('button', { name: 'Continue with Google' });
    expect(googleBtn).toBeInTheDocument();
    expect(googleBtn).toHaveAttribute('type', 'button');

    // Clicking it displays correct dynamic non-connected messages
    fireEvent.click(googleBtn);

    expect(screen.getAllByText(/GOOGLE AUTHENTICATION NOT CONNECTED/i).length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText(/Google account access will be enabled during backend integration/i).length
    ).toBeGreaterThanOrEqual(1);
  });
});
