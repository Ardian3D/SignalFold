import { getOperationalGateway } from '@/features/operations/operationalGateway';
import type { TaskGateway } from './ports/TaskGateway';

let gateway: TaskGateway | null = null;

export function getTaskGateway(): TaskGateway {
  if (!gateway) {
    gateway = getOperationalGateway() as unknown as TaskGateway;
  }
  return gateway;
}

export function setTaskGatewayForTests(value: TaskGateway | null) {
  gateway = value;
}
