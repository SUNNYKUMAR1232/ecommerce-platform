import { env } from '@/config/env.js';

import type { ServiceInstance, ServiceName } from '@/types/intex.js';

interface ConsulHealthServiceEntry {
  Node?: {
    Address?: string;
  };
  Service?: {
    Address?: string;
    Port?: number;
  };
}

export class ConsulService {
  async getHealthyInstances(service: ServiceName): Promise<ServiceInstance[]> {
    if (!env.consulUrl) {
      return [];
    }

    const response = await fetch(`${env.consulUrl}/v1/health/service/${service}?passing=true`);

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as unknown as ConsulHealthServiceEntry[];
    return data.flatMap((entry): ServiceInstance[] => {
      const address = entry.Service?.Address ?? entry.Node?.Address;
      const port = entry.Service?.Port;

      if (!address || port === undefined) {
        return [];
      }

      return [
        {
          address,
          port,
        },
      ];
    });
  }
}
