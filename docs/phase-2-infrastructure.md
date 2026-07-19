# Phase 2 Infrastructure Guide

## Overview

Phase 2 centralizes cross-cutting infrastructure used by all services:

- API Gateway
- Service Discovery
- Messaging
- Configuration and secrets
- Datastores and cache
- Storage
- Logging, monitoring, tracing
- Local Kubernetes assets

## API Gateway

Gateway implementation: `gateway/src/index.ts`

Capabilities:

- Route-based reverse proxy (`/api/v1/*`)
- JWT validation (Bearer token)
- Request rate limiting
- Request validation for JSON payloads
- Correlation and request ID propagation
- Structured access logging
- `/health`, `/readiness`, `/liveness`, `/routes`

Route definitions:

- `/api/v1/auth` -> `auth-service` (public)
- `/api/v1/users` -> `user-service` (secured)
- `/api/v1/products` -> `product-service` (public)
- `/api/v1/inventory` -> `inventory-service` (secured)
- `/api/v1/cart` -> `cart-service` (secured)
- `/api/v1/orders` -> `order-service` (secured)
- `/api/v1/payments` -> `payment-service` (secured)
- `/api/v1/shipping` -> `shipping-service` (secured)
- `/api/v1/reviews` -> `review-service` (public)
- `/api/v1/notifications` -> `notification-service` (secured)
- `/api/v1/search` -> `search-service` (public)
- `/api/v1/recommendations` -> `recommendation-service` (secured)
- `/api/v1/analytics` -> `analytics-service` (secured)

## Infrastructure Stack (Docker Compose)

File: `docker-compose.phase2.yml`

- **Service discovery**: Consul
- **Message broker**: RabbitMQ
- **Databases**: PostgreSQL, MongoDB, Elasticsearch, Neo4j, ClickHouse
- **Cache**: Redis
- **Object storage**: MinIO
- **Secret manager**: Vault (dev mode for local setup)
- **Monitoring**: Prometheus, Alertmanager, Grafana, node-exporter
- **Logging**: Loki + Promtail
- **Tracing**: Jaeger + OpenTelemetry Collector

Supporting config:

- `infra/prometheus/*`
- `infra/alertmanager/*`
- `infra/loki/*`
- `infra/promtail/*`
- `infra/otel/*`

## Event Categories

Shared event category model is defined in `shared/src/events/index.ts`:

- user
- product
- inventory
- order
- payment
- shipping
- notification
- analytics

RabbitMQ can use this routing pattern:

- Exchange: `events.topic` (topic)
- Routing keys:
  - `user.*`
  - `product.*`
  - `inventory.*`
  - `order.*`
  - `payment.*`
  - `shipping.*`
  - `notification.*`
  - `analytics.*`
- Include per-service DLQ bindings (`*.dlq`)

## Configuration and Secrets

- Runtime configuration is environment-driven from `.env`.
- Template defaults are in `.env.example`.
- Secret-sensitive values include:
  - `JWT_ACCESS_SECRET`
  - database credentials
  - message broker credentials
  - MinIO credentials
  - Vault root token
  - Grafana admin credentials

### Secret Rotation Strategy

- Use short-lived credentials where supported.
- Rotate all static credentials by environment at least every 90 days.
- Keep secret values out of source control for non-local environments.

## Health Endpoints

Gateway supports:

- `/health`
- `/readiness`
- `/liveness`

Every domain microservice should expose:

- `/health`
- `/readiness`
- `/liveness`

## Local Runbook

```bash
npm run infra:up
npm run test:phase2
npm run infra:down
```

Smoke test script: `scripts/phase2-smoke-test.ps1`

## Kubernetes (Local Cluster)

Resources under `k8s/phase2`:

- `namespace.yaml`
- `core-infra.yaml`
- `data-infra.yaml`
- `observability.yaml`

Apply:

```bash
kubectl apply -f k8s/phase2/namespace.yaml
kubectl apply -f k8s/phase2/core-infra.yaml
kubectl apply -f k8s/phase2/data-infra.yaml
kubectl apply -f k8s/phase2/observability.yaml
```

## Acceptance Mapping

- Infrastructure starts from a single command (`npm run infra:up`).
- Services communicate through gateway routes and service discovery fallback.
- Event categories and routing conventions are standardized.
- Logs and metrics are centralized.
- Tracing backend is available with OTEL-compatible ingestion.
- Secret management service is available (Vault).
