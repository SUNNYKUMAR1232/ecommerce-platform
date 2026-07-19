import rateLimit from 'express-rate-limit';
import { env } from '@/config/env.js';

export const rateLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,

  max: env.rateLimit.max,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    service: 'gateway',
    status: 'error',
    message: 'Too many requests.',
  },
});
