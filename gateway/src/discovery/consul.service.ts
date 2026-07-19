import { env } from '@/config/env.js';

import { ServiceInstance, ServiceName } from '@/types/intex.js';

export class ConsulService {
  async getHealthyInstances(service: ServiceName): Promise<ServiceInstance[]> {
    if (!env.consulUrl) {
      return [];
    }

    const response = await fetch(`${env.consulUrl}/v1/health/service/${service}?passing=true`);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    return data
      .map((entry: any) => {
        const address = entry.Service?.Address ?? entry.Node?.Address;

        const port = entry.Service?.Port;

        if (!address || !port) {
          return null;
        }

        return {
          address,
          port,
        };
      })
      .filter(Boolean);
  }
}
