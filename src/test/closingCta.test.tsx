import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ClosingCtaSection } from '@/components/landing/ClosingCtaSection';

describe('SignalFold ClosingCtaSection', () => {
  it('renders exact eyebrow, headline, and supporting text copy', () => {
    render(
      <MemoryRouter>
        <ClosingCtaSection />
      </MemoryRouter>
    );

    expect(screen.getByText('05 / READY FOR RESPONSE')).toBeInTheDocument();
    expect(screen.getByText(/THE NEXT SIGNAL/i)).toBeInTheDocument();
    expect(screen.getByText(/SHOULD NOT GET LOST/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        'Bring reports, severity, ownership, response tasks, realtime activity, resolution, and postmortem learning into one controlled incident workflow.'
      )
    ).toBeInTheDocument();
  });

  it('renders primary and secondary CTAs with correct destinations', () => {
    render(
      <MemoryRouter>
        <ClosingCtaSection />
      </MemoryRouter>
    );

    const primaryCta = screen.getByText('START A DEMO INCIDENT').closest('a');
    expect(primaryCta).toHaveAttribute('href', '/demo');

    const secondaryCta = screen.getByText('OPEN DASHBOARD').closest('a');
    expect(secondaryCta).toHaveAttribute('href', '/app');
  });

  it('renders technical assurance rail with correct titles', () => {
    render(
      <MemoryRouter>
        <ClosingCtaSection />
      </MemoryRouter>
    );

    expect(screen.getByText('AI ASSISTS')).toBeInTheDocument();
    expect(screen.getByText('HUMANS DECIDE')).toBeInTheDocument();
    expect(screen.getByText('EVERY ACTION TRACEABLE')).toBeInTheDocument();
  });

  it('has id="closing-cta" and overflow-hidden for layout precision', () => {
    render(
      <MemoryRouter>
        <ClosingCtaSection />
      </MemoryRouter>
    );

    const section = screen.getByLabelText('SignalFold Closing Action Call');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('id', 'closing-cta');
  });
});
