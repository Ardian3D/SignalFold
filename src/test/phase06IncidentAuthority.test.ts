import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  canChangeIncidentStatus,
  canCloseIncident,
  canMutateIncidentAuthority,
  canResolveIncident,
  getAllowedIncidentTransitions,
  getAllowedNonResolutionTransitions,
  isAllowedIncidentTransition,
  isTerminalIncidentStatus,
} from '@/features/incidents/domain/incidentStateMachine';
import { countOpenCriticalTasks } from '../../base44/functions/resolve-incident/incident-authority';

const read = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), 'utf8');

describe('Phase 06 incident authority contracts', () => {
  it('defines the canonical non-resolution state machine and excludes reopen', () => {
    expect(getAllowedIncidentTransitions('reported')).toEqual(['triaging', 'investigating', 'closed']);
    expect(getAllowedIncidentTransitions('investigating')).toEqual(['identified', 'monitoring']);
    expect(getAllowedIncidentTransitions('resolved')).toEqual(['closed']);
    expect(getAllowedIncidentTransitions('closed')).toEqual([]);
    expect(isAllowedIncidentTransition('resolved', 'investigating')).toBe(false);
    expect(getAllowedNonResolutionTransitions('investigating')).not.toContain('resolved');
    expect(isTerminalIncidentStatus('closed')).toBe(true);
  });

  it('restricts status authority to incident managers and admins', () => {
    expect(canMutateIncidentAuthority('admin')).toBe(true);
    expect(canMutateIncidentAuthority('incident_manager')).toBe(true);
    expect(canMutateIncidentAuthority('responder')).toBe(false);
    expect(canMutateIncidentAuthority('reporter')).toBe(false);
    expect(canChangeIncidentStatus('responder', 'reported')).toBe(false);
    expect(canResolveIncident('admin', 'investigating')).toBe(true);
    expect(canResolveIncident('admin', 'reported')).toBe(false);
    expect(canCloseIncident('admin', 'resolved')).toBe(true);
    expect(canCloseIncident('admin', 'investigating')).toBe(false);
  });

  it('extends Incident schema with root cause and override reason while denying direct writes', () => {
    const schema = read('base44/entities/incident.jsonc');
    expect(schema).toContain('"root_cause_known"');
    expect(schema).toContain('"resolution_override_reason"');
    expect(schema).toContain('"rls": { "create": false, "read": false, "update": false, "delete": false }');
  });

  it('extends IncidentUpdate event enum for authority events', () => {
    const schema = read('base44/entities/incident-update.jsonc');
    for (const event of ['status_changed', 'severity_changed', 'commander_assigned', 'commander_reassigned', 'commander_unassigned', 'incident_resolved', 'incident_closed']) {
      expect(schema).toContain(event);
    }
  });

  it('implements concurrency-safe conditional updates for authority mutations', () => {
    const changeState = read('base44/functions/change-incident-state/entry.ts');
    const changeSeverity = read('base44/functions/change-incident-severity/entry.ts');
    const assignCommander = read('base44/functions/assign-incident-commander/entry.ts');
    const resolveIncident = read('base44/functions/resolve-incident/entry.ts');
    expect(changeState).toContain('updateMany');
    expect(changeState).toContain('INCIDENT_STATE_CONFLICT');
    expect(changeState).toContain("targetStatus === 'resolved'");
    expect(changeSeverity).toContain('INCIDENT_SEVERITY_CONFLICT');
    expect(changeSeverity).toContain("severity_source: 'human'");
    expect(assignCommander).toContain('resolveCommanderCandidate');
    expect(assignCommander).toContain('COMMANDER_CONFLICT');
    expect(assignCommander).toContain('commander_user_id: currentCommander ?? null');
    expect(assignCommander).toContain('commander_user_id: nextCommander ?? null');
    expect(assignCommander).not.toContain('commander_user_id: currentCommander ?? \'\'');
    expect(assignCommander).not.toContain('commander_user_id: nextCommander ?? \'\'');
    expect(read('base44/functions/assign-incident-commander/incident-authority.ts')).toContain('COMMANDER_ROLE_INVALID');
    expect(resolveIncident).toContain('OPEN_CRITICAL_TASKS');
    expect(resolveIncident).toContain('RECOVERY_NOT_VERIFIED');
    expect(resolveIncident).toContain('overrideOpenCriticalTasks');
  });

  it('keeps get-incident authority reads zero-write and capability-aware', () => {
    const entry = read('base44/functions/get-incident/entry.ts');
    expect(entry).toContain('openCriticalTaskCount');
    expect(entry).toContain('allowedTransitions');
    expect(entry).toContain('commanderOptions');
    expect(entry).not.toContain('.create(');
    expect(entry).not.toContain('.update(');
    expect(entry).not.toContain('updateMany');
  });

  it('counts open critical tasks deterministically for every canonical task status', async () => {
    const statuses: Array<[string, number]> = [
      ['todo', 1],
      ['in_progress', 1],
      ['blocked', 1],
      ['done', 0],
      ['cancelled', 0],
    ];
    for (const [status, expected] of statuses) {
      const base44 = {
        asServiceRole: {
          entities: {
            IncidentTask: {
              filter: vi.fn().mockResolvedValue([
                { id: 't1', organization_id: 'org-1', incident_id: 'incident-1', priority: 'critical', status },
              ]),
            },
          },
        },
      };
      const count = await countOpenCriticalTasks(base44, 'org-1', 'incident-1');
      expect(count, `critical ${status}`).toBe(expected);
    }
  });

  it('rejects resolution without override and without an override reason, and creates no resolution event', () => {
    const entry = read('base44/functions/resolve-incident/entry.ts');
    expect(entry).toContain('if (openCritical > 0) {');
    expect(entry).toContain("input.overrideOpenCriticalTasks !== true || overrideReason.length < 3");
    expect(entry).toContain("throw { code: 'OPEN_CRITICAL_TASKS'");
    const guardLine = entry.split('\n').find(line => line.includes("input.overrideOpenCriticalTasks !== true")) ?? '';
    expect(guardLine.indexOf('throw')).toBeGreaterThan(0);
    expect(entry).toMatch(/overrideOpenCriticalTasks !== true[\s\S]*?throw \{ code: 'OPEN_CRITICAL_TASKS'/);
  });

  it('appends exactly one incident_resolved event after a successful override', () => {
    const entry = read('base44/functions/resolve-incident/entry.ts');
    const afterUpdate = entry.split("await appendAuthorityEvent(").length - 1;
    expect(afterUpdate).toBe(1);
    expect(entry).toContain("eventType: 'incident_resolved'");
    expect(entry).toContain('metadata');
    expect(entry).toContain('override_used: overrideUsed');
    expect(entry).toContain('open_critical_tasks: openCritical');
    const rejectedPath = entry.match(/if \(openCritical > 0\) \{[\s\S]*?throw \{ code: 'OPEN_CRITICAL_TASKS'[\s\S]*?\n    \}/)?.[0] ?? '';
    expect(rejectedPath).not.toContain('appendAuthorityEvent');
    expect(rejectedPath).not.toContain('IncidentUpdate.create');
  });
});
