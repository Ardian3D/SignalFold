import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Activity } from 'lucide-react';
import { SignalFlowVisual } from './SignalFlowVisual';

export interface LandingHeroProps {
  className?: string;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ className = '' }) => {
  const technicalIndices = [
    { num: '01', title: 'DETECT' },
    { num: '02', title: 'COORDINATE' },
    { num: '03', title: 'RESOLVE' },
  ];

  const metadataItems = [
    { label: 'BASE44 BACKEND', val: 'CLUSTERED' },
    { label: 'DEEPSEEK INTELLIGENCE', val: 'V3 / ACTIVE' },
    { label: 'REALTIME RESPONSE', val: '< 50MS SLA' },
  ];

  return (
    <section
      id="product"
      className={`relative w-full bg-[#0A0A0A] text-[#F3F1EA] flex flex-col justify-between overflow-hidden border-b border-[#242522] scroll-mt-20 selection:bg-[#D6FF3F] selection:text-[#0A0A0A] ${className}`}
      aria-label="Incident Command Center Introduction"
    >
      {/* Background Subtle Tech Grid */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#141513_1px,transparent_1px),linear-gradient(to_bottom,#141513_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 xl:py-10 flex-1 flex flex-col justify-center">
        {/* Top Status Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8 text-[10px] font-mono tracking-widest text-[#A8AAA3] uppercase border-b border-[#242522] pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D6FF3F] animate-pulse motion-reduce:animate-none" />
            <span className="text-[#F3F1EA] font-semibold">SYSTEM STATUS / READY</span>
          </div>

          <div className="flex items-center gap-6 text-[#5C5E58] hidden sm:flex">
            <span>INCIDENT COMMAND ROOM v2.4</span>
            <span className="text-[#D6FF3F]">// OPERATIONAL</span>
          </div>
        </div>

        {/* Responsive Grid: 1 Column on <1200px (Mobile, Tablet, Medium Desktop), 2 Columns on xl: (1200px+) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12 items-center">
          {/* Left Column: Eyebrow, Main Headline, Supporting Copy, CTAs, Technical Indices */}
          <div className="xl:col-span-7 space-y-5 sm:space-y-6 text-left w-full">
            {/* Technical Eyebrow */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#141513] border border-[#242522]">
              <Activity className="w-3.5 h-3.5 text-[#D6FF3F]" aria-hidden="true" />
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase text-[#D6FF3F]">
                AI-ASSISTED INCIDENT COMMAND
              </span>
            </div>

            {/* Display Headline - Fully visible, responsive fluid clamp without clipping */}
            <h1 className="font-['Sora'] text-[clamp(2.5rem,7vw,4.75rem)] xl:text-[clamp(3.25rem,5.2vw,5.75rem)] font-bold tracking-tight leading-[1.04] text-[#F3F1EA] text-left w-full block">
              <span className="block text-[#F3F1EA]">TURN SIGNALS</span>
              <span className="block text-[#F3F1EA]">
                INTO <span className="text-[#D6FF3F]">ACTION.</span>
              </span>
            </h1>

            {/* Supporting Copy - Controlled readable width max-w-[520px] */}
            <p className="font-sans text-base sm:text-lg text-[#A8AAA3] max-w-[520px] w-full leading-relaxed">
              Transform scattered incident reports into structured response plans, realtime coordination, and actionable postmortems.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
              <Link
                to="/demo"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-mono font-bold tracking-widest bg-[#F3F1EA] text-[#0A0A0A] hover:bg-[#D6FF3F] hover:text-[#0A0A0A] rounded-[2px] border border-[#F3F1EA] hover:border-[#D6FF3F] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#4B78FF] group select-none"
              >
                <span>OPEN DEMO</span>
                <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
              </Link>

              <a
                href="#workflow"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-mono font-bold tracking-widest text-[#F3F1EA] hover:text-[#D6FF3F] border border-[#242522] hover:border-[#D6FF3F]/50 rounded-[2px] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#4B78FF] group select-none"
              >
                <span>VIEW THE WORKFLOW</span>
                <span className="w-1.5 h-1.5 bg-[#5C5E58] group-hover:bg-[#D6FF3F] rounded-full transition-colors" />
              </a>
            </div>

            {/* Technical Index Items */}
            <div className="pt-4 border-t border-[#242522] flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-mono">
              {technicalIndices.map((idx) => (
                <div key={idx.num} className="flex items-center gap-2">
                  <span className="text-[#D6FF3F] font-bold">{idx.num}</span>
                  <span className="text-[#5C5E58] font-bold">/</span>
                  <span className="text-[#F3F1EA] font-semibold tracking-wider">{idx.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Abstract Signal Topology Visual - Below left column on <1200px, 2nd column on 1200px+ */}
          <div className="xl:col-span-5 w-full flex justify-center xl:justify-end">
            <SignalFlowVisual className="w-full max-w-[560px] xl:max-w-[520px]" />
          </div>
        </div>
      </div>

      {/* Bottom Technical Status Rail */}
      <div className="relative z-10 w-full border-t border-[#242522] bg-[#141513]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#242522] text-[11px] font-mono">
            {metadataItems.map((item, index) => (
              <div
                key={item.label}
                className={`flex items-center justify-between ${index !== 0 ? 'pt-2 sm:pt-0 sm:pl-6' : ''}`}
              >
                <span className="text-[#A8AAA3] tracking-widest uppercase">{item.label}</span>
                <span className="text-[#D6FF3F] font-bold tracking-wider">{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
