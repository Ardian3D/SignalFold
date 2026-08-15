import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, clean, failure, json, requestId } from './coordination.ts';
import { canMutateIncidentAuthority, loadIncidentForOrg } from './incident-authority.ts';
import {
  appendPostmortemEvent,
  buildPostmortemFingerprint,
  buildPostmortemSystemPrompt,
  buildPostmortemUserPrompt,
  callDeepSeekPostmortem,
  createPostmortemRecord,
  loadPostmortemForOrg,
  PM_BOUNDS,
  PM_ELIGIBLE_STATUSES,
  PM_FEATURE,
  PM_PROMPT_VERSION,
  PM_PROVIDER,
  safePostmortem,
  selectPostmortemTimeline,
  updatePostmortemSections,
  validatePostmortemResult,
} from './postmortem-workflow.ts';

const MODEL_ENV = 'DEEPSEEK_MODEL';
const API_KEY_ENV = 'DEEPSEEK_API_KEY';
const TIMEOUT_ENV = 'AI_POSTMORTEM_TIMEOUT_MS';
const BASE_URL_ENV = 'DEEPSEEK_BASE_URL';
const DEFAULT_MODEL = 'deepseek-v4-flash';
const DEFAULT_BASE_URL = 'https://api.deepseek.com';
const DEFAULT_TIMEOUT_MS = 30000;

const resolveModel = () => Deno.env.get(MODEL_ENV)?.trim() || DEFAULT_MODEL;
const resolveBaseUrl = () => Deno.env.get(BASE_URL_ENV)?.trim() || DEFAULT_BASE_URL;
const resolveTimeout = () => {
  const value = Number(Deno.env.get(TIMEOUT_ENV));
  return Number.isFinite(value) && value >= 1000 && value <= 60000 ? value : DEFAULT_TIMEOUT_MS;
};

const parseJsonObject = (content: string): unknown => {
  const text = content.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const loadAiRun = async (base44: any, organizationId: string, runId?: string) => {
  if (!runId) return null;
  const run = await base44.asServiceRole.entities.AiRun.get(runId);
  if (!run || run.organization_id !== organizationId) return null;
  return run;
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorizeActiveMembership(base44, input.organizationId);
    if (!canMutateIncidentAuthority(access.membership.role)) throw { code: 'FORBIDDEN', status: 403 };

    const incidentId = clean(input.incidentId, 128);
    if (!incidentId) throw { code: 'VALIDATION_FAILED', status: 400 };
    const incident = await loadIncidentForOrg(base44, access.organizationId, incidentId);
    if (!PM_ELIGIBLE_STATUSES.has(String(incident.status))) throw { code: 'INCIDENT_NOT_ELIGIBLE', status: 400 };

    const forceRegenerate = input.forceRegenerate === true;
    const confirmRegenerate = input.confirmRegenerate === true;
    if (forceRegenerate && !confirmRegenerate) throw { code: 'REGENERATION_CONFIRMATION_REQUIRED', status: 400 };

    const existing = await loadPostmortemForOrg(base44, access.organizationId, incidentId);
    if (existing && String(existing.status) === 'approved') throw { code: 'POSTMORTEM_APPROVED_IMMUTABLE', status: 409 };
    if (existing && !forceRegenerate) {
      const run = await loadAiRun(base44, access.organizationId, existing.aiRunId);
      return json({
        postmortem: safePostmortem(existing),
        model: run?.model ?? null,
        promptVersion: run?.prompt_version ?? null,
        cached: true,
      });
    }

    const service = incident.service_id ? await base44.asServiceRole.entities.Service.get(incident.service_id) : null;
    if (incident.service_id && (!service || service.organization_id !== access.organizationId)) throw { code: 'SERVICE_NOT_FOUND', status: 404 };

    const timeline = await base44.asServiceRole.entities.IncidentUpdate.filter({ organization_id: access.organizationId, incident_id: incidentId });
    const normalizedTimeline = timeline.map((row: Record<string, unknown>) => ({
      id: String(row.id),
      eventType: String(row.event_type ?? row.eventType ?? ''),
      message: String(row.message ?? ''),
      occurredAt: String(row.occurred_at ?? row.occurredAt ?? ''),
    }));
    const selectedTimeline = selectPostmortemTimeline(normalizedTimeline, 40);
    const timelineSignature = selectedTimeline.map((item) => `${item.at}|${item.event}`).join('~');

    const tasks = await base44.asServiceRole.entities.IncidentTask.filter({ organization_id: access.organizationId, incident_id: incidentId });
    const selectedTasks = tasks
      .map((task: Record<string, unknown>) => ({ title: String(task.title ?? ''), description: typeof task.description === 'string' ? String(task.description).slice(0, 400) : undefined, priority: String(task.priority ?? ''), status: String(task.status ?? '') }))
      .sort((a: { title: string }, b: { title: string }) => a.title.localeCompare(b.title))
      .slice(0, 30);
    const taskSignature = selectedTasks.map((task: { title: string; priority: string; status: string }) => `${task.title}|${task.priority}|${task.status}`).join('~');

    const promptInput = {
      code: typeof incident.code === 'string' ? String(incident.code) : undefined,
      title: String(incident.title),
      description: String(incident.description),
      serviceName: service?.name ?? undefined,
      severity: String(incident.severity ?? ''),
      category: typeof incident.category === 'string' ? String(incident.category) : undefined,
      impactSummary: typeof incident.impact_summary === 'string' ? String(incident.impact_summary) : undefined,
      reportedAt: typeof incident.reported_at === 'string' ? String(incident.reported_at) : undefined,
      resolvedAt: typeof incident.resolved_at === 'string' ? String(incident.resolved_at) : undefined,
      closedAt: typeof incident.closed_at === 'string' ? String(incident.closed_at) : undefined,
      resolutionSummary: typeof incident.resolution_summary === 'string' ? String(incident.resolution_summary) : undefined,
      rootCauseKnown: String(incident.root_cause_known ?? ''),
      recoveryVerified: incident.recovery_verified === true,
      remainingRisk: typeof incident.remaining_risk === 'string' ? String(incident.remaining_risk) : undefined,
      aiSummary: typeof incident.ai_summary === 'string' ? String(incident.ai_summary) : undefined,
      timeline: selectedTimeline,
      tasks: selectedTasks,
    };

    const model = resolveModel();
    const fingerprint = buildPostmortemFingerprint({
      title: promptInput.title,
      description: promptInput.description,
      serviceName: promptInput.serviceName,
      severity: promptInput.severity,
      category: promptInput.category,
      impactSummary: promptInput.impactSummary,
      resolvedAt: promptInput.resolvedAt,
      closedAt: promptInput.closedAt,
      resolutionSummary: promptInput.resolutionSummary,
      rootCauseKnown: promptInput.rootCauseKnown,
      recoveryVerified: promptInput.recoveryVerified,
      remainingRisk: promptInput.remainingRisk,
      aiSummary: promptInput.aiSummary,
      timelineSignature,
      taskSignature,
    });

    const apiKey = Deno.env.get(API_KEY_ENV)?.trim();
    if (!apiKey) throw { code: 'AI_NOT_CONFIGURED', status: 503 };

    const rid = requestId(input.requestId) ?? `pm_${crypto.randomUUID().replaceAll('-', '_')}`;

    const createRun = async () => {
      const existingRun = await base44.asServiceRole.entities.AiRun.filter({ organization_id: access.organizationId, incident_id: incidentId, feature: PM_FEATURE, request_id: rid });
      if (existingRun[0]) return existingRun[0];
      return base44.asServiceRole.entities.AiRun.create({
        organization_id: access.organizationId,
        incident_id: incidentId,
        feature: PM_FEATURE,
        provider: PM_PROVIDER,
        model,
        prompt_version: PM_PROMPT_VERSION,
        status: 'started',
        request_fingerprint: fingerprint,
        requested_by_user_id: access.user.id,
        started_at: new Date().toISOString(),
        is_demo: incident.is_demo === true,
        request_id: rid,
      });
    };
    const updateRun = async (run: any, patch: Record<string, unknown>) => {
      await base44.asServiceRole.entities.AiRun.update(run.id, { ...patch, organization_id: access.organizationId, completed_at: new Date().toISOString() });
    };

    const run = await createRun();
    const startedAt = Date.now();
    let sections;
    let inputTokens: number | undefined;
    let outputTokens: number | undefined;
    let repaired = false;

    try {
      const systemPrompt = buildPostmortemSystemPrompt();
      const userPrompt = buildPostmortemUserPrompt(promptInput);
      const first = await callDeepSeekPostmortem({ apiKey, model, systemPrompt, userPrompt, timeoutMs: resolveTimeout() });
      inputTokens = first.inputTokens;
      outputTokens = first.outputTokens;

      let validated = validatePostmortemResult(parseJsonObject(first.content));
      if (!validated.ok) {
        repaired = true;
        const repair = await callDeepSeekPostmortem({ apiKey, model, systemPrompt: `${systemPrompt}\n\nYour previous output failed validation. Return only a corrected JSON object matching the required shape.`, userPrompt, timeoutMs: resolveTimeout() });
        if (typeof repair.inputTokens === 'number') inputTokens = (inputTokens ?? 0) + repair.inputTokens;
        if (typeof repair.outputTokens === 'number') outputTokens = (outputTokens ?? 0) + repair.outputTokens;
        validated = validatePostmortemResult(parseJsonObject(repair.content));
      }
      if (!validated.ok) throw { code: 'AI_INVALID_RESPONSE', status: 502 };
      sections = validated.value;
    } catch (error) {
      const value = error as { code?: string; status?: number };
      const durationMs = Date.now() - startedAt;
      await updateRun(run, {
        status: value.code === 'AI_INVALID_RESPONSE' ? 'invalid_response' : 'failed',
        duration_ms: durationMs,
        input_token_count: inputTokens,
        output_token_count: outputTokens,
        error_code: value.code ?? 'AI_PROVIDER_UNAVAILABLE',
      });
      return json({ error: value.code ?? 'AI_PROVIDER_UNAVAILABLE', aiRun: { ...run, status: value.code === 'AI_INVALID_RESPONSE' ? 'invalid_response' : 'failed' } }, value.status ?? 502);
    }

    const durationMs = Date.now() - startedAt;
    const resultSummary = {
      postmortem: {
        status: 'draft',
        version: existing ? existing.version + 1 : 1,
        repaired,
        executiveSummary: sections.executiveSummary.slice(0, 4000),
        rootCause: sections.rootCause.slice(0, 4000),
      },
    };
    await updateRun(run, {
      status: 'succeeded',
      duration_ms: durationMs,
      input_token_count: inputTokens,
      output_token_count: outputTokens,
      result_summary: resultSummary,
    });

    let postmortem;
    if (existing) {
      postmortem = await updatePostmortemSections(base44, existing.id, access.organizationId, sections, {
        ai_run_id: run.id,
        version: existing.version + 1,
        generated_by_ai: true,
        request_id: rid,
      });
    } else {
      postmortem = await createPostmortemRecord(base44, {
        organizationId: access.organizationId,
        incidentId,
        sections,
        generatedByAi: true,
        aiRunId: run.id,
        isDemo: incident.is_demo === true,
        requestId: rid,
      });
    }

    const event = await appendPostmortemEvent(base44, {
      organizationId: access.organizationId,
      incidentId,
      eventType: 'postmortem_generated',
      message: `Postmortem draft generated for Incident ${incident.code}.`,
      actorUserId: access.user.id,
      actorType: 'ai',
      metadata: { model, prompt_version: PM_PROMPT_VERSION, feature: PM_FEATURE, request_id: rid },
      isDemo: incident.is_demo === true,
      requestId: rid,
    });

    return json({ postmortem: safePostmortem(postmortem), model, promptVersion: PM_PROMPT_VERSION, cached: false, repaired, timelineEvent: event }, 200);
  } catch (error) {
    return failure(error);
  }
});
