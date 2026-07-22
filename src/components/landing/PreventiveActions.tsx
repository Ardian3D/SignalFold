import React from 'react';

export const PreventiveActions: React.FC = () => {
  return (
    <div className="space-y-5 pb-6 border-b border-[#D8D4C8]">
      {/* Header / Section Label & Status */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase"
        style={{ fontFamily: 'var(--font-technical)' }}
      >
        <span className="text-[#0A0A0A]">
          10 / PREVENTIVE ACTIONS
        </span>

        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#1C1A14] border border-[#383322] text-[#EAB308] text-[10px] font-bold">
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-full bg-[#EAB308]"
          />
          DRAFT ACTION PLAN / HUMAN APPROVAL REQUIRED
        </div>
      </div>

      {/* Introductory copy */}
      <p
        className="text-sm sm:text-base text-[#2A2B28] leading-relaxed max-w-none"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        The following preventive actions respond to gaps identified in the current incident record. They are proposed follow-ups only and must be reviewed, assigned, and approved before becoming operational commitments.
      </p>

      {/* Continuous Structured Action List */}
      <div className="divide-y divide-[#D8D4C8] border-t border-b border-[#D8D4C8]">
        {/* Row A-01 */}
        <div className="py-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start">
          <div
            className="w-12 shrink-0 text-[#7A7C74] font-mono font-bold text-xs sm:text-sm pt-0.5"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            A-01
          </div>
          <div className="flex-1 space-y-2.5 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4
                className="text-xs sm:text-sm font-mono font-bold text-[#0A0A0A] uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                IMPROVE PAYMENT FAILURE DETECTION
              </h4>
              <span
                className="px-2 py-0.5 rounded-[2px] bg-[#EFECE2] border border-[#D8D4C8] text-[#5A5C56] text-[10px] font-mono font-bold tracking-wider uppercase shrink-0"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                PROPOSED ACTION
              </span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              {/* PROPOSED ACTION */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  PROPOSED ACTION:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Define and validate automated detection coverage for repeated card-payment failures affecting the Payments API.
                </p>
              </div>

              {/* ADDRESSES */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  ADDRESSES:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1 font-mono font-bold text-[#0A0A0A]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  CUSTOMER-LED DETECTION
                </p>
              </div>

              {/* REQUIRED EVIDENCE */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  REQUIRED EVIDENCE:
                </span>
                <p
                  className="text-[#5A5C56] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Documented alert criteria, validation results, and confirmed incident-routing behavior.
                </p>
              </div>

              {/* PRIORITY */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  PRIORITY:
                </span>
                <div className="flex-1 flex items-center">
                  <span
                    className="text-[#0A0A0A] font-mono font-bold tracking-wider"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    HIGH
                  </span>
                </div>
              </div>

              {/* STATUS */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  STATUS:
                </span>
                <div className="flex-1 flex items-center gap-1.5">
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] bg-[#1C1A14] border border-[#383322] text-[#EAB308] text-[9px] font-bold"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    <span className="w-1 h-1 rounded-full bg-[#EAB308]" />
                    PROPOSED / NOT APPROVED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row A-02 */}
        <div className="py-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start">
          <div
            className="w-12 shrink-0 text-[#7A7C74] font-mono font-bold text-xs sm:text-sm pt-0.5"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            A-02
          </div>
          <div className="flex-1 space-y-2.5 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4
                className="text-xs sm:text-sm font-mono font-bold text-[#0A0A0A] uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                ISOLATE DEPLOYMENT CHANGE SCOPE
              </h4>
              <span
                className="px-2 py-0.5 rounded-[2px] bg-[#EFECE2] border border-[#D8D4C8] text-[#5A5C56] text-[10px] font-mono font-bold tracking-wider uppercase shrink-0"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                PROPOSED ACTION
              </span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              {/* PROPOSED ACTION */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  PROPOSED ACTION:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Create a repeatable review process for comparing payment-service deployments against incident symptoms and affected components.
                </p>
              </div>

              {/* ADDRESSES */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  ADDRESSES:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1 font-mono font-bold text-[#0A0A0A]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  CHANGE SCOPE NOT YET ISOLATED
                </p>
              </div>

              {/* REQUIRED EVIDENCE */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  REQUIRED EVIDENCE:
                </span>
                <p
                  className="text-[#5A5C56] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Linked deployment changes, technical findings, and an evidence-backed conclusion.
                </p>
              </div>

              {/* PRIORITY */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  PRIORITY:
                </span>
                <div className="flex-1 flex items-center">
                  <span
                    className="text-[#0A0A0A] font-mono font-bold tracking-wider"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    HIGH
                  </span>
                </div>
              </div>

              {/* STATUS */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  STATUS:
                </span>
                <div className="flex-1 flex items-center gap-1.5">
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] bg-[#1C1A14] border border-[#383322] text-[#EAB308] text-[9px] font-bold"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    <span className="w-1 h-1 rounded-full bg-[#EAB308]" />
                    PROPOSED / NOT APPROVED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row A-03 */}
        <div className="py-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start">
          <div
            className="w-12 shrink-0 text-[#7A7C74] font-mono font-bold text-xs sm:text-sm pt-0.5"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            A-03
          </div>
          <div className="flex-1 space-y-2.5 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4
                className="text-xs sm:text-sm font-mono font-bold text-[#0A0A0A] uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                RECONCILE CUSTOMER AND FINANCIAL IMPACT
              </h4>
              <span
                className="px-2 py-0.5 rounded-[2px] bg-[#EFECE2] border border-[#D8D4C8] text-[#5A5C56] text-[10px] font-mono font-bold tracking-wider uppercase shrink-0"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                PROPOSED ACTION
              </span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              {/* PROPOSED ACTION */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  PROPOSED ACTION:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Establish a documented reconciliation step for failed payment attempts, confirmed customer impact, and final financial exposure.
                </p>
              </div>

              {/* ADDRESSES */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  ADDRESSES:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1 font-mono font-bold text-[#0A0A0A]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  CUSTOMER AND FINANCIAL IMPACT REMAIN INCOMPLETE
                </p>
              </div>

              {/* REQUIRED EVIDENCE */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  REQUIRED EVIDENCE:
                </span>
                <p
                  className="text-[#5A5C56] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Reviewed payment records and a human-confirmed impact summary.
                </p>
              </div>

              {/* PRIORITY */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  PRIORITY:
                </span>
                <div className="flex-1 flex items-center">
                  <span
                    className="text-[#0A0A0A] font-mono font-bold tracking-wider"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    MEDIUM
                  </span>
                </div>
              </div>

              {/* STATUS */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  STATUS:
                </span>
                <div className="flex-1 flex items-center gap-1.5">
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] bg-[#1C1A14] border border-[#383322] text-[#EAB308] text-[9px] font-bold"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    <span className="w-1 h-1 rounded-full bg-[#EAB308]" />
                    PROPOSED / NOT APPROVED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row A-04 */}
        <div className="py-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start">
          <div
            className="w-12 shrink-0 text-[#7A7C74] font-mono font-bold text-xs sm:text-sm pt-0.5"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            A-04
          </div>
          <div className="flex-1 space-y-2.5 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4
                className="text-xs sm:text-sm font-mono font-bold text-[#0A0A0A] uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                STANDARDIZE RECOVERY VERIFICATION
              </h4>
              <span
                className="px-2 py-0.5 rounded-[2px] bg-[#EFECE2] border border-[#D8D4C8] text-[#5A5C56] text-[10px] font-mono font-bold tracking-wider uppercase shrink-0"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                PROPOSED ACTION
              </span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              {/* PROPOSED ACTION */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  PROPOSED ACTION:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Require recovery evidence, remaining-risk documentation, critical-task review, and a confirmed resolution timestamp before an incident may be resolved.
                </p>
              </div>

              {/* ADDRESSES */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  ADDRESSES:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1 font-mono font-bold text-[#0A0A0A]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  RECOVERY EVIDENCE IS NOT YET COMPLETE
                </p>
              </div>

              {/* REQUIRED EVIDENCE */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  REQUIRED EVIDENCE:
                </span>
                <p
                  className="text-[#5A5C56] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Completed resolution checklist and authorized human confirmation.
                </p>
              </div>

              {/* PRIORITY */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  PRIORITY:
                </span>
                <div className="flex-1 flex items-center">
                  <span
                    className="text-[#EF4444] font-mono font-bold tracking-wider"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    CRITICAL
                  </span>
                </div>
              </div>

              {/* STATUS */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  STATUS:
                </span>
                <div className="flex-1 flex items-center gap-1.5">
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] bg-[#1C1A14] border border-[#383322] text-[#EAB308] text-[9px] font-bold"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    <span className="w-1 h-1 rounded-full bg-[#EAB308]" />
                    PROPOSED / NOT APPROVED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
