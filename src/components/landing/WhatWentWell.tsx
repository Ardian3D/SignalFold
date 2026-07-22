import React from 'react';

export const WhatWentWell: React.FC = () => {
  return (
    <div className="space-y-5 pb-6 border-b border-[#D8D4C8]">
      {/* Header / Section Label & Status */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase"
        style={{ fontFamily: 'var(--font-technical)' }}
      >
        <span className="text-[#0A0A0A]">
          08 / WHAT WENT WELL
        </span>

        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#1C1A14] border border-[#383322] text-[#EAB308] text-[10px] font-bold">
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-full bg-[#EAB308]"
          />
          DRAFT OBSERVATIONS / HUMAN REVIEW REQUIRED
        </div>
      </div>

      {/* Introductory copy */}
      <p
        className="text-sm sm:text-base text-[#2A2B28] leading-relaxed max-w-none"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        The recorded SignalFold activity shows several response practices that supported clear coordination during the incident. These observations are generated from the current timeline and must be reviewed by the response team before approval.
      </p>

      {/* Continuous Structured Observation List */}
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
                SIGNALS WERE CONSOLIDATED
              </h4>
              <span
                className="px-2 py-0.5 rounded-[2px] bg-[#EFECE2] border border-[#D8D4C8] text-[#5A5C56] text-[10px] font-mono font-bold tracking-wider uppercase shrink-0"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                DRAFT OBSERVATION
              </span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-24 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  OBSERVATION:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Incoming customer and support reports were converted into one structured incident record.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-24 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  EVIDENCE:
                </span>
                <div className="flex-1 flex items-start gap-1.5">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] shrink-0 mt-1.5"
                  />
                  <p
                    className="text-[#5A5C56] leading-relaxed"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Incident SF-2026-0042 was created from the reported payment failures.
                  </p>
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
                AI REMAINED ADVISORY
              </h4>
              <span
                className="px-2 py-0.5 rounded-[2px] bg-[#EFECE2] border border-[#D8D4C8] text-[#5A5C56] text-[10px] font-mono font-bold tracking-wider uppercase shrink-0"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                DRAFT OBSERVATION
              </span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-24 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  OBSERVATION:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  AI analysis provided a severity suggestion without automatically changing the incident.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-24 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  EVIDENCE:
                </span>
                <div className="flex-1 flex items-start gap-1.5">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] shrink-0 mt-1.5"
                  />
                  <p
                    className="text-[#5A5C56] leading-relaxed"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    DeepSeek suggested SEV1 with 94% confidence, and Maya Chen explicitly accepted the recommendation.
                  </p>
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
                OWNERSHIP WAS RECORDED
              </h4>
              <span
                className="px-2 py-0.5 rounded-[2px] bg-[#EFECE2] border border-[#D8D4C8] text-[#5A5C56] text-[10px] font-mono font-bold tracking-wider uppercase shrink-0"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                DRAFT OBSERVATION
              </span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-24 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  OBSERVATION:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  The response timeline clearly recorded incident command and task ownership.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-24 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  EVIDENCE:
                </span>
                <div className="flex-1 flex items-start gap-1.5">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] shrink-0 mt-1.5"
                  />
                  <p
                    className="text-[#5A5C56] leading-relaxed"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Maya Chen was assigned as Incident Commander, and Alex Rivera claimed the deployment review task.
                  </p>
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
                IMPORTANT ACTIONS WERE TRACEABLE
              </h4>
              <span
                className="px-2 py-0.5 rounded-[2px] bg-[#EFECE2] border border-[#D8D4C8] text-[#5A5C56] text-[10px] font-mono font-bold tracking-wider uppercase shrink-0"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                DRAFT OBSERVATION
              </span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-24 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  OBSERVATION:
                </span>
                <p
                  className="text-[#2A2B28] leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Recorded timestamps and actors made the early response sequence reconstructable.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span
                  className="text-[#7A7C74] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 sm:w-24 pt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  EVIDENCE:
                </span>
                <div className="flex-1 flex items-start gap-1.5">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] shrink-0 mt-1.5"
                  />
                  <p
                    className="text-[#5A5C56] leading-relaxed"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    The timeline includes incident creation, AI analysis, severity acceptance, commander assignment, and task claim events.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
