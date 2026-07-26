export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_ALREADY_REGISTERED'
  | 'EMAIL_VERIFICATION_REQUIRED'
  | 'INVALID_OTP'
  | 'EXPIRED_OTP'
  | 'RATE_LIMITED'
  | 'NETWORK_ERROR'
  | 'AUTH_SERVICE_UNAVAILABLE'
  | 'SESSION_EXPIRED'
  | 'GOOGLE_AUTH_CANCELLED'
  | 'GOOGLE_AUTH_FAILED'
  | 'AUTH_UNAVAILABLE'
  | 'HOSTED_SITE_REQUIRED'
  | 'UNKNOWN_AUTH_ERROR';

export type AuthError = {
  code: AuthErrorCode;
  retryable: boolean;
};

type ErrorDetails = {
  message?: string;
  status?: number;
  code?: string;
};

const getErrorDetails = (error: unknown): ErrorDetails => {
  if (typeof error !== 'object' || error === null) return {};

  const candidate = error as { message?: unknown; status?: unknown; code?: unknown; response?: { status?: unknown } };
  return {
    message: typeof candidate.message === 'string' ? candidate.message.toLowerCase() : undefined,
    status: typeof candidate.status === 'number'
      ? candidate.status
      : typeof candidate.response?.status === 'number' ? candidate.response.status : undefined,
    code: typeof candidate.code === 'string' ? candidate.code.toLowerCase() : undefined,
  };
};

export function normalizeAuthError(error: unknown, fallback: AuthErrorCode = 'UNKNOWN_AUTH_ERROR'): AuthError {
  const details = getErrorDetails(error);
  const text = `${details.code ?? ''} ${details.message ?? ''}`;

  if (/session expired|expired session/.test(text)) {
    return { code: 'SESSION_EXPIRED', retryable: false };
  }
  if (/cancel|cancelled|canceled|user denied/.test(text)) {
    return { code: 'GOOGLE_AUTH_CANCELLED', retryable: false };
  }
  if (/google|oauth|provider/.test(text)) {
    return { code: 'GOOGLE_AUTH_FAILED', retryable: true };
  }
  if (details.status === 401 || /invalid credential|invalid password|incorrect password|unauthorized/.test(text)) {
    return { code: 'INVALID_CREDENTIALS', retryable: false };
  }
  if (/already registered|already exists|duplicate|email.*taken/.test(text)) {
    return { code: 'EMAIL_ALREADY_REGISTERED', retryable: false };
  }
  if (/verification required|verify.*email|email.*verified/.test(text)) {
    return { code: 'EMAIL_VERIFICATION_REQUIRED', retryable: false };
  }
  if (/rate limit|too many|429/.test(text) || details.status === 429) {
    return { code: 'RATE_LIMITED', retryable: true };
  }
  if (/expired.*otp|otp.*expired/.test(text)) {
    return { code: 'EXPIRED_OTP', retryable: false };
  }
  if (/invalid.*otp|otp.*invalid|wrong.*code/.test(text)) {
    return { code: 'INVALID_OTP', retryable: false };
  }
  if (details.status !== undefined && details.status >= 500) {
    return { code: 'AUTH_SERVICE_UNAVAILABLE', retryable: true };
  }
  if (/network|timeout|fetch failed|failed to fetch|connection/.test(text)) {
    return { code: 'NETWORK_ERROR', retryable: true };
  }

  return { code: fallback, retryable: fallback === 'UNKNOWN_AUTH_ERROR' ? true : false };
}

export const unavailableAuthError = (): AuthError => ({
  code: 'AUTH_UNAVAILABLE',
  retryable: false,
});

export const hostedSiteRequiredAuthError = (): AuthError => ({
  code: 'HOSTED_SITE_REQUIRED',
  retryable: false,
});
