import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, clean, failure, json, requestId } from './coordination.ts';
import { canMutateIncidentAuthority, loadIncidentForOrg } from './incident-authority.ts';
import {
  AI_FEATURE_TRIAGE,
  AI_PROMPT_VERSION,
  AI_PROVIDER_DEEPSEEK,
  appendAiEvent,
  buildTriageFingerprint,
  buildTriagePromptVersion,
  buildTriageSystemPrompt,
  buildTriageUserPrompt,
  callDeepSeekTriage,
  createAiRun,
  loadLatestSucceededTriage,
  updateAiRunStatus,
  validateAnalysisResult,
} from './ai-workflow.ts';

const MODEL_ENV = 'DEEPSEEK_MODEL';
const API_KEY_ENV = 'DEEPSEEK_API_KEY';
const TIMEOUT_ENV = 'DEEPSEEK_TIMEOUT_MS';
const BASE_URL_ENV = 'DEEPSEEK_BASE_URL';
const DEFAULT_MODEL = 'deepseek-v4-flash';
const DEFAULT_BASE_URL = 'https://api.deepseek.com';
const DEFAULT_TIMEOUT_MS = 20000;

const resolveModel = () => {
  const configured = Deno.env.get(MODEL_ENV)?.trim();
  return configured || DEFAULT_MODEL;
};

const resolveBaseUrl = () => {
  const configured = Deno.env.get(BASE_URL_ENV)?.trim();
  return configured || DEFAULT_BASE_URL;
};

const resolveTimeout = () => {
  const value = Number(Deno.env.get(TIMEOUT_ENV));
  return Number.isFinite(value) && value >= 1000 && value <= 60000 ? value : DEFAULT_TIMEOUT_MS;
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
    const service = incident.service_id ? await base44.asServiceRole.entities.Service.get(incident.service_id) : null;
    if (incident.service_id && (!service || service.organization_id !== access.organizationId)) throw { code: 'SERVICE_NOT_FOUND', status: 404 };

    const model = resolveModel();
    const promptVersion = buildTriagePromptVersion();
    const fingerprint = buildTriageFingerprint({
      title: String(incident.title),
      description: String(incident.description),
      serviceName: service?.name ?? undefined,
      serviceCriticality: service?.criticality ?? undefined,
      observedStartAt: incident.observed_start_at ?? undefined,
      impactSummary: incident.impact_summary ?? undefined,
      currentSeverity: String(incident.severity ?? ''),
      currentStatus: String(incident.status ?? ''),
    });

    const forceRegenerate = input.forceRegenerate === true;
    const confirmRegenerate = input.confirmRegenerate === true;
    if (forceRegenerate && !confirmRegenerate) throw { code: 'REGENERATION_CONFIRMATION_REQUIRED', status: 400 };

    const cached = await loadLatestSucceededTriage(base44, access.organizationId, incident.id);
    if (cached && cached.requestFingerprint === fingerprint && !forceRegenerate) {
      const cachedReview = cached.resultSummary?.review && typeof cached.resultSummary.review === 'object' ? cached.resultSummary.review as Record<string, unknown> : {};
      return json({ suggestion: cached.resultSummary?.analysis ?? null, aiRun: cached, cached: true, model, promptVersion, reviewStatus: String(cachedReview.status ?? 'pending') });
    }

    const apiKey = Deno.env.get(API_KEY_ENV)?.trim();
    if (!apiKey) throw { code: 'AI_NOT_CONFIGURED', status: 503 };

    const rid = requestId(input.requestId) ?? `ai_${crypto.randomUUID().replaceAll('-', '_')}`;
    const run = await createAiRun(base44, {
      organizationId: access.organizationId,
      incidentId: incident.id,
      feature: AI_FEATURE_TRIAGE,
      provider: AI_PROVIDER_DEEPSEEK,
      model,
      promptVersion,
      status: 'started',
      requestFingerprint: fingerprint,
      requestedByUserId: access.user.id,
      isDemo: incident.is_demo === true,
      requestId: rid,
    });

    await appendAiEvent(base44, {
      organizationId: access.organizationId,
      incidentId: incident.id,
      eventType: 'ai_analysis_requested',
      message: `AI analysis requested for Incident ${incident.code}.`,
      actorUserId: access.user.id,
      metadata: { model, prompt_version: promptVersion, feature: AI_FEATURE_TRIAGE, request_id: rid },
      isDemo: incident.is_demo === true,
      requestId: rid,
    });

    const startedAt = Date.now();
    let analysis;
    let rawContent: string | null = null;
    let inputTokens: number | undefined;
    let outputTokens: number | undefined;
    let repaired = false;

    try {
      const systemPrompt = buildTriageSystemPrompt();
      const userPrompt = buildTriageUserPrompt({
        title: String(incident.title),
        description: String(incident.description),
        serviceName: service?.name ?? undefined,
        serviceCriticality: service?.criticality ?? undefined,
        observedStartAt: incident.observed_start_at ?? undefined,
        impactSummary: incident.impact_summary ?? undefined,
        currentSeverity: String(incident.severity ?? ''),
        currentStatus: String(incident.status ?? ''),
      });

      const first = await callDeepSeekTriage({
        apiKey,
        model,
        systemPrompt,
        userPrompt,
        timeoutMs: resolveTimeout(),
      });
      rawContent = first.content;
      inputTokens = first.inputTokens;
      outputTokens = first.outputTokens;

      let validated = validateAnalysisResult(parseJsonObject(first.content));
      if (!validated.ok) {
        repaired = true;
        const repair = await callDeepSeekTriage({
          apiKey,
          model,
          systemPrompt: `${systemPrompt}\n\nYour previous output failed validation. Return only a corrected JSON object matching the required shape.`,
          userPrompt,
          timeoutMs: resolveTimeout(),
        });
        if (typeof repair.inputTokens === 'number') inputTokens = (inputTokens ?? 0) + repair.inputTokens;
        if (typeof repair.outputTokens === 'number') outputTokens = (outputTokens ?? 0) + repair.outputTokens;
        validated = validateAnalysisResult(parseJsonObject(repair.content));
      }

      if (!validated.ok) throw { code: 'AI_INVALID_RESPONSE', status: 502 };
      analysis = validated.value;
    } catch (error) {
      const value = error as { code?: string; status?: number };
      const durationMs = Date.now() - startedAt;
      await updateAiRunStatus(base44, run.id, access.organizationId, {
        status: value.code === 'AI_INVALID_RESPONSE' ? 'invalid_response' : 'failed',
        durationMs,
        inputTokenCount: inputTokens,
        outputTokenCount: outputTokens,
        errorCode: value.code ?? 'AI_PROVIDER_UNAVAILABLE',
      });
      const failedEvent = await appendAiEvent(base44, {
        organizationId: access.organizationId,
        incidentId: incident.id,
        eventType: 'ai_analysis_failed',
        message: `AI analysis failed for Incident ${incident.code}.`,
        actorUserId: access.user.id,
        metadata: { model, prompt_version: promptVersion, error_code: value.code ?? 'AI_PROVIDER_UNAVAILABLE', request_id: rid },
        isDemo: incident.is_demo === true,
        requestId: `${rid}_failed`,
      });
      return json({ error: value.code ?? 'AI_PROVIDER_UNAVAILABLE', aiRun: { ...run, status: value.code === 'AI_INVALID_RESPONSE' ? 'invalid_response' : 'failed' }, timelineEvent: failedEvent }, (value.status ?? 502));
    }

    const durationMs = Date.now() - startedAt;
    const resultSummary = {
      analysis,
      review: { status: 'pending' },
      provenance: { model, promptVersion, repaired, generatedAt: new Date().toISOString() },
    };
    await updateAiRunStatus(base44, run.id, access.organizationId, {
      status: 'succeeded',
      durationMs,
      inputTokenCount: inputTokens,
      outputTokenCount: outputTokens,
      resultSummary,
    });

    const completedEvent = await appendAiEvent(base44, {
      organizationId: access.organizationId,
      incidentId: incident.id,
      eventType: 'ai_analysis_completed',
      message: `AI analysis completed for Incident ${incident.code}.`,
      actorUserId: access.user.id,
      metadata: { model, prompt_version: promptVersion, feature: AI_FEATURE_TRIAGE, request_id: rid },
      isDemo: incident.is_demo === true,
      requestId: `${rid}_completed`,
    });

    return json({
      suggestion: analysis,
      aiRun: { ...run, status: 'succeeded', resultSummary, durationMs, inputTokenCount: inputTokens, outputTokenCount: outputTokens },
      cached: false,
      model,
      promptVersion,
      reviewStatus: 'pending',
      repaired,
      timelineEvent: completedEvent,
    }, 200);
  } catch (error) {
    return failure(error);
  }
});

const parseJsonObject = (content: string): unknown => {
  const text = content.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};
