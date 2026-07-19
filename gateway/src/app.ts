import express from 'express';
import helmet from 'helmet';

import { corsMiddleware } from './middleware/cors.middleware';
import { rateLimiter } from './middleware/rate-limit.middleware';
import { requestIdMiddleware } from './middleware/request-id.middleware';
import { contentTypeMiddleware } from './middleware/content-type.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';
import { notFoundMiddleware } from './middleware/not-found.middleware';

import healthRouter from './health/health.routes';

import { registerGatewayRoutes } from './gateway/route.registrar';

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
