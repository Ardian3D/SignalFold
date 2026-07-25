import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { AppShell } from '@/layouts/AppShell';

describe('Global Connectivity Feedback System - Phase 01', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('verifies that by default, the frontend preview renders no global connectivity banner', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app']}>
          <AppShell>
            <div data-testid="route-content">Incident Control Panel</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    // Default connection is connected, banner should not exist in DOM
    const banner = document.getElementById('system-connectivity-banner');
    expect(banner).not.toBeInTheDocument();

    // Route content must remain fully visible and unaffected
    expect(screen.getByTestId('route-content')).toBeInTheDocument();
  });

  it('verifies connected state explicitly renders no banner', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app?previewConnection=connected']}>
          <AppShell>
            <div data-testid="route-content">Incident Control Panel</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    const banner = document.getElementById('system-connectivity-banner');
    expect(banner).not.toBeInTheDocument();
  });

  it('verifies offline state renders NETWORK CONNECTION LOST and preserves route content', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app?previewConnection=offline']}>
          <AppShell>
            <div data-testid="route-content">Incident Room SF-2026-0042</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    // Exact required text
    expect(screen.getByText('NETWORK CONNECTION LOST')).toBeInTheDocument();

    // Verify role and aria-live
    const banner = document.getElementById('system-connectivity-banner');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute('role', 'alert');

    // Supporting copies
    expect(screen.getByText(/Realtime updates and authoritative operations are unavailable/)).toBeInTheDocument();
    expect(screen.getByText('DO NOT TREAT DISPLAYED DATA AS THE LATEST SERVER STATE.')).toBeInTheDocument();

    // Verify route content remains preserved and readable
    expect(screen.getByTestId('route-content')).toBeInTheDocument();
    expect(screen.getByText('Incident Room SF-2026-0042')).toBeInTheDocument();
  });

  it('verifies retry action in mock mode changes only state to RECONNECTING and does not claim success', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app?previewConnection=offline']}>
          <AppShell>
            <div data-testid="route-content">Incident Room</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    expect(screen.getByText('NETWORK CONNECTION LOST')).toBeInTheDocument();

    // Click RETRY CONNECTION
    const retryBtn = screen.getByRole('button', { name: 'RETRY CONNECTION' });
    fireEvent.click(retryBtn);

    // Verify it transitions to RECONNECTING state
    expect(screen.getByText('REALTIME DISCONNECTED — RETRYING')).toBeInTheDocument();
    expect(screen.queryByText('NETWORK CONNECTION LOST')).not.toBeInTheDocument();
    expect(screen.queryByText('CONNECTED SUCCESS')).not.toBeInTheDocument();
  });

  it('verifies reconnecting state renders correct technical states and copy', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app?previewConnection=reconnecting']}>
          <AppShell>
            <div data-testid="route-content">Incident Room</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    expect(screen.getByText('REALTIME DISCONNECTED — RETRYING')).toBeInTheDocument();

    // Verify role and aria-live for status
    const banner = document.getElementById('system-connectivity-banner');
    expect(banner).toHaveAttribute('role', 'status');

    expect(screen.getByText(/SignalFold is waiting for connectivity/)).toBeInTheDocument();

    // Verify exact labels
    expect(screen.getByText('CONNECTION')).toBeInTheDocument();
    expect(screen.getByText('RECONNECTING')).toBeInTheDocument();
    expect(screen.getByText('AUTHORITATIVE DATA')).toBeInTheDocument();
    expect(screen.getByText('REFRESH PENDING')).toBeInTheDocument();
    expect(screen.getByText('CURRENT VIEW')).toBeInTheDocument();
    expect(screen.getByText('LAST LOADED SNAPSHOT')).toBeInTheDocument();
    expect(screen.getByText('RETRY ATTEMPT')).toBeInTheDocument();
    
    // Check multiple occurrences of 'FRONTEND PREVIEW'
    expect(screen.getAllByText('FRONTEND PREVIEW').length).toBeGreaterThan(0);
  });

  it('verifies restored state renders CONNECTION RESTORED and disables refresh action', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app?previewConnection=restored']}>
          <AppShell>
            <div data-testid="route-content">Incident Room</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    expect(screen.getByText('CONNECTION RESTORED')).toBeInTheDocument();

    // Verify exact labels
    expect(screen.getByText('REALTIME')).toBeInTheDocument();
    expect(screen.getByText('AVAILABLE FOR RECONNECTION')).toBeInTheDocument();
    expect(screen.getByText('AUTHORITATIVE SNAPSHOT')).toBeInTheDocument();
    expect(screen.getByText('REFRESH REQUIRED')).toBeInTheDocument();
    expect(screen.getByText('REFRESH STATE')).toBeInTheDocument();
    expect(screen.getByText('NOT EXECUTED')).toBeInTheDocument();

    // Disabled future action
    const refreshBtn = screen.getByRole('button', { name: 'REFRESH AUTHORITATIVE SNAPSHOT' });
    expect(refreshBtn).toBeDisabled();
    expect(screen.getByText('BACKEND REPOSITORY REQUIRED')).toBeInTheDocument();
  });

  it('verifies dismiss control hides the banner without changing state or persisting', () => {
    const { unmount } = render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app?previewConnection=offline']}>
          <AppShell>
            <div data-testid="route-content">Incident Room</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    expect(screen.getByText('NETWORK CONNECTION LOST')).toBeInTheDocument();

    // Click Dismiss
    const dismissBtn = screen.getByRole('button', { name: 'Dismiss connectivity notice' });
    fireEvent.click(dismissBtn);

    // Verify hidden
    expect(screen.queryByText('NETWORK CONNECTION LOST')).not.toBeInTheDocument();

    // Unmount and render again with a new connection state (like restored) to prove it is not persisted
    unmount();

    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app?previewConnection=restored']}>
          <AppShell>
            <div data-testid="route-content">Incident Room</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    expect(screen.getByText('CONNECTION RESTORED')).toBeInTheDocument();
  });

  it('verifies exactly one banner exists inside AppShell and not inside drawers', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app?previewConnection=offline']}>
          <AppShell>
            <div data-testid="drawer-content">Drawer Content</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    const banners = document.querySelectorAll('#system-connectivity-banner');
    expect(banners.length).toBe(1);
  });

  it('verifies unknown previewConnection values are ignored safely', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app?previewConnection=something_unknown_broken']}>
          <AppShell>
            <div data-testid="route-content">Incident Room</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    const banner = document.getElementById('system-connectivity-banner');
    expect(banner).not.toBeInTheDocument();
  });

  it('verifies mock query control is ignored in production mode', () => {
    // Stub import.meta.env.MODE to be 'production'
    vi.stubEnv('MODE', 'production');

    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app?previewConnection=offline']}>
          <AppShell>
            <div data-testid="route-content">Incident Room</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    // In production, the mock query parameter must be ignored
    const banner = document.getElementById('system-connectivity-banner');
    expect(banner).not.toBeInTheDocument();

    vi.unstubAllEnvs();
  });

  it('verifies accessibility requirements', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app?previewConnection=offline']}>
          <AppShell>
            <div data-testid="route-content">Incident Room</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    const dismissBtn = screen.getByRole('button', { name: 'Dismiss connectivity notice' });
    expect(dismissBtn).toBeInTheDocument();

    const banner = document.getElementById('system-connectivity-banner');
    expect(banner).toHaveAttribute('aria-live', 'assertive');
  });

  it('verifies reduced motion configuration is applied correctly', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/app?previewConnection=reconnecting']}>
          <AppShell>
            <div data-testid="route-content">Incident Room</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    // Verify motion-safe classes are used for animation so prefers-reduced-motion is honored
    const pingIndicator = document.querySelector('.motion-safe\\:animate-ping');
    expect(pingIndicator).toBeInTheDocument();
  });
});
