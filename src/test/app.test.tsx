import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { ProjectSetupPage } from '@/pages/ProjectSetupPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import App from '@/app/App';

describe('SignalFold — Phase 1 Application Tests', () => {
  it('1. App renders with official SignalFold brand logo asset', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(screen.getAllByAltText('SignalFold')[0]).toBeInTheDocument();
  });

  it('2. ProjectSetupPage displays Phase 1 Verified status', () => {
    render(
      <AppProviders>
        <MemoryRouter>
          <ProjectSetupPage />
        </MemoryRouter>
      </AppProviders>
    );
    expect(
      screen.getByText('Frontend Phase 1 — Brand Foundation & Design System is established and verified.')
    ).toBeInTheDocument();
    expect(screen.getByText('PHASE 1 VERIFIED')).toBeInTheDocument();
  });

  it('3. Not-found route renders properly', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/unknown-route-123']}>
          <Routes>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      </AppProviders>
    );
    expect(screen.getByText('404 / SIGNAL LOST')).toBeInTheDocument();
    expect(screen.getByText(/THIS ROUTE/i)).toBeInTheDocument();
  });

  it('4. AppProviders wraps children with QueryClient and ErrorBoundary without crashing', () => {
    render(
      <AppProviders>
        <div data-testid="test-child">Child Component</div>
      </AppProviders>
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });
});
