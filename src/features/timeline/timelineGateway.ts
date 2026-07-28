import { getOperationalGateway } from '@/features/operations/operationalGateway';
import type { TimelineGateway } from './ports/TimelineGateway';

let gateway: TimelineGateway | null = null;

export function getTimelineGateway(): TimelineGateway {
  if (!gateway) {
    gateway = getOperationalGateway() as unknown as TimelineGateway;
  }
  return gateway;
}

export function setTimelineGatewayForTests(value: TimelineGateway | null) {
  gateway = value;
}
