For your **polyglot microservices** project (Rust, Java, Go, Python, Node.js, and .NET), the CI/CD pipeline should be standardized so every service follows the same lifecycle regardless of language.

---

````markdown
# CI/CD Setup

## Objective

Build an automated CI/CD pipeline that ensures every microservice is:

- Built
- Tested
- Secure
- Containerized
- Published
- Deployed
- Monitored

without manual intervention.

---

# CI/CD Architecture

```text
Developer
     │
     ▼
Feature Branch
     │
     ▼
GitHub Pull Request
     │
     ▼
GitHub Actions
     │
     ├── Checkout
     ├── Setup Environment
     ├── Install Dependencies
     ├── Lint
     ├── Unit Tests
     ├── Integration Tests
     ├── Build
     ├── Security Scan
     ├── Docker Build
     ├── Push Image
     ├── Deploy to Kubernetes
     └── Smoke Tests
```

---

# Repository Structure

```text
.github/
│
├── workflows/
│   ├── gateway.yml
│   ├── auth.yml
│   ├── user.yml
│   ├── product.yml
│   ├── inventory.yml
│   ├── cart.yml
│   ├── order.yml
│   ├── payment.yml
│   ├── shipping.yml
│   ├── review.yml
│   ├── notification.yml
│   ├── search.yml
│   ├── recommendation.yml
│   ├── analytics.yml
│   ├── infrastructure.yml
│   └── release.yml
│
├── actions/
│
└── dependabot.yml
```

---

# Branch Strategy

Protected Branch

main

Development

feature/*

Bug Fix

bugfix/*

Hotfix

hotfix/*

Release

release/*

---

# Pipeline Stages

## Stage 1

Checkout Repository

---

## Stage 2

Setup Runtime

Depending on service

Node.js

Java

Go

Python

Rust

.NET

---

## Stage 3

Dependency Restore

Examples

npm install

cargo fetch

go mod download

pip install

maven dependencies

dotnet restore

---

## Stage 4

Static Analysis

Run

Lint

Formatting

Code Quality

Examples

ESLint

Checkstyle

golangci-lint

Ruff

cargo fmt

cargo clippy

dotnet format

---

## Stage 5

Unit Testing

Run

Node

Java

Go

Python

Rust

.NET

Collect

Coverage Reports

JUnit Reports

---

## Stage 6

Integration Testing

Run

Database

Redis

RabbitMQ

Kafka

API Integration

---

## Stage 7

Build

Examples

npm build

cargo build --release

mvn package

go build

dotnet publish

python package

---

## Stage 8

Security Scanning

Run

Dependency Scan

Secret Scan

Container Scan

SAST

License Check

Recommended Tools

Trivy

CodeQL

Dependabot

Gitleaks

---

## Stage 9

Docker Build

Each service produces

One Docker Image

Naming

company/auth-service

company/order-service

company/payment-service

etc.

---

## Stage 10

Push Container

Registry

GitHub Container Registry

or

Docker Hub

or

Azure Container Registry

---

## Stage 11

Deploy

Development

↓

Staging

↓

Production

Deployment

Kubernetes

Helm

Rolling Update

---

## Stage 12

Smoke Tests

Verify

Pods Running

Health Endpoint

Database Connection

RabbitMQ Connection

API Response

---

## Stage 13

Notifications

Notify

Slack

Teams

Discord

Email

GitHub

---

# Environment Strategy

Development

Automatic

Every merge

↓

Staging

Manual approval

↓

Production

Manual approval

---

# Secrets

Store inside GitHub Secrets

Examples

DATABASE_URL

JWT_SECRET

DOCKER_USERNAME

DOCKER_PASSWORD

AWS_ACCESS_KEY

AWS_SECRET_KEY

RABBITMQ_PASSWORD

POSTGRES_PASSWORD

Never commit

.env

Secrets

API Keys

Certificates

---

# Build Matrix

| Language | Build Tool |
|-----------|------------|
| Node.js | npm |
| Java | Maven |
| Rust | Cargo |
| Go | Go Build |
| Python | uv / pip |
| .NET | dotnet |

---

# Required Checks

Every Pull Request must pass

✓ Build

✓ Lint

✓ Tests

✓ Security Scan

✓ Docker Build

before merge.

---

# Deployment Strategy

Development

Automatic

Staging

Automatic after approval

Production

Manual approval

Rolling Update

Health Check

Rollback

---

# Rollback Strategy

If deployment fails

↓

Rollback previous version

↓

Keep previous image

↓

Notify team

---

# Monitoring

After deployment verify

Health

Metrics

Logs

Tracing

Errors

Performance

---

# CI/CD Rules

Never deploy broken code.

Never bypass tests.

Never skip security scans.

Every deployment must be reproducible.

Every image must be versioned.

Every release must have release notes.

Never deploy directly to production from feature branches.

Only main branch can deploy production.

---

# Tools

Repository

GitHub

CI/CD

GitHub Actions

Container

Docker

Registry

GitHub Container Registry

Orchestration

Kubernetes

Package Manager

Helm

Secrets

GitHub Secrets

Monitoring

Prometheus

Logging

Grafana

Tracing

Jaeger

Security

CodeQL

Trivy

Dependabot

Gitleaks

---

# Definition of Done

✓ Build succeeds

✓ Tests pass

✓ Security scans pass

✓ Docker image created

✓ Image pushed

✓ Deployment successful

✓ Health checks pass

✓ Monitoring active

✓ Logs visible

✓ Documentation updated

✓ Release tagged
````

### Recommended GitHub Actions Workflow Order

1. **`ci.yml`** – Common validation (lint, test, build) for every PR.
2. **`docker.yml`** – Build and publish Docker images.
3. **`deploy-dev.yml`** – Automatic deployment to the development environment.
4. **`deploy-staging.yml`** – Deploy to staging after approval.
5. **`deploy-prod.yml`** – Production deployment with manual approval and rollback support.
6. **`release.yml`** – Create Git tags, release notes, and publish artifacts.

This structure scales well for your polyglot microservices architecture while keeping each service's pipeline independent and maintainable.

