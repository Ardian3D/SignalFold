export const timelineQueryKeys = {
  root: (mode: string, organizationId: string, incidentId: string) => ['operations', mode, organizationId, 'timeline', incidentId] as const,
  list: (mode: string, organizationId: string, incidentId: string, direction: string) => [...timelineQueryKeys.root(mode, organizationId, incidentId), direction] as const,
  dashboardActivity: (mode: string, organizationId: string) => ['operations', mode, organizationId, 'dashboard', 'activity'] as const,
};

