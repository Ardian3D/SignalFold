import React from 'react';

interface GoogleAuthButtonProps {
  mode: 'signin' | 'signup';
  disabled?: boolean;
  onClick: () => void;
}

/**
 * Reusable official brand-aligned Google Authentication Button.
 * Conforms to strict Google Brand Guidelines (multicolor official G mark, title-case text, comfortable tap target, proper focus/hover behavior).
 */
export function GoogleAuthButton({ mode, disabled = false, onClick }: GoogleAuthButtonProps) {
  const label = 'Continue with Google';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="relative w-full flex items-center justify-center min-h-[44px] px-5 py-3 text-xs font-semibold tracking-wider text-[#F3F1EA] hover:text-[#D6FF3F] bg-[#141513]/60 hover:bg-[#1C1D1B] border border-[#242522] hover:border-[#D6FF3F]/40 rounded-[2px] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#4B78FF] disabled:opacity-40 disabled:cursor-not-allowed select-none text-center cursor-pointer font-sans"
      aria-label={label}
    >
      {/* Official Multicolor Google G Icon (Aligned to the left) */}
      <div className="absolute left-4 flex items-center justify-center w-5 h-5" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
      </div>

      {/* Button Action Text (Visually Centered) */}
      <span className="pl-6">{label}</span>
    </button>
  );
}
