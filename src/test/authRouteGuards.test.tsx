import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

const auth = vi.hoisted(() => ({
  isMockMode: false,
  state: { status: 'UNAUTHENTICATED', user: null, error: null } as {
    status: string;
    user: null | { id: string; email: string; displayName: string | null; emailVerified: boolean };
    error: null | { code: string; retryable: boolean };
  },
  restoreSession: vi.fn(),
}));

vi.mock('@/features/auth/AuthProvider', () => ({ useAuth: () => auth }));

const { PublicOnly, RequireAuth } = await import('@/features/auth/AuthRouteGuards');

describe('authentication route guards', () => {
  it('does not expose protected content during restoration', () => {
    auth.state = { status: 'RESTORING', user: null, error: null };
    render(<MemoryRouter><RequireAuth><div>PROTECTED CONTENT</div></RequireAuth></MemoryRouter>);
    expect(screen.getByRole('status')).toHaveTextContent('RESTORING AUTHENTICATION SESSION');
    expect(screen.queryByText('PROTECTED CONTENT')).not.toBeInTheDocument();
  });

  it('redirects an unauthenticated deep link and preserves its safe destination', () => {
    auth.state = { status: 'UNAUTHENTICATED', user: null, error: null };
    render(
      <MemoryRouter initialEntries={['/app/incidents/SF-2026-0042?tab=timeline']}>
        <Routes>
          <Route path="/app/incidents/:id" element={<RequireAuth><div>PROTECTED CONTENT</div></RequireAuth>} />
          <Route path="/login" element={<div>LOGIN DESTINATION</div>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('LOGIN DESTINATION')).toBeInTheDocument();
    expect(screen.queryByText('PROTECTED CONTENT')).not.toBeInTheDocument();
  });

  it('offers one controlled retry for a recoverable service failure', () => {
    auth.restoreSession.mockReset();
    auth.state = { status: 'UNAVAILABLE', user: null, error: { code: 'AUTH_SERVICE_UNAVAILABLE', retryable: true } };
    render(<MemoryRouter><RequireAuth><div>PROTECTED CONTENT</div></RequireAuth></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'RETRY SESSION' }));
    expect(auth.restoreSession).toHaveBeenCalledTimes(1);
  });

  it('redirects authenticated users away from public auth pages', () => {
    auth.state = {
      status: 'AUTHENTICATED',
      user: { id: 'safe-user', email: 'operator@example.test', displayName: null, emailVerified: true },
      error: null,
    };
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<PublicOnly><div>LOGIN FORM</div></PublicOnly>} />
          <Route path="/app" element={<div>APPLICATION ENTRY</div>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('APPLICATION ENTRY')).toBeInTheDocument();
    expect(screen.queryByText('LOGIN FORM')).not.toBeInTheDocument();
  });
});
