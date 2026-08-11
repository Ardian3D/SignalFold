import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, clean, failure, json, requestId } from './coordination.ts';
import {
  appendAuthorityEvent,
  canMutateIncidentAuthority,
  isAllowedTransition,
  loadIncidentForOrg,
  safeIncidentAuthority,
  severities,
  statuses,
} from './incident-authority.ts';
import {
  AI_CATEGORIES,
  AI_FEATURE_TRIAGE,
  AI_RISK_FLAGS,
  AI_TASK_PRIORITIES,
  AI_BOUNDS,
  appendAiEvent,
  loadAiRunForOrg,
  stripHtml,
  updateAiRunStatus,
} from './ai-workflow.ts';

const taskPriorities = AI_TASK_PRIORITIES as readonly string[];
const categories = AI_CATEGORIES as readonly string[];
const riskFlags = AI_RISK_FLAGS as readonly string[];

const clampString = (value: unknown, max: number) => {
  if (typeof value !== 'string') return null;
  const text = stripHtml(value).replace(/\s+/g, ' ').trim();
  if (text.length > max) return null;
  return text;
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorizeActiveMembership(base44, input.organizationId);
    if (!canMutateIncidentAuthority(access.membership.role)) throw { code: 'FORBIDDEN', status: 403 };
    const rid = requestId(input.requestId);
    if (!rid) throw { code: 'VALIDATION_FAILED', status: 400 };

    const incident = await loadIncidentForOrg(base44, access.organizationId, clean(input.incidentId, 128));
    const run = await loadAiRunForOrg(base44, access.organizationId, clean(input.aiRunId, 128));
    if (!run.incidentId || run.incidentId !== incident.id || run.feature !== AI_FEATURE_TRIAGE) throw { code: 'AI_RUN_INCIDENT_MISMATCH', status: 409 };
    if (run.status !== 'succeeded') throw { code: 'AI_RUN_NOT_APPLICABLE', status: 409 };
    const reviewState = run.resultSummary?.review && typeof run.resultSummary.review === 'object'
      ? run.resultSummary.review as Record<string, unknown>
      : {};
    if (String(reviewState.status ?? 'pending') !== 'pending') throw { code: 'AI_REVIEW_ALREADY_APPLIED', status: 409 };

    const priorEvent = await base44.asServiceRole.entities.IncidentUpdate.filter({
      organization_id: access.organizationId,
      incident_id: incident.id,
      request_id: rid,
    });
    if (priorEvent[0]) return json({ incident: safeIncidentAuthority(incident), reconciled: true, aiRun: { ...run, status: 'succeeded' } });

    const analysis = input.analysis && typeof input.analysis === 'object' ? input.analysis as Record<string, unknown> : null;
    if (!analysis) throw { code: 'VALIDATION_FAILED', status: 400 };

    const summary = clampString(analysis.summary, AI_BOUNDS.summaryMax);
    const category = String(analysis.category ?? '').toLowerCase();
    const impact = clampString(analysis.impact, AI_BOUNDS.impactMax);
    const confidence = typeof analysis.confidence === 'number' && Number.isFinite(analysis.confidence) && analysis.confidence >= 0 && analysis.confidence <= 1 ? analysis.confidence : null;
    const riskFlagsRaw = Array.isArray(analysis.riskFlags) ? analysis.riskFlags : [];
    const immediateNextAction = clampString(analysis.immediateNextAction, AI_BOUNDS.immediateNextActionMax);
    if (!summary || !categories.includes(category) || !impact || confidence === null || !immediateNextAction) throw { code: 'VALIDATION_FAILED', status: 400 };
    const normalizedRiskFlags: string[] = [];
    for (const flag of riskFlagsRaw) {
      const value = String(flag ?? '').toLowerCase();
      if (!riskFlags.includes(value)) throw { code: 'VALIDATION_FAILED', status: 400 };
      normalizedRiskFlags.push(value);
    }

    const applySeverity = input.applySeverity === true;
    const selectedSeverity = String(analysis.severitySuggestion ?? '').toUpperCase();
    if (!severities.has(selectedSeverity)) throw { code: 'VALIDATION_FAILED', status: 400 };
    let severityChanged = false;
    if (applySeverity) {
      if (String(incident.severity) !== selectedSeverity) {
        const severityReason = clampString(input.severityReason, 1000);
        if (!severityReason) throw { code: 'SEVERITY_REASON_REQUIRED', status: 400 };
        const patch: Record<string, unknown> = {
          severity: selectedSeverity,
          severity_source: String(input.originalAiSeverity ?? '') === selectedSeverity ? 'ai_suggested' : 'human',
        };
        const result = await base44.asServiceRole.entities.Incident.updateMany(
          { id: incident.id, organization_id: access.organizationId, severity: String(incident.severity) },
          { $set: { ...patch, request_id: rid } },
        );
        if ((result?.updated ?? 0) === 0) throw { code: 'INCIDENT_SEVERITY_CONFLICT', status: 409 };
        severityChanged = true;
        await appendAuthorityEvent(base44, {
          organizationId: access.organizationId,
          incidentId: incident.id,
          eventType: 'severity_changed',
          message: `Incident ${incident.code} severity changed from ${incident.severity} to ${selectedSeverity} after human review of AI-assisted triage. ${severityReason}`,
          actorUserId: access.user.id,
          metadata: { previous_severity: String(incident.severity), new_severity: selectedSeverity, reason: severityReason, ai_assisted: true, ai_run_id: run.id, request_id: rid },
          isDemo: incident.is_demo === true,
          requestId: rid,
        });
      }
    }

    const applyStatus = input.applyStatus === true;
    const targetStatus = String(input.targetStatus ?? '').toLowerCase();
    let statusChanged = false;
    if (applyStatus) {
      if (!statuses.has(targetStatus)) throw { code: 'VALIDATION_FAILED', status: 400 };
      if (targetStatus === 'resolved' || targetStatus === 'closed') throw { code: 'INVALID_STATE_TRANSITION', status: 400 };
      if (String(incident.status) !== targetStatus) {
        if (!isAllowedTransition(String(incident.status), targetStatus)) throw { code: 'INVALID_STATE_TRANSITION', status: 400 };
        const patch: Record<string, unknown> = { status: targetStatus };
        if (String(incident.status) === 'reported' && !incident.acknowledged_at) patch.acknowledged_at = new Date().toISOString();
        const result = await base44.asServiceRole.entities.Incident.updateMany(
          { id: incident.id, organization_id: access.organizationId, status: String(incident.status) },
          { $set: { ...patch, request_id: rid } },
        );
        if ((result?.updated ?? 0) === 0) throw { code: 'INCIDENT_STATE_CONFLICT', status: 409 };
        statusChanged = true;
        await appendAuthorityEvent(base44, {
          organizationId: access.organizationId,
          incidentId: incident.id,
          eventType: 'status_changed',
          message: `Incident ${incident.code} status changed from ${incident.status} to ${targetStatus} after human review of AI-assisted triage.`,
          actorUserId: access.user.id,
          metadata: { previous_status: String(incident.status), new_status: targetStatus, ai_assisted: true, ai_run_id: run.id, request_id: rid },
          isDemo: incident.is_demo === true,
          requestId: rid,
        });
      }
    }

    const selectedTasks = Array.isArray(input.selectedTasks) ? input.selectedTasks : [];
    const createdTasks: Record<string, unknown>[] = [];
    if (selectedTasks.length > AI_BOUNDS.recommendedTasksMax) throw { code: 'VALIDATION_FAILED', status: 400 };
    for (const item of selectedTasks) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) throw { code: 'VALIDATION_FAILED', status: 400 };
      const title = clampString((item as Record<string, unknown>).title, AI_BOUNDS.taskTitleMax);
      const description = clampString((item as Record<string, unknown>).description, AI_BOUNDS.taskDescriptionMax);
      const priority = String((item as Record<string, unknown>).priority ?? '').toLowerCase();
      if (!title || title.length < AI_BOUNDS.taskTitleMin || !taskPriorities.includes(priority)) throw { code: 'VALIDATION_FAILED', status: 400 };
      const existing = await base44.asServiceRole.entities.IncidentTask.filter({ organization_id: access.organizationId, incident_id: incident.id, request_id: `${rid}_${title}` });
      if (existing[0]) {
        createdTasks.push(existing[0]);
        continue;
      }
      const count = await base44.asServiceRole.entities.IncidentTask.filter({ organization_id: access.organizationId, incident_id: incident.id });
      const task = await base44.asServiceRole.entities.IncidentTask.create({
        organization_id: access.organizationId,
        incident_id: incident.id,
        title,
        description: description || undefined,
        priority,
        status: 'todo',
        assignee_user_id: '',
        created_by_user_id: access.user.id,
        source: 'ai',
        order_index: count.length + 1,
        ai_run_id: run.id,
        is_demo: false,
        request_id: `${rid}_${title}`,
      });
      createdTasks.push(task);
      await appendAuthorityEvent(base44, {
        organizationId: access.organizationId,
        incidentId: incident.id,
        eventType: 'task_created',
        message: `Task ${title} was created from reviewed AI triage.`,
        actorUserId: access.user.id,
        metadata: { task_id: task.id, task_title: title, priority, ai_run_id: run.id, request_id: `${rid}_${title}` },
        isDemo: incident.is_demo === true,
        requestId: `${rid}_${title}`,
      });
    }

    const incidentPatch: Record<string, unknown> = {
      ai_summary: summary,
      category,
      impact_summary: impact,
      ai_confidence: confidence,
      ai_risk_flags: normalizedRiskFlags,
      ai_analysis_version: run.promptVersion,
      ai_last_analyzed_at: new Date().toISOString(),
    };
    await base44.asServiceRole.entities.Incident.update(incident.id, { ...incidentPatch, organization_id: access.organizationId, request_id: rid });

    const nextReview = {
      status: 'applied',
      reviewedAt: new Date().toISOString(),
      wasEdited: input.wasEdited === true,
      appliedTaskCount: createdTasks.length,
      severityChanged,
      statusChanged,
    };
    await updateAiRunStatus(base44, run.id, access.organizationId, {
      status: 'succeeded',
      resultSummary: { ...run.resultSummary, review: nextReview },
    });

    const updated = await loadIncidentForOrg(base44, access.organizationId, incident.id);
    return json({
      incident: safeIncidentAuthority(updated),
      aiRun: { ...run, status: 'succeeded', resultSummary: { ...run.resultSummary, review: nextReview } },
      review: nextReview,
      createdTasks: createdTasks.map((task) => ({ id: String(task.id), title: String(task.title), priority: String(task.priority), source: String(task.source ?? 'ai') })),
      severityChanged,
      statusChanged,
    });
  } catch (error) {
    return failure(error);
  }
});
