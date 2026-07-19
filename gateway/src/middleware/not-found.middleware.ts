import { RequestHandler } from 'express';

export const notFoundMiddleware: RequestHandler = (_req, res) => {
  res.status(404).json({
    service: 'gateway',

    status: 'error',

    message: 'Route not found.',
  });
};
