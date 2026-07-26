import type { AuthResult, AuthSession, AuthenticatedUser, RegistrationResult } from '../domain/authTypes';

export type AuthGateway = {
  restoreSession(): Promise<AuthResult<AuthSession>>;
  loginWithEmailPassword(email: string, password: string): Promise<AuthResult<AuthenticatedUser>>;
  loginWithGoogle(returnPath: string): Promise<AuthResult<void>>;
  registerWithEmailPassword(email: string, password: string): Promise<AuthResult<RegistrationResult>>;
  verifyEmailOtp(email: string, otpCode: string): Promise<AuthResult<{ status: 'verified' }>>;
  resendVerificationOtp(email: string): Promise<AuthResult<{ status: 'sent' }>>;
  logout(): Promise<AuthResult<void>>;
};
