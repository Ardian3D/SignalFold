import type { IncidentUpdate } from '@/features/incidents/domain/incidentTypes';

export type TimelineDirection = 'desc' | 'asc';

export type IncidentTimeline = {
  items: IncidentUpdate[];
  nextCursor: string | null;
  direction: TimelineDirection;
};

