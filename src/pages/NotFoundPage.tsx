import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo } from '@/components/brand/BrandLogo';

/**
 * Wildcard 404 Not Found Page for SignalFold.
 */
export function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  useEffect(() => {
    document.title = 'Page Not Found — SignalFold';
  }, []);

  const handleGoBack = () => {
    // If there is history to go back to, navigate back. Otherwise, fall back to home.
    if (typeof window !== 'undefined' && window.history && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F3F1EA] flex flex-col justify-between selection:bg-[#D6FF3F] selection:text-[#0A0A0A] relative overflow-x-hidden p-4 sm:p-6 lg:p-8">
      {/* Background Subtle Tech Grid (Aria-Hidden) */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#141513_1px,transparent_1px),linear-gradient(to_bottom,#141513_1px,transparent_1px)] bg-[size:32px_32px] opacity-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Top System Header */}
      <header className="relative z-10 flex justify-between items-center pb-6 border-b border-[#242522] w-full">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[2px]"
            aria-label="SignalFold Home"
          >
            <BrandLogo size="md" />
          </Link>
          <div 
            className="hidden sm:flex items-center gap-2 border-l border-[#242522] pl-4 font-mono text-[10px] tracking-widest text-[#5C5E58] uppercase"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            <span>SYSTEM</span>
            <span className="text-[#242522]" aria-hidden="true">/</span>
            <span className="text-[#A8AAA3] font-bold">SIGNALFOLD</span>
          </div>
        </div>
        <div 
          className="font-mono text-[10px] tracking-widest text-right text-[#A8AAA3] font-bold uppercase"
          style={{ fontFamily: 'var(--font-technical)' }}
        >
          ERROR STATE <span className="text-[#242522]" aria-hidden="true">/</span> <span className="text-[#F3F1EA]">ROUTE UNRESOLVED</span>
        </div>
      </header>

      {/* Main Error Composition */}
      <main className="relative z-10 flex-1 my-auto py-12 lg:py-16 max-w-7xl w-full mx-auto grid grid-cols-1 min-[900px]:grid-cols-12 gap-8 min-[900px]:gap-12 items-center">
        {/* Left Column (Editorial Headline and Context) */}
        <div className="min-[900px]:col-span-7 space-y-6 text-left">
          {/* Technical Eyebrow */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#141513] border border-[#242522]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" aria-hidden="true" />
            <span 
              className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase text-[#D6FF3F]"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              404 / SIGNAL LOST
            </span>
          </div>

          {/* Display Headline */}
          <h1 
            className="text-4xl sm:text-6xl font-bold tracking-tight text-[#F3F1EA] leading-[1.05]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            THIS ROUTE<br />
            DID NOT RESOLVE.
          </h1>

          {/* Supporting Copy */}
          <p 
            className="text-base sm:text-lg text-[#A8AAA3] max-w-[520px] leading-relaxed"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            The requested SignalFold path could not be found. Return to the command surface or step back to the previous valid location.
          </p>

          {/* Actions Group */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:max-w-md">
            {/* Primary Action Button */}
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-mono font-bold tracking-widest bg-[#F3F1EA] text-[#0A0A0A] hover:bg-[#D6FF3F] hover:text-[#0A0A0A] rounded-[2px] border border-[#F3F1EA] hover:border-[#D6FF3F] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#4B78FF] select-none text-center"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              RETURN HOME
            </Link>
            
            {/* Secondary Action Button */}
            <button
              onClick={handleGoBack}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-mono font-bold tracking-widest text-[#F3F1EA] hover:text-[#D6FF3F] border border-[#242522] hover:border-[#D6FF3F]/50 rounded-[2px] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#4B78FF] select-none cursor-pointer text-center"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              GO BACK
            </button>
          </div>
        </div>

        {/* Right Column (Technical Status Panel) */}
        <div className="min-[900px]:col-span-5 bg-[#141513]/40 border border-[#242522] p-6 rounded-[2px] space-y-5">
          <div 
            className="text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase pb-2 border-b border-[#242522]"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            SYSTEM ERROR STATUS PANEL
          </div>
          
          <div 
            className="space-y-4 font-mono text-xs tracking-wider"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            {/* REQUEST STATUS */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-[#5C5E58] font-bold">REQUEST STATUS</span>
              <span className="text-[#F3F1EA] font-bold">NOT FOUND</span>
            </div>

            {/* ERROR CODE */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-[#5C5E58] font-bold">ERROR CODE</span>
              <span className="text-[#D6FF3F] font-bold">404</span>
            </div>

            {/* SYSTEM STATE */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-[#5C5E58] font-bold">SYSTEM STATE</span>
              <span className="text-[#A8AAA3] font-bold">OPERATIONAL</span>
            </div>

            {/* CURRENT PATH */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-[#5C5E58] font-bold">CURRENT PATH</span>
              <span className="text-[#F3F1EA] font-mono font-medium select-all break-all bg-[#0A0A0A] p-2 border border-[#242522] rounded-[1px] text-[11px] leading-relaxed">
                {currentPath}
              </span>
            </div>

            {/* RECOVERY MODE */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-[#5C5E58] font-bold">RECOVERY MODE</span>
              <span className="text-[#A8AAA3] font-bold">MANUAL NAVIGATION</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer System Rails */}
      <footer className="relative z-10 w-full mt-auto space-y-6">
        {/* 1. Technical Assurance Rail */}
        <div className="border-t border-[#242522] pt-4">
          <div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#242522] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-[#A8AAA3]"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            <div className="flex items-center gap-2 pb-2 sm:pb-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5C5E58]" aria-hidden="true" />
              <span>SYSTEM AVAILABLE</span>
            </div>
            <div className="flex items-center gap-2 pt-2 sm:pt-0 sm:pl-6 pb-2 sm:pb-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5C5E58]" aria-hidden="true" />
              <span>REQUEST UNRESOLVED</span>
            </div>
            <div className="flex items-center gap-2 pt-2 sm:pt-0 sm:pl-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" aria-hidden="true" />
              <span>SAFE RETURN READY</span>
            </div>
          </div>
        </div>

        {/* 2. Bottom System Rail */}
        <div 
          className="pt-6 border-t border-[#242522] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[9px] sm:text-[10px] text-[#5C5E58] tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-technical)' }}
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>SIGNALFOLD</span>
            <span className="text-[#242522]" aria-hidden="true">/</span>
            <span>ROUTE CONTROL</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span>NO INCIDENT DATA WAS CHANGED</span>
          </div>
          <div className="flex items-center gap-2 text-[#A8AAA3] font-bold">
            <span>END OF REQUEST // RETURN AVAILABLE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] animate-pulse motion-reduce:animate-none" aria-hidden="true" />
          </div>
        </div>
      </footer>
    </div>
  );
}
