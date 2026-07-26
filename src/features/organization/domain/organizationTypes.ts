export type OrganizationRole = 'reporter' | 'responder' | 'incident_manager' | 'admin';
export type MembershipStatus = 'invited' | 'active' | 'suspended';
export type OrganizationAccessState = 'UNRESOLVED' | 'RESOLVING' | 'NEEDS_ONBOARDING' | 'ACTIVE' | 'SELECTION_REQUIRED' | 'SUSPENDED_ONLY' | 'INVITED_ONLY' | 'UNAVAILABLE' | 'ERROR';

export type Organization = { id: string; name: string; slug: string; logoUrl?: string; defaultTimezone: string; incidentPrefix: string; publicStatusEnabled: boolean; createdByUserId: string; isDemo: boolean };
export type Membership = { id: string; organizationId: string; userId: string; role: OrganizationRole; status: MembershipStatus; invitedByUserId?: string; joinedAt?: string; displayTitle?: string };
export type ActiveOrganizationContext = { organization: Organization; membership: Membership };
export type SafeOrganizationMember = { membershipId: string; userId: string; displayName?: string; email?: string; displayTitle?: string; role: OrganizationRole; status: MembershipStatus; joinedAt?: string };

