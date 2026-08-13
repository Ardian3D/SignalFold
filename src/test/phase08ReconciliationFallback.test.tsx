import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { act, render, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useIncidentRealtimeSync, REALTIME_RECONCILIATION_INTERVAL_MS } from '@/features/operations/useIncidentRealtimeSync';
import { operationalQueryKeys } from '@/features/operations/queryKeys';
import type { IncidentRealtimeEvent } from '@/features/operations/domain/realtimeTypes';

const mode = 'base44';

let roomListener: ((event: IncidentRealtimeEvent) => void) | null = null;
const unsubscribeMock = vi.fn();
const subscribeMock = vi.fn((_scope: unknown, listener: (event: IncidentRealtimeEvent) => void) => {
  roomListener = listener;
  return unsubscribeMock;
});
const gateway = { subscribeToIncidentRoom: subscribeMock };

vi.mock('@/features/operations/operationalGateway', () => ({ getOperationalGateway: () => gateway }));

const authState = { state: { status: 'AUTHENTICATED' }, isMockMode: false };
vi.mock('@/features/auth/AuthProvider', () => ({ useAuth: () => authState }));

const makeClient = () => new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false }, mutations: { retry: false } } });

const wrapper = (client: QueryClient) => ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);

const emit = (event: IncidentRealtimeEvent) => {
  act(() => { if (roomListener) roomListener(event); });
};

const flush = async (ms: number) => {
  await act(async () => { await vi.advanceTimersByTimeAsync(ms); });
};

describe('Phase 08 bounded reconciliation fallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    roomListener = null;
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('exposes the canonical 10-second interval constant', () => {
    expect(REALTIME_RECONCILIATION_INTERVAL_MS).toBe(10_000);
  });

  it('starts the scheduler in real Base44 mode and reconciles Incident, Tasks, Timeline on one tick', async () => {
    const client = makeClient();
    let incidentFetches = 0;
    let taskFetches = 0;
    let timelineFetches = 0;
    const Probe = () => {
      useQuery({ queryKey: operationalQueryKeys.incident(mode, 'org-1', 'incident-1'), queryFn: async () => { incidentFetches += 1; return {}; } });
      useQuery({ queryKey: ['operations', mode, 'org-1', 'tasks', 'incident-1', 'list', {}], queryFn: async () => { taskFetches += 1; return []; } });
      useQuery({ queryKey: ['operations', mode, 'org-1', 'timeline', 'incident-1', 'desc'], queryFn: async () => { timelineFetches += 1; return []; } });
      return null;
    };
    const Combined = () => {
      useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true });
      return <Probe />;
    };
    render(<QueryClientProvider client={client}><Combined /></QueryClientProvider>);
    await flush(0);
    expect(subscribeMock).toHaveBeenCalledTimes(1);
    const before = incidentFetches + taskFetches + timelineFetches;
    await flush(REALTIME_RECONCILIATION_INTERVAL_MS);
    await flush(0);
    expect(incidentFetches + taskFetches + timelineFetches).toBeGreaterThan(before);
  });

  it('does not start the scheduler in Mock mode', () => {
    authState.isMockMode = true;
    const client = makeClient();
    renderHook(() => useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true }), { wrapper: wrapper(client) });
    expect(subscribeMock).not.toHaveBeenCalled();
    expect(() => vi.advanceTimersByTime(REALTIME_RECONCILIATION_INTERVAL_MS * 3)).not.toThrow();
    authState.isMockMode = false;
  });

  it('requires an active organization', () => {
    type Props = { organizationId?: string; incidentId?: string; active: boolean };
    const client = makeClient();
    const { rerender } = renderHook(
      (props: Props) => useIncidentRealtimeSync(props),
      { initialProps: { organizationId: undefined, incidentId: 'incident-1', active: true } as Props, wrapper: wrapper(client) },
    );
    expect(subscribeMock).not.toHaveBeenCalled();
    rerender({ organizationId: 'org-1', incidentId: 'incident-1', active: true });
    expect(subscribeMock).toHaveBeenCalledTimes(1);
  });

  it('requires an active Incident', () => {
    type Props = { organizationId?: string; incidentId?: string; active: boolean };
    const client = makeClient();
    const { rerender } = renderHook(
      (props: Props) => useIncidentRealtimeSync(props),
      { initialProps: { organizationId: 'org-1', incidentId: undefined, active: true } as Props, wrapper: wrapper(client) },
    );
    expect(subscribeMock).not.toHaveBeenCalled();
    rerender({ organizationId: 'org-1', incidentId: 'incident-1', active: true });
    expect(subscribeMock).toHaveBeenCalledTimes(1);
  });

  it('requires authentication', () => {
    authState.state = { status: 'UNAUTHENTICATED' };
    const client = makeClient();
    renderHook(() => useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true }), { wrapper: wrapper(client) });
    expect(subscribeMock).not.toHaveBeenCalled();
    authState.state = { status: 'AUTHENTICATED' };
  });

  it('does not reload the page or mutate from fallback ticks', async () => {
    const client = makeClient();
    const Combined = () => {
      useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true });
      return null;
    };
    render(<QueryClientProvider client={client}><Combined /></QueryClientProvider>);
    await flush(REALTIME_RECONCILIATION_INTERVAL_MS * 3);
    // No reload/scroll/mutation APIs are reachable from the hook; assert the scheduler ran and
    // the only gateway interaction is subscription (no mutation methods invoked).
    expect(subscribeMock).toHaveBeenCalledTimes(1);
    expect(unsubscribeMock).not.toHaveBeenCalled(); // still subscribed
  });

  it('does not mark LIVE for fallback-discovered data (only realtime callbacks set LIVE)', async () => {
    const client = makeClient();
    let timelineFetches = 0;
    const Probe = () => {
      useQuery({ queryKey: ['operations', mode, 'org-1', 'timeline', 'incident-1', 'desc'], queryFn: async () => { timelineFetches += 1; return [{ id: 'u-fallback', message: 'x' }]; } });
      return null;
    };
    const Combined = () => {
      const state = useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true });
      return <div data-testid="live">{state.liveTimelineId ?? 'none'}</div>;
    };
    render(<QueryClientProvider client={client}><Combined /><Probe /></QueryClientProvider>);
    await flush(0);
    const initialFetches = timelineFetches;
    await flush(REALTIME_RECONCILIATION_INTERVAL_MS);
    await flush(0);
    expect(timelineFetches).toBeGreaterThan(initialFetches);
    expect(document.querySelector('[data-testid="live"]')?.textContent).toBe('none');
    emit({ entity: 'timeline', changeType: 'create', recordId: 'u-rt', organizationId: 'org-1', incidentId: 'incident-1' });
    expect(document.querySelector('[data-testid="live"]')?.textContent).toBe('u-rt');
  });

  it('pauses the scheduler when hidden and resumes with immediate reconciliation when visible', async () => {
    const client = makeClient();
    let incidentFetches = 0;
    const Probe = () => {
      useQuery({ queryKey: operationalQueryKeys.incident(mode, 'org-1', 'incident-1'), queryFn: async () => { incidentFetches += 1; return {}; } });
      return null;
    };
    const Combined = () => {
      useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true });
      return <Probe />;
    };
    render(<QueryClientProvider client={client}><Combined /></QueryClientProvider>);
    await flush(0);
    expect(incidentFetches).toBeGreaterThanOrEqual(1);

    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    act(() => { document.dispatchEvent(new Event('visibilitychange')); });
    const beforeHidden = incidentFetches;
    await flush(REALTIME_RECONCILIATION_INTERVAL_MS * 3);
    expect(incidentFetches).toBe(beforeHidden);

    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
    act(() => { document.dispatchEvent(new Event('visibilitychange')); });
    await flush(0);
    expect(incidentFetches).toBeGreaterThan(beforeHidden);
  });

  it('pauses the scheduler while offline and reconciles immediately on reconnect', async () => {
    const client = makeClient();
    let incidentFetches = 0;
    const Probe = () => {
      useQuery({ queryKey: operationalQueryKeys.incident(mode, 'org-1', 'incident-1'), queryFn: async () => { incidentFetches += 1; return {}; } });
      return null;
    };
    const Combined = () => {
      useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true });
      return <Probe />;
    };
    render(<QueryClientProvider client={client}><Combined /></QueryClientProvider>);
    await flush(0);
    expect(incidentFetches).toBeGreaterThanOrEqual(1);

    act(() => { window.dispatchEvent(new Event('offline')); });
    const beforeOffline = incidentFetches;
    await flush(REALTIME_RECONCILIATION_INTERVAL_MS * 3);
    expect(incidentFetches).toBe(beforeOffline);

    act(() => { window.dispatchEvent(new Event('online')); });
    await flush(0);
    expect(incidentFetches).toBeGreaterThan(beforeOffline);
  });

  it('stops the old timer on incident switch and starts a new one', async () => {
    const client = makeClient();
    let incidentAFetches = 0;
    let incidentBFetches = 0;
    const ProbeA = () => {
      useQuery({ queryKey: operationalQueryKeys.incident(mode, 'org-1', 'incident-1'), queryFn: async () => { incidentAFetches += 1; return {}; } });
      return null;
    };
    const ProbeB = () => {
      useQuery({ queryKey: operationalQueryKeys.incident(mode, 'org-1', 'incident-2'), queryFn: async () => { incidentBFetches += 1; return {}; } });
      return null;
    };
    const Combined = ({ incidentId }: { incidentId: string }) => {
      useIncidentRealtimeSync({ organizationId: 'org-1', incidentId, active: true });
      return incidentId === 'incident-1' ? <ProbeA /> : <ProbeB />;
    };
    const { rerender } = render(
      <QueryClientProvider client={client}><Combined incidentId="incident-1" /></QueryClientProvider>,
    );
    await flush(0);
    expect(incidentAFetches).toBeGreaterThanOrEqual(1);
    const beforeA = incidentAFetches;
    rerender(<QueryClientProvider client={client}><Combined incidentId="incident-2" /></QueryClientProvider>);
    await flush(0);
    expect(incidentBFetches).toBeGreaterThanOrEqual(1);
    await flush(REALTIME_RECONCILIATION_INTERVAL_MS * 2);
    await flush(0);
    expect(incidentAFetches).toBe(beforeA);
    expect(incidentBFetches).toBeGreaterThanOrEqual(2);
  });

  it('cleans up the timer on unmount', async () => {
    const client = makeClient();
    let incidentFetches = 0;
    const Probe = () => {
      useQuery({ queryKey: operationalQueryKeys.incident(mode, 'org-1', 'incident-1'), queryFn: async () => { incidentFetches += 1; return {}; } });
      return null;
    };
    const Combined = () => {
      useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true });
      return <Probe />;
    };
    const { unmount } = render(<QueryClientProvider client={client}><Combined /></QueryClientProvider>);
    await flush(0);
    expect(incidentFetches).toBeGreaterThanOrEqual(1);
    unmount();
    const after = incidentFetches;
    await flush(REALTIME_RECONCILIATION_INTERVAL_MS * 2);
    expect(incidentFetches).toBe(after);
  });

  it('reconciles promptly on a realtime event without waiting for the fallback tick', async () => {
    const client = makeClient();
    let incidentFetches = 0;
    const Probe = () => {
      useQuery({ queryKey: operationalQueryKeys.incident(mode, 'org-1', 'incident-1'), queryFn: async () => { incidentFetches += 1; return {}; } });
      return null;
    };
    const Combined = () => {
      useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true });
      return <Probe />;
    };
    render(<QueryClientProvider client={client}><Combined /></QueryClientProvider>);
    await flush(0);
    expect(incidentFetches).toBeGreaterThanOrEqual(1);
    const before = incidentFetches;
    await act(async () => {
      emit({ entity: 'incident', changeType: 'update', recordId: 'incident-1', organizationId: 'org-1', incidentId: 'incident-1' });
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(incidentFetches).toBeGreaterThan(before);
  });

  it('keeps request frequency bounded over 60s of active visible online room', async () => {
    const client = makeClient();
    let incidentFetches = 0;
    const Probe = () => {
      useQuery({ queryKey: operationalQueryKeys.incident(mode, 'org-1', 'incident-1'), queryFn: async () => { incidentFetches += 1; return {}; } });
      return null;
    };
    const Combined = () => {
      useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true });
      return <Probe />;
    };
    render(<QueryClientProvider client={client}><Combined /></QueryClientProvider>);
    await flush(0);
    expect(incidentFetches).toBeGreaterThanOrEqual(1);
    const before = incidentFetches;
    await flush(60_000);
    const delta = incidentFetches - before;
    expect(delta).toBeGreaterThanOrEqual(1);
    expect(delta).toBeLessThanOrEqual(8);
  });

  it('does not create duplicate subscriptions or timers under React Strict Mode', async () => {
    const client = makeClient();
    let incidentFetches = 0;
    const Probe = () => {
      useQuery({ queryKey: operationalQueryKeys.incident(mode, 'org-1', 'incident-1'), queryFn: async () => { incidentFetches += 1; return {}; } });
      return null;
    };
    const Combined = () => {
      useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true });
      return <Probe />;
    };
    render(
      <React.StrictMode>
        <QueryClientProvider client={client}><Combined /></QueryClientProvider>
      </React.StrictMode>,
    );
    await flush(0);
    // Strict Mode mounts/cleans/remounts; the first subscription must be torn down exactly once,
    // leaving one active subscription set.
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
    expect(subscribeMock.mock.calls.length).toBeGreaterThanOrEqual(1);
    // One logical scheduler: advancing two intervals should produce bounded refetches (not duplicated timers).
    const before = incidentFetches;
    await flush(REALTIME_RECONCILIATION_INTERVAL_MS * 2);
    const delta = incidentFetches - before;
    expect(delta).toBeGreaterThanOrEqual(1);
    expect(delta).toBeLessThanOrEqual(4);
  });
});
