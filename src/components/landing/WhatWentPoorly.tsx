import React from 'react';

export const WhatWentPoorly: React.FC = () => {
  return (
    <div className="space-y-5 pb-6 border-b border-[#D8D4C8]">
      {/* Header / Section Label & Status */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase"
        style={{ fontFamily: 'var(--font-technical)' }}
      >
        <span className="text-[#0A0A0A]">
          09 / WHAT WENT POORLY
        </span>

        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#1C1A14] border border-[#383322] text-[#EAB308] text-[10px] font-bold">
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-full bg-[#EAB308]"
          />
          DRAFT GAPS / HUMAN REVIEW REQUIRED
        </div>
      </div>

      {/* Introductory copy */}
      <p
        className="text-sm sm:text-base text-[#2A2B28] leading-relaxed max-w-none"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        The current incident record reveals several gaps that limited early certainty and left important recovery details incomplete. These observations are draft findings based only on available SignalFold data and must be reviewed without assigning blame to individuals or teams.
      </p>

      {/* Continuous Structured Gap List */}
      <div className="divide-y divide-[#D8D4C8] border-t border-b border-[#D8D4C8]">
        {/* Row 01 */}
        <div className="py-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start">
          <div
            className="w-8 shrink-0 text-[#7A7C74] font-mono font-bold text-xs sm:text-sm pt-0.5"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            01
          </div>
          <div className="flex-1 space-y-2.5 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4
                className="text-xs sm:text-sm font-mono font-bold text-[#0A0A0A] uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                DETECTION DEPENDED ON CUSTOMER REPORTS
              </h4>
              <span
                className="px-2 py-0.5 rounded-[2px] bg-[#EFECE2] border border-[#D8D4C8] text-[#5A5C56] text-[10px] font-mono font-bold tracking-wider uppercase shrink-0"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                DRAFT GAP
              </span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              {/* GAP */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  GAP:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  The earliest confirmed signals came from incoming customer and support reports.
                </p>
              </div>

              {/* EVIDENCE */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  EVIDENCE:
                </span>
                <div className="flex-1 flex items-start gap-1.5">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#EAB308] shrink-0 mt-1.5"
                  />
                  <p
                    className="text-[#5A5C56] leading-relaxed"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    No earlier automated monitoring alert has been confirmed in the current incident record.
                  </p>
                </div>
              </div>

              {/* REVIEW REQUIREMENT */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  REVIEW REQUIREMENT:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Verify whether monitoring detected the payment failures before customer reports arrived.
                </p>
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
                    MONITORING EVIDENCE MISSING
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 02 */}
        <div className="py-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start">
          <div
            className="w-8 shrink-0 text-[#7A7C74] font-mono font-bold text-xs sm:text-sm pt-0.5"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            02
          </div>
          <div className="flex-1 space-y-2.5 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4
                className="text-xs sm:text-sm font-mono font-bold text-[#0A0A0A] uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                CHANGE SCOPE WAS NOT ISOLATED
              </h4>
              <span
                className="px-2 py-0.5 rounded-[2px] bg-[#EFECE2] border border-[#D8D4C8] text-[#5A5C56] text-[10px] font-mono font-bold tracking-wider uppercase shrink-0"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                DRAFT GAP
              </span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              {/* GAP */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  GAP:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  The response record does not yet identify the exact code, configuration, or dependency change associated with the failures.
                </p>
              </div>

              {/* EVIDENCE */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  EVIDENCE:
                </span>
                <div className="flex-1 flex items-start gap-1.5">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#EAB308] shrink-0 mt-1.5"
                  />
                  <p
                    className="text-[#5A5C56] leading-relaxed"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    The latest deployment remains only a working hypothesis window.
                  </p>
                </div>
              </div>

              {/* REVIEW REQUIREMENT */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  REVIEW REQUIREMENT:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Compare deployment changes and attach technical evidence before confirming root cause.
                </p>
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
                    OPEN INVESTIGATION
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 03 */}
        <div className="py-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start">
          <div
            className="w-8 shrink-0 text-[#7A7C74] font-mono font-bold text-xs sm:text-sm pt-0.5"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            03
          </div>
          <div className="flex-1 space-y-2.5 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4
                className="text-xs sm:text-sm font-mono font-bold text-[#0A0A0A] uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                CUSTOMER AND FINANCIAL IMPACT REMAIN INCOMPLETE
              </h4>
              <span
                className="px-2 py-0.5 rounded-[2px] bg-[#EFECE2] border border-[#D8D4C8] text-[#5A5C56] text-[10px] font-mono font-bold tracking-wider uppercase shrink-0"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                DRAFT GAP
              </span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              {/* GAP */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  GAP:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Thirty-seven customer reports are known, but the full number of affected transactions and final financial impact have not been reconciled.
                </p>
              </div>

              {/* EVIDENCE */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  EVIDENCE:
                </span>
                <div className="flex-1 flex items-start gap-1.5">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#EAB308] shrink-0 mt-1.5"
                  />
                  <p
                    className="text-[#5A5C56] leading-relaxed"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    The Customer & Business Impact section remains marked for review.
                  </p>
                </div>
              </div>

              {/* REVIEW REQUIREMENT */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  REVIEW REQUIREMENT:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Reconcile payment records and confirmed customer impact.
                </p>
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
                    PENDING RECONCILIATION
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 04 */}
        <div className="py-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start">
          <div
            className="w-8 shrink-0 text-[#7A7C74] font-mono font-bold text-xs sm:text-sm pt-0.5"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            04
          </div>
          <div className="flex-1 space-y-2.5 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4
                className="text-xs sm:text-sm font-mono font-bold text-[#0A0A0A] uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                RECOVERY EVIDENCE IS NOT YET COMPLETE
              </h4>
              <span
                className="px-2 py-0.5 rounded-[2px] bg-[#EFECE2] border border-[#D8D4C8] text-[#5A5C56] text-[10px] font-mono font-bold tracking-wider uppercase shrink-0"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                DRAFT GAP
              </span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              {/* GAP */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  GAP:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  The document does not yet contain a verified recovery action, restoration time, remaining risk, or final resolution timestamp.
                </p>
              </div>

              {/* EVIDENCE */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  EVIDENCE:
                </span>
                <div className="flex-1 flex items-start gap-1.5">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#EAB308] shrink-0 mt-1.5"
                  />
                  <p
                    className="text-[#5A5C56] leading-relaxed"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    The Resolution checklist remains incomplete and the incident state is still INVESTIGATING.
                  </p>
                </div>
              </div>

              {/* REVIEW REQUIREMENT */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-36 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  REVIEW REQUIREMENT:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Confirm recovery evidence and required resolution fields before changing incident status.
                </p>
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
                    RECOVERY VERIFICATION PENDING
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
