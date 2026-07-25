import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFeedbackState } from '@/context/FeedbackStateContext';
import { RouteFeedbackState } from '@/components/feedback/RouteFeedbackState';
import { 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  Lock,
  X,
  Check
} from 'lucide-react';
import { useAiOperation } from '@/context/AiOperationContext';
import { AiOperationFeedback } from '@/components/feedback/AiOperationFeedback';

/**
 * SignalFold — Postmortem Access Foundation Page.
 * Implements Phase 01 read-only document navigation and inspection workspace.
 */
export function PostmortemFoundationPage() {
  const { postmortem } = useAiOperation();
  const navigate = useNavigate();

  const { getFeedbackState } = useFeedbackState();
  const feedback = getFeedbackState('postmortem');

  // State for active canonical section
  const [activeSectionIndex, setActiveSectionIndex] = React.useState(0);

  if (feedback && feedback.isActive) {
    return (
      <RouteFeedbackState
        kind={feedback.kind}
        scope="postmortem"
        onRetry={feedback.retry}
      />
    );
  }
  
  // State for mobile selector open/closed
  const [isMobileSelectorOpen, setIsMobileSelectorOpen] = React.useState(false);

  // State for metadata drawer open/closed
  const [isMetadataOpen, setIsMetadataOpen] = React.useState(false);

  // State for readiness drawer open/closed
  const [isReadinessOpen, setIsReadinessOpen] = React.useState(false);

  // State for readiness validation run status
  const [hasValidated, setHasValidated] = React.useState(false);

  // State for validation live region announcement
  const [validationAnnouncement, setValidationAnnouncement] = React.useState('');

  // State for aria announcement of section changes
  const [announcement, setAnnouncement] = React.useState('');

  // Phase 03 Regeneration local states
  const [isConfirmationVisible, setIsConfirmationVisible] = React.useState(false);
  const [ackNewDraft, setAckNewDraft] = React.useState(false);
  const [ackPreservePrior, setAckPreservePrior] = React.useState(false);
  const [ackNoCarry, setAckNoCarry] = React.useState(false);
  const [hasValidatedVersionPlan, setHasValidatedVersionPlan] = React.useState(false);
  const [versionPlanState, setVersionPlanState] = React.useState<'idle' | 'validated' | 'changed'>('idle');
  const [phase3Announcement, setPhase3Announcement] = React.useState('');

  // Refs for accessibility / focus trap
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Refs for readiness drawer focus trap and return focus
  const readinessDrawerRef = React.useRef<HTMLDivElement>(null);
  const readinessCloseBtnRef = React.useRef<HTMLButtonElement>(null);
  const readinessTriggerRef = React.useRef<HTMLButtonElement>(null);

  // The 11 canonical section names specified in the PRD
  const canonicalSections = [
    "01 / EXECUTIVE SUMMARY",
    "02 / CUSTOMER & BUSINESS IMPACT",
    "03 / DETECTION",
    "04 / TIMELINE",
    "05 / ROOT CAUSE",
    "06 / CONTRIBUTING FACTORS",
    "07 / RESOLUTION",
    "08 / WHAT WENT WELL",
    "09 / WHAT WENT POORLY",
    "10 / PREVENTIVE ACTIONS",
    "11 / OWNERS & DUE DATES"
  ];

  // The 11 neutral schema purpose explanations
  const sectionPurposes = [
    "Concise overview of the incident, impact, response, and outcome.",
    "Approved description of customer harm, operational disruption, and business consequences.",
    "How the incident was first detected, reported, or identified.",
    "Curated sequence of important incident and response events.",
    "Approved explanation of the primary technical or operational cause.",
    "Conditions that increased likelihood, impact, or recovery time.",
    "Actions that restored service and verified recovery.",
    "Response practices, tools, or decisions that were effective.",
    "Response gaps, delays, confusion, or ineffective processes.",
    "Concrete work intended to reduce recurrence or future impact.",
    "Accountable owners and target dates for approved follow-up actions."
  ];

  // Update ARIA announcement when active section changes
  React.useEffect(() => {
    setAnnouncement(`Active section is now ${canonicalSections[activeSectionIndex]}`);
  }, [activeSectionIndex]);

  // Focus trap, Escape close, and scroll lock for metadata drawer
  React.useEffect(() => {
    if (isMetadataOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsMetadataOpen(false);
        }
      };
      window.addEventListener('keydown', handleEscape);
      return () => {
        window.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMetadataOpen]);

  // Focus trap, Escape close, and scroll lock for readiness drawer
  React.useEffect(() => {
    if (isReadinessOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        readinessCloseBtnRef.current?.focus();
      }, 50);

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCloseReadiness();
        }
      };
      window.addEventListener('keydown', handleEscape);
      return () => {
        window.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isReadinessOpen]);

  const handleCloseReadiness = () => {
    setIsReadinessOpen(false);
    setHasValidated(false);
    setValidationAnnouncement('');
    // Discard Phase 03 acknowledgements and states
    setIsConfirmationVisible(false);
    setAckNewDraft(false);
    setAckPreservePrior(false);
    setAckNoCarry(false);
    setHasValidatedVersionPlan(false);
    setVersionPlanState('idle');
    setPhase3Announcement('');
    setTimeout(() => {
      readinessTriggerRef.current?.focus();
    }, 50);
  };

  const handleResetConfirmation = () => {
    setAckNewDraft(false);
    setAckPreservePrior(false);
    setAckNoCarry(false);
    setHasValidatedVersionPlan(false);
    setVersionPlanState('idle');
    setPhase3Announcement('Confirmation preview state has been reset. All acknowledgements unchecked.');
  };

  const handleValidateVersionPlan = () => {
    setHasValidatedVersionPlan(true);
    setVersionPlanState('validated');
    setPhase3Announcement('Version plan validated successfully. Local confirmation structure is valid, snapshot and authority are incomplete.');
  };

  const handleToggleAckNewDraft = () => {
    const nextVal = !ackNewDraft;
    setAckNewDraft(nextVal);
    const completed = nextVal && ackPreservePrior && ackNoCarry;
    setPhase3Announcement(`New draft creation acknowledgement is now ${nextVal ? 'checked' : 'unchecked'}. Confirmation state: ${completed ? 'LOCAL ACKNOWLEDGEMENTS COMPLETE' : 'INCOMPLETE'}.`);
    if (hasValidatedVersionPlan) {
      setVersionPlanState('changed');
    }
  };

  const handleToggleAckPreservePrior = () => {
    const nextVal = !ackPreservePrior;
    setAckPreservePrior(nextVal);
    const completed = ackNewDraft && nextVal && ackNoCarry;
    setPhase3Announcement(`Prior version preservation acknowledgement is now ${nextVal ? 'checked' : 'unchecked'}. Confirmation state: ${completed ? 'LOCAL ACKNOWLEDGEMENTS COMPLETE' : 'INCOMPLETE'}.`);
    if (hasValidatedVersionPlan) {
      setVersionPlanState('changed');
    }
  };

  const handleToggleAckNoCarry = () => {
    const nextVal = !ackNoCarry;
    setAckNoCarry(nextVal);
    const completed = ackNewDraft && ackPreservePrior && nextVal;
    setPhase3Announcement(`Approval reset policy acknowledgement is now ${nextVal ? 'checked' : 'unchecked'}. Confirmation state: ${completed ? 'LOCAL ACKNOWLEDGEMENTS COMPLETE' : 'INCOMPLETE'}.`);
    if (hasValidatedVersionPlan) {
      setVersionPlanState('changed');
    }
  };

  const handleValidateReadiness = () => {
    setHasValidated(true);
    setValidationAnnouncement('Readiness validation completed. One positive state and three incomplete warnings are now visible.');
  };

  // Handle keyboard navigation inside desktop section list
  const handleIndexKeyDown = (e: React.KeyboardEvent, index: number) => {
    let targetIndex = -1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = (index + 1) % 11;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      targetIndex = (index - 1 + 11) % 11;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = 10;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveSectionIndex(index);
      return;
    }

    if (targetIndex !== -1) {
      setActiveSectionIndex(targetIndex);
      const nextBtn = document.getElementById(`section-btn-${targetIndex}`);
      if (nextBtn) {
        nextBtn.focus();
      }
    }
  };

  // Focus trap tab logic
  const handleDrawerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableEls = drawerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex="0"]'
      );
      if (!focusableEls || focusableEls.length === 0) return;
      const firstEl = focusableEls[0] as HTMLElement;
      const lastEl = focusableEls[focusableEls.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          lastEl.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastEl) {
          firstEl.focus();
          e.preventDefault();
        }
      }
    }
  };

  const handleReadinessDrawerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableEls = readinessDrawerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex="0"]'
      );
      if (!focusableEls || focusableEls.length === 0) return;
      const firstEl = focusableEls[0] as HTMLElement;
      const lastEl = focusableEls[focusableEls.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          lastEl.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastEl) {
          firstEl.focus();
          e.preventDefault();
        }
      }
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsMetadataOpen(false);
    }
  };

  const handleReadinessOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseReadiness();
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-left pb-16">
      
      {/* Hidden live region for accessibility announcements */}
      <div className="sr-only" aria-live="polite" role="status">
        {announcement}
      </div>

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
        <Link to="/app/incidents/resolved-seed" className="hover:text-[#D6FF3F] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#D6FF3F]">
          RESOLVED SEED
        </Link>
        <span aria-hidden="true" className="text-[#242522]">/</span>
        <span className="text-[#A8AAA3] select-none">POSTMORTEM</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pb-6 border-b border-[#242522]">
        <div className="space-y-3 flex-1 min-w-0">
          <div 
            className="text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            APPROVED RECORD ACCESS / CONTENT FOUNDATION
          </div>
          
          <h2 
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#F3F1EA] uppercase leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            POSTMORTEM
          </h2>

          {/* Header states */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 font-mono text-[10px]" style={{ fontFamily: 'var(--font-technical)' }}>
            <div className="p-2 bg-[#141513]/40 border border-[#242522] rounded-[1px]">
              <span className="block text-[7px] text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">INCIDENT</span>
              <span className="block text-[#A8AAA3] font-bold uppercase truncate">RESOLVED SEED RECORD</span>
            </div>
            
            <div className="p-2 bg-[#141513]/40 border border-[#242522] rounded-[1px]">
              <span className="block text-[7px] text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">INCIDENT STATUS</span>
              <span className="block text-emerald-400 font-bold uppercase">RESOLVED</span>
            </div>

            <div className="p-2 bg-[#141513]/40 border border-[#242522] rounded-[1px]">
              <span className="block text-[7px] text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">POSTMORTEM STATUS</span>
              <span className="block text-emerald-400 font-bold uppercase">APPROVED</span>
            </div>

            <div className="p-2 bg-[#141513]/40 border border-[#242522] rounded-[1px]">
              <span className="block text-[7px] text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">CONTENT STATE</span>
              <span className="block text-[#5C5E58] uppercase">NOT LOADED</span>
            </div>

            <div className="p-2 bg-[#141513]/40 border border-[#242522] rounded-[1px] col-span-2 sm:col-span-1">
              <span className="block text-[7px] text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">PERSISTENCE</span>
              <span className="block text-[#5C5E58] uppercase">NOT CONNECTED</span>
            </div>
          </div>
        </div>

        {/* Enabled Actions Group */}
        <div className="flex flex-wrap items-center gap-2 self-start">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => {
              setIsMetadataOpen(true);
              setIsReadinessOpen(false);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#242522] hover:border-[#D6FF3F]/30 bg-[#141513]/20 hover:bg-[#D6FF3F]/5 text-[#A8AAA3] hover:text-[#D6FF3F] text-xs font-mono font-bold tracking-wider uppercase rounded-[1px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F] cursor-pointer"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            <FileText className="w-4 h-4 shrink-0" />
            VIEW DOCUMENT METADATA
          </button>

          <Link 
            to="/app/incidents/resolved-seed"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#242522] hover:border-[#D6FF3F]/30 bg-[#141513]/20 hover:bg-[#D6FF3F]/5 text-[#A8AAA3] hover:text-[#D6FF3F] text-xs font-mono font-bold tracking-wider uppercase rounded-[1px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F]"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            BACK TO RESOLVED RECORD
          </Link>
        </div>
      </div>

      {/* Spacing Layout: Record Summary & Warnings above Workspace */}
      <div className="space-y-6">
        
        {/* POSTMORTEM RECORD SUMMARY */}
        <section className="border border-[#242522] bg-[#141513]/10 rounded-[2px]" aria-label="Postmortem Record Details">
          <div className="border-b border-[#242522] bg-[#0F100D] px-4 py-3">
            <h3 className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
              POSTMORTEM RECORD SUMMARY
            </h3>
          </div>

          <div className="p-4 sm:p-5">
            <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 font-mono text-[11px]" style={{ fontFamily: 'var(--font-technical)' }}>
              
              <div className="border-b border-[#242522]/30 pb-2">
                <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">STATE</dt>
                <dd className="text-emerald-400 font-bold uppercase">APPROVED</dd>
              </div>

              <div className="border-b border-[#242522]/30 pb-2">
                <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">APPROVAL SOURCE</dt>
                <dd className="text-[#5C5E58] uppercase">NOT LOADED</dd>
              </div>

              <div className="border-b border-[#242522]/30 pb-2">
                <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">APPROVER</dt>
                <dd className="text-[#5C5E58] uppercase">NOT AVAILABLE</dd>
              </div>

              <div className="border-b border-[#242522]/30 pb-2">
                <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">APPROVED AT</dt>
                <dd className="text-[#5C5E58] uppercase">NOT AVAILABLE</dd>
              </div>

              <div className="border-b border-[#242522]/30 pb-2">
                <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">VERSION</dt>
                <dd className="text-[#5C5E58] uppercase">NOT AVAILABLE</dd>
              </div>

              <div className="border-b border-[#242522]/30 pb-2">
                <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">AI GENERATION RECORD</dt>
                <dd className="text-[#5C5E58] uppercase">NOT AVAILABLE</dd>
              </div>

              <div className="border-b border-[#242522]/30 pb-2">
                <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">HUMAN EDIT RECORD</dt>
                <dd className="text-[#5C5E58] uppercase">NOT AVAILABLE</dd>
              </div>

              <div className="border-b border-[#242522]/30 pb-2">
                <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">CONTENT BODY</dt>
                <dd className="text-[#5C5E58] uppercase">NOT LOADED</dd>
              </div>

            </dl>
          </div>
        </section>

        {/* Notice: APPROVED STATE AVAILABLE / DOCUMENT CONTENT UNAVAILABLE */}
        <section className="border border-amber-500/20 bg-amber-500/[0.02] p-4 sm:p-5 rounded-[2px] space-y-3" aria-label="Approved state content unavailable warning">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <h3 className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
              APPROVED STATE AVAILABLE / DOCUMENT CONTENT UNAVAILABLE
            </h3>
          </div>
          
          <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
            The canonical demo specification confirms an approved Postmortem exists, but it does not provide its document body, approver identity, timestamps, version history, or generation record.
          </p>
        </section>

      </div>

      {/* Responsive Workspace Grid: Stacks below 1024px (around 1000px) */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_320px] gap-6 sm:gap-8 items-start">
        
        {/* Left Rail: CANONICAL SECTION INDEX (Desktop only) */}
        <nav 
          aria-label="Canonical Postmortem Sections" 
          className="hidden lg:block border border-[#242522] bg-[#141513]/10 rounded-[2px]"
        >
          <div className="border-b border-[#242522] bg-[#0F100D] px-4 py-3 flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold tracking-wider text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
              SECTION INDEX
            </h3>
            <span className="text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
              11 SECTIONS
            </span>
          </div>

          <div className="p-3 space-y-2">
            {canonicalSections.map((sectionName, i) => (
              <button
                key={sectionName}
                id={`section-btn-${i}`}
                type="button"
                onClick={() => setActiveSectionIndex(i)}
                onKeyDown={(e) => handleIndexKeyDown(e, i)}
                className={`w-full text-left p-2.5 border rounded-[1px] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F] cursor-pointer ${
                  activeSectionIndex === i
                    ? 'border-[#D6FF3F] bg-[#D6FF3F]/10 text-[#D6FF3F] font-bold'
                    : 'border-[#242522]/60 bg-[#141513]/10 hover:bg-[#D6FF3F]/5 text-[#A8AAA3]'
                }`}
                aria-current={activeSectionIndex === i ? 'true' : undefined}
              >
                <div className="flex flex-col gap-1 text-[10px] font-mono leading-tight" style={{ fontFamily: 'var(--font-technical)' }}>
                  <span className="truncate">{sectionName}</span>
                  <div className="flex items-center justify-between text-[8px] opacity-70">
                    <span className="text-[#5C5E58] uppercase font-bold">CONTENT</span>
                    <span className="text-[#5C5E58] uppercase font-bold">NOT LOADED</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Workspace: ACTIVE SECTION INSPECTION (With Mobile Selector at the top) */}
        <div className="space-y-6">
          
          {/* Mobile Selector / Accordion (Hidden on desktop, visible below 1024px) */}
          <div className="block lg:hidden space-y-2" aria-label="Mobile Postmortem Section Navigation">
            <label id="mobile-selector-label" className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase">
              POSTMORTEM SECTION
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMobileSelectorOpen(!isMobileSelectorOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border border-[#242522] bg-[#141513] text-[#F3F1EA] text-xs font-mono font-bold rounded-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F] cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={isMobileSelectorOpen}
                aria-labelledby="mobile-selector-label"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                <span>{canonicalSections[activeSectionIndex]}</span>
                <span className="text-[#D6FF3F] text-[10px] ml-2">▼</span>
              </button>

              {isMobileSelectorOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setIsMobileSelectorOpen(false)} 
                  />
                  <ul 
                    className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto border border-[#242522] bg-[#0A0A0A] rounded-[1px] shadow-2xl z-40 divide-y divide-[#242522]/40"
                    role="listbox"
                    aria-labelledby="mobile-selector-label"
                  >
                    {canonicalSections.map((sectionName, i) => (
                      <li key={sectionName} role="option" aria-selected={activeSectionIndex === i}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSectionIndex(i);
                            setIsMobileSelectorOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-xs font-mono transition-colors flex flex-col gap-1 cursor-pointer ${
                            activeSectionIndex === i 
                              ? 'bg-[#D6FF3F]/10 text-[#D6FF3F] font-bold' 
                              : 'hover:bg-[#141513] text-[#A8AAA3]'
                          }`}
                          style={{ fontFamily: 'var(--font-technical)' }}
                        >
                          <span>{sectionName}</span>
                          <div className="flex items-center justify-between text-[9px] text-[#5C5E58] font-bold">
                            <span>CONTENT STATE</span>
                            <span>NOT LOADED</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Active Inspection Box */}
          <section className="border border-[#242522] bg-[#141513]/10 rounded-[2px]" aria-label="Active Section Inspection Panel">
            <div className="border-b border-[#242522] bg-[#0F100D] px-4 py-3 flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                ACTIVE SECTION INSPECTION
              </h3>
              <span className="text-[9px] font-mono text-[#D6FF3F] tracking-widest font-bold" style={{ fontFamily: 'var(--font-technical)' }}>
                {String(activeSectionIndex + 1).padStart(2, '0')} OF 11
              </span>
            </div>

            <div className="p-4 sm:p-5 space-y-6">
              
              {/* Technical Attributes Grid */}
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-[10px]" style={{ fontFamily: 'var(--font-technical)' }}>
                <div className="p-2.5 bg-[#0A0A0A]/40 border border-[#242522] rounded-[1px] col-span-2 sm:col-span-1">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">SECTION NUMBER</dt>
                  <dd className="text-[#F3F1EA] font-bold">{String(activeSectionIndex + 1).padStart(2, '0')}</dd>
                </div>

                <div className="p-2.5 bg-[#0A0A0A]/40 border border-[#242522] rounded-[1px] col-span-2">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">SECTION</dt>
                  <dd className="text-[#F3F1EA] font-bold truncate">{canonicalSections[activeSectionIndex]}</dd>
                </div>

                <div className="p-2.5 bg-[#0A0A0A]/40 border border-[#242522] rounded-[1px]">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">CONTENT STATE</dt>
                  <dd className="text-[#5C5E58] font-bold uppercase">NOT LOADED</dd>
                </div>

                <div className="p-2.5 bg-[#0A0A0A]/40 border border-[#242522] rounded-[1px]">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">DOCUMENT STATE</dt>
                  <dd className="text-emerald-400 font-bold uppercase">APPROVED</dd>
                </div>

                <div className="p-2.5 bg-[#0A0A0A]/40 border border-[#242522] rounded-[1px]">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">INSPECTION MODE</dt>
                  <dd className="text-emerald-400 font-bold uppercase">READ ONLY</dd>
                </div>

                <div className="p-2.5 bg-[#0A0A0A]/40 border border-[#242522] rounded-[1px] col-span-2 sm:col-span-1">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">SOURCE RECORD</dt>
                  <dd className="text-[#5C5E58] uppercase font-bold">NOT CONNECTED</dd>
                </div>

                <div className="p-2.5 bg-[#0A0A0A]/40 border border-[#242522] rounded-[1px] col-span-2">
                  <dt className="text-[#5C5E58] font-bold uppercase tracking-wider mb-0.5">AUTHORITATIVE CONTENT</dt>
                  <dd className="text-[#5C5E58] uppercase font-bold">NOT AVAILABLE</dd>
                </div>
              </dl>

              {/* Document Content Display (Explicitly read-only and empty) */}
              <div className="border border-[#242522] bg-[#0A0A0A]/60 rounded-[1px] p-5 space-y-4">
                <div className="text-[10px] font-mono font-bold text-[#5C5E58] tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  DOCUMENT CONTENT
                </div>
                
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="text-xs font-mono font-bold text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                    NO AUTHORITATIVE SECTION CONTENT LOADED
                  </div>
                  <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed max-w-[480px]">
                    The approved seed confirms this Postmortem section exists, but its authoritative document content has not been provided.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#242522]/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[9px] font-mono text-[#5C5E58]" style={{ fontFamily: 'var(--font-technical)' }}>
                  <span className="font-bold text-amber-500/95 uppercase tracking-wider">
                    SIGNALFOLD DOES NOT GENERATE PLACEHOLDER INCIDENT HISTORY.
                  </span>
                  <span className="uppercase tracking-wider">
                    SECTION ID // {String(activeSectionIndex + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Informational Section Schema Purpose */}
              <div className="border border-[#242522]/60 bg-[#141513]/5 rounded-[1px] p-4 space-y-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono font-bold text-[#D6FF3F] uppercase tracking-wider" style={{ fontFamily: 'var(--font-technical)' }}>
                    SECTION PURPOSE SCHEMA REFERENCE
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-[#F3F1EA]" style={{ fontFamily: 'var(--font-technical)' }}>
                    {canonicalSections[activeSectionIndex]}
                  </div>
                  <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
                    {sectionPurposes[activeSectionIndex]}
                  </p>
                </div>
                <div className="text-[9px] font-mono text-[#5C5E58] uppercase leading-tight" style={{ fontFamily: 'var(--font-technical)' }}>
                  * THIS REFERENCE DESCRIBES THE SCHEMA ARCHETYPE AND NOT THE RESOLVED SEED INCIDENT.
                </div>
              </div>

              {/* Navigation Actions Footer */}
              <div className="pt-4 border-t border-[#242522]/40 flex flex-col gap-3.5">
                {/* Row 1: Section Position Metadata */}
                <div className="flex items-center justify-between w-full font-mono text-[10px]" style={{ fontFamily: 'var(--font-technical)' }}>
                  <span className="text-[#5C5E58] font-bold uppercase tracking-wider">SECTION POSITION</span>
                  <span className="text-[#D6FF3F] font-bold bg-[#D6FF3F]/10 px-2 py-0.5 rounded-[1px] uppercase tracking-wider">
                    {String(activeSectionIndex + 1).padStart(2, '0')} OF 11
                  </span>
                </div>

                {/* Row 2: Navigation Buttons */}
                <div className="grid grid-cols-1 min-[520px]:grid-cols-2 gap-3 w-full">
                  <button
                    type="button"
                    disabled={activeSectionIndex === 0}
                    onClick={() => setActiveSectionIndex(activeSectionIndex - 1)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-[#242522] disabled:border-[#242522]/40 bg-[#141513]/20 disabled:bg-transparent text-[#A8AAA3] disabled:text-[#5C5E58] hover:enabled:text-[#D6FF3F] hover:enabled:border-[#D6FF3F]/30 text-xs font-mono font-bold tracking-wider uppercase rounded-[1px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F] disabled:cursor-not-allowed cursor-pointer"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    PREVIOUS SECTION
                  </button>

                  <button
                    type="button"
                    disabled={activeSectionIndex === 10}
                    onClick={() => setActiveSectionIndex(activeSectionIndex + 1)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-[#242522] disabled:border-[#242522]/40 bg-[#141513]/20 disabled:bg-transparent text-[#A8AAA3] disabled:text-[#5C5E58] hover:enabled:text-[#D6FF3F] hover:enabled:border-[#D6FF3F]/30 text-xs font-mono font-bold tracking-wider uppercase rounded-[1px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F] disabled:cursor-not-allowed cursor-pointer"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    NEXT SECTION
                  </button>
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* Right Rail: EDITOR READINESS & POSTMORTEM CONTRACT */}
        <div className="space-y-6">
          
          {/* EDITOR READINESS */}
          <aside className="border border-[#242522] bg-[#0D0E0C] rounded-[2px]" aria-label="Editor Readiness Panel">
            <div className="border-b border-[#242522] bg-[#0F100D] px-4 py-3">
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                EDITOR READINESS
              </h3>
            </div>

            <div className="p-4 space-y-4">
              <dl className="space-y-2.5 font-mono text-[10px]" style={{ fontFamily: 'var(--font-technical)' }}>
                <div className="flex justify-between border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase">DOCUMENT BODY</dt>
                  <dd className="text-[#5C5E58] uppercase font-bold">NOT LOADED</dd>
                </div>

                <div className="flex justify-between border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase">EDITABLE DRAFT</dt>
                  <dd className="text-[#5C5E58] uppercase font-bold">NOT AVAILABLE</dd>
                </div>

                <div className="flex justify-between border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase">APPROVAL AUTHORITY</dt>
                  <dd className="text-[#5C5E58] uppercase font-bold">NOT VERIFIED</dd>
                </div>

                <div className="flex justify-between border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase">VERSION CONTROL</dt>
                  <dd className="text-[#5C5E58] uppercase font-bold">NOT CONNECTED</dd>
                </div>

                <div className="flex justify-between border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase">REGENERATION SAFETY</dt>
                  <dd className="text-[#5C5E58] uppercase font-bold">NOT CONNECTED</dd>
                </div>

                <div className="flex justify-between border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase">BACKEND PERSISTENCE</dt>
                  <dd className="text-[#5C5E58] uppercase font-bold">NOT CONNECTED</dd>
                </div>
              </dl>

              {/* Status Display: BACKEND RECORD AND AUTHORITY REQUIRED */}
              <div className="p-2.5 bg-[#141513]/40 border border-[#242522] rounded-[1px] space-y-1 text-center select-none">
                <div className="text-[8px] font-mono text-[#5C5E58] font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  WORKFLOW STATUS
                </div>
                <div className="text-[9px] font-mono text-[#5C5E58] font-bold uppercase leading-tight" style={{ fontFamily: 'var(--font-technical)' }}>
                  BACKEND RECORD AND AUTHORITY REQUIRED
                </div>
              </div>

              {/* Disabled operational buttons */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-[9px] font-mono px-0.5 pb-1" style={{ fontFamily: 'var(--font-technical)' }}>
                  <span className="text-[#5C5E58] font-bold uppercase">READINESS STATE</span>
                  <span className="text-[#D6FF3F] font-bold uppercase">FRONTEND READINESS REVIEW</span>
                </div>

                <button
                  ref={readinessTriggerRef}
                  type="button"
                  onClick={() => {
                    setIsReadinessOpen(true);
                    setIsMetadataOpen(false);
                  }}
                  className="w-full py-2 border border-[#D6FF3F]/30 bg-[#D6FF3F]/10 hover:bg-[#D6FF3F]/20 text-[#D6FF3F] text-[10px] font-mono font-bold tracking-wider uppercase rounded-[1px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  REVIEW GENERATION READINESS
                </button>

                <div className="h-[1px] bg-[#242522]/40 my-1" />

                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full py-2 border border-[#242522] bg-[#141513]/25 text-[#5C5E58] text-[10px] font-mono font-bold tracking-wider uppercase rounded-[1px] cursor-not-allowed flex items-center justify-center gap-1.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <Lock className="w-3.5 h-3.5" />
                  EDIT POSTMORTEM
                </button>

                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full py-2 border border-[#242522] bg-[#141513]/25 text-[#5C5E58] text-[10px] font-mono font-bold tracking-wider uppercase rounded-[1px] cursor-not-allowed flex items-center justify-center gap-1.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <Lock className="w-3.5 h-3.5" />
                  REGENERATE DRAFT
                </button>

                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full py-2 border border-[#242522] bg-[#141513]/25 text-[#5C5E58] text-[10px] font-mono font-bold tracking-wider uppercase rounded-[1px] cursor-not-allowed flex items-center justify-center gap-1.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <Lock className="w-3.5 h-3.5" />
                  APPROVE POSTMORTEM
                </button>

                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full py-2 border border-[#242522] bg-[#141513]/25 text-[#5C5E58] text-[10px] font-mono font-bold tracking-wider uppercase rounded-[1px] cursor-not-allowed flex items-center justify-center gap-1.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <Lock className="w-3.5 h-3.5" />
                  PUBLISH POSTMORTEM
                </button>
              </div>
            </div>
          </aside>

          {/* POSTMORTEM CONTRACT */}
          <aside className="border border-[#242522] bg-[#0D0E0C] rounded-[2px]" aria-label="Postmortem Contract Guidelines">
            <div className="border-b border-[#242522] bg-[#0F100D] px-4 py-3">
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                POSTMORTEM CONTRACT
              </h3>
            </div>

            <div className="p-4 space-y-4">
              <dl className="space-y-3 font-mono text-[10px] text-left" style={{ fontFamily: 'var(--font-technical)' }}>
                
                <div className="border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase mb-0.5">AI OUTPUT</dt>
                  <dd className="text-[#A8AAA3] font-bold">DRAFT ONLY</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase mb-0.5">HUMAN EDITING</dt>
                  <dd className="text-[#A8AAA3] font-bold">REQUIRED BEFORE APPROVAL WHEN GENERATED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase mb-0.5">APPROVAL</dt>
                  <dd className="text-[#A8AAA3] font-bold">AUTHORIZED HUMAN ACTION</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase mb-0.5">APPROVER IDENTITY</dt>
                  <dd className="text-[#A8AAA3] font-bold">SERVER STORED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase mb-0.5">APPROVED TIME</dt>
                  <dd className="text-[#A8AAA3] font-bold">SERVER GENERATED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase mb-0.5">REGENERATION</dt>
                  <dd className="text-[#A8AAA3] font-bold">CONFIRMATION REQUIRED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase mb-0.5">VERSION HISTORY</dt>
                  <dd className="text-[#A8AAA3] font-bold">PRESERVE PRIOR SNAPSHOT</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-1.5">
                  <dt className="text-[#5C5E58] font-bold uppercase mb-0.5">PERSISTENCE</dt>
                  <dd className="text-[#A8AAA3] font-bold">SERVER CONTROLLED</dd>
                </div>

              </dl>

              {/* Warning/Guideline block */}
              <div className="pt-2 border-t border-[#242522]/60 space-y-1.5">
                <span className="block text-[9px] font-mono font-bold text-amber-500 uppercase tracking-wide leading-snug" style={{ fontFamily: 'var(--font-technical)' }}>
                  AN APPROVED STATE DOES NOT AUTHORIZE INVENTED DOCUMENT CONTENT.
                </span>
                <p className="text-[10px] font-sans text-[#5C5E58] leading-relaxed">
                  SignalFold must load the authoritative Postmortem record before displaying, editing, regenerating, approving, or publishing document content.
                </p>
              </div>
            </div>
          </aside>

        </div>

      </div>

      {/* ACCESSIBLE MODAL DRAWER FOR DOCUMENT METADATA */}
      {isMetadataOpen && (
        <div 
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={handleOverlayClick}
        >
          <div 
            ref={drawerRef}
            onKeyDown={handleDrawerKeyDown}
            className="w-full sm:max-w-md h-full bg-[#0A0A0A] border-l border-[#242522] flex flex-col shadow-2xl animate-slide-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            {/* Drawer Header */}
            <div className="border-b border-[#242522] bg-[#0F100D] px-5 py-4 flex items-center justify-between">
              <h3 id="drawer-title" className="text-sm font-mono font-bold tracking-wider text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                POSTMORTEM METADATA
              </h3>
              <span className="text-[9px] font-mono text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                SCHEMA METADATA
              </span>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <dl className="space-y-4 font-mono text-[11px] text-left" style={{ fontFamily: 'var(--font-technical)' }}>
                <div className="border-b border-[#242522]/40 pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <dt className="text-[#5C5E58] font-bold uppercase shrink-0">INCIDENT RECORD</dt>
                  <dd className="text-[#F3F1EA] font-sans font-bold text-xs uppercase text-right leading-tight sm:max-w-[200px]">RESOLVED SEED RECORD</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <dt className="text-[#5C5E58] font-bold uppercase shrink-0">INCIDENT STATUS</dt>
                  <dd className="text-emerald-400 font-bold uppercase text-right">RESOLVED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <dt className="text-[#5C5E58] font-bold uppercase shrink-0">POSTMORTEM STATUS</dt>
                  <dd className="text-emerald-400 font-bold uppercase text-right">APPROVED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <dt className="text-[#5C5E58] font-bold uppercase shrink-0">CONTENT BODY</dt>
                  <dd className="text-[#5C5E58] uppercase text-right">NOT LOADED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <dt className="text-[#5C5E58] font-bold uppercase shrink-0">APPROVAL SOURCE</dt>
                  <dd className="text-[#5C5E58] uppercase text-right">NOT LOADED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <dt className="text-[#5C5E58] font-bold uppercase shrink-0">APPROVER</dt>
                  <dd className="text-[#5C5E58] uppercase text-right">NOT AVAILABLE</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <dt className="text-[#5C5E58] font-bold uppercase shrink-0">APPROVED AT</dt>
                  <dd className="text-[#5C5E58] uppercase text-right">NOT AVAILABLE</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <dt className="text-[#5C5E58] font-bold uppercase shrink-0">VERSION</dt>
                  <dd className="text-[#5C5E58] uppercase text-right">NOT AVAILABLE</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <dt className="text-[#5C5E58] font-bold uppercase shrink-0">AI GENERATION RECORD</dt>
                  <dd className="text-[#5C5E58] uppercase text-right">NOT AVAILABLE</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <dt className="text-[#5C5E58] font-bold uppercase shrink-0">HUMAN EDIT RECORD</dt>
                  <dd className="text-[#5C5E58] uppercase text-right">NOT AVAILABLE</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <dt className="text-[#5C5E58] font-bold uppercase shrink-0">PERSISTENCE</dt>
                  <dd className="text-[#5C5E58] uppercase text-right">NOT CONNECTED</dd>
                </div>

                <div className="border-b border-[#242522]/40 pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <dt className="text-[#5C5E58] font-bold uppercase shrink-0">AUTHORITY</dt>
                  <dd className="text-[#5C5E58] uppercase text-right">NOT VERIFIED</dd>
                </div>
              </dl>
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-[#242522] bg-[#0F100D] p-5">
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setIsMetadataOpen(false)}
                className="w-full py-3 bg-[#D6FF3F] hover:bg-[#D6FF3F]/90 text-black text-xs font-mono font-bold tracking-wider uppercase rounded-[1px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6FF3F] cursor-pointer"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                CLOSE METADATA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACCESSIBLE MODAL DRAWER FOR GENERATION READINESS */}
      {isReadinessOpen && (
        <div 
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={handleReadinessOverlayClick}
        >
          <div 
            ref={readinessDrawerRef}
            onKeyDown={handleReadinessDrawerKeyDown}
            className="w-full sm:max-w-[580px] sm:w-[580px] h-full bg-[#0A0A0A] border-l border-[#242522] flex flex-col shadow-2xl animate-slide-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="readiness-drawer-title"
          >
            {/* Drawer Header */}
            <div className="border-b border-[#242522] bg-[#0F100D] px-5 py-4 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 id="readiness-drawer-title" className="text-sm font-mono font-bold tracking-wider text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  POSTMORTEM GENERATION READINESS
                </h3>
                <button
                  type="button"
                  onClick={handleCloseReadiness}
                  aria-label="Close Postmortem generation readiness"
                  className="p-1 text-[#5C5E58] hover:text-[#D6FF3F] rounded-[1px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[9px] font-mono text-[#5C5E58] font-bold tracking-wider uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                AI DRAFT & VERSION SAFETY / FRONTEND PREVIEW
              </span>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Header Metadata Section */}
              <div className="border-b border-[#242522] bg-[#0D0E0C]/30 p-4 space-y-3 rounded-[2px]">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 font-mono text-[10px]" style={{ fontFamily: 'var(--font-technical)' }}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/40">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">INCIDENT RECORD</dt>
                    <dd className="text-[#F3F1EA] font-sans font-bold text-[10px] uppercase sm:text-right truncate">RESOLVED SEED RECORD</dd>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/40">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">INCIDENT STATUS</dt>
                    <dd className="text-emerald-400 font-bold uppercase sm:text-right">RESOLVED</dd>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/40">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">POSTMORTEM STATUS</dt>
                    <dd className="text-emerald-400 font-bold uppercase sm:text-right">APPROVED</dd>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/40">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">CONTENT BODY</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT LOADED</dd>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/40">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">GENERATION STATE</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT CREATED</dd>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/40">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">PERSISTENCE</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT CONNECTED</dd>
                  </div>
                </dl>
              </div>

              {/* AI Operation Feedback Notice */}
              <AiOperationFeedback operation="postmortem" />

              {/* 01 / RECORD ELIGIBILITY */}
              <section className="p-4 border border-[#242522] bg-[#0D0E0C] rounded-[2px] space-y-3.5">
                <div className="border-b border-[#242522]/60 pb-1.5">
                  <h4 className="text-[10px] font-mono font-bold text-[#D6FF3F] tracking-wider uppercase">01 / RECORD ELIGIBILITY</h4>
                </div>
                
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 font-mono text-[10px]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">INCIDENT STATUS</dt>
                    <dd className="text-emerald-400 font-bold uppercase sm:text-right">RESOLVED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">POSTMORTEM STATE</dt>
                    <dd className="text-emerald-400 font-bold uppercase sm:text-right">APPROVED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">GENERATION ELIGIBILITY</dt>
                    <dd className="text-emerald-400 font-bold uppercase sm:text-right">INCIDENT STATE ELIGIBLE</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">OPERATION MODE</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">REGENERATION REVIEW</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">CURRENT DOCUMENT</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT LOADED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">CURRENT VERSION</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT AVAILABLE</dd>
                  </div>
                </dl>

                <p className="text-[11px] text-[#A8AAA3] leading-relaxed">
                  A resolved incident is eligible for Postmortem generation. Because this seed already has an approved Postmortem state, any future AI operation must be treated as regeneration rather than initial generation.
                </p>

                <div className="pt-2 border-t border-[#242522]/40 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[9px] font-mono">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                    <span className="text-[#5C5E58] font-bold">STATE ELIGIBILITY</span>
                    <span className="text-emerald-400 font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded-[1px]">AVAILABLE</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                    <span className="text-[#5C5E58] font-bold">REGENERATION READINESS</span>
                    <span className="text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-[1px]">INCOMPLETE</span>
                  </div>
                </div>
              </section>

              {/* 02 / AUTHORITATIVE SOURCE BUNDLE */}
              <section className="p-4 border border-[#242522] bg-[#0D0E0C] rounded-[2px] space-y-3.5">
                <div className="border-b border-[#242522]/60 pb-1.5">
                  <h4 className="text-[10px] font-mono font-bold text-[#D6FF3F] tracking-wider uppercase">02 / SOURCE BUNDLE READINESS</h4>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 font-mono text-[10px]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">INCIDENT RECORD</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">LIMITED SEED DATA</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">RESOLUTION RECORD</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT LOADED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">RESOLUTION SUMMARY</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT LOADED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">SELECTED TIMELINE EVENTS</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT LOADED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">INCIDENT TASKS</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT LOADED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">COMPLETED TASKS</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT LOADED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">CRITICAL TASK OUTCOMES</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT LOADED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">CUSTOMER IMPACT</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT LOADED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">ROOT CAUSE EVIDENCE</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT LOADED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">REMAINING RISK</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT LOADED</dd>
                  </div>
                </dl>

                <p className="text-[11px] text-[#A8AAA3] leading-relaxed">
                  Postmortem generation requires authoritative incident, resolution, Timeline, and task records. The frontend seed does not provide that source bundle.
                </p>

                <div className="pt-2 border-t border-[#242522]/40 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 text-[9px] font-mono">
                  <span className="text-[#5C5E58] font-bold">SOURCE COVERAGE</span>
                  <span className="text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-[1px]">INCOMPLETE</span>
                </div>
              </section>

              {/* 03 / INPUT SANITIZATION */}
              <section className="p-4 border border-[#242522] bg-[#0D0E0C] rounded-[2px] space-y-3.5">
                <div className="border-b border-[#242522]/60 pb-1.5">
                  <h4 className="text-[10px] font-mono font-bold text-[#D6FF3F] tracking-wider uppercase">03 / INPUT SANITIZATION</h4>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 font-mono text-[10px]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">TENANT ACCESS</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">SERVER VERIFICATION REQUIRED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">SOURCE SELECTION</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">SERVER CONTROLLED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">INTERNAL DATA REVIEW</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">REQUIRED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">SENSITIVE DATA SANITIZATION</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">REQUIRED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">PUBLIC-SAFE TRANSFORMATION</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right leading-tight text-[9px]">NOT APPLICABLE TO INTERNAL DRAFT YET</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">AI PROMPT CONSTRUCTION</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">BACKEND ONLY</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">HIDDEN MODEL REASONING</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NEVER EXPOSED</dd>
                  </div>
                </dl>

                <p className="text-[11px] text-[#A8AAA3] leading-relaxed">
                  Only authorized backend functions may prepare and sanitize incident history before sending selected data to the AI provider.
                </p>
              </section>

              {/* 04 / AI GENERATION CONTRACT */}
              <section className="p-4 border border-[#242522] bg-[#0D0E0C] rounded-[2px] space-y-3.5">
                <div className="border-b border-[#242522]/60 pb-1.5">
                  <h4 className="text-[10px] font-mono font-bold text-[#D6FF3F] tracking-wider uppercase">04 / AI GENERATION CONTRACT</h4>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 font-mono text-[10px]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">PROVIDER</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">DEEPSEEK</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">MODEL TARGET</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">DEEPSEEK-V4-FLASH</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">CONNECTION</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT CONNECTED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">OUTPUT TYPE</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">STRUCTURED POSTMORTEM DRAFT</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">OUTPUT SECTIONS</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">11 CANONICAL SECTIONS</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">OUTPUT STATE</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">DRAFT ONLY</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">AUTOMATIC APPROVAL</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">PROHIBITED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">VALIDATION</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">STRICT STRUCTURED RESPONSE REQUIRED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">REPAIR POLICY</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">ONE CONTROLLED REPAIR ATTEMPT</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">TIMEOUT HANDLING</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">BACKEND REQUIRED</dd>
                  </div>
                </dl>

                <p className="text-[11px] text-[#A8AAA3] leading-relaxed">
                  AI output may populate a structured draft only. Human review, editing, and explicit approval remain required.
                </p>
              </section>

              {/* 05 / APPROVED RECORD SAFETY */}
              <section className="p-4 border border-[#242522] bg-[#0D0E0C] rounded-[2px] space-y-3.5">
                <div className="border-b border-[#242522]/60 pb-1.5">
                  <h4 className="text-[10px] font-mono font-bold text-[#D6FF3F] tracking-wider uppercase">05 / REGENERATION SAFETY</h4>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 font-mono text-[10px]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">CURRENT POSTMORTEM STATE</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">APPROVED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">CURRENT DOCUMENT BODY</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT LOADED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">EXISTING HUMAN EDITS</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT LOADED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">REGENERATION CONFIRMATION</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">REQUIRED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">VERSION SNAPSHOT</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">REQUIRED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">PRIOR APPROVED VERSION</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">MUST BE PRESERVED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">OVERWRITE PROTECTION</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">BACKEND REQUIRED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">APPROVAL RESET POLICY</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT CONNECTED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">CONFLICT DETECTION</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT CONNECTED</dd>
                  </div>
                </dl>

                <p className="text-[11px] text-[#A8AAA3] leading-relaxed">
                  Regeneration may overwrite or conflict with human-edited content. SignalFold must require explicit confirmation and preserve the prior approved snapshot before creating a new draft version.
                </p>

                <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[9px] font-bold tracking-wider uppercase text-center rounded-[1px]">
                  REGENERATION MUST NEVER SILENTLY REPLACE AN APPROVED DOCUMENT.
                </div>
              </section>

              {/* 06 / CANONICAL OUTPUT COVERAGE */}
              <section className="p-4 border border-[#242522] bg-[#0D0E0C] rounded-[2px] space-y-3.5">
                <div className="border-b border-[#242522]/60 pb-1.5">
                  <h4 className="text-[10px] font-mono font-bold text-[#D6FF3F] tracking-wider uppercase">06 / CANONICAL OUTPUT COVERAGE</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[10px]">
                  {[
                    "01 / EXECUTIVE SUMMARY",
                    "02 / CUSTOMER & BUSINESS IMPACT",
                    "03 / DETECTION",
                    "04 / TIMELINE",
                    "05 / ROOT CAUSE",
                    "06 / CONTRIBUTING FACTORS",
                    "07 / RESOLUTION",
                    "08 / WHAT WENT WELL",
                    "09 / WHAT WENT POORLY",
                    "10 / PREVENTIVE ACTIONS",
                    "11 / OWNERS & DUE DATES"
                  ].map((sectionName) => (
                    <div key={sectionName} className="p-2 border border-[#242522]/40 bg-[#141513]/25 rounded-[1px] flex flex-col gap-0.5">
                      <span className="text-[#A8AAA3] font-bold truncate">{sectionName}</span>
                      <div className="flex justify-between text-[9px]">
                        <span className="text-[#5C5E58] font-bold uppercase">GENERATION TARGET</span>
                        <span className="text-[#D6FF3F]/70 font-bold uppercase">STRUCTURED DRAFT FIELD</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#242522]/40 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 text-[9px] font-mono">
                  <span className="text-[#5C5E58] font-bold">OUTPUT COVERAGE</span>
                  <span className="text-[#D6FF3F] font-bold bg-[#D6FF3F]/10 px-1.5 py-0.5 rounded-[1px]">11 REQUIRED SECTIONS</span>
                </div>
              </section>

              {/* 07 / CURRENT OPERATOR CONTEXT */}
              <section className="p-4 border border-[#242522] bg-[#0D0E0C] rounded-[2px] space-y-3.5">
                <div className="border-b border-[#242522]/60 pb-1.5">
                  <h4 className="text-[10px] font-mono font-bold text-[#D6FF3F] tracking-wider uppercase">07 / CURRENT OPERATOR CONTEXT</h4>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 font-mono text-[10px]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">IDENTITY</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">CURRENT OPERATOR</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">IDENTITY SOURCE</dt>
                    <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right">FRONTEND PREVIEW</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">ORGANIZATION MEMBERSHIP</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT VERIFIED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">OPERATING ROLE</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT LOADED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">GENERATION AUTHORITY</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT DETERMINED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">APPROVAL AUTHORITY</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT DETERMINED</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                    <dt className="text-[#5C5E58] font-bold uppercase shrink-0">TENANT ACCESS</dt>
                    <dd className="text-[#5C5E58] font-bold uppercase sm:text-right">NOT VERIFIED</dd>
                  </div>
                </dl>
              </section>

              {/* 08 / READINESS VALIDATION */}
              <section className="p-4 border border-[#242522] bg-[#0D0E0C] rounded-[2px] space-y-4">
                <div className="border-b border-[#242522]/60 pb-1.5">
                  <h4 className="text-[10px] font-mono font-bold text-[#D6FF3F] tracking-wider uppercase">08 / READINESS VALIDATION</h4>
                </div>

                <button
                  type="button"
                  onClick={handleValidateReadiness}
                  className="w-full py-2.5 bg-[#D6FF3F] hover:bg-[#D6FF3F]/90 text-black text-xs font-mono font-bold tracking-wider uppercase rounded-[1px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F] cursor-pointer"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  VALIDATE GENERATION READINESS
                </button>
                
                {/* Validation results with screen-reader friendly live region */}
                <div aria-live="polite" className="space-y-4 pt-2">
                  <div className="sr-only">
                    {validationAnnouncement}
                  </div>
                  {hasValidated && (
                    <div className="space-y-4 animate-fade-in">
                      
                      {/* RESULT 01 — INCIDENT STATE */}
                      <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-[1px] space-y-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">RESULT 01: INCIDENT STATE ELIGIBLE</span>
                        </div>
                        <p className="text-[11px] text-[#A8AAA3] leading-relaxed">
                          The seed incident is marked RESOLVED, which is an eligible state for Postmortem generation.
                        </p>
                      </div>

                      {/* RESULT 02 — SOURCE BUNDLE */}
                      <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-[1px] space-y-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider">RESULT 02: SOURCE BUNDLE INCOMPLETE</span>
                        </div>
                        <div className="text-[10px] font-mono text-[#5C5E58] space-y-1">
                          <span className="block text-[8px] font-bold uppercase tracking-wider text-amber-500/70">UNRESOLVED REQUIREMENTS:</span>
                          <ul className="list-disc pl-4 space-y-0.5 text-[#A8AAA3] font-bold">
                            <li>AUTHORITATIVE RESOLUTION NOT LOADED</li>
                            <li>SELECTED TIMELINE EVENTS NOT LOADED</li>
                            <li>INCIDENT TASKS NOT LOADED</li>
                            <li>CUSTOMER IMPACT NOT LOADED</li>
                            <li>ROOT CAUSE EVIDENCE NOT LOADED</li>
                            <li>REMAINING RISK NOT LOADED</li>
                          </ul>
                        </div>
                      </div>

                      {/* RESULT 03 — REGENERATION SAFETY */}
                      <div className="p-3.5 bg-[#141513]/40 border border-[#242522] rounded-[1px] space-y-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#5C5E58]" />
                          <span className="text-[10px] font-mono font-bold text-[#A8AAA3] uppercase tracking-wider">RESULT 03: REGENERATION SAFETY INCOMPLETE</span>
                        </div>
                        <div className="text-[10px] font-mono text-[#5C5E58] space-y-1">
                          <span className="block text-[8px] font-bold uppercase tracking-wider">UNRESOLVED REQUIREMENTS:</span>
                          <ul className="list-disc pl-4 space-y-0.5 text-[#A8AAA3] font-bold">
                            <li>APPROVED DOCUMENT BODY NOT LOADED</li>
                            <li>EXISTING HUMAN EDITS NOT LOADED</li>
                            <li>VERSION SNAPSHOT NOT CONNECTED</li>
                            <li>OVERWRITE CONFIRMATION NOT CONNECTED</li>
                            <li>PRIOR VERSION PRESERVATION NOT CONNECTED</li>
                            <li>APPROVAL RESET POLICY NOT CONNECTED</li>
                          </ul>
                        </div>
                      </div>

                      {/* RESULT 04 — AUTHORITY AND BACKEND */}
                      <div className="p-3.5 bg-[#141513]/40 border border-[#242522] rounded-[1px] space-y-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#5C5E58]" />
                          <span className="text-[10px] font-mono font-bold text-[#A8AAA3] uppercase tracking-wider">RESULT 04: AUTHORITY AND BACKEND READINESS INCOMPLETE</span>
                        </div>
                        <div className="text-[10px] font-mono text-[#5C5E58] space-y-1">
                          <span className="block text-[8px] font-bold uppercase tracking-wider">UNRESOLVED REQUIREMENTS:</span>
                          <ul className="list-disc pl-4 space-y-0.5 text-[#A8AAA3] font-bold">
                            <li>ACTIVE MEMBERSHIP NOT VERIFIED</li>
                            <li>OPERATING ROLE NOT LOADED</li>
                            <li>GENERATION AUTHORITY NOT DETERMINED</li>
                            <li>TENANT ACCESS NOT VERIFIED</li>
                            <li>DEEPSEEK CONNECTION NOT CONNECTED</li>
                            <li>SERVER PERSISTENCE NOT CONNECTED</li>
                            <li>AUDIT EVENT INSERTION NOT CONNECTED</li>
                          </ul>
                        </div>
                      </div>

                      {/* FUTURE GENERATION PREVIEW */}
                      <div className="p-4 border border-[#242522] bg-[#0A0A0A] rounded-[2px] space-y-3.5">
                        <div className="border-b border-[#242522]/60 pb-1.5 flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold text-[#F3F1EA] uppercase tracking-wider">FUTURE GENERATION OPERATION</span>
                          <span className="text-[8px] font-mono text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-[1px]">CONTRACT PREVIEW ONLY</span>
                        </div>

                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 font-mono text-[9px]">
                          {[
                            { label: "OPERATION", val: "REGENERATE POSTMORTEM DRAFT" },
                            { label: "SOURCE", val: "SANITIZED AUTHORITATIVE INCIDENT HISTORY" },
                            { label: "OUTPUT", val: "11-SECTION STRUCTURED DRAFT" },
                            { label: "NEW STATE", val: "DRAFT" },
                            { label: "PRIOR APPROVED VERSION", val: "PRESERVED" },
                            { label: "HUMAN REVIEW", val: "REQUIRED" },
                            { label: "AUTOMATIC APPROVAL", val: "PROHIBITED" },
                            { label: "ACTOR", val: "AUTHENTICATED INCIDENT MANAGER OR ADMIN" },
                            { label: "AI RUN RECORD", val: "SERVER CREATED" },
                            { label: "GENERATED AT", val: "SERVER GENERATED" },
                            { label: "PERSISTENCE", val: "SERVER CONTROLLED" },
                            { label: "TIMELINE EVENT", val: "POSTMORTEM_GENERATED" }
                          ].map((item) => (
                            <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1 border-b border-[#242522]/20">
                              <span className="text-[#5C5E58] font-bold uppercase">{item.label}</span>
                              <span className="text-[#A8AAA3] font-bold uppercase sm:text-right truncate">{item.val}</span>
                            </div>
                          ))}
                        </dl>
                      </div>

                      {/* REAL AI ACTION */}
                      <div className="p-4 border border-[#242522] bg-[#141513]/25 rounded-[2px] space-y-3">
                        <button
                          type="button"
                          disabled
                          className="w-full py-2.5 bg-[#141513]/30 border border-[#242522] text-[#5C5E58] text-xs font-mono font-bold tracking-wider uppercase rounded-[1px] cursor-not-allowed flex items-center justify-center gap-1.5"
                          style={{ fontFamily: 'var(--font-technical)' }}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          REGENERATE POSTMORTEM DRAFT
                        </button>
                        
                        <div className="space-y-1">
                          <span className="block text-[8px] font-mono font-bold text-[#5C5E58] uppercase tracking-widest">ACTION STATUS</span>
                          <span className="block text-[9px] font-mono font-bold text-amber-500 uppercase leading-snug">
                            AUTHORITATIVE CONTENT, VERSION SNAPSHOT, SOURCE DATA, AND BACKEND AUTHORITY REQUIRED
                          </span>
                        </div>

                        <p className="text-[10px] font-sans text-[#5C5E58] leading-relaxed">
                          The real regeneration action requires the current approved document, preserved version history, authoritative incident sources, sanitized backend input, authenticated authority, DeepSeek connectivity, server persistence, and append-only audit insertion.
                        </p>
                      </div>

                      {/* CONFIRMATION ENTRY ACTION */}
                      <div className="pt-2 border-t border-[#242522]/40 space-y-2 text-left">
                        <button
                          type="button"
                          onClick={() => {
                            setIsConfirmationVisible(true);
                            setPhase3Announcement("Regeneration confirmation workflow revealed. Sections 09 through 14 are now appended to the drawer.");
                          }}
                          className="w-full py-2.5 bg-[#D6FF3F] hover:bg-[#D6FF3F]/90 text-black text-xs font-mono font-bold tracking-wider uppercase rounded-[1px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F] cursor-pointer flex items-center justify-center gap-1.5"
                          style={{ fontFamily: 'var(--font-technical)' }}
                        >
                          REVIEW REGENERATION CONFIRMATION
                        </button>
                        
                        <div className="flex justify-between items-baseline text-[8px] font-mono text-[#5C5E58] px-0.5" style={{ fontFamily: 'var(--font-technical)' }}>
                          <span className="font-bold uppercase">SUPPORTING STATE</span>
                          <span className="font-bold text-[#A8AAA3] uppercase">LOCAL VERSION-SAFETY PREVIEW</span>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              </section>

              {/* Phase 03 Confirmation Workflow */}
              {isConfirmationVisible && (
                <div className="space-y-6 pt-4 border-t border-[#242522]/60 animate-fade-in">
                  
                  {/* Hidden live region for Phase 03 announcements */}
                  <div className="sr-only" aria-live="polite" role="status">
                    {phase3Announcement}
                  </div>

                  {/* SECTION 09 — REGENERATION CONSEQUENCES */}
                  <section className="p-4 border border-[#242522] bg-[#0D0E0C] rounded-[2px] space-y-3.5 text-left">
                    <div className="border-b border-[#242522]/60 pb-1.5">
                      <h4 className="text-[10px] font-mono font-bold text-[#D6FF3F] tracking-wider uppercase">09 / REGENERATION CONSEQUENCES</h4>
                    </div>
                    
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 font-mono text-[10px]" style={{ fontFamily: 'var(--font-technical)' }}>
                      {[
                        { label: "CURRENT POSTMORTEM STATE", val: "APPROVED" },
                        { label: "CURRENT DOCUMENT BODY", val: "NOT LOADED" },
                        { label: "CURRENT VERSION", val: "NOT AVAILABLE" },
                        { label: "PROPOSED OPERATION", val: "CREATE A NEW AI-GENERATED DRAFT VERSION" },
                        { label: "PRIOR APPROVED DOCUMENT", val: "MUST BE PRESERVED" },
                        { label: "NEW VERSION STATE", val: "DRAFT" },
                        { label: "APPROVAL CARRY-FORWARD", val: "PROHIBITED" },
                        { label: "HUMAN REVIEW", val: "REQUIRED" },
                      ].map((item) => (
                        <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1.5 border-b border-[#242522]/20">
                          <dt className="text-[#5C5E58] font-bold uppercase shrink-0">{item.label}</dt>
                          <dd className="text-[#A8AAA3] font-bold uppercase sm:text-right truncate">{item.val}</dd>
                        </div>
                      ))}
                    </dl>

                    <p className="text-[11px] text-[#A8AAA3] leading-relaxed">
                      Regeneration must create a separate draft version. It must not silently replace the existing approved document or inherit its approval.
                    </p>

                    <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono text-[9px] font-bold tracking-wider uppercase text-center rounded-[1px]" style={{ fontFamily: 'var(--font-technical)' }}>
                      REGENERATION CREATES A NEW DRAFT. IT DOES NOT REAPPROVE THE DOCUMENT.
                    </div>
                  </section>

                  {/* SECTION 10 — EXPLICIT ACKNOWLEDGEMENTS */}
                  <section className="p-4 border border-[#242522] bg-[#0D0E0C] rounded-[2px] space-y-4 text-left">
                    <div className="border-b border-[#242522]/60 pb-1.5">
                      <h4 className="text-[10px] font-mono font-bold text-[#D6FF3F] tracking-wider uppercase">10 / REGENERATION ACKNOWLEDGEMENTS</h4>
                    </div>

                    <fieldset className="space-y-4">
                      <legend className="sr-only">Explicit Acknowledgements for Regeneration</legend>
                      
                      <div className="space-y-4">
                        {/* Checkbox 01 */}
                        <div className="flex items-start gap-3">
                          <div className="flex items-center h-5">
                            <input
                              id="ack-new-draft"
                              aria-describedby="ack-new-draft-desc"
                              type="checkbox"
                              checked={ackNewDraft}
                              onChange={handleToggleAckNewDraft}
                              className="w-4 h-4 rounded border-[#242522] text-[#D6FF3F] focus:ring-[#D6FF3F] bg-[#0A0A0A] focus:ring-offset-0 cursor-pointer"
                            />
                          </div>
                          <div className="flex flex-col text-left">
                            <label htmlFor="ack-new-draft" className="text-xs font-mono font-bold text-[#F3F1EA] uppercase select-none cursor-pointer" style={{ fontFamily: 'var(--font-technical)' }}>
                              I UNDERSTAND THAT REGENERATION WOULD CREATE A NEW DRAFT VERSION.
                            </label>
                            <p id="ack-new-draft-desc" className="text-[11px] text-[#A8AAA3] mt-1 leading-relaxed">
                              The new AI output would require human review and explicit approval.
                            </p>
                          </div>
                        </div>

                        {/* Checkbox 02 */}
                        <div className="flex items-start gap-3">
                          <div className="flex items-center h-5">
                            <input
                              id="ack-preserve-prior"
                              aria-describedby="ack-preserve-prior-desc"
                              type="checkbox"
                              checked={ackPreservePrior}
                              onChange={handleToggleAckPreservePrior}
                              className="w-4 h-4 rounded border-[#242522] text-[#D6FF3F] focus:ring-[#D6FF3F] bg-[#0A0A0A] focus:ring-offset-0 cursor-pointer"
                            />
                          </div>
                          <div className="flex flex-col text-left">
                            <label htmlFor="ack-preserve-prior" className="text-xs font-mono font-bold text-[#F3F1EA] uppercase select-none cursor-pointer" style={{ fontFamily: 'var(--font-technical)' }}>
                              I UNDERSTAND THAT THE PRIOR APPROVED VERSION MUST BE PRESERVED.
                            </label>
                            <p id="ack-preserve-prior-desc" className="text-[11px] text-[#A8AAA3] mt-1 leading-relaxed">
                              The backend must store an immutable or recoverable snapshot before any new draft becomes active.
                            </p>
                          </div>
                        </div>

                        {/* Checkbox 03 */}
                        <div className="flex items-start gap-3">
                          <div className="flex items-center h-5">
                            <input
                              id="ack-no-carry"
                              aria-describedby="ack-no-carry-desc"
                              type="checkbox"
                              checked={ackNoCarry}
                              onChange={handleToggleAckNoCarry}
                              className="w-4 h-4 rounded border-[#242522] text-[#D6FF3F] focus:ring-[#D6FF3F] bg-[#0A0A0A] focus:ring-offset-0 cursor-pointer"
                            />
                          </div>
                          <div className="flex flex-col text-left">
                            <label htmlFor="ack-no-carry" className="text-xs font-mono font-bold text-[#F3F1EA] uppercase select-none cursor-pointer" style={{ fontFamily: 'var(--font-technical)' }}>
                              I UNDERSTAND THAT APPROVAL DOES NOT CARRY FORWARD.
                            </label>
                            <p id="ack-no-carry-desc" className="text-[11px] text-[#A8AAA3] mt-1 leading-relaxed">
                              The new draft must not inherit approver identity, approval timestamp, or approved state.
                            </p>
                          </div>
                        </div>
                      </div>
                    </fieldset>

                    {/* Confirmation State display */}
                    <div className="border-t border-[#242522]/40 pt-3 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 text-[10px] font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                      <dt className="text-[#5C5E58] font-bold uppercase shrink-0">CONFIRMATION STATE</dt>
                      <dd className={ackNewDraft && ackPreservePrior && ackNoCarry ? "text-emerald-400 font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded-[1px] leading-tight" : "text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-[1px] leading-tight"}>
                        {ackNewDraft && ackPreservePrior && ackNoCarry ? "LOCAL ACKNOWLEDGEMENTS COMPLETE" : "INCOMPLETE"}
                      </dd>
                    </div>

                    {/* Unresolved Acknowledgements list */}
                    {!(ackNewDraft && ackPreservePrior && ackNoCarry) && (
                      <div className="p-3 bg-[#141513]/40 border border-[#242522] rounded-[1px] space-y-1.5">
                        <span className="block text-[8px] font-mono font-bold uppercase tracking-wider text-amber-500/70" style={{ fontFamily: 'var(--font-technical)' }}>UNRESOLVED ACKNOWLEDGEMENTS:</span>
                        <ul className="list-disc pl-4 space-y-0.5 text-[9px] font-mono text-[#A8AAA3] font-bold" style={{ fontFamily: 'var(--font-technical)' }}>
                          {!ackNewDraft && <li>NEW DRAFT CREATION NOT ACKNOWLEDGED</li>}
                          {!ackPreservePrior && <li>APPROVED VERSION PRESERVATION NOT ACKNOWLEDGED</li>}
                          {!ackNoCarry && <li>APPROVAL RESET NOT ACKNOWLEDGED</li>}
                        </ul>
                      </div>
                    )}

                    {/* Actions block */}
                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        disabled={!(ackNewDraft && ackPreservePrior && ackNoCarry)}
                        aria-disabled={!(ackNewDraft && ackPreservePrior && ackNoCarry) ? "true" : undefined}
                        onClick={handleValidateVersionPlan}
                        className={`w-full py-2.5 text-xs font-mono font-bold tracking-wider uppercase rounded-[1px] transition-colors focus-visible:outline focus-visible:outline-2 cursor-pointer ${
                          ackNewDraft && ackPreservePrior && ackNoCarry
                            ? "bg-[#D6FF3F] hover:bg-[#D6FF3F]/90 text-black focus-visible:outline-[#D6FF3F]"
                            : "bg-[#141513]/30 border border-[#242522] text-[#5C5E58] cursor-not-allowed"
                        }`}
                        style={{ fontFamily: 'var(--font-technical)' }}
                      >
                        VALIDATE VERSION PLAN
                      </button>

                      <button
                        type="button"
                        onClick={handleResetConfirmation}
                        className="w-full py-2 border border-[#242522]/60 hover:border-[#D6FF3F]/40 text-[#A8AAA3] hover:text-[#D6FF3F] text-xs font-mono font-bold tracking-wider uppercase rounded-[1px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        style={{ fontFamily: 'var(--font-technical)' }}
                      >
                        RESET CONFIRMATION PREVIEW
                      </button>
                    </div>

                    {/* VERSION PLAN STATE */}
                    {hasValidatedVersionPlan && (
                      <div className="border-t border-[#242522]/40 pt-3 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 text-[10px] font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                        <span className="text-[#5C5E58] font-bold uppercase">VERSION PLAN STATE</span>
                        <span className={versionPlanState === 'changed' ? "text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-[1px]" : "text-emerald-400 font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded-[1px]"}>
                          {versionPlanState === 'changed' ? "ACKNOWLEDGEMENTS CHANGED" : "CURRENT LOCAL ACKNOWLEDGEMENTS"}
                        </span>
                      </div>
                    )}

                    {/* Local Validation Results */}
                    {hasValidatedVersionPlan && (
                      <div className="space-y-4 pt-2">
                        {/* RESULT 01 */}
                        <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-[1px] space-y-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-technical)' }}>RESULT 01: REGENERATION CONFIRMATION STRUCTURE VALID</span>
                          </div>
                          <p className="text-[11px] text-[#A8AAA3] leading-relaxed">
                            The local preview includes explicit acknowledgement of new draft creation, prior-version preservation, and fresh human approval requirements.
                          </p>
                        </div>

                        {/* RESULT 02 */}
                        <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-[1px] space-y-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-technical)' }}>RESULT 02: VERSION SNAPSHOT READINESS INCOMPLETE</span>
                          </div>
                          <div className="text-[10px] font-mono text-[#5C5E58] space-y-1" style={{ fontFamily: 'var(--font-technical)' }}>
                            <span className="block text-[8px] font-bold uppercase tracking-wider text-amber-500/70">UNRESOLVED REQUIREMENTS:</span>
                            <ul className="list-disc pl-4 space-y-0.5 text-[#A8AAA3] font-bold">
                              <li>APPROVED DOCUMENT BODY NOT LOADED</li>
                              <li>CURRENT VERSION NOT AVAILABLE</li>
                              <li>SNAPSHOT PERSISTENCE NOT CONNECTED</li>
                              <li>SNAPSHOT ID GENERATION NOT CONNECTED</li>
                              <li>VERSION HISTORY NOT CONNECTED</li>
                              <li>RESTORE CAPABILITY NOT CONNECTED</li>
                            </ul>
                          </div>
                        </div>

                        {/* RESULT 03 */}
                        <div className="p-3.5 bg-[#141513]/40 border border-[#242522] rounded-[1px] space-y-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#5C5E58]" />
                            <span className="text-[10px] font-mono font-bold text-[#A8AAA3] uppercase tracking-wider" style={{ fontFamily: 'var(--font-technical)' }}>RESULT 03: GENERATION AND AUTHORITY READINESS INCOMPLETE</span>
                          </div>
                          <div className="text-[10px] font-mono text-[#5C5E58] space-y-1" style={{ fontFamily: 'var(--font-technical)' }}>
                            <span className="block text-[8px] font-bold uppercase tracking-wider">UNRESOLVED REQUIREMENTS:</span>
                            <ul className="list-disc pl-4 space-y-0.5 text-[#A8AAA3] font-bold">
                              <li>AUTHORITATIVE SOURCE BUNDLE NOT LOADED</li>
                              <li>ACTIVE MEMBERSHIP NOT VERIFIED</li>
                              <li>OPERATING ROLE NOT LOADED</li>
                              <li>GENERATION AUTHORITY NOT DETERMINED</li>
                              <li>TENANT ACCESS NOT VERIFIED</li>
                              <li>DEEPSEEK CONNECTION NOT CONNECTED</li>
                              <li>SERVER PERSISTENCE NOT CONNECTED</li>
                              <li>AUDIT EVENT INSERTION NOT CONNECTED</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>

                  {/* SECTION 11 — APPROVED VERSION SNAPSHOT PREVIEW */}
                  <section className="p-4 border border-[#242522] bg-[#0D0E0C] rounded-[2px] space-y-3.5 text-left">
                    <div className="border-b border-[#242522]/60 pb-1.5 flex justify-between items-center">
                      <h4 className="text-[10px] font-mono font-bold text-[#D6FF3F] tracking-wider uppercase">11 / APPROVED VERSION SNAPSHOT PREVIEW</h4>
                      <span className="text-[8px] font-mono text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-[1px]" style={{ fontFamily: 'var(--font-technical)' }}>CONTRACT PREVIEW ONLY</span>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 font-mono text-[9px]" style={{ fontFamily: 'var(--font-technical)' }}>
                      {[
                        { label: "SNAPSHOT PURPOSE", val: "PRESERVE PRIOR APPROVED DOCUMENT" },
                        { label: "SOURCE POSTMORTEM STATE", val: "APPROVED" },
                        { label: "SOURCE DOCUMENT BODY", val: "NOT LOADED" },
                        { label: "SOURCE VERSION", val: "NOT AVAILABLE" },
                        { label: "SNAPSHOT RECORD", val: "NOT CREATED" },
                        { label: "SNAPSHOT ID", val: "NOT GENERATED" },
                        { label: "SNAPSHOT CONTENT HASH", val: "NOT GENERATED" },
                        { label: "SNAPSHOT CREATED AT", val: "NOT GENERATED" },
                        { label: "SNAPSHOT CREATED BY", val: "BACKEND FUNCTION" },
                        { label: "APPROVER IDENTITY", val: "PRESERVED WHEN AVAILABLE" },
                        { label: "APPROVED TIME", val: "PRESERVED WHEN AVAILABLE" },
                        { label: "RESTORE CAPABILITY", val: "BACKEND REQUIRED" },
                        { label: "VERSION HISTORY", val: "NOT CONNECTED" },
                      ].map((item) => (
                        <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1 border-b border-[#242522]/20">
                          <span className="text-[#5C5E58] font-bold uppercase">{item.label}</span>
                          <span className="text-[#A8AAA3] font-bold uppercase sm:text-right truncate">{item.val}</span>
                        </div>
                      ))}
                    </dl>

                    <p className="text-[10px] font-sans text-[#5C5E58] leading-relaxed">
                      The authoritative backend must preserve the existing approved document and its approval metadata before creating a separate draft version.
                    </p>
                  </section>

                  {/* SECTION 12 — NEW DRAFT VERSION PREVIEW */}
                  <section className="p-4 border border-[#242522] bg-[#0D0E0C] rounded-[2px] space-y-3.5 text-left">
                    <div className="border-b border-[#242522]/60 pb-1.5 flex justify-between items-center">
                      <h4 className="text-[10px] font-mono font-bold text-[#D6FF3F] tracking-wider uppercase">12 / NEW DRAFT VERSION PREVIEW</h4>
                      <span className="text-[8px] font-mono text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-[1px]" style={{ fontFamily: 'var(--font-technical)' }}>CONTRACT PREVIEW ONLY</span>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 font-mono text-[9px]" style={{ fontFamily: 'var(--font-technical)' }}>
                      {[
                        { label: "VERSION RECORD", val: "NOT CREATED" },
                        { label: "VERSION ID", val: "NOT GENERATED" },
                        { label: "VERSION NUMBER", val: "SERVER GENERATED" },
                        { label: "VERSION STATE", val: "DRAFT" },
                        { label: "SOURCE", val: "AI-GENERATED FROM SANITIZED AUTHORITATIVE HISTORY" },
                        { label: "CONTENT BODY", val: "NOT GENERATED" },
                        { label: "OUTPUT COVERAGE", val: "11 CANONICAL SECTIONS" },
                        { label: "BASED ON", val: "PRESERVED APPROVED VERSION CONTEXT" },
                        { label: "APPROVAL STATE", val: "NOT APPROVED" },
                        { label: "APPROVER", val: "NOT ASSIGNED" },
                        { label: "APPROVED AT", val: "NOT GENERATED" },
                        { label: "HUMAN REVIEW", val: "REQUIRED" },
                        { label: "AI RUN", val: "NOT CREATED" },
                        { label: "GENERATED AT", val: "NOT GENERATED" },
                        { label: "PERSISTENCE", val: "NOT CONNECTED" },
                      ].map((item) => (
                        <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1 border-b border-[#242522]/20">
                          <span className="text-[#5C5E58] font-bold uppercase">{item.label}</span>
                          <span className="text-[#A8AAA3] font-bold uppercase sm:text-right truncate">{item.val}</span>
                        </div>
                      ))}
                    </dl>

                    <p className="text-[10px] font-sans text-[#5C5E58] leading-relaxed">
                      The future AI operation would create a separate unapproved draft version. Human edits and explicit approval would still be required.
                    </p>

                    <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[9px] font-bold tracking-wider uppercase text-center rounded-[1px]" style={{ fontFamily: 'var(--font-technical)' }}>
                      A NEW AI DRAFT MUST NEVER INHERIT APPROVED STATUS.
                    </div>
                  </section>

                  {/* SECTION 13 — LOCAL REGENERATION PLAN */}
                  {hasValidatedVersionPlan && (
                    <section className="p-4 border border-[#242522] bg-[#0D0E0C] rounded-[2px] space-y-3.5 text-left">
                      <div className="border-b border-[#242522]/60 pb-1.5 flex justify-between items-center">
                        <h4 className="text-[10px] font-mono font-bold text-[#D6FF3F] tracking-wider uppercase">13 / LOCAL REGENERATION PLAN</h4>
                        <span className="text-[8px] font-mono text-[#D6FF3F] font-bold bg-[#D6FF3F]/10 px-1.5 py-0.5 rounded-[1px]" style={{ fontFamily: 'var(--font-technical)' }}>LOCAL PREVIEW ONLY</span>
                      </div>

                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 font-mono text-[9px]" style={{ fontFamily: 'var(--font-technical)' }}>
                        {[
                          { label: "OPERATION", val: "REGENERATE POSTMORTEM DRAFT" },
                          { label: "CURRENT STATE", val: "APPROVED" },
                          { label: "CURRENT CONTENT", val: "NOT LOADED" },
                          { label: "STEP 01", val: "PRESERVE PRIOR APPROVED VERSION" },
                          { label: "STEP 02", val: "LOAD AND SANITIZE AUTHORITATIVE INCIDENT SOURCES" },
                          { label: "STEP 03", val: "CREATE AI RUN THROUGH BACKEND" },
                          { label: "STEP 04", val: "VALIDATE 11-SECTION STRUCTURED OUTPUT" },
                          { label: "STEP 05", val: "CREATE SEPARATE NEW DRAFT VERSION" },
                          { label: "STEP 06", val: "REQUIRE HUMAN REVIEW AND EXPLICIT APPROVAL" },
                          { label: "PRIOR APPROVED VERSION", val: "PRESERVED" },
                          { label: "NEW VERSION STATE", val: "DRAFT" },
                          { label: "APPROVAL CARRY-FORWARD", val: "NO" },
                          { label: "ACTOR", val: "CURRENT OPERATOR / NOT VERIFIED" },
                          { label: "TIMESTAMP", val: "NOT GENERATED" },
                          { label: "SNAPSHOT", val: "NOT CREATED" },
                          { label: "AI RUN", val: "NOT CREATED" },
                          { label: "DRAFT VERSION", val: "NOT CREATED" },
                          { label: "PERSISTENCE", val: "NOT CONNECTED" },
                          { label: "AUDIT EVENT", val: "NOT CREATED" },
                        ].map((item) => (
                          <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1 border-b border-[#242522]/20">
                            <span className="text-[#5C5E58] font-bold uppercase">{item.label}</span>
                            <span className="text-[#A8AAA3] font-bold uppercase sm:text-right truncate">{item.val}</span>
                          </div>
                        ))}
                      </dl>

                      <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono text-[9px] font-bold tracking-wider uppercase text-center rounded-[1px]" style={{ fontFamily: 'var(--font-technical)' }}>
                        NO OPERATION HAS BEEN EXECUTED.
                      </div>
                    </section>
                  )}

                  {/* POSTMORTEM VERSION SAFETY CONTRACT */}
                  <section className="p-4 border border-[#242522] bg-[#0D0E0C] rounded-[2px] space-y-3.5 text-left">
                    <div className="border-b border-[#242522]/60 pb-1.5">
                      <h4 className="text-[10px] font-mono font-bold text-[#D6FF3F] tracking-wider uppercase">POSTMORTEM VERSION SAFETY CONTRACT</h4>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 font-mono text-[9px]" style={{ fontFamily: 'var(--font-technical)' }}>
                      {[
                        { label: "CURRENT APPROVED VERSION", val: "PRESERVE BEFORE REGENERATION" },
                        { label: "NEW AI OUTPUT", val: "SEPARATE DRAFT VERSION" },
                        { label: "APPROVAL CARRY-FORWARD", val: "PROHIBITED" },
                        { label: "APPROVER IDENTITY", val: "NOT COPIED TO NEW DRAFT" },
                        { label: "APPROVED TIMESTAMP", val: "NOT COPIED TO NEW DRAFT" },
                        { label: "VERSION SNAPSHOT", val: "SERVER CONTROLLED" },
                        { label: "VERSION NUMBER", val: "SERVER GENERATED" },
                        { label: "RESTORE CAPABILITY", val: "REQUIRED" },
                        { label: "HUMAN REVIEW", val: "REQUIRED" },
                        { label: "FRESH APPROVAL", val: "EXPLICIT AUTHORIZED ACTION" },
                        { label: "AUDIT EVENT", val: "APPEND-ONLY" },
                      ].map((item) => (
                        <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1 border-b border-[#242522]/20">
                          <span className="text-[#5C5E58] font-bold uppercase">{item.label}</span>
                          <span className="text-[#A8AAA3] font-bold uppercase sm:text-right truncate">{item.val}</span>
                        </div>
                      ))}
                    </dl>

                    <div className="p-2 bg-[#D6FF3F]/5 border border-[#D6FF3F]/10 text-[#D6FF3F] font-mono text-[9px] font-bold tracking-wider uppercase text-center rounded-[1px]" style={{ fontFamily: 'var(--font-technical)' }}>
                      REGENERATION MUST CREATE HISTORY, NOT ERASE IT.
                    </div>

                    <p className="text-[10px] font-sans text-[#5C5E58] leading-relaxed">
                      The backend must preserve the approved version, create a separate draft, and require a new authorized human approval before the regenerated document can become approved.
                    </p>
                  </section>

                </div>
              )}

              {/* POSTMORTEM GENERATION CONTRACT */}
              <section className="p-4 border border-[#242522] bg-[#0D0E0C] rounded-[2px] space-y-3.5">
                <div className="border-b border-[#242522]/60 pb-1.5">
                  <h4 className="text-[10px] font-mono font-bold text-[#D6FF3F] tracking-wider uppercase">POSTMORTEM GENERATION CONTRACT</h4>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 font-mono text-[9px]">
                  {[
                    { label: "INCIDENT STATE", val: "RESOLVED OR CLOSED" },
                    { label: "SOURCE RECORDS", val: "SERVER LOADED" },
                    { label: "INPUT", val: "SANITIZED INCIDENT HISTORY" },
                    { label: "AI OUTPUT", val: "DRAFT ONLY" },
                    { label: "OUTPUT VALIDATION", val: "STRICT STRUCTURE" },
                    { label: "HUMAN EDITING", val: "REQUIRED" },
                    { label: "APPROVAL", val: "EXPLICIT AUTHORIZED ACTION" },
                    { label: "REGENERATION", val: "CONFIRMATION REQUIRED" },
                    { label: "PRIOR VERSION", val: "PRESERVED" },
                    { label: "TIMESTAMP", val: "SERVER GENERATED" },
                    { label: "AUDIT EVENT", val: "APPEND-ONLY" }
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-1 border-b border-[#242522]/20">
                      <span className="text-[#5C5E58] font-bold uppercase">{item.label}</span>
                      <span className="text-[#A8AAA3] font-bold uppercase sm:text-right truncate">{item.val}</span>
                    </div>
                  ))}
                </dl>

                <div className="p-2.5 bg-[#D6FF3F]/5 border border-[#D6FF3F]/10 text-[#D6FF3F] font-mono text-[9px] font-bold tracking-wider uppercase text-center rounded-[1px]">
                  AI MAY DRAFT THE POSTMORTEM. AI MAY NOT APPROVE IT.
                </div>

                <p className="text-[10px] font-sans text-[#5C5E58] leading-relaxed">
                  The backend must verify tenant membership, role authority, source completeness, version safety, and current Postmortem state before starting generation or regeneration.
                </p>
              </section>

            </div>

            {/* Drawer Footer */}
            <div className="border-t border-[#242522] bg-[#0F100D] p-5">
              <button
                ref={readinessCloseBtnRef}
                type="button"
                onClick={handleCloseReadiness}
                className="w-full py-3 bg-[#D6FF3F] hover:bg-[#D6FF3F]/90 text-black text-xs font-mono font-bold tracking-wider uppercase rounded-[1px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6FF3F] cursor-pointer"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                CLOSE READINESS REVIEW
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
