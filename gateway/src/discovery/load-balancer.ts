import { ServiceInstance, ServiceName } from '@/types/intex.js';

export class RoundRobinBalancer {
  private readonly cursor = new Map<ServiceName, number>();

  next(service: ServiceName, instances: ServiceInstance[]): ServiceInstance {
    const current = this.cursor.get(service) ?? 0;

    const selected = instances[current % instances.length];

    this.cursor.set(service, current + 1);

    return selected;
  }
}
