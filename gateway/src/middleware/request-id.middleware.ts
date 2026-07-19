import { RequestHandler } from 'express';
import { randomUUID } from 'crypto';

export const requestIdMiddleware: RequestHandler = (req, res, next) => {
  req.requestId = req.header('x-request-id') ?? randomUUID();

  req.correlationId = req.header('x-correlation-id') ?? req.requestId;

  res.setHeader('x-request-id', req.requestId);

  res.setHeader('x-correlation-id', req.correlationId);

  next();
};
