import React from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingHero } from '@/components/landing/LandingHero';
import { WorkflowSection } from '@/components/landing/WorkflowSection';
import { IncidentCommandSection } from '@/components/landing/IncidentCommandSection';
import { PostmortemSection } from '@/components/landing/PostmortemSection';
import { ClosingCtaSection } from '@/components/landing/ClosingCtaSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-[#F3F1EA] selection:bg-[#D6FF3F] selection:text-[#0A0A0A]">
      {/* Editorial Landing Navbar */}
      <LandingNavbar />

      {/* Main Landing Page Content */}
      <main id="main-content" className="flex-1">
        <LandingHero />
        <WorkflowSection />
        <IncidentCommandSection />
        <PostmortemSection />
        <ClosingCtaSection />
      </main>

      {/* Operational Landing Footer */}
      <LandingFooter />
    </div>
  );
};
