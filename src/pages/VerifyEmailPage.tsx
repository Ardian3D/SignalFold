import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-[#0A0A0A] text-[#F3F1EA] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <header className="flex items-center gap-4 pb-6 border-b border-[#242522]">
        <Link to="/" aria-label="SignalFold Home"><BrandLogo size="md" /></Link>
        <span className="font-mono text-[10px] tracking-widest text-[#A8AAA3] uppercase">AUTHENTICATION / VERIFY EMAIL</span>
      </header>
      <main className="w-full max-w-md mx-auto py-16">
        <div className="bg-[#141513]/40 border border-[#242522] p-6 sm:p-8 rounded-[2px] space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">VERIFY EMAIL</h1>
            <p className="text-sm text-[#A8AAA3]">Enter the code sent to your email address.</p>
          </div>
          {!safeEmail && <p role="alert" className="text-sm text-amber-300">Registration context is unavailable. Return to Signup.</p>}
          {message && <p role="status" className="text-sm text-amber-200 whitespace-pre-line">{message}</p>}
          <label className="block text-[10px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase" htmlFor="email-otp">VERIFICATION CODE</label>
          <input id="email-otp" inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={(event) => setOtp(event.target.value)} disabled={pending || !safeEmail} className="w-full px-3.5 py-3 text-sm bg-[#0A0A0A] text-[#F3F1EA] rounded-[2px] border border-[#242522] outline-none focus:border-[#D6FF3F]" />
          <div className="flex gap-3">
            <button type="button" onClick={() => void verify()} disabled={pending || !safeEmail || !otp || isMockMode} className="flex-1 px-4 py-3 text-xs font-mono font-bold tracking-widest bg-[#F3F1EA] text-[#0A0A0A] rounded-[2px] disabled:opacity-50">VERIFY</button>
            <button type="button" onClick={() => void resend()} disabled={pending || !safeEmail || isMockMode} className="px-4 py-3 text-xs font-mono font-bold tracking-widest border border-[#242522] text-[#A8AAA3] rounded-[2px] disabled:opacity-50">RESEND</button>
          </div>
          <Link to="/signup" className="block text-xs text-[#A8AAA3] hover:text-[#D6FF3F]">BACK TO SIGNUP</Link>
        </div>
      </main>
      <footer className="pt-6 border-t border-[#242522] text-[10px] font-mono tracking-widest text-[#5C5E58]">CREDENTIALS REMAIN PRIVATE</footer>
    </div>
  );
}
