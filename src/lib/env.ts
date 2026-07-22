import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_NAME: z.string().default('SignalFold'),
  VITE_DATA_MODE: z.enum(['mock', 'base44']).default('mock'),
  MODE: z.string().default('development'),
  DEV: z.boolean().default(true),
  PROD: z.boolean().default(false),
});

/**
 * Validates and parses environment variables.
 * Falls back to safe default development values if variables are missing.
 */
function parseEnv() {
  const rawEnv = {
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_DATA_MODE: import.meta.env.VITE_DATA_MODE,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
  };

  const parsed = envSchema.safeParse(rawEnv);

  if (!parsed.success) {
    console.warn('Environment configuration warning, using fallback defaults:', parsed.error.format());
    return {
      VITE_APP_NAME: 'SignalFold',
      VITE_DATA_MODE: 'mock' as const,
      MODE: import.meta.env.MODE || 'development',
      DEV: import.meta.env.DEV ?? true,
      PROD: import.meta.env.PROD ?? false,
    };
  }

  return parsed.data;
}

export const env = parseEnv();
