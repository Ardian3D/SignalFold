import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Palette } from 'lucide-react';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Button, Badge, Surface } from '@/components/ui';

/**
 * Phase 1 Brand Foundation Status page.
 */
export function ProjectSetupPage() {
  useEffect(() => {
    document.title = 'SignalFold — Brand Foundation & Design System';
  }, []);

  const checklist = [
    { label: 'Vite & React initialized', status: 'done' },
    { label: 'TypeScript strict mode enabled', status: 'done' },
    { label: 'PRD_SignalFold.md integrated', status: 'done' },
    { label: 'Official SignalFold logo integrated', status: 'done' },
    { label: 'Brand design tokens configured', status: 'done' },
    { label: 'WCAG 2.2 AA palette implemented', status: 'done' },
    { label: 'Foundational UI components built', status: 'done' },
    { label: 'Design system showcase created', status: 'done' },
    { label: 'Phase 1 verification tests passing', status: 'done' },
  ];

  return (
    <main id="main-content" role="main" className="flex-1 flex items-center justify-center p-6 md:p-12">
      <Surface variant="muted" padding="lg" className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="space-y-4 border-b border-[#D8D4C8] dark:border-[#2A2C28] pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <BrandLogo size="lg" />
            <Badge variant="signal" size="md">
              PHASE 1 VERIFIED
            </Badge>
          </div>
          <p className="text-[var(--color-text-secondary)] font-medium text-sm">
            Frontend Phase 1 — Brand Foundation & Design System is established and verified.
          </p>
        </div>

        {/* Phase 1 Completion Summary */}
        <div className="space-y-3 bg-[var(--surface,#FFFFFF)] dark:bg-[#141513] p-4 rounded-[4px] border border-[#D8D4C8] dark:border-[#2A2C28]">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Design System Showcase Ready
            </h2>
            <Link to="/design-system">
              <Button variant="primary" size="sm" trailingIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Open Design System
              </Button>
            </Link>
          </div>
          <p className="text-xs text-[#5C5E58] dark:text-[#A8AAA3]">
            Inspect canonical brand tokens, typography, colors, buttons, badges, inputs, surfaces, and dialogs at{' '}
            <code className="font-mono font-bold text-[#0A0A0A] dark:text-[#D6FF3F]">/design-system</code>.
          </p>
        </div>

        {/* Status Checklist */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
            Phase 1 Deliverables Checklist:
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {checklist.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 bg-[var(--surface,#FFFFFF)] dark:bg-[#141513] px-3 py-2 rounded-[2px] border border-[#D8D4C8] dark:border-[#2A2C28]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#28A66A] shrink-0" aria-hidden="true" />
                <span className="font-medium text-[var(--color-text-primary)]">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2">
          <Link to="/design-system" className="w-full">
            <Button variant="primary" fullWidth leadingIcon={<Palette className="w-4 h-4" />}>
              Explore Component Library & Design System Showcase
            </Button>
          </Link>
        </div>
      </Surface>
    </main>
  );
}
