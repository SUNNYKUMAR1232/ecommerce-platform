import { RequestHandler } from 'express';

export const loggerMiddleware: RequestHandler = (req, res, next) => {
  res.on('finish', () => {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),

        service: 'gateway',

        level: res.statusCode >= 500 ? 'ERROR' : res.statusCode >= 400 ? 'WARN' : 'INFO',

        requestId: req.requestId,

        correlationId: req.correlationId,

        userId: req.userId ?? null,

        method: req.method,

        path: req.originalUrl,

        statusCode: res.statusCode,
      }),
    );
  });

  next();
};
