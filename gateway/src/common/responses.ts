import { Request } from 'express';

export function gatewayError(req: Request, message: string) {
  return {
    service: 'gateway',

    status: 'error',

    message,

    requestId: req.requestId,

    correlationId: req.correlationId,
  };
}
