import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/brand/BrandLogo';

export interface LandingFooterProps {
  className?: string;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ className = '' }) => {
  return (
    <footer
      id="landing-footer"
      className={`relative w-full bg-[#0A0A0A] text-[#F3F1EA] py-12 sm:py-16 border-t border-[#242522] selection:bg-[#D6FF3F] selection:text-[#0A0A0A] overflow-hidden ${className}`}
      aria-label="SignalFold Operational Footer"
    >
      {/* Background Subtle Tech Grid (Aria-Hidden) */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#141513_1px,transparent_1px),linear-gradient(to_bottom,#141513_1px,transparent_1px)] bg-[size:32px_32px] opacity-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Three-Column Grid on Desktop */}
        <div className="grid grid-cols-1 min-[900px]:grid-cols-3 gap-8 min-[900px]:gap-0 min-[900px]:divide-x min-[900px]:divide-[#242522] items-stretch">
          
          {/* 1. BRAND ZONE */}
          <div className="flex flex-col items-start justify-between pb-6 min-[900px]:pb-0 min-[900px]:pr-8">
            <div className="space-y-4">
              <Link
                to="/"
                className="inline-block rounded-[2px] focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
                aria-label="SignalFold Home"
              >
                <BrandLogo size="md" />
              </Link>
              <div className="space-y-1">
                <div 
                  className="text-[10px] font-mono font-bold tracking-widest text-[#D6FF3F] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  AI-ASSISTED INCIDENT COMMAND
                </div>
                <div 
                  className="text-xs text-[#A8AAA3] font-medium"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  TURN SIGNALS INTO ACTION.
                </div>
              </div>
            </div>
            {/* Soft decorative bottom space to balance columns */}
            <div className="hidden min-[900px]:block h-4" />
          </div>

          {/* 2. NAVIGATION ZONE */}
          <nav
            className="py-6 min-[900px]:py-0 min-[900px]:px-8 border-t border-[#242522] min-[900px]:border-t-0 border-b min-[900px]:border-b-0"
            aria-label="Footer Site Navigation"
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {/* Column A: Sections */}
              <div className="flex flex-col space-y-2">
                <span 
                  className="text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase select-none mb-1"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  SECTIONS
                </span>
                <a
                  href="#product"
                  className="inline-block py-1 text-[11px] font-mono font-bold tracking-wider text-[#A8AAA3] hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  PRODUCT
                </a>
                <a
                  href="#workflow"
                  className="inline-block py-1 text-[11px] font-mono font-bold tracking-wider text-[#A8AAA3] hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  WORKFLOW
                </a>
                <a
                  href="#incident-room"
                  className="inline-block py-1 text-[11px] font-mono font-bold tracking-wider text-[#A8AAA3] hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  INCIDENT ROOM
                </a>
                <a
                  href="#postmortem"
                  className="inline-block py-1 text-[11px] font-mono font-bold tracking-wider text-[#A8AAA3] hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  POSTMORTEM
                </a>
              </div>

              {/* Column B: Actions */}
              <div className="flex flex-col space-y-2">
                <span 
                  className="text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase select-none mb-1"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  ACTIONS
                </span>
                <Link
                  to="/demo"
                  className="inline-block py-1 text-[11px] font-mono font-bold tracking-wider text-[#A8AAA3] hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  START A DEMO INCIDENT
                </Link>
                <Link
                  to="/app"
                  className="inline-block py-1 text-[11px] font-mono font-bold tracking-wider text-[#A8AAA3] hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  OPEN DASHBOARD
                </Link>
                <Link
                  to="/login"
                  className="inline-block py-1 text-[11px] font-mono font-bold tracking-wider text-[#A8AAA3] hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  SIGN IN
                </Link>
              </div>
            </div>
          </nav>

          {/* 3. SYSTEM / LEGAL ZONE */}
          <div className="pt-6 min-[900px]:pt-0 min-[900px]:pl-8 flex flex-col justify-between space-y-6 min-[900px]:space-y-0 h-full">
            {/* System Status / Metadata */}
            <div 
              className="space-y-2.5 font-mono text-[10px] tracking-widest text-[#A8AAA3]"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <div className="flex justify-between border-b border-[#242522] pb-1.5">
                <span className="text-[#5C5E58] font-bold">SYSTEM</span>
                <span className="text-[#F3F1EA] font-bold">SIGNALFOLD</span>
              </div>
              <div className="flex justify-between border-b border-[#242522] pb-1.5">
                <span className="text-[#5C5E58] font-bold">STATUS</span>
                <span className="text-[#D6FF3F] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#D6FF3F] rounded-full animate-pulse motion-reduce:animate-none" aria-hidden="true" />
                  OPERATIONAL DESIGN
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C5E58] font-bold">AUTHORITY</span>
                <span className="text-[#F3F1EA] font-bold">HUMAN CONTROLLED</span>
              </div>
            </div>

            {/* Legal Links, Copyright & Back to Top */}
            <div className="space-y-3.5 pt-4 border-t border-[#242522]">
              <div 
                className="flex items-center justify-between text-[11px] font-mono font-bold tracking-wider text-[#A8AAA3]"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                <div className="flex gap-4">
                  <Link
                    to="/privacy"
                    className="hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
                  >
                    PRIVACY
                  </Link>
                  <Link
                    to="/terms"
                    className="hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
                  >
                    TERMS
                  </Link>
                </div>
                <button
                  onClick={() => {
                    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    window.scrollTo({
                      top: 0,
                      behavior: prefersReduced ? 'auto' : 'smooth',
                    });
                  }}
                  className="hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF] flex items-center gap-1 cursor-pointer"
                  aria-label="Back to top of page"
                >
                  BACK TO TOP ↑
                </button>
              </div>
              <div 
                className="text-[10px] font-mono text-[#5C5E58] tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                © 2026 SIGNALFOLD
              </div>
            </div>
          </div>

        </div>

        {/* Bottom System Rail */}
        <div 
          className="mt-12 pt-6 border-t border-[#242522] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[9px] sm:text-[10px] text-[#5C5E58] tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-technical)' }}
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>SIGNALFOLD</span>
            <span className="text-[#242522]" aria-hidden="true">/</span>
            <span>AI-ASSISTED INCIDENT COMMAND</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span>AI PROPOSES</span>
            <span className="text-[#242522]" aria-hidden="true">/</span>
            <span>HUMANS DECIDE</span>
          </div>
          <div className="flex items-center gap-2 text-[#A8AAA3] font-bold">
            <span>END OF RECORD // READY FOR RESPONSE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] animate-pulse motion-reduce:animate-none" aria-hidden="true" />
          </div>
        </div>

      </div>
    </footer>
  );
};
