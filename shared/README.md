# Shared Libraries

Phase 2 introduces shared infrastructure-aligned libraries so services do not reimplement common concerns.

## Structure

```text
shared/
└── src/
    ├── common/
    ├── logging/
    ├── configuration/
    ├── events/
    ├── api-contracts/
    ├── authentication/
    ├── authorization/
    ├── validation/
    ├── utilities/
    ├── exceptions/
    ├── constants/
    └── models/
```

## Versioning Strategy

- Shared package version follows semantic versioning (`MAJOR.MINOR.PATCH`).
- Breaking contract changes require a major bump and service rollout plan.
- New backward-compatible models/utilities are minor releases.
- Internal fixes are patch releases.

## Conventions

- Log payloads follow structured logging shape from `logging/`.
- Domain events follow `events/DomainEvent` envelope.
- API errors should implement `ApiErrorResponse`.
- Request propagation uses `x-request-id` and `x-correlation-id`.
