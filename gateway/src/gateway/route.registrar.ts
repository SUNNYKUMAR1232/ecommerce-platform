import { Express, NextFunction, Request, Response } from 'express';

import { authenticate } from '@middleware/auth.middleware.js';
import { createGatewayProxy } from '@/gateway/proxy.factory.js';

import { routeDefinitions } from '@/config/routes.js';

export function registerGatewayRoutes(app: Express): void {
  for (const route of routeDefinitions) {
    app.use(
      route.path,

      route.requiresAuth
        ? authenticate
        : (_req: Request, _res: Response, next: NextFunction) => next(),

      createGatewayProxy(route),
    );
  }
}
