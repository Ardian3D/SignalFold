import React from 'react';
import { ContributingFactors } from './ContributingFactors';
import { Resolution } from './Resolution';
import { WhatWentWell } from './WhatWentWell';
import { WhatWentPoorly } from './WhatWentPoorly';
import { PreventiveActions } from './PreventiveActions';
import { OwnersDueDates } from './OwnersDueDates';

export interface PostmortemSectionProps {
  className?: string;
}

export const PostmortemSection: React.FC<PostmortemSectionProps> = ({
  className = '',
}) => {
  return (
    <section
      id="postmortem"
      className={`relative w-full bg-[#F3F1EA] text-[#0A0A0A] py-16 sm:py-20 lg:py-24 border-b border-[#D8D4C8] scroll-mt-20 selection:bg-[#0A0A0A] selection:text-[#F3F1EA] ${className}`}
      aria-label="SignalFold Postmortem"
    >
      <style>{`
        @media (min-width: 900px) {
          .postmortemEditorialSticky {
            position: sticky;
            top: calc(var(--navbar-height, 64px) + 24px);
            align-self: start;
          }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-8 min-[900px]:gap-12 items-start">
          {/* Left Column: Editorial Introduction */}
          <div className="min-[900px]:col-span-5 space-y-6 sm:space-y-8 postmortemEditorialSticky">
            <div className="space-y-4 sm:space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#0A0A0A] border border-[#141513]">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]"
                  />
                  <span
                    className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase text-[#D6FF3F]"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    04 / POSTMORTEM
                  </span>
                </div>
              </div>

              <h2
                className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0A0A0A] leading-[1.06] text-balance"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                TURN RESPONSE
                <br className="hidden sm:inline" />
                INTO MEMORY.
              </h2>

              <p
                className="text-base sm:text-lg text-[#5A5C56] leading-relaxed max-w-[38rem] w-full"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                SignalFold transforms the verified incident timeline, impact,
                decisions, and recovery details into an editable postmortem
                draft. AI prepares the first version. Humans review, approve,
                and own the record.
              </p>
            </div>

            {/* Technical Metadata */}
            <div
              className="pt-5 mt-2 border-t border-[#D8D4C8] flex flex-wrap items-center gap-3 sm:gap-6 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-[#5A5C56]"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <div className="flex items-center gap-2 border-r border-[#D8D4C8] pr-3 sm:pr-6">
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] shrink-0"
                />
                <span className="text-[#0A0A0A]">AI DRAFT ONLY</span>
              </div>
              <div className="flex items-center gap-2 border-r border-[#D8D4C8] pr-3 sm:pr-6">
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] shrink-0"
                />
                <span className="text-[#0A0A0A]">HUMAN APPROVED</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] shrink-0"
                />
                <span className="text-[#0A0A0A]">VERSIONED RECORD</span>
              </div>
            </div>
          </div>

          {/* Right Column: Postmortem Document Preview Shell */}
          <div className="min-[900px]:col-span-7 w-full">
            <div className="w-full border border-[#141513] rounded-[2px] bg-[#FAF9F5] overflow-hidden shadow-sm flex flex-col">
              {/* Top Frame Bar */}
              <div
                className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b border-[#242522] bg-[#141513] text-[#F3F1EA] gap-2 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-[#F3F1EA] font-semibold">
                    SF-2026-0042 / POSTMORTEM
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="px-2 py-0.5 rounded-[2px] bg-[#242522] text-[#D6FF3F] text-[10px]">
                    DRAFT
                  </span>
                  <span className="text-[#A8AAA3] text-[10px]">
                    HUMAN REVIEW REQUIRED
                  </span>
                </div>
              </div>

              {/* Compact Workflow Status Rail */}
              <div
                className="px-4 sm:px-6 py-2.5 bg-[#EFECE2] border-b border-[#D8D4C8] flex flex-wrap items-center justify-between gap-3 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-[#5A5C56]"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {/* DRAFT (Current Highlighted State) */}
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#141513] text-[#D6FF3F] font-bold border border-[#141513]">
                    <span
                      aria-hidden="true"
                      className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] animate-pulse motion-reduce:animate-none"
                    />
                    DRAFT
                  </span>

                  <span aria-hidden="true" className="text-[#9A9C94]">
                    →
                  </span>

                  {/* IN REVIEW (Muted) */}
                  <span className="text-[#7A7C74]">IN REVIEW</span>

                  <span aria-hidden="true" className="text-[#9A9C94]">
                    →
                  </span>

                  {/* APPROVED (Muted) */}
                  <span className="text-[#7A7C74]">APPROVED</span>

                  <span aria-hidden="true" className="text-[#9A9C94]">
                    →
                  </span>

                  {/* PUBLISHED (Muted) */}
                  <span className="text-[#7A7C74]">PUBLISHED</span>
                </div>

                <div className="text-[10px] text-[#7A7C74] font-semibold tracking-wider">
                  UNAPPROVED RECORD
                </div>
              </div>

              {/* Document Frame Content */}
              <div className="w-full min-h-[360px] sm:min-h-[440px] min-[900px]:min-h-[500px] bg-[#FAF9F5] relative p-5 sm:p-8 min-[900px]:p-10 flex flex-col justify-start overflow-hidden">
                {/* Subtle Grid Background Overlay */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(to_right,#0A0A0A_1px,transparent_1px),linear-gradient(to_bottom,#0A0A0A_1px,transparent_1px)] bg-[size:32px_32px]"
                />

                <div className="relative z-10 space-y-6 sm:space-y-8">
                  {/* DOCUMENT IDENTITY BLOCK */}
                  <div className="space-y-4 sm:space-y-5 pb-6 border-b border-[#D8D4C8]">
                    {/* Small Label */}
                    <div
                      className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase text-[#7A7C74]"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      POSTMORTEM DRAFT / 01
                    </div>

                    {/* Main Document Title */}
                    <h3
                      className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#0A0A0A] leading-snug"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Checkout payments failing after latest deployment
                    </h3>

                    {/* Compact Metadata Grid */}
                    <style>{`
                      .postmortemIdentityGrid {
                        --existing-document-border: #D8D4C8;
                        --existing-muted-text: #8A8C84;
                        --existing-primary-text: #0A0A0A;
                        display: grid;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        width: 100%;
                        border-top: 1px solid var(--existing-document-border);
                        border-bottom: 1px solid var(--existing-document-border);
                      }

                      .postmortemIdentityCell {
                        min-width: 0;
                        padding: 12px 14px;
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 5px;
                        overflow: hidden;
                      }

                      .postmortemIdentityCell:nth-child(odd) {
                        border-right: 1px solid var(--existing-document-border);
                      }

                      .postmortemIdentityCell:nth-child(-n + 2) {
                        border-bottom: 1px solid var(--existing-document-border);
                      }

                      .postmortemIdentityLabel {
                        display: block;
                        font-family: var(--font-technical);
                        font-size: 9px;
                        line-height: 1.2;
                        letter-spacing: 0.08em;
                        color: var(--existing-muted-text);
                        font-weight: 700;
                        text-transform: uppercase;
                      }

                      .postmortemIdentityValue {
                        display: block;
                        width: 100%;
                        min-width: 0;
                        font-family: var(--font-technical);
                        font-size: 10px;
                        line-height: 1.45;
                        overflow-wrap: break-word;
                        word-break: normal;
                        white-space: normal;
                        color: var(--existing-primary-text);
                        font-weight: 700;
                        text-transform: uppercase;
                      }

                      .postmortemIdentityCode {
                        white-space: nowrap;
                      }

                      @media (max-width: 520px) {
                        .postmortemIdentityGrid {
                          grid-template-columns: 1fr;
                        }

                        .postmortemIdentityCell:nth-child(odd) {
                          border-right: 0;
                        }

                        .postmortemIdentityCell {
                          border-bottom: 1px solid var(--existing-document-border);
                        }

                        .postmortemIdentityCell:last-child {
                          border-bottom: 0;
                        }
                      }
                    `}</style>
                    <div className="postmortemIdentityGrid">
                      <div className="postmortemIdentityCell">
                        <span className="postmortemIdentityLabel">INCIDENT</span>
                        <span className="postmortemIdentityValue postmortemIdentityCode">
                          SF-2026-0042
                        </span>
                      </div>

                      <div className="postmortemIdentityCell">
                        <span className="postmortemIdentityLabel">SERVICE</span>
                        <span className="postmortemIdentityValue">
                          PAYMENTS API
                        </span>
                      </div>

                      <div className="postmortemIdentityCell">
                        <span className="postmortemIdentityLabel">SEVERITY</span>
                        <span className="postmortemIdentityValue">
                          SEV1 CRITICAL
                        </span>
                      </div>

                      <div className="postmortemIdentityCell">
                        <span className="postmortemIdentityLabel">IMPACT</span>
                        <span className="postmortemIdentityValue">
                          37 CUSTOMER REPORTS
                        </span>
                      </div>
                    </div>

                    {/* Review Metadata */}
                    <div
                      className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      <div className="flex items-center gap-2 text-[#5A5C56]">
                        <span className="text-[#8A8C84]">GENERATED BY /</span>
                        <span className="text-[#0A0A0A]">DEEPSEEK</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[#8A8C84]">REVIEW STATUS /</span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#141513] text-[#D6FF3F] font-bold">
                          <span
                            aria-hidden="true"
                            className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] animate-pulse motion-reduce:animate-none"
                          />
                          PENDING HUMAN REVIEW
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* EXECUTIVE SUMMARY BLOCK */}
                  <div className="space-y-4 pb-6 border-b border-[#D8D4C8]">
                    <div
                      className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      <span className="text-[#0A0A0A]">01 / EXECUTIVE SUMMARY</span>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-[2px] bg-[#141513] text-[#D6FF3F] text-[10px] font-bold">
                          AI-GENERATED DRAFT
                        </span>
                        <span className="text-[#7A7C74] text-[10px] font-normal normal-case tracking-normal">
                          Editable before review and approval.
                        </span>
                      </div>
                    </div>

                    <p
                      className="text-sm sm:text-base text-[#2A2B28] leading-relaxed max-w-none"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Following the latest deployment, customers were unable to complete card payments through the Payments API. Support received 37 reports during the initial detection window. The response team classified the incident as SEV1, assigned clear ownership, coordinated recovery tasks, and verified service restoration before resolution.
                    </p>
                  </div>

                  {/* CUSTOMER & BUSINESS IMPACT BLOCK */}
                  <div className="space-y-4 pb-6 border-b border-[#D8D4C8]">
                    <div
                      className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      <span className="text-[#0A0A0A]">
                        02 / CUSTOMER & BUSINESS IMPACT
                      </span>

                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#141513] text-[#D6FF3F] text-[10px] font-bold">
                        <span
                          aria-hidden="true"
                          className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] animate-pulse motion-reduce:animate-none"
                        />
                        IMPACT REVIEW INCOMPLETE
                      </div>
                    </div>

                    <p
                      className="text-sm sm:text-base text-[#2A2B28] leading-relaxed max-w-none"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Customers were unable to complete card payments through the Payments API during the incident window. Support received 37 customer reports within the first 12 minutes, indicating an immediate disruption to checkout completion and payment processing. The final financial impact remains under review and must be confirmed before approval.
                    </p>

                    {/* Compact Structured Impact Grid */}
                    <div
                      className="pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          CUSTOMER EFFECT
                        </div>
                        <div className="text-[#0A0A0A] font-bold">
                          CARD PAYMENTS FAILED
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          KNOWN SCOPE
                        </div>
                        <div className="text-[#0A0A0A] font-bold">
                          37 CUSTOMER REPORTS
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          AFFECTED FLOW
                        </div>
                        <div className="text-[#0A0A0A] font-bold">
                          CHECKOUT COMPLETION
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          SERVICE
                        </div>
                        <div className="text-[#0A0A0A] font-bold">
                          PAYMENTS API
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          FINANCIAL IMPACT
                        </div>
                        <div className="text-[#0A0A0A] font-bold text-[#8A5A00]">
                          PENDING RECONCILIATION
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          CONFIDENCE
                        </div>
                        <div className="text-[#0A0A0A] font-bold flex flex-wrap items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded-[2px] bg-[#141513] text-[#D6FF3F] text-[9px] font-bold">
                            PARTIAL
                          </span>
                          <span>HUMAN VALIDATION REQUIRED</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DETECTION BLOCK */}
                  <div className="space-y-4 pb-6 border-b border-[#D8D4C8]">
                    <div
                      className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      <span className="text-[#0A0A0A]">
                        03 / DETECTION
                      </span>

                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#141513] text-[#D6FF3F] text-[10px] font-bold">
                        <span
                          aria-hidden="true"
                          className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] animate-pulse motion-reduce:animate-none"
                        />
                        DETECTION DETAILS PENDING REVIEW
                      </div>
                    </div>

                    <p
                      className="text-sm sm:text-base text-[#2A2B28] leading-relaxed max-w-none"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      The incident was detected through incoming customer and support reports describing failed card payments after the latest deployment. SignalFold consolidated the reported signals into incident SF-2026-0042, with the first recorded incident event at 06:14:08. The exact beginning of customer impact and whether an earlier automated monitoring signal existed remain subject to human verification.
                    </p>

                    {/* Compact Structured Detection Grid */}
                    <div
                      className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          DETECTION SOURCE
                        </div>
                        <div className="text-[#0A0A0A] font-bold">
                          INCOMING SUPPORT REPORTS
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          FIRST RECORDED EVENT
                        </div>
                        <div className="text-[#0A0A0A] font-bold">
                          06:14:08
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          PRIMARY SIGNAL
                        </div>
                        <div className="text-[#0A0A0A] font-bold">
                          CARD PAYMENT FAILURES
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          AFFECTED SERVICE
                        </div>
                        <div className="text-[#0A0A0A] font-bold">
                          PAYMENTS API
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          KNOWN REPORT VOLUME
                        </div>
                        <div className="text-[#0A0A0A] font-bold">
                          37 CUSTOMER REPORTS
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          FIRST CUSTOMER IMPACT
                        </div>
                        <div className="text-[#7A7C74] font-bold">
                          TIME NOT YET VERIFIED
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          AUTOMATED ALERT
                        </div>
                        <div className="text-[#7A7C74] font-bold">
                          NOT CONFIRMED
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          REVIEW OWNER
                        </div>
                        <div className="text-[#0A0A0A] font-bold">
                          INCIDENT MANAGER
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* INCIDENT TIMELINE BLOCK */}
                  <div className="space-y-4 pb-6 border-b border-[#D8D4C8]">
                    <div
                      className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      <span className="text-[#0A0A0A]">
                        04 / INCIDENT TIMELINE
                      </span>

                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#141513] text-[#D6FF3F] text-[10px] font-bold">
                        <span
                          aria-hidden="true"
                          className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] animate-pulse motion-reduce:animate-none"
                        />
                        VERIFIED EVENTS / RESOLUTION TIME PENDING
                      </div>
                    </div>

                    <p
                      className="text-sm sm:text-base text-[#2A2B28] leading-relaxed max-w-none"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      This draft timeline is reconstructed from recorded SignalFold activity. Event order and recorded actors are available, while final recovery and resolution timestamps remain subject to human confirmation.
                    </p>

                    {/* Timeline Container */}
                    <div className="pt-2 border-l border-[#D8D4C8] ml-2 sm:ml-3 pl-4 sm:pl-6 space-y-3">
                      {/* Event 1 */}
                      <div className="relative py-2 border-b border-[#D8D4C8]/60 last:border-b-0 space-y-1">
                        <span
                          aria-hidden="true"
                          className="absolute -left-[21px] sm:-left-[29px] top-3.5 w-2 h-2 rounded-full bg-[#0A0A0A]"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-1 sm:gap-4 items-start">
                          <div
                            className="text-[10px] sm:text-[11px] font-mono font-bold text-[#0A0A0A] tracking-wider"
                            style={{ fontFamily: 'var(--font-technical)' }}
                          >
                            06:14:08
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div
                              className="text-[10px] sm:text-[11px] font-mono font-bold text-[#7A7C74] uppercase tracking-wider"
                              style={{ fontFamily: 'var(--font-technical)' }}
                            >
                              SYSTEM
                            </div>
                            <p
                              className="text-xs sm:text-sm text-[#2A2B28] leading-normal"
                              style={{ fontFamily: 'var(--font-ui)' }}
                            >
                              Incident created from incoming customer reports.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Event 2 */}
                      <div className="relative py-2 border-b border-[#D8D4C8]/60 last:border-b-0 space-y-1">
                        <span
                          aria-hidden="true"
                          className="absolute -left-[21px] sm:-left-[29px] top-3.5 w-2 h-2 rounded-full bg-[#0A0A0A]"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-1 sm:gap-4 items-start">
                          <div
                            className="text-[10px] sm:text-[11px] font-mono font-bold text-[#0A0A0A] tracking-wider"
                            style={{ fontFamily: 'var(--font-technical)' }}
                          >
                            06:15:02
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div
                              className="text-[10px] sm:text-[11px] font-mono font-bold text-[#7A7C74] uppercase tracking-wider flex flex-wrap items-center gap-2"
                              style={{ fontFamily: 'var(--font-technical)' }}
                            >
                              <span>DEEPSEEK</span>
                              <span className="px-1.5 py-0.5 rounded-[2px] bg-[#141513] text-[#D6FF3F] text-[9px] font-bold">
                                AI SUGGESTION
                              </span>
                            </div>
                            <p
                              className="text-xs sm:text-sm text-[#2A2B28] leading-normal"
                              style={{ fontFamily: 'var(--font-ui)' }}
                            >
                              AI analysis completed — SEV1 suggested with 94% confidence.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Event 3 */}
                      <div className="relative py-2 border-b border-[#D8D4C8]/60 last:border-b-0 space-y-1">
                        <span
                          aria-hidden="true"
                          className="absolute -left-[21px] sm:-left-[29px] top-3.5 w-2 h-2 rounded-full bg-[#0A0A0A]"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-1 sm:gap-4 items-start">
                          <div
                            className="text-[10px] sm:text-[11px] font-mono font-bold text-[#0A0A0A] tracking-wider"
                            style={{ fontFamily: 'var(--font-technical)' }}
                          >
                            06:16:21
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div
                              className="text-[10px] sm:text-[11px] font-mono font-bold text-[#7A7C74] uppercase tracking-wider"
                              style={{ fontFamily: 'var(--font-technical)' }}
                            >
                              MAYA CHEN
                            </div>
                            <p
                              className="text-xs sm:text-sm text-[#2A2B28] leading-normal"
                              style={{ fontFamily: 'var(--font-ui)' }}
                            >
                              Accepted severity recommendation: SEV1 / CRITICAL.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Event 4 */}
                      <div className="relative py-2 border-b border-[#D8D4C8]/60 last:border-b-0 space-y-1">
                        <span
                          aria-hidden="true"
                          className="absolute -left-[21px] sm:-left-[29px] top-3.5 w-2 h-2 rounded-full bg-[#0A0A0A]"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-1 sm:gap-4 items-start">
                          <div
                            className="text-[10px] sm:text-[11px] font-mono font-bold text-[#0A0A0A] tracking-wider"
                            style={{ fontFamily: 'var(--font-technical)' }}
                          >
                            06:17:06
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div
                              className="text-[10px] sm:text-[11px] font-mono font-bold text-[#7A7C74] uppercase tracking-wider"
                              style={{ fontFamily: 'var(--font-technical)' }}
                            >
                              MAYA CHEN
                            </div>
                            <p
                              className="text-xs sm:text-sm text-[#2A2B28] leading-normal"
                              style={{ fontFamily: 'var(--font-ui)' }}
                            >
                              Assigned as Incident Commander.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Event 5 */}
                      <div className="relative py-2 border-b border-[#D8D4C8]/60 last:border-b-0 space-y-1">
                        <span
                          aria-hidden="true"
                          className="absolute -left-[21px] sm:-left-[29px] top-3.5 w-2 h-2 rounded-full bg-[#0A0A0A]"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-1 sm:gap-4 items-start">
                          <div
                            className="text-[10px] sm:text-[11px] font-mono font-bold text-[#0A0A0A] tracking-wider"
                            style={{ fontFamily: 'var(--font-technical)' }}
                          >
                            06:18:42
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div
                              className="text-[10px] sm:text-[11px] font-mono font-bold text-[#7A7C74] uppercase tracking-wider"
                              style={{ fontFamily: 'var(--font-technical)' }}
                            >
                              ALEX RIVERA
                            </div>
                            <p
                              className="text-xs sm:text-sm text-[#2A2B28] leading-normal"
                              style={{ fontFamily: 'var(--font-ui)' }}
                            >
                              Claimed task: Compare latest deployment changes.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Event 6 - Final Pending Milestone */}
                      <div className="relative py-2 space-y-1">
                        <span
                          aria-hidden="true"
                          className="absolute -left-[21px] sm:-left-[29px] top-3.5 w-2 h-2 rounded-full bg-[#FAF9F5] border-2 border-[#7A7C74]"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-1 sm:gap-4 items-start">
                          <div
                            className="text-[10px] sm:text-[11px] font-mono font-bold text-[#7A7C74] tracking-wider"
                            style={{ fontFamily: 'var(--font-technical)' }}
                          >
                            TIME PENDING REVIEW
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div
                              className="text-[10px] sm:text-[11px] font-mono font-bold text-[#7A7C74] uppercase tracking-wider flex flex-wrap items-center gap-2"
                              style={{ fontFamily: 'var(--font-technical)' }}
                            >
                              <span>SYSTEM RECORD</span>
                              <span className="px-1.5 py-0.5 rounded-[2px] bg-[#EFECE2] border border-[#D8D4C8] text-[#7A7C74] text-[9px] font-bold">
                                UNVERIFIED MILESTONE
                              </span>
                            </div>
                            <p
                              className="text-xs sm:text-sm text-[#5A5C56] leading-normal"
                              style={{ fontFamily: 'var(--font-ui)' }}
                            >
                              Service recovery verification and final resolution timestamp require human confirmation.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ROOT CAUSE BLOCK */}
                  <div className="space-y-4 pb-6 border-b border-[#D8D4C8]">
                    <div
                      className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      <span className="text-[#0A0A0A]">
                        05 / ROOT CAUSE
                      </span>

                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#1C1A14] border border-[#383322] text-[#EAB308] text-[10px] font-bold">
                        <span
                          aria-hidden="true"
                          className="w-1.5 h-1.5 rounded-full bg-[#EAB308]"
                        />
                        WORKING HYPOTHESIS / NOT CONFIRMED
                      </div>
                    </div>

                    <p
                      className="text-sm sm:text-base text-[#2A2B28] leading-relaxed max-w-none"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      The available incident evidence indicates that the payment failures began after the latest deployment affecting the checkout payment flow. A deployment-related regression is the current working hypothesis, but the specific code change, dependency, or configuration responsible has not yet been confirmed. Engineering review and evidence validation are required before this section can be approved.
                    </p>

                    {/* Compact Evidence Grid */}
                    <div
                      className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          CURRENT HYPOTHESIS
                        </div>
                        <div className="text-[#0A0A0A] font-bold">
                          DEPLOYMENT-RELATED REGRESSION
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          CONFIRMATION STATUS
                        </div>
                        <div className="text-[#B45309] font-bold">
                          NOT CONFIRMED
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          AFFECTED COMPONENT
                        </div>
                        <div className="text-[#0A0A0A] font-bold">
                          PAYMENTS API
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          LIKELY CHANGE WINDOW
                        </div>
                        <div className="text-[#0A0A0A] font-bold">
                          LATEST DEPLOYMENT
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          SUPPORTING EVIDENCE
                        </div>
                        <div className="text-[#0A0A0A] font-bold">
                          FAILURES REPORTED AFTER DEPLOYMENT
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          MISSING EVIDENCE
                        </div>
                        <div className="text-[#7A7C74] font-bold">
                          EXACT CHANGE NOT IDENTIFIED
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          VALIDATION REQUIRED
                        </div>
                        <div className="text-[#0A0A0A] font-bold">
                          CODE AND CONFIGURATION REVIEW
                        </div>
                      </div>

                      <div className="border-b border-[#D8D4C8] pb-2.5 space-y-1">
                        <div className="text-[#7A7C74] font-bold text-[9px] sm:text-[10px]">
                          REVIEW OWNER
                        </div>
                        <div className="text-[#0A0A0A] font-bold">
                          INCIDENT MANAGER + ENGINEERING
                        </div>
                      </div>
                    </div>

                    <p
                      className="text-xs text-[#5A5C56] italic pt-1"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      This hypothesis must remain editable until supporting technical evidence is attached and reviewed.
                    </p>
                  </div>

                  {/* CONTRIBUTING FACTORS BLOCK */}
                  <ContributingFactors />

                  {/* RESOLUTION BLOCK */}
                  <Resolution />

                  {/* WHAT WENT WELL BLOCK */}
                  <WhatWentWell />

                  {/* WHAT WENT POORLY BLOCK */}
                  <WhatWentPoorly />

                  {/* PREVENTIVE ACTIONS BLOCK */}
                  <PreventiveActions />

                  {/* OWNERS & DUE DATES BLOCK */}
                  <OwnersDueDates />

                  {/* Empty Document Container Indicator */}
                  <div
                    className="pt-2 flex items-center justify-between text-[9px] font-mono tracking-widest text-[#9A9C94] uppercase select-none pointer-events-none"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    <span>DRAFT CONTENT COMPLETE / HUMAN REVIEW REQUIRED</span>
                    <span>SIGNALFOLD RECORD ENGINE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
