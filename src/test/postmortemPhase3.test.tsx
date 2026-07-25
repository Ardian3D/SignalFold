import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { RootLayout } from '@/components/layout/RootLayout';
import { AppShell } from '@/layouts/AppShell';
import { PostmortemFoundationPage } from '@/pages/PostmortemFoundationPage';

const getTestRouter = () => {
  return createMemoryRouter(
    [
      {
        path: '/app/incidents/resolved-seed/postmortem',
        element: (
          <RootLayout>
            <AppShell>
              <PostmortemFoundationPage />
            </AppShell>
          </RootLayout>
        ),
      },
    ],
    { initialEntries: ['/app/incidents/resolved-seed/postmortem'] }
  );
};

describe('Postmortem Phase 03 Regeneration Confirmation & Snapshot Preview Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const openReadinessDrawer = () => {
    const router = getTestRouter();
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );

    // Open Generation Readiness Drawer
    const triggerBtn = screen.getByRole('button', { name: /REVIEW GENERATION READINESS/i });
    expect(triggerBtn).toBeInTheDocument();
    fireEvent.click(triggerBtn);

    // Ensure drawer is open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  };

  it('verifies Phase 03 elements are hidden before Phase 02 validation is run', () => {
    openReadinessDrawer();

    // Check that Phase 03 elements/sections are not present in the document
    expect(screen.queryByText('09 / REGENERATION CONSEQUENCES')).not.toBeInTheDocument();
    expect(screen.queryByText('10 / REGENERATION ACKNOWLEDGEMENTS')).not.toBeInTheDocument();
    expect(screen.queryByText('11 / APPROVED VERSION SNAPSHOT PREVIEW')).not.toBeInTheDocument();
    expect(screen.queryByText('12 / NEW DRAFT VERSION PREVIEW')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /REVIEW REGENERATION CONFIRMATION/i })).not.toBeInTheDocument();
  });

  it('verifies that Phase 02 validation reveals the Review Regeneration Confirmation trigger action', () => {
    openReadinessDrawer();

    // Trigger Phase 02 Validation
    const validateBtn = screen.getByRole('button', { name: /VALIDATE GENERATION READINESS/i });
    fireEvent.click(validateBtn);

    // Review Regeneration Confirmation button should now be visible
    const reviewBtn = screen.getByRole('button', { name: /REVIEW REGENERATION CONFIRMATION/i });
    expect(reviewBtn).toBeInTheDocument();

    // But Phase 03 subsections themselves should still be hidden/collapsed
    expect(screen.queryByText('09 / REGENERATION CONSEQUENCES')).not.toBeInTheDocument();
  });

  it('verifies clicking review button reveals Phase 03 subsections with correct default unchecked states', () => {
    openReadinessDrawer();

    // Run validation
    fireEvent.click(screen.getByRole('button', { name: /VALIDATE GENERATION READINESS/i }));

    // Click Review Regeneration Confirmation
    fireEvent.click(screen.getByRole('button', { name: /REVIEW REGENERATION CONFIRMATION/i }));

    // Sections should now be revealed
    expect(screen.getByText('09 / REGENERATION CONSEQUENCES')).toBeInTheDocument();
    expect(screen.getByText('10 / REGENERATION ACKNOWLEDGEMENTS')).toBeInTheDocument();
    expect(screen.getByText('11 / APPROVED VERSION SNAPSHOT PREVIEW')).toBeInTheDocument();
    expect(screen.getByText('12 / NEW DRAFT VERSION PREVIEW')).toBeInTheDocument();
    expect(screen.getByText('POSTMORTEM VERSION SAFETY CONTRACT')).toBeInTheDocument();

    // Checkboxes must be unchecked by default
    const checkbox1 = screen.getByLabelText(/I UNDERSTAND THAT REGENERATION WOULD CREATE A NEW DRAFT VERSION/i) as HTMLInputElement;
    const checkbox2 = screen.getByLabelText(/I UNDERSTAND THAT THE PRIOR APPROVED VERSION MUST BE PRESERVED/i) as HTMLInputElement;
    const checkbox3 = screen.getByLabelText(/I UNDERSTAND THAT APPROVAL DOES NOT CARRY FORWARD/i) as HTMLInputElement;

    expect(checkbox1.checked).toBe(false);
    expect(checkbox2.checked).toBe(false);
    expect(checkbox3.checked).toBe(false);

    // Confirmation State must be INCOMPLETE (using getAllByText to avoid ambiguity)
    const confirmationStates = screen.getAllByText('INCOMPLETE');
    expect(confirmationStates.length).toBeGreaterThan(0);

    // Check uncompleted list is visible
    expect(screen.getByText('NEW DRAFT CREATION NOT ACKNOWLEDGED')).toBeInTheDocument();
    expect(screen.getByText('APPROVED VERSION PRESERVATION NOT ACKNOWLEDGED')).toBeInTheDocument();
    expect(screen.getByText('APPROVAL RESET NOT ACKNOWLEDGED')).toBeInTheDocument();

    // Action Validate Version Plan must be disabled
    const validatePlanBtn = screen.getByRole('button', { name: /VALIDATE VERSION PLAN/i });
    expect(validatePlanBtn).toBeDisabled();
  });

  it('verifies that checking all checkboxes enables Validate Version Plan and updates status', () => {
    openReadinessDrawer();
    fireEvent.click(screen.getByRole('button', { name: /VALIDATE GENERATION READINESS/i }));
    fireEvent.click(screen.getByRole('button', { name: /REVIEW REGENERATION CONFIRMATION/i }));

    const checkbox1 = screen.getByLabelText(/I UNDERSTAND THAT REGENERATION WOULD CREATE A NEW DRAFT VERSION/i);
    const checkbox2 = screen.getByLabelText(/I UNDERSTAND THAT THE PRIOR APPROVED VERSION MUST BE PRESERVED/i);
    const checkbox3 = screen.getByLabelText(/I UNDERSTAND THAT APPROVAL DOES NOT CARRY FORWARD/i);

    // Toggle checkboxes
    fireEvent.click(checkbox1);
    fireEvent.click(checkbox2);
    fireEvent.click(checkbox3);

    // Confirmation state changes to COMPLETE
    expect(screen.getByText('LOCAL ACKNOWLEDGEMENTS COMPLETE')).toBeInTheDocument();

    // Unresolved checklist is gone
    expect(screen.queryByText('NEW DRAFT CREATION NOT ACKNOWLEDGED')).not.toBeInTheDocument();

    // Action Validate Version Plan is enabled
    const validatePlanBtn = screen.getByRole('button', { name: /VALIDATE VERSION PLAN/i });
    expect(validatePlanBtn).not.toBeDisabled();
  });

  it('verifies validating the version plan displays success and incomplete warnings, and reveals Section 13 Local Regeneration Plan', () => {
    openReadinessDrawer();
    fireEvent.click(screen.getByRole('button', { name: /VALIDATE GENERATION READINESS/i }));
    fireEvent.click(screen.getByRole('button', { name: /REVIEW REGENERATION CONFIRMATION/i }));

    fireEvent.click(screen.getByLabelText(/I UNDERSTAND THAT REGENERATION WOULD CREATE A NEW DRAFT VERSION/i));
    fireEvent.click(screen.getByLabelText(/I UNDERSTAND THAT THE PRIOR APPROVED VERSION MUST BE PRESERVED/i));
    fireEvent.click(screen.getByLabelText(/I UNDERSTAND THAT APPROVAL DOES NOT CARRY FORWARD/i));

    // Validate Version Plan
    fireEvent.click(screen.getByRole('button', { name: /VALIDATE VERSION PLAN/i }));

    // Success and incomplete validation results
    expect(screen.getByText('RESULT 01: REGENERATION CONFIRMATION STRUCTURE VALID')).toBeInTheDocument();
    expect(screen.getByText('RESULT 02: VERSION SNAPSHOT READINESS INCOMPLETE')).toBeInTheDocument();
    expect(screen.getByText('RESULT 03: GENERATION AND AUTHORITY READINESS INCOMPLETE')).toBeInTheDocument();

    // Section 13 is revealed
    expect(screen.getByText('13 / LOCAL REGENERATION PLAN')).toBeInTheDocument();

    // State is CURRENT LOCAL ACKNOWLEDGEMENTS
    expect(screen.getByText('CURRENT LOCAL ACKNOWLEDGEMENTS')).toBeInTheDocument();
  });

  it('verifies modifying acknowledgements after plan validation changes the plan state but does not hide Section 13', () => {
    openReadinessDrawer();
    fireEvent.click(screen.getByRole('button', { name: /VALIDATE GENERATION READINESS/i }));
    fireEvent.click(screen.getByRole('button', { name: /REVIEW REGENERATION CONFIRMATION/i }));

    const checkbox1 = screen.getByLabelText(/I UNDERSTAND THAT REGENERATION WOULD CREATE A NEW DRAFT VERSION/i);
    fireEvent.click(checkbox1);
    fireEvent.click(screen.getByLabelText(/I UNDERSTAND THAT THE PRIOR APPROVED VERSION MUST BE PRESERVED/i));
    fireEvent.click(screen.getByLabelText(/I UNDERSTAND THAT APPROVAL DOES NOT CARRY FORWARD/i));

    fireEvent.click(screen.getByRole('button', { name: /VALIDATE VERSION PLAN/i }));

    // Uncheck checkbox1 to trigger state change
    fireEvent.click(checkbox1);

    // State changes to ACKNOWLEDGEMENTS CHANGED
    expect(screen.getByText('ACKNOWLEDGEMENTS CHANGED')).toBeInTheDocument();

    // Section 13 Local Regeneration Plan should still be visible in the document
    expect(screen.getByText('13 / LOCAL REGENERATION PLAN')).toBeInTheDocument();
  });

  it('verifies Reset Confirmation Preview button resets all acknowledgements and validation states', () => {
    openReadinessDrawer();
    fireEvent.click(screen.getByRole('button', { name: /VALIDATE GENERATION READINESS/i }));
    fireEvent.click(screen.getByRole('button', { name: /REVIEW REGENERATION CONFIRMATION/i }));

    const checkbox1 = screen.getByLabelText(/I UNDERSTAND THAT REGENERATION WOULD CREATE A NEW DRAFT VERSION/i) as HTMLInputElement;
    fireEvent.click(checkbox1);
    fireEvent.click(screen.getByLabelText(/I UNDERSTAND THAT THE PRIOR APPROVED VERSION MUST BE PRESERVED/i));
    fireEvent.click(screen.getByLabelText(/I UNDERSTAND THAT APPROVAL DOES NOT CARRY FORWARD/i));

    fireEvent.click(screen.getByRole('button', { name: /VALIDATE VERSION PLAN/i }));

    // Reset Confirmation Preview
    fireEvent.click(screen.getByRole('button', { name: /RESET CONFIRMATION PREVIEW/i }));

    // All checkboxes are unchecked
    expect(checkbox1.checked).toBe(false);

    // Local validation and Section 13 are hidden
    expect(screen.queryByText('13 / LOCAL REGENERATION PLAN')).not.toBeInTheDocument();
    expect(screen.queryByText('RESULT 01: REGENERATION CONFIRMATION STRUCTURE VALID')).not.toBeInTheDocument();

    // Confirmation State back to INCOMPLETE
    const confirmationStates = screen.getAllByText('INCOMPLETE');
    expect(confirmationStates.length).toBeGreaterThan(0);
  });

  it('verifies closing and reopening the drawer resets the preview state entirely and collapses Phase 03', () => {
    openReadinessDrawer();
    fireEvent.click(screen.getByRole('button', { name: /VALIDATE GENERATION READINESS/i }));
    fireEvent.click(screen.getByRole('button', { name: /REVIEW REGENERATION CONFIRMATION/i }));

    fireEvent.click(screen.getByLabelText(/I UNDERSTAND THAT REGENERATION WOULD CREATE A NEW DRAFT VERSION/i));
    fireEvent.click(screen.getByLabelText(/I UNDERSTAND THAT THE PRIOR APPROVED VERSION MUST BE PRESERVED/i));
    fireEvent.click(screen.getByLabelText(/I UNDERSTAND THAT APPROVAL DOES NOT CARRY FORWARD/i));
    fireEvent.click(screen.getByRole('button', { name: /VALIDATE VERSION PLAN/i }));

    // Close the drawer
    fireEvent.click(screen.getByRole('button', { name: /CLOSE READINESS REVIEW/i }));

    // Reopen the drawer
    const triggerBtn = screen.getByRole('button', { name: /REVIEW GENERATION READINESS/i });
    fireEvent.click(triggerBtn);

    // Phase 03 should be completely collapsed
    expect(screen.queryByText('09 / REGENERATION CONSEQUENCES')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /REVIEW REGENERATION CONFIRMATION/i })).not.toBeInTheDocument();
  });
});
