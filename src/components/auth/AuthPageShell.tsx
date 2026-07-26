import type { ReactNode } from 'react';

type AuthPageShellProps = {
  children: ReactNode;
};

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F3F1EA] flex flex-col justify-between selection:bg-[#D6FF3F] selection:text-[#0A0A0A] relative overflow-x-hidden p-4 sm:p-6 lg:p-8">
      {children}
    </div>
  );
}

export function AuthPageMain({ children }: AuthPageShellProps) {
  return (
    <main className="relative z-10 flex-1 my-auto py-12 lg:py-16 max-w-7xl w-full mx-auto grid grid-cols-1 min-[900px]:grid-cols-12 gap-8 min-[900px]:gap-12 items-center">
      {children}
    </main>
  );
}

export function AuthFormCard({ children }: AuthPageShellProps) {
  return (
    <div className="bg-[#141513]/40 border border-[#242522] p-6 sm:p-8 rounded-[2px] w-full min-w-0 flex-shrink-0 space-y-6">
      {children}
    </div>
  );
}
