import { ServiceName } from '@/types/intex.js';

import { registry } from '@/discovery/registry.service.js';

class ServiceResolver {
  async resolve(service: ServiceName): Promise<string> {
    return registry.resolve(service);
  }
}

export const serviceResolver = new ServiceResolver();
