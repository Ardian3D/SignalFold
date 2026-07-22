import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LandingNavbar } from '@/components/landing/LandingNavbar';

describe('LandingNavbar Component', () => {
  it('renders official brand logo and system index label', () => {
    render(
      <MemoryRouter>
        <LandingNavbar />
      </MemoryRouter>
    );

    const logoImg = screen.getByAltText('SignalFold');
    expect(logoImg).toBeInTheDocument();

    const systemTag = screen.getByText(/SYSTEM \/ SIGNALFOLD/i);
    expect(systemTag).toBeInTheDocument();
  });

  it('renders desktop navigation links', () => {
    render(
      <MemoryRouter>
        <LandingNavbar />
      </MemoryRouter>
    );

    expect(screen.getByText('HOME')).toBeInTheDocument();
    expect(screen.getByText('WORKFLOW')).toBeInTheDocument();
    expect(screen.getByText('INCIDENT ROOM')).toBeInTheDocument();
    expect(screen.getByText('POSTMORTEM')).toBeInTheDocument();
  });

  it('renders SIGN IN and OPEN DEMO actions', () => {
    render(
      <MemoryRouter>
        <LandingNavbar />
      </MemoryRouter>
    );

    expect(screen.getByText('SIGN IN')).toBeInTheDocument();
    expect(screen.getByText('OPEN DEMO')).toBeInTheDocument();
  });

  it('toggles mobile menu on button click', () => {
    render(
      <MemoryRouter>
        <LandingNavbar />
      </MemoryRouter>
    );

    const toggleBtn = screen.getByRole('button', { name: /open navigation menu/i });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);

    const closeBtn = screen.getByRole('button', { name: /close navigation menu/i });
    expect(closeBtn).toBeInTheDocument();
  });
});
