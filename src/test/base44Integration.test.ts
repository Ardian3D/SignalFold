import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getBackendAvailability,
  getBase44RuntimeConfig,
  parseBase44RuntimeConfig,
  type Base44Environment,
} from '@/integrations/base44/config';

const createClientMock = vi.fn(() => ({
  auth: {},
  entities: {},
  functions: {},
  cleanup: vi.fn(),
}));

vi.mock('@base44/sdk', () => ({ createClient: createClientMock }));

const { getBase44Client, resetBase44Client } = await import('@/integrations/base44/client');

const makeEnvironment = (overrides: Base44Environment = {}): Base44Environment => ({
  dataMode: 'mock',
  appId: '',
  useLocalDev: 'false',
  localServerUrl: 'http://localhost:4400',
  ...overrides,
});

describe('Base44 runtime configuration', () => {
  it('keeps automated test runs in mock mode even when local runtime variables exist', () => {
    expect(getBase44RuntimeConfig().dataMode).toBe('mock');
    expect(getBase44RuntimeConfig().isConfigured).toBe(false);
  });

  it('defaults missing values to safe mock mode', () => {
    const config = parseBase44RuntimeConfig({}, { dev: true });
    expect(config).toEqual({
      dataMode: 'mock',
      appId: null,
      useLocalDev: false,
      localServerUrl: null,
      isConfigured: false,
    });
    expect(getBackendAvailability(config)).toBe('MOCK');
  });

  it('recognises explicit mock and base44 modes', () => {
    expect(parseBase44RuntimeConfig(makeEnvironment({ dataMode: ' mock ' }), { dev: true }).dataMode).toBe('mock');
    expect(parseBase44RuntimeConfig(makeEnvironment({ dataMode: ' base44 ' }), { dev: true }).dataMode).toBe('base44');
  });

  it('falls unknown modes back to mock', () => {
    const config = parseBase44RuntimeConfig(makeEnvironment({ dataMode: 'staging' }), { dev: true });
    expect(config.dataMode).toBe('mock');
    expect(getBackendAvailability(config)).toBe('MOCK');
  });

  it('trims IDs and treats empty IDs as unavailable', () => {
    expect(parseBase44RuntimeConfig(makeEnvironment({ dataMode: 'base44', appId: '  app_123  ' }), { dev: true }).appId).toBe('app_123');
    expect(parseBase44RuntimeConfig(makeEnvironment({ dataMode: 'base44', appId: '   ' }), { dev: true }).appId).toBeNull();
  });

  it('reports base44 configuration only when mode and app ID are both valid', () => {
    const missing = parseBase44RuntimeConfig(makeEnvironment({ dataMode: 'base44' }), { dev: true });
    const configured = parseBase44RuntimeConfig(makeEnvironment({ dataMode: 'base44', appId: 'app_123' }), { dev: true });
    expect(missing.isConfigured).toBe(false);
    expect(getBackendAvailability(missing)).toBe('BASE44_NOT_CONFIGURED');
    expect(configured.isConfigured).toBe(true);
    expect(getBackendAvailability(configured)).toBe('BASE44_CONFIGURED');
  });

  it('parses booleans explicitly and rejects invalid values safely', () => {
    expect(parseBase44RuntimeConfig(makeEnvironment({ useLocalDev: ' TRUE ' }), { dev: true }).useLocalDev).toBe(true);
    expect(parseBase44RuntimeConfig(makeEnvironment({ useLocalDev: 'yes' }), { dev: true }).useLocalDev).toBe(false);
    expect(parseBase44RuntimeConfig(makeEnvironment({ useLocalDev: true }), { dev: true }).useLocalDev).toBe(true);
  });

  it('uses the local server URL only in explicit development Base44 mode', () => {
    const base44 = { dataMode: 'base44', appId: 'app_123', useLocalDev: 'true', localServerUrl: ' http://localhost:4400 ' };
    expect(parseBase44RuntimeConfig(makeEnvironment(base44), { dev: true }).localServerUrl).toBe('http://localhost:4400');
    expect(parseBase44RuntimeConfig(makeEnvironment({ ...base44, dataMode: 'mock' }), { dev: true }).localServerUrl).toBeNull();
    expect(parseBase44RuntimeConfig(makeEnvironment({ ...base44, useLocalDev: 'false' }), { dev: true }).localServerUrl).toBeNull();
    expect(parseBase44RuntimeConfig(makeEnvironment(base44), { dev: false }).localServerUrl).toBeNull();
  });

  it('rejects frontend and unsupported local server origins', () => {
    for (const localServerUrl of ['http://localhost:3000', 'https://localhost:4400', 'http://127.0.0.1:4400', 'http://localhost:4400/api']) {
      expect(parseBase44RuntimeConfig(makeEnvironment({ dataMode: 'base44', appId: 'app_123', useLocalDev: 'true', localServerUrl }), { dev: true }).localServerUrl).toBeNull();
    }
  });
});

describe('Base44 lazy client boundary', () => {
  beforeEach(() => {
    resetBase44Client();
    createClientMock.mockClear();
  });

  it('does not create a client in mock mode or without an app ID', () => {
    expect(getBase44Client(parseBase44RuntimeConfig(makeEnvironment(), { dev: true }))).toBeNull();
    expect(getBase44Client(parseBase44RuntimeConfig(makeEnvironment({ dataMode: 'base44' }), { dev: true }))).toBeNull();
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it('does not call createClient merely by importing the module', () => {
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it('creates one lazy client for valid configuration and reuses it', () => {
    const config = parseBase44RuntimeConfig(makeEnvironment({ dataMode: 'base44', appId: 'app_123' }), { dev: true });
    const first = getBase44Client(config);
    const second = getBase44Client(config);
    expect(first).not.toBeNull();
    expect(second).toBe(first);
    expect(createClientMock).toHaveBeenCalledTimes(1);
    expect(createClientMock).toHaveBeenCalledWith({ appId: 'app_123' });
  });

  it('passes the local server URL only for explicit local development', () => {
    const config = parseBase44RuntimeConfig(makeEnvironment({
      dataMode: 'base44',
      appId: 'app_123',
      useLocalDev: 'true',
      localServerUrl: 'http://localhost:4400',
    }), { dev: true });
    getBase44Client(config);
    expect(createClientMock).toHaveBeenCalledWith({ appId: 'app_123', serverUrl: 'http://localhost:4400' });
  });

  it('never overrides the hosted app base URL or uses the frontend origin as the SDK server', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/integrations/base44/client.ts'), 'utf8');
    expect(source).not.toContain('appBaseUrl');
    expect(source).not.toContain('https://base44.app');
    expect(source).not.toContain('localhost:3000');
  });

  it('does not invoke auth, entities, functions, realtime, or network operations', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const config = parseBase44RuntimeConfig(makeEnvironment({ dataMode: 'base44', appId: 'app_123' }), { dev: true });
    const client = getBase44Client(config);
    expect(client).not.toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(createClientMock).toHaveBeenCalledTimes(1);
    fetchSpy.mockRestore();
  });
});
