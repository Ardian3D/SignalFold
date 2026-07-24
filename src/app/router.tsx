import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { ProjectSetupPage } from '@/pages/ProjectSetupPage';
import { DesignSystemPage } from '@/pages/DesignSystemPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { RootLayout } from '@/components/layout/RootLayout';
import { AppShell } from '@/layouts/AppShell';
import { DashboardPage } from '@/pages/DashboardPage';
import { IncidentsPage } from '@/pages/IncidentsPage';
import { CreateIncidentPage } from '@/pages/CreateIncidentPage';
import { IncidentRoomPage } from '@/pages/IncidentRoomPage';

/**
 * Base Application Router configuration.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RootLayout>
        <LandingPage />
      </RootLayout>
    ),
  },
  {
    path: '/setup',
    element: (
      <RootLayout>
        <ProjectSetupPage />
      </RootLayout>
    ),
  },
  {
    path: '/design-system',
    element: (
      <RootLayout>
        <DesignSystemPage />
      </RootLayout>
    ),
  },
  {
    path: '/login',
    element: (
      <RootLayout>
        <LoginPage />
      </RootLayout>
    ),
  },
  {
    path: '/signup',
    element: (
      <RootLayout>
        <SignupPage />
      </RootLayout>
    ),
  },
  {
    path: '/app/onboarding',
    element: (
      <RootLayout>
        <OnboardingPage />
      </RootLayout>
    ),
  },
  {
    path: '/app',
    element: (
      <RootLayout>
        <AppShell>
          <DashboardPage />
        </AppShell>
      </RootLayout>
    ),
  },
  {
    path: '/app/incidents',
    element: (
      <RootLayout>
        <AppShell>
          <IncidentsPage />
        </AppShell>
      </RootLayout>
    ),
  },
  {
    path: '/app/incidents/new',
    element: (
      <RootLayout>
        <AppShell>
          <CreateIncidentPage />
        </AppShell>
      </RootLayout>
    ),
  },
  {
    path: '/app/incidents/SF-2026-0042',
    element: (
      <RootLayout>
        <AppShell>
          <IncidentRoomPage />
        </AppShell>
      </RootLayout>
    ),
  },
  {
    path: '*',
    element: (
      <RootLayout>
        <NotFoundPage />
      </RootLayout>
    ),
  },
]);
