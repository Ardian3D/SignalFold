import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { BrandLogo } from '@/components/brand/BrandLogo';

export interface LandingNavbarProps {
  className?: string;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'HOME', href: '#product' },
    { label: 'WORKFLOW', href: '#workflow' },
    { label: 'INCIDENT ROOM', href: '#incident-room' },
    { label: 'POSTMORTEM', href: '#postmortem' },
  ];

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full h-[72px] bg-[var(--color-bg-root,#F3F1EA)] dark:bg-[#0A0A0A] border-b border-[#D8D4C8] dark:border-[#2A2C28] transition-colors duration-150 ${className}`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Official Brand Logo & Technical Index */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/"
            onClick={handleNavLinkClick}
            className="flex items-center gap-2 rounded-[2px] focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
            aria-label="SignalFold Home"
          >
            <BrandLogo size="md" />
          </Link>

          <span
            className="text-[10px] font-mono font-semibold tracking-widest text-[#5C5E58] dark:text-[#A8AAA3] uppercase border-l border-[#D8D4C8] dark:border-[#2A2C28] pl-3 py-0.5 select-none hidden sm:inline-block"
            aria-hidden="true"
          >
            SYSTEM / SIGNALFOLD
          </span>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-6 lg:gap-8"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative py-2 text-xs font-mono font-semibold tracking-widest text-[#0A0A0A] dark:text-[#F3F1EA] hover:text-[#0A0A0A] dark:hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
            >
              <span>{link.label}</span>
              {/* Subtle technical rule-line hover animation */}
              <span
                className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#0A0A0A] dark:bg-[#D6FF3F] transition-all duration-200 group-hover:w-full"
                aria-hidden="true"
              />
            </a>
          ))}
        </nav>

        {/* Right: Actions (SIGN IN + OPEN DEMO CTA) */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <Link
            to={{ pathname: "/login", hash: "" }}
            className="text-xs font-mono font-bold tracking-wider text-[#0A0A0A] dark:text-[#F3F1EA] hover:text-[#4B78FF] dark:hover:text-[#D6FF3F] transition-colors px-2 py-1.5 rounded-[2px] focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
          >
            SIGN IN
          </Link>

          <Link
            to={{ pathname: "/demo", hash: "" }}
            className="relative inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold tracking-wider bg-[#0A0A0A] text-[#F3F1EA] dark:bg-[#F3F1EA] dark:text-[#0A0A0A] rounded-[2px] border border-[#242522] dark:border-[#D8D4C8] hover:bg-[#242522] dark:hover:bg-[#E8E5DC] transition-colors duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#4B78FF] group select-none"
          >
            {/* Precise Signal Lime Accent Indicator */}
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] dark:bg-[#0A0A0A] shrink-0"
              aria-hidden="true"
            />
            <span>OPEN DEMO</span>
            <ArrowUpRight
              className="w-3.5 h-3.5 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            className="p-2 text-[#0A0A0A] dark:text-[#F3F1EA] hover:bg-[#0A0A0A]/5 dark:hover:bg-white/5 rounded-[2px] focus-visible:outline-2 focus-visible:outline-[#4B78FF] transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 shrink-0" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5 shrink-0" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-x-0 top-[72px] bottom-0 z-50 bg-[var(--color-bg-root,#F3F1EA)] dark:bg-[#0A0A0A] border-t border-[#D8D4C8] dark:border-[#2A2C28] p-6 flex flex-col justify-between overflow-y-auto overflow-x-hidden md:hidden animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <div className="space-y-6 pt-2">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#5C5E58] dark:text-[#A8AAA3] border-b border-[#D8D4C8] dark:border-[#2A2C28] pb-2">
              NAVIGATION / SIGNALFOLD
            </div>

            <nav className="flex flex-col gap-4" aria-label="Mobile Navigation Links">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={handleNavLinkClick}
                  className="text-base font-mono font-bold tracking-wider text-[#0A0A0A] dark:text-[#F3F1EA] hover:text-[#4B78FF] dark:hover:text-[#D6FF3F] py-2 border-b border-[#D8D4C8]/50 dark:border-[#2A2C28]/50 transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#D8D4C8] dark:border-[#2A2C28] pb-8">
            <Link
              to={{ pathname: "/login", hash: "" }}
              onClick={handleNavLinkClick}
              className="w-full py-3 flex items-center justify-center text-xs font-mono font-bold tracking-wider text-[#0A0A0A] dark:text-[#F3F1EA] bg-[#F3F1EA] dark:bg-[#141513] border border-[#D8D4C8] dark:border-[#2A2C28] rounded-[2px] hover:bg-[#E8E5DC] dark:hover:bg-[#242522] transition-colors"
            >
              SIGN IN
            </Link>

            <Link
              to={{ pathname: "/demo", hash: "" }}
              onClick={handleNavLinkClick}
              className="w-full py-3.5 flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-wider text-[#F3F1EA] bg-[#0A0A0A] dark:bg-[#F3F1EA] dark:text-[#0A0A0A] rounded-[2px] border border-[#242522] dark:border-[#D8D4C8] hover:bg-[#242522] dark:hover:bg-[#E8E5DC] transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[#D6FF3F] dark:bg-[#0A0A0A]" aria-hidden="true" />
              <span>OPEN DEMO</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
