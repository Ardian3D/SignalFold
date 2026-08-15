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

  async changeIncidentState(..._args: Parameters<OperationalGateway['changeIncidentState']>): ReturnType<OperationalGateway['changeIncidentState']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async changeIncidentSeverity(..._args: Parameters<OperationalGateway['changeIncidentSeverity']>): ReturnType<OperationalGateway['changeIncidentSeverity']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async assignIncidentCommander(..._args: Parameters<OperationalGateway['assignIncidentCommander']>): ReturnType<OperationalGateway['assignIncidentCommander']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async resolveIncident(..._args: Parameters<OperationalGateway['resolveIncident']>): ReturnType<OperationalGateway['resolveIncident']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async analyzeIncident(..._args: Parameters<OperationalGateway['analyzeIncident']>): ReturnType<OperationalGateway['analyzeIncident']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async applyIncidentAnalysis(..._args: Parameters<OperationalGateway['applyIncidentAnalysis']>): ReturnType<OperationalGateway['applyIncidentAnalysis']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async getPostmortem(..._args: Parameters<OperationalGateway['getPostmortem']>): ReturnType<OperationalGateway['getPostmortem']> {
    return { postmortem: null };
  }

  async generatePostmortem(..._args: Parameters<OperationalGateway['generatePostmortem']>): ReturnType<OperationalGateway['generatePostmortem']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async savePostmortemDraft(..._args: Parameters<OperationalGateway['savePostmortemDraft']>): ReturnType<OperationalGateway['savePostmortemDraft']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async submitPostmortemForReview(..._args: Parameters<OperationalGateway['submitPostmortemForReview']>): ReturnType<OperationalGateway['submitPostmortemForReview']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async returnPostmortemToDraft(..._args: Parameters<OperationalGateway['returnPostmortemToDraft']>): ReturnType<OperationalGateway['returnPostmortemToDraft']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async approvePostmortem(..._args: Parameters<OperationalGateway['approvePostmortem']>): ReturnType<OperationalGateway['approvePostmortem']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  async createPostmortemDraft(..._args: Parameters<OperationalGateway['createPostmortemDraft']>): ReturnType<OperationalGateway['createPostmortemDraft']> {
    throw new Error('MOCK_OPERATION_NOT_SUPPORTED');
  }

  subscribeToIncidentRoom(..._args: Parameters<OperationalGateway['subscribeToIncidentRoom']>): ReturnType<OperationalGateway['subscribeToIncidentRoom']> {
    return () => undefined;
  }
}
