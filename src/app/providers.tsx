import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { OrganizationProvider } from '@/features/organization/OrganizationProvider';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Global application state & context providers.
 */
export function AppProviders({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider><OrganizationProvider>{children}</OrganizationProvider></AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
