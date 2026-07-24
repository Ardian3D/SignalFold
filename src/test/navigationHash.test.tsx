import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';

describe('Navigation Hash Cleansing', () => {
  let replaceStateMock: any;

  beforeEach(() => {
    replaceStateMock = vi.fn();
    vi.stubGlobal('history', {
      ...window.history,
      replaceState: replaceStateMock,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('preserves known landing page hashes when on the landing page (/)', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/', hash: '#postmortem' }]}>
        <RootLayout>
          <div>Landing Content</div>
        </RootLayout>
      </MemoryRouter>
    );

    // replaceState should not be called since we are on the landing page
    expect(replaceStateMock).not.toHaveBeenCalled();
  });

  it('clears known landing page hashes when on a non-landing page route (/app)', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/app', hash: '#postmortem' }]}>
        <RootLayout>
          <div>Dashboard Content</div>
        </RootLayout>
      </MemoryRouter>
    );

    // replaceState should be called to strip the stale hash
    expect(replaceStateMock).toHaveBeenCalled();
    const [, , url] = replaceStateMock.mock.calls[0];
    expect(url).not.toContain('#postmortem');
  });

  it('preserves unknown hashes even on non-landing routes', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/app', hash: '#some-future-feature' }]}>
        <RootLayout>
          <div>Dashboard Content</div>
        </RootLayout>
      </MemoryRouter>
    );

    // replaceState should not be called for unknown hashes
    expect(replaceStateMock).not.toHaveBeenCalled();
  });

  it('preserves query parameters when clearing stale landing page hashes on non-landing routes', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/login', search: '?redirect=/app', hash: '#workflow' }]}>
        <RootLayout>
          <div>Login Content</div>
        </RootLayout>
      </MemoryRouter>
    );

    expect(replaceStateMock).toHaveBeenCalled();
    const [, , url] = replaceStateMock.mock.calls[0];
    // The query param must be preserved in the cleaned URL
    expect(url).toContain('?redirect=/app');
    expect(url).not.toContain('#workflow');
  });
});
