import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/AuthProvider';
import type { IncidentRealtimeEvent, RealtimeConnectionState } from './domain/realtimeTypes';
import { getOperationalGateway } from './operationalGateway';
import { operationalQueryKeys } from './queryKeys';
import { taskQueryKeys } from '@/features/tasks/queryKeys';
import { timelineQueryKeys } from '@/features/timeline/queryKeys';

const mode = 'base44';

/**
 * Owner-approved bounded reconciliation fallback interval (single source of truth).
 * Base44 realtime subscriptions remain the primary transport; this low-frequency
 * authoritative reconciliation safety net exists because hosted Base44 realtime
 * entity events were not observed for service-role backend-function writes in the
 * current environment. It performs reads only, while an authenticated active Incident
 * Room is online and document-visible, and never marks data as LIVE.
 */
export const REALTIME_RECONCILIATION_INTERVAL_MS = 10_000;

export type RealtimeSyncState = {
  connection: RealtimeConnectionState;
  liveTimelineId: string | null;
  online: boolean;
};

export function useIncidentRealtimeSync(params: {
  organizationId?: string;
  incidentId?: string;
  active: boolean;
}): RealtimeSyncState {
  const { organizationId, incidentId, active } = params;
  const auth = useAuth();
  const queryClient = useQueryClient();
  const gatewayRef = useRef(getOperationalGateway());
  const [connection, setConnection] = useState<RealtimeConnectionState>('connecting');
  const [online, setOnline] = useState<boolean>(typeof navigator === 'undefined' ? true : navigator.onLine);
  const [visible, setVisible] = useState<boolean>(typeof document === 'undefined' ? true : document.visibilityState !== 'hidden');
  const [liveTimelineId, setLiveTimelineId] = useState<string | null>(null);
  const scopeRef = useRef<{ organizationId?: string; incidentId?: string; active: boolean }>({ organizationId: undefined, incidentId: undefined, active: false });
  const generationRef = useRef(0);
  const coalesceRef = useRef<{ timer: ReturnType<typeof setTimeout> | null; invalidated: boolean }>({ timer: null, invalidated: false });
  const reconcileRef = useRef<{ timer: ReturnType<typeof setInterval> | null; running: boolean }>({ timer: null, running: false });

  const canSubscribe = active && Boolean(organizationId) && Boolean(incidentId) && online && !auth.isMockMode && auth.state.status === 'AUTHENTICATED';

  const applyCoalescedInvalidation = useCallback(() => {
    if (!scopeRef.current.organizationId || !scopeRef.current.incidentId) return;
    const currentOrg = scopeRef.current.organizationId;
    const currentIncident = scopeRef.current.incidentId;
    coalesceRef.current.invalidated = true;
    void queryClient.invalidateQueries({ queryKey: operationalQueryKeys.incident(mode, currentOrg, currentIncident) });
    void queryClient.invalidateQueries({ queryKey: taskQueryKeys.list(mode, currentOrg, currentIncident, {}) });
    void queryClient.invalidateQueries({ queryKey: timelineQueryKeys.list(mode, currentOrg, currentIncident, 'desc') });
    void queryClient.invalidateQueries({ queryKey: timelineQueryKeys.list(mode, currentOrg, currentIncident, 'asc') });
  }, [queryClient]);

  const scheduleInvalidation = useCallback((organizationId: string, incidentId: string, event: IncidentRealtimeEvent) => {
    if (scopeRef.current.organizationId !== organizationId || scopeRef.current.incidentId !== incidentId) return;
    if (event.entity === 'timeline') {
      setLiveTimelineId(event.recordId);
    }
    if (coalesceRef.current.timer) clearTimeout(coalesceRef.current.timer);
    coalesceRef.current.timer = setTimeout(() => {
      coalesceRef.current.timer = null;
      applyCoalescedInvalidation();
    }, 50);
  }, [applyCoalescedInvalidation]);

  const establish = useCallback(() => {
    const generation = generationRef.current + 1;
    generationRef.current = generation;
    const scope = scopeRef.current;
    if (!scope.organizationId || !scope.incidentId || !canSubscribe) return () => undefined;
    setConnection('connecting');
    let cleanup: (() => void) | null = null;
    try {
      cleanup = gatewayRef.current.subscribeToIncidentRoom(
        { organizationId: scope.organizationId, incidentId: scope.incidentId },
        (event: IncidentRealtimeEvent) => {
          if (generationRef.current !== generation) return;
          if (!scopeRef.current.organizationId || !scopeRef.current.incidentId) return;
          scheduleInvalidation(scopeRef.current.organizationId, scopeRef.current.incidentId, event);
        },
      );
      setConnection('connected');
    } catch {
      setConnection('disconnected');
    }
    return () => {
      if (cleanup) {
        try { cleanup(); } catch { /* ignore */ }
      }
    };
  }, [canSubscribe, scheduleInvalidation]);

  const refreshAuthoritative = useCallback(() => {
    const org = scopeRef.current.organizationId;
    const incident = scopeRef.current.incidentId;
    if (org && incident) {
      void queryClient.invalidateQueries({ queryKey: operationalQueryKeys.incident(mode, org, incident) });
      void queryClient.invalidateQueries({ queryKey: taskQueryKeys.list(mode, org, incident, {}) });
      void queryClient.invalidateQueries({ queryKey: timelineQueryKeys.list(mode, org, incident, 'desc') });
      void queryClient.invalidateQueries({ queryKey: timelineQueryKeys.list(mode, org, incident, 'asc') });
    }
  }, [queryClient]);

  // Keep the current scope in a ref so callbacks always filter against the live scope.
  useEffect(() => {
    scopeRef.current = { organizationId, incidentId, active };
    if (!canSubscribe) {
      generationRef.current += 1;
      setConnection(online ? 'connecting' : 'disconnected');
      setLiveTimelineId(null);
      return;
    }
  }, [organizationId, incidentId, active, canSubscribe, online]);

  // Single subscription lifecycle: mounts when the room scope is active, tears down on change/unmount/offline.
  useEffect(() => {
    if (!canSubscribe) return;
    const cleanup = establish();
    return () => {
      if (cleanup) cleanup();
      if (coalesceRef.current.timer) clearTimeout(coalesceRef.current.timer);
      coalesceRef.current.timer = null;
      coalesceRef.current.invalidated = false;
    };
  }, [canSubscribe, organizationId, incidentId, online, establish]);

  // Bounded reconciliation fallback: one scheduler, one logical timer per active scope.
  // Runs only while Base44 mode + authenticated + active org + active Incident + online + visible.
  // It is a READ-only safety net; fallback-discovered data is never marked LIVE.
  useEffect(() => {
    if (!canSubscribe || !visible) {
      if (reconcileRef.current.timer) {
        clearInterval(reconcileRef.current.timer);
        reconcileRef.current.timer = null;
      }
      reconcileRef.current.running = false;
      return;
    }
    if (reconcileRef.current.timer) return; // one scheduler only
    reconcileRef.current.running = false;
    reconcileRef.current.timer = setInterval(() => {
      if (!scopeRef.current.organizationId || !scopeRef.current.incidentId) return;
      if (reconcileRef.current.running) return; // no overlapping tick
      reconcileRef.current.running = true;
      const org = scopeRef.current.organizationId;
      const incident = scopeRef.current.incidentId;
      void queryClient.invalidateQueries({ queryKey: operationalQueryKeys.incident(mode, org, incident) });
      void queryClient.invalidateQueries({ queryKey: taskQueryKeys.list(mode, org, incident, {}) });
      void queryClient.invalidateQueries({ queryKey: timelineQueryKeys.list(mode, org, incident, 'desc') });
      void queryClient.invalidateQueries({ queryKey: timelineQueryKeys.list(mode, org, incident, 'asc') });
      reconcileRef.current.running = false;
    }, REALTIME_RECONCILIATION_INTERVAL_MS);
    return () => {
      if (reconcileRef.current.timer) {
        clearInterval(reconcileRef.current.timer);
        reconcileRef.current.timer = null;
      }
      reconcileRef.current.running = false;
    };
  }, [canSubscribe, visible, organizationId, incidentId, queryClient]);

  useEffect(() => {
    const handleOffline = () => {
      setOnline(false);
      setConnection('disconnected');
      generationRef.current += 1;
      if (coalesceRef.current.timer) clearTimeout(coalesceRef.current.timer);
      if (reconcileRef.current.timer) {
        clearInterval(reconcileRef.current.timer);
        reconcileRef.current.timer = null;
      }
      reconcileRef.current.running = false;
    };
    const handleOnline = () => {
      setOnline(true);
      setConnection('reconnecting');
      refreshAuthoritative();
    };
    if (typeof window === 'undefined') return;
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      const next = document.visibilityState !== 'hidden';
      setVisible(next);
      if (next && online && canSubscribe) {
        refreshAuthoritative();
      }
    };
    if (typeof document === 'undefined') return;
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [online, canSubscribe, refreshAuthoritative]);

  return { connection, liveTimelineId, online };
}
