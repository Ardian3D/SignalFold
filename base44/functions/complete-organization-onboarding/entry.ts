import { createClientFromRequest } from "npm:@base44/sdk";

const json = (body: Record<string, unknown>, status = 200) => Response.json(body, { status });
const slugify = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 96);
const validTimezone = (value: string) => value === 'UTC' || /^[A-Za-z_]+\/[A-Za-z_]+(?:\/[A-Za-z_]+)?$/.test(value);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return json({ error: 'UNAUTHENTICATED' }, 401);
    const input = await req.json();
    const requestId = typeof input.requestId === 'string' ? input.requestId.trim() : '';
    const displayName = typeof input.displayName === 'string' ? input.displayName.trim() : '';
    const organizationName = typeof input.organizationName === 'string' ? input.organizationName.trim() : '';
    const timezone = typeof input.defaultTimezone === 'string' ? input.defaultTimezone.trim() : 'UTC';
    const prefix = typeof input.incidentPrefix === 'string' && input.incidentPrefix.trim() ? input.incidentPrefix.trim().toUpperCase() : 'SF';
    if (!requestId || (displayName && (displayName.length < 2 || displayName.length > 80)) || organizationName.length < 2 || organizationName.length > 100 || !validTimezone(timezone) || !/^[A-Z0-9]{2,8}$/.test(prefix)) {
      return json({ error: 'VALIDATION_FAILED' }, 400);
    }

    const memberships = await base44.asServiceRole.entities.Membership.filter({ user_id: user.id });
    const existingActive = memberships.find((membership) => membership.status === 'active');
    if (existingActive) {
      const organization = await base44.asServiceRole.entities.Organization.get(existingActive.organization_id);
      return json({ organization, membership: existingActive, requestId, reconciled: true });
    }

    const baseSlug = slugify(organizationName) || 'workspace';
    const existingSlugs = await base44.asServiceRole.entities.Organization.filter({ slug: baseSlug });
    const slug = existingSlugs.length === 0 ? baseSlug : `${baseSlug}-${existingSlugs.length + 1}`;
    const organization = await base44.asServiceRole.entities.Organization.create({
      name: organizationName,
      slug,
      default_timezone: timezone,
      incident_prefix: prefix,
      public_status_enabled: false,
      created_by_user_id: user.id,
      is_demo: false,
      settings: { use_case: typeof input.useCase === 'string' ? input.useCase.trim().slice(0, 120) : undefined, display_title: typeof input.displayTitle === 'string' ? input.displayTitle.trim().slice(0, 80) : undefined },
    });
    const membership = await base44.asServiceRole.entities.Membership.create({
      organization_id: organization.id,
      user_id: user.id,
      role: 'admin',
      status: 'active',
      joined_at: new Date().toISOString(),
      display_title: typeof input.displayTitle === 'string' ? input.displayTitle.trim().slice(0, 80) : undefined,
    });
    await base44.asServiceRole.entities.User.update(user.id, {
      ...(displayName ? { full_name: displayName } : {}),
      timezone,
      default_organization_id: organization.id,
      onboarding_completed: true,
    });
    return json({ state: 'ACTIVE', organization, membership, requestId });
  } catch (_error) {
    return json({ error: 'PARTIAL_ONBOARDING_FAILURE' }, 500);
  }
});
