import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IncidentCommandSection } from '@/components/landing/IncidentCommandSection';

describe('IncidentCommandSection Component', () => {
  it('renders section header, eyebrow label, and technical status rail', () => {
    render(<IncidentCommandSection />);

    expect(screen.getByText('03 / INCIDENT COMMAND')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /ONE INCIDENT\.\s*ONE SHARED COMMAND\./i,
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'SignalFold keeps severity, ownership, response tasks, timeline activity, and recovery status inside one operational view. AI proposes the next move. Humans remain in control.'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('REALTIME COORDINATION')).toBeInTheDocument();
    expect(screen.getByText('HUMAN AUTHORITY')).toBeInTheDocument();
    expect(screen.getByText('TRACEABLE ACTIONS')).toBeInTheDocument();
  });

  it('renders application preview frame top bar and incident identity header', () => {
    render(<IncidentCommandSection />);

    expect(screen.getByText('SIGNALFOLD / INCIDENT ROOM')).toBeInTheDocument();
    expect(screen.getByText('LIVE OPERATION')).toBeInTheDocument();

    // Incident identity header fields
    expect(screen.getByText('SF-2026-0042')).toBeInTheDocument();
    expect(screen.getByText('NORTHSTAR COMMERCE')).toBeInTheDocument();
    expect(screen.getAllByText('PAYMENTS API').length).toBeGreaterThan(0);
    expect(
      screen.getByText('Checkout payments failing after latest deployment')
    ).toBeInTheDocument();
    expect(screen.getByText('SEV1 / CRITICAL')).toBeInTheDocument();
    expect(screen.getByText('INVESTIGATING')).toBeInTheDocument();
    expect(screen.getAllByText('MAYA CHEN').length).toBeGreaterThan(0);
    expect(screen.getByText('00:18:42')).toBeInTheDocument();
    expect(screen.getByText('ADD UPDATE')).toBeInTheDocument();
    expect(screen.getByText('CHANGE STATUS')).toBeInTheDocument();
  });

  it('renders Activity Timeline with 5 chronological events and metadata header', () => {
    render(<IncidentCommandSection />);

    expect(screen.getByText('01 / ACTIVITY TIMELINE')).toBeInTheDocument();
    expect(screen.getByText('LATEST FIRST')).toBeInTheDocument();

    // Verify 5 events
    expect(
      screen.getByText('Incident created from incoming customer reports.')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'AI analysis completed — SEV1 suggested with 94% confidence.'
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText('AI SUGGESTION').length).toBeGreaterThan(0);
    expect(
      screen.getByText('Accepted severity recommendation: SEV1 / CRITICAL.')
    ).toBeInTheDocument();
    expect(screen.getByText('Assigned as Incident Commander.')).toBeInTheDocument();
    expect(
      screen.getByText('Claimed task: Compare latest deployment changes.')
    ).toBeInTheDocument();

    // Verify timestamps and actors
    expect(screen.getAllByText('06:14:08').length).toBeGreaterThan(0);
    expect(screen.getByText('SYSTEM')).toBeInTheDocument();
    expect(screen.getByText('06:15:02')).toBeInTheDocument();
    expect(screen.getByText('DEEPSEEK')).toBeInTheDocument();
    expect(screen.getByText('06:16:21')).toBeInTheDocument();
    expect(screen.getByText('06:17:06')).toBeInTheDocument();
    expect(screen.getByText('06:18:42')).toBeInTheDocument();
    expect(screen.getAllByText('ALEX RIVERA').length).toBeGreaterThan(0);
  });

  it('renders Response Tasks panel with 5 tasks and status counts', () => {
    render(<IncidentCommandSection />);

    expect(screen.getByText('02 / RESPONSE TASKS')).toBeInTheDocument();
    expect(screen.getByText('3 OPEN')).toBeInTheDocument();
    expect(screen.getByText('1 ACTIVE')).toBeInTheDocument();

    // Verify task titles
    expect(
      screen.getByText('Compare latest deployment changes')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Confirm payment gateway health')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Run checkout transaction test')
    ).toBeInTheDocument();
    expect(screen.getByText('Prepare rollback')).toBeInTheDocument();
    expect(
      screen.getByText('Draft customer-facing status update')
    ).toBeInTheDocument();

    // Verify statuses and assignees
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();
    expect(screen.getByText('READY')).toBeInTheDocument();
    expect(screen.getByText('DONE')).toBeInTheDocument();
    expect(screen.getAllByText('OPEN')).toHaveLength(2);
    expect(screen.getAllByText('UNCLAIMED')).toHaveLength(2);
    expect(screen.getAllByText('JORDAN LEE').length).toBeGreaterThan(0);
  });

  it('renders Responders panel with 3 online responders and assignments', () => {
    render(<IncidentCommandSection />);

    expect(screen.getByText('03 / RESPONDERS')).toBeInTheDocument();
    expect(screen.getByText('3 ONLINE')).toBeInTheDocument();

    // Verify responders
    expect(screen.getByText('INCIDENT MANAGER')).toBeInTheDocument();
    expect(screen.getAllByText('RESPONDER')).toHaveLength(2);

    expect(screen.getAllByText('COMMANDER').length).toBeGreaterThan(0);
    expect(screen.getByText('DEPLOYMENT REVIEW')).toBeInTheDocument();
    expect(screen.getByText('STATUS UPDATE')).toBeInTheDocument();

    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('WORKING')).toBeInTheDocument();
    expect(screen.getByText('AVAILABLE')).toBeInTheDocument();
  });

  it('renders Incident Metadata panel with technical grid data', () => {
    render(<IncidentCommandSection />);

    expect(screen.getByText('04 / INCIDENT METADATA')).toBeInTheDocument();

    // Verify grid labels and values
    expect(screen.getByText('CATEGORY')).toBeInTheDocument();
    expect(screen.getAllByText('PAYMENTS').length).toBeGreaterThan(0);

    expect(screen.getByText('AFFECTED SERVICE')).toBeInTheDocument();
    expect(screen.getAllByText('PAYMENTS API').length).toBeGreaterThan(0);

    expect(screen.getByText('IMPACT')).toBeInTheDocument();
    expect(screen.getByText('37 CUSTOMER REPORTS')).toBeInTheDocument();

    expect(screen.getByText('SOURCE')).toBeInTheDocument();
    expect(screen.getByText('INCOMING SUPPORT REPORTS')).toBeInTheDocument();

    expect(screen.getByText('AI CONFIDENCE')).toBeInTheDocument();
    expect(screen.getAllByText('94%').length).toBeGreaterThan(0);

    expect(screen.getByText('RISK FLAG')).toBeInTheDocument();
    expect(screen.getAllByText('PAYMENT FAILURE').length).toBeGreaterThan(0);

    expect(screen.getByText('DETECTED')).toBeInTheDocument();
    expect(screen.getAllByText('06:14:08').length).toBeGreaterThan(0);

    expect(screen.getByText('VISIBILITY')).toBeInTheDocument();
    expect(screen.getByText('INTERNAL')).toBeInTheDocument();
  });

  it('has id="command" for anchor navigation', () => {
    const { container } = render(<IncidentCommandSection />);
    const section = container.querySelector('section#command');
    expect(section).toBeInTheDocument();
  });
});
