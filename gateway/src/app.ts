import express from 'express';
import helmet from 'helmet';

import { corsMiddleware } from './middleware/cors.middleware.js';
import { rateLimiter } from './middleware/rate-limit.middleware.js';
import { requestIdMiddleware } from './middleware/request-id.middleware.js';
import { contentTypeMiddleware } from './middleware/content-type.middleware.js';
import { loggerMiddleware } from './middleware/logger.middleware.js';
import { notFoundMiddleware } from './middleware/not-found.middleware.js';

import healthRouter from './health/health.routes.js';

import { registerGatewayRoutes } from './gateway/route.registrar.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());

app.use(corsMiddleware);

app.use(express.json());

app.use(rateLimiter);

app.use(requestIdMiddleware);

app.use(contentTypeMiddleware);

app.use(loggerMiddleware);

app.use('/', healthRouter);

registerGatewayRoutes(app);

app.use(notFoundMiddleware);

export default app;
