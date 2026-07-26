import type { AuthModule, User as Base44User } from '@base44/sdk';

import { getBase44Client } from '@/integrations/base44/client';
import type { Base44RuntimeConfig } from '@/integrations/base44/config';

import { hostedSiteRequiredAuthError, normalizeAuthError, unavailableAuthError } from '../domain/authErrors';
import type { AuthGateway } from '../ports/AuthGateway';
import type { AuthResult, AuthSession, AuthenticatedUser, RegistrationResult } from '../domain/authTypes';
import { projectBase44User } from '../domain/userProjection';
import { getSafeReturnPath } from '../routing/returnPath';
import { getRedirectAuthRuntime, type RedirectAuthRuntime } from '../runtime/redirectAuthRuntime';

const success = <T>(value: T): AuthResult<T> => ({ ok: true, value });
const failure = <T>(): AuthResult<T> => ({ ok: false, error: unavailableAuthError() });

export const mapBase44User = (user: Base44User): AuthenticatedUser => projectBase44User(user);

const getAuthModule = (config: Base44RuntimeConfig): AuthResult<AuthModule> => {
  const client = getBase44Client(config);
  return client === null ? failure() : success(client.auth);
};

export class Base44AuthGateway implements AuthGateway {
  public constructor(
    private readonly config: Base44RuntimeConfig,
    private readonly redirectRuntime: RedirectAuthRuntime = getRedirectAuthRuntime(),
  ) {}

  public async restoreSession(): Promise<AuthResult<AuthSession>> {
    const auth = getAuthModule(this.config);
    if (!auth.ok) return auth;

    try {
      const authenticated = await auth.value.isAuthenticated();
      if (!authenticated) return success({ status: 'unauthenticated', user: null });
      const user = await auth.value.me();
      return success({ status: 'authenticated', user: mapBase44User(user) });
    } catch (error) {
      const normalized = normalizeAuthError(error);
      if (normalized.code === 'INVALID_CREDENTIALS' || normalized.code === 'SESSION_EXPIRED') {
        return success({ status: 'unauthenticated', user: null });
      }
      return { ok: false, error: normalized };
    }
  }

  public async loginWithEmailPassword(email: string, password: string): Promise<AuthResult<AuthenticatedUser>> {
    const auth = getAuthModule(this.config);
    if (!auth.ok) return auth;

    try {
      const response = await auth.value.loginViaEmailPassword(email.trim(), password);
      return success(mapBase44User(response.user));
    } catch (error) {
      return { ok: false, error: normalizeAuthError(error) };
    }
  }

  public async registerWithEmailPassword(email: string, password: string): Promise<AuthResult<RegistrationResult>> {
    const auth = getAuthModule(this.config);
    if (!auth.ok) return auth;

    try {
      await auth.value.register({ email: email.trim(), password });
      return success({ status: 'verification-required', email: email.trim() });
    } catch (error) {
      return { ok: false, error: normalizeAuthError(error) };
    }
  }

  public async loginWithGoogle(returnPath: string): Promise<AuthResult<void>> {
    if (!this.redirectRuntime.supportsHostedRedirectAuth) {
      return { ok: false, error: hostedSiteRequiredAuthError() };
    }
    const auth = getAuthModule(this.config);
    if (!auth.ok) return auth;

    try {
      auth.value.loginWithProvider('google', getSafeReturnPath(returnPath));
      return success(undefined);
    } catch (error) {
      return { ok: false, error: normalizeAuthError(error) };
    }
  }

  public async verifyEmailOtp(email: string, otpCode: string): Promise<AuthResult<{ status: 'verified' }>> {
    const auth = getAuthModule(this.config);
    if (!auth.ok) return auth;

    try {
      await auth.value.verifyOtp({ email: email.trim(), otpCode });
      return success({ status: 'verified' });
    } catch (error) {
      return { ok: false, error: normalizeAuthError(error) };
    }
  }

  public async resendVerificationOtp(email: string): Promise<AuthResult<{ status: 'sent' }>> {
    const auth = getAuthModule(this.config);
    if (!auth.ok) return auth;

    try {
      await auth.value.resendOtp(email.trim());
      return success({ status: 'sent' });
    } catch (error) {
      return { ok: false, error: normalizeAuthError(error) };
    }
  }

  public async logout(): Promise<AuthResult<void>> {
    if (!this.redirectRuntime.supportsHostedRedirectAuth) {
      return { ok: false, error: hostedSiteRequiredAuthError() };
    }
    const auth = getAuthModule(this.config);
    if (!auth.ok) return auth;

    try {
      auth.value.logout('/login');
      return success(undefined);
    } catch (error) {
      return { ok: false, error: normalizeAuthError(error) };
    }
  }
}
