import { createClientFromRequest } from "npm:@base44/sdk";

const json = (body: Record<string, unknown>, status = 200) => Response.json(body, { status });
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return json({ error: 'UNAUTHENTICATED' }, 401);
    const memberships = await base44.asServiceRole.entities.Membership.filter({ user_id: user.id });
    const active = memberships.filter((membership) => membership.status === 'active');
    const invited = memberships.filter((membership) => membership.status === 'invited');
    const suspended = memberships.filter((membership) => membership.status === 'suspended');
    if (active.length === 0) {
      if (suspended.length > 0) return json({ state: 'SUSPENDED_ONLY' });
      if (invited.length > 0) return json({ state: 'INVITED_ONLY' });
      return json({ state: 'NEEDS_ONBOARDING' });
    }
    const preferred = active.find((membership) => membership.organization_id === user.default_organization_id);
    if (!preferred && active.length > 1) {
      const selectable = await Promise.all(active.map(async (item) => ({ organization: await base44.asServiceRole.entities.Organization.get(item.organization_id), membership: item })));
      return json({ state: 'SELECTION_REQUIRED', selectable });
    }
    const membership = preferred ?? active[0];
    const organization = await base44.asServiceRole.entities.Organization.get(membership.organization_id);
    if (!preferred && user.default_organization_id !== organization.id) await base44.asServiceRole.entities.User.update(user.id, { default_organization_id: organization.id });
    return json({ state: 'ACTIVE', organization, membership });
  } catch (_error) {
    return json({ error: 'SERVICE_UNAVAILABLE' }, 503);
  }
});
