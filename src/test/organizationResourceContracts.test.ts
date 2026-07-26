import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const read = (file: string) => JSON.parse(fs.readFileSync(path.resolve(process.cwd(), file), 'utf8')) as Record<string, unknown>;

describe('Phase 03 resource contracts', () => {
  it('extends the built-in User without redefining system identity fields', () => {
    const schema = read('base44/entities/User.jsonc');
    const properties = schema.properties as Record<string, unknown>;
    expect(properties).not.toHaveProperty('id');
    expect(properties).not.toHaveProperty('email');
    expect(properties).not.toHaveProperty('full_name');
    expect(properties).not.toHaveProperty('display_name');
    expect(properties).not.toHaveProperty('role');
    expect(properties).toEqual(expect.objectContaining({ avatar_url: expect.any(Object), timezone: expect.any(Object), default_organization_id: expect.any(Object), onboarding_completed: expect.any(Object), preferences: expect.any(Object) }));
  });
  it('defines Organization with deny-by-default direct access', () => {
    const schema = read('base44/entities/organization.jsonc');
    expect(schema.required).toEqual(expect.arrayContaining(['name', 'slug', 'created_by_user_id', 'is_demo']));
    expect(schema.rls).toEqual({ create: false, read: false, update: false, delete: false });
  });
  it('defines Membership roles, statuses, and deny-by-default access', () => {
    const schema = read('base44/entities/membership.jsonc');
    const properties = schema.properties as Record<string, { enum?: string[] }>;
    expect(properties.role.enum).toEqual(['reporter', 'responder', 'incident_manager', 'admin']);
    expect(properties.status.enum).toEqual(['invited', 'active', 'suspended']);
    expect(schema.rls).toEqual({ create: false, read: false, update: false, delete: false });
  });
  it('keeps creator authority server-controlled', () => {
    const source = fs.readFileSync(path.resolve(process.cwd(), 'base44/functions/complete-organization-onboarding/entry.ts'), 'utf8');
    expect(source).toContain("role: 'admin'");
    expect(source).toContain('created_by_user_id: user.id');
    expect(source).toContain('full_name: displayName');
    expect(source).not.toContain('display_name');
    expect(source).toContain('onboarding_completed: true');
    expect(source).not.toContain('input.role');
  });
});
