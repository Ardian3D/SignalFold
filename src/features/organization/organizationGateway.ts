import { getBase44RuntimeConfig } from '@/integrations/base44/config';
import { Base44OrganizationGateway } from './adapters/Base44OrganizationGateway';
import { MockOrganizationGateway } from './adapters/MockOrganizationGateway';
import type { OrganizationGateway } from './ports/OrganizationGateway';
import type { Base44RuntimeConfig } from '@/integrations/base44/config';
export function getOrganizationGateway(config: Base44RuntimeConfig = getBase44RuntimeConfig()): OrganizationGateway { return config.dataMode === 'mock' ? new MockOrganizationGateway() : new Base44OrganizationGateway(config); }

