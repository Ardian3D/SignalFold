import type { OperationalGateway } from '../ports/OperationalGateway';

const emptySummary = { total: 0, todo: 0, inProgress: 0, blocked: 0, done: 0, cancelled: 0, criticalOpen: 0, overdue: 0, unassigned: 0 };

export class MockOperationalGateway implements OperationalGateway {
  async listServices() {
    return [];
  }

  async createService(..._args: Parameters<OperationalGateway['createService']>): ReturnType<OperationalGateway['createService']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async updateService(..._args: Parameters<OperationalGateway['updateService']>): ReturnType<OperationalGateway['updateService']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async listIncidents() {
    return { incidents: [], nextCursor: null };
  }

  async getIncident(..._args: Parameters<OperationalGateway['getIncident']>): ReturnType<OperationalGateway['getIncident']> {
    throw new Error('INCIDENT_NOT_FOUND');
  }

  async createIncident(..._args: Parameters<OperationalGateway['createIncident']>): ReturnType<OperationalGateway['createIncident']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async getDashboardOverview(..._args: Parameters<OperationalGateway['getDashboardOverview']>): ReturnType<OperationalGateway['getDashboardOverview']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async listIncidentTasks() {
    return { tasks: [], nextCursor: null, summary: emptySummary };
  }

  async createIncidentTask(..._args: Parameters<OperationalGateway['createIncidentTask']>): ReturnType<OperationalGateway['createIncidentTask']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async claimTask(..._args: Parameters<OperationalGateway['claimTask']>): ReturnType<OperationalGateway['claimTask']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async unclaimTask(..._args: Parameters<OperationalGateway['unclaimTask']>): ReturnType<OperationalGateway['unclaimTask']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async assignIncidentTask(..._args: Parameters<OperationalGateway['assignIncidentTask']>): ReturnType<OperationalGateway['assignIncidentTask']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async updateIncidentTask(..._args: Parameters<OperationalGateway['updateIncidentTask']>): ReturnType<OperationalGateway['updateIncidentTask']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async addIncidentNote(..._args: Parameters<OperationalGateway['addIncidentNote']>): ReturnType<OperationalGateway['addIncidentNote']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async listIncidentTimeline() {
    return { items: [], nextCursor: null, direction: 'desc' as const };
  }

  async listTeamTaskLoad() {
    return [];
  }

  async seedDemoData(..._args: Parameters<OperationalGateway['seedDemoData']>): ReturnType<OperationalGateway['seedDemoData']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async resetDemoData(..._args: Parameters<OperationalGateway['resetDemoData']>): ReturnType<OperationalGateway['resetDemoData']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }
}
