import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/brand/BrandLogo';

type SetupPath = 'create' | 'join';

export function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Entry status state for Step 3 Workspace entry
  const [entryStatus, setEntryStatus] = useState<'idle' | 'preparing' | 'not-connected'>('idle');

  // Path selection state: default is 'create'
  const [selectedPath, setSelectedPath] = useState<SetupPath>('create');

  // Step 1 Input states
  const [organizationName, setOrganizationName] = useState('');
  const [invitationCode, setInvitationCode] = useState('');

  // Step 1 Validation error states
  const [orgError, setOrgError] = useState('');
  const [inviteError, setInviteError] = useState('');

  // Step 2 Input states
  const [primaryRole, setPrimaryRole] = useState<string>(''); // Default: no role selected
  const [primaryUseCase, setPrimaryUseCase] = useState<string>(''); // Default: no use case selected
  const [teamOrFunction, setTeamOrFunction] = useState<string>(''); // Optional, max 80 chars

  // Step 2 Validation error states
  const [roleError, setRoleError] = useState('');
  const [useCaseError, setUseCaseError] = useState('');

  // Processing and Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Accessibility Announcement state
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    document.title = 'Workspace Setup — SignalFold';
  }, []);

  // Live input validations for Step 1
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
    setOrgError('');
    setInviteError('');
    setSubmitMessage('');
    setAnnouncement(`Switched option to ${path === 'create' ? 'Create New Organization' : 'Join Existing Organization'}`);
  };

  // Step 1 Submit Handler
  const handleStep1Submit = (e: React.FormEvent) => {
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

    setIsSubmitting(true);
    setSubmitMessage('');
    setAnnouncement('Validating organization step locally...');

    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep(2);
      setAnnouncement('Organization step validated. Switched to Step 2: Role and Use Case selection.');
    }, 800);
  };

  // Step 2 Submit Handler
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    if (!primaryRole) {
      setRoleError('Please select a primary operating role.');
      hasError = true;
    } else {
      setRoleError('');
    }

    if (!primaryUseCase) {
      setUseCaseError('Please select a primary use case.');
      hasError = true;
    } else {
      setUseCaseError('');
    }

    if (hasError) {
      setAnnouncement('Validation failed on Step 2. Please select the required fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');
    setAnnouncement('Validating role step locally...');

    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep(3);
      setAnnouncement('Role step validated. Switched to Step 3: Review and Enter.');
    }, 800);
  };

  // Step transitions
  const handleBackToOrganization = () => {
    setCurrentStep(1);
    setSubmitMessage('');
    setAnnouncement('Returned to Step 1: Organization Setup.');
  };

  const roleOptions = [
    {
      id: 'REPORTER',
      label: 'REPORTER',
      description: 'Report incidents, add operational context, and follow response progress.',
    },
    {
      id: 'RESPONDER',
      label: 'RESPONDER',
      description: 'Claim response tasks, provide updates, and coordinate technical work.',
    },
    {
      id: 'INCIDENT MANAGER',
      label: 'INCIDENT MANAGER',
      description: 'Direct response activity, confirm severity, assign ownership, and verify resolution.',
    },
    {
      id: 'ORGANIZATION ADMIN',
      label: 'ORGANIZATION ADMIN',
      description: 'Manage the workspace, team access, services, and operating configuration.',
    },
  ];

  const useCaseOptions = [
    {
      id: 'INCIDENT REPORTING',
      label: 'INCIDENT REPORTING',
      description: 'Capture scattered reports and turn them into structured incident records.',
    },
    {
      id: 'RESPONSE COORDINATION',
      label: 'RESPONSE COORDINATION',
      description: 'Organize severity, ownership, response tasks, and realtime activity.',
    },
    {
      id: 'TECHNICAL RESPONSE',
      label: 'TECHNICAL RESPONSE',
      description: 'Investigate service impact, claim tasks, and document recovery evidence.',
    },
    {
      id: 'OPERATIONAL OVERSIGHT',
      label: 'OPERATIONAL OVERSIGHT',
      description: 'Maintain visibility across active incidents, responders, and follow-up actions.',
    },
  ];

  const getShortenedInvitation = (code: string) => {
    if (!code) return 'NOT PROVIDED';
    let displayCode = code.trim();
    try {
      const url = new URL(displayCode);
      displayCode = url.origin + url.pathname;
    } catch (e) {
      // Not a valid URL, just plain string
    }
    if (displayCode.length > 24) {
      return displayCode.substring(0, 24) + '...';
    }
    return displayCode;
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
          {currentStep === 1 && (
            <>
              SETUP STATE <span className="text-[#242522]" aria-hidden="true">/</span> <span className="text-amber-500">INCOMPLETE</span>
            </>
          )}
          {currentStep === 2 && (
            <>
              SETUP STATE <span className="text-[#242522]" aria-hidden="true">/</span> <span className="text-[#D6FF3F]">STEP 02 ACTIVE</span>
            </>
          )}
          {currentStep === 3 && (
            <>
              SETUP STATE <span className="text-[#242522]" aria-hidden="true">/</span> <span className="text-amber-500">REVIEW REQUIRED</span>
            </>
          )}
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
            <div className={`flex items-center gap-4 p-3 rounded-[2px] border ${
              currentStep === 1 
                ? 'bg-[#141513] border-[#D6FF3F]/30' 
                : 'border-[#242522]/60 bg-[#141513]/10 text-amber-500/80'
            }`}>
              <div
                className={`font-mono text-xs font-bold ${currentStep === 1 ? 'text-[#D6FF3F]' : 'text-amber-500'}`}
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                01
              </div>
              <div className="flex-1">
                <div
                  className={`text-[11px] font-mono font-bold tracking-widest uppercase ${currentStep === 1 ? 'text-[#F3F1EA]' : 'text-[#A8AAA3]'}`}
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  ORGANIZATION
                </div>
                <div
                  className={`text-[9px] font-mono font-bold tracking-wider uppercase mt-0.5 ${currentStep === 1 ? 'text-[#D6FF3F]' : 'text-amber-500'}`}
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  {currentStep === 1 ? 'ACTIVE STEP' : 'VALIDATED LOCALLY'}
                </div>
              </div>
            </div>

            {/* Step 02 */}
            <div className={`flex items-center gap-4 p-3 rounded-[2px] border ${
              currentStep === 2 
                ? 'bg-[#141513] border-[#D6FF3F]/30' 
                : currentStep === 3
                ? 'border-[#242522]/60 bg-[#141513]/10 text-amber-500/80'
                : 'border-[#242522] opacity-60'
            }`}>
              <div
                className={`font-mono text-xs font-bold ${currentStep === 2 ? 'text-[#D6FF3F]' : currentStep === 3 ? 'text-amber-500' : 'text-[#5C5E58]'}`}
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                02
              </div>
              <div className="flex-1">
                <div
                  className={`text-[11px] font-mono font-bold tracking-widest uppercase ${currentStep === 2 ? 'text-[#F3F1EA]' : 'text-[#A8AAA3]'}`}
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  ROLE & USE CASE
                </div>
                <div
                  className={`text-[9px] font-mono font-bold tracking-wider uppercase mt-0.5 ${currentStep === 2 ? 'text-[#D6FF3F]' : currentStep === 3 ? 'text-amber-500' : 'text-[#5C5E58]'}`}
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  {currentStep === 2 ? 'ACTIVE STEP' : currentStep === 3 ? 'VALIDATED LOCALLY' : 'NEXT STEP'}
                </div>
              </div>
            </div>

            {/* Step 03 */}
            <div className={`flex items-center gap-4 p-3 rounded-[2px] border ${
              currentStep === 3 
                ? 'bg-[#141513] border-[#D6FF3F]/30' 
                : 'border-[#242522] opacity-40'
            }`}>
              <div
                className={`font-mono text-xs font-bold ${currentStep === 3 ? 'text-[#D6FF3F]' : 'text-[#5C5E58]'}`}
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
                  className={`text-[9px] font-mono font-bold tracking-wider uppercase mt-0.5 ${currentStep === 3 ? 'text-[#D6FF3F]' : 'text-[#5C5E58]'}`}
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  {currentStep === 3 ? 'ACTIVE STEP' : currentStep === 2 ? 'NEXT STEP' : 'PENDING'}
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
          {currentStep === 1 ? (
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
              <form onSubmit={handleStep1Submit} className="space-y-6" noValidate>
                
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
                    <div className="pt-4 mt-2 border-t border-[#242522] grid grid-cols-2 gap-4 text-[9px] font-mono tracking-widest text-[#5C5E58] uppercase font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                      <div>
                        <div className="text-[8px] text-[#5C5E58] mb-0.5 font-mono">WORKSPACE RECORD</div>
                        <div className="font-bold text-[#A8AAA3] font-mono">NOT CREATED</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-[#5C5E58] mb-0.5 font-mono">INITIAL MEMBERSHIP</div>
                        <div className="font-bold text-[#D6FF3F] font-mono">ORGANIZATION ADMIN</div>
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
                    <div className="pt-4 mt-2 border-t border-[#242522] grid grid-cols-2 gap-4 text-[9px] font-mono tracking-widest text-[#5C5E58] uppercase font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                      <div>
                        <div className="text-[8px] text-[#5C5E58] mb-0.5 font-mono">INVITATION STATUS</div>
                        <div className="font-bold text-[#A8AAA3] font-mono">NOT VERIFIED</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-[#5C5E58] mb-0.5 font-mono">MEMBERSHIP</div>
                        <div className="font-bold text-amber-500 font-mono">PENDING ACCEPTANCE</div>
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
                  to={{ pathname: "/signup", hash: "" }}
                  className="text-[#A8AAA3] hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[1px] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  BACK TO ACCOUNT CREATION
                </Link>
                
                <Link
                  to={{ pathname: "/", hash: "" }}
                  className="text-[#5C5E58] hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[1px] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  RETURN HOME
                </Link>
              </div>
            </div>
          ) : currentStep === 2 ? (
            <div className="bg-[#141513]/40 border border-[#242522] p-6 sm:p-8 rounded-[2px] w-full space-y-6">
              {/* Panel Step Header */}
              <div className="space-y-1 pb-4 border-b border-[#242522] flex justify-between items-end">
                <div>
                  <h2
                    id="onboarding-form-heading"
                    className="text-xl sm:text-2xl font-bold text-[#F3F1EA] tracking-tight uppercase"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    ROLE & USE CASE
                  </h2>
                  <div
                    className="text-[10px] font-mono font-bold tracking-widest text-[#A8AAA3] uppercase mt-0.5"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    DEFINE YOUR OPERATING CONTEXT
                  </div>
                </div>
                <div
                  className="text-[11px] font-mono font-bold tracking-wider text-[#D6FF3F] bg-[#141513] border border-[#242522] px-2 py-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  STEP 02 / 03
                </div>
              </div>

              {/* Explanatory Message */}
              <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
                These selections personalize the frontend workspace preview. Final membership permissions will be assigned and enforced during backend integration.
              </p>

              {/* Informational Live Announcement / Validation Message */}
              {submitMessage && (
                <div
                  className="p-4 bg-[#141513] border border-amber-500/20 text-amber-200 rounded-[2px] text-xs font-mono tracking-wide leading-relaxed whitespace-pre-line"
                  style={{ fontFamily: 'var(--font-technical)' }}
                  role="status"
                >
                  {submitMessage}
                </div>
              )}

              {/* Step 2 Form */}
              <form onSubmit={handleStep2Submit} className="space-y-6" noValidate>
                {/* PRIMARY OPERATING ROLE Radio Group */}
                <fieldset className="space-y-3" aria-invalid={!!roleError} aria-describedby={roleError ? "role-error-message" : undefined}>
                  <legend className="text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase block mb-2" style={{ fontFamily: 'var(--font-technical)' }}>
                    PRIMARY OPERATING ROLE
                  </legend>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roleOptions.map((opt) => {
                      const isSelected = primaryRole === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={`flex flex-col p-4 rounded-[2px] border text-left cursor-pointer transition-all select-none relative focus-within:ring-2 focus-within:ring-[#4B78FF] ${
                            isSelected
                              ? 'bg-[#141513] border-[#D6FF3F] text-[#F3F1EA]'
                              : 'bg-transparent border-[#242522] text-[#A8AAA3] hover:border-[#5C5E58] hover:text-[#F3F1EA]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="primaryRole"
                            value={opt.id}
                            checked={isSelected}
                            onChange={() => {
                              setPrimaryRole(opt.id);
                              setRoleError('');
                            }}
                            className="sr-only"
                          />
                          <span className="flex items-center gap-2 text-[11px] font-mono font-bold tracking-widest uppercase mb-1" style={{ fontFamily: 'var(--font-technical)' }}>
                            <span className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#D6FF3F]' : 'border-[#5C5E58]'}`}>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" />}
                            </span>
                            <span>{opt.label}</span>
                          </span>
                          <span className="text-xs font-sans text-[#A8AAA3] leading-normal pl-5">
                            {opt.description}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {roleError && (
                    <p id="role-error-message" className="text-xs text-rose-500 font-mono tracking-wide mt-1" style={{ fontFamily: 'var(--font-technical)' }}>
                      {roleError}
                    </p>
                  )}
                </fieldset>

                {/* PRIMARY USE CASE Radio Group */}
                <fieldset className="space-y-3" aria-invalid={!!useCaseError} aria-describedby={useCaseError ? "use-case-error-message" : undefined}>
                  <legend className="text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase block mb-2" style={{ fontFamily: 'var(--font-technical)' }}>
                    PRIMARY USE CASE
                  </legend>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {useCaseOptions.map((opt) => {
                      const isSelected = primaryUseCase === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={`flex flex-col p-4 rounded-[2px] border text-left cursor-pointer transition-all select-none relative focus-within:ring-2 focus-within:ring-[#4B78FF] ${
                            isSelected
                              ? 'bg-[#141513] border-[#D6FF3F] text-[#F3F1EA]'
                              : 'bg-transparent border-[#242522] text-[#A8AAA3] hover:border-[#5C5E58] hover:text-[#F3F1EA]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="primaryUseCase"
                            value={opt.id}
                            checked={isSelected}
                            onChange={() => {
                              setPrimaryUseCase(opt.id);
                              setUseCaseError('');
                            }}
                            className="sr-only"
                          />
                          <span className="flex items-center gap-2 text-[11px] font-mono font-bold tracking-widest uppercase mb-1" style={{ fontFamily: 'var(--font-technical)' }}>
                            <span className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#D6FF3F]' : 'border-[#5C5E58]'}`}>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" />}
                            </span>
                            <span>{opt.label}</span>
                          </span>
                          <span className="text-xs font-sans text-[#A8AAA3] leading-normal pl-5">
                            {opt.description}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {useCaseError && (
                    <p id="use-case-error-message" className="text-xs text-rose-500 font-mono tracking-wide mt-1" style={{ fontFamily: 'var(--font-technical)' }}>
                      {useCaseError}
                    </p>
                  )}
                </fieldset>

                {/* OPTIONAL PROFILE CONTEXT - TEAM OR FUNCTION */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="team-or-function-input"
                    className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    TEAM OR FUNCTION
                  </label>
                  <div className="relative">
                    <input
                      id="team-or-function-input"
                      type="text"
                      value={teamOrFunction}
                      onChange={(e) => {
                        if (e.target.value.length <= 80) {
                          setTeamOrFunction(e.target.value);
                        }
                      }}
                      disabled={isSubmitting}
                      placeholder="Platform Engineering"
                      className="w-full px-3.5 py-3 text-sm bg-[#0A0A0A] text-[#F3F1EA] rounded-[2px] border border-[#242522] focus:border-[#D6FF3F] focus:ring-1 focus:ring-[#D6FF3F] outline-none transition-all placeholder-[#5C5E58] font-sans h-11"
                      style={{ fontFamily: 'var(--font-ui)' }}
                      aria-describedby="team-or-function-helper"
                    />
                  </div>
                  <p
                    id="team-or-function-helper"
                    className="text-[10px] text-[#5C5E58] font-sans leading-normal"
                  >
                    Optional. Used only to personalize the frontend workspace preview.
                  </p>
                </div>

                {/* CONTEXT PREVIEW */}
                <div className="pt-4 border-t border-[#242522] space-y-3 font-mono text-[9px] sm:text-[10px] tracking-widest text-[#5C5E58] uppercase font-mono" style={{ fontFamily: 'var(--font-technical)' }}>
                  <div className="grid grid-cols-2 gap-4 font-mono">
                    <div>
                      <div className="text-[8px] text-[#5C5E58] mb-0.5 font-mono">SELECTED ROLE</div>
                      <div className={`font-bold font-mono ${primaryRole ? 'text-[#F3F1EA]' : 'text-[#A8AAA3]'}`}>
                        {primaryRole || 'NOT SELECTED'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[8px] text-[#5C5E58] mb-0.5 font-mono">PRIMARY USE CASE</div>
                      <div className={`font-bold font-mono ${primaryUseCase ? 'text-[#F3F1EA]' : 'text-[#A8AAA3]'}`}>
                        {primaryUseCase || 'NOT SELECTED'}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 font-mono">
                    <div>
                      <div className="text-[8px] text-[#5C5E58] mb-0.5 font-mono">PERMISSION STATE</div>
                      <div className="font-bold text-amber-500/80 font-mono">NOT ASSIGNED</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-[#5C5E58] mb-0.5 font-mono">PROFILE RECORD</div>
                      <div className="font-bold text-[#A8AAA3] font-mono">NOT CREATED</div>
                    </div>
                  </div>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-mono font-bold tracking-widest bg-[#F3F1EA] text-[#0A0A0A] hover:bg-[#D6FF3F] hover:text-[#0A0A0A] rounded-[2px] border border-[#F3F1EA] hover:border-[#D6FF3F] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#4B78FF] disabled:opacity-50 disabled:cursor-not-allowed select-none text-center cursor-pointer min-h-[44px]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  {isSubmitting ? 'PROCESSING...' : 'CONTINUE TO REVIEW'}
                </button>
              </form>

              {/* Secondary actions & back-navigation */}
              <div className="pt-4 border-t border-[#242522] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] font-mono tracking-widest font-bold">
                <button
                  type="button"
                  onClick={handleBackToOrganization}
                  className="text-[#A8AAA3] hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[1px] uppercase cursor-pointer"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  BACK TO ORGANIZATION
                </button>
                
                <Link
                  to={{ pathname: "/", hash: "" }}
                  className="text-[#5C5E58] hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[1px] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  RETURN HOME
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-[#141513]/40 border border-[#242522] p-6 sm:p-8 rounded-[2px] w-full space-y-8 text-left">
              {/* Panel Step Header */}
              <div className="space-y-1 pb-4 border-b border-[#242522] flex justify-between items-end">
                <div>
                  <h2
                    id="onboarding-form-heading"
                    className="text-xl sm:text-2xl font-bold text-[#F3F1EA] tracking-tight uppercase"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    REVIEW & ENTER
                  </h2>
                  <div
                    className="text-[10px] font-mono font-bold tracking-widest text-[#A8AAA3] uppercase mt-0.5"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    VERIFY YOUR WORKSPACE CONTEXT
                  </div>
                </div>
                <div
                  className="text-[11px] font-mono font-bold tracking-wider text-[#D6FF3F] bg-[#141513] border border-[#242522] px-2 py-0.5"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  STEP 03 / 03
                </div>
              </div>

              {/* Introductory Copy */}
              <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
                Review the frontend setup summary before entering the SignalFold application shell. No organization, membership, or permission record has been created yet.
              </p>

              {/* ORGANIZATION SUMMARY */}
              <section aria-labelledby="org-review-heading" className="space-y-4 pt-4 border-t border-[#242522]">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <h3 id="org-review-heading" className="text-xs font-mono font-bold tracking-widest text-[#D6FF3F] uppercase">
                    01 / ORGANIZATION
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1);
                      setSubmitMessage('');
                      setEntryStatus('idle');
                      setAnnouncement('Returned to Step 1: Organization Setup.');
                    }}
                    aria-label="Edit Organization Setup"
                    className="text-[10px] font-mono font-bold tracking-widest text-[#A8AAA3] hover:text-[#D6FF3F] transition-colors uppercase cursor-pointer min-h-[36px] px-2 flex items-center focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[1px]"
                  >
                    EDIT ORGANIZATION
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[11px] tracking-wider uppercase">
                  <div className="space-y-1">
                    <div className="text-[9px] text-[#5C5E58] font-mono tracking-widest">PROVISIONING MODE</div>
                    <div className="font-bold text-[#F3F1EA]">
                      {selectedPath === 'create' ? 'CREATE NEW ORGANIZATION' : 'JOIN EXISTING ORGANIZATION'}
                    </div>
                  </div>

                  {selectedPath === 'create' ? (
                    <>
                      <div className="space-y-1">
                        <div className="text-[9px] text-[#5C5E58] font-mono tracking-widest">ORGANIZATION NAME</div>
                        <div className="font-bold text-[#F3F1EA] break-all whitespace-pre-wrap">
                          {organizationName || 'NOT PROVIDED'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[9px] text-[#5C5E58] font-mono tracking-widest">EXPECTED INITIAL MEMBERSHIP</div>
                        <div className="font-bold text-[#D6FF3F]">ORGANIZATION ADMIN</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[9px] text-[#5C5E58] font-mono tracking-widest">RECORD STATE</div>
                        <div className="font-bold text-[#5C5E58]">NOT CREATED</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <div className="text-[9px] text-[#5C5E58] font-mono tracking-widest">WORKSPACE INVITATION</div>
                        <div className="font-bold text-[#F3F1EA] break-all whitespace-pre-wrap">
                          {getShortenedInvitation(invitationCode)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[9px] text-[#5C5E58] font-mono tracking-widest">INVITATION STATE</div>
                        <div className="font-bold text-[#5C5E58]">NOT VERIFIED</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[9px] text-[#5C5E58] font-mono tracking-widest">MEMBERSHIP STATE</div>
                        <div className="font-bold text-amber-500">PENDING ACCEPTANCE</div>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* ROLE AND USE-CASE SUMMARY */}
              <section aria-labelledby="role-review-heading" className="space-y-4 pt-6 border-t border-[#242522]">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <h3 id="role-review-heading" className="text-xs font-mono font-bold tracking-widest text-[#D6FF3F] uppercase">
                    02 / OPERATING CONTEXT
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(2);
                      setSubmitMessage('');
                      setEntryStatus('idle');
                      setAnnouncement('Returned to Step 2: Role and Use Case Setup.');
                    }}
                    aria-label="Edit Role and Use Case Setup"
                    className="text-[10px] font-mono font-bold tracking-widest text-[#A8AAA3] hover:text-[#D6FF3F] transition-colors uppercase cursor-pointer min-h-[36px] px-2 flex items-center focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[1px]"
                  >
                    EDIT ROLE & USE CASE
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[11px] tracking-wider uppercase">
                  <div className="space-y-1">
                    <div className="text-[9px] text-[#5C5E58] font-mono tracking-widest">PRIMARY OPERATING ROLE</div>
                    <div className="font-bold text-[#F3F1EA]">{primaryRole || 'NOT PROVIDED'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] text-[#5C5E58] font-mono tracking-widest">PRIMARY USE CASE</div>
                    <div className="font-bold text-[#F3F1EA]">{primaryUseCase || 'NOT PROVIDED'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] text-[#5C5E58] font-mono tracking-widest">TEAM OR FUNCTION</div>
                    <div className="font-bold text-[#F3F1EA] break-all whitespace-pre-wrap">{teamOrFunction.trim() ? teamOrFunction : 'NOT PROVIDED'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] text-[#5C5E58] font-mono tracking-widest">PERMISSION STATE</div>
                    <div className="font-bold text-amber-500/80">NOT ASSIGNED</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] text-[#5C5E58] font-mono tracking-widest">PROFILE RECORD</div>
                    <div className="font-bold text-[#5C5E58]">NOT CREATED</div>
                  </div>
                </div>
              </section>

              {/* AUTHORITY NOTICE */}
              <section aria-labelledby="authority-notice-heading" className="p-4 bg-[#141513] border border-[#242522] rounded-[2px] space-y-1">
                <h4 id="authority-notice-heading" className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  FRONTEND CONTEXT ONLY
                </h4>
                <p className="text-[11px] text-[#A8AAA3] font-sans leading-relaxed">
                  Role and use-case selections personalize the current interface preview. Authoritative membership, tenant access, and permissions will be created and enforced by the backend.
                </p>
              </section>

              {/* READINESS CHECKLIST */}
              <section aria-labelledby="readiness-checklist-heading" className="space-y-3 pt-6 border-t border-[#242522]">
                <h3 id="readiness-checklist-heading" className="text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase">
                  SETUP READINESS CHECKLIST
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'ORGANIZATION CONTEXT', status: 'READY FOR INTEGRATION', type: 'lime' },
                    { label: 'OPERATING ROLE', status: 'READY FOR INTEGRATION', type: 'lime' },
                    { label: 'PRIMARY USE CASE', status: 'READY FOR INTEGRATION', type: 'lime' },
                    { label: 'MEMBERSHIP AUTHORITY', status: 'BACKEND REQUIRED', type: 'amber' },
                    { label: 'DATA PERSISTENCE', status: 'BACKEND REQUIRED', type: 'amber' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-[#242522]/40 text-[11px] flex-wrap gap-2">
                      <span className="font-mono text-[#A8AAA3] tracking-wide">{item.label}</span>
                      <span className={`font-mono text-[10px] tracking-wider font-bold px-2 py-0.5 border rounded-[1px] ${
                        item.type === 'lime'
                          ? 'border-[#D6FF3F]/20 bg-[#D6FF3F]/5 text-[#D6FF3F]'
                          : 'border-amber-500/20 bg-amber-500/5 text-amber-500'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* ARIA-LIVE INFORMATIONAL STATUS */}
              {entryStatus === 'not-connected' && (
                <div
                  aria-live="assertive"
                  className="p-4 bg-[#141513] border border-amber-500/20 text-amber-200 rounded-[2px] text-xs font-mono tracking-wide leading-relaxed space-y-1"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  <div className="font-bold text-amber-500 uppercase tracking-widest">
                    WORKSPACE ENTRY NOT CONNECTED
                  </div>
                  <p className="text-[11px] text-[#A8AAA3] font-sans leading-normal">
                    The onboarding interface is complete. Organization creation, membership assignment, and dashboard entry will be enabled during backend integration.
                  </p>
                </div>
              )}

              {/* Actions & Submission form */}
              <div className="space-y-4 pt-4 border-t border-[#242522]">
                <button
                  type="button"
                  disabled={entryStatus === 'preparing'}
                  onClick={() => {
                    setEntryStatus('preparing');
                    setAnnouncement('Preparing workspace preview...');
                    setTimeout(() => {
                      setEntryStatus('not-connected');
                      setAnnouncement('WORKSPACE ENTRY NOT CONNECTED. The onboarding interface is complete. Organization creation, membership assignment, and dashboard entry will be enabled during backend integration.');
                    }, 800);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-mono font-bold tracking-widest bg-[#F3F1EA] text-[#0A0A0A] hover:bg-[#D6FF3F] hover:text-[#0A0A0A] rounded-[2px] border border-[#F3F1EA] hover:border-[#D6FF3F] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#4B78FF] disabled:opacity-50 disabled:cursor-not-allowed select-none text-center cursor-pointer min-h-[44px]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  {entryStatus === 'preparing' ? 'PREPARING WORKSPACE PREVIEW...' : 'ENTER WORKSPACE'}
                </button>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] font-mono tracking-widest font-bold pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(2);
                      setSubmitMessage('');
                      setEntryStatus('idle');
                      setAnnouncement('Returned to Step 2: Role and Use Case Setup.');
                    }}
                    className="text-[#A8AAA3] hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[1px] uppercase cursor-pointer min-h-[36px]"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    BACK TO ROLE & USE CASE
                  </button>
                  
                  <Link
                    to={{ pathname: "/", hash: "" }}
                    className="text-[#5C5E58] hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[1px] uppercase min-h-[36px] flex items-center"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    RETURN HOME
                  </Link>
                </div>
              </div>
            </div>
          )}
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
          {currentStep === 1 ? (
            <span>ORGANIZATION RECORD PENDING</span>
          ) : currentStep === 2 ? (
            <span>ROLE CONTEXT PENDING AUTHORITY</span>
          ) : (
            <span>REVIEW COMPLETE / AUTHORITY PENDING</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[#A8AAA3] font-bold" style={{ fontFamily: 'var(--font-technical)' }}>
          {currentStep === 1 ? (
            <>
              <span>STEP 01 OF 03</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
            </>
          ) : currentStep === 2 ? (
            <>
              <span>STEP 02 OF 03</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
            </>
          ) : (
            <>
              <span>STEP 03 OF 03</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
