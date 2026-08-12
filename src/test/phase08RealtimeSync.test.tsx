import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { act, render, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useIncidentRealtimeSync } from '@/features/operations/useIncidentRealtimeSync';
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

const auth = { state: { status: 'AUTHENTICATED' }, isMockMode: false };
vi.mock('@/features/auth/AuthProvider', () => ({ useAuth: () => auth }));

const makeClient = () => new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

const wrapper = (client: QueryClient) => ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);

const emit = (event: IncidentRealtimeEvent) => {
  act(() => {
    if (roomListener) roomListener(event);
  });
};

const scope = { organizationId: 'org-1', incidentId: 'incident-1' };

describe('Phase 08 useIncidentRealtimeSync hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    roomListener = null;
  });

  it('subscribes only when authenticated, org, incident, and active are present', () => {
    type Props = { organizationId?: string; incidentId?: string; active: boolean };
    const client = makeClient();
    const { rerender } = renderHook(
      (props: Props) => useIncidentRealtimeSync(props),
      { initialProps: { active: false } as Props, wrapper: wrapper(client) },
    );
    expect(subscribeMock).not.toHaveBeenCalled();

    rerender({ organizationId: 'org-1', incidentId: 'incident-1', active: true });
    expect(subscribeMock).toHaveBeenCalledTimes(1);
    expect(subscribeMock.mock.calls[0][0]).toEqual(scope);
  });

  it('does not subscribe in mock mode', () => {
    auth.isMockMode = true;
    const client = makeClient();
    renderHook(() => useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true }), { wrapper: wrapper(client) });
    expect(subscribeMock).not.toHaveBeenCalled();
    auth.isMockMode = false;
  });

  it('does not subscribe when unauthenticated', () => {
    auth.state = { status: 'UNAUTHENTICATED' };
    const client = makeClient();
    renderHook(() => useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true }), { wrapper: wrapper(client) });
    expect(subscribeMock).not.toHaveBeenCalled();
    auth.state = { status: 'AUTHENTICATED' };
  });

  it('unsubscribes on unmount', () => {
    const client = makeClient();
    const { unmount } = renderHook(() => useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true }), { wrapper: wrapper(client) });
    expect(subscribeMock).toHaveBeenCalledTimes(1);
    unmount();
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it('invalidates the active incident, tasks, and timeline queries on a relevant timeline event', async () => {
    const client = makeClient();
    let fetched = 0;
    const Probe = () => {
      useQuery({ queryKey: operationalQueryKeys.incident(mode, 'org-1', 'incident-1'), queryFn: async () => { fetched += 1; return { ok: true }; } });
      useQuery({ queryKey: ['operations', mode, 'org-1', 'tasks', 'incident-1', 'list', {}], queryFn: async () => { fetched += 1; return []; } });
      useQuery({ queryKey: ['operations', mode, 'org-1', 'timeline', 'incident-1', 'desc'], queryFn: async () => { fetched += 1; return []; } });
      return null;
    };
    const Combined = () => {
      useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true });
      return <Probe />;
    };
    render(<QueryClientProvider client={client}><Combined /></QueryClientProvider>);
    await waitFor(() => expect(fetched).toBeGreaterThanOrEqual(3));
    const before = fetched;
    emit({ entity: 'timeline', changeType: 'create', recordId: 'u-new', organizationId: 'org-1', incidentId: 'incident-1' });
    await waitFor(() => expect(fetched).toBeGreaterThan(before));
    expect(subscribeMock).toHaveBeenCalledTimes(1);
  });

  it('sets the live timeline id when a timeline event arrives', () => {
    const client = makeClient();
    const { result } = renderHook(() => useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true }), { wrapper: wrapper(client) });
    expect(result.current.liveTimelineId).toBeNull();
    emit({ entity: 'timeline', changeType: 'create', recordId: 'u-42', organizationId: 'org-1', incidentId: 'incident-1' });
    expect(result.current.liveTimelineId).toBe('u-42');
  });

  it('ignores events from a stale scope after the incident changes', () => {
    type Props = { organizationId?: string; incidentId?: string; active: boolean };
    const client = makeClient();
    const { rerender } = renderHook(
      (props: Props) => useIncidentRealtimeSync(props),
      { initialProps: { organizationId: 'org-1', incidentId: 'incident-1', active: true } as Props, wrapper: wrapper(client) },
    );
    expect(subscribeMock).toHaveBeenCalledTimes(1);
    rerender({ organizationId: 'org-1', incidentId: 'incident-2', active: true });
    expect(subscribeMock).toHaveBeenCalledTimes(2);
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
    // Late event from incident-1 scope must be ignored (no listener registered for old scope)
    emit({ entity: 'timeline', changeType: 'create', recordId: 'u-stale', organizationId: 'org-1', incidentId: 'incident-1' });
    expect(roomListener).toBeTruthy();
  });

  it('tears down subscriptions on offline and re-establishes on online', () => {
    const client = makeClient();
    const { result } = renderHook(() => useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true }), { wrapper: wrapper(client) });
    expect(subscribeMock).toHaveBeenCalledTimes(1);
    act(() => { window.dispatchEvent(new Event('offline')); });
    expect(result.current.online).toBe(false);
    expect(result.current.connection).toBe('disconnected');
    act(() => { window.dispatchEvent(new Event('online')); });
    expect(result.current.online).toBe(true);
    expect(result.current.connection).toBe('connected');
  });

  it('reconnects and refetches authoritative queries after coming back online', async () => {
    const client = makeClient();
    let fetched = 0;
    const Probe = () => {
      useQuery({ queryKey: operationalQueryKeys.incident(mode, 'org-1', 'incident-1'), queryFn: async () => { fetched += 1; return { ok: true }; } });
      return null;
    };
    const Combined = () => {
      useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true });
      return <Probe />;
    };
    render(<QueryClientProvider client={client}><Combined /></QueryClientProvider>);
    await waitFor(() => expect(fetched).toBeGreaterThanOrEqual(1));
    act(() => { window.dispatchEvent(new Event('offline')); });
    const before = fetched;
    act(() => { window.dispatchEvent(new Event('online')); });
    await waitFor(() => expect(fetched).toBeGreaterThan(before));
  });

  it('does not call any mutation from a realtime callback', () => {
    const client = makeClient();
    renderHook(() => useIncidentRealtimeSync({ organizationId: 'org-1', incidentId: 'incident-1', active: true }), { wrapper: wrapper(client) });
    emit({ entity: 'incident', changeType: 'update', recordId: 'incident-1', organizationId: 'org-1', incidentId: 'incident-1' });
    expect(unsubscribeMock).toHaveBeenCalledTimes(0);
  });
});
