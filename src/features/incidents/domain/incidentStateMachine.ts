import type { IncidentStatus, OrganizationRole } from './incidentAuthorityTypes';

export const INCIDENT_STATUS_TRANSITIONS: Record<IncidentStatus, readonly IncidentStatus[]> = {
  reported: ['triaging', 'investigating', 'closed'],
  triaging: ['investigating', 'identified', 'closed'],
  investigating: ['identified', 'monitoring'],
  identified: ['investigating', 'monitoring'],
  monitoring: ['investigating'],
  resolved: ['closed'],
  closed: [],
};

export const RESOLVABLE_STATUSES = ['investigating', 'identified', 'monitoring'] as const;
export type ResolvableIncidentStatus = (typeof RESOLVABLE_STATUSES)[number];

const authorityRoles = new Set(['incident_manager', 'admin']);

export function getAllowedIncidentTransitions(status: IncidentStatus | string | null | undefined): IncidentStatus[] {
  if (!status || !(status in INCIDENT_STATUS_TRANSITIONS)) return [];
  return [...INCIDENT_STATUS_TRANSITIONS[status as IncidentStatus]];
}

/** Non-resolution targets for the generic change-state form (excludes resolved). */
export function getAllowedNonResolutionTransitions(status: IncidentStatus | string | null | undefined): IncidentStatus[] {
  return getAllowedIncidentTransitions(status).filter((target) => target !== 'resolved');
}

export function isAllowedIncidentTransition(
  from: IncidentStatus | string | null | undefined,
  to: IncidentStatus | string | null | undefined,
): boolean {
  if (!from || !to) return false;
  if (from === 'resolved' && to === 'investigating') return false;
  return getAllowedIncidentTransitions(from).includes(to as IncidentStatus);
}

export function canMutateIncidentAuthority(role: OrganizationRole | string | null | undefined): boolean {
  return typeof role === 'string' && authorityRoles.has(role);
}

export function canChangeIncidentStatus(role: OrganizationRole | string | null | undefined, status: IncidentStatus | string | null | undefined): boolean {
  return canMutateIncidentAuthority(role) && getAllowedNonResolutionTransitions(status).length > 0;
}

export function canResolveIncident(role: OrganizationRole | string | null | undefined, status: IncidentStatus | string | null | undefined): boolean {
  return canMutateIncidentAuthority(role) && RESOLVABLE_STATUSES.includes(status as ResolvableIncidentStatus);
}

export function canCloseIncident(role: OrganizationRole | string | null | undefined, status: IncidentStatus | string | null | undefined): boolean {
  return canMutateIncidentAuthority(role) && status === 'resolved';
}

export function isTerminalIncidentStatus(status: IncidentStatus | string | null | undefined): boolean {
  return status === 'closed';
}

export function canChangeIncidentSeverity(role: OrganizationRole | string | null | undefined, status: IncidentStatus | string | null | undefined): boolean {
  return canMutateIncidentAuthority(role) && status !== 'closed' && Boolean(status);
}

export function canAssignIncidentCommander(role: OrganizationRole | string | null | undefined, status: IncidentStatus | string | null | undefined): boolean {
  return canMutateIncidentAuthority(role) && status !== 'closed' && Boolean(status);
}
