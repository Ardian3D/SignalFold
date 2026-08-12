export type RealtimeChangeType = 'create' | 'update' | 'delete';

export type RealtimeEntityKind = 'incident' | 'task' | 'timeline';

export type IncidentRealtimeEvent = {
  entity: RealtimeEntityKind;
  changeType: RealtimeChangeType;
  recordId: string;
  timestamp?: string;
  organizationId?: string;
  incidentId?: string;
};

export type IncidentRealtimeScope = {
  organizationId: string;
  incidentId: string;
};

export type RealtimeConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

export type RealtimeSubscription = {
  unsubscribe: () => void;
};
