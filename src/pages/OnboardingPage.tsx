import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/brand/BrandLogo';

type SetupPath = 'create' | 'join';

export function OnboardingPage() {
  // Path selection state: default is 'create'
  const [selectedPath, setSelectedPath] = useState<SetupPath>('create');

  // Input states
  const [organizationName, setOrganizationName] = useState('');
  const [invitationCode, setInvitationCode] = useState('');

  // Validation error states
  const [orgError, setOrgError] = useState('');
  const [inviteError, setInviteError] = useState('');

  // Processing and Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Accessibility Announcement state
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    document.title = 'Workspace Setup — SignalFold';
  }, []);

  // Live input validations
  const validateOrgName = (val: string) => {
    if (!val.trim()) {
      return 'Organization name is required.';
    }
    if (val.trim().length < 2) {
      return 'Organization name must contain at least 2 characters.';
    }
    if (val.length > 80) {
      return 'Organization name cannot exceed 80 characters.';
    }
    return '';
  };

  const validateInviteCode = (val: string) => {
    if (!val.trim()) {
      return 'Invitation link or code is required.';
    }
    return '';
  };

  // Input Handlers
  const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setOrganizationName(val);
    if (orgError) {
      setOrgError(validateOrgName(val));
    }
  };

  const handleInviteCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInvitationCode(val);
    if (inviteError) {
      setInviteError(validateInviteCode(val));
    }
  };

  // Path change handler
  const handlePathChange = (path: SetupPath) => {
    setSelectedPath(path);
    // Clear validation messages when switching but preserve text
    setOrgError('');
    setInviteError('');
    setSubmitMessage('');
    setAnnouncement(`Switched option to ${path === 'create' ? 'Create New Organization' : 'Join Existing Organization'}`);
  };

  // Form Submission Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    if (selectedPath === 'create') {
      const err = validateOrgName(organizationName);
      setOrgError(err);
      if (err) {
        hasError = true;
        setAnnouncement(`Validation failed: ${err}`);
      }
    } else {
      const err = validateInviteCode(invitationCode);
      setInviteError(err);
      if (err) {
        hasError = true;
        setAnnouncement(`Validation failed: ${err}`);
      }
    }

    if (hasError) return;

    // Proceed to process locally
    setIsSubmitting(true);
    setSubmitMessage('');
    setAnnouncement('Validating organization step locally...');

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage(
        'ORGANIZATION STEP VALIDATED\n\nWorkspace creation or invitation verification will be connected during backend integration. Role selection will be added in the next frontend step.'
      );
      setAnnouncement(
        'ORGANIZATION STEP VALIDATED. Workspace creation or invitation verification will be connected during backend integration. Role selection will be added in the next frontend step.'
      );
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F3F1EA] flex flex-col justify-between selection:bg-[#D6FF3F] selection:text-[#0A0A0A] relative overflow-x-hidden p-4 sm:p-6 lg:p-8">
      {/* Background Subtle Grid Accent (Aria-Hidden) */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#141513_1px,transparent_1px),linear-gradient(to_bottom,#141513_1px,transparent_1px)] bg-[size:32px_32px] opacity-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Screen Reader Live Announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Compact System Header */}
      <header className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#242522] w-full gap-4">
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

        {/* Center Indicator */}
        <div
          className="hidden md:block font-mono text-[10px] tracking-widest text-[#A8AAA3] uppercase font-bold"
          style={{ fontFamily: 'var(--font-technical)' }}
        >
          WORKSPACE PROVISIONING
        </div>

        {/* Right Indicator */}
        <div
          className="font-mono text-[10px] tracking-widest text-[#A8AAA3] font-bold uppercase"
          style={{ fontFamily: 'var(--font-technical)' }}
        >
          SETUP STATE <span className="text-[#242522]" aria-hidden="true">/</span> <span className="text-amber-500">INCOMPLETE</span>
        </div>
      </header>

      {/* Main Two-Column Asymmetric Console Layout */}
      <main className="relative z-10 flex-1 my-auto py-12 lg:py-16 max-w-7xl w-full mx-auto grid grid-cols-1 min-[900px]:grid-cols-12 gap-8 min-[900px]:gap-12 items-start">
        
        {/* Left Column: Editorial & Progress Controls */}
        <section
          className="min-[900px]:col-span-6 space-y-8 text-left"
          aria-labelledby="onboarding-main-heading"
        >
          <div className="space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#141513] border border-[#242522]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" aria-hidden="true" />
              <span
                className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase text-[#D6FF3F]"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                ONBOARDING / OPERATING CONTEXT
              </span>
            </div>

            {/* Headline */}
            <h1
              id="onboarding-main-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F3F1EA] leading-[1.05]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ESTABLISH YOUR<br />
              RESPONSE WORKSPACE.
            </h1>

            {/* Supporting Copy */}
            <p
              className="text-base sm:text-lg text-[#A8AAA3] max-w-[520px] leading-relaxed"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Create or join the organization where incidents, responders, tasks, decisions, and postmortems will be coordinated.
            </p>
          </div>

          {/* Three-Step Progress Rail */}
          <div className="space-y-4 pt-6 border-t border-[#242522] max-w-[480px]">
            {/* Step 01 */}
            <div className="flex items-center gap-4 p-3 bg-[#141513] border border-[#D6FF3F]/30 rounded-[2px]">
              <div
                className="font-mono text-xs font-bold text-[#D6FF3F]"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                01
              </div>
              <div className="flex-1">
                <div
                  className="text-[11px] font-mono font-bold tracking-widest text-[#F3F1EA] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  ORGANIZATION
                </div>
                <div
                  className="text-[9px] font-mono font-bold tracking-wider text-[#D6FF3F] uppercase mt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  ACTIVE STEP
                </div>
              </div>
            </div>

            {/* Step 02 */}
            <div className="flex items-center gap-4 p-3 border border-[#242522] rounded-[2px] opacity-60">
              <div
                className="font-mono text-xs font-bold text-[#5C5E58]"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                02
              </div>
              <div className="flex-1">
                <div
                  className="text-[11px] font-mono font-bold tracking-widest text-[#A8AAA3] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  ROLE & USE CASE
                </div>
                <div
                  className="text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase mt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  NEXT STEP
                </div>
              </div>
            </div>

            {/* Step 03 */}
            <div className="flex items-center gap-4 p-3 border border-[#242522] rounded-[2px] opacity-40">
              <div
                className="font-mono text-xs font-bold text-[#5C5E58]"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                03
              </div>
              <div className="flex-1">
                <div
                  className="text-[11px] font-mono font-bold tracking-widest text-[#A8AAA3] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  REVIEW & ENTER
                </div>
                <div
                  className="text-[9px] font-mono font-bold tracking-wider text-[#5C5E58] uppercase mt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  PENDING
                </div>
              </div>
            </div>

            {/* Meta info footer */}
            <div
              className="pt-2 text-[10px] font-mono tracking-widest font-bold text-[#5C5E58] uppercase flex justify-between"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <span>SETUP LIMIT / 3 STEPS</span>
              <span>VERIFIED FRONTEND SHELL</span>
            </div>
          </div>
        </section>

        {/* Right Column: Console Setup Step & Form Controls */}
        <section
          className="min-[900px]:col-span-6 w-full flex flex-col"
          aria-labelledby="onboarding-form-heading"
        >
          <div className="bg-[#141513]/40 border border-[#242522] p-6 sm:p-8 rounded-[2px] w-full space-y-6">
            
            {/* Panel Step Header */}
            <div className="space-y-1 pb-4 border-b border-[#242522] flex justify-between items-end">
              <div>
                <h2
                  id="onboarding-form-heading"
                  className="text-xl sm:text-2xl font-bold text-[#F3F1EA] tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  ORGANIZATION
                </h2>
                <div
                  className="text-[10px] font-mono font-bold tracking-widest text-[#A8AAA3] uppercase mt-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  CREATE OR JOIN A RESPONSE WORKSPACE
                </div>
              </div>
              <div
                className="text-[11px] font-mono font-bold tracking-wider text-[#D6FF3F] bg-[#141513] border border-[#242522] px-2 py-0.5"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                STEP 01 / 03
              </div>
            </div>

            {/* Selection radio path controls behaving as accessible Radio Group */}
            <div className="space-y-2">
              <label
                id="workspace-path-label"
                className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                SELECT PROVISIONING MODE
              </label>
              
              <div
                role="radiogroup"
                aria-labelledby="workspace-path-label"
                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              >
                {/* Create Path Radio Control */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={selectedPath === 'create'}
                  onClick={() => handlePathChange('create')}
                  className={`px-4 py-3 text-[11px] font-mono font-bold tracking-widest text-left rounded-[2px] border transition-all cursor-pointer select-none outline-none ${
                    selectedPath === 'create'
                      ? 'bg-[#141513] border-[#D6FF3F] text-[#D6FF3F]'
                      : 'bg-transparent border-[#242522] text-[#A8AAA3] hover:border-[#5C5E58] hover:text-[#F3F1EA]'
                  } focus-visible:ring-2 focus-visible:ring-[#4B78FF]`}
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedPath === 'create' ? 'border-[#D6FF3F]' : 'border-[#5C5E58]'
                      }`}
                    >
                      {selectedPath === 'create' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" />
                      )}
                    </span>
                    <span>CREATE NEW</span>
                  </div>
                </button>

                {/* Join Path Radio Control */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={selectedPath === 'join'}
                  onClick={() => handlePathChange('join')}
                  className={`px-4 py-3 text-[11px] font-mono font-bold tracking-widest text-left rounded-[2px] border transition-all cursor-pointer select-none outline-none ${
                    selectedPath === 'join'
                      ? 'bg-[#141513] border-[#D6FF3F] text-[#D6FF3F]'
                      : 'bg-transparent border-[#242522] text-[#A8AAA3] hover:border-[#5C5E58] hover:text-[#F3F1EA]'
                  } focus-visible:ring-2 focus-visible:ring-[#4B78FF]`}
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedPath === 'join' ? 'border-[#D6FF3F]' : 'border-[#5C5E58]'
                      }`}
                    >
                      {selectedPath === 'join' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" />
                      )}
                    </span>
                    <span>JOIN EXISTING</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Informational Announcement Message */}
            {submitMessage && (
              <div
                className="p-4 bg-[#141513] border border-amber-500/20 text-amber-200 rounded-[2px] text-xs font-mono tracking-wide leading-relaxed whitespace-pre-line"
                style={{ fontFamily: 'var(--font-technical)' }}
                role="status"
              >
                {submitMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              
              {/* Conditional Content based on selectedPath */}
              {selectedPath === 'create' ? (
                /* Create Organization Form Field */
                <div className="space-y-1.5">
                  <label
                    htmlFor="organization-name-input"
                    className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    ORGANIZATION NAME
                  </label>
                  <div className="relative">
                    <input
                      id="organization-name-input"
                      type="text"
                      autoComplete="organization"
                      value={organizationName}
                      onChange={handleOrgNameChange}
                      disabled={isSubmitting}
                      placeholder="Northstar Commerce"
                      className={`w-full px-3.5 py-3 text-sm bg-[#0A0A0A] text-[#F3F1EA] rounded-[2px] border ${
                        orgError
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                          : 'border-[#242522] focus:border-[#D6FF3F] focus:ring-1 focus:ring-[#D6FF3F]'
                      } outline-none transition-all placeholder-[#5C5E58] font-sans h-11`}
                      style={{ fontFamily: 'var(--font-ui)' }}
                      aria-describedby={orgError ? 'org-name-error' : 'org-name-helper'}
                      aria-invalid={!!orgError}
                      required
                    />
                  </div>
                  
                  {orgError ? (
                    <p
                      id="org-name-error"
                      className="text-xs text-rose-500 font-mono tracking-wide mt-1"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      {orgError}
                    </p>
                  ) : (
                    <p
                      id="org-name-helper"
                      className="text-[10px] text-[#5C5E58] font-sans leading-normal"
                    >
                      This name identifies the workspace shared by your incident-response team.
                    </p>
                  )}

                  {/* Technical Preview Row for Create State */}
                  <div className="pt-4 mt-2 border-t border-[#242522] grid grid-cols-2 gap-4 text-[9px] font-mono tracking-widest text-[#5C5E58] uppercase">
                    <div>
                      <div className="text-[8px] text-[#5C5E58] mb-0.5">WORKSPACE RECORD</div>
                      <div className="font-bold text-[#A8AAA3]">NOT CREATED</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-[#5C5E58] mb-0.5">INITIAL MEMBERSHIP</div>
                      <div className="font-bold text-[#D6FF3F]">ORGANIZATION ADMIN</div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Join Organization Form Field */
                <div className="space-y-1.5">
                  <label
                    htmlFor="invitation-code-input"
                    className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    WORKSPACE INVITATION
                  </label>
                  <div className="relative">
                    <input
                      id="invitation-code-input"
                      type="text"
                      value={invitationCode}
                      onChange={handleInviteCodeChange}
                      disabled={isSubmitting}
                      placeholder="Paste an invitation link or code"
                      className={`w-full px-3.5 py-3 text-sm bg-[#0A0A0A] text-[#F3F1EA] rounded-[2px] border ${
                        inviteError
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                          : 'border-[#242522] focus:border-[#D6FF3F] focus:ring-1 focus:ring-[#D6FF3F]'
                      } outline-none transition-all placeholder-[#5C5E58] font-sans h-11`}
                      style={{ fontFamily: 'var(--font-ui)' }}
                      aria-describedby={inviteError ? 'invite-code-error' : 'invite-code-helper'}
                      aria-invalid={!!inviteError}
                      required
                    />
                  </div>

                  {inviteError ? (
                    <p
                      id="invite-code-error"
                      className="text-xs text-rose-500 font-mono tracking-wide mt-1"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      {inviteError}
                    </p>
                  ) : (
                    <p
                      id="invite-code-helper"
                      className="text-[10px] text-[#5C5E58] font-sans leading-normal"
                    >
                      An authorized organization invitation is required to join an existing workspace.
                    </p>
                  )}

                  {/* Technical Preview Row for Join State */}
                  <div className="pt-4 mt-2 border-t border-[#242522] grid grid-cols-2 gap-4 text-[9px] font-mono tracking-widest text-[#5C5E58] uppercase">
                    <div>
                      <div className="text-[8px] text-[#5C5E58] mb-0.5">INVITATION STATUS</div>
                      <div className="font-bold text-[#A8AAA3]">NOT VERIFIED</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-[#5C5E58] mb-0.5">MEMBERSHIP</div>
                      <div className="font-bold text-amber-500">PENDING ACCEPTANCE</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Primary Submit Control Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-mono font-bold tracking-widest bg-[#F3F1EA] text-[#0A0A0A] hover:bg-[#D6FF3F] hover:text-[#0A0A0A] rounded-[2px] border border-[#F3F1EA] hover:border-[#D6FF3F] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#4B78FF] disabled:opacity-50 disabled:cursor-not-allowed select-none text-center cursor-pointer min-h-[44px]"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                {isSubmitting ? 'PROCESSING...' : 'CONTINUE TO ROLE'}
              </button>
            </form>

            {/* Secondary Link Actions */}
            <div className="pt-4 border-t border-[#242522] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] font-mono tracking-widest font-bold">
              <Link
                to="/signup"
                className="text-[#A8AAA3] hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[1px] uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                BACK TO ACCOUNT CREATION
              </Link>
              
              <Link
                to="/"
                className="text-[#5C5E58] hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[1px] uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                RETURN HOME
              </Link>
            </div>

          </div>
        </section>
      </main>

      {/* Bottom System Rail */}
      <footer className="relative z-10 w-full mt-auto pt-6 border-t border-[#242522] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[9px] sm:text-[10px] text-[#5C5E58] tracking-widest uppercase">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1" style={{ fontFamily: 'var(--font-technical)' }}>
          <span>SIGNALFOLD</span>
          <span className="text-[#242522]" aria-hidden="true">/</span>
          <span>WORKSPACE SETUP</span>
        </div>
        
        <div className="hidden md:flex items-center gap-2" style={{ fontFamily: 'var(--font-technical)' }}>
          <span>ORGANIZATION RECORD PENDING</span>
        </div>

        <div className="flex items-center gap-2 text-[#A8AAA3] font-bold" style={{ fontFamily: 'var(--font-technical)' }}>
          <span>STEP 01 OF 03</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
        </div>
      </footer>
    </div>
  );
}
