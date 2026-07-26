import { describe, expect, it } from 'vitest';
import { projectDashboardActivity } from '@/features/dashboard/domain/activityProjection';
const creation = (id:string, incidentId='incident-1', overrides:Record<string,unknown>={}) => ({ id, organization_id:'org-1', incident_id:incidentId, event_type:'incident_created', actor_type:'user', visibility:'internal', message:'Incident was reported.', occurred_at:'2026-07-26T10:00:00.000Z', is_demo:false, ...overrides });
describe('Dashboard canonical activity identity', () => {
  it('collapses three hosted legacy creation records into one logical event', () => {
    const result=projectDashboardActivity([creation('u3'),creation('u2','incident-1',{eventType:' Incident-Created ',incidentId:'incident-1',organizationId:'org-1',occurredAt:'2026-07-26T10:00:00.002Z'}),creation('u1','incident-1',{occurred_at:'2026-07-26T09:59:59.999Z'})]);
    expect(result).toHaveLength(1); expect(result[0].id).toBe('u1');
  });
  it('keeps one real update when a synthesized fallback has the same canonical identity', () => {
    expect(projectDashboardActivity([creation('real'),creation('fallback','incident-1',{eventType:'incident_created',organizationId:'org-1',incidentId:'incident-1'})])).toHaveLength(1);
  });
  it('preserves distinct event types for the same incident', () => {
    const result=projectDashboardActivity([creation('created'),creation('resolved','incident-1',{event_type:'incident_resolved'})]); expect(result.map(x=>x.eventType)).toEqual(['incident_created','incident_resolved']);
  });
  it('preserves creation events for different incidents', () => {
    expect(projectDashboardActivity([creation('one','incident-1'),creation('two','incident-2')])).toHaveLength(2);
  });
  it('normalizes snake-case and camel-case payload aliases before limiting', () => {
    const result=projectDashboardActivity([creation('snake'),creation('camel','incident-1',{organization_id:undefined,incident_id:undefined,event_type:undefined,occurred_at:undefined,organizationId:'org-1',incidentId:'incident-1',eventType:'INCIDENT CREATED',occurredAt:'2026-07-26T10:00:01.000Z'})],1); expect(result).toHaveLength(1); expect(result[0].eventType).toBe('incident_created');
  });
});
