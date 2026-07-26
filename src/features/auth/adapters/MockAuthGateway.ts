import { unavailableAuthError } from '../domain/authErrors';
import type { AuthGateway } from '../ports/AuthGateway';
import type { AuthResult, AuthSession, AuthenticatedUser, RegistrationResult } from '../domain/authTypes';

const unavailable = <T>(): AuthResult<T> => ({ ok: false, error: unavailableAuthError() });

export class MockAuthGateway implements AuthGateway {
  public restoreSession(): Promise<AuthResult<AuthSession>> {
    return Promise.resolve({ ok: true, value: { status: 'unauthenticated', user: null } });
  }

  public loginWithEmailPassword(_email: string, _password: string): Promise<AuthResult<AuthenticatedUser>> {
    return Promise.resolve(unavailable());
  }

  public registerWithEmailPassword(_email: string, _password: string): Promise<AuthResult<RegistrationResult>> {
    return Promise.resolve(unavailable());
  }

  public verifyEmailOtp(_email: string, _otpCode: string): Promise<AuthResult<{ status: 'verified' }>> {
    return Promise.resolve(unavailable());
  }

  public resendVerificationOtp(_email: string): Promise<AuthResult<{ status: 'sent' }>> {
    return Promise.resolve(unavailable());
  }

  public logout(): Promise<AuthResult<void>> {
    return Promise.resolve({ ok: true, value: undefined });
  }
}
