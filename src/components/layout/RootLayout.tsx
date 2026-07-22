import { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * Root Layout wrapper providing accessible landmarks and skip navigation.
 */
export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-root,#F3F1EA)] text-[var(--color-text-primary,#0A0A0A)] flex flex-col font-sans transition-colors duration-200">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
