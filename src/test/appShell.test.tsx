import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { AppShell } from '@/layouts/AppShell';

describe('AppShell Desktop and Mobile Layout Tests', () => {
  it('verifies desktop sidebar sticky positioning and viewport-height constraints', () => {
    render(
      <AppProviders>
        <MemoryRouter>
          <AppShell>
            <div data-testid="test-child">Dashboard Content</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    // Verify Desktop Sidebar element is rendered
    const sidebar = screen.getByLabelText('Desktop Sidebar');
    expect(sidebar).toBeInTheDocument();

    // Verify responsive hide/show behavior (hidden on mobile, flex on desktop)
    expect(sidebar.className).toContain('hidden');
    expect(sidebar.className).toContain('lg:flex');

    // Verify sticky behavior and self-start to allow sticking
    expect(sidebar.className).toContain('sticky');
    expect(sidebar.className).toContain('top-0');
    expect(sidebar.className).toContain('self-start');

    // Verify viewport-height constraints
    expect(sidebar.className).toContain('h-screen');
    expect(sidebar.className).toContain('min-h-screen');

    // Verify scroll constraints (only internal sidebar scrolling allowed)
    expect(sidebar.className).toContain('overflow-y-auto');
    expect(sidebar.className).toContain('overflow-x-hidden');
  });

  it('verifies main content remains separately scrollable with normal document flow', () => {
    const { container } = render(
      <AppProviders>
        <MemoryRouter>
          <AppShell>
            <div data-testid="test-child">Dashboard Content</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    // Find root container in AppShell
    const rootGrid = container.firstElementChild;
    expect(rootGrid).toBeInTheDocument();

    // Verify no accidental ancestor rules prevent sticky positioning on the root AppShell grid
    // It should NOT contain overflow-y-hidden, overflow-hidden, overflow-y-scroll, etc. on desktop
    expect(rootGrid?.className).not.toContain('overflow-hidden');
    expect(rootGrid?.className).not.toContain('overflow-y-hidden');
    expect(rootGrid?.className).not.toContain('overflow-y-scroll');

    // Verify main content region exists
    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('verifies sidebar upper navigation items and bottom metadata are correctly rendered', () => {
    render(
      <AppProviders>
        <MemoryRouter>
          <AppShell>
            <div>Dashboard Content</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    // 1. Upper brand and context
    expect(screen.getAllByText('SYSTEM')[0]).toBeInTheDocument();
    expect(screen.getAllByText('SIGNALFOLD')[0]).toBeInTheDocument();
    expect(screen.getAllByText('NORTHSTAR COMMERCE')[0]).toBeInTheDocument();

    // 2. Navigation
    expect(screen.getAllByText('DASHBOARD')[0]).toBeInTheDocument();
    expect(screen.getAllByText('INCIDENTS')[0]).toBeInTheDocument();
    expect(screen.getAllByText('SERVICES')[0]).toBeInTheDocument();

    // 3. Settings secondary navigation
    expect(screen.getAllByText('SETTINGS')[0]).toBeInTheDocument();

    // 4. Bottom Metadata segment
    expect(screen.getAllByText('APP STATE')[0]).toBeInTheDocument();
    expect(screen.getAllByText('DATA SOURCE')[0]).toBeInTheDocument();
    expect(screen.getAllByText('AUTHORITY')[0]).toBeInTheDocument();
  });

  it('verifies mobile header and responsive drawer toggle behavior', () => {
    render(
      <AppProviders>
        <MemoryRouter>
          <AppShell>
            <div>Dashboard Content</div>
          </AppShell>
        </MemoryRouter>
      </AppProviders>
    );

    // Mobile compact header is rendered and hidden on desktop (lg:hidden)
    const banners = screen.getAllByRole('banner');
    const mobileHeader = banners.find((b) => b.className.includes('lg:hidden'));
    expect(mobileHeader).toBeInTheDocument();
    expect(mobileHeader?.className).toContain('lg:hidden');

    // Verify drawer dialog is initially not open
    expect(screen.queryByRole('dialog', { name: 'Navigation Menu' })).not.toBeInTheDocument();

    // Find and click open menu button
    const openMenuBtn = screen.getByRole('button', { name: 'Open Navigation Menu' });
    expect(openMenuBtn).toBeInTheDocument();
    fireEvent.click(openMenuBtn);

    // Verify drawer dialog is open
    const drawer = screen.getByRole('dialog', { name: 'Navigation Menu' });
    expect(drawer).toBeInTheDocument();

    // Find and click close button inside drawer
    const closeMenuBtn = screen.getByRole('button', { name: 'Close menu' });
    expect(closeMenuBtn).toBeInTheDocument();
    fireEvent.click(closeMenuBtn);

    // Verify drawer is closed again
    expect(screen.queryByRole('dialog', { name: 'Navigation Menu' })).not.toBeInTheDocument();
  });
});
