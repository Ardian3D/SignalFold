import type { IncidentTimeline } from '../domain/timelineTypes';

export type TimelineNoteInput = {
  organizationId: string;
  incidentId: string;
  message: string;
  requestId: string;
};

export interface TimelineGateway {
  listIncidentTimeline(organizationId: string, incidentId: string, direction?: 'desc' | 'asc'): Promise<IncidentTimeline>;
  addIncidentNote(input: TimelineNoteInput): Promise<IncidentTimeline>;
}

