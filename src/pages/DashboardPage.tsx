import React from 'react';
import { Link } from 'react-router-dom';

interface RecentActivityItem {
  sequence: string;
  type: string;
  reference: string;
  description: React.ReactNode;
  source: string;
  state: string;
  stateColor: string;
}

interface ResponseWorkloadItem {
  sequence: string;
  title: string;
  incident: string;
  source: string;
  acceptance: string;
  ownership: string;
  recordState: string;
}

const responseTasks: ResponseWorkloadItem[] = [
  {
    sequence: "01",
    title: "COMPARE LATEST DEPLOYMENT CHANGES",
    incident: "SF-2026-0042",
    source: "CANONICAL DEMO TASK SET",
    acceptance: "NOT ACCEPTED",
    ownership: "UNASSIGNED",
    recordState: "NOT CREATED"
  },
  {
    sequence: "02",
    title: "CONFIRM PAYMENT GATEWAY HEALTH",
    incident: "SF-2026-0042",
    source: "CANONICAL DEMO TASK SET",
    acceptance: "NOT ACCEPTED",
    ownership: "UNASSIGNED",
    recordState: "NOT CREATED"
  },
  {
    sequence: "03",
    title: "RUN CHECKOUT TRANSACTION TEST",
    incident: "SF-2026-0042",
    source: "CANONICAL DEMO TASK SET",
    acceptance: "NOT ACCEPTED",
    ownership: "UNASSIGNED",
    recordState: "NOT CREATED"
  },
  {
    sequence: "04",
    title: "PREPARE ROLLBACK",
    incident: "SF-2026-0042",
    source: "CANONICAL DEMO TASK SET",
    acceptance: "NOT ACCEPTED",
    ownership: "UNASSIGNED",
    recordState: "NOT CREATED"
  },
  {
    sequence: "05",
    title: "DRAFT CUSTOMER-FACING STATUS UPDATE",
    incident: "SF-2026-0042",
    source: "CANONICAL DEMO TASK SET",
    acceptance: "NOT ACCEPTED",
    ownership: "UNASSIGNED",
    recordState: "NOT CREATED"
  }
];

const recentActivities: RecentActivityItem[] = [
  {
    sequence: "01",
    type: "INCIDENT REPORTED",
    reference: "SF-2026-0042",
    description: (
      <>
        Checkout payment failures were recorded as an active incident affecting the <span className="font-mono bg-[#141513] text-[#F3F1EA] px-1 py-0.5 rounded-[1px]">Payments API</span>.
      </>
    ),
    source: "INCIDENT RECORD",
    state: "REPORTED",
    stateColor: "amber",
  },
  {
    sequence: "02",
    type: "CUSTOMER SIGNAL RECORDED",
    reference: "SF-2026-0042",
    description: (
      <>
        The incident record includes 37 customer reports received within the documented 12-minute signal window.
      </>
    ),
    source: "SUPPORT CONTEXT",
    state: "37 REPORTS / 12 MINUTES",
    stateColor: "amber",
  },
  {
    sequence: "03",
    type: "AI TRIAGE SUGGESTION PREPARED",
    reference: "SF-2026-0042",
    description: (
      <>
        AI assistance proposed <span className="text-red-500 font-mono font-bold border border-red-500/10 bg-red-500/5 px-1 py-0.2 rounded-[2px]">SEV1</span> severity for human review.
      </>
    ),
    source: "AI ASSISTANCE",
    state: "HUMAN CONFIRMATION REQUIRED",
    stateColor: "amber",
  },
  {
    sequence: "04",
    type: "RESPONSE TASK SET PROPOSED",
    reference: "SF-2026-0042",
    description: (
      <>
        Five recommended response tasks were prepared for human review.
      </>
    ),
    source: "AI ASSISTANCE",
    state: "5 RECOMMENDED / NOT ACCEPTED",
    stateColor: "amber",
  },
  {
    sequence: "05",
    type: "SECONDARY ACTIVE RECORD AVAILABLE",
    reference: "CANONICAL SEED",
    description: (
      <>
        An additional active SEV2 incident exists in the demo workspace, but its detailed identity has not yet been specified.
      </>
    ),
    source: "SECONDARY SEED RECORD",
    state: "LIMITED DETAIL",
    stateColor: "neutral",
  }
];

/**
 * Minimal DashboardPage component verifying the application shell structure.
 * No real dashboard data, metric cards, or charts are included yet.
 */
export function DashboardPage() {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [service, setService] = React.useState('');
  const [analyzeImmediately, setAnalyzeImmediately] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success'>('idle');
  const [errors, setErrors] = React.useState<{ title?: string; description?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; description?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = "Incident title is required.";
    } else if (title.trim().length < 5) {
      newErrors.title = "Use at least 5 characters.";
    }
    
    if (!description.trim()) {
      newErrors.description = "Incident description is required.";
    } else if (description.trim().length < 20) {
      newErrors.description = "Use at least 20 characters.";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setSubmitStatus('idle');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
    }, 400);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Page Header Area */}
      <div className="space-y-2">
        {/* Eyebrow Label */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#141513] border border-[#242522]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
          <span 
            className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase text-amber-500"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            COMMAND SURFACE / FRONTEND PREVIEW
          </span>
        </div>

        {/* Sora Page Title */}
        <h2 
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F3F1EA] uppercase leading-[1.1]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          OPERATIONS OVERVIEW
        </h2>

        {/* Supporting copy */}
        <p className="text-sm sm:text-base text-[#A8AAA3] w-full sm:max-w-[520px] md:max-w-[600px] lg:max-w-[640px] leading-relaxed font-sans text-left">
          Monitor incidents, response ownership, operational activity, and follow-up work from one shared command surface.
        </p>
      </div>

      {/* Operational Summary Module 01 */}
      <section 
        aria-labelledby="operational-summary-heading" 
        className="border border-[#242522] rounded-[2px] bg-[#0A0A0A] overflow-hidden"
      >
        {/* Module Header Segment */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-[#242522] gap-3 bg-[#141513]/20">
          <div className="space-y-0.5 text-left">
            <h3 
              id="operational-summary-heading" 
              className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA]" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              01 / OPERATIONAL SUMMARY
            </h3>
            <div 
              className="text-[9px] font-mono tracking-widest text-[#5C5E58] uppercase" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              NORTHSTAR COMMERCE / FRONTEND MOCK DATA
            </div>
          </div>
          
          <div 
            className="flex items-center gap-1.5 border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider text-amber-500 rounded-[2px] w-fit" 
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
            <span>DATA STATE / NOT CONNECTED</span>
          </div>
        </div>

        {/* Six Metric Cells in a Continuous Structural Grid */}
        <dl className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 bg-[#242522] gap-[1px]">
          {/* Cell 1: ACTIVE INCIDENTS */}
          <div className="bg-[#0A0A0A] p-5 relative flex flex-col justify-between min-h-[120px] text-left">
            <span 
              className="absolute top-3 right-3 text-[8px] font-mono tracking-widest text-[#5C5E58] border border-[#242522]/40 px-1 py-0.5 rounded-[1px] select-none" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              MOCK
            </span>
            <dt>
              <span 
                className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase" 
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                ACTIVE INCIDENTS
              </span>
            </dt>
            <dd className="space-y-1.5 mt-4">
              <span 
                className="block text-3xl sm:text-4xl font-bold tracking-tight text-[#F3F1EA]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                2
              </span>
              <span 
                className="block text-[9px] font-mono tracking-wider text-[#A8AAA3] uppercase" 
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                CURRENT RESPONSE QUEUE
              </span>
            </dd>
          </div>

          {/* Cell 2: SEV1 / SEV2 ACTIVE */}
          <div className="bg-[#0A0A0A] p-5 relative flex flex-col justify-between min-h-[120px] text-left">
            <span 
              className="absolute top-3 right-3 text-[8px] font-mono tracking-widest text-[#5C5E58] border border-[#242522]/40 px-1 py-0.5 rounded-[1px] select-none" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              MOCK
            </span>
            <dt>
              <span 
                className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase" 
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                SEV1 / SEV2 ACTIVE
              </span>
            </dt>
            <dd className="space-y-1.5 mt-4">
              <span 
                className="block text-3xl sm:text-4xl font-bold tracking-tight text-[#F3F1EA]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                2
              </span>
              <span 
                className="block text-[9px] font-mono tracking-wider text-[#A8AAA3] uppercase" 
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                PRIORITY INCIDENTS
              </span>
            </dd>
          </div>

          {/* Cell 3: OPEN TASKS */}
          <div className="bg-[#0A0A0A] p-5 relative flex flex-col justify-between min-h-[120px] text-left">
            <span 
              className="absolute top-3 right-3 text-[8px] font-mono tracking-widest text-[#5C5E58] border border-[#242522]/40 px-1 py-0.5 rounded-[1px] select-none" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              MOCK
            </span>
            <dt>
              <span 
                className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase" 
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                OPEN TASKS
              </span>
            </dt>
            <dd className="space-y-1.5 mt-4">
              <span 
                className="block text-3xl sm:text-4xl font-bold tracking-tight text-[#F3F1EA]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                5
              </span>
              <span 
                className="block text-[9px] font-mono tracking-wider text-[#A8AAA3] uppercase" 
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                RESPONSE WORK REMAINING
              </span>
            </dd>
          </div>

          {/* Cell 4: RESOLVED THIS WEEK */}
          <div className="bg-[#0A0A0A] p-5 relative flex flex-col justify-between min-h-[120px] text-left">
            <span 
              className="absolute top-3 right-3 text-[8px] font-mono tracking-widest text-[#5C5E58] border border-[#242522]/40 px-1 py-0.5 rounded-[1px] select-none" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              MOCK
            </span>
            <dt>
              <span 
                className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase" 
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                RESOLVED THIS WEEK
              </span>
            </dt>
            <dd className="space-y-1.5 mt-4">
              <span 
                className="block text-3xl sm:text-4xl font-bold tracking-tight text-[#F3F1EA]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                1
              </span>
              <span 
                className="block text-[9px] font-mono tracking-wider text-[#A8AAA3] uppercase" 
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                VERIFIED INCIDENT RECORD
              </span>
            </dd>
          </div>

          {/* Cell 5: AVG. TIME TO ACKNOWLEDGE */}
          <div className="bg-[#0A0A0A] p-5 relative flex flex-col justify-between min-h-[120px] text-left">
            <span 
              className="absolute top-3 right-3 text-[8px] font-mono tracking-widest text-[#5C5E58] border border-[#242522]/40 px-1 py-0.5 rounded-[1px] select-none" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              MOCK
            </span>
            <dt>
              <span 
                className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase" 
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                AVG. TIME TO ACKNOWLEDGE
              </span>
            </dt>
            <dd className="space-y-1.5 mt-4">
              <span 
                className="block text-3xl sm:text-4xl font-bold tracking-tight text-[#5C5E58]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                —
              </span>
              <span 
                className="block text-[9px] font-mono tracking-wider text-[#5C5E58] uppercase" 
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                INSUFFICIENT DATA
              </span>
            </dd>
          </div>

          {/* Cell 6: AVG. TIME TO RESOLVE */}
          <div className="bg-[#0A0A0A] p-5 relative flex flex-col justify-between min-h-[120px] text-left">
            <span 
              className="absolute top-3 right-3 text-[8px] font-mono tracking-widest text-[#5C5E58] border border-[#242522]/40 px-1 py-0.5 rounded-[1px] select-none" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              MOCK
            </span>
            <dt>
              <span 
                className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase" 
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                AVG. TIME TO RESOLVE
              </span>
            </dt>
            <dd className="space-y-1.5 mt-4">
              <span 
                className="block text-3xl sm:text-4xl font-bold tracking-tight text-[#5C5E58]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                —
              </span>
              <span 
                className="block text-[9px] font-mono tracking-wider text-[#5C5E58] uppercase" 
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                INSUFFICIENT DATA
              </span>
            </dd>
          </div>
        </dl>
      </section>

      {/* Active Incidents Module 02 */}
      <section 
        aria-labelledby="active-incidents-heading" 
        className="border border-[#242522] rounded-[2px] bg-[#0A0A0A] overflow-hidden"
      >
        {/* Module Header Segment */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-[#242522] gap-3 bg-[#141513]/20">
          <div className="space-y-0.5 text-left">
            <h3 
              id="active-incidents-heading" 
              className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA]" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              02 / ACTIVE INCIDENTS
            </h3>
            <div 
              className="text-[9px] font-mono tracking-widest text-[#5C5E58] uppercase" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              CURRENT RESPONSE QUEUE / FRONTEND MOCK DATA
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div 
              className="flex items-center gap-1.5 border border-red-500/20 bg-red-500/5 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider text-red-500 rounded-[2px] w-fit" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
              <span>2 ACTIVE RECORDS</span>
            </div>
            
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest uppercase border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px] cursor-not-allowed select-none"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span>VIEW ALL INCIDENTS</span>
              <span className="text-[8px] px-1 py-0.2 bg-[#242522] text-[#5C5E58] rounded-[1px]">PENDING</span>
            </button>
          </div>
        </div>

        {/* Continuous Active Incident List */}
        <ul role="list" className="divide-y divide-[#242522]">
          {/* Record 01 — Canonical Main Incident */}
          <li className="p-4 sm:p-6 bg-[#0A0A0A] flex flex-col xl:flex-row xl:items-start gap-6 relative">
            {/* Visual Red Severity Bar (Aria-hidden) */}
            <div className="hidden xl:block absolute left-0 top-0 bottom-0 w-1 bg-red-500" aria-hidden="true" />

            {/* Column 1: Severity Rail & Code */}
            <div className="flex xl:flex-col items-baseline xl:items-start justify-between xl:justify-start gap-2 xl:w-44 shrink-0 text-left">
              <div className="space-y-1.5">
                <span 
                  className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-red-500/30 bg-red-500/10 text-red-500 rounded-[2px]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  AI SUGGESTION / SEV1
                </span>
                <span 
                  className="block text-[8px] font-mono font-bold text-amber-500 tracking-wider"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  HUMAN CONFIRMATION REQUIRED
                </span>
              </div>
              <span 
                className="text-xs sm:text-sm font-mono font-bold text-amber-500 tracking-wider select-all"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                SF-2026-0042
              </span>
            </div>

            {/* Column 2: Incident Identity (Title and Description) */}
            <div className="flex-1 space-y-2 text-left">
              <h4 
                className="text-base sm:text-lg font-bold text-[#F3F1EA] tracking-tight leading-snug"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Checkout payments failing after latest deployment
              </h4>
              <p className="text-xs sm:text-sm text-[#A8AAA3] font-sans leading-relaxed max-w-3xl">
                Customers cannot complete card payments after the latest deployment.
              </p>
            </div>

            {/* Column 3: Operational Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:flex xl:flex-wrap gap-x-6 gap-y-4 xl:w-[420px] text-left shrink-0">
              <div className="space-y-1 min-w-[110px]">
                <span 
                  className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  STATUS
                </span>
                <span 
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wide text-amber-500"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
                  <span>REPORTED</span>
                </span>
              </div>

              <div className="space-y-1 min-w-[110px]">
                <span 
                  className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  SERVICE
                </span>
                <span 
                  className="block text-[11px] font-mono font-bold text-[#F3F1EA] tracking-wide"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  PAYMENTS API
                </span>
              </div>

              <div className="space-y-1 min-w-[130px]">
                <span 
                  className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  CUSTOMER SIGNAL
                </span>
                <span 
                  className="block text-[11px] font-mono font-bold text-red-400 tracking-wide"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  37 REPORTS / 12 MINUTES
                </span>
              </div>

              <div className="space-y-1 min-w-[110px]">
                <span 
                  className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  COMMANDER
                </span>
                <span 
                  className="block text-[11px] font-mono font-bold text-[#5C5E58] tracking-wide"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  UNASSIGNED
                </span>
              </div>

              <div className="space-y-1 min-w-[120px]">
                <span 
                  className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  RESPONSE TASKS
                </span>
                <span 
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#F3F1EA] tracking-wide"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <span>5</span>
                  <span className="text-[8px] px-1 py-0.2 bg-[#242522] text-[#A8AAA3] rounded-[1px] font-bold">RECOMMENDED</span>
                </span>
              </div>
            </div>

            {/* Column 4: Row Action State */}
            <div className="xl:w-36 shrink-0 flex items-center xl:justify-end mt-2 xl:mt-0">
              <Link
                to="/app/incidents/SF-2026-0042"
                className="w-full xl:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-bold tracking-widest uppercase border border-[#D6FF3F]/30 bg-[#D6FF3F]/10 hover:bg-[#D6FF3F]/20 text-[#D6FF3F] hover:border-[#D6FF3F]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F] rounded-[2px] transition-colors"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                <span>OPEN INCIDENT ROOM</span>
                <span className="text-[8px] px-1 py-0.2 bg-[#D6FF3F]/20 text-[#D6FF3F] rounded-[1px]">ACTIVE</span>
              </Link>
            </div>
          </li>

          {/* Record 02 — Secondary Seed Record */}
          <li className="p-4 sm:p-6 bg-[#0E0F0D]/60 flex flex-col xl:flex-row xl:items-start gap-6 relative">
            {/* Visual Orange Severity Bar (Aria-hidden) */}
            <div className="hidden xl:block absolute left-0 top-0 bottom-0 w-1 bg-amber-600/70" aria-hidden="true" />

            {/* Column 1: Severity Rail */}
            <div className="flex xl:flex-col items-baseline xl:items-start justify-between xl:justify-start gap-2 xl:w-44 shrink-0 text-left">
              <div className="space-y-1.5">
                <span 
                  className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-amber-600/30 bg-amber-600/10 text-amber-500 rounded-[2px]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  SEVERITY / SEV2
                </span>
                <span 
                  className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-wider"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  LIMITED SEED DETAIL
                </span>
              </div>
              <span 
                className="text-xs sm:text-sm font-mono font-bold text-[#383A35] tracking-wider select-none"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                —
              </span>
            </div>

            {/* Column 2: Incident Identity */}
            <div className="flex-1 space-y-2 text-left">
              <div className="flex items-center gap-2">
                <span 
                  className="text-[9px] font-mono font-bold tracking-widest text-amber-600 uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  SECONDARY ACTIVE INCIDENT
                </span>
              </div>
              <h4 
                className="text-base sm:text-lg font-bold text-[#A8AAA3] tracking-tight leading-snug"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                ACTIVE SEV2 SEED RECORD
              </h4>
              <p className="text-xs sm:text-sm text-[#5C5E58] font-sans leading-relaxed max-w-3xl">
                This active SEV2 record is reserved by the canonical demo dataset. Detailed incident identity will be defined during mock-data integration.
              </p>
            </div>

            {/* Column 3: Operational Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:flex xl:flex-wrap gap-x-6 gap-y-4 xl:w-[420px] text-left shrink-0">
              <div className="space-y-1 min-w-[110px]">
                <span 
                  className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  SEVERITY
                </span>
                <span 
                  className="block text-[11px] font-mono font-bold text-[#A8AAA3] tracking-wide"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  SEV2
                </span>
              </div>

              <div className="space-y-1 min-w-[110px]">
                <span 
                  className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  RECORD SOURCE
                </span>
                <span 
                  className="block text-[11px] font-mono font-bold text-[#5C5E58] tracking-wide"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  CANONICAL SECONDARY SEED
                </span>
              </div>

              <div className="space-y-1 min-w-[130px]">
                <span 
                  className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  DETAIL STATE
                </span>
                <span 
                  className="block text-[11px] font-mono font-bold text-[#5C5E58] tracking-wide"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  NOT SPECIFIED
                </span>
              </div>

              <div className="space-y-1 min-w-[110px]">
                <span 
                  className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  OWNERSHIP
                </span>
                <span 
                  className="block text-[11px] font-mono font-bold text-[#5C5E58] tracking-wide"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  NOT SPECIFIED
                </span>
              </div>

              <div className="space-y-1 min-w-[120px]">
                <span 
                  className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  INCIDENT ROUTE
                </span>
                <span 
                  className="block text-[11px] font-mono font-bold text-[#5C5E58] tracking-wide"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  NOT AVAILABLE
                </span>
              </div>
            </div>

            {/* Column 4: Dummy Spacer for visual alignment with Record 1 */}
            <div className="xl:w-36 shrink-0 hidden xl:block" aria-hidden="true" />
          </li>
        </ul>
      </section>

      {/* Needs Attention Module 03 */}
      <section 
        aria-labelledby="needs-attention-heading" 
        className="needs-attention-container border border-[#242522] rounded-[2px] bg-[#0A0A0A] overflow-hidden w-full max-w-full box-border"
      >
        <style>{`
          .needs-attention-container {
            container-type: inline-size;
          }
          
          .needs-attention-header-6col {
            display: none !important;
          }
          .needs-attention-row-6col {
            display: none !important;
          }
          .needs-attention-row-2level {
            display: none !important;
          }
          .needs-attention-row-mobile {
            display: flex !important;
          }

          @container (min-width: 700px) {
            .needs-attention-row-mobile {
              display: none !important;
            }
            .needs-attention-row-2level {
              display: flex !important;
            }
          }

          @container (min-width: 1180px) {
            .needs-attention-header-6col {
              display: grid !important;
            }
            .needs-attention-row-6col {
              display: grid !important;
            }
            .needs-attention-row-2level {
              display: none !important;
            }
            .needs-attention-row-mobile {
              display: none !important;
            }
          }
        `}</style>
        {/* Module Header Segment */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-[#242522] gap-3 bg-[#141513]/20">
          <div className="space-y-0.5 text-left">
            <h3 
              id="needs-attention-heading" 
              className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA]" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              03 / NEEDS ATTENTION
            </h3>
            <div 
              className="text-[9px] font-mono tracking-widest text-[#5C5E58] uppercase" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              HUMAN REVIEW QUEUE / FRONTEND MOCK DATA
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div 
              className="flex items-center gap-1.5 border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider text-amber-500 rounded-[2px] w-fit" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span className="w-1 h-1 rounded-full bg-amber-500" aria-hidden="true" />
              <span>3 OPEN ITEMS</span>
            </div>
            
            <div 
              className="flex items-center gap-1.5 border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider text-amber-500 rounded-[2px] w-fit" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span>ACTION REQUIRED</span>
            </div>

            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest uppercase border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px] cursor-not-allowed select-none"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span>OPEN REVIEW QUEUE</span>
              <span className="text-[8px] px-1 py-0.2 bg-[#242522] text-[#5C5E58] rounded-[1px]">PENDING</span>
            </button>
          </div>
        </div>

        {/* Column Headers (Desktop 1280px and above) */}
        <div className="needs-attention-header-6col grid-cols-[140px_minmax(180px,1.2fr)_minmax(130px,0.9fr)_minmax(260px,1.8fr)_minmax(150px,1fr)_100px] gap-5 px-6 py-2 border-b border-[#242522] bg-[#141513]/10 text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
          <div>PRIORITY</div>
          <div>ATTENTION ITEM / INCIDENT</div>
          <div>CURRENT STATE</div>
          <div>REQUIRED ACTION</div>
          <div>AUTHORITY STATE</div>
          <div className="text-right">ACTION</div>
        </div>

        {/* Structured List of Attention Items */}
        <ul role="list" className="divide-y divide-[#242522]">
          {/* Item 01 */}
          <li className="p-4 sm:p-5 bg-[#0A0A0A] relative flex flex-col w-full text-left">
            {/* Visual Red Severity Bar (Aria-hidden) */}
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-red-500" aria-hidden="true" />

            {/* Desktop columns layout (1280px and above) */}
            <div className="needs-attention-row-6col grid-cols-[140px_minmax(180px,1.2fr)_minmax(130px,0.9fr)_minmax(260px,1.8fr)_minmax(150px,1fr)_100px] gap-5 w-full text-left items-center">
              {/* Priority */}
              <div className="min-w-0">
                <span 
                  className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-red-500/30 bg-red-500/10 text-red-500 rounded-[2px] whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  CRITICAL REVIEW
                </span>
              </div>
              {/* Attention Title and Incident */}
              <div className="flex flex-col gap-1 min-w-0">
                <h4 
                  className="text-xs sm:text-sm font-mono font-bold text-[#F3F1EA] tracking-wide"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  CONFIRM INCIDENT SEVERITY
                </h4>
                <span 
                  className="text-[10px] font-mono font-bold text-[#A8AAA3] tracking-wider select-all whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  SF-2026-0042
                </span>
              </div>
              {/* Current State */}
              <div className="min-w-0">
                <span 
                  className="inline-block text-[10px] font-mono font-bold text-amber-500 whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  AI SUGGESTION / SEV1
                </span>
              </div>
              {/* Required Action */}
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-[#A8AAA3] font-sans leading-relaxed">
                  An authorized Incident Manager must review and explicitly confirm or change the suggested severity.
                </p>
              </div>
              {/* Authority State */}
              <div className="min-w-0">
                <span 
                  className="inline-block text-[10px] font-mono font-bold text-[#A8AAA3]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  HUMAN DECISION REQUIRED
                </span>
              </div>
              {/* Action */}
              <div className="text-right">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-[9px] font-mono font-bold tracking-widest uppercase border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px] cursor-not-allowed select-none"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <span>REVIEW</span>
                  <span className="text-[8px] px-1 py-0.2 bg-[#242522] text-[#5C5E58] rounded-[1px]">PENDING</span>
                </button>
              </div>
            </div>

            {/* Two-Level Structured Row Layout (768px to 1279px) */}
            <div className="needs-attention-row-2level flex-col gap-3 w-full">
              {/* Level 1 */}
              <div className="grid grid-cols-[130px_1fr_130px_150px] gap-4 items-center pb-2 border-b border-[#242522]/40 w-full">
                <div className="min-w-0">
                  <span 
                    className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-red-500/30 bg-red-500/10 text-red-500 rounded-[2px] whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    CRITICAL REVIEW
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h4 
                    className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wide"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    CONFIRM INCIDENT SEVERITY
                  </h4>
                  <span 
                    className="text-[10px] font-mono font-bold text-[#A8AAA3] tracking-wider select-all whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    SF-2026-0042
                  </span>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>CURRENT STATE</span>
                  <span className="block text-[10px] font-mono font-bold text-amber-500 whitespace-nowrap" style={{ fontFamily: 'var(--font-technical)' }}>
                    AI SUGGESTION / SEV1
                  </span>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>AUTHORITY STATE</span>
                  <span className="block text-[10px] font-mono font-bold text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>
                    HUMAN DECISION REQUIRED
                  </span>
                </div>
              </div>
              {/* Level 2 */}
              <div className="flex items-start justify-between gap-6 w-full">
                <div className="flex-1 min-w-0">
                  <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase mb-1" style={{ fontFamily: 'var(--font-technical)' }}>REQUIRED ACTION</span>
                  <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
                    An authorized Incident Manager must review and explicitly confirm or change the suggested severity.
                  </p>
                </div>
                <div className="shrink-0 w-[110px] self-end">
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="w-full inline-flex items-center justify-center gap-1 px-2 py-1.5 text-[9px] font-mono font-bold tracking-widest uppercase border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px] cursor-not-allowed select-none"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    <span>REVIEW</span>
                    <span className="text-[8px] px-1 py-0.2 bg-[#242522] text-[#5C5E58] rounded-[1px]">PENDING</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile layout (below 768px) */}
            <div className="needs-attention-row-mobile flex flex-col gap-4 w-full">
              <div className="space-y-1">
                <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>PRIORITY</span>
                <div>
                  <span 
                    className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-red-500/30 bg-red-500/10 text-red-500 rounded-[2px] whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    CRITICAL REVIEW
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>ATTENTION ITEM / INCIDENT</span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h4 
                    className="text-xs sm:text-sm font-mono font-bold text-[#F3F1EA] tracking-wide"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    CONFIRM INCIDENT SEVERITY
                  </h4>
                  <span 
                    className="text-[10px] font-mono font-bold text-[#A8AAA3] tracking-wider select-all whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    SF-2026-0042
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>CURRENT STATE</span>
                <span className="block text-xs font-mono font-bold text-amber-500" style={{ fontFamily: 'var(--font-technical)' }}>
                  AI SUGGESTION / SEV1
                </span>
              </div>

              <div className="space-y-1">
                <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>REQUIRED ACTION</span>
                <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
                  An authorized Incident Manager must review and explicitly confirm or change the suggested severity.
                </p>
              </div>

              <div className="space-y-1">
                <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>AUTHORITY STATE</span>
                <span className="block text-xs font-mono font-bold text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>
                  HUMAN DECISION REQUIRED
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-mono font-bold tracking-widest uppercase border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px] cursor-not-allowed select-none"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <span>REVIEW</span>
                  <span className="text-[8px] px-1 py-0.2 bg-[#242522] text-[#5C5E58] rounded-[1px]">PENDING</span>
                </button>
              </div>
            </div>
          </li>

          {/* Item 02 */}
          <li className="p-4 sm:p-5 bg-[#0E0F0D]/60 relative flex flex-col w-full text-left">
            {/* Visual Amber Severity Bar (Aria-hidden) */}
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-amber-500" aria-hidden="true" />

            {/* Desktop columns layout (1280px and above) */}
            <div className="needs-attention-row-6col grid-cols-[140px_minmax(180px,1.2fr)_minmax(130px,0.9fr)_minmax(260px,1.8fr)_minmax(150px,1fr)_100px] gap-5 w-full text-left items-center">
              {/* Priority */}
              <div className="min-w-0">
                <span 
                  className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-500 rounded-[2px] whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  OWNERSHIP REQUIRED
                </span>
              </div>
              {/* Attention Title and Incident */}
              <div className="flex flex-col gap-1 min-w-0">
                <h4 
                  className="text-xs sm:text-sm font-mono font-bold text-[#F3F1EA] tracking-wide"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  ASSIGN INCIDENT COMMANDER
                </h4>
                <span 
                  className="text-[10px] font-mono font-bold text-[#A8AAA3] tracking-wider select-all whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  SF-2026-0042
                </span>
              </div>
              {/* Current State */}
              <div className="min-w-0">
                <span 
                  className="inline-block text-[10px] font-mono font-bold text-[#5C5E58] whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  COMMANDER / UNASSIGNED
                </span>
              </div>
              {/* Required Action */}
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-[#A8AAA3] font-sans leading-relaxed">
                  Assign an authorized responder to coordinate incident ownership and response decisions.
                </p>
              </div>
              {/* Authority State */}
              <div className="min-w-0">
                <span 
                  className="inline-block text-[10px] font-mono font-bold text-[#A8AAA3]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  MEMBERSHIP BACKEND REQUIRED
                </span>
              </div>
              {/* Action */}
              <div className="text-right">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-[9px] font-mono font-bold tracking-widest uppercase border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px] cursor-not-allowed select-none"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <span>REVIEW</span>
                  <span className="text-[8px] px-1 py-0.2 bg-[#242522] text-[#5C5E58] rounded-[1px]">PENDING</span>
                </button>
              </div>
            </div>

            {/* Two-Level Structured Row Layout (768px to 1279px) */}
            <div className="needs-attention-row-2level flex-col gap-3 w-full">
              {/* Level 1 */}
              <div className="grid grid-cols-[130px_1fr_130px_150px] gap-4 items-center pb-2 border-b border-[#242522]/40 w-full">
                <div className="min-w-0">
                  <span 
                    className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-500 rounded-[2px] whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    OWNERSHIP REQUIRED
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h4 
                    className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wide"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    ASSIGN INCIDENT COMMANDER
                  </h4>
                  <span 
                    className="text-[10px] font-mono font-bold text-[#A8AAA3] tracking-wider select-all whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    SF-2026-0042
                  </span>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>CURRENT STATE</span>
                  <span className="block text-[10px] font-mono font-bold text-[#5C5E58] whitespace-nowrap" style={{ fontFamily: 'var(--font-technical)' }}>
                    COMMANDER / UNASSIGNED
                  </span>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>AUTHORITY STATE</span>
                  <span className="block text-[10px] font-mono font-bold text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>
                    MEMBERSHIP BACKEND REQUIRED
                  </span>
                </div>
              </div>
              {/* Level 2 */}
              <div className="flex items-start justify-between gap-6 w-full">
                <div className="flex-1 min-w-0">
                  <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase mb-1" style={{ fontFamily: 'var(--font-technical)' }}>REQUIRED ACTION</span>
                  <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
                    Assign an authorized responder to coordinate incident ownership and response decisions.
                  </p>
                </div>
                <div className="shrink-0 w-[110px] self-end">
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="w-full inline-flex items-center justify-center gap-1 px-2 py-1.5 text-[9px] font-mono font-bold tracking-widest uppercase border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px] cursor-not-allowed select-none"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    <span>REVIEW</span>
                    <span className="text-[8px] px-1 py-0.2 bg-[#242522] text-[#5C5E58] rounded-[1px]">PENDING</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile layout (below 768px) */}
            <div className="needs-attention-row-mobile flex flex-col gap-4 w-full">
              <div className="space-y-1">
                <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>PRIORITY</span>
                <div>
                  <span 
                    className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-500 rounded-[2px] whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    OWNERSHIP REQUIRED
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>ATTENTION ITEM / INCIDENT</span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h4 
                    className="text-xs sm:text-sm font-mono font-bold text-[#F3F1EA] tracking-wide"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    ASSIGN INCIDENT COMMANDER
                  </h4>
                  <span 
                    className="text-[10px] font-mono font-bold text-[#A8AAA3] tracking-wider select-all whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    SF-2026-0042
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>CURRENT STATE</span>
                <span className="block text-xs font-mono font-bold text-[#5C5E58]" style={{ fontFamily: 'var(--font-technical)' }}>
                  COMMANDER / UNASSIGNED
                </span>
              </div>

              <div className="space-y-1">
                <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>REQUIRED ACTION</span>
                <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
                  Assign an authorized responder to coordinate incident ownership and response decisions.
                </p>
              </div>

              <div className="space-y-1">
                <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>AUTHORITY STATE</span>
                <span className="block text-xs font-mono font-bold text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>
                  MEMBERSHIP BACKEND REQUIRED
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-mono font-bold tracking-widest uppercase border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px] cursor-not-allowed select-none"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <span>REVIEW</span>
                  <span className="text-[8px] px-1 py-0.2 bg-[#242522] text-[#5C5E58] rounded-[1px]">PENDING</span>
                </button>
              </div>
            </div>
          </li>

          {/* Item 03 */}
          <li className="p-4 sm:p-5 bg-[#0A0A0A] relative flex flex-col w-full text-left">
            {/* Visual Amber Severity Bar (Aria-hidden) */}
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-amber-500" aria-hidden="true" />

            {/* Desktop columns layout (1280px and above) */}
            <div className="needs-attention-row-6col grid-cols-[140px_minmax(180px,1.2fr)_minmax(130px,0.9fr)_minmax(260px,1.8fr)_minmax(150px,1fr)_100px] gap-5 w-full text-left items-center">
              {/* Priority */}
              <div className="min-w-0">
                <span 
                  className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-500 rounded-[2px] whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  TASK REVIEW
                </span>
              </div>
              {/* Attention Title and Incident */}
              <div className="flex flex-col gap-1 min-w-0">
                <h4 
                  className="text-xs sm:text-sm font-mono font-bold text-[#F3F1EA] tracking-wide"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  REVIEW RECOMMENDED RESPONSE TASKS
                </h4>
                <span 
                  className="text-[10px] font-mono font-bold text-[#A8AAA3] tracking-wider select-all whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  SF-2026-0042
                </span>
              </div>
              {/* Current State */}
              <div className="min-w-0">
                <span 
                  className="inline-block text-[10px] font-mono font-bold text-amber-500 whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  5 TASKS / RECOMMENDED
                </span>
              </div>
              {/* Required Action */}
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-[#A8AAA3] font-sans leading-relaxed">
                  Review the proposed response tasks before accepting, editing, assigning, or starting any work.
                </p>
              </div>
              {/* Authority State */}
              <div className="min-w-0">
                <span 
                  className="inline-block text-[10px] font-mono font-bold text-red-500"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  NOT ACCEPTED
                </span>
              </div>
              {/* Action */}
              <div className="text-right">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-[9px] font-mono font-bold tracking-widest uppercase border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px] cursor-not-allowed select-none"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <span>REVIEW</span>
                  <span className="text-[8px] px-1 py-0.2 bg-[#242522] text-[#5C5E58] rounded-[1px]">PENDING</span>
                </button>
              </div>
            </div>

            {/* Two-Level Structured Row Layout (768px to 1279px) */}
            <div className="needs-attention-row-2level flex-col gap-3 w-full">
              {/* Level 1 */}
              <div className="grid grid-cols-[130px_1fr_130px_150px] gap-4 items-center pb-2 border-b border-[#242522]/40 w-full">
                <div className="min-w-0">
                  <span 
                    className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-500 rounded-[2px] whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    TASK REVIEW
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h4 
                    className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wide"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    REVIEW RECOMMENDED RESPONSE TASKS
                  </h4>
                  <span 
                    className="text-[10px] font-mono font-bold text-[#A8AAA3] tracking-wider select-all whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    SF-2026-0042
                  </span>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>CURRENT STATE</span>
                  <span className="block text-[10px] font-mono font-bold text-amber-500 whitespace-nowrap" style={{ fontFamily: 'var(--font-technical)' }}>
                    5 TASKS / RECOMMENDED
                  </span>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>AUTHORITY STATE</span>
                  <span className="block text-[10px] font-mono font-bold text-red-500" style={{ fontFamily: 'var(--font-technical)' }}>
                    NOT ACCEPTED
                  </span>
                </div>
              </div>
              {/* Level 2 */}
              <div className="flex items-start justify-between gap-6 w-full">
                <div className="flex-1 min-w-0">
                  <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase mb-1" style={{ fontFamily: 'var(--font-technical)' }}>REQUIRED ACTION</span>
                  <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
                    Review the proposed response tasks before accepting, editing, assigning, or starting any work.
                  </p>
                </div>
                <div className="shrink-0 w-[110px] self-end">
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="w-full inline-flex items-center justify-center gap-1 px-2 py-1.5 text-[9px] font-mono font-bold tracking-widest uppercase border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px] cursor-not-allowed select-none"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    <span>REVIEW</span>
                    <span className="text-[8px] px-1 py-0.2 bg-[#242522] text-[#5C5E58] rounded-[1px]">PENDING</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile layout (below 768px) */}
            <div className="needs-attention-row-mobile flex flex-col gap-4 w-full">
              <div className="space-y-1">
                <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>PRIORITY</span>
                <div>
                  <span 
                    className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-500 rounded-[2px] whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    TASK REVIEW
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>ATTENTION ITEM / INCIDENT</span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h4 
                    className="text-xs sm:text-sm font-mono font-bold text-[#F3F1EA] tracking-wide"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    REVIEW RECOMMENDED RESPONSE TASKS
                  </h4>
                  <span 
                    className="text-[10px] font-mono font-bold text-[#A8AAA3] tracking-wider select-all whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    SF-2026-0042
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>CURRENT STATE</span>
                <span className="block text-xs font-mono font-bold text-amber-500" style={{ fontFamily: 'var(--font-technical)' }}>
                  5 TASKS / RECOMMENDED
                </span>
              </div>

              <div className="space-y-1">
                <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>REQUIRED ACTION</span>
                <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
                  Review the proposed response tasks before accepting, editing, assigning, or starting any work.
                </p>
              </div>

              <div className="space-y-1">
                <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>AUTHORITY STATE</span>
                <span className="block text-xs font-mono font-bold text-red-500" style={{ fontFamily: 'var(--font-technical)' }}>
                  NOT ACCEPTED
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-mono font-bold tracking-widest uppercase border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px] cursor-not-allowed select-none"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <span>REVIEW</span>
                  <span className="text-[8px] px-1 py-0.2 bg-[#242522] text-[#5C5E58] rounded-[1px]">PENDING</span>
                </button>
              </div>
            </div>
          </li>
        </ul>
      </section>

      {/* Recent Activity Module 04 */}
      <section 
        aria-labelledby="recent-activity-heading" 
        className="recent-activity-container border border-[#242522] rounded-[2px] bg-[#0A0A0A] overflow-hidden w-full max-w-full box-border"
      >
        <style>{`
          .recent-activity-container {
            container-type: inline-size;
          }
          
          .recent-activity-header-6col {
            display: none !important;
          }
          .recent-activity-row-6col {
            display: none !important;
          }
          .recent-activity-row-2level {
            display: none !important;
          }
          .recent-activity-row-mobile {
            display: flex !important;
          }

          @container (min-width: 700px) {
            .recent-activity-row-mobile {
              display: none !important;
            }
            .recent-activity-row-2level {
              display: flex !important;
            }
          }

          @container (min-width: 1100px) {
            .recent-activity-header-6col {
              display: grid !important;
            }
            .recent-activity-row-6col {
              display: grid !important;
            }
            .recent-activity-row-2level {
              display: none !important;
            }
            .recent-activity-row-mobile {
              display: none !important;
            }
          }
        `}</style>

        {/* Module Header Segment */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-[#242522] gap-3 bg-[#141513]/20">
          <div className="space-y-0.5 text-left">
            <h3 
              id="recent-activity-heading" 
              className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA]" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              04 / RECENT ACTIVITY
            </h3>
            <div 
              className="text-[9px] font-mono tracking-widest text-[#5C5E58] uppercase" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              CANONICAL INCIDENT SEQUENCE / FRONTEND MOCK DATA
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div 
              className="flex items-center gap-1.5 border border-[#242522] bg-[#141513]/30 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider text-[#A8AAA3] rounded-[2px] w-fit" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#5C5E58]" aria-hidden="true" />
              <span>5 ACTIVITY RECORDS</span>
            </div>
            
            <div 
              className="flex items-center gap-1.5 border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider text-amber-500 rounded-[2px] w-fit" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span>TIMESTAMPS / NOT AVAILABLE</span>
            </div>

            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest uppercase border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px] cursor-not-allowed select-none"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span>OPEN ACTIVITY LOG</span>
              <span className="text-[8px] px-1 py-0.2 bg-[#242522] text-[#5C5E58] rounded-[1px]">PENDING</span>
            </button>
          </div>
        </div>

        {/* Column Headers (Desktop 1100px and above) */}
        <div className="recent-activity-header-6col grid-cols-[80px_180px_1fr_140px_160px_110px] gap-5 px-6 py-2 border-b border-[#242522] bg-[#141513]/10 text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
          <div>SEQUENCE</div>
          <div>ACTIVITY TYPE & REF</div>
          <div>DESCRIPTION</div>
          <div>SOURCE</div>
          <div>STATE</div>
          <div>TIME</div>
        </div>

        {/* Activity List Container */}
        <div className="relative">
          <ol className="divide-y divide-[#242522]" role="list">
            {/* A beautiful continuous vertical rail on the left, visible on md/lg and above */}
            <div className="absolute left-[44px] top-0 bottom-0 w-[1px] bg-[#242522] pointer-events-none hidden md:block" aria-hidden="true" />
            
            {/* Signal lime structural focus bar on the left of the list to draw attention */}
            <div className="absolute left-[44px] top-0 h-10 w-[1px] bg-[#9FEF00] pointer-events-none hidden md:block" aria-hidden="true" />

            {recentActivities.map((item) => (
              <li 
                key={item.sequence}
                className="relative flex flex-col md:flex-row md:items-start w-full min-w-0"
              >
                {/* 6-Column Layout (min-width: 1100px) */}
                <div className="recent-activity-row-6col grid-cols-[80px_180px_1fr_140px_160px_110px] gap-5 px-6 py-4 items-start w-full text-left relative min-w-0">
                  {/* Sequence column aligned with vertical rail */}
                  <div className="flex items-center justify-center w-9 h-6 z-10 bg-[#0A0A0A]">
                    <span className="text-[11px] font-mono font-bold text-[#9FEF00]/90" style={{ fontFamily: 'var(--font-technical)' }}>
                      {item.sequence}
                    </span>
                  </div>

                  {/* Activity type & ref */}
                  <div className="min-w-0" style={{ fontFamily: 'var(--font-technical)' }}>
                    <h4 className="text-[10px] font-mono font-bold tracking-wider text-[#F3F1EA] uppercase leading-tight">
                      {item.type}
                    </h4>
                    <span className="text-[9px] font-mono text-[#5C5E58] tracking-wider block mt-1 select-all">
                      {item.reference}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="min-w-0 text-xs text-[#A8AAA3] font-sans leading-relaxed">
                    {item.description}
                  </div>

                  {/* Source */}
                  <div className="min-w-0" style={{ fontFamily: 'var(--font-technical)' }}>
                    <span className="block text-[8px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase mb-0.5">SOURCE</span>
                    <span className="text-[10px] font-mono text-[#A8AAA3]">
                      {item.source}
                    </span>
                  </div>

                  {/* State */}
                  <div className="min-w-0" style={{ fontFamily: 'var(--font-technical)' }}>
                    <span className="block text-[8px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase mb-0.5">STATE</span>
                    <div>
                      {item.stateColor === 'amber' ? (
                        <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-500 rounded-[2px] whitespace-nowrap">
                          {item.state}
                        </span>
                      ) : (
                        <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px] whitespace-nowrap">
                          {item.state}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Time */}
                  <div className="min-w-0" style={{ fontFamily: 'var(--font-technical)' }}>
                    <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase mb-0.5">TIME</span>
                    <span className="text-[10px] font-mono font-bold text-[#5C5E58] uppercase whitespace-nowrap">NOT AVAILABLE</span>
                    <span className="sr-only">TIME / NOT AVAILABLE</span>
                  </div>
                </div>

                {/* Two-Level Structured Row Layout (700px to 1099px) */}
                <div className="recent-activity-row-2level flex flex-col gap-3 w-full px-6 py-4 min-w-0">
                  {/* Level 1 */}
                  <div className="grid grid-cols-[80px_1fr_150px_180px] gap-4 items-center pb-2 border-b border-[#242522]/30 w-full min-w-0">
                    <div className="flex items-center justify-center w-9 h-6 z-10 bg-[#0A0A0A]">
                      <span className="text-[11px] font-mono font-bold text-[#9FEF00]/90" style={{ fontFamily: 'var(--font-technical)' }}>
                        {item.sequence}
                      </span>
                    </div>
                    <div className="flex flex-col text-left min-w-0" style={{ fontFamily: 'var(--font-technical)' }}>
                      <h4 className="text-[10px] font-mono font-bold tracking-wider text-[#F3F1EA] uppercase leading-tight">
                        {item.type}
                      </h4>
                      <span className="text-[9px] font-mono text-[#5C5E58] tracking-wider mt-0.5 select-all">
                        {item.reference}
                      </span>
                    </div>
                    <div className="text-left min-w-0" style={{ fontFamily: 'var(--font-technical)' }}>
                      <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase">SOURCE</span>
                      <span className="text-[10px] font-mono text-[#A8AAA3] block truncate">
                        {item.source}
                      </span>
                    </div>
                    <div className="text-right min-w-0" style={{ fontFamily: 'var(--font-technical)' }}>
                      <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase mb-0.5 text-right">STATE</span>
                      {item.stateColor === 'amber' ? (
                        <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-500 rounded-[2px] whitespace-nowrap">
                          {item.state}
                        </span>
                      ) : (
                        <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px] whitespace-nowrap">
                          {item.state}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Level 2 */}
                  <div className="grid grid-cols-[80px_1fr_120px] gap-4 items-start w-full min-w-0">
                    <div /> {/* Alignment Spacer */}
                    <div className="text-left min-w-0">
                      <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase mb-0.5" style={{ fontFamily: 'var(--font-technical)' }}>DESCRIPTION</span>
                      <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right min-w-0" style={{ fontFamily: 'var(--font-technical)' }}>
                      <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase mb-0.5">TIME</span>
                      <span className="block text-[10px] font-mono font-bold text-[#5C5E58] uppercase">NOT AVAILABLE</span>
                      <span className="sr-only">TIME / NOT AVAILABLE</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout (below 700px) */}
                <div className="recent-activity-row-mobile flex flex-col gap-4 w-full px-4 py-4 min-w-0">
                  <div className="flex items-center justify-between border-b border-[#242522]/30 pb-2 w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>SEQ</span>
                      <span className="text-xs font-mono font-bold text-[#9FEF00]" style={{ fontFamily: 'var(--font-technical)' }}>{item.sequence}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>REF</span>
                      <span className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wider select-all" style={{ fontFamily: 'var(--font-technical)' }}>{item.reference}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-left min-w-0">
                    <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>ACTIVITY TYPE</span>
                    <h4 className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wide" style={{ fontFamily: 'var(--font-technical)' }}>{item.type}</h4>
                  </div>

                  <div className="space-y-1 text-left min-w-0">
                    <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>DESCRIPTION</span>
                    <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">{item.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full pt-1 min-w-0">
                    <div className="space-y-1 text-left min-w-0">
                      <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>SOURCE</span>
                      <span className="block text-xs font-mono font-bold text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>{item.source}</span>
                    </div>

                    <div className="space-y-1 text-left min-w-0">
                      <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>TIME</span>
                      <span className="block text-xs font-mono font-bold text-[#5C5E58]" style={{ fontFamily: 'var(--font-technical)' }}>NOT AVAILABLE</span>
                      <span className="sr-only">TIME / NOT AVAILABLE</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-left pt-1 min-w-0">
                    <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>STATE</span>
                    <div>
                      {item.stateColor === 'amber' ? (
                        <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-500 rounded-[2px] whitespace-nowrap">
                          {item.state}
                        </span>
                      ) : (
                        <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px] whitespace-nowrap">
                          {item.state}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Response Workload Module 05 */}
      <section 
        aria-labelledby="response-workload-heading" 
        className="response-workload-container border border-[#242522] rounded-[2px] bg-[#0A0A0A] overflow-hidden w-full max-w-full box-border"
      >
        <style>{`
          .response-workload-container {
            container-type: inline-size;
          }
          
          .response-workload-header-6col {
            display: none !important;
          }
          .response-workload-row-6col {
            display: none !important;
          }
          .response-workload-row-2level {
            display: none !important;
          }
          .response-workload-row-mobile {
            display: flex !important;
          }

          @container (min-width: 700px) {
            .response-workload-row-mobile {
              display: none !important;
            }
            .response-workload-row-2level {
              display: flex !important;
            }
          }

          @container (min-width: 1100px) {
            .response-workload-header-6col {
              display: grid !important;
            }
            .response-workload-row-6col {
              display: grid !important;
            }
            .response-workload-row-2level {
              display: none !important;
            }
            .response-workload-row-mobile {
              display: none !important;
            }
          }
        `}</style>

        {/* Module Header Segment */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-[#242522] gap-3 bg-[#141513]/20">
          <div className="space-y-0.5 text-left">
            <h3 
              id="response-workload-heading" 
              className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA]" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              05 / RESPONSE WORKLOAD
            </h3>
            <div 
              className="text-[9px] font-mono tracking-widest text-[#5C5E58] uppercase" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              RECOMMENDED TASK SET / FRONTEND MOCK DATA
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div 
              className="flex items-center gap-1.5 border border-[#242522] bg-[#141513]/30 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider text-[#A8AAA3] rounded-[2px] w-fit" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#5C5E58]" aria-hidden="true" />
              <span>5 RECOMMENDED TASKS</span>
            </div>
            
            <div 
              className="flex items-center gap-1.5 border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider text-amber-500 rounded-[2px] w-fit" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span>ACCEPTANCE / HUMAN REVIEW PENDING</span>
            </div>

            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest uppercase border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px] cursor-not-allowed select-none"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span>OPEN TASK QUEUE</span>
              <span className="text-[8px] px-1 py-0.2 bg-[#242522] text-[#5C5E58] rounded-[1px]">PENDING</span>
            </button>
          </div>
        </div>

        {/* Column Headers (Desktop 1100px and above) */}
        <div className="response-workload-header-6col grid-cols-[60px_1fr_135px_135px_135px_135px] gap-5 px-6 py-2 border-b border-[#242522] bg-[#141513]/10 text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
          <div>SEQ</div>
          <div>RECOMMENDED TASK</div>
          <div>INCIDENT</div>
          <div>ACCEPTANCE</div>
          <div>OWNERSHIP</div>
          <div>RECORD STATE</div>
        </div>

        {/* Task List Container */}
        <div className="relative">
          <ol className="divide-y divide-[#242522]" role="list">
            {responseTasks.map((item) => (
              <li 
                key={item.sequence}
                className="relative flex flex-col md:flex-row md:items-start w-full min-w-0 border-b last:border-b-0 border-[#242522]"
              >
                {/* 6-Column Layout (min-width: 1100px) */}
                <div className="response-workload-row-6col grid-cols-[60px_1fr_135px_135px_135px_135px] gap-5 px-6 py-4 items-center w-full text-left relative min-w-0">
                  {/* Sequence */}
                  <div className="flex items-center text-[11px] font-mono font-bold text-[#F3F1EA]" style={{ fontFamily: 'var(--font-technical)' }}>
                    {item.sequence}
                  </div>

                  {/* Recommended Task title & Source */}
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-mono font-bold tracking-wider text-[#F3F1EA] uppercase leading-tight" style={{ fontFamily: 'var(--font-technical)' }}>
                      {item.title}
                    </h4>
                    <span className="text-[9px] font-mono text-[#5C5E58] tracking-wider block mt-1 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                      SOURCE: {item.source}
                    </span>
                  </div>

                  {/* Incident */}
                  <div className="min-w-0 font-mono text-xs text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>
                    {item.incident}
                  </div>

                  {/* Acceptance */}
                  <div className="min-w-0">
                    <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-500 rounded-[2px] whitespace-nowrap" style={{ fontFamily: 'var(--font-technical)' }}>
                      {item.acceptance}
                    </span>
                  </div>

                  {/* Ownership */}
                  <div className="min-w-0">
                    <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px] whitespace-nowrap" style={{ fontFamily: 'var(--font-technical)' }}>
                      {item.ownership}
                    </span>
                  </div>

                  {/* Record State */}
                  <div className="min-w-0">
                    <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px] whitespace-nowrap" style={{ fontFamily: 'var(--font-technical)' }}>
                      {item.recordState}
                    </span>
                  </div>
                </div>

                {/* Two-Level Structured Row Layout (700px to 1099px) */}
                <div className="response-workload-row-2level flex flex-col gap-3 w-full px-6 py-4 min-w-0">
                  {/* Level 1: sequence, task title */}
                  <div className="grid grid-cols-[60px_1fr] gap-4 items-center pb-2 border-b border-[#242522]/30 w-full min-w-0">
                    <div className="flex items-center text-[11px] font-mono font-bold text-[#F3F1EA]" style={{ fontFamily: 'var(--font-technical)' }}>
                      {item.sequence}
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <h4 className="text-[11px] font-mono font-bold tracking-wider text-[#F3F1EA] uppercase leading-tight" style={{ fontFamily: 'var(--font-technical)' }}>
                        {item.title}
                      </h4>
                      <span className="text-[9px] font-mono text-[#5C5E58] tracking-wider mt-0.5 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                        SOURCE: {item.source}
                      </span>
                    </div>
                  </div>

                  {/* Level 2: incident, acceptance, ownership, record state */}
                  <div className="grid grid-cols-4 gap-4 items-start w-full min-w-0">
                    {/* Incident */}
                    <div className="text-left min-w-0">
                      <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase mb-0.5" style={{ fontFamily: 'var(--font-technical)' }}>INCIDENT</span>
                      <span className="text-xs font-mono text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>
                        {item.incident}
                      </span>
                    </div>

                    {/* Acceptance */}
                    <div className="text-left min-w-0">
                      <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase mb-0.5" style={{ fontFamily: 'var(--font-technical)' }}>ACCEPTANCE</span>
                      <div>
                        <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-500 rounded-[2px]" style={{ fontFamily: 'var(--font-technical)' }}>
                          {item.acceptance}
                        </span>
                      </div>
                    </div>

                    {/* Ownership */}
                    <div className="text-left min-w-0">
                      <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase mb-0.5" style={{ fontFamily: 'var(--font-technical)' }}>OWNERSHIP</span>
                      <div>
                        <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px]" style={{ fontFamily: 'var(--font-technical)' }}>
                          {item.ownership}
                        </span>
                      </div>
                    </div>

                    {/* Record State */}
                    <div className="text-left min-w-0">
                      <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase mb-0.5" style={{ fontFamily: 'var(--font-technical)' }}>RECORD STATE</span>
                      <div>
                        <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px]" style={{ fontFamily: 'var(--font-technical)' }}>
                          {item.recordState}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout (below 700px) */}
                <div className="response-workload-row-mobile flex flex-col gap-4 w-full px-4 py-4 min-w-0">
                  <div className="flex items-center justify-between border-b border-[#242522]/30 pb-2 w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>SEQ</span>
                      <span className="text-xs font-mono font-bold text-[#F3F1EA]" style={{ fontFamily: 'var(--font-technical)' }}>{item.sequence}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>REF</span>
                      <span className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wider select-all" style={{ fontFamily: 'var(--font-technical)' }}>{item.incident}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-left min-w-0">
                    <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>RECOMMENDED TASK</span>
                    <h4 className="text-xs font-mono font-bold text-[#F3F1EA] tracking-wide" style={{ fontFamily: 'var(--font-technical)' }}>{item.title}</h4>
                  </div>

                  <div className="space-y-1 text-left min-w-0">
                    <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>SOURCE</span>
                    <span className="block text-xs font-mono font-bold text-[#A8AAA3] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>{item.source}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full pt-1 min-w-0">
                    <div className="space-y-1 text-left min-w-0">
                      <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>ACCEPTANCE</span>
                      <div>
                        <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-500 rounded-[2px]" style={{ fontFamily: 'var(--font-technical)' }}>
                          {item.acceptance}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-left min-w-0">
                      <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>OWNERSHIP</span>
                      <div>
                        <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px]" style={{ fontFamily: 'var(--font-technical)' }}>
                          {item.ownership}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-left pt-1 min-w-0">
                    <span className="block text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>RECORD STATE</span>
                    <div>
                      <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-[#242522] bg-[#141513]/50 text-[#5C5E58] rounded-[2px]" style={{ fontFamily: 'var(--font-technical)' }}>
                        {item.recordState}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Quick Create Incident Module 06 */}
      <section 
        id="quick-create-incident-module"
        aria-labelledby="quick-create-incident-heading" 
        className="quick-create-container border border-[#242522] rounded-[2px] bg-[#0A0A0A] overflow-hidden w-full max-w-full box-border"
      >
        <style>{`
          .quick-create-container {
            container-type: inline-size;
          }
        `}</style>

        {/* Module Header Segment */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-[#242522] gap-3 bg-[#141513]/20">
          <div className="space-y-0.5 text-left">
            <h3 
              id="quick-create-incident-heading" 
              className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA]" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              06 / QUICK CREATE INCIDENT
            </h3>
            <div 
              className="text-[9px] font-mono tracking-widest text-[#5C5E58] uppercase" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              LOCAL FORM PREVIEW / NO RECORD CREATION
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div 
              className="flex items-center gap-1.5 border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider text-amber-500 rounded-[2px] w-fit" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
              <span>CREATION SERVICE / NOT CONNECTED</span>
            </div>
          </div>
        </div>

        {/* Asymmetric internal layout */}
        <div className="grid grid-cols-1 [@media(min-width:1000px)]:grid-cols-[1.6fr_1fr] min-w-0">
          {/* Left Form Area */}
          <form 
            id="quick-create-incident-form"
            onSubmit={handleSubmit} 
            className="p-6 space-y-6 text-left min-w-0" 
            noValidate
          >
            {/* Title Field */}
            <div className="space-y-1.5">
              <label 
                htmlFor="incident-title"
                className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                INCIDENT TITLE *
              </label>
              <input
                id="incident-title"
                type="text"
                required
                maxLength={120}
                placeholder="Checkout payments failing after latest deployment"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) {
                    setErrors(prev => ({ ...prev, title: undefined }));
                  }
                }}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "incident-title-error" : undefined}
                className="w-full bg-[#141513]/40 border border-[#242522] text-[#F3F1EA] text-xs font-mono p-3 rounded-[2px] placeholder-[#5C5E58] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
                style={{ fontFamily: 'var(--font-technical)' }}
              />
              {errors.title && (
                <p 
                  id="incident-title-error" 
                  role="alert"
                  className="text-[10px] font-mono text-amber-500/90 tracking-wide"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label 
                  htmlFor="incident-description"
                  className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  INCIDENT DESCRIPTION *
                </label>
                <span 
                  className="text-[9px] font-mono text-[#5C5E58]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  {description.length} / 5000
                </span>
              </div>
              <textarea
                id="incident-description"
                required
                maxLength={5000}
                rows={5}
                placeholder="Customers cannot complete card payments after the latest deployment."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) {
                    setErrors(prev => ({ ...prev, description: undefined }));
                  }
                }}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? "incident-description-error" : undefined}
                className="w-full bg-[#141513]/40 border border-[#242522] text-[#F3F1EA] text-xs font-mono p-3 rounded-[2px] placeholder-[#5C5E58] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 resize-y max-w-full"
                style={{ fontFamily: 'var(--font-technical)' }}
              />
              {errors.description && (
                <p 
                  id="incident-description-error" 
                  role="alert"
                  className="text-[10px] font-mono text-amber-500/90 tracking-wide"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  {errors.description}
                </p>
              )}
            </div>

            {/* Affected Service Select */}
            <div className="space-y-1.5">
              <label 
                htmlFor="incident-service"
                className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                AFFECTED SERVICE (OPTIONAL)
              </label>
              <select
                id="incident-service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-[#141513]/40 border border-[#242522] text-[#F3F1EA] text-xs font-mono p-3 rounded-[2px] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 appearance-none cursor-pointer"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                <option value="" className="bg-[#0A0A0A] text-[#5C5E58]">Select a service</option>
                <option value="Checkout Web" className="bg-[#0A0A0A] text-[#F3F1EA]">Checkout Web</option>
                <option value="Payments API" className="bg-[#0A0A0A] text-[#F3F1EA]">Payments API</option>
                <option value="Order Processor" className="bg-[#0A0A0A] text-[#F3F1EA]">Order Processor</option>
                <option value="Customer Portal" className="bg-[#0A0A0A] text-[#F3F1EA]">Customer Portal</option>
              </select>
            </div>

            {/* Checkbox with AI preference */}
            <div className="border border-[#242522] bg-[#141513]/10 p-3 rounded-[2px] space-y-2">
              <div className="flex items-start gap-3">
                <input
                  id="analyze-immediately-checkbox"
                  type="checkbox"
                  checked={analyzeImmediately}
                  onChange={(e) => setAnalyzeImmediately(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded-[1px] border-[#242522] bg-[#0A0A0A] text-amber-500 focus:ring-amber-500/50 focus:ring-1"
                />
                <div className="space-y-1 text-left">
                  <label 
                    htmlFor="analyze-immediately-checkbox"
                    className="block text-[10px] font-mono font-bold tracking-widest text-[#F3F1EA] cursor-pointer"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    ANALYZE IMMEDIATELY WITH AI
                  </label>
                  <p className="text-[9px] font-mono text-[#5C5E58] tracking-wide leading-normal">
                    Optional preference only. The incident must be safely created before AI analysis begins.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 pt-1 border-t border-[#242522]/40 text-[8px] font-mono tracking-widest text-amber-500 uppercase">
                <span className="w-1 h-1 rounded-full bg-amber-500/60" />
                <span>AUTHORITY / BACKEND REQUIRED</span>
              </div>
            </div>

            {/* Reporter Context */}
            <div className="border-t border-[#242522] pt-4 space-y-2.5">
              <h4 
                className="text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                REPORTER CONTEXT
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-[#242522] bg-[#141513]/10 p-2 rounded-[2px] text-left">
                  <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase">REPORTER</span>
                  <span className="text-[10px] font-mono font-bold text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>CURRENT OPERATOR</span>
                </div>
                <div className="border border-[#242522] bg-[#141513]/10 p-2 rounded-[2px] text-left">
                  <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase">IDENTITY STATE</span>
                  <span className="text-[10px] font-mono font-bold text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>FRONTEND PREVIEW</span>
                </div>
              </div>
            </div>

            {/* Action buttons and live-area message */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  id="quick-create-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 text-xs font-mono font-bold tracking-widest uppercase border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-[2px] transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  {isSubmitting ? 'VALIDATING...' : 'CREATE INCIDENT'}
                </button>

                <button
                  id="open-full-form-btn"
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 text-xs font-mono font-bold tracking-widest uppercase border border-[#242522] bg-[#141513]/30 text-[#5C5E58] rounded-[2px] cursor-not-allowed select-none"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <span>OPEN FULL INCIDENT FORM</span>
                  <span className="text-[8px] px-1 ml-1.5 py-0.2 bg-[#242522] text-[#5C5E58] rounded-[1px]">PENDING</span>
                </button>
              </div>

              {/* Accessible Live Area */}
              <div id="creation-status-live-area" aria-live="polite" className="text-left">
                {submitStatus === 'success' && (
                  <div className="p-3 border border-amber-500/20 bg-amber-500/5 rounded-[2px] space-y-1">
                    <h5 className="text-[10px] font-mono font-bold tracking-wider text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                      INCIDENT CREATION NOT CONNECTED
                    </h5>
                    <p className="text-[10px] font-mono text-[#A8AAA3] tracking-wide leading-normal" style={{ fontFamily: 'var(--font-technical)' }}>
                      Frontend validation completed. The incident record, initial timeline event, and optional AI analysis will be created during backend integration.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* Right Area: Creation Contract Panel */}
          <div 
            id="creation-contract-panel"
            className="border-t [@media(min-width:1000px)]:border-t-0 [@media(min-width:1000px)]:border-l border-[#242522] bg-[#141513]/10 p-6 space-y-6 text-left min-w-0"
          >
            <div>
              <h4 
                className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA]"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                CREATION CONTRACT
              </h4>
              <p className="text-[9px] font-mono text-[#5C5E58] tracking-widest mt-0.5 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                BACKEND REQUIREMENT DEFINITION
              </p>
            </div>

            {/* Technical grid of contract expectations */}
            <div className="space-y-4 font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
              <div className="border-b border-[#242522]/60 pb-3 flex justify-between items-center gap-4">
                <span className="text-[10px] text-[#5C5E58] font-bold uppercase tracking-wider">INITIAL STATUS</span>
                <span className="text-[10px] text-[#A8AAA3] font-bold border border-[#242522] bg-[#141513]/50 px-1.5 py-0.5 rounded-[1px]">REPORTED</span>
              </div>

              <div className="border-b border-[#242522]/60 pb-3 flex justify-between items-center gap-4">
                <span className="text-[10px] text-[#5C5E58] font-bold uppercase tracking-wider">INCIDENT CODE</span>
                <span className="text-[10px] text-[#A8AAA3] font-bold border border-[#242522] bg-[#141513]/50 px-1.5 py-0.5 rounded-[1px]">SERVER GENERATED</span>
              </div>

              <div className="border-b border-[#242522]/60 pb-3 flex justify-between items-center gap-4">
                <span className="text-[10px] text-[#5C5E58] font-bold uppercase tracking-wider">TIMELINE EVENT</span>
                <span className="text-[10px] text-[#A8AAA3] font-bold border border-[#242522] bg-[#141513]/50 px-1.5 py-0.5 rounded-[1px]">INCIDENT_CREATED</span>
              </div>

              <div className="border-b border-[#242522]/60 pb-3 flex justify-between items-center gap-4">
                <span className="text-[10px] text-[#5C5E58] font-bold uppercase tracking-wider">AI ANALYSIS</span>
                <span className="text-[10px] text-[#A8AAA3] font-bold border border-[#242522] bg-[#141513]/50 px-1.5 py-0.5 rounded-[1px]">OPTIONAL / AFTER CREATION</span>
              </div>

              <div className="border-b border-[#242522]/60 pb-3 flex justify-between items-center gap-4">
                <span className="text-[10px] text-[#5C5E58] font-bold uppercase tracking-wider">DUPLICATE PROTECTION</span>
                <span className="text-[10px] text-[#A8AAA3] font-bold border border-[#242522] bg-[#141513]/50 px-1.5 py-0.5 rounded-[1px]">BACKEND REQUIRED</span>
              </div>

              <div className="border-b border-[#242522]/60 pb-3 flex justify-between items-center gap-4">
                <span className="text-[10px] text-[#5C5E58] font-bold uppercase tracking-wider">TENANT AUTHORITY</span>
                <span className="text-[10px] text-[#A8AAA3] font-bold border border-[#242522] bg-[#141513]/50 px-1.5 py-0.5 rounded-[1px]">BACKEND REQUIRED</span>
              </div>
            </div>

            {/* Compact rule and supporting copy */}
            <div className="border border-amber-500/20 bg-amber-500/5 p-3 rounded-[2px] space-y-1.5">
              <span 
                className="block text-[8px] font-mono font-bold tracking-widest text-amber-500 uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                INCIDENT PERSISTENCE PRECEDES AI
              </span>
              <p className="text-[10px] font-mono text-[#A8AAA3] tracking-wide leading-normal" style={{ fontFamily: 'var(--font-technical)' }}>
                AI failure must never remove or prevent access to the original incident report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guided Demo Module 07 */}
      <section 
        id="guided-demo-module"
        aria-labelledby="guided-demo-heading" 
        className="guided-demo-container border border-[#242522] rounded-[2px] bg-[#0A0A0A] overflow-hidden w-full max-w-full box-border"
      >
        <style>{`
          .guided-demo-container {
            container-type: inline-size;
          }
        `}</style>

        {/* Module Header Segment */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-[#242522] gap-3 bg-[#141513]/20">
          <div className="space-y-0.5 text-left">
            <h3 
              id="guided-demo-heading" 
              className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA]" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              07 / GUIDED DEMO
            </h3>
            <div 
              className="text-[9px] font-mono tracking-widest text-[#5C5E58] uppercase" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              SIGNALFOLD RESPONSE STORY / FRONTEND PREVIEW
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div 
              className="flex items-center gap-1.5 border border-[#242522] bg-[#141513]/40 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider text-[#A8AAA3] rounded-[2px] w-fit" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span className="text-[#5C5E58]">TARGET DURATION:</span>
              <span className="text-[#F3F1EA]">90–120 SECONDS</span>
            </div>
            <div 
              className="flex items-center gap-1.5 border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider text-amber-500 rounded-[2px] w-fit" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
              <span>EXECUTION / NOT CONNECTED</span>
            </div>
          </div>
        </div>

        {/* Asymmetric internal layout */}
        <div className="grid grid-cols-1 [@media(min-width:1050px)]:grid-cols-[1fr_1.8fr] min-w-0">
          {/* Left Area: Introduction, Action, Workspace Type */}
          <div className="p-6 space-y-6 text-left flex flex-col justify-between min-w-0">
            <div className="space-y-6">
              {/* Workspace Type Banner */}
              <div className="border border-[#242522] bg-[#141513]/10 p-3 rounded-[2px] space-y-1">
                <span 
                  className="block text-[8px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  WORKSPACE TYPE
                </span>
                <span 
                  className="block text-[11px] font-mono font-bold text-amber-500 uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  DEMO PREVIEW
                </span>
                <p className="text-[10px] font-mono text-[#5C5E58] tracking-wide leading-normal">
                  Guidance is available for the frontend mock demo workspace only.
                </p>
              </div>

              {/* Introduction */}
              <div className="space-y-3">
                <h4 
                  className="text-xl sm:text-2xl font-bold tracking-tight text-[#F3F1EA] leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  RUN THE COMPLETE<br />
                  INCIDENT STORY.
                </h4>
                <p 
                  className="text-xs sm:text-sm text-[#A8AAA3] leading-relaxed"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Use the canonical Northstar Commerce incident to demonstrate how SignalFold turns a customer signal into coordinated response, verified resolution, and an actionable Postmortem.
                </p>
              </div>
            </div>

            {/* Action block positioned at the bottom on desktop */}
            <div className="space-y-3 pt-6 border-t border-[#242522]/60 mt-auto">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 text-xs font-mono font-bold tracking-widest uppercase border border-[#242522] bg-[#141513]/30 text-[#5C5E58] rounded-[2px] cursor-not-allowed select-none"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <span>START GUIDED DEMO</span>
                  <span className="text-[8px] px-1.5 ml-2 py-0.5 bg-[#242522] text-[#5C5E58] rounded-[1px]">PENDING</span>
                </button>
              </div>
              <p 
                className="text-[10px] font-mono text-[#5C5E58] tracking-wide leading-normal"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                Guided execution will be enabled after the incident workflow frontend is complete.
              </p>
            </div>
          </div>

          {/* Right Area: Guided Sequence, Demo Data Summary, Readiness Block */}
          <div className="border-t [@media(min-width:1050px)]:border-t-0 [@media(min-width:1050px)]:border-l border-[#242522] bg-[#141513]/5 flex flex-col min-w-0">
            {/* Guided Sequence (Ordered list of five stages) */}
            <div className="p-6 border-b border-[#242522] min-w-0">
              <h4 
                className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase mb-4"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                GUIDED SEQUENCE
              </h4>
              <ol className="divide-y divide-[#242522]/60 border border-[#242522] rounded-[2px] overflow-hidden bg-[#0A0A0A]">
                {/* Stage 01 */}
                <li className="p-4 flex flex-col sm:flex-row gap-4 min-w-0">
                  <div className="shrink-0 flex items-center justify-center px-2.5 h-8 rounded-[2px] border border-[#242522] bg-[#141513]/30">
                    <span className="text-xs font-mono font-bold text-amber-500/80 whitespace-nowrap">01 / REPORT</span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5 className="text-xs font-mono font-bold tracking-wider text-[#F3F1EA] uppercase">
                        CREATE THE INCIDENT
                      </h5>
                      <span className="text-[8px] font-mono bg-[#141513]/80 px-1.5 py-0.5 border border-[#242522] text-[#A8AAA3] rounded-[1px]">
                        SF-2026-0042
                      </span>
                    </div>
                    <p className="text-xs text-[#A8AAA3] leading-normal">
                      Report checkout payment failures affecting the Payments API, including the documented 37 customer reports.
                    </p>
                    <div className="pt-1 flex flex-wrap gap-2 text-[9px] font-mono">
                      <span className="text-amber-500/90 bg-amber-500/5 px-1.5 py-0.5 border border-amber-500/15 rounded-[1px]">
                        QUICK CREATE / FRONTEND VALIDATION ONLY
                      </span>
                    </div>
                  </div>
                </li>

                {/* Stage 02 */}
                <li className="p-4 flex flex-col sm:flex-row gap-4 min-w-0">
                  <div className="shrink-0 flex items-center justify-center px-2.5 h-8 rounded-[2px] border border-[#242522] bg-[#141513]/30">
                    <span className="text-xs font-mono font-bold text-[#5C5E58] whitespace-nowrap">02 / TRIAGE</span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5 className="text-xs font-mono font-bold tracking-wider text-[#F3F1EA] uppercase">
                        REVIEW AI ASSISTANCE
                      </h5>
                    </div>
                    <p className="text-xs text-[#A8AAA3] leading-normal">
                      Generate a structured SEV1 suggestion and five recommended response tasks for explicit human review.
                    </p>
                    <div className="pt-1 flex flex-wrap gap-2 text-[9px] font-mono">
                      <span className="text-[#5C5E58] bg-[#141513]/30 px-1.5 py-0.5 border border-[#242522]/60 rounded-[1px]">
                        AI CONNECTION / NOT ACTIVE
                      </span>
                      <span className="text-amber-500/80 bg-amber-500/5 px-1.5 py-0.5 border border-amber-500/10 rounded-[1px]">
                        HUMAN CONFIRMATION REQUIRED
                      </span>
                    </div>
                  </div>
                </li>

                {/* Stage 03 */}
                <li className="p-4 flex flex-col sm:flex-row gap-4 min-w-0">
                  <div className="shrink-0 flex items-center justify-center px-2.5 h-8 rounded-[2px] border border-[#242522] bg-[#141513]/30">
                    <span className="text-xs font-mono font-bold text-[#5C5E58] whitespace-nowrap">03 / COORDINATE</span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5 className="text-xs font-mono font-bold tracking-wider text-[#F3F1EA] uppercase">
                        ASSIGN AND EXECUTE RESPONSE WORK
                      </h5>
                    </div>
                    <p className="text-xs text-[#A8AAA3] leading-normal">
                      Open a second responder context, claim one response task, complete it, and verify that the primary incident view receives the update.
                    </p>
                    <div className="pt-1 flex flex-wrap gap-2 text-[9px] font-mono">
                      <span className="text-[#5C5E58] bg-[#141513]/30 px-1.5 py-0.5 border border-[#242522]/60 rounded-[1px]">
                        REALTIME / NOT CONNECTED
                      </span>
                    </div>
                  </div>
                </li>

                {/* Stage 04 */}
                <li className="p-4 flex flex-col sm:flex-row gap-4 min-w-0">
                  <div className="shrink-0 flex items-center justify-center px-2.5 h-8 rounded-[2px] border border-[#242522] bg-[#141513]/30">
                    <span className="text-xs font-mono font-bold text-[#5C5E58] whitespace-nowrap">04 / RESOLVE</span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5 className="text-xs font-mono font-bold tracking-wider text-[#F3F1EA] uppercase">
                        VERIFY RECOVERY
                      </h5>
                    </div>
                    <p className="text-xs text-[#A8AAA3] leading-normal">
                      Move the incident through the controlled response states, confirm service recovery, review unfinished critical tasks, and record the resolution.
                    </p>
                    <div className="pt-1 flex flex-wrap gap-2 text-[9px] font-mono">
                      <span className="text-amber-500/80 bg-amber-500/5 px-1.5 py-0.5 border border-amber-500/10 rounded-[1px]">
                        STATE AUTHORITY / BACKEND REQUIRED
                      </span>
                    </div>
                  </div>
                </li>

                {/* Stage 05 */}
                <li className="p-4 flex flex-col sm:flex-row gap-4 min-w-0">
                  <div className="shrink-0 flex items-center justify-center px-2.5 h-8 rounded-[2px] border border-[#242522] bg-[#141513]/30">
                    <span className="text-xs font-mono font-bold text-[#5C5E58] whitespace-nowrap">05 / LEARN</span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5 className="text-xs font-mono font-bold tracking-wider text-[#F3F1EA] uppercase">
                        GENERATE THE POSTMORTEM
                      </h5>
                    </div>
                    <p className="text-xs text-[#A8AAA3] leading-normal">
                      Create a structured Postmortem draft from the incident timeline, tasks, impact, and verified resolution, then keep approval under human control.
                    </p>
                    <div className="pt-1 flex flex-wrap gap-2 text-[9px] font-mono">
                      <span className="text-[#5C5E58] bg-[#141513]/30 px-1.5 py-0.5 border border-[#242522]/60 rounded-[1px]">
                        POSTMORTEM GENERATION / NOT CONNECTED
                      </span>
                      <span className="text-amber-500/80 bg-amber-500/5 px-1.5 py-0.5 border border-amber-500/10 rounded-[1px]">
                        HUMAN APPROVAL REQUIRED
                      </span>
                    </div>
                  </div>
                </li>
              </ol>
            </div>

            {/* Asymmetric internal layout split: Data Summary & Readiness Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#242522]">
              {/* Demo Data Summary */}
              <div className="p-6 space-y-4 text-left min-w-0">
                <h4 
                  className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  DEMO DATA SUMMARY
                </h4>
                <div 
                  className="space-y-2 text-[11px] leading-tight" 
                  style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                >
                  <div className="flex justify-between border-b border-[#242522]/40 pb-1 gap-2">
                    <span className="text-[#5C5E58] font-bold uppercase tracking-wider">ORGANIZATION</span>
                    <span className="text-[#A8AAA3] font-bold text-right truncate">NORTHSTAR COMMERCE</span>
                  </div>
                  <div className="flex justify-between border-b border-[#242522]/40 pb-1 gap-2">
                    <span className="text-[#5C5E58] font-bold uppercase tracking-wider">INCIDENT</span>
                    <span className="text-[#A8AAA3] font-bold text-right">SF-2026-0042</span>
                  </div>
                  <div className="flex justify-between border-b border-[#242522]/40 pb-1 gap-2">
                    <span className="text-[#5C5E58] font-bold uppercase tracking-wider">SERVICE</span>
                    <span className="text-[#A8AAA3] font-bold text-right truncate">PAYMENTS API</span>
                  </div>
                  <div className="flex justify-between border-b border-[#242522]/40 pb-1 gap-2">
                    <span className="text-[#5C5E58] font-bold uppercase tracking-wider">CUSTOMER SIGNAL</span>
                    <span className="text-[#A8AAA3] font-bold text-right">37 REPORTS / 12 MINUTES</span>
                  </div>
                  <div className="flex justify-between border-b border-[#242522]/40 pb-1 gap-2">
                    <span className="text-[#5C5E58] font-bold uppercase tracking-wider">AI EXPECTATION</span>
                    <span className="text-[#A8AAA3] font-bold text-right">SEV1 SUGGESTION</span>
                  </div>
                  <div className="flex justify-between border-b border-[#242522]/40 pb-1 gap-2">
                    <span className="text-[#5C5E58] font-bold uppercase tracking-wider">RESPONSE TASKS</span>
                    <span className="text-[#A8AAA3] font-bold text-right">5 RECOMMENDED</span>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="block text-[9px] text-[#5C5E58] font-bold uppercase tracking-wider">WORKFLOW</span>
                    <div className="text-[10px] text-[#A8AAA3] font-mono leading-relaxed bg-[#0A0A0A] p-2 border border-[#242522] rounded-[1px]">
                      REPORT &rarr; TRIAGE &rarr; COORDINATE &rarr; RESOLVE &rarr; LEARN
                    </div>
                  </div>
                </div>
              </div>

              {/* Readiness Block */}
              <div className="p-6 space-y-4 text-left min-w-0">
                <div>
                  <h4 
                    className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    READINESS STATE
                  </h4>
                  <p className="text-[9px] font-mono text-[#5C5E58] tracking-widest mt-0.5 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    VISUAL REVIEW ONLY
                  </p>
                </div>
                
                <div className="space-y-2 font-mono text-[10px]" style={{ fontFamily: 'var(--font-technical)' }}>
                  <div className="flex justify-between border-b border-[#242522]/40 pb-1 gap-2">
                    <span className="text-[#5C5E58] font-bold uppercase tracking-wider">DASHBOARD</span>
                    <span className="text-amber-500/80 font-bold">READY FOR FRONTEND REVIEW</span>
                  </div>
                  <div className="flex justify-between border-b border-[#242522]/40 pb-1 gap-2">
                    <span className="text-[#5C5E58] font-bold uppercase tracking-wider">INCIDENT CREATION</span>
                    <span className="text-[#A8AAA3] font-bold">VALIDATION PREVIEW ONLY</span>
                  </div>
                  <div className="flex justify-between border-b border-[#242522]/40 pb-1 gap-2">
                    <span className="text-[#5C5E58] font-bold uppercase tracking-wider">AI TRIAGE</span>
                    <span className="text-[#5C5E58] font-bold">NOT CONNECTED</span>
                  </div>
                  <div className="flex justify-between border-b border-[#242522]/40 pb-1 gap-2">
                    <span className="text-[#5C5E58] font-bold uppercase tracking-wider">REALTIME</span>
                    <span className="text-[#5C5E58] font-bold">NOT CONNECTED</span>
                  </div>
                  <div className="flex justify-between border-b border-[#242522]/40 pb-1 gap-2">
                    <span className="text-[#5C5E58] font-bold uppercase tracking-wider">RESOLUTION</span>
                    <span className="text-[#5C5E58] font-bold">NOT CONNECTED</span>
                  </div>
                  <div className="flex justify-between border-b border-[#242522]/40 pb-1 gap-2">
                    <span className="text-[#5C5E58] font-bold uppercase tracking-wider">POSTMORTEM</span>
                    <span className="text-[#5C5E58] font-bold">NOT CONNECTED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
