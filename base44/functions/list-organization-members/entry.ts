import { createClientFromRequest } from "npm:@base44/sdk";

const json = (body: Record<string, unknown>, status = 200) => Response.json(body, { status });
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return json({ error: 'UNAUTHENTICATED' }, 401);
    const memberships = await base44.asServiceRole.entities.Membership.filter({ user_id: user.id, status: 'active' });
    if (memberships.length === 0) return json({ error: 'ORGANIZATION_REQUIRED' }, 403);
    const organizationId = user.default_organization_id ?? memberships[0].organization_id;
    const authorized = memberships.find((membership) => membership.organization_id === organizationId);
    if (!authorized) return json({ error: 'NOT_A_MEMBER' }, 403);
    const members = await base44.asServiceRole.entities.Membership.filter({ organization_id: organizationId });
    const safeMembers = await Promise.all(members.map(async (membership) => {
      const member = await base44.asServiceRole.entities.User.get(membership.user_id);
      return { membershipId: membership.id, userId: membership.user_id, displayName: member?.full_name ?? null, email: member?.email ?? null, displayTitle: membership.display_title ?? null, role: membership.role, status: membership.status, joinedAt: membership.joined_at ?? null };
    }));
    return json({ members: safeMembers });
  } catch (_error) {
    return json({ error: 'SERVICE_UNAVAILABLE' }, 503);
  }
});
