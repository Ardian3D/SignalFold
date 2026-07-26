import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

const authState = vi.hoisted(() => ({
  isMockMode: false,
}));

vi.mock('@/features/auth/AuthProvider', () => ({
  useAuth: () => ({
    isMockMode: authState.isMockMode,
    user: authState.isMockMode ? null : { id: 'safe-user', email: 'operator@example.test', displayName: null, emailVerified: true },
  }),
}));

const { OnboardingPage } = await import('@/pages/OnboardingPage');

describe('Phase 02D boundaries', () => {
  it('keeps application entry centralized and rejects unsafe destinations', async () => {
    const { getAuthenticatedEntryPath } = await import('@/features/auth/routing/returnPath');
    expect(getAuthenticatedEntryPath('/app/incidents/SF-2026-0042')).toBe('/app/incidents/SF-2026-0042');
    expect(getAuthenticatedEntryPath('https://example.invalid')).toBe('/app');
    expect(getAuthenticatedEntryPath('//example.invalid')).toBe('/app');
  });

  it('uses projected AuthProvider identity in AppShell without role interpretation', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/layouts/AppShell.tsx'), 'utf8');
    expect(source).toContain('user?.displayName ?? user?.email');
    expect(source).toContain("isMockMode ? 'NORTHSTAR COMMERCE' : 'ORGANIZATION NOT RESOLVED'");
    expect(source).not.toContain('user?.role');
    expect(source).not.toContain('organizationRole');
  });

  it('prevents Base44 onboarding from claiming persisted organization completion', async () => {
    authState.isMockMode = false;
    const localStorageSet = vi.spyOn(Storage.prototype, 'setItem');
    render(<MemoryRouter initialEntries={['/app/onboarding']}><OnboardingPage /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText('ORGANIZATION NAME'), { target: { value: 'SignalFold Labs' } });
    fireEvent.click(screen.getByRole('button', { name: 'CONTINUE TO ROLE' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'ROLE & USE CASE' })).toBeInTheDocument(), { timeout: 1500 });
    fireEvent.click(screen.getByRole('radio', { name: /REPORTER/i }));
    fireEvent.click(screen.getByRole('radio', { name: /INCIDENT REPORTING/i }));
    fireEvent.click(screen.getByRole('button', { name: 'CONTINUE TO REVIEW' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'REVIEW & ENTER' })).toBeInTheDocument(), { timeout: 1500 });
    fireEvent.click(screen.getByRole('button', { name: 'ENTER WORKSPACE' }));

    expect(screen.getByText('ORGANIZATION SETUP NOT CONNECTED')).toBeInTheDocument();
    expect(screen.getByText('Organization and membership persistence begins in Backend Phase 03.')).toBeInTheDocument();
    expect(localStorageSet).not.toHaveBeenCalled();
    localStorageSet.mockRestore();
  }, 10000);

  it('contains no Organization or Membership backend operation in onboarding', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/pages/OnboardingPage.tsx'), 'utf8');
    expect(source).not.toMatch(/entities\.(Organization|Membership)/);
    expect(source).not.toMatch(/localStorage|sessionStorage/);
  });
});
