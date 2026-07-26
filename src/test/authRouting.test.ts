import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { getSafeReturnPath } from '@/features/auth/routing/returnPath';

describe('safe authentication return paths', () => {
  it('accepts internal application paths and preserves query/hash state', () => {
    expect(getSafeReturnPath('/app/incidents?filter=active#timeline')).toBe('/app/incidents?filter=active#timeline');
    expect(getSafeReturnPath('/app')).toBe('/app');
  });

  it('rejects external, protocol-relative, executable, malformed, and non-application paths', () => {
    for (const value of [
      'https://evil.example/login',
      'http://evil.example/login',
      '//evil.example/login',
      'javascript:alert(1)',
      'data:text/html,hello',
      'file:///secret',
      '%E0%A4%A',
      '/login',
      '/appish',
    ]) {
      expect(getSafeReturnPath(value)).toBe('/app');
    }
  });

  it('keeps the verification form width-constrained and responsive', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/pages/VerifyEmailPage.tsx'), 'utf8');
    expect(source).toContain('w-full max-w-lg min-w-0');
    expect(source).toContain('w-full flex-1 flex items-center justify-center');
    expect(source).toContain('grid grid-cols-2 gap-3');
    expect(source).toContain('inline-flex whitespace-nowrap');
    expect(source).not.toContain('w-fit');
  });
});
