import { getBase44RuntimeConfig } from '@/integrations/base44/config';

import { Base44AuthGateway } from './adapters/Base44AuthGateway';
import { MockAuthGateway } from './adapters/MockAuthGateway';
import type { AuthGateway } from './ports/AuthGateway';
import type { Base44RuntimeConfig } from '@/integrations/base44/config';

export function getAuthGateway(config: Base44RuntimeConfig = getBase44RuntimeConfig()): AuthGateway {
  if (config.dataMode === 'mock') return new MockAuthGateway();
  return new Base44AuthGateway(config);
}
