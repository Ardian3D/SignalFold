import type { IncidentUpdate } from '@/features/incidents/domain/incidentTypes';

type RawActivity = Record<string, unknown>;
const text = (raw: RawActivity, camel: string, snake: string) => String(raw[camel] ?? raw[snake] ?? '').trim();
export const canonicalEventType = (value: unknown) => String(value ?? '').trim().toLowerCase().replace(/[\s-]+/g, '_');
export function normalizeActivity(raw: RawActivity): IncidentUpdate | null {
  const id = text(raw, 'id', 'id');
  const organizationId = text(raw, 'organizationId', 'organization_id');
  const incidentId = text(raw, 'incidentId', 'incident_id');
  const eventType = canonicalEventType(raw.eventType ?? raw.event_type);
  const occurredAt = text(raw, 'occurredAt', 'occurred_at');
  if (!id || !organizationId || !incidentId || !eventType || !occurredAt) return null;
  return { id, organizationId, incidentId, eventType, actorUserId: text(raw, 'actorUserId', 'actor_user_id') || undefined, actorType: (text(raw, 'actorType', 'actor_type') || 'system') as IncidentUpdate['actorType'], visibility: (text(raw, 'visibility', 'visibility') || 'internal') as IncidentUpdate['visibility'], message: text(raw, 'message', 'message'), occurredAt, isDemo: raw.isDemo === true || raw.is_demo === true };
}
export function projectDashboardActivity(records: RawActivity[], limit = 20): IncidentUpdate[] {
  const normalized = records.map(normalizeActivity).filter((item): item is IncidentUpdate => item !== null).sort((a,b) => Date.parse(a.occurredAt)-Date.parse(b.occurredAt) || a.id.localeCompare(b.id));
  const byIdentity = new Map<string, IncidentUpdate>();
  for (const item of normalized) {
    const identity = item.eventType === 'incident_created' ? `${item.organizationId}:${item.incidentId}:incident_created` : `id:${item.id}`;
    if (!byIdentity.has(identity)) byIdentity.set(identity, item);
  }
  return [...byIdentity.values()].sort((a,b) => Date.parse(b.occurredAt)-Date.parse(a.occurredAt) || a.id.localeCompare(b.id)).slice(0,limit);
}
