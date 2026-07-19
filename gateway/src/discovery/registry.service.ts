import { ServiceName } from '@/types/intex.js';

import { ConsulService } from '@/discovery/consul.service.js';

import { RoundRobinBalancer } from '@/discovery/load-balancer.js';

import { getStaticServiceUrl } from '@/config/service-defaults.js';

class RegistryService {
  private consul = new ConsulService();

  private balancer = new RoundRobinBalancer();

  async resolve(service: ServiceName): Promise<string> {
    const instances = await this.consul.getHealthyInstances(service);

    if (instances.length === 0) {
      return getStaticServiceUrl(service);
    }

    const selected = this.balancer.next(service, instances);

    return `http://${selected.address}:${selected.port}`;
  }
}

export const registry = new RegistryService();
