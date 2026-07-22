import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LandingHero } from '@/components/landing/LandingHero';
import { SignalFlowVisual } from '@/components/landing/SignalFlowVisual';

describe('SignalFold LandingHero & SignalFlowVisual', () => {
  it('renders exact headline, eyebrow, and supporting text copy', () => {
    render(
      <MemoryRouter>
        <LandingHero />
      </MemoryRouter>
    );

    expect(screen.getByText('AI-ASSISTED INCIDENT COMMAND')).toBeInTheDocument();
    expect(screen.getByText(/TURN SIGNALS/i)).toBeInTheDocument();
    expect(screen.getByText('ACTION.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Transform scattered incident reports into structured response plans, realtime coordination, and actionable postmortems.'
      )
    ).toBeInTheDocument();
  });

  it('renders primary and secondary CTAs with correct destinations', () => {
    render(
      <MemoryRouter>
        <LandingHero />
      </MemoryRouter>
    );

    const openDemoCta = screen.getAllByText('OPEN DEMO')[0].closest('a');
    expect(openDemoCta).toHaveAttribute('href', '/demo');

    const workflowCta = screen.getByText('VIEW THE WORKFLOW').closest('a');
    expect(workflowCta).toHaveAttribute('href', '#workflow');
  });

  it('renders technical metadata status rail and indices', () => {
    render(
      <MemoryRouter>
        <LandingHero />
      </MemoryRouter>
    );

    expect(screen.getByText('BASE44 BACKEND')).toBeInTheDocument();
    expect(screen.getByText('DEEPSEEK INTELLIGENCE')).toBeInTheDocument();
    expect(screen.getByText('REALTIME RESPONSE')).toBeInTheDocument();

    expect(screen.getByText('DETECT')).toBeInTheDocument();
    expect(screen.getByText('COORDINATE')).toBeInTheDocument();
    expect(screen.getAllByText('RESOLVE').length).toBeGreaterThan(0);
  });

  it('renders SignalFlowVisual with accessibility label and node badges', () => {
    render(<SignalFlowVisual />);

    const visual = screen.getByLabelText('Abstract Incident Signal Flow Topology');
    expect(visual).toBeInTheDocument();

    expect(screen.getByText('REPORT')).toBeInTheDocument();
    expect(screen.getByText('TRIAGE')).toBeInTheDocument();
    expect(screen.getByText('ASSIGN')).toBeInTheDocument();
    expect(screen.getByText('RESPOND')).toBeInTheDocument();
    expect(screen.getByText('RESOLVE')).toBeInTheDocument();
  });
});
