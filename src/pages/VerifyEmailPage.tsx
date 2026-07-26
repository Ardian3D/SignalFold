import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { AuthFormCard, AuthPageMain, AuthPageShell } from '@/components/auth/AuthPageShell';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { useAuth } from '@/features/auth/AuthProvider';

const messageFor = (code: string): string => {
  if (code === 'INVALID_OTP') return 'The verification code is invalid.';
  if (code === 'EXPIRED_OTP') return 'The verification code has expired. Request a new code.';
  if (code === 'RATE_LIMITED') return 'Too many attempts. Wait before requesting another code.';
  if (code === 'NETWORK_ERROR' || code === 'AUTH_SERVICE_UNAVAILABLE') return 'The authentication service is temporarily unavailable.';
  return 'The verification request could not be completed.';
};

export function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMockMode, verifyEmailOtp, resendVerificationOtp } = useAuth();
  const email = (location.state as { email?: unknown } | null)?.email;
  const safeEmail = typeof email === 'string' ? email : '';
  const [otp, setOtp] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  const verify = async () => {
    if (!safeEmail || !otp || pending || isMockMode) return;
    setPending(true);
    setMessage('');
    const result = await verifyEmailOtp(safeEmail, otp);
    setOtp('');
    setPending(false);
    if (result.ok) {
      navigate('/login', { state: { email: safeEmail, verificationComplete: true } });
    } else {
      setMessage(messageFor(result.error.code));
    }
  };

  const resend = async () => {
    if (!safeEmail || pending || isMockMode) return;
    setPending(true);
    setMessage('');
    const result = await resendVerificationOtp(safeEmail);
    setPending(false);
    setMessage(result.ok ? 'A new verification code was sent.' : messageFor(result.error.code));
  };

  return (
    <AuthPageShell>
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#141513_1px,transparent_1px),linear-gradient(to_bottom,#141513_1px,transparent_1px)] bg-[size:32px_32px] opacity-10 pointer-events-none"
        aria-hidden="true"
      />

      <header className="relative z-10 flex justify-between items-center pb-6 border-b border-[#242522] w-full">
        <div className="flex items-center gap-4">
          <Link to="/" className="focus-visible:outline-2 focus-visible:outline-[#4B78FF] rounded-[2px]" aria-label="SignalFold Home">
            <BrandLogo size="md" />
          </Link>
          <div className="hidden sm:flex items-center gap-2 border-l border-[#242522] pl-4 font-mono text-[10px] tracking-widest text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            <span>SYSTEM</span><span className="text-[#242522]" aria-hidden="true">/</span><span className="text-[#A8AAA3] font-bold">SIGNALFOLD</span>
          </div>
        </div>
        <div className="font-mono text-[10px] tracking-widest text-right text-[#A8AAA3] font-bold uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
          AUTHENTICATION <span className="text-[#242522]" aria-hidden="true">/</span> <span className="text-[#F3F1EA]">VERIFY EMAIL</span>
        </div>
      </header>

      <AuthPageMain>
        <section className="min-[900px]:col-span-7 space-y-6 text-left" aria-labelledby="verify-editorial-heading">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#141513] border border-[#242522]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" aria-hidden="true" />
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase text-[#D6FF3F]" style={{ fontFamily: 'var(--font-technical)' }}>
              ACCESS / EMAIL VERIFICATION
            </span>
          </div>
          <h1 id="verify-editorial-heading" className="text-4xl sm:text-6xl font-bold tracking-tight text-[#F3F1EA] leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
            VERIFY YOUR<br />EMAIL ADDRESS.
          </h1>
          <p className="text-base sm:text-lg text-[#A8AAA3] max-w-[520px] leading-relaxed" style={{ fontFamily: 'var(--font-ui)' }}>
            Enter the verification code sent to your email address.
          </p>
        </section>

        <section className="min-[900px]:col-span-5 w-full min-w-0 flex flex-col justify-center" aria-labelledby="verify-form-heading">
          <AuthFormCard>
            <div className="space-y-1 pb-4 border-b border-[#242522]">
              <h2 id="verify-form-heading" className="text-xl sm:text-2xl font-bold text-[#F3F1EA] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>VERIFY EMAIL</h2>
              <div className="text-[10px] font-mono font-bold tracking-widest text-[#A8AAA3] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>AUTHORIZED WORKSPACE ACCESS</div>
            </div>

            {!safeEmail && <p role="alert" className="text-sm text-amber-300">Registration context is unavailable. Return to Signup.</p>}
            {message && <p role="status" className="text-sm text-amber-200 whitespace-pre-line">{message}</p>}

            <div className="w-full space-y-1.5">
              <label className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase" htmlFor="email-otp">VERIFICATION CODE</label>
              <input id="email-otp" inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={(event) => setOtp(event.target.value)} disabled={pending || !safeEmail} className="w-full min-w-0 h-11 px-3.5 py-3 text-sm bg-[#0A0A0A] text-[#F3F1EA] rounded-[2px] border border-[#242522] outline-none focus:border-[#D6FF3F] focus:ring-1 focus:ring-[#D6FF3F]" />
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={() => void verify()} disabled={pending || !safeEmail || !otp || isMockMode} className="w-full min-h-[44px] px-4 py-3 text-xs font-mono font-bold tracking-widest bg-[#F3F1EA] text-[#0A0A0A] rounded-[2px] disabled:opacity-50">VERIFY</button>
              <button type="button" onClick={() => void resend()} disabled={pending || !safeEmail || isMockMode} className="w-full min-h-[44px] px-4 py-3 text-xs font-mono font-bold tracking-widest border border-[#242522] text-[#A8AAA3] rounded-[2px] disabled:opacity-50">RESEND</button>
            </div>

            <div className="pt-4 border-t border-[#242522]">
              <Link to="/signup" className="inline-flex whitespace-nowrap text-[10px] font-mono font-bold tracking-widest text-[#A8AAA3] hover:text-[#D6FF3F]">BACK TO SIGNUP</Link>
            </div>
          </AuthFormCard>
        </section>
      </AuthPageMain>

      <footer className="relative z-10 w-full mt-auto pt-6 border-t border-[#242522] flex items-center justify-between gap-4 font-mono text-[9px] sm:text-[10px] text-[#5C5E58] tracking-widest uppercase">
        <span>SIGNALFOLD / ACCESS CONTROL</span><span>CREDENTIALS REMAIN PRIVATE</span>
      </footer>
    </AuthPageShell>
  );
}
