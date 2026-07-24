import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Bell, User } from 'lucide-react';
import { BrandLogo } from '@/components/brand/BrandLogo';

interface AppShellProps {
  children: ReactNode;
}

/**
 * Reusable SignalFold Application Shell
 * Implements desktop (>=1024px) sidebar, top operational header, and main content canvas,
 * and responsive mobile (<1024px) top header, drawer menu, and bottom navigation.
 */
export function AppShell({ children }: AppShellProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  const isIncidentsActive = location.pathname === '/app/incidents' || location.pathname === '/app/incidents/SF-2026-0042';
  const isIncidentsNewActive = location.pathname === '/app/incidents/new';
  const isDashboardActive = location.pathname === '/app';
  const isIncidentRoomActive = location.pathname === '/app/incidents/SF-2026-0042';

  // Set page title for the SignalFold App
  useEffect(() => {
    if (isIncidentRoomActive) {
      document.title = 'SF-2026-0042 Room — SignalFold';
    } else if (isIncidentsNewActive) {
      document.title = 'Create Incident — SignalFold';
    } else if (isIncidentsActive) {
      document.title = 'Incidents — SignalFold';
    } else {
      document.title = 'Dashboard — SignalFold';
    }
  }, [isIncidentsActive, isIncidentsNewActive, isIncidentRoomActive]);

  // Handle keydown to close mobile menu drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      data-theme="dark" 
      className="dark min-h-screen bg-[#0A0A0A] text-[#F3F1EA] flex flex-col lg:flex-row relative selection:bg-[#D6FF3F] selection:text-[#0A0A0A]"
    >
      {/* Background Subtle Grid Accent (Aria-Hidden) */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#141513_1px,transparent_1px),linear-gradient(to_bottom,#141513_1px,transparent_1px)] bg-[size:32px_32px] opacity-10 pointer-events-none" 
        aria-hidden="true" 
      />

      {/* MOBILE & TABLET APPLICATION HEADER (<1024px) */}
      <header className="lg:hidden h-14 border-b border-[#242522] bg-[#0A0A0A] px-4 flex items-center justify-between sticky top-0 z-30 w-full">
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" />
          <div className="border-l border-[#242522] pl-3 font-mono text-[9px] tracking-widest text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            <span>SYSTEM</span>
            <span className="mx-1 text-[#242522]" aria-hidden="true">/</span>
            <span className="text-[#A8AAA3] font-bold">SIGNALFOLD</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-amber-500/20 bg-amber-500/5 px-1.5 py-0.5 text-[8px] font-mono font-bold tracking-wider text-amber-500 rounded-[2px]" style={{ fontFamily: 'var(--font-technical)' }}>
            <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
            <span>PREVIEW</span>
          </div>
          
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-expanded={isDrawerOpen}
            aria-label="Open Navigation Menu"
            className="p-1.5 text-[#A8AAA3] hover:text-[#D6FF3F] border border-[#242522] bg-[#141513]/10 rounded-[2px] focus-visible:outline-2 focus-visible:outline-[#4B78FF] min-h-[36px] flex items-center justify-center cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* DESKTOP APPLICATION SIDEBAR (>=1024px) */}
      <aside 
        aria-label="Desktop Sidebar"
        className="hidden lg:flex w-[240px] shrink-0 border-r border-[#242522] bg-[#0A0A0A] flex-col min-h-screen h-screen sticky top-0 p-4 z-20 self-start overflow-y-auto overflow-x-hidden"
      >
        <div className="space-y-6 flex flex-col">
          {/* Top Brand Area */}
          <div className="flex items-center gap-3 pb-4 border-b border-[#242522]">
            <BrandLogo size="sm" />
            <div 
              className="border-l border-[#242522] pl-3 font-mono text-[9px] tracking-widest text-[#5C5E58] uppercase" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span>SYSTEM</span>
              <span className="mx-1 text-[#242522]" aria-hidden="true">/</span>
              <span className="text-[#A8AAA3] font-bold">SIGNALFOLD</span>
            </div>
          </div>

          {/* Workspace Context Block */}
          <div className="p-3 bg-[#141513]/40 border border-[#242522] space-y-2 rounded-[2px]" aria-label="Workspace Context">
            <div>
              <div className="text-[9px] font-mono text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>ORGANIZATION</div>
              <div className="text-[11px] font-mono font-bold text-[#F3F1EA] tracking-wide" style={{ fontFamily: 'var(--font-technical)' }}>NORTHSTAR COMMERCE</div>
            </div>
            <div>
              <div className="text-[9px] font-mono text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>MODE</div>
              <div className="text-[11px] font-mono font-bold text-[#D6FF3F] tracking-wide" style={{ fontFamily: 'var(--font-technical)' }}>FRONTEND PREVIEW</div>
            </div>
          </div>

          {/* Primary Navigation */}
          <nav aria-label="Desktop Sidebar Navigation" className="space-y-2.5">
            {isDashboardActive ? (
              <Link
                to="/app"
                aria-current="page"
                className="flex items-center justify-between px-3 py-2 text-xs font-mono font-bold text-[#D6FF3F] bg-[#141513] border border-[#242522] focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[2px] w-full"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" />
                  DASHBOARD
                </span>
                <span className="text-[9px] tracking-wider uppercase text-[#D6FF3F] border border-[#D6FF3F]/20 px-1 py-0.5 bg-[#D6FF3F]/5">ACTIVE</span>
              </Link>
            ) : (
              <Link
                to="/app"
                className="flex items-center justify-between px-3 py-2 text-xs font-mono font-bold text-[#A8AAA3] hover:text-[#D6FF3F] hover:bg-[#141513]/40 border border-transparent focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[2px] w-full"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                <span className="flex items-center gap-2">
                  DASHBOARD
                </span>
              </Link>
            )}

            {isIncidentsActive ? (
              <Link
                to="/app/incidents"
                aria-current="page"
                className="flex items-center justify-between px-3 py-2 text-xs font-mono font-bold text-[#D6FF3F] bg-[#141513] border border-[#242522] focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[2px] w-full"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" />
                  INCIDENTS
                </span>
                <span className="text-[9px] tracking-wider uppercase text-[#D6FF3F] border border-[#D6FF3F]/20 px-1 py-0.5 bg-[#D6FF3F]/5">ACTIVE</span>
              </Link>
            ) : (
              <Link
                to="/app/incidents"
                className="flex items-center justify-between px-3 py-2 text-xs font-mono font-bold text-[#A8AAA3] hover:text-[#D6FF3F] hover:bg-[#141513]/40 border border-transparent focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[2px] w-full"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                <span className="flex items-center gap-2">
                  INCIDENTS
                </span>
              </Link>
            )}

            <div
              role="link"
              aria-disabled="true"
              className="flex items-center justify-between px-3 py-2 text-xs font-mono font-bold text-[#5C5E58] border border-dashed border-[#242522]/60 select-none rounded-[2px]"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span>SERVICES</span>
              <span className="text-[9px] tracking-wider uppercase text-[#5C5E58] border border-[#242522]/60 px-1 py-0.5">PENDING</span>
            </div>

            <div
              role="link"
              aria-disabled="true"
              className="flex items-center justify-between px-3 py-2 text-xs font-mono font-bold text-[#5C5E58] border border-dashed border-[#242522]/60 select-none rounded-[2px]"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span>TEAM</span>
              <span className="text-[9px] tracking-wider uppercase text-[#5C5E58] border border-[#242522]/60 px-1 py-0.5">PENDING</span>
            </div>
          </nav>
        </div>

        {/* Flexible middle space */}
        <div className="flex-1 min-h-[24px]" />

        {/* Sidebar Bottom Segment */}
        <div className="space-y-4">
          {/* Settings Secondary Navigation */}
          <div
            role="link"
            aria-disabled="true"
            className="flex items-center justify-between px-3 py-2 text-xs font-mono font-bold text-[#5C5E58] border border-dashed border-[#242522]/60 select-none rounded-[2px]"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            <span>SETTINGS</span>
            <span className="text-[9px] tracking-wider uppercase text-[#5C5E58] border border-[#242522]/60 px-1 py-0.5">PENDING</span>
          </div>

          {/* New Incident Primary Enabled Action */}
          {isIncidentsNewActive ? (
            <Link
              to="/app/incidents/new"
              aria-current="page"
              className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-mono font-bold tracking-wider text-[#D6FF3F] bg-[#141513] border border-[#242522] rounded-[2px]"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" />
                NEW INCIDENT
              </span>
              <span className="text-[9px] tracking-wider uppercase text-[#D6FF3F] border border-[#D6FF3F]/20 px-1 py-0.5 bg-[#D6FF3F]/5">ACTIVE</span>
            </Link>
          ) : (
            <Link
              to="/app/incidents/new"
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-mono font-bold tracking-wider text-[#A8AAA3] hover:text-[#D6FF3F] hover:bg-[#141513]/40 border border-[#242522] bg-[#141513]/10 rounded-[2px] transition-colors"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              + NEW INCIDENT
            </Link>
          )}

          {/* Technical Metadata Footer */}
          <div className="p-3 bg-[#141513]/20 border border-[#242522] space-y-2 rounded-[2px]" aria-label="System Metadata">
            <div className="flex justify-between items-center text-[9px] font-mono tracking-wide">
              <span className="text-[#5C5E58]">APP STATE</span>
              <span className="text-[#A8AAA3] font-bold">FRONTEND SHELL</span>
            </div>
            <div className="flex justify-between items-center text-[9px] font-mono tracking-wide">
              <span className="text-[#5C5E58]">DATA SOURCE</span>
              <span className="text-[#A8AAA3] font-bold">MOCK MODE</span>
            </div>
            <div className="flex justify-between items-center text-[9px] font-mono tracking-wide">
              <span className="text-[#5C5E58]">AUTHORITY</span>
              <span className="text-amber-500 font-bold">BACKEND PENDING</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE ACCESSIBLE MENU DRAWER (<1024px) */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Navigation Menu">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            aria-hidden="true" 
            onClick={() => setIsDrawerOpen(false)} 
          />
          
          {/* Drawer Panel content */}
          <div className="relative w-full max-w-[280px] bg-[#0A0A0A] border-l border-[#242522] h-full flex flex-col p-6 space-y-6 overflow-y-auto shadow-2xl z-10 text-left">
            <div className="flex justify-between items-center pb-4 border-b border-[#242522]">
              <span className="text-xs font-mono font-bold tracking-widest text-[#A8AAA3] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>NAVIGATION</span>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close menu"
                className="text-[#A8AAA3] hover:text-[#D6FF3F] border border-[#242522] bg-[#141513]/20 focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[2px] p-1.5 min-h-[36px] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#141513]/40 border border-[#242522] space-y-1.5 rounded-[2px]" aria-label="Mobile Workspace Context">
              <div>
                <div className="text-[9px] font-mono text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>ORGANIZATION</div>
                <div className="text-[10px] font-mono font-bold text-[#F3F1EA] tracking-wide" style={{ fontFamily: 'var(--font-technical)' }}>NORTHSTAR COMMERCE</div>
              </div>
              <div>
                <div className="text-[9px] font-mono text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>MODE</div>
                <div className="text-[10px] font-mono font-bold text-[#D6FF3F] tracking-wide" style={{ fontFamily: 'var(--font-technical)' }}>FRONTEND PREVIEW</div>
              </div>
            </div>

            <nav aria-label="Mobile Drawer Navigation" className="flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {isDashboardActive ? (
                  <Link
                    to="/app"
                    aria-current="page"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-mono font-bold text-[#D6FF3F] bg-[#141513] border border-[#242522] focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[2px] w-full"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" />
                      DASHBOARD
                    </span>
                    <span className="text-[9px] tracking-wider uppercase text-[#D6FF3F] border border-[#D6FF3F]/20 px-1 py-0.5 bg-[#D6FF3F]/5">ACTIVE</span>
                  </Link>
                ) : (
                  <Link
                    to="/app"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-mono font-bold text-[#A8AAA3] hover:text-[#D6FF3F] hover:bg-[#141513]/40 border border-transparent focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[2px] w-full"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    <span className="flex items-center gap-2">
                      DASHBOARD
                    </span>
                  </Link>
                )}

                {isIncidentsActive ? (
                  <Link
                    to="/app/incidents"
                    aria-current="page"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-mono font-bold text-[#D6FF3F] bg-[#141513] border border-[#242522] focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[2px] w-full"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" />
                      INCIDENTS
                    </span>
                    <span className="text-[9px] tracking-wider uppercase text-[#D6FF3F] border border-[#D6FF3F]/20 px-1 py-0.5 bg-[#D6FF3F]/5">ACTIVE</span>
                  </Link>
                ) : (
                  <Link
                    to="/app/incidents"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-mono font-bold text-[#A8AAA3] hover:text-[#D6FF3F] hover:bg-[#141513]/40 border border-transparent focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[2px] w-full"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    <span className="flex items-center gap-2">
                      INCIDENTS
                    </span>
                  </Link>
                )}

                <div
                  role="link"
                  aria-disabled="true"
                  className="flex items-center justify-between px-3 py-2 text-xs font-mono font-bold text-[#5C5E58] border border-dashed border-[#242522]/60 select-none rounded-[2px]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <span>SERVICES</span>
                  <span className="text-[9px] tracking-wider uppercase text-[#5C5E58] border border-[#242522]/60 px-1 py-0.5">PENDING</span>
                </div>

                <div
                  role="link"
                  aria-disabled="true"
                  className="flex items-center justify-between px-3 py-2 text-xs font-mono font-bold text-[#5C5E58] border border-dashed border-[#242522]/60 select-none rounded-[2px]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <span>TEAM</span>
                  <span className="text-[9px] tracking-wider uppercase text-[#5C5E58] border border-[#242522]/60 px-1 py-0.5">PENDING</span>
                </div>

                <div
                  role="link"
                  aria-disabled="true"
                  className="flex items-center justify-between px-3 py-2 text-xs font-mono font-bold text-[#5C5E58] border border-dashed border-[#242522]/60 select-none rounded-[2px]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <span>SETTINGS</span>
                  <span className="text-[9px] tracking-wider uppercase text-[#5C5E58] border border-[#242522]/60 px-1 py-0.5">PENDING</span>
                </div>
              </div>

              <div className="pt-6 border-t border-[#242522] space-y-4">
                {isIncidentsNewActive ? (
                  <Link
                    to="/app/incidents/new"
                    aria-current="page"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono font-bold tracking-wider text-[#D6FF3F] bg-[#141513] border border-[#242522] rounded-[2px]"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" />
                      NEW INCIDENT
                    </span>
                    <span className="text-[9px] tracking-wider uppercase text-[#D6FF3F] border border-[#D6FF3F]/20 px-1 py-0.5 bg-[#D6FF3F]/5">ACTIVE</span>
                  </Link>
                ) : (
                  <Link
                    to="/app/incidents/new"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono font-bold tracking-wider text-[#A8AAA3] hover:text-[#D6FF3F] hover:bg-[#141513]/40 border border-[#242522] bg-[#141513]/10 rounded-[2px] transition-colors"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    + NEW INCIDENT
                  </Link>
                )}

                <div className="p-3 bg-[#141513]/20 border border-[#242522] space-y-2 rounded-[2px]" aria-label="Mobile Drawer Metadata">
                  <div className="flex justify-between items-center text-[8px] font-mono tracking-wide">
                    <span className="text-[#5C5E58]">APP STATE</span>
                    <span className="text-[#A8AAA3] font-bold">FRONTEND SHELL</span>
                  </div>
                  <div className="flex justify-between items-center text-[8px] font-mono tracking-wide">
                    <span className="text-[#5C5E58]">DATA SOURCE</span>
                    <span className="text-[#A8AAA3] font-bold">MOCK MODE</span>
                  </div>
                  <div className="flex justify-between items-center text-[8px] font-mono tracking-wide">
                    <span className="text-[#5C5E58]">AUTHORITY</span>
                    <span className="text-amber-500 font-bold">BACKEND PENDING</span>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* RIGHT/MAIN OPERATIONAL REGION */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* TOP OPERATIONAL HEADER */}
        <header className="h-14 border-b border-[#242522] bg-[#0A0A0A] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10 w-full">
          {/* Breadcrumbs (Technical / IBM Plex Mono) */}
          <div className="flex flex-col items-start text-left">
            <nav aria-label="Breadcrumb" className="font-mono text-[9px] sm:text-[10px] tracking-widest text-[#5C5E58] uppercase flex items-center gap-1" style={{ fontFamily: 'var(--font-technical)' }}>
              <span>NORTHSTAR COMMERCE</span>
              <span className="text-[#242522]" aria-hidden="true">/</span>
              {isIncidentRoomActive ? (
                <>
                  <span className="text-[#A8AAA3]">INCIDENTS</span>
                  <span className="text-[#242522]" aria-hidden="true">/</span>
                  <span className="text-[#A8AAA3]">SF-2026-0042</span>
                </>
              ) : isIncidentsNewActive ? (
                <>
                  <span className="text-[#A8AAA3]">INCIDENTS</span>
                  <span className="text-[#242522]" aria-hidden="true">/</span>
                  <span className="text-[#A8AAA3]">NEW</span>
                </>
              ) : isIncidentsActive ? (
                <span className="text-[#A8AAA3]">INCIDENTS</span>
              ) : (
                <span className="text-[#A8AAA3]">OPERATIONS</span>
              )}
            </nav>
            <h1 className="text-xs font-mono font-bold tracking-wider text-[#F3F1EA] uppercase mt-0.5" style={{ fontFamily: 'var(--font-technical)' }}>
              {isIncidentRoomActive ? 'INCIDENT ROOM' : isIncidentsNewActive ? 'NEW INCIDENT' : isIncidentsActive ? 'INCIDENTS' : 'DASHBOARD'}
            </h1>
          </div>

          {/* Central Search/Command Component (Visibly Disabled) */}
          <div 
            aria-disabled="true"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#141513]/40 border border-[#242522] rounded-[2px] w-56 lg:w-64 text-[#5C5E58] select-none cursor-not-allowed"
          >
            <Search className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="text-[10px] font-mono uppercase tracking-wider" style={{ fontFamily: 'var(--font-technical)' }}>COMMAND SEARCH...</span>
            <span className="ml-auto text-[8px] font-mono border border-[#242522] px-1 bg-[#0A0A0A] rounded-[1px]" style={{ fontFamily: 'var(--font-technical)' }}>DISABLED</span>
          </div>

          {/* Right Area Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Operational Workspace Status (Amber Pending Styling) */}
            <div className="flex items-center gap-1.5 border border-amber-500/20 bg-amber-500/5 px-2.5 py-1 text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-amber-500 rounded-[2px]" style={{ fontFamily: 'var(--font-technical)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
              <span>WORKSPACE / PREVIEW MODE</span>
            </div>

            {/* Notifications Indicator (Disabled, No fake counts) */}
            <button
              type="button"
              disabled
              aria-disabled="true"
              aria-label="Notifications (Disabled)"
              className="p-1.5 text-[#5C5E58] border border-[#242522] bg-[#141513]/10 cursor-not-allowed rounded-[2px] relative focus-visible:outline-2 focus-visible:outline-[#4B78FF] min-h-[36px] flex items-center justify-center"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Current Operator Status */}
            <div 
              className="flex items-center gap-2 border border-[#242522] px-2.5 py-1 bg-[#141513]/20 text-[#A8AAA3] rounded-[2px] text-xs font-mono select-none" 
              style={{ fontFamily: 'var(--font-technical)' }}
              aria-label="Current Operator Info"
            >
              <User className="w-3.5 h-3.5 text-[#5C5E58]" aria-hidden="true" />
              <span className="hidden sm:inline">OPERATOR_01</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80" title="Preview connection" />
            </div>
          </div>
        </header>

        {/* MAIN WORKSPACE CANVAS CONTAINER */}
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12 text-left">
          {children}
        </main>
      </div>

      {/* MOBILE COMPACT BOTTOM APPLICATION NAVIGATION (<1024px) */}
      <nav 
        aria-label="Mobile Bottom Navigation" 
        className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0A0A0A] border-t border-[#242522] grid grid-cols-4 items-center justify-center px-1 z-40"
      >
        <Link
          to="/app"
          aria-current={isDashboardActive ? "page" : undefined}
          className={`flex flex-col items-center justify-center h-full focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[1px] ${
            isDashboardActive ? 'text-[#D6FF3F]' : 'text-[#A8AAA3] hover:text-[#D6FF3F]'
          } hover:bg-[#141513]/50`}
        >
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>DASHBOARD</span>
          {isDashboardActive && (
            <span className="text-[8px] font-mono tracking-wider uppercase text-[#D6FF3F]/80 mt-0.5" style={{ fontFamily: 'var(--font-technical)' }}>ACTIVE</span>
          )}
        </Link>

        <Link
          to="/app/incidents"
          aria-current={isIncidentsActive ? "page" : undefined}
          className={`flex flex-col items-center justify-center h-full focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[1px] ${
            isIncidentsActive ? 'text-[#D6FF3F]' : 'text-[#A8AAA3] hover:text-[#D6FF3F]'
          } hover:bg-[#141513]/50`}
        >
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>INCIDENTS</span>
          {isIncidentsActive && (
            <span className="text-[8px] font-mono tracking-wider uppercase text-[#D6FF3F]/80 mt-0.5" style={{ fontFamily: 'var(--font-technical)' }}>ACTIVE</span>
          )}
        </Link>

        <Link
          to="/app/incidents/new"
          aria-current={isIncidentsNewActive ? "page" : undefined}
          className={`flex flex-col items-center justify-center h-full focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[1px] ${
            isIncidentsNewActive ? 'text-[#D6FF3F]' : 'text-[#A8AAA3] hover:text-[#D6FF3F]'
          } hover:bg-[#141513]/50`}
        >
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>NEW INCIDENT</span>
          {isIncidentsNewActive ? (
            <span className="text-[8px] font-mono tracking-wider uppercase text-[#D6FF3F]/80 mt-0.5" style={{ fontFamily: 'var(--font-technical)' }}>ACTIVE</span>
          ) : (
            <span className="text-[8px] font-mono tracking-wider uppercase text-[#5C5E58] mt-0.5" style={{ fontFamily: 'var(--font-technical)' }}>REPORT</span>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setIsDrawerOpen(prev => !prev)}
          aria-expanded={isDrawerOpen}
          aria-label="Toggle Navigation Menu"
          className="flex flex-col items-center justify-center h-full text-[#A8AAA3] hover:text-[#D6FF3F] hover:bg-[#141513]/50 transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[1px] bg-transparent border-0 cursor-pointer"
        >
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>MENU</span>
          <span className="text-[8px] font-mono tracking-wider uppercase text-[#A8AAA3] mt-0.5" style={{ fontFamily: 'var(--font-technical)' }}>{isDrawerOpen ? 'CLOSE' : 'OPEN'}</span>
        </button>
      </nav>
    </div>
  );
}
