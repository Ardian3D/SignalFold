import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { AppShell } from '@/layouts/AppShell';

describe('organization provider boundary', () => {
  it('exposes the canonical mock organization without changing the shell contract', async () => {
    render(<MemoryRouter><AppProviders><AppShell><div>CONTENT</div></AppShell></AppProviders></MemoryRouter>);
    expect(screen.getAllByText('NORTHSTAR COMMERCE').length).toBeGreaterThan(0);
    expect(screen.getByText('OPERATOR_01')).toBeInTheDocument();
  });
});
