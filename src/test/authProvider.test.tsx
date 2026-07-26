import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  runtime: {
    dataMode: 'mock' as 'mock' | 'base44',
    appId: null as string | null,
    useLocalDev: false,
    localServerUrl: null as string | null,
    isConfigured: false,
  },
  gateway: {
    restoreSession: vi.fn(),
    loginWithEmailPassword: vi.fn(),
    registerWithEmailPassword: vi.fn(),
    verifyEmailOtp: vi.fn(),
    resendVerificationOtp: vi.fn(),
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
  },
  getGateway: vi.fn(),
}));

vi.mock('@/integrations/base44/config', () => ({
  getBase44RuntimeConfig: () => mocks.runtime,
}));
vi.mock('@/features/auth/authGateway', () => ({
  getAuthGateway: mocks.getGateway,
}));

const { AuthProvider, useAuth } = await import('@/features/auth/AuthProvider');

const user = {
  id: 'user-1',
  email: 'operator@example.test',
  displayName: 'Test Operator',
  emailVerified: true,
};

function Probe() {
  const auth = useAuth();
  return <output>{auth.state.status}:{auth.user?.email ?? 'no-user'}</output>;
}

function RetryProbe() {
  const auth = useAuth();
  return (
    <div>
      <output>{auth.state.status}:{auth.user?.email ?? 'no-user'}</output>
      <button type="button" onClick={() => void auth.restoreSession()}>RETRY</button>
    </div>
  );
}

describe('AuthProvider runtime session boundary', () => {
  beforeEach(() => {
    mocks.runtime.dataMode = 'mock';
    mocks.runtime.appId = null;
    mocks.runtime.isConfigured = false;
    mocks.getGateway.mockReturnValue(mocks.gateway);
    Object.values(mocks.gateway).forEach((mock) => mock.mockReset());
  });

  it('does not restore or contact Base44 in mock mode', async () => {
    render(<AuthProvider><Probe /></AuthProvider>);
    expect(screen.getByText('UNAUTHENTICATED:no-user')).toBeInTheDocument();
    await Promise.resolve();
    expect(mocks.gateway.restoreSession).not.toHaveBeenCalled();
  });

  it('restores Base44 mode once and maps the safe authenticated identity', async () => {
    mocks.runtime.dataMode = 'base44';
    mocks.runtime.appId = 'app_test';
    mocks.runtime.isConfigured = true;
    mocks.gateway.restoreSession.mockResolvedValue({ ok: true, value: { status: 'authenticated', user } });

    const view = render(<AuthProvider><Probe /></AuthProvider>);
    view.rerender(<AuthProvider><Probe /></AuthProvider>);

    await waitFor(() => expect(screen.getByText('AUTHENTICATED:operator@example.test')).toBeInTheDocument());
    expect(mocks.gateway.restoreSession).toHaveBeenCalledTimes(1);
  });

  it('keeps recoverable restoration failures distinct from logout', async () => {
    mocks.runtime.dataMode = 'base44';
    mocks.runtime.appId = 'app_test';
    mocks.runtime.isConfigured = true;
    mocks.gateway.restoreSession.mockResolvedValue({ ok: false, error: { code: 'NETWORK_ERROR', retryable: true } });

    render(<AuthProvider><Probe /></AuthProvider>);

    await waitFor(() => expect(screen.getByText('ERROR:no-user')).toBeInTheDocument());
    expect(screen.queryByText(/AUTHENTICATED/)).not.toBeInTheDocument();
  });

  it('allows one controlled retry after a recoverable restoration failure', async () => {
    mocks.runtime.dataMode = 'base44';
    mocks.runtime.appId = 'app_test';
    mocks.runtime.isConfigured = true;
    mocks.gateway.restoreSession
      .mockResolvedValueOnce({ ok: false, error: { code: 'NETWORK_ERROR', retryable: true } })
      .mockResolvedValueOnce({ ok: true, value: { status: 'authenticated', user } });

    render(<AuthProvider><RetryProbe /></AuthProvider>);
    await waitFor(() => expect(screen.getByText('ERROR:no-user')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'RETRY' }));
    await waitFor(() => expect(screen.getByText('AUTHENTICATED:operator@example.test')).toBeInTheDocument());
    expect(mocks.gateway.restoreSession).toHaveBeenCalledTimes(2);
  });
});
