import { env } from '@/config/env.js';
import { tcpService } from '@/health/tcp.service.js';

class ReadinessService {
  private async http(url: string): Promise<boolean> {
    try {
      const response = await fetch(url);

      return response.ok;
    } catch {
      return false;
    }
  }

  async check() {
    const checks = await Promise.all([
      this.http(`${env.consulUrl}/v1/status/leader`),

      tcpService.check(env.redisHost, env.redisPort),

      tcpService.check(env.rabbitMqHost, env.rabbitMqPort),

      this.http(env.jaegerUrl),
    ]);

    return {
      consul: checks[0],
      redis: checks[1],
      rabbitmq: checks[2],
      jaeger: checks[3],
    };
  }
}

export const readinessService = new ReadinessService();
