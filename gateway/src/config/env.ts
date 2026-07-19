interface Env {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  consulUrl?: string;
  rateLimit: {
    windowMs: number;
    max: number;
  };
  redisHost: string;
  redisPort: number;
  rabbitMqHost: string;
  rabbitMqPort: number;
  jaegerUrl: string;
}

export const env: Env = {
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  jwtSecret: process.env.JWT_ACCESS_SECRET ?? 'dev-secret',
  consulUrl: process.env.SERVICE_DISCOVERY_URL,
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000),
    max: Number(process.env.RATE_LIMIT_MAX ?? 300),
  },
  redisHost: process.env.REDIS_HOST ?? 'redis',
  redisPort: Number(process.env.REDIS_PORT ?? 6379),
  rabbitMqHost: process.env.RABBITMQ_HOST ?? 'rabbitmq',
  rabbitMqPort: Number(process.env.RABBITMQ_PORT ?? 5672),
  jaegerUrl: process.env.JAEGER_URL ?? 'http://jaeger:16686',
};
