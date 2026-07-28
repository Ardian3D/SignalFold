import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { INCIDENT_SEVERITIES, INCIDENT_SOURCES, INCIDENT_STATUSES } from '@/features/incidents/domain/incidentTypes';
import { SERVICE_CRITICALITIES, SERVICE_OPERATIONAL_STATUSES } from '@/features/services/domain/serviceTypes';
import { TASK_PRIORITIES, TASK_SOURCES, TASK_STATUSES } from '@/features/tasks/domain/taskTypes';

const root = resolve(process.cwd());
const schema = (name: string) => JSON.parse(readFileSync(resolve(root, 'base44/entities', name), 'utf8').replace(/\/\/.*$/gm, '')) as Record<string, any>;
describe('Phase 05 operational resource contracts', () => {
  it('preserves the full synchronized entity manifest and excludes later-phase resources', () => {
    expect(readdirSync(resolve(root, 'base44/entities')).sort()).toEqual(['User.jsonc', 'incident-task.jsonc', 'incident-update.jsonc', 'incident.jsonc', 'membership.jsonc', 'organization.jsonc', 'service.jsonc'].sort());
    expect(readdirSync(resolve(root, 'base44/entities')).some(file => /postmortem|airun|notification|audit/i.test(file))).toBe(false);
  });
  it('uses canonical service and incident enums', () => {
    expect(SERVICE_CRITICALITIES).toEqual(['low', 'medium', 'high', 'critical']);
    expect(SERVICE_OPERATIONAL_STATUSES).toEqual(['operational', 'degraded', 'outage', 'maintenance']);
    expect(INCIDENT_SOURCES).toEqual(['manual', 'demo', 'api']);
    expect(INCIDENT_SEVERITIES).toEqual(['SEV1', 'SEV2', 'SEV3', 'SEV4']);
    expect(INCIDENT_STATUSES).toContain('reported');
    expect(TASK_PRIORITIES).toEqual(['critical', 'high', 'medium', 'low']);
    expect(TASK_STATUSES).toEqual(['todo', 'in_progress', 'blocked', 'done', 'cancelled']);
    expect(TASK_SOURCES).toEqual(['human', 'ai', 'system']);
  });
  it('denies direct writes on operational entities and keeps tenant fields required', () => {
    for (const file of ['service.jsonc', 'incident.jsonc', 'incident-update.jsonc', 'incident-task.jsonc']) {
      const value = schema(file);
      expect(value.required).toContain('organization_id');
      expect(value.rls).toEqual({ create: false, read: false, update: false, delete: false });
    }
  });
  it('keeps demo and incident protected fields server-shaped', () => {
    const incident = schema('incident.jsonc');
    expect(incident.properties.reporter_user_id).toBeTruthy();
    expect(incident.properties.is_demo.default).toBe(false);
    expect(incident.properties.request_id).toBeTruthy();
  });
});
