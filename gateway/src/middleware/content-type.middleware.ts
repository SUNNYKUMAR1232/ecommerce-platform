import { RequestHandler } from 'express';
import { gatewayError } from '@/common/responses.js';

export const contentTypeMiddleware: RequestHandler = (req, res, next) => {
  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
    return next();
  }

  const type = req.header('content-type');

  if (!type?.includes('application/json')) {
    return res.status(415).json(gatewayError(req, 'Unsupported content type.'));
  }

  next();
};
