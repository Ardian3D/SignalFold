export const postmortemQueryKeys = {
  read: (mode: string, organizationId: string, incidentId: string) => ['operations', mode, organizationId, 'postmortem', incidentId] as const,
};
