import React from 'react';

export const ContributingFactors: React.FC = () => {
  return (
    <div className="space-y-5 pb-6 border-b border-[#D8D4C8]">
      <div
        className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase"
        style={{ fontFamily: 'var(--font-technical)' }}
      >
        <span className="text-[#0A0A0A]">
          06 / CONTRIBUTING FACTORS
        </span>

        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#1C1A14] border border-[#383322] text-[#EAB308] text-[10px] font-bold">
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-full bg-[#EAB308]"
          />
          CANDIDATE FACTORS / HUMAN VALIDATION REQUIRED
        </div>
      </div>

      <p
        className="text-sm sm:text-base text-[#2A2B28] leading-relaxed max-w-none"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        The following factors may have increased the incident’s impact or delayed confident diagnosis. They are derived from currently available records and must be reviewed against engineering, deployment, and monitoring evidence before approval.
      </p>

      {/* Continuous Structured Factor List */}
      <div className="divide-y divide-[#D8D4C8] border-t border-b border-[#D8D4C8]">
        {/* Factor Row 01 */}
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
                CUSTOMER-LED DETECTION
              </h4>
              <span
                className="px-2 py-0.5 rounded-[2px] bg-[#EFECE2] border border-[#D8D4C8] text-[#5A5C56] text-[10px] font-mono font-bold tracking-wider uppercase shrink-0"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                PARTIALLY VERIFIED
              </span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-24 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  EVIDENCE:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  The first confirmed signals came from incoming customer and support reports.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-24 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  REVIEW NOTE:
                </span>
                <p
                  className="text-[#5A5C56] italic leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Confirm whether automated monitoring detected the failures earlier.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Factor Row 02 */}
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
                CHANGE SCOPE NOT YET ISOLATED
              </h4>
              <span
                className="px-2 py-0.5 rounded-[2px] bg-[#1C1A14] border border-[#383322] text-[#EAB308] text-[10px] font-mono font-bold tracking-wider uppercase shrink-0"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                OPEN INVESTIGATION
              </span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-24 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  EVIDENCE:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  The incident followed the latest deployment, but the exact code, configuration, or dependency change has not been identified.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-24 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  REVIEW NOTE:
                </span>
                <p
                  className="text-[#5A5C56] italic leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Compare deployment changes and attach supporting evidence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Factor Row 03 */}
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
                IMPACT START TIME UNKNOWN
              </h4>
              <span
                className="px-2 py-0.5 rounded-[2px] bg-[#1C1A14] border border-[#383322] text-[#EAB308] text-[10px] font-mono font-bold tracking-wider uppercase shrink-0"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                TIME UNVERIFIED
              </span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-24 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  EVIDENCE:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  The first recorded SignalFold event is 06:14:08, but the exact beginning of customer impact is not yet verified.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-24 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  REVIEW NOTE:
                </span>
                <p
                  className="text-[#5A5C56] italic leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Review payment and deployment records to establish the earliest confirmed impact.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Factor Row 04 */}
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
                FINANCIAL IMPACT UNRECONCILED
              </h4>
              <span
                className="px-2 py-0.5 rounded-[2px] bg-[#1C1A14] border border-[#383322] text-[#EAB308] text-[10px] font-mono font-bold tracking-wider uppercase shrink-0"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                PENDING RECONCILIATION
              </span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-24 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  EVIDENCE:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Thirty-seven customer reports are known, while the final financial impact remains under review.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-24 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  REVIEW NOTE:
                </span>
                <p
                  className="text-[#5A5C56] italic leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Reconcile failed transactions and confirmed customer impact before approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
