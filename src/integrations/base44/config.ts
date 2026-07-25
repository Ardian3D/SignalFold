import { env, type DataMode } from '@/lib/env';

export type { DataMode };

export type Base44Environment = {
  dataMode?: unknown;
  appId?: unknown;
  useLocalDev?: unknown;
  localServerUrl?: unknown;
};

export type Base44RuntimeConfig = {
  dataMode: DataMode;
  appId: string | null;
  useLocalDev: boolean;
  localServerUrl: string | null;
  isConfigured: boolean;
};

export type BackendAvailability = 'MOCK' | 'BASE44_CONFIGURED' | 'BASE44_NOT_CONFIGURED';

const trimToNull = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const parseBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return false;
  return value.trim().toLowerCase() === 'true';
};

const parseDataMode = (value: unknown): DataMode => {
  return typeof value === 'string' && value.trim().toLowerCase() === 'base44' ? 'base44' : 'mock';
};

export function parseBase44RuntimeConfig(
  input: Base44Environment,
  runtime: { dev: boolean },
): Base44RuntimeConfig {
  const dataMode = parseDataMode(input.dataMode);
  const appId = trimToNull(input.appId);
  const useLocalDev = parseBoolean(input.useLocalDev);
  const localServerUrl = dataMode === 'base44' && useLocalDev && runtime.dev
    ? trimToNull(input.localServerUrl)
    : null;

  return {
    dataMode,
    appId,
    useLocalDev,
    localServerUrl,
    isConfigured: dataMode === 'base44' && appId !== null,
  };
}

export function getBase44RuntimeConfig(): Base44RuntimeConfig {
  return parseBase44RuntimeConfig(
    {
      dataMode: env.VITE_DATA_MODE,
      appId: env.VITE_BASE44_APP_ID,
      useLocalDev: env.VITE_BASE44_USE_LOCAL_DEV,
      localServerUrl: env.VITE_BASE44_LOCAL_SERVER_URL,
    },
    { dev: env.DEV },
  );
}

export function getBackendAvailability(config = getBase44RuntimeConfig()): BackendAvailability {
  if (config.dataMode === 'mock') return 'MOCK';
  return config.isConfigured ? 'BASE44_CONFIGURED' : 'BASE44_NOT_CONFIGURED';
}
