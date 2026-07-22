import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { AppProviders } from '@/app/providers';

describe('SignalFold SignupPage', () => {
  it('renders SignupPage on /signup and does not show 404 heading', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/signup']}>
          <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      </AppProviders>
    );

    // Verify page content
    expect(screen.getByRole('heading', { name: 'CREATE ACCOUNT' })).toBeInTheDocument();
    // Verify 404 heading from NotFoundPage is NOT displayed
    expect(screen.queryByRole('heading', { name: /404/i })).not.toBeInTheDocument();
  });

  it('renders LoginPage on /login and NotFoundPage on unknown routes', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      </AppProviders>
    );

    expect(screen.getByRole('heading', { name: 'SIGN IN' })).toBeInTheDocument();

    // Now render with unknown route
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/unknown-route-abc']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      </AppProviders>
    );

    expect(screen.getAllByText(/404/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders official BrandLogo and custom GoogleAuthButton using mode="signup"', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/signup']}>
          <SignupPage />
        </MemoryRouter>
      </AppProviders>
    );

    // Official logo lockup
    const logoElement = screen.getByAltText('SignalFold');
    expect(logoElement).toBeInTheDocument();
    expect(logoElement.tagName).toBe('IMG');

    // GoogleAuthButton in signup mode
    const googleBtn = screen.getByRole('button', { name: 'Continue with Google' });
    expect(googleBtn).toBeInTheDocument();
    expect(googleBtn).toHaveAttribute('type', 'button');
  });

  it('contains all four form fields with correct names, placeholders, and attributes', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/signup']}>
          <SignupPage />
        </MemoryRouter>
      </AppProviders>
    );

    // FULL NAME
    const nameInput = screen.getByLabelText('FULL NAME') as HTMLInputElement;
    expect(nameInput).toBeInTheDocument();
    expect(nameInput.type).toBe('text');
    expect(nameInput.placeholder).toBe('Jordan Lee');
    expect(nameInput).toHaveAttribute('autocomplete', 'name');

    // WORK EMAIL
    const emailInput = screen.getByLabelText('WORK EMAIL') as HTMLInputElement;
    expect(emailInput).toBeInTheDocument();
    expect(emailInput.type).toBe('email');
    expect(emailInput.placeholder).toBe('name@company.com');
    expect(emailInput).toHaveAttribute('autocomplete', 'email');

    // PASSWORD
    const passwordInput = screen.getByLabelText('PASSWORD') as HTMLInputElement;
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput.type).toBe('password');
    expect(passwordInput.placeholder).toBe('Create a password');
    expect(passwordInput).toHaveAttribute('autocomplete', 'new-password');

    // CONFIRM PASSWORD
    const confirmInput = screen.getByLabelText('CONFIRM PASSWORD') as HTMLInputElement;
    expect(confirmInput).toBeInTheDocument();
    expect(confirmInput.type).toBe('password');
    expect(confirmInput.placeholder).toBe('Confirm your password');
    expect(confirmInput).toHaveAttribute('autocomplete', 'new-password');
  });

  it('displays validation errors for empty fields on submission', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/signup']}>
          <SignupPage />
        </MemoryRouter>
      </AppProviders>
    );

    const submitBtn = screen.getByRole('button', { name: 'CREATE ACCOUNT' });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Full name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email address is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
    expect(screen.getByText('Please confirm your password.')).toBeInTheDocument();
  });

  it('displays a validation error for invalid email and too short full name', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/signup']}>
          <SignupPage />
        </MemoryRouter>
      </AppProviders>
    );

    const nameInput = screen.getByLabelText('FULL NAME');
    const emailInput = screen.getByLabelText('WORK EMAIL');

    fireEvent.change(nameInput, { target: { value: 'J' } });
    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });

    const submitBtn = screen.getByRole('button', { name: 'CREATE ACCOUNT' });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Full name must contain at least 2 characters.')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('displays a validation error for weak password and mismatched passwords', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/signup']}>
          <SignupPage />
        </MemoryRouter>
      </AppProviders>
    );

    const passwordInput = screen.getByLabelText('PASSWORD');
    const confirmInput = screen.getByLabelText('CONFIRM PASSWORD');

    // Password < 8 characters
    fireEvent.change(passwordInput, { target: { value: 'abc' } });
    const submitBtn = screen.getByRole('button', { name: 'CREATE ACCOUNT' });
    fireEvent.click(submitBtn);
    expect(screen.getByText('Password must contain at least 8 characters.')).toBeInTheDocument();

    // Password >= 8 but no number
    fireEvent.change(passwordInput, { target: { value: 'abcdefgh' } });
    fireEvent.click(submitBtn);
    expect(screen.getByText('Password must contain at least one letter and one number.')).toBeInTheDocument();

    // Valid password, but mismatched confirmation
    fireEvent.change(passwordInput, { target: { value: 'securePass123' } });
    fireEvent.change(confirmInput, { target: { value: 'differentPass123' } });
    fireEvent.click(submitBtn);
    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
  });

  it('toggles password visibility controls independently', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/signup']}>
          <SignupPage />
        </MemoryRouter>
      </AppProviders>
    );

    const passwordInput = screen.getByLabelText('PASSWORD') as HTMLInputElement;
    const confirmInput = screen.getByLabelText('CONFIRM PASSWORD') as HTMLInputElement;

    // Put some values in so buttons are active
    fireEvent.change(passwordInput, { target: { value: 'securePass123' } });
    fireEvent.change(confirmInput, { target: { value: 'securePass123' } });

    expect(passwordInput.type).toBe('password');
    expect(confirmInput.type).toBe('password');

    // Find the toggle buttons. Use the aria-labels to make it highly precise.
    const showPasswordBtn = screen.getByRole('button', { name: 'Show password' });
    const showConfirmBtn = screen.getByRole('button', { name: 'Show confirm password' });

    // Toggle password
    fireEvent.click(showPasswordBtn);
    expect(passwordInput.type).toBe('text');
    expect(confirmInput.type).toBe('password'); // remains hidden

    // Toggle confirm password
    fireEvent.click(showConfirmBtn);
    expect(passwordInput.type).toBe('text');
    expect(confirmInput.type).toBe('text');

    // Toggle password back off
    const hidePasswordBtn = screen.getByRole('button', { name: 'Hide password' });
    fireEvent.click(hidePasswordBtn);
    expect(passwordInput.type).toBe('password');
    expect(confirmInput.type).toBe('text');
  });

  it('displays the backend-not-connected error and does not navigate on valid local submission', async () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/signup']}>
          <SignupPage />
        </MemoryRouter>
      </AppProviders>
    );

    const nameInput = screen.getByLabelText('FULL NAME');
    const emailInput = screen.getByLabelText('WORK EMAIL');
    const passwordInput = screen.getByLabelText('PASSWORD');
    const confirmInput = screen.getByLabelText('CONFIRM PASSWORD');

    fireEvent.change(nameInput, { target: { value: 'Jordan Lee' } });
    fireEvent.change(emailInput, { target: { value: 'jordan@company.com' } });
    fireEvent.change(passwordInput, { target: { value: 'securePassword123' } });
    fireEvent.change(confirmInput, { target: { value: 'securePassword123' } });

    const submitBtn = screen.getByRole('button', { name: 'CREATE ACCOUNT' });
    fireEvent.click(submitBtn);

    // Should briefly process
    expect(screen.getByRole('button', { name: 'PROCESSING...' })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/REGISTRATION SERVICE NOT CONNECTED/i)).toBeInTheDocument();
    }, { timeout: 1200 });

    expect(
      screen.getAllByText(/Account creation and organization onboarding will be enabled during backend integration/i).length
    ).toBeGreaterThanOrEqual(1);
  });

  it('has correct links and link targets for secondary routing', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/signup']}>
          <SignupPage />
        </MemoryRouter>
      </AppProviders>
    );

    // SIGN IN routes to /login
    const signInLink = screen.getByRole('link', { name: /SIGN IN/i });
    expect(signInLink).toHaveAttribute('href', '/login');

    // RETURN HOME routes to /
    const returnHomeLink = screen.getByRole('link', { name: 'RETURN HOME' });
    expect(returnHomeLink).toHaveAttribute('href', '/');

    // Terms and Privacy links
    const termsLink = screen.getByRole('link', { name: 'Terms' });
    expect(termsLink).toHaveAttribute('href', '/terms');

    const privacyLink = screen.getByRole('link', { name: 'Privacy Notice' });
    expect(privacyLink).toHaveAttribute('href', '/privacy');
  });
});
