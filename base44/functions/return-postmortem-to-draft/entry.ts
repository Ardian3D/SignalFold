import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, clean, failure, json, requestId } from './coordination.ts';
import { canMutateIncidentAuthority, loadIncidentForOrg } from './incident-authority.ts';
import { loadPostmortemForOrg, safePostmortem } from './postmortem-workflow.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorizeActiveMembership(base44, input.organizationId);
    if (!canMutateIncidentAuthority(access.membership.role)) throw { code: 'FORBIDDEN', status: 403 };

    const incidentId = clean(input.incidentId, 128);
    if (!incidentId) throw { code: 'VALIDATION_FAILED', status: 400 };
    await loadIncidentForOrg(base44, access.organizationId, incidentId);

    const existing = await loadPostmortemForOrg(base44, access.organizationId, incidentId);
    if (!existing) throw { code: 'POSTMORTEM_NOT_FOUND', status: 404 };
    if (String(existing.status) !== 'in_review') throw { code: 'POSTMORTEM_INVALID_STATE_TRANSITION', status: 409 };

    const rid = requestId(input.requestId) ?? null;
    const patch: Record<string, unknown> = { status: 'draft' };
    if (rid) patch.request_id = rid;

    const result = await base44.asServiceRole.entities.Postmortem.updateMany(
      { id: existing.id, organization_id: access.organizationId, status: 'in_review' },
      { $set: patch },
    );
    if ((result?.updated ?? 0) === 0) {
      const current = await loadPostmortemForOrg(base44, access.organizationId, incidentId);
      if (current && String(current.status) === 'draft') return json({ postmortem: safePostmortem(current), reconciled: true });
      throw { code: 'POSTMORTEM_INVALID_STATE_TRANSITION', status: 409 };
    }

    const updated = await loadPostmortemForOrg(base44, access.organizationId, incidentId);
    return json({ postmortem: safePostmortem(updated) });
  } catch (error) {
    return failure(error);
  }
});
