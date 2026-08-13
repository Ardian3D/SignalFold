import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, clean, failure, json, requestId } from './coordination.ts';
import { canMutateIncidentAuthority, loadIncidentForOrg } from './incident-authority.ts';
import { createPostmortemRecord, loadPostmortemForOrg, PM_ELIGIBLE_STATUSES, safePostmortem } from './postmortem-workflow.ts';

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

    const existing = await loadPostmortemForOrg(base44, access.organizationId, incidentId);
    if (existing) {
      if (String(existing.status) === 'approved') throw { code: 'POSTMORTEM_APPROVED_IMMUTABLE', status: 409 };
      return json({ postmortem: safePostmortem(existing), existing: true });
    }

    const rid = requestId(input.requestId) ?? null;
    const sections = {
      executiveSummary: '',
      impact: '',
      detection: '',
      timelineSummary: [] as Array<{ at: string; event: string }>,
      rootCause: '',
      contributingFactors: [] as string[],
      resolution: '',
      wentWell: [] as string[],
      wentPoorly: [] as string[],
      preventiveActions: [] as Array<{ title: string; ownerRole: string; priority: 'high' | 'medium' | 'low'; suggestedDueInDays: number }>,
      unknowns: [] as string[],
    };

    const postmortem = await createPostmortemRecord(base44, {
      organizationId: access.organizationId,
      incidentId,
      sections,
      generatedByAi: false,
      aiRunId: undefined,
      isDemo: incident.is_demo === true,
      requestId: rid ?? undefined,
    });

    return json({ postmortem: safePostmortem(postmortem), existing: false });
  } catch (error) {
    return failure(error);
  }
});
