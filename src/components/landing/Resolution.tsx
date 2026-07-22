import React from 'react';

export const Resolution: React.FC = () => {
  return (
    <div className="space-y-6 pb-6 border-b border-[#D8D4C8]">
      {/* Header / Section Label & Status */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase"
        style={{ fontFamily: 'var(--font-technical)' }}
      >
        <span className="text-[#0A0A0A]">
          07 / RESOLUTION
        </span>

        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#1C1A14] border border-[#383322] text-[#EAB308] text-[10px] font-bold">
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-full bg-[#EAB308]"
          />
          RECOVERY VERIFICATION PENDING
        </div>
      </div>

      {/* Draft Copy */}
      <p
        className="text-sm sm:text-base text-[#2A2B28] leading-relaxed max-w-none"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        The response team coordinated investigation and recovery tasks for the Payments API incident. A final resolution summary has not yet been approved because the exact recovery action, service restoration time, and remaining operational risk still require human confirmation.
      </p>

      {/* Compact Resolution Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider"
        style={{ fontFamily: 'var(--font-technical)' }}
      >
        <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
          <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
            CURRENT INCIDENT STATE
          </div>
          <div className="text-[#8A5A00] font-bold">
            INVESTIGATING
          </div>
        </div>

        <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
          <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
            RECOVERY ACTION
          </div>
          <div className="text-[#8A5A00] font-bold">
            NOT YET VERIFIED
          </div>
        </div>

        <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
          <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
            SERVICE RECOVERY
          </div>
          <div className="text-[#8A5A00] font-bold">
            CONFIRMATION REQUIRED
          </div>
        </div>

        <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
          <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
            RESOLUTION TIME
          </div>
          <div className="text-[#8A5A00] font-bold">
            PENDING HUMAN REVIEW
          </div>
        </div>

        <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
          <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
            CRITICAL TASK REVIEW
          </div>
          <div className="text-[#8A5A00] font-bold">
            OPEN ITEMS REQUIRE REVIEW
          </div>
        </div>

        <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
          <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
            ROOT CAUSE STATUS
          </div>
          <div className="text-[#8A5A00] font-bold">
            UNKNOWN / NOT CONFIRMED
          </div>
        </div>

        <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
          <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
            REMAINING RISK
          </div>
          <div className="text-[#8A5A00] font-bold">
            NOT YET DOCUMENTED
          </div>
        </div>

        <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
          <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
            APPROVAL OWNER
          </div>
          <div className="text-[#0A0A0A] font-bold">
            INCIDENT MANAGER
          </div>
        </div>
      </div>

      {/* Static Draft Checklist */}
      <div className="space-y-2 pt-2">
        <div
          className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px] uppercase tracking-wider font-mono"
          style={{ fontFamily: 'var(--font-technical)' }}
        >
          Draft Checklist
        </div>
        <div className="divide-y divide-[#D8D4C8]/60 border-t border-b border-[#D8D4C8]/60">
          <div className="py-2.5 flex items-start gap-3">
            <span
              className="font-mono text-[#7A7C74] shrink-0 font-bold select-none text-xs sm:text-sm"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              [ ]
            </span>
            <span
              className="text-[#5A5C56] font-mono font-bold uppercase tracking-wider text-[10px] sm:text-[11px] pt-0.5"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              Resolution summary confirmed
            </span>
          </div>

          <div className="py-2.5 flex items-start gap-3">
            <span
              className="font-mono text-[#7A7C74] shrink-0 font-bold select-none text-xs sm:text-sm"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              [ ]
            </span>
            <span
              className="text-[#5A5C56] font-mono font-bold uppercase tracking-wider text-[10px] sm:text-[11px] pt-0.5"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              Service recovery verified
            </span>
          </div>

          <div className="py-2.5 flex items-start gap-3">
            <span
              className="font-mono text-[#7A7C74] shrink-0 font-bold select-none text-xs sm:text-sm"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              [ ]
            </span>
            <span
              className="text-[#5A5C56] font-mono font-bold uppercase tracking-wider text-[10px] sm:text-[11px] pt-0.5"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              Remaining risk documented
            </span>
          </div>

          <div className="py-2.5 flex items-start gap-3">
            <span
              className="font-mono text-[#7A7C74] shrink-0 font-bold select-none text-xs sm:text-sm"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              [ ]
            </span>
            <span
              className="text-[#5A5C56] font-mono font-bold uppercase tracking-wider text-[10px] sm:text-[11px] pt-0.5"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              Open critical tasks reviewed
            </span>
          </div>

          <div className="py-2.5 flex items-start gap-3">
            <span
              className="font-mono text-[#7A7C74] shrink-0 font-bold select-none text-xs sm:text-sm"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              [ ]
            </span>
            <span
              className="text-[#5A5C56] font-mono font-bold uppercase tracking-wider text-[10px] sm:text-[11px] pt-0.5"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              Final resolution timestamp confirmed
            </span>
          </div>
        </div>
      </div>

      {/* Closing Note */}
      <p
        className="text-xs text-[#5A5C56] italic pt-1"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        This incident must not be marked resolved until recovery evidence and required resolution fields are reviewed by an authorized human.
      </p>
    </div>
  );
};
