import type { DashboardOverview } from '@/features/dashboard/domain/dashboardTypes';
import type { Incident, IncidentCreateInput, IncidentFilters, IncidentUpdate } from '@/features/incidents/domain/incidentTypes';
import type { Service, ServiceInput } from '@/features/services/domain/serviceTypes';

export type IncidentListResult = { incidents: Incident[]; nextCursor: string | null };
export type IncidentReadModel = { incident: Incident; service: Service | null; updates: IncidentUpdate[] };
export interface OperationalGateway {
  listServices(organizationId: string, includeInactive?: boolean): Promise<Service[]>;
  createService(organizationId: string, input: ServiceInput): Promise<Service>;
  updateService(organizationId: string, serviceId: string, input: Partial<ServiceInput> & { isActive?: boolean; requestId: string }): Promise<Service>;
  listIncidents(organizationId: string, filters?: IncidentFilters): Promise<IncidentListResult>;
  getIncident(organizationId: string, incidentId: string): Promise<IncidentReadModel>;
  createIncident(organizationId: string, input: IncidentCreateInput): Promise<Incident>;
  getDashboardOverview(organizationId: string): Promise<DashboardOverview>;
  seedDemoData(organizationId: string, requestId: string): Promise<{ organizationId: string; created: number }>;
  resetDemoData(organizationId: string, requestId: string): Promise<{ deleted: number }>;
}
