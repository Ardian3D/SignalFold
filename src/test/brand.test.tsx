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
});
