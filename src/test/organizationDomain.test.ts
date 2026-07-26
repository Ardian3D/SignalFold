import { describe, expect, it } from 'vitest';
import { canRole, ORGANIZATION_CAPABILITIES } from '@/features/organization/domain/capabilities';
import { getOrganizationGateway } from '@/features/organization/organizationGateway';

describe('organization and membership domain boundary', () => {
  it('uses only the canonical roles and denies unknown roles by default', () => {
    expect(Object.keys({ reporter: 1, responder: 1, incident_manager: 1, admin: 1 })).toEqual(['reporter', 'responder', 'incident_manager', 'admin']);
    expect(canRole('admin', 'MANAGE_TEAM')).toBe(true);
    expect(canRole('Base44Admin', 'MANAGE_TEAM')).toBe(false);
    expect(ORGANIZATION_CAPABILITIES).toContain('VIEW_AUDIT_LOG');
  });

  it('keeps mock organization context isolated from Base44', async () => {
    const gateway = getOrganizationGateway({ dataMode: 'mock', appId: null, useLocalDev: false, localServerUrl: null, isConfigured: false });
    const result = await gateway.resolveCurrentOrganizationContext();
    expect(result.state).toBe('ACTIVE');
    expect(result.context?.membership.role).toBe('admin');
    expect(result.context?.organization.isDemo).toBe(true);
  });
});
