import { createClient, type Base44Client } from '@base44/sdk';

import { getBase44RuntimeConfig, type Base44RuntimeConfig } from './config';

let cachedClient: Base44Client | null = null;

const HOSTED_BASE44_URL = 'https://base44.app';

export function getBase44Client(config: Base44RuntimeConfig = getBase44RuntimeConfig()): Base44Client | null {
  if (!config.isConfigured || config.appId === null) return null;
  if (cachedClient !== null) return cachedClient;

  cachedClient = createClient({
    appId: config.appId,
    appBaseUrl: config.localServerUrl ?? HOSTED_BASE44_URL,
    ...(config.localServerUrl === null ? {} : { serverUrl: config.localServerUrl }),
  });

  return cachedClient;
}

export function resetBase44Client(): void {
  cachedClient = null;
}
