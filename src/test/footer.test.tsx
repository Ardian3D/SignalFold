import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LandingFooter } from '@/components/landing/LandingFooter';

describe('SignalFold LandingFooter', () => {
  it('renders the official BrandLogo and canonical descriptors', () => {
    render(
      <MemoryRouter>
        <LandingFooter />
      </MemoryRouter>
    );

    // Verify Brand Logo
    const logoElement = screen.getByAltText('SignalFold');
    expect(logoElement).toBeInTheDocument();
    expect(logoElement.tagName).toBe('IMG');

    // Verify Descriptor & Tagline
    const descriptors = screen.getAllByText('AI-ASSISTED INCIDENT COMMAND');
    expect(descriptors.length).toBeGreaterThanOrEqual(1);
    expect(descriptors[0]).toBeInTheDocument();
    expect(screen.getByText('TURN SIGNALS INTO ACTION.')).toBeInTheDocument();
  });

  it('contains the correct internal section anchor links', () => {
    render(
      <MemoryRouter>
        <LandingFooter />
      </MemoryRouter>
    );

    // Check raw <a> anchors for page section scrolls
    const productLink = screen.getByRole('link', { name: 'PRODUCT' });
    expect(productLink).toHaveAttribute('href', '#product');

    const workflowLink = screen.getByRole('link', { name: 'WORKFLOW' });
    expect(workflowLink).toHaveAttribute('href', '#workflow');

    const incidentRoomLink = screen.getByRole('link', { name: 'INCIDENT ROOM' });
    expect(incidentRoomLink).toHaveAttribute('href', '#incident-room');

    const postmortemLink = screen.getByRole('link', { name: 'POSTMORTEM' });
    expect(postmortemLink).toHaveAttribute('href', '#postmortem');
  });

  it('contains correctly mapped canonical application route links', () => {
    render(
      <MemoryRouter>
        <LandingFooter />
      </MemoryRouter>
    );

    const demoLink = screen.getByRole('link', { name: 'START A DEMO INCIDENT' });
    expect(demoLink).toHaveAttribute('href', '/demo');

    const dashboardLink = screen.getByRole('link', { name: 'OPEN DASHBOARD' });
    expect(dashboardLink).toHaveAttribute('href', '/app');

    const signInLink = screen.getByRole('link', { name: 'SIGN IN' });
    expect(signInLink).toHaveAttribute('href', '/login');
  });

  it('contains the privacy and terms destination routes', () => {
    render(
      <MemoryRouter>
        <LandingFooter />
      </MemoryRouter>
    );

    const privacyLink = screen.getByRole('link', { name: 'PRIVACY' });
    expect(privacyLink).toHaveAttribute('href', '/privacy');

    const termsLink = screen.getByRole('link', { name: 'TERMS' });
    expect(termsLink).toHaveAttribute('href', '/terms');
  });

  it('provides an accessible BACK TO TOP button and handles smooth scrolling on click', () => {
    // Mock global window.scrollTo method
    const scrollToMock = vi.fn();
    vi.stubGlobal('scrollTo', scrollToMock);

    render(
      <MemoryRouter>
        <LandingFooter />
      </MemoryRouter>
    );

    const backToTopButton = screen.getByRole('button', { name: 'Back to top of page' });
    expect(backToTopButton).toBeInTheDocument();

    // Trigger click on Back To Top
    fireEvent.click(backToTopButton);
    expect(scrollToMock).toHaveBeenCalledTimes(1);
    expect(scrollToMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        top: 0,
      })
    );

    vi.unstubAllGlobals();
  });

  it('renders technical status metadata details', () => {
    render(
      <MemoryRouter>
        <LandingFooter />
      </MemoryRouter>
    );

    expect(screen.getByText('SYSTEM')).toBeInTheDocument();
    expect(screen.getByText('STATUS')).toBeInTheDocument();
    expect(screen.getByText('OPERATIONAL DESIGN')).toBeInTheDocument();
    expect(screen.getByText('AUTHORITY')).toBeInTheDocument();
    expect(screen.getByText('HUMAN CONTROLLED')).toBeInTheDocument();
  });

  it('renders bottom system rail with branding and human control markers', () => {
    render(
      <MemoryRouter>
        <LandingFooter />
      </MemoryRouter>
    );

    expect(screen.getByText('AI PROPOSES')).toBeInTheDocument();
    expect(screen.getByText('HUMANS DECIDE')).toBeInTheDocument();
    expect(screen.getByText('END OF RECORD // READY FOR RESPONSE')).toBeInTheDocument();
  });
});
