import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { getBase44RuntimeConfig } from '@/integrations/base44/config';

import { getAuthGateway } from './authGateway';
import type { AuthError } from './domain/authErrors';
import type { AuthResult, AuthSession, AuthenticatedUser, RegistrationResult } from './domain/authTypes';
import { applyLogout, applySessionResult, beginSessionRestore, initialSessionState, type SessionState } from './session/authSessionMachine';
import type { AuthGateway } from './ports/AuthGateway';

type AuthContextValue = {
  state: SessionState;
  user: AuthenticatedUser | null;
  isMockMode: boolean;
  restoreSession: () => Promise<void>;
  loginWithEmailPassword: (email: string, password: string) => Promise<AuthResult<AuthenticatedUser>>;
  registerWithEmailPassword: (email: string, password: string) => Promise<AuthResult<RegistrationResult>>;
  verifyEmailOtp: (email: string, otpCode: string) => Promise<AuthResult<{ status: 'verified' }>>;
  resendVerificationOtp: (email: string) => Promise<AuthResult<{ status: 'sent' }>>;
  loginWithGoogle: (returnPath: string) => Promise<AuthResult<void>>;
  logout: () => Promise<AuthResult<void>>;
  clearError: () => void;
};

const unavailableError: AuthError = { code: 'AUTH_UNAVAILABLE', retryable: false };
const fallbackContext: AuthContextValue = {
  state: { status: 'UNAVAILABLE', user: null, error: unavailableError },
  user: null,
  isMockMode: true,
  restoreSession: async () => undefined,
  loginWithEmailPassword: async () => ({ ok: false, error: unavailableError }),
  registerWithEmailPassword: async () => ({ ok: false, error: unavailableError }),
  verifyEmailOtp: async () => ({ ok: false, error: unavailableError }),
  resendVerificationOtp: async () => ({ ok: false, error: unavailableError }),
  loginWithGoogle: async () => ({ ok: false, error: unavailableError }),
  logout: async () => ({ ok: true, value: undefined }),
  clearError: () => undefined,
};

const AuthContext = createContext<AuthContextValue>(fallbackContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const runtime = useMemo(() => getBase44RuntimeConfig(), []);
  const isMockMode = runtime.dataMode === 'mock' || !runtime.isConfigured;
  const gateway = useMemo<AuthGateway>(() => getAuthGateway(runtime), [runtime]);
  const [state, setState] = useState<SessionState>(() => isMockMode ? applyLogout() : initialSessionState());
  const restorePromise = useRef<Promise<void> | null>(null);
  const restored = useRef(false);
  const mounted = useRef(true);

  const restoreSession = useCallback(async () => {
    if (isMockMode) return;
    if (restorePromise.current) return restorePromise.current;
    if (restored.current) return;
    setState(beginSessionRestore());
    const promise = gateway.restoreSession().then((result) => {
      if (mounted.current) setState(applySessionResult(result));
      restored.current = true;
    }).finally(() => {
      restorePromise.current = null;
    });
    restorePromise.current = promise;
    return promise;
  }, [gateway, isMockMode]);

  useEffect(() => {
    if (isMockMode) return;
    mounted.current = true;
    void restoreSession().catch(() => {
      if (mounted.current) setState({ status: 'ERROR', user: null, error: { code: 'UNKNOWN_AUTH_ERROR', retryable: true } });
    });
    return () => { mounted.current = false; };
  }, [isMockMode, restoreSession]);

  const loginWithEmailPassword = useCallback(async (email: string, password: string) => {
    const result = await gateway.loginWithEmailPassword(email, password);
    if (result.ok) setState({ status: 'AUTHENTICATED', user: result.value, error: null });
    else setState({ status: 'ERROR', user: null, error: result.error });
    return result;
  }, [gateway]);

  const registerWithEmailPassword = useCallback((email: string, password: string) => gateway.registerWithEmailPassword(email, password), [gateway]);
  const verifyEmailOtp = useCallback((email: string, otpCode: string) => gateway.verifyEmailOtp(email, otpCode), [gateway]);
  const resendVerificationOtp = useCallback((email: string) => gateway.resendVerificationOtp(email), [gateway]);
  const loginWithGoogle = useCallback((returnPath: string) => gateway.loginWithGoogle(returnPath), [gateway]);
  const logout = useCallback(async () => {
    const result = await gateway.logout();
    setState(applyLogout());
    return result;
  }, [gateway]);
  const clearError = useCallback(() => setState((current) => current.status === 'ERROR' ? { status: 'UNAUTHENTICATED', user: null, error: null } : current), []);

  const value = useMemo<AuthContextValue>(() => ({
    state,
    user: state.status === 'AUTHENTICATED' ? state.user : null,
    isMockMode,
    restoreSession,
    loginWithEmailPassword,
    registerWithEmailPassword,
    verifyEmailOtp,
    resendVerificationOtp,
    loginWithGoogle,
    logout,
    clearError,
  }), [state, isMockMode, restoreSession, loginWithEmailPassword, registerWithEmailPassword, verifyEmailOtp, resendVerificationOtp, loginWithGoogle, logout, clearError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
