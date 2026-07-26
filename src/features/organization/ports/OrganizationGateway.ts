import type { ActiveOrganizationContext, OrganizationAccessState, SafeOrganizationMember } from '../domain/organizationTypes';
export type OnboardingInput = { displayName?: string; organizationName: string; defaultTimezone: string; incidentPrefix?: string; useCase?: string; displayTitle?: string; requestId: string };
export type OrganizationResolution = { state: OrganizationAccessState; context: ActiveOrganizationContext | null; selectable: ActiveOrganizationContext[] };
export type OrganizationGateway = { resolveCurrentOrganizationContext(): Promise<OrganizationResolution>; completeOrganizationOnboarding(input: OnboardingInput): Promise<OrganizationResolution>; selectActiveOrganization(organizationId: string): Promise<OrganizationResolution>; listActiveOrganizationMembers(): Promise<SafeOrganizationMember[]> };

