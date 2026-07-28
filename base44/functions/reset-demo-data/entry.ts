import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorize, failure, json, requestId } from './operations.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorize(base44, input.organizationId, true);
    if (input.confirmation !== 'RESET DEMO DATA' || !requestId(input.requestId)) throw { code: 'DEMO_CONFIRMATION_REQUIRED', status: 400 };
    const organization = await base44.asServiceRole.entities.Organization.get(access.organizationId);
    if (!organization?.is_demo) throw { code: 'DEMO_RESET_FORBIDDEN', status: 403 };
    let deleted = 0;
    for (const entity of ['IncidentUpdate', 'IncidentTask', 'Incident', 'Service']) {
      const rows = await (base44.asServiceRole.entities as any)[entity].filter({ organization_id: access.organizationId, is_demo: true });
      for (const row of rows) {
        await (base44.asServiceRole.entities as any)[entity].delete(row.id);
        deleted += 1;
      }
    }
    return json({ deleted });
  } catch (error) {
    return failure(error);
  }
});
