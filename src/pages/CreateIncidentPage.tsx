import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * SignalFold — Create Incident Page Component.
 * Full operational frontend with asymmetric desktop/tablet layout and complete validation controls.
 */
export function CreateIncidentPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [service, setService] = useState('');
  const [observedStart, setObservedStart] = useState('');
  const [impactHint, setImpactHint] = useState('');
  const [analyzeAfter, setAnalyzeAfter] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle');
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    impactHint?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {
      title?: string;
      description?: string;
      impactHint?: string;
    } = {};

    // 1. Validate Title
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      newErrors.title = 'Incident title is required.';
    } else if (trimmedTitle.length < 5) {
      newErrors.title = 'Use at least 5 characters.';
    } else if (trimmedTitle.length > 120) {
      newErrors.title = 'Incident title cannot exceed 120 characters.';
    }

    // 2. Validate Description
    const trimmedDesc = description.trim();
    if (!trimmedDesc) {
      newErrors.description = 'Incident description is required.';
    } else if (trimmedDesc.length < 20) {
      newErrors.description = 'Use at least 20 characters.';
    } else if (trimmedDesc.length > 5000) {
      newErrors.description = 'Incident description cannot exceed 5,000 characters.';
    }

    // 3. Validate Impact Hint length
    if (impactHint.length > 500) {
      newErrors.impactHint = 'Impact hint cannot exceed 500 characters.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setSubmitStatus('idle');
      return;
    }

    // Brief local processing state to simulate check
    setIsSubmitting(true);
    setSubmitStatus('idle');

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
    }, 400);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-left">
      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-[#242522] pb-6">
        <div className="space-y-2 flex-1">
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#141513] border border-[#242522]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
            <span 
              className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase text-amber-500"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              REPORTING SURFACE / FRONTEND PREVIEW
            </span>
          </div>

          {/* Page Title */}
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F3F1EA] uppercase leading-[1.1]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            REPORT AN INCIDENT.
          </h2>

          {/* Supporting copy */}
          <p className="text-sm sm:text-base text-[#A8AAA3] w-full max-w-[640px] leading-relaxed font-sans text-left">
            Capture the first reliable account of an operational issue. SignalFold will preserve the report before any optional AI-assisted triage begins.
          </p>
        </div>

        {/* Right-side status */}
        <div 
          className="flex items-center gap-1.5 border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-[10px] font-mono font-bold tracking-wider text-amber-500 rounded-[2px] w-fit shrink-0 h-fit self-start" 
          style={{ fontFamily: 'var(--font-technical)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
          <span>CREATION SERVICE / NOT CONNECTED</span>
        </div>
      </div>

      {/* Main asymmetric layout container */}
      <div className="border border-[#242522] rounded-[2px] bg-[#0A0A0A] overflow-hidden w-full max-w-full">
        <div className="grid grid-cols-1 [@media(min-width:1050px)]:grid-cols-[1.5fr_1fr] min-w-0 divide-y [@media(min-width:1050px)]:divide-y-0 [@media(min-width:1050px)]:divide-x divide-[#242522]">
          
          {/* LEFT PANEL: Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-8 text-left min-w-0" noValidate>
            
            {/* SECTION 01 — INCIDENT IDENTITY */}
            <fieldset className="space-y-6">
              <legend 
                className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase mb-4"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                01 / INCIDENT IDENTITY
              </legend>

              {/* Title Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label 
                    htmlFor="incident-title"
                    className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    TITLE *
                  </label>
                  <span 
                    className="text-[9px] font-mono text-[#5C5E58]"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    {title.length} / 120
                  </span>
                </div>
                <input
                  id="incident-title"
                  type="text"
                  required
                  maxLength={120}
                  autoComplete="off"
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

              {/* Description Textarea */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label 
                    htmlFor="incident-description"
                    className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    DESCRIPTION *
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
                  rows={6}
                  placeholder="Customers cannot complete card payments after the latest deployment. Support has received 37 reports in the last 12 minutes."
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
            </fieldset>

            {/* SECTION 02 — OPERATIONAL CONTEXT */}
            <fieldset className="space-y-6 pt-6 border-t border-[#242522]/60">
              <legend 
                className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase mb-4"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                02 / OPERATIONAL CONTEXT
              </legend>

              {/* Grid of service and start time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Affected Service Select */}
                <div className="space-y-1.5">
                  <label 
                    htmlFor="affected-service"
                    className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    AFFECTED SERVICE
                  </label>
                  <select
                    id="affected-service"
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

                {/* Observed Start Time Input */}
                <div className="space-y-1.5">
                  <label 
                    htmlFor="observed-start-time"
                    className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    OBSERVED START TIME
                  </label>
                  <input
                    id="observed-start-time"
                    type="datetime-local"
                    value={observedStart}
                    onChange={(e) => setObservedStart(e.target.value)}
                    aria-describedby="observed-start-time-helper"
                    className="w-full bg-[#141513]/40 border border-[#242522] text-[#F3F1EA] text-xs font-mono p-3 rounded-[2px] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 appearance-none cursor-pointer"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  />
                  <p 
                    id="observed-start-time-helper"
                    className="text-[9px] font-mono text-[#5C5E58] tracking-wide leading-normal"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    Optional. Enter the earliest observed start time only when it is known.
                  </p>
                </div>
              </div>

              {/* Impact Hint Textarea */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label 
                    htmlFor="impact-hint"
                    className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    IMPACT HINT
                  </label>
                  <span 
                    className="text-[9px] font-mono text-[#5C5E58]"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    {impactHint.length} / 500
                  </span>
                </div>
                <textarea
                  id="impact-hint"
                  maxLength={500}
                  rows={3}
                  placeholder="Customers cannot complete card payments."
                  value={impactHint}
                  onChange={(e) => {
                    setImpactHint(e.target.value);
                    if (errors.impactHint) {
                      setErrors(prev => ({ ...prev, impactHint: undefined }));
                    }
                  }}
                  aria-invalid={!!errors.impactHint}
                  aria-describedby={errors.impactHint ? "impact-hint-error" : "impact-hint-helper"}
                  className="w-full bg-[#141513]/40 border border-[#242522] text-[#F3F1EA] text-xs font-mono p-3 rounded-[2px] placeholder-[#5C5E58] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 resize-y max-w-full"
                  style={{ fontFamily: 'var(--font-technical)' }}
                />
                {errors.impactHint ? (
                  <p 
                    id="impact-hint-error" 
                    role="alert"
                    className="text-[10px] font-mono text-amber-500/90 tracking-wide"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    {errors.impactHint}
                  </p>
                ) : (
                  <p 
                    id="impact-hint-helper"
                    className="text-[9px] font-mono text-[#5C5E58] tracking-wide leading-normal"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    Optional initial context. Final customer and business impact remains subject to investigation and human verification.
                  </p>
                )}
              </div>
            </fieldset>

            {/* SECTION 03 — REPORTER AND AI PREFERENCE */}
            <fieldset className="space-y-6 pt-6 border-t border-[#242522]/60">
              <legend 
                className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase mb-4"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                03 / REPORTER & TRIAGE
              </legend>

              {/* Read-Only Reporter Context */}
              <div className="space-y-3">
                <span 
                  className="block text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  REPORTER CONTEXT
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border border-[#242522] bg-[#141513]/10 p-2 rounded-[2px]">
                    <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase">REPORTER</span>
                    <span className="text-[10px] font-mono font-bold text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>CURRENT OPERATOR</span>
                  </div>
                  <div className="border border-[#242522] bg-[#141513]/10 p-2 rounded-[2px]">
                    <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase">IDENTITY STATE</span>
                    <span className="text-[10px] font-mono font-bold text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>FRONTEND PREVIEW</span>
                  </div>
                  <div className="border border-[#242522] bg-[#141513]/10 p-2 rounded-[2px]">
                    <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase">ORGANIZATION</span>
                    <span className="text-[10px] font-mono font-bold text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>NORTHSTAR COMMERCE</span>
                  </div>
                  <div className="border border-[#242522] bg-[#141513]/10 p-2 rounded-[2px]">
                    <span className="block text-[8px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase">MEMBERSHIP AUTHORITY</span>
                    <span className="text-[10px] font-mono font-bold text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>BACKEND REQUIRED</span>
                  </div>
                </div>
              </div>

              {/* AI Preference Checkbox Container */}
              <div className="border border-[#242522] bg-[#141513]/10 p-3 rounded-[2px] space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    id="analyze-after-creation"
                    type="checkbox"
                    checked={analyzeAfter}
                    onChange={(e) => setAnalyzeAfter(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 rounded-[1px] border-[#242522] bg-[#0A0A0A] text-amber-500 focus:ring-amber-500/50 focus:ring-1 cursor-pointer"
                  />
                  <div className="space-y-1">
                    <label 
                      htmlFor="analyze-after-creation"
                      className="block text-[10px] font-mono font-bold tracking-widest text-[#F3F1EA] cursor-pointer"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      ANALYZE AFTER INCIDENT CREATION
                    </label>
                    <p className="text-[9px] font-mono text-[#5C5E58] tracking-wide leading-normal">
                      Optional preference only. The incident must be persisted safely before AI-assisted triage is requested.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-2 border-t border-[#242522]/40 text-[8px] font-mono tracking-widest text-amber-500 uppercase">
                  <span className="w-1 h-1 rounded-full bg-amber-500/60" />
                  <span>AI AUTHORITY / BACKEND REQUIRED</span>
                </div>
              </div>
            </fieldset>

            {/* PRIMARY & SECONDARY ACTIONS */}
            <div className="space-y-4 pt-4 border-t border-[#242522]/60">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 inline-flex justify-center items-center px-4 py-2.5 text-xs font-mono font-bold tracking-widest uppercase border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-[2px] transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  {isSubmitting ? 'VALIDATING...' : 'CREATE INCIDENT'}
                </button>

                <Link
                  to="/app/incidents"
                  className="w-full sm:flex-1 inline-flex justify-center items-center px-4 py-2.5 text-xs font-mono font-bold tracking-widest uppercase border border-[#242522] bg-[#141513]/30 hover:bg-[#141513]/50 text-[#A8AAA3] hover:text-[#F3F1EA] rounded-[2px] transition-colors focus:outline-none focus:ring-1 focus:ring-[#242522]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  CANCEL REPORT
                </Link>
              </div>

              {/* Accessible Live Area */}
              <div id="create-incident-live-status" aria-live="polite" className="text-left">
                {submitStatus === 'success' && (
                  <div className="p-4 border border-amber-500/20 bg-amber-500/5 rounded-[2px] space-y-1.5 animate-fade-in">
                    <h4 
                      className="text-[10px] font-mono font-bold tracking-wider text-amber-500 uppercase"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      INCIDENT CREATION SERVICE NOT CONNECTED
                    </h4>
                    <p className="text-[10px] font-mono text-[#A8AAA3] tracking-wide leading-normal" style={{ fontFamily: 'var(--font-technical)' }}>
                      Frontend validation completed. During backend integration, the incident will be created in the Reported state, an incident_created timeline event will be recorded, and optional AI triage will begin only after persistence succeeds.
                    </p>
                  </div>
                )}
              </div>

              {/* Secondary link back to dashboard */}
              <div className="flex justify-center pt-2">
                <Link 
                  to="/app" 
                  className="text-[10px] font-mono text-[#5C5E58] hover:text-[#A8AAA3] tracking-wider uppercase transition-colors"
                >
                  RETURN TO DASHBOARD
                </Link>
              </div>
            </div>
          </form>

          {/* RIGHT PANEL: Reporting Contract & Live Local Summary */}
          <div 
            className="p-4 sm:p-6 space-y-6 text-left min-w-0 bg-[#141513]/10 [@media(min-width:1050px)]:sticky [@media(min-width:1050px)]:top-20"
          >
            <div>
              <h3 
                className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                REPORTING CONTRACT
              </h3>
              <p className="text-[9px] font-mono text-[#5C5E58] tracking-widest mt-0.5 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                BACKEND REQUIREMENT DEFINITION
              </p>
            </div>

            {/* Technical grid of contract expectations */}
            <div className="space-y-3 font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
              <div className="border-b border-[#242522]/60 pb-2 flex justify-between items-center gap-4">
                <span className="text-[10px] text-[#5C5E58] font-bold uppercase tracking-wider">INITIAL STATUS</span>
                <span className="text-[10px] text-[#A8AAA3] font-bold border border-[#242522] bg-[#141513]/50 px-1.5 py-0.5 rounded-[1px]">REPORTED</span>
              </div>

              <div className="border-b border-[#242522]/60 pb-2 flex justify-between items-center gap-4">
                <span className="text-[10px] text-[#5C5E58] font-bold uppercase tracking-wider">INCIDENT CODE</span>
                <span className="text-[10px] text-[#A8AAA3] font-bold border border-[#242522] bg-[#141513]/50 px-1.5 py-0.5 rounded-[1px]">SERVER GENERATED</span>
              </div>

              <div className="border-b border-[#242522]/60 pb-2 flex justify-between items-center gap-4">
                <span className="text-[10px] text-[#5C5E58] font-bold uppercase tracking-wider">REPORTER</span>
                <span className="text-[10px] text-[#A8AAA3] font-bold border border-[#242522] bg-[#141513]/50 px-1.5 py-0.5 rounded-[1px]">AUTHENTICATED USER</span>
              </div>

              <div className="border-b border-[#242522]/60 pb-2 flex justify-between items-center gap-4">
                <span className="text-[10px] text-[#5C5E58] font-bold uppercase tracking-wider">ORGANIZATION</span>
                <span className="text-[10px] text-[#A8AAA3] font-bold border border-[#242522] bg-[#141513]/50 px-1.5 py-0.5 rounded-[1px]">ACTIVE MEMBERSHIP REQUIRED</span>
              </div>

              <div className="border-b border-[#242522]/60 pb-2 flex justify-between items-center gap-4">
                <span className="text-[10px] text-[#5C5E58] font-bold uppercase tracking-wider">TIMELINE EVENT</span>
                <span className="text-[10px] text-[#A8AAA3] font-bold border border-[#242522] bg-[#141513]/50 px-1.5 py-0.5 rounded-[1px]">INCIDENT_CREATED</span>
              </div>

              <div className="border-b border-[#242522]/60 pb-2 flex justify-between items-center gap-4">
                <span className="text-[10px] text-[#5C5E58] font-bold uppercase tracking-wider">AI TRIAGE</span>
                <span className="text-[10px] text-[#A8AAA3] font-bold border border-[#242522] bg-[#141513]/50 px-1.5 py-0.5 rounded-[1px]">OPTIONAL / AFTER PERSISTENCE</span>
              </div>

              <div className="border-b border-[#242522]/60 pb-2 flex justify-between items-center gap-4">
                <span className="text-[10px] text-[#5C5E58] font-bold uppercase tracking-wider">DUPLICATE PROTECTION</span>
                <span className="text-[10px] text-[#A8AAA3] font-bold border border-[#242522] bg-[#141513]/50 px-1.5 py-0.5 rounded-[1px]">BACKEND REQUIRED</span>
              </div>

              <div className="border-b border-[#242522]/60 pb-2 flex justify-between items-center gap-4">
                <span className="text-[10px] text-[#5C5E58] font-bold uppercase tracking-wider">TENANT ISOLATION</span>
                <span className="text-[10px] text-[#A8AAA3] font-bold border border-[#242522] bg-[#141513]/50 px-1.5 py-0.5 rounded-[1px]">BACKEND REQUIRED</span>
              </div>
            </div>

            {/* Rule 1: PERSIST FIRST. ANALYZE SECOND. */}
            <div className="border border-amber-500/20 bg-amber-500/5 p-3 rounded-[2px] space-y-1">
              <span 
                className="block text-[9px] font-mono font-bold tracking-widest text-amber-500 uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                PERSIST FIRST. ANALYZE SECOND.
              </span>
              <p className="text-[10px] font-mono text-[#A8AAA3] tracking-wide leading-normal" style={{ fontFamily: 'var(--font-technical)' }}>
                AI failure must never delete, block, or make the original incident report unavailable.
              </p>
            </div>

            {/* Rule 2: HUMAN AUTHORITY */}
            <div className="border border-[#242522] bg-[#141513]/30 p-3 rounded-[2px] space-y-1">
              <span 
                className="block text-[9px] font-mono font-bold tracking-widest text-[#F3F1EA] uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                HUMAN AUTHORITY
              </span>
              <p className="text-[10px] font-mono text-[#A8AAA3] tracking-wide leading-normal" style={{ fontFamily: 'var(--font-technical)' }}>
                AI may suggest severity, impact, and response tasks. Authorized humans review and control every operational decision.
              </p>
            </div>

            {/* LOCAL FORM SUMMARY */}
            <div className="border border-[#242522] bg-[#141513]/30 p-4 rounded-[2px] space-y-3 text-left">
              <h4 
                className="text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                LOCAL FORM SUMMARY
              </h4>
              
              <div className="space-y-2.5 font-mono text-[10px]" style={{ fontFamily: 'var(--font-technical)' }}>
                <div>
                  <span className="block text-[#5C5E58] font-bold uppercase tracking-wider text-[8px]">TITLE</span>
                  <span className="text-[#F3F1EA] truncate block">{title.trim() || 'NOT PROVIDED'}</span>
                </div>

                <div>
                  <span className="block text-[#5C5E58] font-bold uppercase tracking-wider text-[8px]">SERVICE</span>
                  <span className="text-[#F3F1EA] block">{service || 'NOT SELECTED'}</span>
                </div>

                <div>
                  <span className="block text-[#5C5E58] font-bold uppercase tracking-wider text-[8px]">OBSERVED START</span>
                  <span className="text-[#F3F1EA] block">{observedStart ? 'LOCAL VALUE PROVIDED' : 'NOT PROVIDED'}</span>
                </div>

                <div>
                  <span className="block text-[#5C5E58] font-bold uppercase tracking-wider text-[8px]">AI PREFERENCE</span>
                  <span className="text-[#F3F1EA] block">
                    {analyzeAfter ? 'REQUEST AFTER CREATION' : 'NOT REQUESTED'}
                  </span>
                </div>

                <div>
                  <span className="block text-[#5C5E58] font-bold uppercase tracking-wider text-[8px]">RECORD STATE</span>
                  <span className="text-[#D6FF3F] font-bold block">NOT CREATED</span>
                </div>
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}
