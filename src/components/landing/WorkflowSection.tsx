import React, { useState, useEffect, useRef } from 'react';

export interface WorkflowStep {
  id: string;
  num: string;
  heading: string;
  description: string;
  outputLabel: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'report',
    num: '01 / REPORT',
    heading: 'CAPTURE THE SIGNAL.',
    description:
      'Turn a raw report into a structured incident without slowing the person who discovered it.',
    outputLabel: 'OUTPUT / INCIDENT CREATED',
  },
  {
    id: 'triage',
    num: '02 / TRIAGE',
    heading: 'MAKE THE IMPACT CLEAR.',
    description:
      'DeepSeek proposes severity, impact, risk flags, and immediate response tasks for human review.',
    outputLabel: 'OUTPUT / RESPONSE PLAN',
  },
  {
    id: 'coordinate',
    num: '03 / COORDINATE',
    heading: 'ALIGN THE RESPONSE.',
    description:
      'Assign ownership, claim tasks, and keep every responder synchronized through realtime activity.',
    outputLabel: 'OUTPUT / SHARED COMMAND',
  },
  {
    id: 'resolve',
    num: '04 / RESOLVE',
    heading: 'VERIFY THE RECOVERY.',
    description:
      'Track recovery, document remaining risk, and close the incident through controlled state transitions.',
    outputLabel: 'OUTPUT / VERIFIED RESOLUTION',
  },
  {
    id: 'learn',
    num: '05 / LEARN',
    heading: 'TURN RESPONSE INTO MEMORY.',
    description:
      'Transform the incident timeline into an editable and human-approved postmortem.',
    outputLabel: 'OUTPUT / ACTIONABLE POSTMORTEM',
  },
];

export interface WorkflowSectionProps {
  className?: string;
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({ className = '' }) => {
  const [activeStepId, setActiveStepId] = useState<string>('report');
  const stepRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Setup IntersectionObserver for active step detection during scroll
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepId = entry.target.getAttribute('data-step-id');
            if (stepId) {
              setActiveStepId(stepId);
            }
          }
        });
      },
      {
        rootMargin: '-25% 0px -40% 0px',
        threshold: 0.3,
      }
    );

    stepRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="workflow"
      className={`relative w-full bg-[#F3F1EA] text-[#0A0A0A] py-16 sm:py-20 lg:py-24 border-b border-[#D8D4C8] scroll-mt-20 selection:bg-[#0A0A0A] selection:text-[#F3F1EA] ${className}`}
      aria-label="SignalFold Response Workflow"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive Grid: 1 Column on <900px (Mobile & Tablet), 2 Columns on 900px+ */}
        <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-10 min-[900px]:gap-16 items-start">
          {/* Left Column: Intro Header Content (Sticky on 900px+) */}
          <div className="min-[900px]:col-span-5 space-y-6 min-[900px]:sticky min-[900px]:top-28 w-full max-w-[42rem] min-[900px]:max-w-none">
            {/* Technical Label */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#E8E5DC] border border-[#D8D4C8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]" aria-hidden="true" />
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#0A0A0A]">
                02 / RESPONSE WORKFLOW
              </span>
            </div>

            {/* Main Section Heading */}
            <h2 className="font-['Sora'] text-3xl sm:text-4xl min-[900px]:text-5xl font-bold tracking-tight text-[#0A0A0A] leading-[1.1] text-balance">
              FROM FIRST SIGNAL TO VERIFIED RESOLUTION.
            </h2>

            {/* Supporting Copy - Readable width max-w-[42rem] */}
            <p className="font-sans text-base sm:text-lg text-[#5C5E58] leading-relaxed max-w-[42rem] w-full">
              SignalFold gives every incident a clear path—from an unstructured report to coordinated response and an actionable postmortem.
            </p>

            {/* Technical Status Rail */}
            <div className="pt-6 border-t border-[#D8D4C8] grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#5C5E58]">
              <div className="border-b sm:border-b-0 sm:border-r border-[#D8D4C8] pb-2.5 sm:pb-0 pr-2">
                <span className="text-[#0A0A0A] block">FIVE STAGES</span>
                <span className="text-[#8B8D85] text-[9px]">END-TO-END</span>
              </div>
              <div className="border-b sm:border-b-0 sm:border-r border-[#D8D4C8] pb-2.5 sm:pb-0 px-0 sm:px-2">
                <span className="text-[#0A0A0A] block">HUMAN CONTROLLED</span>
                <span className="text-[#8B8D85] text-[9px]">APPROVE / EDIT</span>
              </div>
              <div className="pl-0 sm:pl-2">
                <span className="text-[#0A0A0A] block">AI ASSISTED</span>
                <span className="text-[#8B8D85] text-[9px]">DEEPSEEK V3</span>
              </div>
            </div>
          </div>

          {/* Right Column: Workflow Steps Stacked on Vertical Rail */}
          <div className="min-[900px]:col-span-7 relative w-full">
            {/* Top Rail Signal Marker */}
            <div className="flex items-center gap-2 mb-6 font-mono text-[10px] font-bold tracking-widest text-[#5C5E58] uppercase pl-6 sm:pl-8">
              <span className="w-2 h-2 rounded-full bg-[#0A0A0A] shrink-0" aria-hidden="true" />
              <span>SIGNAL IN // INCIDENT DISCOVERED</span>
            </div>

            {/* Vertical Rail Line */}
            <div
              className="absolute left-[11px] sm:left-[15px] top-10 bottom-12 w-[2px] bg-[#D8D4C8] pointer-events-none"
              aria-hidden="true"
            />

            {/* Ordered List of Steps */}
            <ol className="space-y-8 sm:space-y-10 relative z-10 list-none p-0 m-0">
              {WORKFLOW_STEPS.map((step) => {
                const isActive = activeStepId === step.id;

                return (
                  <li
                    key={step.id}
                    ref={(el) => {
                      if (el) stepRefs.current.set(step.id, el);
                    }}
                    data-step-id={step.id}
                    aria-current={isActive ? 'step' : undefined}
                    className={`relative pl-8 sm:pl-12 transition-all duration-200 group ${
                      isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* Rail Node Indicator */}
                    <div
                      className={`absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 ${
                        isActive
                          ? 'bg-[#0A0A0A] border-[#0A0A0A] text-[#D6FF3F] scale-110'
                          : 'bg-[#F3F1EA] border-[#D8D4C8] text-[#5C5E58] group-hover:border-[#0A0A0A]'
                      }`}
                      aria-hidden="true"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    </div>

                    {/* Step Content Container */}
                    <div
                      className={`p-5 sm:p-6 rounded-[2px] border transition-all duration-200 ${
                        isActive
                          ? 'bg-[#E8E5DC] border-[#0A0A0A] shadow-sm'
                          : 'bg-[#F3F1EA] border-[#D8D4C8] hover:border-[#A8AAA3]'
                      }`}
                    >
                      {/* Step Stage Number & Badge */}
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="font-mono text-xs font-bold tracking-widest text-[#5C5E58] uppercase">
                          {step.num}
                        </span>

                        {isActive && (
                          <span className="font-mono text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-[2px] bg-[#0A0A0A] text-[#D6FF3F]">
                            ACTIVE STAGE
                          </span>
                        )}
                      </div>

                      {/* Step Stage Heading */}
                      <h3 className="font-['Sora'] text-xl sm:text-2xl font-bold tracking-tight text-[#0A0A0A] mb-2">
                        {step.heading}
                      </h3>

                      {/* Step Stage Description */}
                      <p className="font-sans text-sm sm:text-base text-[#242522] leading-relaxed mb-4">
                        {step.description}
                      </p>

                      {/* Output Label Tag */}
                      <div className="pt-3 border-t border-[#D8D4C8] flex items-center gap-2 font-mono text-[10px] font-bold tracking-wider text-[#0A0A0A]">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-[#28A66A]' : 'bg-[#8B8D85]'
                          }`}
                          aria-hidden="true"
                        />
                        <span>{step.outputLabel}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* Bottom Rail Action Marker */}
            <div className="flex items-center gap-2 mt-8 font-mono text-[10px] font-bold tracking-widest text-[#0A0A0A] uppercase pl-6 sm:pl-8">
              <span className="w-2 h-2 rounded-full bg-[#28A66A] shrink-0" aria-hidden="true" />
              <span>ACTION OUT // SYSTEM STABILIZED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
