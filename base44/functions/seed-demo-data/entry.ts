import { createClientFromRequest } from 'npm:@base44/sdk';
import { authorize, failure, json, requestId, slugify } from './operations.ts';
import { appendTaskEvent } from './task-workflow.ts';

const services = [['Checkout Web', 'high'], ['Payments API', 'critical'], ['Order Processor', 'high'], ['Customer Portal', 'medium']];
const incidents = [
  ['Checkout payments failing after latest deployment', 'Customers cannot complete card payments after the latest deployment. Support has received 37 reports in the last 12 minutes.', 'SEV1', 'reported'],
  ['Order processing delays exceed normal thresholds', 'Order processing latency is elevated and requires active operational investigation.', 'SEV2', 'investigating'],
  ['Customer portal login latency recovered', 'Customer portal latency returned to normal after a safe configuration rollback.', 'SEV3', 'resolved'],
  ['Intermittent webhook delivery delay', 'A historical low-priority webhook delivery delay was monitored and closed.', 'SEV4', 'closed'],
] as const;

const demoTasks = [
  ['Compare latest deployment changes.', 'critical', 'todo', null],
  ['Confirm payment gateway health.', 'high', 'in_progress', 'creator'],
  ['Run checkout transaction test.', 'medium', 'blocked', null],
  ['Prepare rollback.', 'high', 'done', 'creator'],
  ['Draft customer-facing status update.', 'medium', 'todo', null],
] as const;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const access = await authorize(base44, input.sourceOrganizationId, true);
    const rid = requestId(input.requestId);
    if (input.confirmation !== 'CREATE DEMO WORKSPACE' || !rid) throw { code: 'DEMO_CONFIRMATION_REQUIRED', status: 400 };

    const memberships = await base44.asServiceRole.entities.Membership.filter({ user_id: access.user.id, status: 'active' });
    let demoOrg: any = null;
    for (const membership of memberships) {
      const organization = await base44.asServiceRole.entities.Organization.get(membership.organization_id);
      if (organization?.is_demo && organization?.created_by_user_id === access.user.id) {
        demoOrg = organization;
        break;
      }
    }

    if (!demoOrg) {
      const collisions = await base44.asServiceRole.entities.Organization.filter({ slug: 'northstar-commerce-demo' });
      demoOrg = await base44.asServiceRole.entities.Organization.create({
        name: 'Northstar Commerce',
        slug: collisions.length ? `northstar-commerce-demo-${collisions.length + 1}` : 'northstar-commerce-demo',
        default_timezone: 'UTC',
        incident_prefix: 'SF',
        public_status_enabled: false,
        created_by_user_id: access.user.id,
        is_demo: true,
        settings: { use_case: 'demo' },
      });
      await base44.asServiceRole.entities.Membership.create({
        organization_id: demoOrg.id,
        user_id: access.user.id,
        role: 'admin',
        status: 'active',
        joined_at: new Date().toISOString(),
        display_title: 'Demo workspace owner',
      });
    }

    let existingServices = await base44.asServiceRole.entities.Service.filter({ organization_id: demoOrg.id, is_demo: true });
    for (const [name, criticality] of services) {
      if (!existingServices.some((service: any) => service.name === name)) {
        await base44.asServiceRole.entities.Service.create({
          organization_id: demoOrg.id,
          name,
          slug: slugify(name),
          criticality,
          operational_status: 'operational',
          tags: [],
          is_active: true,
          is_demo: true,
          request_id: `demo-service-${slugify(name)}`,
        });
      }
    }

    existingServices = await base44.asServiceRole.entities.Service.filter({ organization_id: demoOrg.id, is_demo: true });
    const payment = existingServices.find((service: any) => service.name === 'Payments API');
    const existingIncidents = await base44.asServiceRole.entities.Incident.filter({ organization_id: demoOrg.id, is_demo: true });
    const mainIncidentTitle = incidents[0][0];
    const mainIncident = existingIncidents.find((incident: any) => incident.title === mainIncidentTitle) ?? existingIncidents.find((incident: any) => incident.service_id === payment?.id);
    let created = 0;

    for (let index = 0; index < incidents.length; index += 1) {
      const [title, description, severity, status] = incidents[index];
      if (existingIncidents.some((incident: any) => incident.title === title)) continue;
      const now = new Date(Date.now() - index * 86_400_000).toISOString();
      const incident = await base44.asServiceRole.entities.Incident.create({
        organization_id: demoOrg.id,
        code: `SF-${new Date().getUTCFullYear()}-${String(42 + index).padStart(4, '0')}`,
        title,
        description,
        source: 'demo',
        service_id: index === 0 ? payment?.id : undefined,
        reporter_user_id: access.user.id,
        severity,
        severity_source: 'rule_baseline',
        status,
        reported_at: now,
        resolved_at: status === 'resolved' ? now : undefined,
        closed_at: status === 'closed' ? now : undefined,
        recovery_verified: status === 'resolved' || status === 'closed',
        public_visibility: 'private',
        is_demo: true,
        reopened_count: 0,
        request_id: `demo-incident-${index}`,
      });
      await base44.asServiceRole.entities.IncidentUpdate.create({
        organization_id: demoOrg.id,
        incident_id: incident.id,
        event_type: status === 'resolved' ? 'incident_resolved' : status === 'closed' ? 'incident_closed' : 'incident_seeded',
        actor_type: 'system',
        visibility: 'internal',
        message: `Demo incident ${incident.code} seeded.`,
        metadata: { code: incident.code, status, severity },
        occurred_at: now,
        is_demo: true,
      });
      created += 1;
    }

    if (mainIncident) {
      const assignedTarget = access.user.id;
      const taskRecords = await base44.asServiceRole.entities.IncidentTask.filter({ organization_id: demoOrg.id, incident_id: mainIncident.id, is_demo: true });
      for (let index = 0; index < demoTasks.length; index += 1) {
        const [title, priority, status, assignment] = demoTasks[index];
        if (taskRecords.some((task: any) => task.title === title)) continue;
        const task = await base44.asServiceRole.entities.IncidentTask.create({
          organization_id: demoOrg.id,
          incident_id: mainIncident.id,
          title,
          description: `${title} for ${mainIncident.code}`,
          priority,
          status,
          source: 'system',
          order_index: index + 1,
          assignee_user_id: assignment === 'creator' ? assignedTarget : '',
          created_by_user_id: assignment === 'creator' ? assignedTarget : undefined,
          due_at: status === 'blocked' ? new Date(Date.now() + 2 * 86_400_000).toISOString() : undefined,
          claimed_at: status === 'in_progress' ? new Date().toISOString() : undefined,
          completed_at: status === 'done' ? new Date().toISOString() : undefined,
          blocking_reason: status === 'blocked' ? 'Waiting on payment gateway confirmation.' : undefined,
          completion_note: status === 'done' ? 'Demo task completed.' : undefined,
          ai_run_id: undefined,
          is_demo: true,
          request_id: `demo-task-${index}`,
        });
        await appendTaskEvent(base44, {
          organizationId: demoOrg.id,
          incidentId: mainIncident.id,
          taskId: task.id,
          eventType: 'task_created',
          message: `Task ${task.title} was created.`,
          actorUserId: access.user.id,
          metadata: { task_id: task.id, task_title: task.title, priority, request_id: `demo-task-${index}` },
          isDemo: true,
          requestId: `demo-task-${index}`,
        });
        if (assignment === 'creator') {
          await appendTaskEvent(base44, {
            organizationId: demoOrg.id,
            incidentId: mainIncident.id,
            taskId: task.id,
            eventType: 'task_assigned',
            message: `Task ${task.title} was assigned.`,
            actorUserId: access.user.id,
            metadata: { task_id: task.id, task_title: task.title, assignee_user_id: assignedTarget, request_id: `demo-task-${index}` },
            isDemo: true,
            requestId: `demo-task-${index}-assigned`,
          });
        } else if (status === 'blocked') {
          await appendTaskEvent(base44, {
            organizationId: demoOrg.id,
            incidentId: mainIncident.id,
            taskId: task.id,
            eventType: 'task_blocked',
            message: `Task ${task.title} is blocked.`,
            actorUserId: access.user.id,
            metadata: { task_id: task.id, task_title: task.title, blocking_reason: task.blocking_reason, request_id: `demo-task-${index}` },
            isDemo: true,
            requestId: `demo-task-${index}-blocked`,
          });
        }
      }
    }

    await base44.asServiceRole.entities.User.update(access.user.id, { default_organization_id: demoOrg.id });
    return json({ organizationId: demoOrg.id, created, reconciled: created === 0 });
  } catch (error) {
    return failure(error);
  }
});
