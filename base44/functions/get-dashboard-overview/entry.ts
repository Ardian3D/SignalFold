import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorizeActiveMembership, failure, json } from './coordination.ts';
import { loadDashboardReadModel } from './read-model.ts';
import { safeIncident } from './operations.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorizeActiveMembership(base44, input.organizationId);
    const { incidents, services, activity, teamLoad, taskSummary } = await loadDashboardReadModel(base44, access.organizationId);

    const active = incidents.filter((incident: any) => !['resolved', 'closed'].includes(incident.status));
    const resolved = incidents.filter((incident: any) => incident.status === 'resolved' || incident.status === 'closed');
    const average = (items: any[], endField: string) => {
      const values = items
        .filter((item) => item[endField] && item.reported_at)
        .map((item) => (Date.parse(item[endField]) - Date.parse(item.reported_at)) / 60000);
      return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
    };

    const serviceSummary = { operational: 0, degraded: 0, outage: 0, maintenance: 0 };
    services.forEach((service: any) => {
      if (service.operational_status in serviceSummary) (serviceSummary as any)[service.operational_status]++;
    });

    return json({
      activeIncidentsCount: active.length,
      sev1Sev2Active: active.filter((incident: any) => ['SEV1', 'SEV2'].includes(incident.severity)).length,
      openTasks: taskSummary.todo + taskSummary.inProgress + taskSummary.blocked,
      taskDataAvailable: true,
      taskSummary,
      resolvedThisWeek: resolved.filter((incident: any) => Date.now() - Date.parse(incident.resolved_at || incident.closed_at) < 604800000).length,
      averageTimeToAcknowledge: average(incidents, 'acknowledged_at'),
      averageTimeToResolve: average(resolved, 'resolved_at'),
      activeIncidents: active.slice(0, 10).map(safeIncident),
      needsAttention: active
        .filter((incident: any) => ['SEV1', 'SEV2'].includes(incident.severity) || !incident.acknowledged_at)
        .slice(0, 10)
        .map(safeIncident),
      recentActivity: activity,
      recentIncidents: incidents.slice(0, 10).map(safeIncident),
      serviceSummary,
      teamLoad,
      quickCreateCapability: true,
      demoWorkspaceState: { isDemo: false, canSeed: access.membership.role === 'admin' },
    });
  } catch (error) {
    return failure(error);
  }
});
