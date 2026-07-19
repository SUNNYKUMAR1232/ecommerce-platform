import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '@/config/env.js';
import { gatewayError } from '@/common/responses.js';
import { JwtPayload } from '@/types/intex.js';

export const authenticate: RequestHandler = (req, res, next) => {
  const auth = req.header('authorization');

  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json(gatewayError(req, 'Missing bearer token.'));
  }

  try {
    const payload = jwt.verify(auth.substring(7), env.jwtSecret) as JwtPayload;

    req.userId = payload.userId ?? payload.sub;

    req.roles = payload.roles ?? [];

    next();
  } catch {
    return res.status(401).json(gatewayError(req, 'Invalid bearer token.'));
  }
};
