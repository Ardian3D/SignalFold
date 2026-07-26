import type { OrganizationRole } from './organizationTypes';

export const ORGANIZATION_CAPABILITIES = ['CREATE_INCIDENT','VIEW_INCIDENTS','ADD_INTERNAL_NOTE','RUN_AI_TRIAGE','CHANGE_SEVERITY','CHANGE_INCIDENT_STATUS','CREATE_TASK','CLAIM_TASK','UPDATE_OWN_TASK','REASSIGN_TASK','PUBLISH_PUBLIC_UPDATE','RESOLVE_INCIDENT','GENERATE_POSTMORTEM','APPROVE_POSTMORTEM','MANAGE_SERVICES','MANAGE_TEAM','MANAGE_ORGANIZATION_SETTINGS','RESET_DEMO_WORKSPACE','VIEW_AUDIT_LOG'] as const;
export type OrganizationCapability = typeof ORGANIZATION_CAPABILITIES[number];
const admin = new Set<OrganizationCapability>(ORGANIZATION_CAPABILITIES);
const capabilities: Record<OrganizationRole, ReadonlySet<OrganizationCapability>> = { admin, incident_manager: new Set(['CREATE_INCIDENT','VIEW_INCIDENTS','ADD_INTERNAL_NOTE','RUN_AI_TRIAGE','CHANGE_SEVERITY','CHANGE_INCIDENT_STATUS','CREATE_TASK','CLAIM_TASK','UPDATE_OWN_TASK','REASSIGN_TASK','PUBLISH_PUBLIC_UPDATE','RESOLVE_INCIDENT','GENERATE_POSTMORTEM','APPROVE_POSTMORTEM','VIEW_AUDIT_LOG']), responder: new Set(['CREATE_INCIDENT','VIEW_INCIDENTS','ADD_INTERNAL_NOTE','RUN_AI_TRIAGE','CREATE_TASK','CLAIM_TASK','UPDATE_OWN_TASK','PUBLISH_PUBLIC_UPDATE','VIEW_AUDIT_LOG']), reporter: new Set(['CREATE_INCIDENT','VIEW_INCIDENTS','ADD_INTERNAL_NOTE']) };
export function canRole(role: OrganizationRole | string | null | undefined, capability: OrganizationCapability): boolean { return role !== null && role !== undefined && role in capabilities && capabilities[role as OrganizationRole].has(capability); }

