export const json = (body: Record<string, unknown>, status = 200) => Response.json(body, { status });
export const clean = (v: unknown, max = 5000) => typeof v === 'string' ? v.trim().slice(0, max) : '';
export const slugify = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'service';
export const requestId = (v: unknown) => { const id = clean(v, 128); return /^[A-Za-z0-9_-]{8,128}$/.test(id) ? id : null; };
export async function authorize(base44: any, organizationId: unknown, admin = false) {
  const user = await base44.auth.me();
  if (!user) throw { code: 'UNAUTHENTICATED', status: 401 };
  const id = clean(organizationId, 128);
  if (!id) throw { code: 'VALIDATION_FAILED', status: 400 };
  const memberships = await base44.asServiceRole.entities.Membership.filter({ organization_id: id, user_id: user.id, status: 'active' });
  const membership = memberships[0];
  if (!membership) throw { code: 'NOT_A_MEMBER', status: 403 };
  if (admin && membership.role !== 'admin') throw { code: 'FORBIDDEN', status: 403 };
  return { user, membership, organizationId: id };
}
export const failure = (error: unknown) => { const e = error as { code?: string; status?: number }; return json({ error: e.code ?? 'UNKNOWN' }, e.status ?? 500); };
export const safeService = (r: any) => ({ id:r.id, organization_id:r.organization_id, name:r.name, slug:r.slug, description:r.description, criticality:r.criticality, operational_status:r.operational_status, owner_user_id:r.owner_user_id, tags:r.tags ?? [], is_active:r.is_active, is_demo:r.is_demo, created_date:r.created_date, updated_date:r.updated_date });
export const safeIncident = (r: any) => ({ id:r.id, organization_id:r.organization_id, code:r.code, title:r.title, description:r.description, source:r.source, service_id:r.service_id, reporter_user_id:r.reporter_user_id, commander_user_id:r.commander_user_id, severity:r.severity, severity_source:r.severity_source, status:r.status, impact_summary:r.impact_summary, observed_start_at:r.observed_start_at, reported_at:r.reported_at, acknowledged_at:r.acknowledged_at, resolved_at:r.resolved_at, closed_at:r.closed_at, recovery_verified:r.recovery_verified, public_visibility:r.public_visibility, is_demo:r.is_demo, reopened_count:r.reopened_count, created_date:r.created_date, updated_date:r.updated_date });
