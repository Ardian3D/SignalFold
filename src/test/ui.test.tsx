import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Button,
  IconButton,
  Input,
  Textarea,
  Select,
  Checkbox,
  Switch,
  SearchInput,
  SeverityBadge,
  IncidentStatusBadge,
  StatusDot,
  Surface,
  Metric,
  Avatar,
  Tag,
  Dialog,
} from '@/components/ui';
import { InlineAlert, ProgressBar } from '@/components/feedback';

describe('SignalFold — UI Primitives & Accessibility Tests', () => {
  it('1. Button renders canonical variants and handles loading aria-busy', () => {
    const handleClick = vi.fn();
    const { rerender } = render(
      <Button variant="primary" onClick={handleClick}>
        Submit Incident
      </Button>
    );

    const btn = screen.getByText('Submit Incident');
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button variant="primary" isLoading loadingText="Saving...">
        Submit Incident
      </Button>
    );
    const loadingBtn = screen.getByRole('button');
    expect(loadingBtn).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });

  it('2. Button disabled cannot be clicked', () => {
    const handleClick = vi.fn();
    render(
      <Button variant="primary" disabled onClick={handleClick}>
        Disabled Action
      </Button>
    );

    const btn = screen.getByText('Disabled Action').closest('button');
    expect(btn).toBeDisabled();
    fireEvent.click(btn!);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('3. IconButton enforces accessible aria-label', () => {
    render(<IconButton icon={<span>Icon</span>} aria-label="Acknowledge alert" />);
    const btn = screen.getByRole('button', { name: 'Acknowledge alert' });
    expect(btn).toBeInTheDocument();
  });

  it('4. Input error sets aria-invalid and aria-describedby', () => {
    render(
      <Input
        label="Incident Code"
        errorMessage="Invalid incident code format"
        id="test-code"
      />
    );

    const input = screen.getByLabelText('Incident Code');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'test-code-error');
    expect(screen.getByText('Invalid incident code format')).toBeInTheDocument();
  });

  it('5. Checkbox toggles and maintains clickable label', () => {
    const handleChange = vi.fn();
    render(
      <Checkbox
        label="Acknowledge page SLA"
        onChange={handleChange}
      />
    );

    const label = screen.getByText('Acknowledge page SLA');
    fireEvent.click(label);
    expect(handleChange).toHaveBeenCalled();
  });

  it('6. Switch sets role="switch" and aria-checked', () => {
    render(
      <Switch
        label="Auto-routing"
        checked={true}
      />
    );

    const switchBtn = screen.getByRole('switch');
    expect(switchBtn).toHaveAttribute('aria-checked', 'true');
  });

  it('7. SearchInput uses type="search" and provides clear button', () => {
    const handleClear = vi.fn();
    render(
      <SearchInput
        label="Search"
        value="database-error"
        onClear={handleClear}
      />
    );

    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('type', 'search');

    const clearBtn = screen.getByRole('button', { name: 'Clear search text' });
    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalled();
  });

  it('8. SeverityBadge accepts all canonical severities (SEV1-SEV4)', () => {
    render(
      <div>
        <SeverityBadge level="SEV1" />
        <SeverityBadge level="SEV2" />
        <SeverityBadge level="SEV3" />
        <SeverityBadge level="SEV4" />
      </div>
    );

    expect(screen.getByText('SEV1 · Critical')).toBeInTheDocument();
    expect(screen.getByText('SEV2 · Major')).toBeInTheDocument();
    expect(screen.getByText('SEV3 · Moderate')).toBeInTheDocument();
    expect(screen.getByText('SEV4 · Low')).toBeInTheDocument();
  });

  it('9. IncidentStatusBadge renders canonical status labels', () => {
    render(
      <div>
        <IncidentStatusBadge status="triaging" />
        <IncidentStatusBadge status="resolved" />
      </div>
    );

    expect(screen.getByText('Triaging')).toBeInTheDocument();
    expect(screen.getByText('Resolved')).toBeInTheDocument();
  });

  it('10. InlineAlert renders with semantic role', () => {
    render(
      <InlineAlert
        variant="critical"
        title="SEV1 Outage Active"
        description="Database transaction rate dropped"
      />
    );

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText('SEV1 Outage Active')).toBeInTheDocument();
  });

  it('11. ProgressBar sets role="progressbar" and aria-valuenow', () => {
    render(<ProgressBar value={65} label="Analysis Progress" />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '65');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
  });

  it('12. Dialog renders title, description, and triggers onClose', () => {
    const handleClose = vi.fn();
    render(
      <Dialog
        isOpen={true}
        onClose={handleClose}
        title="Declare Incident"
        description="Fill details to proceed"
      >
        <p>Dialog Body</p>
      </Dialog>
    );

    expect(screen.getByText('Declare Incident')).toBeInTheDocument();
    expect(screen.getByText('Fill details to proceed')).toBeInTheDocument();
    expect(screen.getByText('Dialog Body')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: 'Close dialog' });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });
});
