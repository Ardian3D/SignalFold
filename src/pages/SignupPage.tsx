import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

export function SignupPage() {
  // Controlled inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation states
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Live region announcement
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    document.title = 'Create Account — SignalFold';
  }, []);

  // Validation helpers
  const validateFullName = (val: string) => {
    if (!val) {
      return 'Full name is required.';
    }
    if (val.trim().length < 2) {
      return 'Full name must contain at least 2 characters.';
    }
    return '';
  };

  const validateEmail = (val: string) => {
    if (!val) {
      return 'Email address is required.';
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const validatePassword = (val: string) => {
    if (!val) {
      return 'Password is required.';
    }
    if (val.length < 8) {
      return 'Password must contain at least 8 characters.';
    }
    // Must contain at least one letter and at least one number
    const hasLetter = /[a-zA-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    if (!hasLetter || !hasNumber) {
      return 'Password must contain at least one letter and one number.';
    }
    return '';
  };

  const validateConfirmPassword = (val: string, pass: string) => {
    if (!val) {
      return 'Please confirm your password.';
    }
    if (val !== pass) {
      return 'Passwords do not match.';
    }
    return '';
  };

  // Live validation on change
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFullName(val);
    if (fullNameError) {
      setFullNameError(validateFullName(val));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError) {
      setEmailError(validateEmail(val));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (passwordError) {
      setPasswordError(validatePassword(val));
    }
    if (confirmPasswordError) {
      setConfirmPasswordError(validateConfirmPassword(confirmPassword, val));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (confirmPasswordError) {
      setConfirmPasswordError(validateConfirmPassword(val, password));
    }
  };

  const handleGoogleClick = () => {
    setSubmitMessage(
      'GOOGLE AUTHENTICATION NOT CONNECTED\nGoogle account registration will be enabled during backend integration.'
    );
    setAnnouncement(
      'GOOGLE AUTHENTICATION NOT CONNECTED. Google account registration will be enabled during backend integration.'
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fnErr = validateFullName(fullName);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    const cpErr = validateConfirmPassword(confirmPassword, password);

    setFullNameError(fnErr);
    setEmailError(eErr);
    setPasswordError(pErr);
    setConfirmPasswordError(cpErr);

    if (fnErr || eErr || pErr || cpErr) {
      const liveMsg = `Form validation failed. ${fnErr} ${eErr} ${pErr} ${cpErr}`;
      setAnnouncement(liveMsg);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');
    setAnnouncement('Validating registration details locally...');

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage(
        'REGISTRATION SERVICE NOT CONNECTED\nFrontend validation completed. Account creation and organization onboarding will be enabled during backend integration.'
      );
      setAnnouncement(
        'Frontend validation completed. Account creation and organization onboarding will be enabled during backend integration.'
      );
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F3F1EA] flex flex-col justify-between selection:bg-[#D6FF3F] selection:text-[#0A0A0A] relative overflow-x-hidden p-4 sm:p-6 lg:p-8">
      {/* Background Subtle Tech Grid (Aria-Hidden) */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#141513_1px,transparent_1px),linear-gradient(to_bottom,#141513_1px,transparent_1px)] bg-[size:32px_32px] opacity-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Accessibility Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

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
          REGISTRATION <span className="text-[#242522]" aria-hidden="true">/</span> <span className="text-[#F3F1EA]">NEW ACCESS</span>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <main className="relative z-10 flex-1 my-auto py-12 lg:py-16 max-w-7xl w-full mx-auto grid grid-cols-1 min-[900px]:grid-cols-12 gap-8 min-[900px]:gap-12 items-center animate-fade-in">
        
        {/* Left Editorial Column */}
        <section
          className="min-[900px]:col-span-7 space-y-6 text-left"
          aria-labelledby="signup-editorial-heading"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#141513] border border-[#242522]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" aria-hidden="true" />
            <span
              className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase text-[#D6FF3F]"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              ENTRY / NEW OPERATOR
            </span>
          </div>

          {/* Headline */}
          <h1
            id="signup-editorial-heading"
            className="text-4xl sm:text-6xl font-bold tracking-tight text-[#F3F1EA] leading-[1.05]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            CREATE YOUR<br />
            COMMAND ACCESS.
          </h1>

          {/* Supporting Copy */}
          <p
            className="text-base sm:text-lg text-[#A8AAA3] max-w-[520px] leading-relaxed"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Create an account to establish secure access before setting up your organization and incident workspace.
          </p>

          {/* Compact Assurance Rail */}
          <div className="pt-4 border-t border-[#242522] max-w-[520px]">
            <div
              className="grid grid-cols-3 gap-2 text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1 bg-[#5C5E58] h-3" aria-hidden="true" />
                <span>PRIVATE CREDENTIALS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 bg-[#5C5E58] h-3" aria-hidden="true" />
                <span>ORGANIZATION FOLLOWS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 bg-[#5C5E58] h-3" aria-hidden="true" />
                <span>HUMAN CONTROLLED</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Registration Column */}
        <section
          className="min-[900px]:col-span-5 w-full flex flex-col justify-center"
          aria-labelledby="signup-form-heading"
        >
          {/* Main Panel wrapper matching LoginPage */}
          <div className="bg-[#141513]/40 border border-[#242522] p-6 sm:p-8 rounded-[2px] w-full space-y-6">
            
            {/* Panel Header */}
            <div className="space-y-1 pb-4 border-b border-[#242522]">
              <h2
                id="signup-form-heading"
                className="text-xl sm:text-2xl font-bold text-[#F3F1EA] tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                CREATE ACCOUNT
              </h2>
              <div
                className="text-[10px] font-mono font-bold tracking-widest text-[#A8AAA3] uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                NEW SIGNALFOLD ACCESS
              </div>
            </div>

            {/* Google Authentication Section */}
            <div className="space-y-4">
              <GoogleAuthButton
                mode="signup"
                disabled={isSubmitting}
                onClick={handleGoogleClick}
              />

              {/* Horizontal Divider with Technical Label */}
              <div className="relative flex py-2 items-center" aria-hidden="true">
                <div className="flex-grow border-t border-[#242522]"></div>
                <span
                  className="flex-shrink mx-4 text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  OR CONTINUE WITH EMAIL
                </span>
                <div className="flex-grow border-t border-[#242522]"></div>
              </div>
            </div>

            {/* Submit Information Message */}
            {submitMessage && (
              <div
                className="p-4 bg-[#141513] border border-amber-500/20 text-amber-200 rounded-[2px] text-xs font-mono tracking-wide leading-relaxed whitespace-pre-line"
                style={{ fontFamily: 'var(--font-technical)' }}
                role="status"
              >
                {submitMessage}
              </div>
            )}

            {/* Controlled Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              
              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="signup-name"
                  className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  FULL NAME
                </label>
                <div className="relative">
                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={handleFullNameChange}
                    disabled={isSubmitting}
                    placeholder="Jordan Lee"
                    className={`w-full px-3.5 py-3 text-sm bg-[#0A0A0A] text-[#F3F1EA] rounded-[2px] border ${
                      fullNameError ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-[#242522] focus:border-[#D6FF3F] focus:ring-1 focus:ring-[#D6FF3F]'
                    } outline-none transition-all placeholder-[#5C5E58] font-sans h-11`}
                    style={{ fontFamily: 'var(--font-ui)' }}
                    aria-describedby={fullNameError ? 'signup-name-error' : undefined}
                    aria-invalid={!!fullNameError}
                    required
                  />
                </div>
                {fullNameError && (
                  <p
                    id="signup-name-error"
                    className="text-xs text-rose-500 font-mono tracking-wide mt-1"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    {fullNameError}
                  </p>
                )}
              </div>

              {/* Work Email Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="signup-email"
                  className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  WORK EMAIL
                </label>
                <div className="relative">
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={isSubmitting}
                    placeholder="name@company.com"
                    className={`w-full px-3.5 py-3 text-sm bg-[#0A0A0A] text-[#F3F1EA] rounded-[2px] border ${
                      emailError ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-[#242522] focus:border-[#D6FF3F] focus:ring-1 focus:ring-[#D6FF3F]'
                    } outline-none transition-all placeholder-[#5C5E58] font-sans h-11`}
                    style={{ fontFamily: 'var(--font-ui)' }}
                    aria-describedby={emailError ? 'signup-email-error' : undefined}
                    aria-invalid={!!emailError}
                    required
                  />
                </div>
                {emailError && (
                  <p
                    id="signup-email-error"
                    className="text-xs text-rose-500 font-mono tracking-wide mt-1"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="signup-password"
                  className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  PASSWORD
                </label>
                <div className="relative flex items-center">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={isSubmitting}
                    placeholder="Create a password"
                    className={`w-full pl-3.5 pr-14 py-3 text-sm bg-[#0A0A0A] text-[#F3F1EA] rounded-[2px] border ${
                      passwordError ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-[#242522] focus:border-[#D6FF3F] focus:ring-1 focus:ring-[#D6FF3F]'
                    } outline-none transition-all placeholder-[#5C5E58] font-sans h-11`}
                    style={{ fontFamily: 'var(--font-ui)' }}
                    aria-describedby={passwordError ? 'signup-password-error' : undefined}
                    aria-invalid={!!passwordError}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting || !password}
                    className="absolute right-2 px-2.5 py-1 text-[9px] font-mono font-bold tracking-wider text-[#A8AAA3] hover:text-[#D6FF3F] hover:bg-[#141513] border border-transparent hover:border-[#242522] rounded-[1px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-[#A8AAA3] disabled:hover:bg-transparent disabled:hover:border-transparent select-none uppercase focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
                    style={{ fontFamily: 'var(--font-technical)' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
                {passwordError && (
                  <p
                    id="signup-password-error"
                    className="text-xs text-rose-500 font-mono tracking-wide mt-1"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="signup-confirm-password"
                  className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  CONFIRM PASSWORD
                </label>
                <div className="relative flex items-center">
                  <input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    disabled={isSubmitting}
                    placeholder="Confirm your password"
                    className={`w-full pl-3.5 pr-14 py-3 text-sm bg-[#0A0A0A] text-[#F3F1EA] rounded-[2px] border ${
                      confirmPasswordError ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-[#242522] focus:border-[#D6FF3F] focus:ring-1 focus:ring-[#D6FF3F]'
                    } outline-none transition-all placeholder-[#5C5E58] font-sans h-11`}
                    style={{ fontFamily: 'var(--font-ui)' }}
                    aria-describedby={confirmPasswordError ? 'signup-confirm-password-error' : undefined}
                    aria-invalid={!!confirmPasswordError}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting || !confirmPassword}
                    className="absolute right-2 px-2.5 py-1 text-[9px] font-mono font-bold tracking-wider text-[#A8AAA3] hover:text-[#D6FF3F] hover:bg-[#141513] border border-transparent hover:border-[#242522] rounded-[1px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-[#A8AAA3] disabled:hover:bg-transparent disabled:hover:border-transparent select-none uppercase focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
                    style={{ fontFamily: 'var(--font-technical)' }}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p
                    id="signup-confirm-password-error"
                    className="text-xs text-rose-500 font-mono tracking-wide mt-1"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    {confirmPasswordError}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-mono font-bold tracking-widest bg-[#F3F1EA] text-[#0A0A0A] hover:bg-[#D6FF3F] hover:text-[#0A0A0A] rounded-[2px] border border-[#F3F1EA] hover:border-[#D6FF3F] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#4B78FF] disabled:opacity-50 disabled:cursor-not-allowed select-none text-center cursor-pointer min-h-[44px]"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                {isSubmitting ? 'PROCESSING...' : 'CREATE ACCOUNT'}
              </button>
            </form>

            {/* Legal Copy beneath submit button */}
            <p className="text-[10px] text-[#5C5E58] leading-relaxed text-center font-sans">
              By creating an account, you acknowledge the{' '}
              <Link to={{ pathname: "/terms", hash: "" }} className="text-[#A8AAA3] hover:text-[#D6FF3F] underline underline-offset-2">
                Terms
              </Link>{' '}
              and{' '}
              <Link to={{ pathname: "/privacy", hash: "" }} className="text-[#A8AAA3] hover:text-[#D6FF3F] underline underline-offset-2">
                Privacy Notice
              </Link>
              .
            </p>

            {/* Account and home actions */}
            <div className="pt-4 border-t border-[#242522] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] font-mono tracking-widest font-bold">
              <Link
                to={{ pathname: "/login", hash: "" }}
                className="text-[#A8AAA3] hover:text-[#D6FF3F] transition-colors focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[1px]"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                ALREADY HAVE ACCESS? <span className="text-[#D6FF3F] underline underline-offset-4 ml-1">SIGN IN →</span>
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
        </section>
      </main>

      {/* Bottom System Rail */}
      <footer className="relative z-10 w-full mt-auto pt-6 border-t border-[#242522] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[9px] sm:text-[10px] text-[#5C5E58] tracking-widest uppercase">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1" style={{ fontFamily: 'var(--font-technical)' }}>
          <span>SIGNALFOLD</span>
          <span className="text-[#242522]" aria-hidden="true">/</span>
          <span>ACCESS PROVISIONING</span>
        </div>
        <div className="hidden md:flex items-center gap-2" style={{ fontFamily: 'var(--font-technical)' }}>
          <span>NO ACCOUNT CREATED LOCALLY</span>
        </div>
        <div className="flex items-center gap-2 text-[#A8AAA3] font-bold" style={{ fontFamily: 'var(--font-technical)' }}>
          <span>BACKEND CONNECTION PENDING</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
        </div>
      </footer>
    </div>
  );
}
