import type { AuthError } from '../domain/authErrors';
import type { AuthResult, AuthenticatedUser } from '../domain/authTypes';

export type SessionState =
  | { status: 'UNINITIALIZED'; user: null; error: null }
  | { status: 'RESTORING'; user: null; error: null }
  | { status: 'AUTHENTICATED'; user: AuthenticatedUser; error: null }
  | { status: 'UNAUTHENTICATED'; user: null; error: null }
  | { status: 'UNAVAILABLE'; user: null; error: AuthError }
  | { status: 'ERROR'; user: null; error: AuthError };

export const initialSessionState = (): SessionState => ({
  status: 'UNINITIALIZED',
  user: null,
  error: null,
});

export const beginSessionRestore = (): SessionState => ({
  status: 'RESTORING',
  user: null,
  error: null,
});

export const applySessionResult = (result: AuthResult<{ status: 'authenticated'; user: AuthenticatedUser } | { status: 'unauthenticated'; user: null }>): SessionState => {
  if (!result.ok) {
    return {
      status: result.error.code === 'AUTH_UNAVAILABLE' ? 'UNAVAILABLE' : 'ERROR',
      user: null,
      error: result.error,
    };
  }
  return result.value.status === 'authenticated'
    ? { status: 'AUTHENTICATED', user: result.value.user, error: null }
    : { status: 'UNAUTHENTICATED', user: null, error: null };
};

export const applyLogout = (): SessionState => ({
  status: 'UNAUTHENTICATED',
  user: null,
  error: null,
});
