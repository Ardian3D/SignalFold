import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, clean, failure, json, requestId } from './coordination.ts';
import { canMutateIncidentAuthority, loadIncidentForOrg } from './incident-authority.ts';
import { loadPostmortemForOrg, safePostmortem, updatePostmortemSections, validatePostmortemEditable } from './postmortem-workflow.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorizeActiveMembership(base44, input.organizationId);
    if (!canMutateIncidentAuthority(access.membership.role)) throw { code: 'FORBIDDEN', status: 403 };

    const incidentId = clean(input.incidentId, 128);
    if (!incidentId) throw { code: 'VALIDATION_FAILED', status: 400 };
    const incident = await loadIncidentForOrg(base44, access.organizationId, incidentId);

    const existing = await loadPostmortemForOrg(base44, access.organizationId, incidentId);
    if (!existing) throw { code: 'POSTMORTEM_NOT_FOUND', status: 404 };
    if (String(existing.status) !== 'draft') throw { code: 'POSTMORTEM_INVALID_STATE_TRANSITION', status: 409 };

    const sectionsInput = input.sections ?? input;
    const validated = validatePostmortemEditable(sectionsInput);
    if (!validated.ok) throw { code: 'POSTMORTEM_VALIDATION_FAILED', status: 400 };

    const rid = requestId(input.requestId) ?? null;
    const postmortem = await updatePostmortemSections(base44, existing.id, access.organizationId, validated.value, rid ? { request_id: rid } : {});

    return json({ postmortem: safePostmortem(postmortem) });
  } catch (error) {
    return failure(error);
  }
});
