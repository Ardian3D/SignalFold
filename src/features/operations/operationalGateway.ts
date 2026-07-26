import { getBase44RuntimeConfig } from '@/integrations/base44/config';
import { Base44OperationalGateway } from './adapters/Base44OperationalGateway';
import { MockOperationalGateway } from './adapters/MockOperationalGateway';
import type { OperationalGateway } from './ports/OperationalGateway';
let gateway: OperationalGateway | null = null;
export function getOperationalGateway(): OperationalGateway { if (gateway) return gateway; gateway = getBase44RuntimeConfig().dataMode === 'base44' ? new Base44OperationalGateway() : new MockOperationalGateway(); return gateway; }
export function setOperationalGatewayForTests(value: OperationalGateway | null) { gateway = value; }
