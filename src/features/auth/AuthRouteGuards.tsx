import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from './AuthProvider';
import { getAuthenticatedEntryPath } from './routing/returnPath';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { state, isMockMode, restoreSession } = useAuth();
  const location = useLocation();
  if (isMockMode) return <>{children}</>;
  if (state.status === 'UNINITIALIZED' || state.status === 'RESTORING') {
    return <div className="min-h-screen bg-[#0A0A0A] text-[#A8AAA3] flex items-center justify-center font-mono text-xs tracking-widest" role="status">RESTORING AUTHENTICATION SESSION...</div>;
  }
  if (state.status === 'AUTHENTICATED') return <>{children}</>;
  if (state.status === 'ERROR' || state.status === 'UNAVAILABLE') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#A8AAA3] flex flex-col gap-4 items-center justify-center font-mono text-xs tracking-widest" role="alert">
        <span>AUTHENTICATION SERVICE UNAVAILABLE</span>
        <button type="button" onClick={() => void restoreSession()} className="px-4 py-2 border border-[#242522] text-[#F3F1EA] hover:text-[#D6FF3F] rounded-[2px] focus-visible:outline-2 focus-visible:outline-[#4B78FF]">RETRY SESSION</button>
      </div>
    );
  }
  return <Navigate to="/login" replace state={{ returnPath: getAuthenticatedEntryPath(`${location.pathname}${location.search}${location.hash}`) }} />;
}

export function PublicOnly({ children }: { children: ReactNode }) {
  const { state, isMockMode } = useAuth();
  if (isMockMode || state.status !== 'AUTHENTICATED') return <>{children}</>;
  return <Navigate to={getAuthenticatedEntryPath(null)} replace />;
}
