import type { IncidentSeverity, IncidentStatus } from './incidentTypes';

export type { IncidentSeverity, IncidentStatus };
export type OrganizationRole = 'admin' | 'incident_manager' | 'responder' | 'reporter';
export type RootCauseKnown = 'yes' | 'no' | 'unknown';

export type ChangeIncidentStateInput = {
  organizationId: string;
  incidentId: string;
  expectedStatus: IncidentStatus;
  targetStatus: IncidentStatus;
  reason?: string;
  requestId: string;
};

export type ChangeIncidentSeverityInput = {
  organizationId: string;
  incidentId: string;
  expectedSeverity: IncidentSeverity;
  newSeverity: IncidentSeverity;
  reason: string;
  requestId: string;
};

export type AssignIncidentCommanderInput = {
  organizationId: string;
  incidentId: string;
  commanderUserId: string | null;
  expectedCommanderUserId?: string | null;
  requestId: string;
};

export type ResolveIncidentInput = {
  organizationId: string;
  incidentId: string;
  expectedStatus: 'investigating' | 'identified' | 'monitoring';
  resolutionSummary: string;
  rootCauseKnown: RootCauseKnown;
  recoveryVerified: boolean;
  remainingRisk: string;
  overrideOpenCriticalTasks?: boolean;
  overrideReason?: string;
  restoreServiceOperational?: boolean;
  requestId: string;
};

export type IncidentAuthorityCapabilities = {
  canChangeStatus: boolean;
  canChangeSeverity: boolean;
  canAssignCommander: boolean;
  canResolve: boolean;
  canClose: boolean;
};
