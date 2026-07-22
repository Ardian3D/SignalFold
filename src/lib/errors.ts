/**
 * Standardized application error class.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'UNKNOWN_ERROR',
    public readonly statusCode: number = 500,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Result pattern type for safe error handling across repository and domain boundaries.
 */
export type Result<T, E = AppError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const Result = {
  ok: <T>(value: T): Result<T, never> => ({ ok: true, value }),
  fail: <E = AppError>(error: E): Result<never, E> => ({ ok: false, error }),
};
