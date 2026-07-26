import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { getRedirectAuthRuntime } from '@/features/auth/runtime/redirectAuthRuntime';

describe('hosted redirect authentication boundary', () => {
  it('blocks localhost and loopback browser origins', () => {
    for (const hostname of ['localhost', '127.0.0.1', '::1']) {
      expect(getRedirectAuthRuntime({ hostname }).supportsHostedRedirectAuth).toBe(false);
    }
  });

  it('allows the deployed site to use SDK-managed same-origin redirects', () => {
    expect(getRedirectAuthRuntime({ hostname: 'signalfold.example.test' }).supportsHostedRedirectAuth).toBe(true);
  });

  it('does not register application routes for Base44 auth endpoints', () => {
    const router = readFileSync(resolve(process.cwd(), 'src/app/router.tsx'), 'utf8');
    expect(router).not.toMatch(/path:\s*['"]\/api\/apps\/auth\//);
  });

  it('uses the shared authentication shell for Login, Signup, and Verify Email', () => {
    for (const page of ['LoginPage.tsx', 'SignupPage.tsx', 'VerifyEmailPage.tsx']) {
      const source = readFileSync(resolve(process.cwd(), 'src/pages', page), 'utf8');
      expect(source).toMatch(/import\s+\{[^}]*AuthPageShell[^}]*\}\s+from\s+['"]@\/components\/auth\/AuthPageShell['"]/s);
      expect(source).toContain('<AuthPageShell>');
    }
  });

  it('builds Verify Email with the shared main and card primitives', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/pages/VerifyEmailPage.tsx'), 'utf8');
    expect(source).toContain('<AuthPageMain>');
    expect(source).toContain('<AuthFormCard>');
  });
});
