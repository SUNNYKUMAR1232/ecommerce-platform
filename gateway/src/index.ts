import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { randomUUID } from 'node:crypto';
import net from 'node:net';
import { ServiceName, ServiceInstance, JwtPayload } from './types/intex.js';

import { serviceDefaults, routeDefinitions } from './constants/intex.js';

declare module 'express-serve-static-core' {
  interface Request {
    requestId: string;
    correlationId: string;
    userId?: string;
    roles?: string[];
  }
}

const app = express();
const port = Number(process.env.PORT ?? 3000);
const nodeEnv = process.env.NODE_ENV ?? 'development';
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET ?? 'dev-jwt-secret';
const serviceDiscoveryUrl = process.env.SERVICE_DISCOVERY_URL;
const gatewayRateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
const gatewayRateLimitMax = Number(process.env.RATE_LIMIT_MAX ?? 300);

const roundRobinCursor = new Map<ServiceName, number>();

const getServiceEnvKey = (service: ServiceName): string =>
  `${service.toUpperCase().replace(/-/g, '_')}_URL`;

const pickRoundRobin = (service: ServiceName, instances: ServiceInstance[]): ServiceInstance => {
  const current = roundRobinCursor.get(service) ?? 0;
  const selected = instances[current % instances.length];
  roundRobinCursor.set(service, current + 1);
  return selected;
};

const getStaticServiceUrl = (service: ServiceName): string => {
  const envValue = process.env[getServiceEnvKey(service)];
  if (envValue) {
    return envValue;
  }

  return `http://${service}:${serviceDefaults[service]}`;
};

const getServiceFromDiscovery = async (service: ServiceName): Promise<string | null> => {
  if (!serviceDiscoveryUrl) {
    return null;
  }

  const lookupResponse = await fetch(
    `${serviceDiscoveryUrl}/v1/health/service/${service}?passing=true`,
    { headers: { Accept: 'application/json' } },
  );
  if (!lookupResponse.ok) {
    return null;
  }

  const instances = (await lookupResponse.json()) as Array<{
    Service?: { Address?: string; Port?: number };
    Node?: { Address?: string };
  }>;

  const resolvedInstances = instances
    .map((entry) => {
      const address = entry.Service?.Address || entry.Node?.Address;
      const instancePort = entry.Service?.Port;
      if (!address || !instancePort) {
        return null;
      }

      return { address, port: instancePort };
    })
    .filter((instance): instance is ServiceInstance => instance !== null);

  if (resolvedInstances.length === 0) {
    return null;
  }

  const selected = pickRoundRobin(service, resolvedInstances);
  return `http://${selected.address}:${selected.port}`;
};

const resolveServiceUrl = async (service: ServiceName): Promise<string> => {
  const discoveredUrl = await getServiceFromDiscovery(service);
  return discoveredUrl ?? getStaticServiceUrl(service);
};

const checkHealthEndpoint = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    return response.ok;
  } catch {
    return false;
  }
};

const checkTcpPort = async (host: string, targetPort: number): Promise<boolean> =>
  new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1_500);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(targetPort, host);
  });

app.set('trust proxy', 1);
app.use(helmet());

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Content-Type, X-Request-Id, X-Correlation-Id',
  );
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  if (request.method === 'OPTIONS') {
    response.status(204).send();
    return;
  }
  next();
});

app.use(express.json({ limit: '1mb' }));

app.use(
  rateLimit({
    windowMs: gatewayRateLimitWindowMs,
    max: gatewayRateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use((request, response, next) => {
  const requestId = request.header('x-request-id') ?? randomUUID();
  const correlationId = request.header('x-correlation-id') ?? requestId;

  request.requestId = requestId;
  request.correlationId = correlationId;
  response.setHeader('x-request-id', requestId);
  response.setHeader('x-correlation-id', correlationId);
  next();
});

app.use((request, response, next) => {
  if (!['POST', 'PUT', 'PATCH'].includes(request.method)) {
    next();
    return;
  }

  const contentType = request.header('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    response.status(415).json({
      service: 'gateway',
      status: 'error',
      message: 'Unsupported content type. application/json is required.',
      requestId: request.requestId,
      correlationId: request.correlationId,
    });
    return;
  }

  next();
});

const authenticate = (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
): void => {
  const authHeader = request.header('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    response.status(401).json({
      service: 'gateway',
      status: 'error',
      message: 'Missing bearer token.',
      requestId: request.requestId,
      correlationId: request.correlationId,
    });
    return;
  }

  const token = authHeader.slice('Bearer '.length).trim();
  try {
    const decoded = jwt.verify(token, jwtAccessSecret) as JwtPayload;
    request.userId = decoded.userId ?? decoded.sub;
    request.roles = decoded.roles ?? [];
    next();
  } catch {
    response.status(401).json({
      service: 'gateway',
      status: 'error',
      message: 'Invalid bearer token.',
      requestId: request.requestId,
      correlationId: request.correlationId,
    });
  }
};

app.get('/health', (_request, response) => {
  response.json({ service: 'gateway', status: 'ok', env: nodeEnv });
});

app.get('/liveness', (_request, response) => {
  response.json({ service: 'gateway', status: 'alive', uptimeSeconds: process.uptime() });
});

app.get('/readiness', async (_request, response) => {
  const checks = await Promise.all([
    checkHealthEndpoint('http://consul:8500/v1/status/leader'),
    checkTcpPort('rabbitmq', 5672),
    checkTcpPort('redis', 6379),
    checkHealthEndpoint('http://jaeger:16686'),
  ]);

  if (checks.every(Boolean)) {
    response.json({ service: 'gateway', status: 'ready' });
    return;
  }

  response.status(503).json({
    service: 'gateway',
    status: 'not-ready',
    checks: {
      serviceDiscovery: checks[0],
      messageBroker: checks[1],
      cache: checks[2],
      tracing: checks[3],
    },
  });
});

app.get('/routes', (_request, response) => {
  response.json({
    service: 'gateway',
    routes: routeDefinitions.map((route) => ({
      path: route.path,
      service: route.service,
      requiresAuth: route.requiresAuth,
    })),
  });
});

app.use((request, response, next) => {
  response.on('finish', () => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      service: 'gateway',
      environment: nodeEnv,
      level: response.statusCode >= 500 ? 'ERROR' : response.statusCode >= 400 ? 'WARN' : 'INFO',
      requestId: request.requestId,
      correlationId: request.correlationId,
      userId: request.userId ?? null,
      method: request.method,
      path: request.originalUrl,
      statusCode: response.statusCode,
    };
    console.log(JSON.stringify(logEntry));
  });

  next();
});

for (const route of routeDefinitions) {
  app.use(
    route.path,
    route.requiresAuth ? authenticate : (_request, _response, next) => next(),
    createProxyMiddleware({
      changeOrigin: true,
      ws: true,
      secure: false,
      pathRewrite: (path) => {
        const rewrittenPath = path.replace(route.path, '');
        return rewrittenPath.length === 0 ? '/' : rewrittenPath;
      },
      router: async () => resolveServiceUrl(route.service),
      on: {
        error: (_error, request, response) => {
          const expressResponse = response as express.Response;
          const expressRequest = request as express.Request;
          expressResponse.status(502).json({
            service: 'gateway',
            status: 'error',
            message: `Failed to reach upstream service: ${route.service}.`,
            requestId: expressRequest.requestId,
            correlationId: expressRequest.correlationId,
          });
        },
        proxyReq: (proxyReq, request) => {
          const expressRequest = request as express.Request;
          proxyReq.setHeader('x-request-id', expressRequest.requestId);
          proxyReq.setHeader('x-correlation-id', expressRequest.correlationId);
          if (expressRequest.userId) {
            proxyReq.setHeader('x-user-id', expressRequest.userId);
          }
          if (expressRequest.roles && expressRequest.roles.length > 0) {
            proxyReq.setHeader('x-user-roles', expressRequest.roles.join(','));
          }
        },
      },
    }),
  );
}

app.use((_request, response) => {
  response.status(404).json({ service: 'gateway', status: 'error', message: 'Route not found.' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`gateway listening on port ${port}`);
});
