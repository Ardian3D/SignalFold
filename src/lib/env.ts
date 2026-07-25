import { z } from 'zod';

export type DataMode = 'mock' | 'base44';

const envSchema = z.object({
  VITE_APP_NAME: z.string().trim().min(1).default('SignalFold'),
});

const trimToUndefined = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const parseBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return false;
  return value.trim().toLowerCase() === 'true';
};

const parseDataMode = (value: unknown): DataMode => {
  return typeof value === 'string' && value.trim().toLowerCase() === 'base44' ? 'base44' : 'mock';
};

/**
 * Validates and parses environment variables.
 * Falls back to safe default development values if variables are missing.
 */
export function parseEnv() {
  const rawEnv = {
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  };

  const parsed = envSchema.safeParse(rawEnv);

  return {
    VITE_APP_NAME: parsed.success ? parsed.data.VITE_APP_NAME : 'SignalFold',
    VITE_DATA_MODE: parseDataMode(import.meta.env.VITE_DATA_MODE),
    VITE_BASE44_APP_ID: trimToUndefined(import.meta.env.VITE_BASE44_APP_ID),
    VITE_BASE44_USE_LOCAL_DEV: parseBoolean(import.meta.env.VITE_BASE44_USE_LOCAL_DEV),
    VITE_BASE44_LOCAL_SERVER_URL: trimToUndefined(import.meta.env.VITE_BASE44_LOCAL_SERVER_URL),
    MODE: trimToUndefined(import.meta.env.MODE) ?? 'development',
    DEV: Boolean(import.meta.env.DEV),
    PROD: Boolean(import.meta.env.PROD),
  };
}

export const env = parseEnv();
