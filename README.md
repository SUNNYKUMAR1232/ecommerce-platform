# E-Commerce Platform

Phase 1 establishes the monorepo foundation.
Phase 2 adds shared infrastructure required by all microservices.

## Services

| Service                | Stack              | Port |
| ---------------------- | ------------------ | ---- |
| gateway                | Node.js + Express  | 3000 |
| auth-service           | Java + Spring Boot | 8081 |
| user-service           | C# + ASP.NET Core  | 8082 |
| product-service        | Go + Gin           | 8083 |
| inventory-service      | Rust + Axum        | 8084 |
| cart-service           | Node.js + Fastify  | 8085 |
| order-service          | Java + Spring Boot | 8086 |
| payment-service        | Rust + Axum        | 8087 |
| shipping-service       | Go + Fiber         | 8088 |
| review-service         | Python + FastAPI   | 8089 |
| notification-service   | Node.js + NestJS   | 8090 |
| search-service         | Python + FastAPI   | 8091 |
| recommendation-service | Python + FastAPI   | 8092 |
| analytics-service      | Rust + Actix Web   | 8093 |

## Local Setup

```bash
cp .env.example .env
npm install
npm run prepare
npm run infra:up
```

Every service exposes `GET /health`.

## Phase 2 Infrastructure

Phase 2 delivers:

- API Gateway with routing, JWT auth, rate limiting, request validation, versioned routes, and structured logs.
- Service discovery via Consul.
- Message broker via RabbitMQ (with management UI).
- Centralized configuration through environment-driven templates and shared config contracts.
- Secret management via Vault.
- Observability stack: Prometheus, Alertmanager, Grafana, Loki/Promtail, Jaeger, OTEL collector.
- Data platform: PostgreSQL, MongoDB, Redis, Elasticsearch, Neo4j, ClickHouse.
- Object storage: MinIO.
- Shared library scaffolding in `shared/src`.
- Kubernetes manifests for local cluster deployment in `k8s/phase2`.

### Start / Stop / Validate

```bash
npm run infra:up
npm run test:phase2
npm run infra:down
```

## Phase 1 Smoke Test

```bash
docker compose build
docker compose up -d
npm run test:phase1
docker compose down
```
