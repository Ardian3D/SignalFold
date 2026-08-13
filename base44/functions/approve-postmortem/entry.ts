import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, clean, failure, json, requestId } from './coordination.ts';
import { canMutateIncidentAuthority, loadIncidentForOrg } from './incident-authority.ts';
import { appendPostmortemEvent, loadPostmortemForOrg, safePostmortem } from './postmortem-workflow.ts';

const isContentReady = (postmortem: any) =>
  Boolean(postmortem.executiveSummary?.trim()) &&
  Boolean(postmortem.impact?.trim()) &&
  Boolean(postmortem.resolution?.trim()) &&
  Boolean(postmortem.rootCause?.trim()) &&
  Array.isArray(postmortem.timelineSummary) && postmortem.timelineSummary.length > 0;

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
    if (String(existing.status) !== 'in_review') throw { code: 'POSTMORTEM_INVALID_STATE_TRANSITION', status: 409 };
    if (!isContentReady(existing)) throw { code: 'POSTMORTEM_CONTENT_INCOMPLETE', status: 400 };

    const rid = requestId(input.requestId) ?? `pm_approve_${crypto.randomUUID().replaceAll('-', '_')}`;
    const now = new Date().toISOString();

    // Concurrency-safe: exactly one approval wins.
    const result = await base44.asServiceRole.entities.Postmortem.updateMany(
      { id: existing.id, organization_id: access.organizationId, status: 'in_review' },
      { $set: { status: 'approved', approved_by_user_id: access.user.id, approved_at: now, request_id: rid } },
    );
    if ((result?.updated ?? 0) === 0) {
      const current = await loadPostmortemForOrg(base44, access.organizationId, incidentId);
      if (current && String(current.status) === 'approved') {
        const event = await appendPostmortemEvent(base44, {
          organizationId: access.organizationId,
          incidentId,
          eventType: 'postmortem_approved',
          message: `Postmortem approved for Incident ${incident.code}.`,
          actorUserId: current.approvedByUserId,
          actorType: 'user',
          metadata: { request_id: rid },
          isDemo: incident.is_demo === true,
          requestId: rid,
        });
        return json({ postmortem: safePostmortem(current), reconciled: true, timelineEvent: event });
      }
      throw { code: 'POSTMORTEM_STATE_CONFLICT', status: 409 };
    }

    const updated = await loadPostmortemForOrg(base44, access.organizationId, incidentId);
    const event = await appendPostmortemEvent(base44, {
      organizationId: access.organizationId,
      incidentId,
      eventType: 'postmortem_approved',
      message: `Postmortem approved for Incident ${incident.code}.`,
      actorUserId: access.user.id,
      actorType: 'user',
      metadata: { request_id: rid },
      isDemo: incident.is_demo === true,
      requestId: rid,
    });

    return json({ postmortem: safePostmortem(updated), timelineEvent: event });
  } catch (error) {
    return failure(error);
  }
});
