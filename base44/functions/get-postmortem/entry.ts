import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, clean, failure, json } from './coordination.ts';
import { loadIncidentForOrg } from './incident-authority.ts';
import { loadPostmortemForOrg, safePostmortem } from './postmortem-workflow.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorizeActiveMembership(base44, input.organizationId);

    const incidentId = clean(input.incidentId, 128);
    if (!incidentId) throw { code: 'VALIDATION_FAILED', status: 400 };
    const incident = await loadIncidentForOrg(base44, access.organizationId, incidentId);

    const postmortem = await loadPostmortemForOrg(base44, access.organizationId, incidentId);
    if (!postmortem) return json({ postmortem: null, incidentStatus: incident.status });

    const run = postmortem.aiRunId ? await base44.asServiceRole.entities.AiRun.get(postmortem.aiRunId) : null;
    const approver = postmortem.approvedByUserId ? await base44.asServiceRole.entities.User.get(postmortem.approvedByUserId) : null;
    const canAuthor = access.membership.role === 'incident_manager' || access.membership.role === 'admin';

    return json({
      postmortem: safePostmortem(postmortem),
      incidentStatus: incident.status,
      model: run && run.organization_id === access.organizationId ? run.model ?? null : null,
      promptVersion: run && run.organization_id === access.organizationId ? run.prompt_version ?? null : null,
      generatedAt: run && run.organization_id === access.organizationId ? run.completed_at ?? run.started_at ?? null : null,
      canEdit: canAuthor && String(postmortem.status) === 'draft',
      canApprove: canAuthor && String(postmortem.status) === 'in_review',
      approverName: approver ? (approver.full_name ?? approver.email ?? null) : null,
    });
  } catch (error) {
    return failure(error);
  }
});
