import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorize, clean, failure, json, requestId, safeIncident } from './operations.ts';

const field = (record: any, camel: string, snake: string) =>
  String(record?.[camel] ?? record?.[snake] ?? '').trim();

const canonicalType = (record: any) =>
  field(record, 'eventType', 'event_type').toLowerCase().replace(/[\s-]+/g, '_');

const findCreation = async (base44: any, organizationId: string, incidentId: string) => {
  const rows = await base44.asServiceRole.entities.IncidentUpdate.filter({
    organization_id: organizationId,
    incident_id: incidentId,
  });
  return rows.find(
    (row: any) =>
      field(row, 'organizationId', 'organization_id') === organizationId &&
      field(row, 'incidentId', 'incident_id') === incidentId &&
      canonicalType(row) === 'incident_created',
  );
};

const appendCreation = async (base44: any, access: any, incident: any) => {
  if (await findCreation(base44, access.organizationId, incident.id)) {
    console.log(
      JSON.stringify({
        function: 'create-incident',
        operation: 'WRITE',
        incidentUpdatesLoaded: 1,
        incidentUpdatesReturned: 1,
        createAttempted: false,
      }),
    );
    return;
  }

  console.log(
    JSON.stringify({
      function: 'create-incident',
      operation: 'WRITE',
      incidentUpdatesLoaded: 0,
      incidentUpdatesReturned: 1,
      createAttempted: true,
    }),
  );

  await base44.asServiceRole.entities.IncidentUpdate.create({
    organization_id: access.organizationId,
    incident_id: incident.id,
    event_type: 'incident_created',
    actor_user_id: access.user.id,
    actor_type: 'user',
    visibility: 'internal',
    message: `Incident ${incident.code} was reported.`,
    metadata: { code: incident.code, status: 'reported', severity: incident.severity },
    occurred_at: incident.reported_at,
    is_demo: false,
  });
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorize(base44, input.organizationId);
    const rid = requestId(input.requestId);
    if (!rid) throw { code: 'VALIDATION_FAILED', status: 400 };

    const prior = await base44.asServiceRole.entities.Incident.filter({
      organization_id: access.organizationId,
      request_id: rid,
    });
    if (prior[0]) {
      console.log(
        JSON.stringify({
          function: 'create-incident',
          operation: 'WRITE',
          incidentUpdatesLoaded: 0,
          incidentUpdatesReturned: 0,
          createAttempted: false,
        }),
      );
      return json({ incident: safeIncident(prior[0]), reconciled: true });
    }

    const title = clean(input.title, 120);
    const description = clean(input.description, 5000);
    if (title.length < 5 || description.length < 20) throw { code: 'VALIDATION_FAILED', status: 400 };

    if (input.serviceId) {
      const service = await base44.asServiceRole.entities.Service.get(input.serviceId);
      if (!service || service.organization_id !== access.organizationId || !service.is_active) {
        throw { code: 'SERVICE_NOT_FOUND', status: 404 };
      }
    }

    const organization = await base44.asServiceRole.entities.Organization.get(access.organizationId);
    const now = new Date().toISOString();
    const year = new Date(now).getUTCFullYear();
    const all = await base44.asServiceRole.entities.Incident.filter({ organization_id: access.organizationId });
    const code = `${organization.incident_prefix || 'SF'}-${year}-${String(all.length + 1).padStart(4, '0')}`;

    const incident = await base44.asServiceRole.entities.Incident.create({
      organization_id: access.organizationId,
      code,
      title,
      description,
      source: 'manual',
      service_id: input.serviceId || undefined,
      reporter_user_id: access.user.id,
      severity: 'SEV3',
      severity_source: 'rule_baseline',
      status: 'reported',
      impact_summary: clean(input.impactHint, 1000) || undefined,
      observed_start_at: input.observedStartAt || undefined,
      reported_at: now,
      recovery_verified: false,
      public_visibility: 'private',
      is_demo: false,
      reopened_count: 0,
      request_id: rid,
    });

    await appendCreation(base44, access, incident);
    return json({ incident: safeIncident(incident) }, 201);
  } catch (error) {
    return failure(error);
  }
});
