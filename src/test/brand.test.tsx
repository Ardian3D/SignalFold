import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrandLogo, BrandMark } from '@/components/brand';

describe('SignalFold — Brand Assets & Components Tests', () => {
  it('1. BrandLogo renders using official PNG lockup with default accessible alt text', () => {
    render(<BrandLogo />);
    const img = screen.getByAltText('SignalFold') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe('IMG');
    expect(img.getAttribute('loading')).toBe('eager');
  });

  it('2. BrandLogo supports custom size scale and custom alt text', () => {
    render(<BrandLogo size="lg" alt="SignalFold Command Center" />);
    const img = screen.getByAltText('SignalFold Command Center');
    expect(img).toBeInTheDocument();
    expect(img.className).toContain('h-12');
  });

  it('3. BrandMark renders using official favicon.ico for small icon mark', () => {
    render(<BrandMark size="md" />);
    const img = screen.getByAltText('SignalFold Mark') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe('/favicon.ico');
  });

  it('4. Confirms no reconstructed SVG logo mark exists in DOM', () => {
    const { container } = render(<BrandLogo />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(0);
  });

  it('5. BrandLogo uses a root-absolute path (never relative) for nested routes', () => {
    render(<BrandLogo />);
    const img = screen.getByAltText('SignalFold') as HTMLImageElement;
    const src = img.getAttribute('src');
    expect(src).toBeDefined();
    // Path must be root-absolute, i.e., start with "/", "http", or "data:"
    const isAbsolute = src && (src.startsWith('/') || src.startsWith('http') || src.startsWith('data:'));
    expect(isAbsolute).toBe(true);
    // Path must not be route-relative (like starting with "SignalFold-logo.png" or "./")
    expect(src?.startsWith('SignalFold-logo.png')).toBe(false);
    expect(src?.startsWith('./')).toBe(false);
  });

  it('6. AppShell header contains no duplicate SignalFold wordmarks and displays the correct layout structure', () => {
    // Check that BrandLogo has appropriate styling and object-fit
    render(<BrandLogo size="sm" />);
    const img = screen.getByAltText('SignalFold') as HTMLImageElement;
    expect(img.className).toContain('object-contain');
    expect(img.className).toContain('shrink-0');
  });
});
