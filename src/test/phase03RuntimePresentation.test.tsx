import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

const runtime = vi.hoisted(() => ({ isMockMode: false, role: 'admin' as 'admin'|'reporter' }));
const activeContext = {
  organization: { id: 'org-1', name: 'EXAMPLE OPERATIONS', slug: 'example-operations', defaultTimezone: 'UTC', incidentPrefix: 'SF', publicStatusEnabled: false, createdByUserId: 'user-1', isDemo: false },
  membership: { id: 'membership-1', organizationId: 'org-1', userId: 'user-1', role: 'admin' as const, status: 'active' as const },
};

vi.mock('@/features/auth/AuthProvider', () => ({ useAuth: () => ({ isMockMode: runtime.isMockMode, user: { id: 'user-1', email: 'operator@example.test', displayName: 'Example Operator', emailVerified: true }, logout: vi.fn() }) }));
vi.mock('@/features/organization/OrganizationProvider', () => ({ useOrganization: () => ({ isMockMode: runtime.isMockMode, context: { ...activeContext, membership: { ...activeContext.membership, role: runtime.role } }, members: [], refreshMembers: vi.fn() }) }));

import { AppShell } from '@/layouts/AppShell';
import { Base44EmptyBoundary } from '@/features/organization/OrganizationReadBoundaries';
import { getAppRouteTitle } from '@/layouts/appRouteTitle';

afterEach(() => { cleanup(); runtime.isMockMode = false; runtime.role = 'admin'; });

describe('Phase 03 runtime presentation', () => {
  it('renders an active Base44 workspace without preview authority labels', () => {
    render(<MemoryRouter initialEntries={['/app']}><AppShell><Base44EmptyBoundary title="ACTIVE ORGANIZATION / EMPTY INCIDENT DATA" /></AppShell></MemoryRouter>);
    expect(screen.getByText('LIVE WORKSPACE')).toBeInTheDocument();
    expect(screen.getAllByText('BASE44').length).toBeGreaterThan(0);
    expect(screen.getAllByText('MEMBERSHIP ACTIVE').length).toBeGreaterThan(0);
    expect(screen.getByText(/Example Operator \/ ORGANIZATION ADMIN/i)).toBeInTheDocument();
    expect(screen.queryByText('MOCK MODE')).not.toBeInTheDocument();
    expect(screen.queryByText('BACKEND PENDING')).not.toBeInTheDocument();
    expect(screen.queryByText('FRONTEND PREVIEW')).not.toBeInTheDocument();
  });

  it('uses a stable Dashboard-width empty state and no canonical mock incidents', () => {
    render(<MemoryRouter><Base44EmptyBoundary title="ACTIVE ORGANIZATION / EMPTY INCIDENT DATA">No incidents have been recorded for this organization.</Base44EmptyBoundary></MemoryRouter>);
    const panel = screen.getByTestId('base44-empty-state-card');
    expect(panel).toHaveClass('w-full', 'max-w-2xl', 'min-w-0');
    expect(panel).not.toHaveClass('w-fit');
    expect(screen.getByTestId('base44-empty-state-wrapper')).toHaveStyle({ display: 'flex', width: '100%', minWidth: '0' });
    expect(screen.getByTestId('base44-empty-state-card')).toHaveStyle({ display: 'block', width: '100%', maxWidth: '42rem', boxSizing: 'border-box', writingMode: 'horizontal-tb' });
    const description = screen.getByTestId('base44-empty-state-description');
    expect(description).toHaveStyle({ display: 'block', width: '100%', maxWidth: '36rem', minWidth: '0', marginInline: 'auto', wordBreak: 'normal', overflowWrap: 'normal', writingMode: 'horizontal-tb' });
    expect(screen.getByTestId('base44-empty-state-content')).toHaveStyle({ display: 'block', width: '100%', minWidth: '0', textAlign: 'center' });
    expect(description.className).not.toMatch(/w-fit|max-w-min|max-w-fit|break-all/);
    expect(screen.getByText('No incidents have been recorded for this organization.')).toBeInTheDocument();
    expect(screen.queryByText('SF-2026-0042')).not.toBeInTheDocument();
  });

  it('preserves the canonical mock workspace labels', () => {
    runtime.isMockMode = true;
    render(<MemoryRouter initialEntries={['/app']}><AppShell><div>MOCK DASHBOARD</div></AppShell></MemoryRouter>);
    expect(screen.getAllByText('FRONTEND PREVIEW').length).toBeGreaterThan(0);
    expect(screen.getAllByText('MOCK MODE').length).toBeGreaterThan(0);
    expect(screen.getAllByText('BACKEND PENDING').length).toBeGreaterThan(0);
  });

  it('resolves route titles centrally', () => {
    expect(getAppRouteTitle('/app')).toBe('DASHBOARD');
    expect(getAppRouteTitle('/app/team')).toBe('TEAM & MEMBERSHIP');
    expect(getAppRouteTitle('/app/settings')).toBe('SETTINGS');
  });

  it('renders the Settings route title through AppShell', () => {
    render(<MemoryRouter initialEntries={['/app/settings']}><AppShell><div>SETTINGS CONTENT</div></AppShell></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: 'SETTINGS' })).toBeInTheDocument();
  });

  it('derives the Services navigation badge from Membership capability', () => {
    const { unmount } = render(<MemoryRouter initialEntries={['/app']}><AppShell><div>DASHBOARD</div></AppShell></MemoryRouter>);
    const adminServices = screen.getAllByRole('link', { name: /SERVICES/ })[0];
    expect(within(adminServices).queryByText('READ ONLY')).not.toBeInTheDocument();
    expect(screen.getAllByText('READ ONLY').length).toBeGreaterThan(0);
    unmount(); runtime.role = 'reporter';
    render(<MemoryRouter initialEntries={['/app']}><AppShell><div>DASHBOARD</div></AppShell></MemoryRouter>);
    expect(within(screen.getAllByRole('link', { name: /SERVICES/ })[0]).getByText('READ ONLY')).toBeInTheDocument();
  });

  it('keeps Services active-route presentation for an Admin', () => {
    render(<MemoryRouter initialEntries={['/app/services']}><AppShell><div>SERVICES CONTENT</div></AppShell></MemoryRouter>);
    const active = screen.getAllByRole('link', { name: /SERVICESACTIVE/ })[0];
    expect(active).toHaveAttribute('aria-current', 'page');
    expect(within(active).queryByText('READ ONLY')).not.toBeInTheDocument();
  });
});
