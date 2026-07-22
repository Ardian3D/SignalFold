import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WorkflowSection, WORKFLOW_STEPS } from '@/components/landing/WorkflowSection';

describe('WorkflowSection Component', () => {
  it('renders section header, eyebrow label, and technical status rail', () => {
    render(<WorkflowSection />);

    expect(screen.getByText('02 / RESPONSE WORKFLOW')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /FROM FIRST SIGNAL TO VERIFIED RESOLUTION\./i,
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'SignalFold gives every incident a clear path—from an unstructured report to coordinated response and an actionable postmortem.'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('FIVE STAGES')).toBeInTheDocument();
    expect(screen.getByText('HUMAN CONTROLLED')).toBeInTheDocument();
    expect(screen.getByText('AI ASSISTED')).toBeInTheDocument();
  });

  it('renders all 5 workflow steps with exact headings, descriptions, and output labels', () => {
    render(<WorkflowSection />);

    WORKFLOW_STEPS.forEach((step) => {
      expect(screen.getByText(step.num)).toBeInTheDocument();
      expect(screen.getByText(step.heading)).toBeInTheDocument();
      expect(screen.getByText(step.description)).toBeInTheDocument();
      expect(screen.getByText(step.outputLabel)).toBeInTheDocument();
    });
  });

  it('has id="workflow" for anchor navigation from hero link', () => {
    const { container } = render(<WorkflowSection />);
    const section = container.querySelector('section#workflow');
    expect(section).toBeInTheDocument();
  });
});
