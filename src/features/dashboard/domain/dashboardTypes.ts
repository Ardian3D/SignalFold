import type { Incident, IncidentUpdate } from '@/features/incidents/domain/incidentTypes';
import type { SafeOrganizationMember } from '@/features/organization/domain/organizationTypes';
import type { TaskSummary } from '@/features/tasks/domain/taskTypes';

export type DashboardOverview = {
  activeIncidentsCount: number;
  sev1Sev2Active: number;
  openTasks: number | null;
  taskDataAvailable: boolean;
  taskSummary: TaskSummary;
  resolvedThisWeek: number;
  averageTimeToAcknowledge: number | null;
  averageTimeToResolve: number | null;
  activeIncidents: Incident[];
  needsAttention: Incident[];
  recentActivity: IncidentUpdate[];
  recentIncidents: Incident[];
  serviceSummary: { operational: number; degraded: number; outage: number; maintenance: number };
  teamLoad: Array<SafeOrganizationMember & TaskSummary>;
  quickCreateCapability: boolean;
  demoWorkspaceState: { isDemo: boolean; canSeed: boolean };
};
