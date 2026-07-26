export const operationalQueryKeys = {
  root: (mode: string, organizationId: string) => ['operations', mode, organizationId] as const,
  services: (mode: string, organizationId: string) => [...operationalQueryKeys.root(mode, organizationId), 'services'] as const,
  incidentServiceOptions: (mode: string, organizationId: string) => [...operationalQueryKeys.root(mode, organizationId), 'incident-service-options'] as const,
  incidents: (mode: string, organizationId: string, filters: unknown) => [...operationalQueryKeys.root(mode, organizationId), 'incidents', filters] as const,
  incident: (mode: string, organizationId: string, id: string) => [...operationalQueryKeys.root(mode, organizationId), 'incident', id] as const,
  dashboard: (mode: string, organizationId: string) => [...operationalQueryKeys.root(mode, organizationId), 'dashboard'] as const,
};
