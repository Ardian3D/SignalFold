import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Base44OperationalGateway } from '@/features/operations/adapters/Base44OperationalGateway';
import { MockOperationalGateway } from '@/features/operations/adapters/MockOperationalGateway';
import type { IncidentRealtimeEvent } from '@/features/operations/domain/realtimeTypes';

vi.mock('@/integrations/base44/config', () => ({ getBase44RuntimeConfig: () => ({ isConfigured: true }) }));

type SubscribeFn = (callback: (event: Record<string, unknown>) => void) => () => void;
const incidentUnsubscribe = vi.fn();
const taskUnsubscribe = vi.fn();
const updateUnsubscribe = vi.fn();
const incidentSubscribe = vi.fn<SubscribeFn>(() => incidentUnsubscribe);
const taskSubscribe = vi.fn<SubscribeFn>(() => taskUnsubscribe);
const updateSubscribe = vi.fn<SubscribeFn>(() => updateUnsubscribe);
const client = { entities: { Incident: { subscribe: incidentSubscribe }, IncidentTask: { subscribe: taskSubscribe }, IncidentUpdate: { subscribe: updateSubscribe } } };

vi.mock('@/integrations/base44/client', () => ({ getBase44Client: () => client }));

const scope = { organizationId: 'org-1', incidentId: 'incident-1' };

describe('Phase 08 Base44 gateway realtime subscriptions', () => {
  beforeEach(() => {
    incidentSubscribe.mockClear();
    taskSubscribe.mockClear();
    updateSubscribe.mockClear();
    incidentUnsubscribe.mockClear();
    taskUnsubscribe.mockClear();
    updateUnsubscribe.mockClear();
  });
  it('subscribes to Incident, IncidentTask, and IncidentUpdate', () => {
    const gateway = new Base44OperationalGateway();
    const unsubscribe = gateway.subscribeToIncidentRoom(scope, vi.fn());
    expect(incidentSubscribe).toHaveBeenCalledTimes(1);
    expect(taskSubscribe).toHaveBeenCalledTimes(1);
    expect(updateSubscribe).toHaveBeenCalledTimes(1);
    unsubscribe();
    expect(incidentUnsubscribe).toHaveBeenCalledTimes(1);
    expect(taskUnsubscribe).toHaveBeenCalledTimes(1);
    expect(updateUnsubscribe).toHaveBeenCalledTimes(1);
  });

  it('returns a safe no-op when the client is unavailable', () => {
    const gateway = new Base44OperationalGateway();
    expect(typeof gateway.subscribeToIncidentRoom(scope, vi.fn())).toBe('function');
  });

  it('accepts a relevant Incident event for the active incident', () => {
    const listener = vi.fn();
    new Base44OperationalGateway().subscribeToIncidentRoom(scope, listener);
    const cb = incidentSubscribe.mock.calls[0][0];
    cb({ type: 'update', data: { id: 'incident-1', organization_id: 'org-1' }, id: 'incident-1', timestamp: '2026-08-12T00:00:00.000Z' });
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ entity: 'incident', recordId: 'incident-1', changeType: 'update' }));
  });

  it('ignores Incident events for a different incident', () => {
    const listener = vi.fn();
    new Base44OperationalGateway().subscribeToIncidentRoom(scope, listener);
    const cb = incidentSubscribe.mock.calls[0][0];
    cb({ type: 'update', data: { id: 'incident-2', organization_id: 'org-1' }, id: 'incident-2', timestamp: '2026-08-12T00:00:00.000Z' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('ignores Incident events for a different organization', () => {
    const listener = vi.fn();
    new Base44OperationalGateway().subscribeToIncidentRoom(scope, listener);
    const cb = incidentSubscribe.mock.calls[0][0];
    cb({ type: 'update', data: { id: 'incident-1', organization_id: 'org-2' }, id: 'incident-1', timestamp: '2026-08-12T00:00:00.000Z' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('accepts a relevant IncidentTask event for the active incident', () => {
    const listener = vi.fn();
    new Base44OperationalGateway().subscribeToIncidentRoom(scope, listener);
    const cb = taskSubscribe.mock.calls[0][0];
    cb({ type: 'create', data: { id: 'task-1', organization_id: 'org-1', incident_id: 'incident-1' }, id: 'task-1', timestamp: '2026-08-12T00:00:00.000Z' });
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ entity: 'task', recordId: 'task-1', changeType: 'create' }));
  });

  it('ignores IncidentTask events for another incident', () => {
    const listener = vi.fn();
    new Base44OperationalGateway().subscribeToIncidentRoom(scope, listener);
    const cb = taskSubscribe.mock.calls[0][0];
    cb({ type: 'update', data: { id: 'task-2', organization_id: 'org-1', incident_id: 'incident-2' }, id: 'task-2', timestamp: '2026-08-12T00:00:00.000Z' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('ignores IncidentTask events for another organization', () => {
    const listener = vi.fn();
    new Base44OperationalGateway().subscribeToIncidentRoom(scope, listener);
    const cb = taskSubscribe.mock.calls[0][0];
    cb({ type: 'update', data: { id: 'task-1', organization_id: 'org-2', incident_id: 'incident-1' }, id: 'task-1', timestamp: '2026-08-12T00:00:00.000Z' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('accepts a relevant IncidentUpdate event for the active incident', () => {
    const listener = vi.fn();
    new Base44OperationalGateway().subscribeToIncidentRoom(scope, listener);
    const cb = updateSubscribe.mock.calls[0][0];
    cb({ type: 'create', data: { id: 'update-1', organization_id: 'org-1', incident_id: 'incident-1' }, id: 'update-1', timestamp: '2026-08-12T00:00:00.000Z' });
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ entity: 'timeline', recordId: 'update-1', changeType: 'create' }));
  });

  it('ignores IncidentUpdate events for another incident', () => {
    const listener = vi.fn();
    new Base44OperationalGateway().subscribeToIncidentRoom(scope, listener);
    const cb = updateSubscribe.mock.calls[0][0];
    cb({ type: 'create', data: { id: 'update-9', organization_id: 'org-1', incident_id: 'incident-9' }, id: 'update-9', timestamp: '2026-08-12T00:00:00.000Z' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('does not pass raw event data to listeners (bounded shape only)', () => {
    const listener = vi.fn();
    new Base44OperationalGateway().subscribeToIncidentRoom(scope, listener);
    const cb = updateSubscribe.mock.calls[0][0];
    cb({ type: 'create', data: { id: 'u1', organization_id: 'org-1', incident_id: 'incident-1', secret_field: 'x' }, id: 'u1', timestamp: '2026-08-12T00:00:00.000Z' });
    const event = listener.mock.calls[0][0] as IncidentRealtimeEvent;
    expect(event).not.toHaveProperty('data');
    expect(event).not.toHaveProperty('secret_field');
    expect(event.recordId).toBe('u1');
  });
});

describe('Phase 08 mock gateway realtime subscription', () => {
  it('returns a safe no-op unsubscribe and does not create Base44 subscriptions', () => {
    incidentSubscribe.mockClear();
    taskSubscribe.mockClear();
    updateSubscribe.mockClear();
    const gateway = new MockOperationalGateway();
    const unsubscribe = gateway.subscribeToIncidentRoom(scope, vi.fn());
    expect(typeof unsubscribe).toBe('function');
    expect(() => unsubscribe()).not.toThrow();
    expect(incidentSubscribe).not.toHaveBeenCalled();
    expect(taskSubscribe).not.toHaveBeenCalled();
    expect(updateSubscribe).not.toHaveBeenCalled();
  });
});
