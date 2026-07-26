export const SERVICE_CRITICALITIES = ['low', 'medium', 'high', 'critical'] as const;
export const SERVICE_OPERATIONAL_STATUSES = ['operational', 'degraded', 'outage', 'maintenance'] as const;
export type ServiceCriticality = typeof SERVICE_CRITICALITIES[number];
export type ServiceOperationalStatus = typeof SERVICE_OPERATIONAL_STATUSES[number];
export type Service = { id: string; organizationId: string; name: string; slug: string; description?: string; criticality: ServiceCriticality; operationalStatus: ServiceOperationalStatus; ownerUserId?: string; tags: string[]; isActive: boolean; isDemo: boolean; createdAt?: string; updatedAt?: string };
export type ServiceInput = { name: string; description?: string; criticality: ServiceCriticality; operationalStatus?: ServiceOperationalStatus; ownerUserId?: string; tags?: string[]; requestId: string };
