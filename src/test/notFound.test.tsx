import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { AppProviders } from '@/app/providers';

// Declare mock at the top level to support hoisting
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SignalFold NotFoundPage (404 Error State)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the official BrandLogo', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/invalid-route']}>
          <NotFoundPage />
        </MemoryRouter>
      </AppProviders>
    );

    const logoElement = screen.getByAltText('SignalFold');
    expect(logoElement).toBeInTheDocument();
    expect(logoElement.tagName).toBe('IMG');
  });

  it('renders standard system identifiers, 404 code, and custom headline', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/unknown-path-xyz']}>
          <NotFoundPage />
        </MemoryRouter>
      </AppProviders>
    );

    expect(screen.getByText('404 / SIGNAL LOST')).toBeInTheDocument();
    expect(screen.getByText(/THIS ROUTE/i)).toBeInTheDocument();
    expect(screen.getByText(/DID NOT RESOLVE/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        'The requested SignalFold path could not be found. Return to the command surface or step back to the previous valid location.'
      )
    ).toBeInTheDocument();
  });

  it('renders technical status block metadata and displays current pathname safely', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/custom/incident/999/unresolved-signals']}>
          <NotFoundPage />
        </MemoryRouter>
      </AppProviders>
    );

    expect(screen.getByText('SYSTEM ERROR STATUS PANEL')).toBeInTheDocument();
    expect(screen.getByText('REQUEST STATUS')).toBeInTheDocument();
    expect(screen.getByText('NOT FOUND')).toBeInTheDocument();
    expect(screen.getByText('ERROR CODE')).toBeInTheDocument();
    expect(screen.getAllByText('404').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('SYSTEM STATE')).toBeInTheDocument();
    expect(screen.getByText('OPERATIONAL')).toBeInTheDocument();
    expect(screen.getByText('RECOVERY MODE')).toBeInTheDocument();
    expect(screen.getByText('MANUAL NAVIGATION')).toBeInTheDocument();

    // Verify current pathname displays safely
    expect(screen.getByText('/custom/incident/999/unresolved-signals')).toBeInTheDocument();

    // Ensure no stack traces or secrets are leaked
    expect(screen.queryByText(/at /)).not.toBeInTheDocument();
    expect(screen.queryByText(/exception/i)).not.toBeInTheDocument();
  });

  it('contains primary action "RETURN HOME" navigating back to "/"', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/unknown-path']}>
          <NotFoundPage />
        </MemoryRouter>
      </AppProviders>
    );

    const returnHomeLink = screen.getByRole('link', { name: 'RETURN HOME' });
    expect(returnHomeLink).toBeInTheDocument();
    expect(returnHomeLink).toHaveAttribute('href', '/');
  });

  it('handles "GO BACK" button history traversal with safe fallback', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/unknown-path']}>
          <NotFoundPage />
        </MemoryRouter>
      </AppProviders>
    );

    const goBackButton = screen.getByRole('button', { name: 'GO BACK' });
    expect(goBackButton).toBeInTheDocument();

    fireEvent.click(goBackButton);

    // Should call useNavigate (mockNavigate)
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('renders bottom technical assurance and record rails', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/unknown-path']}>
          <NotFoundPage />
        </MemoryRouter>
      </AppProviders>
    );

    expect(screen.getByText('SYSTEM AVAILABLE')).toBeInTheDocument();
    expect(screen.getByText('REQUEST UNRESOLVED')).toBeInTheDocument();
    expect(screen.getByText('SAFE RETURN READY')).toBeInTheDocument();

    expect(screen.getByText('ROUTE CONTROL')).toBeInTheDocument();
    expect(screen.getByText('NO INCIDENT DATA WAS CHANGED')).toBeInTheDocument();
    expect(screen.getByText('END OF REQUEST // RETURN AVAILABLE')).toBeInTheDocument();
  });
});
