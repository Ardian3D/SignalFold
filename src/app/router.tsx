import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { ProjectSetupPage } from '@/pages/ProjectSetupPage';
import { DesignSystemPage } from '@/pages/DesignSystemPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { RootLayout } from '@/components/layout/RootLayout';

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
    path: '*',
    element: (
      <RootLayout>
        <NotFoundPage />
      </RootLayout>
    ),
  },
]);
