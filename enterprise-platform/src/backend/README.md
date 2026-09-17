# Backend — cachesol Enterprise Platform

Triển khai source code backend cho **platform services** + **shared libs** theo tài liệu tại `../README.md`, `../SOURCE-CODE-STRUCTURE.md`, `../governance/architecture/services.yaml`.

## Stack

- **Java 21** + **Spring Boot 3.5.0**
- **PostgreSQL 16** + **Flyway** (schema-per-tenant)
- **Keycloak 25** (JWT verify, OAuth2 resource server)
- **Kafka** (event-driven — port stub, mặc định OFF ở MVP)
- **Feign** (service-to-service HTTP)

## Cấu trúc

```
src/backend/
├── pom.xml                        # Parent POM (multi-module)
├── docker-compose.mvp.yml         # Local dev: 3 services + postgres + keycloak
│
├── shared/                        # Reusable libs
│   ├── shared-common/             # ApiResponse, GlobalExceptionHandler, TenantContext
│   ├── shared-security/           # JWT verify (Keycloak), TenantFilter
│   └── shared-messaging/          # EventEnvelope, EventPublisher
│
└── platform/                      # Microservices
    ├── iam/                       # Port 8082 — JWT verify + Keycloak integration
    ├── platform-registry/         # Port 8081 — tenants + mini-apps
    ├── tenant-manager/            # Port 8083 — users, roles, orgs, employees
    ├── feature-flag/              # (Future) FF4j self-host
    ├── master-data/               # (Future)
    ├── social-integration/        # (Future)
    ├── workflow/                  # (Future) BPMN-lite + 5 templates
    └── approval/                  # (Future) centralized approval
```

## MVP scope (sprint đầu)

> **MVP = 3 services + 3 shared libs.** Các service còn lại (`feature-flag`, `workflow`, `approval`, ...) thêm ở sprint sau.

### Built

- `shared-common` — base classes, ApiResponse wrapper, TenantContext, GlobalExceptionHandler
- `shared-security` — JWT principal (AuthenticatedUser), TenantFilter
- `shared-messaging` — DomainEventEnvelope, EventPublisher (KafkaTemplate-based)
- `iam-service` (8082) — health + JwtVerifyLog entity (skeleton)
- `platform-registry-service` (8081) — health + MiniApp entity (skeleton)
- `tenant-manager-service` (8083) — health + Employee entity (skeleton)

### Deferred (next sprints)

- Đầy đủ controllers/repositories/business logic cho 3 service trên
- 4 service còn lại: `feature-flag`, `master-data`, `social-integration`, `workflow`, `approval`
- Flyway migration scripts (DB schema)
- Kafka topics + consumers (events)
- Testcontainers integration tests
- Kubernetes manifests / Helm charts
- CI/CD pipeline

## Cấu trúc mỗi service (clean arch 3 layers)

```
src/main/java/io/cachesol/platform/<service>/
├── <Service>Application.java      # @SpringBootApplication entrypoint
├── controller/                    # @RestController — client-api/service-api/public-api
├── service/                       # @Service — business logic
├── repository/                    # Spring Data JPA repos (interface)
├── entity/                        # @Entity — JPA mappings
├── dto/                           # Request/Response DTOs (records)
├── config/                        # @Configuration — beans, security, kafka, etc.
└── event/                         # Domain events publish/consume
```

## Build local

```bash
# Yêu cầu: Java 21, Maven 3.9+
cd src/backend
mvn clean package -DskipTests          # build tất cả modules
```

## Run local (docker-compose)

```bash
# Yêu cầu: Docker Desktop / Docker Engine
cd src/backend

# Start postgres + keycloak + 3 services
docker compose -f docker-compose.mvp.yml up -d

# Test health
curl http://localhost:8082/public-api/v1/health
curl http://localhost:8081/public-api/v1/health
curl http://localhost:8083/public-api/v1/health
```

## Test single service

```bash
cd src/backend
mvn -pl platform/iam -am spring-boot:run
```

## Tài liệu liên quan

| File | Mô tả |
|------|--------|
| `../README.md` | Tổng quan platform |
| `../SOURCE-CODE-STRUCTURE.md` | Cấu trúc thư mục source code |
| `../governance/architecture/services.yaml` | Spec từng service (port, events, deps) |
| `../src/backend/platform/<svc>/README.md` | README từng service |
