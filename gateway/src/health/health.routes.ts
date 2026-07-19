import { Router } from 'express';

import { readinessService } from '@/health/readiness.service.js';
import { routeDefinitions } from '@/config/routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    service: 'gateway',
    status: 'ok',
  });
});

router.get('/liveness', (_req, res) => {
  res.json({
    service: 'gateway',
    status: 'alive',
    uptime: process.uptime(),
  });
});

router.get('/readiness', async (_req, res) => {
  const checks = await readinessService.check();

  const ready = Object.values(checks).every(Boolean);

  if (!ready) {
    return res.status(503).json({
      service: 'gateway',
      status: 'not-ready',
      checks,
    });
  }

  res.json({
    service: 'gateway',
    status: 'ready',
  });
});

router.get('/routes', (_req, res) => {
  res.json({
    routes: routeDefinitions,
  });
});

export default router;
