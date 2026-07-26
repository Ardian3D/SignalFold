import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from './AuthProvider';
import { getSafeReturnPath } from './routing/returnPath';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { state, isMockMode } = useAuth();
  const location = useLocation();
  if (isMockMode) return <>{children}</>;
  if (state.status === 'UNINITIALIZED' || state.status === 'RESTORING') {
    return <div className="min-h-screen bg-[#0A0A0A] text-[#A8AAA3] flex items-center justify-center font-mono text-xs tracking-widest" role="status">RESTORING AUTHENTICATION SESSION...</div>;
  }
  if (state.status === 'AUTHENTICATED') return <>{children}</>;
  if (state.status === 'ERROR' || state.status === 'UNAVAILABLE') {
    return <div className="min-h-screen bg-[#0A0A0A] text-[#A8AAA3] flex items-center justify-center font-mono text-xs tracking-widest" role="alert">AUTHENTICATION SERVICE UNAVAILABLE</div>;
  }
  return <Navigate to="/login" replace state={{ returnPath: getSafeReturnPath(`${location.pathname}${location.search}`) }} />;
}

export function PublicOnly({ children }: { children: ReactNode }) {
  const { state, isMockMode } = useAuth();
  if (isMockMode || state.status !== 'AUTHENTICATED') return <>{children}</>;
  return <Navigate to="/app" replace />;
}
