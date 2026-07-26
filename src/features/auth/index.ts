export { Base44AuthGateway, mapBase44User } from './adapters/Base44AuthGateway';
export { MockAuthGateway } from './adapters/MockAuthGateway';
export { getAuthGateway } from './authGateway';
export { normalizeAuthError, unavailableAuthError, type AuthError, type AuthErrorCode } from './domain/authErrors';
export type { AuthResult, AuthSession, AuthenticatedUser, RegistrationResult } from './domain/authTypes';
export type { AuthGateway } from './ports/AuthGateway';
export {
  applyLogout,
  applySessionResult,
  beginSessionRestore,
  initialSessionState,
  type SessionState,
} from './session/authSessionMachine';
