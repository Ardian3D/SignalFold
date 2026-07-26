const field = (record: any, camel: string, snake: string) =>
  String(record?.[camel] ?? record?.[snake] ?? '').trim();

const eventType = (record: any) =>
  field(record, 'eventType', 'event_type').toLowerCase().replace(/[\s-]+/g, '_');

export const normalizeActivity = (record: any) => ({
  id: field(record, 'id', 'id'),
  organizationId: field(record, 'organizationId', 'organization_id'),
  incidentId: field(record, 'incidentId', 'incident_id'),
  eventType: eventType(record),
  actorType: field(record, 'actorType', 'actor_type') || 'system',
  visibility: field(record, 'visibility', 'visibility') || 'internal',
  message: field(record, 'message', 'message'),
  occurredAt: field(record, 'occurredAt', 'occurred_at'),
  isDemo: record.isDemo === true || record.is_demo === true,
});

export const projectActivity = (records: any[], limit = 20) => {
  const sorted = records
    .map(normalizeActivity)
    .filter((item) => item.id && item.organizationId && item.incidentId && item.eventType && item.occurredAt)
    .sort((a, b) => Date.parse(a.occurredAt) - Date.parse(b.occurredAt) || a.id.localeCompare(b.id));

  const seen = new Map<string, any>();
  for (const item of sorted) {
    const identity =
      item.eventType === 'incident_created'
        ? `${item.organizationId}:${item.incidentId}:incident_created`
        : `id:${item.id}`;
    if (!seen.has(identity)) seen.set(identity, item);
  }

  return [...seen.values()]
    .sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt) || a.id.localeCompare(b.id))
    .slice(0, limit);
};

export async function loadDashboardReadModel(base44: any, organizationId: string) {
  const incidents = await base44.asServiceRole.entities.Incident.filter(
    { organization_id: organizationId },
    '-reported_at',
    200,
    0,
  );
  const services = await base44.asServiceRole.entities.Service.filter({ organization_id: organizationId });
  const rawUpdates = await base44.asServiceRole.entities.IncidentUpdate.filter(
    { organization_id: organizationId },
    '-occurred_at',
    100,
    0,
  );

  return {
    incidents,
    services,
    rawUpdates,
    activity: projectActivity(rawUpdates, 20),
  };
}
