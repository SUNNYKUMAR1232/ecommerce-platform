import { createProxyMiddleware } from 'http-proxy-middleware';
import { Request, Response } from 'express';

import { serviceResolver } from '@/gateway/service.resolver.js';
import { RouteDefinition } from '@/types/intex.js';

export function createGatewayProxy(route: RouteDefinition) {
  return createProxyMiddleware({
    changeOrigin: true,

    ws: true,

    secure: false,

    router: async () => serviceResolver.resolve(route.service),

    pathRewrite(path) {
      const rewritten = path.replace(route.path, '');

      return rewritten || '/';
    },

    on: {
      proxyReq(proxyReq, req) {
        const request = req as Request;

        proxyReq.setHeader('x-request-id', request.requestId);

        proxyReq.setHeader('x-correlation-id', request.correlationId);

        if (request.userId) {
          proxyReq.setHeader('x-user-id', request.userId);
        }

        if (request.roles?.length) {
          proxyReq.setHeader('x-user-roles', request.roles.join(','));
        }
      },

      error(_err, req, res) {
        const response = res as Response;

        const request = req as Request;

        response.status(502).json({
          service: 'gateway',

          status: 'error',

          message: `Unable to reach ${route.service}.`,

          requestId: request.requestId,

          correlationId: request.correlationId,
        });
      },
    },
  });
}
