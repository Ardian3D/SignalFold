import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFeedbackState } from '@/context/FeedbackStateContext';
import { RouteFeedbackState } from '@/components/feedback/RouteFeedbackState';
import { 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  Activity, 
  CheckCircle, 
  Clock, 
  User, 
  Database,
  ExternalLink,
  Shield,
  HelpCircle
} from 'lucide-react';

/**
 * SignalFold — Resolved Incident Seed Page Page component.
 * Implements Phase 00 resolved record foundation inside AppShell.
 */
export function ResolvedIncidentPage() {
  const navigate = useNavigate();
  const { getFeedbackState } = useFeedbackState();
  const feedback = getFeedbackState('resolved-record');

  if (feedback && feedback.isActive) {
    return (
      <RouteFeedbackState
        kind={feedback.kind}
        scope="resolved-record"
        onRetry={feedback.retry}
      />
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-left pb-16">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono tracking-wider text-[#5C5E58] uppercase">
        <Link to="/app" className="hover:text-[#D6FF3F] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#D6FF3F]">
          NORTHSTAR COMMERCE
        </Link>
        <span aria-hidden="true" className="text-[#242522]">/</span>
        <Link to="/app/incidents" className="hover:text-[#D6FF3F] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#D6FF3F]">
          INCIDENTS
        </Link>
        <span aria-hidden="true" className="text-[#242522]">/</span>
        <span className="text-[#A8AAA3] select-none">RESOLVED SEED</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pb-6 border-b border-[#242522]">
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[1px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase select-none tracking-wider">
              RESOLVED
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[1px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase select-none tracking-wider">
              POSTMORTEM APPROVED
            </span>
          </div>

          <h2 
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#F3F1EA] uppercase leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            RESOLVED INCIDENT RECORD
          </h2>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#A8AAA3]">
            <span className="font-mono text-[#5C5E58] text-[10px]" style={{ fontFamily: 'var(--font-technical)' }}>ROUTE KEY:</span>
            <span className="font-mono text-[#D6FF3F] bg-[#D6FF3F]/5 border border-[#D6FF3F]/15 px-1.5 py-0.5 rounded-[1px] text-[10px] select-all font-bold">
              resolved-seed
            </span>
            <span className="text-[#242522]">/</span>
            <span className="font-sans text-[11px] text-[#A8AAA3]">
              LIMITED CANONICAL SEED DATA / FRONTEND PREVIEW
            </span>
          </div>

          <p className="text-xs text-[#5C5E58] font-sans leading-relaxed max-w-[640px]">
            This route key identifies the frontend demo record. It is not an official SignalFold incident code.
          </p>
        </div>

        {/* Back Link Button */}
        <Link 
          to="/app/incidents"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#242522] hover:border-[#D6FF3F]/30 bg-[#141513]/20 hover:bg-[#D6FF3F]/5 text-[#A8AAA3] hover:text-[#D6FF3F] text-[10px] font-mono font-bold tracking-wider uppercase rounded-[1px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F] self-start"
          style={{ fontFamily: 'var(--font-technical)' }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          BACK TO INCIDENTS
        </Link>
      </div>

      {/* Desktop Split Workspace (Col-span layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        
        {/* Main Workspace (Left Column, col-span 2) */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          
          {/* 1. RESOLVED RECORD SUMMARY */}
          <section className="border border-[#242522] bg-[#141513]/10 rounded-[2px]" aria-label="Resolved Record Summary Panel">
            <div className="border-b border-[#242522] bg-[#0F100D] px-4 py-3 flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                01 // RESOLVED RECORD SUMMARY
              </h3>
              <span className="text-[9px] font-mono text-[#5C5E58] tracking-widest" style={{ fontFamily: 'var(--font-technical)' }}>
                REGISTER VIEW
              </span>
            </div>

            <div className="p-4 sm:p-5 space-y-5">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 font-mono text-[11px]" style={{ fontFamily: 'var(--font-technical)' }}>
                
                <div className="border-b border-[#242522]/40 pb-2 sm:pb-3">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-1">RECORD NAME</dt>
                  <dd className="text-[#F3F1EA] font-sans font-bold text-xs uppercase leading-snug">RESOLVED INCIDENT SEED RECORD</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 sm:pb-3">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-1">INCIDENT CODE</dt>
                  <dd className="text-[#5C5E58] uppercase">NOT SPECIFIED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 sm:pb-3 sm:col-span-2">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-1">TITLE</dt>
                  <dd className="text-[#5C5E58] uppercase">NOT SPECIFIED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 sm:pb-3 sm:col-span-2">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-1">DESCRIPTION</dt>
                  <dd className="text-[#5C5E58] uppercase leading-relaxed font-sans text-xs">NOT AVAILABLE</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 sm:pb-3">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-1">STATUS</dt>
                  <dd className="text-emerald-400 font-bold uppercase">RESOLVED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 sm:pb-3">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-1">SEVERITY</dt>
                  <dd className="text-[#5C5E58] uppercase">NOT SPECIFIED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 sm:pb-3">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-1">SERVICE</dt>
                  <dd className="text-[#5C5E58] uppercase">NOT SPECIFIED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 sm:pb-3">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-1">COMMANDER</dt>
                  <dd className="text-[#5C5E58] uppercase">NOT SPECIFIED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 sm:pb-3">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-1">REPORTED AT</dt>
                  <dd className="text-[#5C5E58] uppercase">NOT AVAILABLE</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 sm:pb-3">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-1">RESOLVED AT</dt>
                  <dd className="text-[#5C5E58] uppercase">NOT AVAILABLE</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 sm:pb-3 sm:col-span-2">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-1">RESOLUTION SUMMARY</dt>
                  <dd className="text-[#5C5E58] uppercase">NOT LOADED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 sm:pb-3">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-1">POSTMORTEM STATE</dt>
                  <dd className="text-emerald-400 font-bold uppercase">APPROVED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 sm:pb-3">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-1">POSTMORTEM CONTENT</dt>
                  <dd className="text-[#5C5E58] uppercase">NOT LOADED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 sm:pb-3">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-1">DATA SOURCE</dt>
                  <dd className="text-[#A8AAA3] uppercase">LIMITED FRONTEND SEED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 sm:pb-3">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-1">BACKEND RECORD</dt>
                  <dd className="text-[#5C5E58] uppercase">NOT CONNECTED</dd>
                </div>

              </dl>
            </div>
          </section>

          {/* 2. AVAILABLE CANONICAL STATE */}
          <section className="border border-[#242522] bg-[#141513]/10 rounded-[2px]" aria-label="Available Canonical State Panel">
            <div className="border-b border-[#242522] bg-[#0F100D] px-4 py-3">
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                02 // AVAILABLE CANONICAL STATE
              </h3>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-[11px]" style={{ fontFamily: 'var(--font-technical)' }}>
                <div className="p-3 bg-[#0A0A0A]/60 border border-[#242522] rounded-[1px] space-y-1">
                  <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-wider">INCIDENT STATE</span>
                  <span className="block text-emerald-400 font-bold uppercase text-xs">RESOLVED</span>
                </div>
                
                <div className="p-3 bg-[#0A0A0A]/60 border border-[#242522] rounded-[1px] space-y-1">
                  <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-wider">POSTMORTEM STATE</span>
                  <span className="block text-emerald-400 font-bold uppercase text-xs">APPROVED</span>
                </div>

                <div className="p-3 bg-[#0A0A0A]/60 border border-[#242522] rounded-[1px] space-y-1">
                  <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-wider">RECORD DETAIL</span>
                  <span className="block text-[#A8AAA3] font-bold uppercase text-xs">LIMITED</span>
                </div>

                <div className="p-3 bg-[#0A0A0A]/60 border border-[#242522] rounded-[1px] space-y-1">
                  <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-wider">AUTHORITY SOURCE</span>
                  <span className="block text-[#5C5E58] uppercase text-xs">NOT CONNECTED</span>
                </div>

                <div className="p-3 bg-[#0A0A0A]/60 border border-[#242522] rounded-[1px] space-y-1 sm:col-span-2 lg:col-span-2">
                  <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-wider">PERSISTENCE CONNECTION</span>
                  <span className="block text-[#5C5E58] uppercase text-xs">NOT CONNECTED</span>
                </div>
              </div>

              <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
                The approved demo specification confirms only the resolved incident state and approved Postmortem state. Detailed incident history has not been specified.
              </p>
            </div>
          </section>

          {/* 3. DATA LIMITATION NOTICE */}
          <section className="border border-amber-500/20 bg-amber-500/[0.02] rounded-[2px] p-4 sm:p-5 space-y-3.5" aria-label="Data Limitation Warning Panel">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <h3 className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                LIMITED SEED DETAIL
              </h3>
            </div>

            <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
              SignalFold will not invent incident identity, operational history, actors, timestamps, service ownership, resolution evidence, or Postmortem content when the canonical seed specification does not provide them.
            </p>

            <div className="pt-2 border-t border-[#242522]/40 flex flex-wrap items-center justify-between gap-2 font-mono text-[9px] text-[#5C5E58]" style={{ fontFamily: 'var(--font-technical)' }}>
              <span className="font-bold tracking-wider uppercase text-amber-500/95">
                MISSING DEMO DATA REMAINS EXPLICITLY UNAVAILABLE.
              </span>
              <span className="uppercase tracking-wider">
                RULE 042 // PRESERVE CANONICAL INTEGRITY
              </span>
            </div>
          </section>

          {/* 4. POSTMORTEM ACCESS SECTION */}
          <section className="border border-[#242522] bg-[#141513]/10 rounded-[2px]" aria-label="Postmortem Access Panel">
            <div className="border-b border-[#242522] bg-[#0F100D] px-4 py-3">
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                03 // POSTMORTEM ACCESS
              </h3>
            </div>

            <div className="p-4 sm:p-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-[10px]" style={{ fontFamily: 'var(--font-technical)' }}>
                <div className="p-2.5 bg-[#0A0A0A]/40 border border-[#242522] rounded-[1px]">
                  <div className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">POSTMORTEM STATE</div>
                  <div className="text-emerald-400 font-bold uppercase">APPROVED</div>
                </div>

                <div className="p-2.5 bg-[#0A0A0A]/40 border border-[#242522] rounded-[1px]">
                  <div className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">CONTENT STATE</div>
                  <div className="text-[#5C5E58] uppercase">NOT LOADED</div>
                </div>

                <div className="p-2.5 bg-[#0A0A0A]/40 border border-[#242522] rounded-[1px]">
                  <div className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">EDITOR ROUTE</div>
                  <div className="text-emerald-400 uppercase font-bold">AVAILABLE</div>
                </div>

                <div className="p-2.5 bg-[#0A0A0A]/40 border border-[#242522] rounded-[1px]">
                  <div className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">AUTHORITY</div>
                  <div className="text-[#5C5E58] uppercase">NOT CONNECTED</div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
                  Open the approved Postmortem access foundation. Detailed Postmortem content remains unavailable until a canonical draft or backend record is connected.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/app/incidents/resolved-seed/postmortem')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#D6FF3F] hover:bg-[#D6FF3F]/90 text-black text-xs font-mono font-bold tracking-wider uppercase rounded-[1px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6FF3F] cursor-pointer"
                    style={{ fontFamily: 'var(--font-technical)' }}
                    aria-label="Open Approved Postmortem Foundation"
                  >
                    <FileText className="w-4 h-4 shrink-0" />
                    OPEN POSTMORTEM
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Operational Rail (col-span 1) */}
        <div className="space-y-6">
          
          {/* POSTMORTEM SUMMARY Panel */}
          <aside className="border border-[#242522] bg-[#0D0E0C] rounded-[2px]" aria-label="Postmortem Summary Panel">
            <div className="border-b border-[#242522] bg-[#0F100D] px-4 py-3">
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                POSTMORTEM
              </h3>
            </div>

            <div className="p-4 space-y-4">
              <dl className="space-y-3 font-mono text-[10px]" style={{ fontFamily: 'var(--font-technical)' }}>
                <div className="flex justify-between border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase">STATE</dt>
                  <dd className="text-emerald-400 font-bold uppercase">APPROVED</dd>
                </div>
                
                <div className="flex justify-between border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase">CONTENT</dt>
                  <dd className="text-[#5C5E58] uppercase">NOT LOADED</dd>
                </div>

                <div className="flex justify-between border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase">APPROVER</dt>
                  <dd className="text-[#5C5E58] uppercase">NOT AVAILABLE</dd>
                </div>

                <div className="flex justify-between border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase">APPROVED AT</dt>
                  <dd className="text-[#5C5E58] uppercase">NOT AVAILABLE</dd>
                </div>

                <div className="flex justify-between border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase">VERSION</dt>
                  <dd className="text-[#5C5E58] uppercase">NOT AVAILABLE</dd>
                </div>

                <div className="flex justify-between border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase">PERSISTENCE</dt>
                  <dd className="text-[#5C5E58] uppercase">NOT CONNECTED</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => navigate('/app/incidents/resolved-seed/postmortem')}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#D6FF3F] hover:bg-[#D6FF3F]/90 text-black text-[10px] font-mono font-bold tracking-wider uppercase rounded-[1px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F] cursor-pointer"
                style={{ fontFamily: 'var(--font-technical)' }}
                aria-label="Open Approved Postmortem"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                OPEN POSTMORTEM
              </button>
            </div>
          </aside>

          {/* RECORD METADATA Panel */}
          <aside className="border border-[#242522] bg-[#0D0E0C] rounded-[2px]" aria-label="Record Metadata Panel">
            <div className="border-b border-[#242522] bg-[#0F100D] px-4 py-3">
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                RECORD METADATA
              </h3>
            </div>

            <div className="p-4">
              <dl className="space-y-3 font-mono text-[10px]" style={{ fontFamily: 'var(--font-technical)' }}>
                <div className="flex justify-between border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase">ORGANIZATION</dt>
                  <dd className="text-[#A8AAA3] font-bold uppercase">NORTHSTAR COMMERCE</dd>
                </div>

                <div className="flex justify-between border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase">RECORD TYPE</dt>
                  <dd className="text-[#A8AAA3] uppercase">RESOLVED SEED</dd>
                </div>

                <div className="flex justify-between border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase">ROUTE KEY</dt>
                  <dd className="text-[#D6FF3F] font-bold">resolved-seed</dd>
                </div>

                <div className="flex justify-between border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase">OFFICIAL CODE</dt>
                  <dd className="text-[#5C5E58] uppercase font-bold">NOT SPECIFIED</dd>
                </div>

                <div className="flex justify-between border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase">DATA SOURCE</dt>
                  <dd className="text-[#A8AAA3] uppercase">FRONTEND SEED</dd>
                </div>

                <div className="flex justify-between border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase">BACKEND AUTHORITY</dt>
                  <dd className="text-[#5C5E58] uppercase">NOT CONNECTED</dd>
                </div>
              </dl>
            </div>
          </aside>

        </div>

      </div>

    </div>
  );
}
