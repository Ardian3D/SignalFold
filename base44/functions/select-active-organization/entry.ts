import { createClientFromRequest } from "npm:@base44/sdk";

const json = (body: Record<string, unknown>, status = 200) => Response.json(body, { status });
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return json({ error: 'UNAUTHENTICATED' }, 401);
    const input = await req.json();
    const organizationId = typeof input.organizationId === 'string' ? input.organizationId.trim() : '';
    if (!organizationId) return json({ error: 'VALIDATION_FAILED' }, 400);
    const memberships = await base44.asServiceRole.entities.Membership.filter({ user_id: user.id, organization_id: organizationId, status: 'active' });
    if (memberships.length === 0) return json({ error: 'NOT_A_MEMBER' }, 403);
    const organization = await base44.asServiceRole.entities.Organization.get(organizationId);
    await base44.asServiceRole.entities.User.update(user.id, { default_organization_id: organizationId });
    return json({ state: 'ACTIVE', organization, membership: memberships[0] });
  } catch (_error) {
    return json({ error: 'SERVICE_UNAVAILABLE' }, 503);
  }
});
