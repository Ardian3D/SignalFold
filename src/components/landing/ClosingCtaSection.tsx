import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export interface ClosingCtaSectionProps {
  className?: string;
}

export const ClosingCtaSection: React.FC<ClosingCtaSectionProps> = ({ className = '' }) => {
  return (
    <section
      id="closing-cta"
      className={`relative w-full bg-[#0A0A0A] text-[#F3F1EA] py-16 sm:py-20 lg:py-24 border-b border-[#242522] scroll-mt-20 selection:bg-[#D6FF3F] selection:text-[#0A0A0A] overflow-hidden ${className}`}
      aria-label="SignalFold Closing Action Call"
    >
      {/* Background Subtle Tech Grid */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#141513_1px,transparent_1px),linear-gradient(to_bottom,#141513_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-8 min-[900px]:gap-12 items-start">
          
          {/* Left Column: Eyebrow, Main Headline, Supporting Copy */}
          <div className="min-[900px]:col-span-7 space-y-5 text-left">
            {/* Technical Eyebrow */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#141513] border border-[#242522]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" aria-hidden="true" />
              <span 
                className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase text-[#D6FF3F]"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                05 / READY FOR RESPONSE
              </span>
            </div>

            {/* Display Headline */}
            <h2 
              className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F3F1EA] leading-[1.06] text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              THE NEXT SIGNAL<br />
              SHOULD NOT GET LOST.
            </h2>

            {/* Supporting Copy */}
            <p 
              className="text-base sm:text-lg text-[#A8AAA3] max-w-[560px] leading-relaxed"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Bring reports, severity, ownership, response tasks, realtime activity, resolution, and postmortem learning into one controlled incident workflow.
            </p>
          </div>

          {/* Right Column: Structured Action Area / CTA controls */}
          <div className="min-[900px]:col-span-5 w-full flex flex-col justify-between self-stretch pt-4 min-[900px]:pt-10 min-[900px]:pl-8 min-[900px]:border-l min-[900px]:border-[#242522] min-h-[180px]">
            {/* Action Box Container */}
            <div className="space-y-4 w-full">
              {/* Primary CTA */}
              <Link
                to="/demo"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 text-xs font-mono font-bold tracking-widest bg-[#F3F1EA] text-[#0A0A0A] hover:bg-[#D6FF3F] hover:text-[#0A0A0A] rounded-[2px] border border-[#F3F1EA] hover:border-[#D6FF3F] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#4B78FF] group select-none"
              >
                <span>START A DEMO INCIDENT</span>
                <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>

              {/* Secondary CTA */}
              <Link
                to="/app"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 text-xs font-mono font-bold tracking-widest text-[#F3F1EA] hover:text-[#D6FF3F] border border-[#242522] hover:border-[#D6FF3F]/50 rounded-[2px] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#4B78FF] group select-none"
              >
                <span>OPEN DASHBOARD</span>
                <span className="w-1.5 h-1.5 bg-[#5C5E58] group-hover:bg-[#D6FF3F] rounded-full transition-colors" />
              </Link>
            </div>

            {/* Desktop Connective Structural Divider Rule */}
            <div className="hidden min-[900px]:block pt-6">
              <div className="border-t border-[#242522] w-full" />
            </div>
          </div>

        </div>

        {/* Technical Assurance Rail */}
        <div className="mt-12 sm:mt-16 pt-6 border-t border-[#242522]">
          <div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#242522] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-[#A8AAA3]"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            <div className="flex items-center gap-2 pb-3 sm:pb-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] animate-pulse motion-reduce:animate-none" aria-hidden="true" />
              <span>AI ASSISTS</span>
            </div>
            <div className="flex items-center gap-2 pt-3 sm:pt-0 sm:pl-6 pb-3 sm:pb-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" aria-hidden="true" />
              <span>HUMANS DECIDE</span>
            </div>
            <div className="flex items-center gap-2 pt-3 sm:pt-0 sm:pl-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" aria-hidden="true" />
              <span>EVERY ACTION TRACEABLE</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
