# E-Commerce Platform AI Agent Rules

Version: 1.0

These rules apply to every AI agent working in this repository.

---

# 1. Primary Objective

Build an enterprise-grade e-commerce platform using Microservices, Domain-Driven Design (DDD), Clean Architecture, Event-Driven Architecture, CQRS (where appropriate), and Polyglot Persistence.

Every implementation should prioritize:

- Correctness
- Maintainability
- Scalability
- Security
- Performance
- Readability

Never sacrifice architecture for short-term convenience.

---

# 2. Architecture Rules

Follow:

- Microservices Architecture
- Domain Driven Design (DDD)
- Clean Architecture
- SOLID Principles
- DRY
- KISS
- YAGNI

Never implement business logic in infrastructure layers.

---

# 3. Service Ownership

Each service owns:

- Source code
- Business logic
- APIs
- Database
- Events

Never modify another service unless explicitly instructed.

---

# 4. Database Rules

Each service owns its own database.

Never:

- Read another service's database
- Write another service's database
- Share database tables
- Share transactions

Communication happens through:

- REST
- gRPC
- RabbitMQ/Kafka

---

# 5. Communication Rules

Use REST for:

- Queries
- CRUD
- Client requests

Use Events for:

- Business notifications
- Asynchronous workflows
- Cross-service communication

Never create tight coupling between services.

---

# 6. API Rules

Every API must

- Follow REST conventions
- Use versioning (/api/v1)
- Validate input
- Return consistent responses
- Return proper HTTP status codes
- Be documented

Never expose internal implementation.

---

# 7. Security Rules

Always

- Authenticate requests
- Authorize permissions
- Validate JWT
- Encrypt sensitive data
- Hash passwords
- Validate input
- Sanitize output

Never

- Hardcode secrets
- Log passwords
- Log tokens
- Store plain-text passwords

---

# 8. Event Rules

Events must

- Use PascalCase
- Use past tense

Example

OrderCreated

PaymentSucceeded

InventoryReserved

Every event should include

- EventId
- Timestamp
- CorrelationId
- Version
- Source
- Payload

---

# 9. Code Quality

Code must

- Be readable
- Have meaningful names
- Be modular
- Have one responsibility per class
- Have one responsibility per function

Avoid

- Duplicate code
- Huge classes
- Huge functions
- Dead code
- Magic numbers

---

# 10. Error Handling

Always

- Validate input
- Return meaningful errors
- Log unexpected exceptions
- Hide internal details

Never

- Ignore exceptions
- Swallow errors
- Return stack traces

---

# 11. Logging

Every service should log

- Startup
- Shutdown
- Requests
- Errors
- Business events

Never log

- Passwords
- Tokens
- Credit cards
- Secrets

---

# 12. Testing

Every feature should include

- Unit tests
- Integration tests (if applicable)

Critical business logic must always be tested.

---

# 13. Documentation

Every new feature should update

- README
- API Documentation
- Architecture docs
- Event documentation

Never leave documentation outdated.

---

# 14. Performance

Avoid

- N+1 queries
- Blocking operations
- Unnecessary allocations
- Duplicate database calls

Cache where appropriate.

---

# 15. Git Rules

Use

Feature branches

Conventional Commits

Pull Requests

Never commit

- Secrets
- Credentials
- Generated files
- Environment files

---

# 16. Dependency Rules

Only add dependencies when necessary.

Before adding a library

Ask

Can this be implemented with existing libraries?

Avoid unnecessary dependencies.

---

# 17. Refactoring Rules

Refactor only when

- Improving readability
- Improving maintainability
- Improving performance
- Removing duplication

Never change behavior unintentionally.

---

# 18. AI Agent Behaviour

Before writing code

Understand

- Requirements
- Existing architecture
- Service boundaries

Never guess.

If something is unclear

Ask for clarification.

---

# 19. AI Output Rules

Always produce

- Production-ready code
- Clean architecture
- Proper folder structure
- Error handling
- Logging
- Tests (when requested)
- Documentation updates

Avoid placeholder implementations unless explicitly requested.

---

# 20. Framework Rules

This project uses multiple languages and frameworks.

Respect each service's chosen stack.

Examples

Gateway → Node.js

Auth → Spring Boot

Inventory → Rust

Product → Go

Review → FastAPI

User → ASP.NET Core

Do not rewrite one framework into another.

---

# 21. Code Review Checklist

Before completing work verify

✓ Architecture respected

✓ Service boundaries respected

✓ No direct DB access

✓ Validation implemented

✓ Security implemented

✓ Logging added

✓ Tests updated

✓ Documentation updated

✓ Events published where required

✓ APIs documented

✓ No breaking changes

---

# 22. Definition of Done

A task is complete only if

✓ Code builds successfully

✓ Tests pass

✓ Lint passes

✓ Documentation updated

✓ API documented

✓ Events documented

✓ Logging implemented

✓ Security reviewed

✓ Code follows project architecture

✓ Ready for production

---

# Golden Rules

1. Keep services independent.

2. Never break DDD boundaries.

3. Never access another service's database.

4. Prefer events over tight coupling.

5. Write production-quality code.

6. Security is mandatory.

7. Documentation is part of the feature.

8. Simplicity over cleverness.

9. Every commit should improve the project.

10. Think like an architect, not just a programmer.
