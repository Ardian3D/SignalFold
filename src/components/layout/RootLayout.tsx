import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PublicOnly, RequireAuth } from '@/features/auth/AuthRouteGuards';
import { RequireOnboarding, RequireOrganization } from '@/features/organization/OrganizationRouteGuards';

interface RootLayoutProps {
  children: ReactNode;
}

const KNOWN_LANDING_HASHES = ['#product', '#workflow', '#incident-room', '#postmortem'];

/**
 * Root Layout wrapper providing accessible landmarks and skip navigation.
 */
export function RootLayout({ children }: RootLayoutProps) {
  const location = useLocation();
  const isProtectedRoute = location.pathname === '/app' || location.pathname.startsWith('/app/');
  const isOnboardingRoute = location.pathname === '/app/onboarding';
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/verify-email';

  useEffect(() => {
    if (location.pathname !== '/' && KNOWN_LANDING_HASHES.includes(location.hash)) {
      // Clear only the known landing page hashes if we are not on the landing page, preserving pathname and query parameters
      const newUrl = location.pathname + location.search;
      window.history.replaceState(null, '', newUrl);
    }
  }, [location.pathname, location.hash, location.search]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-root,#F3F1EA)] text-[var(--color-text-primary,#0A0A0A)] flex flex-col font-sans transition-colors duration-200">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <div className="flex-1 flex flex-col">
        {isProtectedRoute ? <RequireAuth>{isOnboardingRoute ? <RequireOnboarding>{children}</RequireOnboarding> : <RequireOrganization>{children}</RequireOrganization>}</RequireAuth> : isAuthRoute ? <PublicOnly>{children}</PublicOnly> : children}
      </div>
    </div>
  );
}
