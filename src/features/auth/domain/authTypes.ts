export type AuthenticatedUser = {
  id: string;
  email: string;
  displayName: string | null;
  emailVerified: boolean;
};

export type AuthSession =
  | { status: 'authenticated'; user: AuthenticatedUser }
  | { status: 'unauthenticated'; user: null };

export type RegistrationResult =
  | { status: 'verification-required'; email: string }
  | { status: 'registered'; email: string };

export type AuthResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: import('./authErrors').AuthError };
