import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Base44RuntimeConfig } from '@/integrations/base44/config';
import type { User as Base44User } from '@base44/sdk';

const authMock = {
  isAuthenticated: vi.fn(),
  me: vi.fn(),
  loginViaEmailPassword: vi.fn(),
  register: vi.fn(),
  verifyOtp: vi.fn(),
  resendOtp: vi.fn(),
  logout: vi.fn(),
  loginWithProvider: vi.fn(),
};
const getBase44ClientMock = vi.fn((input?: Base44RuntimeConfig) => input?.isConfigured ? { auth: authMock } : null);

vi.mock('@/integrations/base44/client', () => ({ getBase44Client: getBase44ClientMock }));

const config: Base44RuntimeConfig = {
  dataMode: 'base44',
  appId: 'app_test',
  useLocalDev: false,
  localServerUrl: null,
  isConfigured: true,
};

const user: Base44User & { access_token: string } = {
  id: 'user-1',
  created_date: '2026-01-01T00:00:00Z',
  updated_date: '2026-01-01T00:00:00Z',
  email: 'operator@example.test',
  full_name: 'Test Operator',
  disabled: false,
  is_verified: true,
  app_id: 'app_test',
  is_service: false,
  _app_role: 'user',
  role: 'admin',
  access_token: 'must-not-leak',
};

const { Base44AuthGateway, mapBase44User } = await import('@/features/auth/adapters/Base44AuthGateway');
const { MockAuthGateway } = await import('@/features/auth/adapters/MockAuthGateway');
const { normalizeAuthError } = await import('@/features/auth/domain/authErrors');
const { applyLogout, applySessionResult, beginSessionRestore, initialSessionState } = await import('@/features/auth/session/authSessionMachine');
const { getAuthGateway } = await import('@/features/auth/authGateway');

describe('local Base44 auth configuration', () => {
  it('tracks email/password locally without adding secrets', () => {
    const source = readFileSync(resolve(process.cwd(), 'base44/auth/config.jsonc'), 'utf8');
    const auth = JSON.parse(source) as Record<string, unknown>;
    expect(auth.enableUsernamePassword).toBe(true);
    expect(auth.enableGoogleLogin).toBe(true);
    expect(auth.googleOAuthMode).toBe('default');
    expect(auth.googleOAuthClientId).toBeNull();
    expect(source).not.toMatch(/clientSecret|client_secret|access_token|password\s*:/i);
  });

  it('preserves the intentionally existing Google provider and leaves other providers disabled', () => {
    const auth = JSON.parse(readFileSync(resolve(process.cwd(), 'base44/auth/config.jsonc'), 'utf8')) as Record<string, unknown>;
    expect(auth.enableGoogleLogin).toBe(true);
    expect(auth.enableMicrosoftLogin).toBe(false);
    expect(auth.enableFacebookLogin).toBe(false);
    expect(auth.enableAppleLogin).toBe(false);
    expect(auth.enableSSOLogin).toBe(false);
  });
});

describe('authenticated user mapping', () => {
  it('maps identity fields only and excludes Base44 role and tokens', () => {
    expect(mapBase44User(user)).toEqual({
      id: 'user-1',
      email: 'operator@example.test',
      displayName: 'Test Operator',
      emailVerified: true,
    });
    expect(mapBase44User({ ...user, full_name: null }).displayName).toBeNull();
    expect(mapBase44User(user)).not.toHaveProperty('role');
    expect(mapBase44User(user)).not.toHaveProperty('access_token');
  });
});

describe('Base44 auth gateway', () => {
  const gateway = new Base44AuthGateway(config);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('restores an unauthenticated session without calling me when auth is false', async () => {
    authMock.isAuthenticated.mockResolvedValue(false);
    await expect(gateway.restoreSession()).resolves.toEqual({ ok: true, value: { status: 'unauthenticated', user: null } });
    expect(authMock.me).not.toHaveBeenCalled();
  });

  it('restores an authenticated session and maps the user', async () => {
    authMock.isAuthenticated.mockResolvedValue(true);
    authMock.me.mockResolvedValue(user);
    await expect(gateway.restoreSession()).resolves.toEqual({
      ok: true,
      value: { status: 'authenticated', user: { id: 'user-1', email: 'operator@example.test', displayName: 'Test Operator', emailVerified: true } },
    });
    expect(authMock.me).toHaveBeenCalledTimes(1);
  });

  it('keeps network failures recoverable instead of pretending logged out', async () => {
    authMock.isAuthenticated.mockRejectedValue(new Error('network timeout'));
    const result = await gateway.restoreSession();
    expect(result).toEqual({ ok: false, error: { code: 'NETWORK_ERROR', retryable: true } });
  });

  it('logs in with trimmed email, preserves password submission, and discards access tokens', async () => {
    authMock.loginViaEmailPassword.mockResolvedValue({ access_token: 'secret', user });
    const result = await gateway.loginWithEmailPassword('  operator@example.test ', 'submitted-secret');
    expect(authMock.loginViaEmailPassword).toHaveBeenCalledWith('operator@example.test', 'submitted-secret');
    expect(result).toEqual({ ok: true, value: { id: 'user-1', email: 'operator@example.test', displayName: 'Test Operator', emailVerified: true } });
    expect(JSON.stringify(result)).not.toContain('secret');
  });

  it('starts Google OAuth through the Base44-managed provider without handling tokens', async () => {
    authMock.loginWithProvider.mockReturnValue(undefined);
    await expect(gateway.loginWithGoogle('/app/incidents')).resolves.toEqual({ ok: true, value: undefined });
    expect(authMock.loginWithProvider).toHaveBeenCalledWith('google', '/app/incidents');
  });

  it('normalizes invalid credentials without returning the password', async () => {
    authMock.loginViaEmailPassword.mockRejectedValue({ status: 401, message: 'invalid credentials: submitted-secret' });
    const result = await gateway.loginWithEmailPassword('operator@example.test', 'submitted-secret');
    expect(result).toEqual({ ok: false, error: { code: 'INVALID_CREDENTIALS', retryable: false } });
    expect(JSON.stringify(result)).not.toContain('submitted-secret');
  });

  it('keeps registration separate from authentication', async () => {
    authMock.register.mockResolvedValue({ access_token: 'ignored', user });
    await expect(gateway.registerWithEmailPassword('  new@example.test ', 'submitted-secret')).resolves.toEqual({
      ok: true,
      value: { status: 'verification-required', email: 'new@example.test' },
    });
    expect(authMock.register).toHaveBeenCalledWith({ email: 'new@example.test', password: 'submitted-secret' });
    expect(authMock.loginViaEmailPassword).not.toHaveBeenCalled();
  });

  it('verifies and resends OTP without returning the code', async () => {
    authMock.verifyOtp.mockResolvedValue({ access_token: 'ignored' });
    authMock.resendOtp.mockResolvedValue({ message: 'sent', otp: 'ignored' });
    await expect(gateway.verifyEmailOtp('new@example.test', '123456')).resolves.toEqual({ ok: true, value: { status: 'verified' } });
    await expect(gateway.resendVerificationOtp('new@example.test')).resolves.toEqual({ ok: true, value: { status: 'sent' } });
    expect(authMock.verifyOtp).toHaveBeenCalledWith({ email: 'new@example.test', otpCode: '123456' });
    expect(JSON.stringify(await gateway.verifyEmailOtp('new@example.test', '123456'))).not.toContain('123456');
  });

  it('delegates logout without redirect or entity work', async () => {
    authMock.logout.mockReturnValue(undefined);
    await expect(gateway.logout()).resolves.toEqual({ ok: true, value: undefined });
    expect(authMock.logout).toHaveBeenCalledWith();
  });

  it('returns unavailable when Base44 is not configured', async () => {
    const unavailableGateway = new Base44AuthGateway({ ...config, appId: null, isConfigured: false });
    await expect(unavailableGateway.restoreSession()).resolves.toEqual({ ok: false, error: { code: 'AUTH_UNAVAILABLE', retryable: false } });
    expect(authMock.isAuthenticated).not.toHaveBeenCalled();
  });
});

describe('mock gateway and selection', () => {
  it('preserves route-only mock authentication without contacting Base44', async () => {
    getBase44ClientMock.mockClear();
    const gateway = new MockAuthGateway();
    await expect(gateway.restoreSession()).resolves.toEqual({ ok: true, value: { status: 'unauthenticated', user: null } });
    await expect(gateway.loginWithEmailPassword('operator@example.test', 'submitted-secret')).resolves.toEqual({ ok: false, error: { code: 'AUTH_UNAVAILABLE', retryable: false } });
    expect(getBase44ClientMock).not.toHaveBeenCalled();
  });

  it('selects mock mode by default without making an SDK call', () => {
    getBase44ClientMock.mockClear();
    expect(getAuthGateway({ ...config, dataMode: 'mock' })).toBeInstanceOf(MockAuthGateway);
    expect(getBase44ClientMock).not.toHaveBeenCalled();
  });
});

describe('session state model and error taxonomy', () => {
  it('distinguishes restoring, authenticated, unavailable, error, and logout states', () => {
    expect(initialSessionState().status).toBe('UNINITIALIZED');
    expect(beginSessionRestore().status).toBe('RESTORING');
    expect(applySessionResult({ ok: true, value: { status: 'authenticated', user: { id: '1', email: 'operator@example.test', displayName: null, emailVerified: false } } }).status).toBe('AUTHENTICATED');
    expect(applySessionResult({ ok: false, error: { code: 'AUTH_UNAVAILABLE', retryable: false } }).status).toBe('UNAVAILABLE');
    expect(applySessionResult({ ok: false, error: { code: 'NETWORK_ERROR', retryable: true } }).status).toBe('ERROR');
    expect(applyLogout()).toEqual({ status: 'UNAUTHENTICATED', user: null, error: null });
  });

  it('normalizes the required auth error classes without raw details', () => {
    expect(normalizeAuthError({ status: 409, message: 'email already registered' }).code).toBe('EMAIL_ALREADY_REGISTERED');
    expect(normalizeAuthError({ message: 'verification required' }).code).toBe('EMAIL_VERIFICATION_REQUIRED');
    expect(normalizeAuthError({ message: 'invalid otp' }).code).toBe('INVALID_OTP');
    expect(normalizeAuthError({ message: 'expired otp' }).code).toBe('EXPIRED_OTP');
    expect(normalizeAuthError({ status: 429 }).code).toBe('RATE_LIMITED');
    expect(normalizeAuthError({ status: 503 }).code).toBe('AUTH_SERVICE_UNAVAILABLE');
    expect(normalizeAuthError({ message: 'session expired' }).code).toBe('SESSION_EXPIRED');
    expect(normalizeAuthError({ message: 'unknown' }).code).toBe('UNKNOWN_AUTH_ERROR');
  });
});
