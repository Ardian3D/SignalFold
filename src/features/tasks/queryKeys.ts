export const taskQueryKeys = {
  root: (mode: string, organizationId: string, incidentId: string) => ['operations', mode, organizationId, 'tasks', incidentId] as const,
  list: (mode: string, organizationId: string, incidentId: string, filters: unknown) => [...taskQueryKeys.root(mode, organizationId, incidentId), 'list', filters] as const,
  summary: (mode: string, organizationId: string, incidentId: string) => [...taskQueryKeys.root(mode, organizationId, incidentId), 'summary'] as const,
  dashboardSummary: (mode: string, organizationId: string) => ['operations', mode, organizationId, 'dashboard', 'tasks'] as const,
  teamLoad: (mode: string, organizationId: string) => ['operations', mode, organizationId, 'team-load'] as const,
};

