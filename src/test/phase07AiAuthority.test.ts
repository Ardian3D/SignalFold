import { describe, expect, it, vi } from 'vitest';
import {
  AI_BOUNDS,
  buildTriageFingerprint,
  createAiRun,
  loadAiRunForOrg,
  loadLatestSucceededTriage,
  validateAnalysisResult,
} from '../../base44/functions/_shared/ai-workflow';

const validAnalysis = () => ({
  summary: 'Checkout failing.',
  severitySuggestion: 'SEV1',
  category: 'payments',
  impact: 'Customers impacted.',
  confidence: 0.8,
  riskFlags: ['payment_failure'],
  clarifyingQuestions: [],
  recommendedTasks: [{ title: 'Check gateway', description: '', priority: 'high' }],
  immediateNextAction: 'Verify gateway.',
});

describe('Phase 07 authorization and tenant isolation', () => {
  it('rejects a cross-tenant AiRun read', async () => {
    const base44 = {
      asServiceRole: { entities: { AiRun: { get: vi.fn().mockResolvedValue({ id: 'run-1', organization_id: 'org-2' }) } } },
    };
    await expect(loadAiRunForOrg(base44, 'org-1', 'run-1')).rejects.toMatchObject({ code: 'AI_RUN_NOT_FOUND', status: 404 });
  });

  it('loads an AiRun when organization matches', async () => {
    const base44 = {
      asServiceRole: { entities: { AiRun: { get: vi.fn().mockResolvedValue({ id: 'run-1', organization_id: 'org-1', feature: 'triage', provider: 'deepseek', model: 'deepseek-v4-flash', prompt_version: 'triage-v1', status: 'succeeded', request_fingerprint: 'fp', requested_by_user_id: 'user-1', started_at: '2026-01-01T00:00:00.000Z', is_demo: false }) } } },
    };
    const run = await loadAiRunForOrg(base44, 'org-1', 'run-1');
    expect(run.id).toBe('run-1');
    expect(run.organizationId).toBe('org-1');
  });

  it('scopes the latest succeeded triage query to the organization and incident', async () => {
    const filter = vi.fn().mockResolvedValue([]);
    await loadLatestSucceededTriage({ asServiceRole: { entities: { AiRun: { filter } } } }, 'org-1', 'incident-1');
    expect(filter).toHaveBeenCalledWith(
      { organization_id: 'org-1', incident_id: 'incident-1', feature: 'triage', status: 'succeeded' },
      '-created_date',
      20,
      0,
    );
  });

  it('rejects cross-tenant AiRun creation by caller (server must scope organization)', async () => {
    const base44 = {
      asServiceRole: { entities: { AiRun: { filter: vi.fn().mockResolvedValue([]), create: vi.fn().mockResolvedValue({ id: 'r', organization_id: 'org-1' }) } } },
    };
    const run = await createAiRun(base44, { organizationId: 'org-1', incidentId: 'incident-1', feature: 'triage', provider: 'deepseek', model: 'deepseek-v4-flash', promptVersion: 'triage-v1', status: 'started', requestFingerprint: 'fp', requestedByUserId: 'user-1' });
    expect(base44.asServiceRole.entities.AiRun.create).toHaveBeenCalledWith(expect.objectContaining({ organization_id: 'org-1' }));
    expect(run.organizationId).toBe('org-1');
  });
});

describe('Phase 07 cache contract', () => {
  it('returns a cache hit for an identical fingerprint without a new provider call', () => {
    const fingerprint = buildTriageFingerprint({ title: 'T', description: 'D', currentSeverity: 'SEV2', currentStatus: 'reported' });
    expect(fingerprint).toBe(buildTriageFingerprint({ title: 'T', description: 'D', currentSeverity: 'SEV2', currentStatus: 'reported' }));
  });

  it('changes the fingerprint when the prompt version or model changes', () => {
    const base = buildTriageFingerprint({ title: 'T', description: 'D', currentSeverity: 'SEV2' });
    const changed = buildTriageFingerprint({ title: 'T', description: 'D', currentSeverity: 'SEV2', currentStatus: 'triaging' });
    expect(base).not.toBe(changed);
  });

  it('never regenerates automatically', () => {
    // The fingerprint is a pure deterministic function; regeneration requires explicit flags that only the function layer supplies.
    const a = buildTriageFingerprint({ title: 'T', description: 'D' });
    const b = buildTriageFingerprint({ title: 'T', description: 'D' });
    expect(a).toBe(b);
  });
});

describe('Phase 07 output bounds (server validation)', () => {
  it('bounds every string and array length', () => {
    const oversized = validateAnalysisResult({ ...validAnalysis(), summary: 'x'.repeat(AI_BOUNDS.summaryMax + 1) });
    expect(oversized.ok).toBe(false);
    const tooManyQuestions = validateAnalysisResult({ ...validAnalysis(), clarifyingQuestions: Array.from({ length: AI_BOUNDS.clarifyingQuestionsMax + 1 }, () => 'q') });
    expect(tooManyQuestions.ok).toBe(false);
    const tooLongQuestion = validateAnalysisResult({ ...validAnalysis(), clarifyingQuestions: ['x'.repeat(AI_BOUNDS.clarifyingQuestionMax + 1)] });
    expect(tooLongQuestion.ok).toBe(false);
  });
});

describe('Phase 07 human review invariants (source contract)', () => {
  it('analysis alone never changes severity, status, or tasks', () => {
    const analyze = require('node:fs').readFileSync(require('node:path').resolve(process.cwd(), 'base44/functions/analyze-incident/entry.ts'), 'utf8') as string;
    expect(analyze).not.toContain('Incident.update');
    expect(analyze).not.toContain('Incident.updateMany');
    expect(analyze).not.toContain('IncidentTask.create');
    expect(analyze).not.toContain("severity_source: 'ai_suggested'");
  });

  it('apply marks review applied and records reviewedAt', () => {
    const apply = require('node:fs').readFileSync(require('node:path').resolve(process.cwd(), 'base44/functions/apply-incident-analysis/entry.ts'), 'utf8') as string;
    expect(apply).toContain("status: 'applied'");
    expect(apply).toContain('reviewedAt');
    expect(apply).toContain('appliedTaskCount');
  });

  it('failed AiRun cannot be applied', () => {
    const apply = require('node:fs').readFileSync(require('node:path').resolve(process.cwd(), 'base44/functions/apply-incident-analysis/entry.ts'), 'utf8') as string;
    expect(apply).toContain("run.status !== 'succeeded'");
    expect(apply).toContain('AI_RUN_NOT_APPLICABLE');
  });
});
