# Cấu Trúc Source Code

Tài liệu này mô tả chi tiết cấu trúc source code của Enterprise Platform, bao gồm **Backend Microservices** và **Frontend Mini Apps**.

> **Phiên bản:** Tái cấu trúc lần 2 — Gom toàn bộ source code vào thư mục `src/` duy nhất.

---

## Tổng quan

Enterprise Platform sử dụng kiến trúc **microservices** cho backend và **mini app dạng library** cho frontend. Toàn bộ source code được tổ chức trong **một thư mục gốc duy nhất `src/`** ở root, tách biệt hoàn toàn với tài liệu, requirement và AI definitions.

```text
enterprise-platform/
│
├── src/                      ★ THƯ MỤC SOURCE CODE DUY NHẤT
│   ├── backend/              ★ Tất cả backend Java Spring Boot
│   │   ├── applications/     ← Microservices nghiệp vụ (HRM, ERP, Sales, ...)
│   │   ├── platform/         ← Microservices nền tảng (IAM, Notification, Workflow, ...)
│   │   └── shared/           ← Backend shared libraries (publish Maven internal)
│   │
│   └── frontend/             ★ Frontend mono-repo (host shell + mini-apps dạng library)
│       ├── apps/web-shell/
│       ├── mini-apps/
│       ├── shared/                       (shared-ui, shared-types, shared-api)
│       └── design-system/                ★ Design System CODE library (@cachesol/design-system)
│
├── applications/             ★ CHỈ CHỨA DOCS / REQUIREMENT / TESTS
│   ├── hrm/{docs,requirement,tests}/
│   ├── erp/{docs,requirement,tests}/
│   └── sales/{docs,requirement,tests}/
│
├── governance/               ← Principles, ADR, standards, API, security, quality
├── agents/                   ← AI agents definitions + PIPELINE-PROMPTS
├── skills/                   ← Skills + enterprise aliases
├── workflows/                ← YAML pipelines (feature, bugfix, release, ...)
└── design-system/            ★ Design System DOCS (markdown only: components, patterns, templates, tokens)
```

**Nguyên tắc quan trọng:**

- ✅ **Backend code** nằm trong `src/backend/applications/{name}/` (nghiệp vụ) hoặc `src/backend/platform/{name}/` (nền tảng).
- ✅ **Frontend code** nằm trong `src/frontend/{apps,mini-apps,shared,design-system}/`.
- ✅ **Shared libraries** (web-shell, shared-ui, shared-types, shared-api) chỉ tồn tại 1 lần trong `src/frontend/`.
- ✅ **`applications/{name}/`** ở root **CHỈ** chứa `docs/`, `requirement/`, `tests/` — KHÔNG có `backend/`.
- ✅ **KHÔNG** tạo `frontend/` riêng trong từng `applications/{name}/`.
- ✅ **Design System** có 2 vị trí KHÁC NHAU, đừng nhầm:
  - `design-system/` ở **root** = **DOCS** (markdown) — components, patterns, tokens, templates
  - `src/frontend/design-system/` = **CODE library** — package `@cachesol/design-system`, tokens TypeScript, base React components

---

## 0. Bảng ánh xạ di chuyển (Migration Mapping)

Áp dụng khi migrate từ cấu trúc cũ sang cấu trúc mới:

| Cũ | Mới |
|----|-----|
| `applications/hrm/backend/` | `src/backend/applications/hrm/` |
| `applications/erp/backend/` | `src/backend/applications/erp/` |
| `applications/sales/backend/` | `src/backend/applications/sales/` |
| `platform/iam/` | `src/backend/platform/iam/` |
| `platform/social-integration/` | `src/backend/platform/social-integration/` |
| `platform/workflow/` | `src/backend/platform/workflow/` |
| `platform/file/` | `src/backend/platform/file/` |
| `platform/search/` | `src/backend/platform/search/` |
| (chưa có) | `src/backend/shared/` |
| `frontend/apps/web-shell/` | `src/frontend/apps/web-shell/` |
| `frontend/mini-apps/hrm-mini-app/` | `src/frontend/mini-apps/hrm-mini-app/` |
| `frontend/shared/shared-ui/` | `src/frontend/shared/shared-ui/` |
| `frontend/shared/shared-types/` | `src/frontend/shared/shared-types/` |
| `frontend/shared/shared-api/` | `src/frontend/shared/shared-api/` |
| `frontend/design-system/` | `src/frontend/design-system/` |
| `applications/hrm/docs/` | `applications/hrm/docs/` *(giữ nguyên)* |
| `applications/hrm/requirement/` | `applications/hrm/requirement/` *(giữ nguyên)* |
| `applications/hrm/tests/` | `applications/hrm/tests/` *(giữ nguyên)* |

> **Lưu ý:** Java package `com.cachesol.platform.*` và frontend package `@cachesol/*` **không đổi** — chỉ di chuyển folder vật lý.

---

## 1. Backend - Microservice Structure

### 1.1 Vị trí source code

```
src/backend/
├── applications/              ← Microservices nghiệp vụ (theo domain)
│   ├── hrm/                   # ★ HRM chứa organizations, employees, job_titles, attendance, payroll,...
│   ├── sales/                 # ★ Sales chứa customers, contacts, opportunities
│   ├── erp/
│   ├── finance/
│   └── marketing/
│
├── platform/                  ← Microservices nền tảng (CHỈ 8 — xem ARCHITECTURE.md §4)
│   ├── iam/                   # JWT verify only (Keycloak JWK cache + webhook receiver)
│   ├── platform-registry/     # Tenants registry, mini-apps catalog, org-root mapping, role template
│   ├── tenant-manager/        # Users (Keycloak Admin API), roles/permissions, organizations, job_titles, employees
│   ├── feature-flag/          # FF4j self-host (feature flags)
│   ├── master-data/           # Danh mục dùng chung (country, currency, unit...)
│   ├── social-integration/   # Notifications (email/SMS/push/in-app) + social channels + posts + pages + analytics
│   ├── workflow/              # BPMN-lite engine
│   └── approval/              # Ticket duyệt (gắn với workflow user-tasks)
│
└── shared/                    ← Backend shared libraries
    ├── shared-common/         # com.cachesol.platform.shared (audit publisher, file wrapper, tenant util)
    ├── shared-messaging/      # Kafka producer/consumer, event base classes
    └── shared-security/       # KeycloakJwtDecoder, TenantContextFilter, @PreAuthorize
```

> **So với v2:** Từ 15 platform services đã giảm xuống **8** (xoá `organization`, `employee`, `customer`, `audit`, `file`, `search`, `reporting`, `scheduler`, `integration`).
> Tách `iam` (JWT verify only), `platform-registry` (tenants + mini-apps + org-root + role template), `tenant-manager` (users + roles + org tree + employees per-tenant), `social-integration` (notifications + social channels + posts + pages).

### 1.2 Cấu trúc từng Application

**Mỗi microservice nằm ở `src/backend/applications/{name}/`** (hoặc `src/backend/platform/{name}/` cho platform services). Cấu trúc áp dụng **đồng nhất** cho cả applications và platform services.

```text
src/backend/applications/{name}/        ← cũng áp dụng cho src/backend/platform/{name}/
├── src/main/
│   ├── java/com/cachesol/platform/{name}/
│   │   ├── HrmServiceApplication.java  ← @SpringBootApplication — tên class = {Name}ServiceApplication
│   │   │
│   │   ├── application/                ← Layer 1: Application Services
│   │   │   ├── controller/             ← REST Controllers (@RestController)
│   │   │   ├── dto/                    ← Request/Response DTOs (gộp chung, không tách request/response)
│   │   │   └── service/                ← Application Service (gọi domain, orchestration)
│   │   │
│   │   ├── domain/                     ← Layer 2: Domain Core
│   │   │   ├── entity/                 ← JPA Entities (@Entity)
│   │   │   └── repository/             ← Spring Data JPA Repository Interface
│   │   │
│   │   └── (infrastructure/ sẽ thêm khi cần — messaging, external API, persistence impl)
│   │
│   └── resources/
│       ├── application.yml             ← Main config (profile chính)
│       ├── application-local.yml       ← Local profile (dev)
│       ├── logback-spring.xml          ← ★ Logging: JSON appender, MDC, AUDIT/PERFORMANCE logger
│       └── db/migration/               ← Flyway migrations
│           ├── V1__create_employees_table.sql
│           └── V1__create_audit_logs.sql      ← Audit log table (bắt buộc)
│
├── pom.xml                             ← Maven build
└── README.md                           ← Mô tả service (README phải khớp vị trí mới src/backend/applications/{name}/)
```

**Quy tắc bắt buộc:**

| Quy tắc | Mô tả |
|---------|-------|
| **Main class** | Phải tên `{Name}ServiceApplication` (VD: `HrmServiceApplication`, `IamServiceApplication`) |
| **DTO gộp chung** | `application/dto/` chứa cả `*Request`, `*Response`, `ApiResponse`, `PageResponse`. Không tách `request/` và `response/`. |
| **Logging bắt buộc** | Mọi microservice PHẢI có `logback-spring.xml` + `V1__create_audit_logs.sql`. Xem §1.6. |
| **Inheritance shared libs** | `pom.xml` khai báo dependency vào `com.cachesol.platform:shared-common`, `shared-messaging`, `shared-security`. |
| **README inline** | Service README chỉ mô tả service đó, KHÔNG lặp lại kiến trúc chung (link ra doc chính). |

**Ví dụ thực tế (HRM sau khi migrate):**

```text
src/backend/applications/hrm/
├── pom.xml
├── README.md
└── src/main/
    ├── java/com/cachesol/platform/hrm/
    │   ├── HrmServiceApplication.java
    │   ├── application/
    │   │   ├── controller/EmployeeController.java
    │   │   ├── dto/{ApiResponse,CreateEmployeeRequest,EmployeeResponse,PageResponse}.java
    │   │   └── service/EmployeeService.java
    │   └── domain/
    │       ├── entity/Employee.java
    │       └── repository/EmployeeRepository.java
    └── resources/
        ├── application.yml
        ├── logback-spring.xml
        └── db/migration/
            ├── V1__create_employees_table.sql
            └── V1__create_audit_logs.sql
```

> **★ Phân biệt 2 folder `applications/`:**
>
> | Vị trí | Vai trò | Chứa gì |
> |--------|---------|---------|
> | `src/backend/applications/{name}/` | **Source code** microservice | `pom.xml`, `src/main/java/...`, `src/main/resources/...`, `README.md` |
> | `applications/{name}/` (ở root) | **Chỉ là domain folder** cho requirement/docs/tests | `docs/`, `requirement/`, `tests/`, `README.md` — **KHÔNG CÓ CODE** |
>
> Quy tắc:
> - **Code service chỉ tồn tại ở `src/backend/applications/{name}/`.**
> - **`applications/{name}/` ở root chỉ chứa `docs/`, `requirement/`, `tests/`, `README.md`.** Tên folder phải trùng với `{name}` trong `src/backend/applications/`.
> - Ví dụ: `applications/hrm/` (root) ↔ `src/backend/applications/hrm/` (code) ↔ `applications/hrm/README.md` mô tả domain HRM và link tới code ở `src/backend/applications/hrm/`.

### 1.3 Package Naming Convention (chung cho mọi microservice)

**Mọi package con đều bắt đầu bằng `com.cachesol.platform.{layer}.{name}`.**

```text
com.cachesol.platform.{layer}.{name}
                 │         │       │
                 │         │       └── Tên service (VD: hrm, iam) hoặc shared lib
                 │         │
                 │         └── application / domain / infrastructure
                 │
                 └── Package gốc bắt buộc
```

**Cụ thể:**

| Layer | Pattern | Ví dụ |
|-------|---------|-------|
| Microservice (applications) | `com.cachesol.platform.{name}` | `com.cachesol.platform.hrm` |
| Microservice (platform) | `com.cachesol.platform.{name}` | `com.cachesol.platform.iam` |
| Application layer | `com.cachesol.platform.{name}.application.*` | `com.cachesol.platform.hrm.application.controller` |
| Domain layer | `com.cachesol.platform.{name}.domain.*` | `com.cachesol.platform.hrm.domain.entity` |
| Infrastructure layer | `com.cachesol.platform.{name}.infrastructure.*` | `com.cachesol.platform.hrm.infrastructure.persistence` |
| Shared lib — common | `com.cachesol.platform.shared.{artifact}` | `com.cachesol.platform.shared.common`, `…shared.messaging`, `…shared.security` |

**Quy tắc đặt tên:**
- Tên service viết **thường** trong package path: `com.cachesol.platform.hrm` (KHÔNG `com.cachesol.platform.HRM`).
- Main class tên `{Name}ServiceApplication` (PascalCase): `HrmServiceApplication`, `IamServiceApplication`.
- Package shared lib dùng số ít: `shared.common`, không phải `shared.commons`.
- Maven artifactId: kebab-case nhưng vẫn mang prefix: `shared-common`, `shared-messaging`, `shared-security`.

### 1.4 Chi tiết từng Layer

#### Application Layer (`application/`)

```text
application/
├── controller/
│   ├── {EntityName}Controller.java
│   └── {EntityName}ControllerTest.java          # (sẽ thêm)
│
├── dto/                                          # ★ GỘP CHUNG — KHÔNG tách request/response/
│   ├── Create{EntityName}Request.java
│   ├── Update{EntityName}Request.java           # (sẽ thêm khi cần)
│   ├── {EntityName}Response.java
│   ├── ApiResponse.java                         # Wrapper response chuẩn: { success, message, data }
│   └── PageResponse.java                        # Wrapper phân trang
│
└── service/                                     # Application Service (orchestration, transactional)
    ├── {EntityName}Service.java
    └── {EntityName}ServiceTest.java             # (sẽ thêm)
```

**Nguyên tắc:**
- Controller xử lý HTTP request/response, **KHÔNG** viết business logic.
- Controller **dùng SLF4J** cho access log (`RequestLoggingFilter` đã tự ghi ở backend — §1.6).
- Sử dụng `@Valid` cho request validation (Bean Validation annotations).
- DTO khác Domain Entity. DTO ở `dto/` gộp chung, không tách `request/` / `response/`.
- Application Service nằm ở `application/service/`, KHÔNG đặt ở `domain/service/` (đó là Domain Service trong mô hình DDD — khi nào cần mới thêm).
- Dùng Lombok (`@Data`, `@Builder`, `@RequiredArgsConstructor`, `@Slf4j`) để giảm boilerplate.

**Ví dụ Controller thực tế (HRM `EmployeeController`):**

```java
@RestController
@RequestMapping("/employees")                       // ★ KHÔNG prefix /api/v1/ — server.servlet.context-path đã có /api/v1
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<EmployeeResponse>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(employeeService.getAll(pageable)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeResponse>> create(
            @Valid @RequestBody CreateEmployeeRequest request) {
        EmployeeResponse response = employeeService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        employeeService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
```

**DTO & Wrapper (thực tế trong `application/dto/`):**

```java
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder().success(true).message("OK").data(data).build();
    }
}

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PageResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;

    public static <T> PageResponse<T> of(List<T> content, int page, int size, long total) {
        int totalPages = (int) Math.ceil((double) total / size);
        return PageResponse.<T>builder()
                .content(content).page(page).size(size).totalElements(total).totalPages(totalPages)
                .build();
    }
}
```

```java
@Data
public class CreateEmployeeRequest {           // ★ Validation bằng Bean Validation
    @NotBlank @Size(max = 20)  private String employeeCode;
    @NotBlank @Size(max = 100) private String firstName;
    @NotBlank @Size(max = 100) private String lastName;
    @NotBlank @Email          private String email;
    @Size(max = 20)            private String phone;
    @NotNull                  private LocalDate dateOfJoining;
    @NotBlank                 private String employmentType;   // enum name
}
```

> **Ghi chú:** `RequestLoggingFilter` (shared) đã tự ghi access log ở `ACCESS` logger với trace_id, latency_ms, status. Controller KHÔNG cần ghi access log thủ công.

#### Domain Layer (`domain/`)

```text
domain/
├── entity/
│   ├── {EntityName}.java                  # JPA Entity
│   └── {EntityName}EntityTest.java        # (sẽ thêm)
│
├── vo/                                    # (sẽ thêm khi cần DDD value object)
│   ├── Money.java
│   └── Email.java
│
├── repository/
│   └── {EntityName}Repository.java       # Spring Data JPA Interface (không có impl riêng)
│
└── (service/ sẽ thêm khi cần Domain Service)
```

**Nguyên tắc:**
- Entity dùng Lombok `@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor`.
- ID dùng UUID: `@GeneratedValue(strategy = GenerationType.UUID)`.
- Enum dùng `@Enumerated(EnumType.STRING)`.
- KHÔNG cần `Service` / `ServiceImpl` riêng — `application/service/{Name}Service` đã đủ cho CRUD.
- Khi logic phức tạp không thuộc về entity nào, mới tạo `domain/service/{Name}DomainService` (DDD).
- KHÔNG inject Infrastructure vào Domain.
- Repository chỉ là interface — Spring Data JPA tự sinh implementation.
- **Domain service ghi log business events** (audit trail) — KHÔNG ghi technical logs ở đây.

**Ví dụ Domain Service có logging:**

```java
@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final AuditLogger auditLogger;  // ★ Ghi audit trail

    @Override
    @Transactional
    public EmployeeDTO create(CreateEmployeeRequest req) {
        // ★ Business event log (INFO) — ghi vào audit table + log file
        log.info("Business event: employee.create.start tenant={} email={}",
                SecurityContext.getTenantId(), req.getEmail());

        // ★ Validate domain rule
        if (employeeRepository.existsByEmailAndTenantId(req.getEmail(), tenantId)) {
            // ★ Business rule violation (WARN, không phải lỗi hệ thống)
            log.warn("Business rule violation: email already exists email={} tenant={}",
                    req.getEmail(), tenantId);
            throw new EmployeeBusinessException("EMAIL_ALREADY_EXISTS", req.getEmail());
        }

        Employee saved = employeeRepository.save(Employee.from(req));

        // ★ Business event log (INFO) — ghi audit trail
        auditLogger.record(
            AuditEvent.builder()
                .action("EMPLOYEE_CREATED")
                .entityId(saved.getId())
                .actor(SecurityContext.getCurrentUserId())
                .after(saved)
                .build()
        );

        log.info("Business event: employee.create.success employeeId={}", saved.getId());
        return EmployeeMapper.toDTO(saved);
    }
}
```

#### Infrastructure Layer (`infrastructure/`)

```text
infrastructure/
├── persistence/
│   ├── adapter/
│   │   └── {EntityName}RepositoryAdapter.java
│   └── mapper/
│       └── {EntityName}Mapper.java       # MapStruct mapper
│
├── logging/                              # ★ Logging infrastructure
│   ├── AccessLogLogger.java              # Access log (HTTP request/response)
│   ├── AuditLogger.java                  # Audit log (business events)
│   ├── PerformanceLogger.java            # Performance / slow query log
│   ├── StructuredLogContext.java         # MDC helper
│   └── filter/
│       ├── RequestLoggingFilter.java     # Servlet filter
│       └── CorrelationIdFilter.java      # Inject traceId, spanId
│
├── messaging/
│   ├── producer/
│   │   └── {EventName}EventProducer.java
│   └── consumer/
│       └── {EventName}EventConsumer.java
│
├── external/
│   ├── client/
│   │   └── {ExternalService}Client.java  # Feign Client
│   └── config/
│       └── FeignConfig.java
│
└── config/
    ├── SecurityConfig.java
    ├── KafkaConfig.java
    ├── OpenApiConfig.java
    └── WebConfig.java
```

**Logging Infrastructure (xem chi tiết ở [§1.6 Logging](#16-logging--quan-trọng)):**

| Class | Trách nhiệm |
|-------|-------------|
| `CorrelationIdFilter` | Inject `traceId`, `spanId`, `userId`, `tenantId` vào MDC cho mọi request |
| `RequestLoggingFilter` | Ghi access log (method, path, status, latency) |
| `AccessLogLogger` | Log API access ở Controller layer |
| `AuditLogger` | Ghi audit trail cho business events (DB + log file) |
| `PerformanceLogger` | Log slow query (>500ms), slow API (>1s) |
| `StructuredLogContext` | Helper set/clear MDC an toàn |

### 1.5 Naming Conventions Backend

| Element | Convention | Example |
|---------|-----------|---------|
| Package | lowercase | `com.cachesol.platform.hrm.employee` |
| Class | PascalCase | `EmployeeService`, `EmployeeRepository` |
| Interface | PascalCase | `EmployeeService` (Impl: `EmployeeServiceImpl`) |
| Method | camelCase | `getEmployeeById()` |
| Variable | camelCase | `employeeList`, `totalCount` |
| Constant | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `DEFAULT_PAGE_SIZE` |
| Database Table | snake_case, plural | `employees`, `employee_addresses` |
| Database Column | snake_case | `employee_id`, `first_name` |
| Log key (MDC) | snake_case | `trace_id`, `user_id`, `tenant_id` |

### 1.6 Logging — QUAN TRỌNG ★

> **YÊU CẦU BẮT BUỘC:** Mọi microservice **PHẢI** có hệ thống logging đầy đủ gồm **access log**, **business log**, **audit log**, **performance log**, với **structured logging (JSON)** và **correlation ID**.

#### 1.6.1 Các loại log bắt buộc

| Loại log | Mục đích | Mức | Nơi ghi | Retention |
|----------|----------|-----|---------|-----------|
| **Access Log** | HTTP request/response, status, latency | INFO | Console (JSON) + File | 30 ngày |
| **Business Log** | Domain event (employee.created, order.placed) | INFO/WARN | Console (JSON) + File + DB (audit) | 90 ngày |
| **Audit Log** | Ai làm gì, khi nào, trước/sau thay đổi | INFO | DB bắt buộc (audit table) + File | 1 năm (compliance) |
| **Performance Log** | Slow query, slow API, memory/CPU spike | WARN | File + APM (Datadog/Prometheus) | 30 ngày |
| **Error Log** | Unhandled exception, system error | ERROR | File + Sentry/Datadog Error Tracking | 90 ngày |
| **Security Log** | Auth fail, permission denied, suspicious activity | WARN/ERROR | File + SIEM | 1 năm |

#### 1.6.2 Structured Logging (JSON format)

Mọi log PHẢI output dạng JSON ở môi trường `dev`, `staging`, `prod`. Local dev có thể dùng text.

**Cấu hình `logback-spring.xml`:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>

    <!-- ============================================ -->
    <!-- LOCAL profile: text format, dễ đọc            -->
    <!-- ============================================ -->
    <springProfile name="local | test">
        <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
            <encoder>
                <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %X{traceId} %logger{36} - %msg%n</pattern>
            </encoder>
        </appender>
        <root level="INFO">
            <appender-ref ref="CONSOLE"/>
        </root>
    </springProfile>

    <!-- ============================================ -->
    <!-- DEV / STAGING / PROD: JSON format             -->
    <!-- ============================================ -->
    <springProfile name="dev | staging | prod">
        <appender name="JSON_CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
            <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
                <providers>
                    <timestamp>
                        <timeZone>UTC</timeZone>
                    </timestamp>
                    <version/>
                    <logLevel/>
                    <loggerName/>
                    <threadName/>
                    <message/>
                    <mdc/>                    <!-- ★ traceId, userId, tenantId... -->
                    <arguments/>
                    <stackTrace/>
                    <pattern>
                        <pattern>
                            {
                              "service": "${SERVICE_NAME:-unknown}",
                              "env": "${SPRING_PROFILES_ACTIVE:-unknown}",
                              "host": "${HOSTNAME}"
                            }
                        </pattern>
                    </pattern>
                </providers>
            </encoder>
        </appender>

        <!-- File appender để ship qua Filebeat/Fluentd -->
        <appender name="JSON_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
            <file>logs/${SERVICE_NAME}.log</file>
            <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
                <fileNamePattern>logs/${SERVICE_NAME}.%d{yyyy-MM-dd}.%i.log.gz</fileNamePattern>
                <maxFileSize>100MB</maxFileSize>
                <maxHistory>30</maxHistory>
                <totalSizeCap>10GB</totalSizeCap>
            </rollingPolicy>
            <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
                <providers>
                    <timestamp/>
                    <logLevel/>
                    <loggerName/>
                    <message/>
                    <mdc/>
                    <stackTrace/>
                </providers>
            </encoder>
        </appender>

        <!-- Audit log riêng (compliance) -->
        <appender name="AUDIT_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
            <file>logs/audit-${SERVICE_NAME}.log</file>
            <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
                <fileNamePattern>logs/audit-${SERVICE_NAME}.%d{yyyy-MM-dd}.log.gz</fileNamePattern>
                <maxHistory>365</maxHistory>
            </rollingPolicy>
            <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
                <providers>
                    <timestamp/>
                    <logLevel/>
                    <loggerName/>
                    <message/>
                    <mdc/>
                    <arguments/>
                </providers>
            </encoder>
        </appender>

        <!-- Logger riêng cho audit -->
        <logger name="AUDIT" level="INFO" additivity="false">
            <appender-ref ref="AUDIT_FILE"/>
            <appender-ref ref="JSON_CONSOLE"/>
        </logger>

        <!-- Logger riêng cho performance -->
        <logger name="PERFORMANCE" level="INFO" additivity="false">
            <appender-ref ref="JSON_FILE"/>
        </logger>

        <root level="INFO">
            <appender-ref ref="JSON_CONSOLE"/>
            <appender-ref ref="JSON_FILE"/>
        </root>
    </springProfile>
</configuration>
```

#### 1.6.3 MDC Keys bắt buộc (Mandatory Context Fields)

Mọi log line PHẢI chứa các MDC keys sau:

| MDC Key | Mô tả | Nguồn |
|---------|-------|-------|
| `trace_id` | W3C Trace ID (UUID) | Từ upstream (gateway) hoặc tự sinh |
| `span_id` | W3C Span ID | Micrometer Tracing |
| `user_id` | User đang thao tác | SecurityContext |
| `tenant_id` | Tenant/Org | SecurityContext / JWT claim |
| `request_method` | GET / POST / ... | Servlet filter |
| `request_path` | /api/v1/employees | Servlet filter |
| `service_name` | hrm, erp, iam... | application.yml |
| `env` | local / dev / staging / prod | Spring profile |

#### 1.6.4 Correlation ID Filter

```java
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorrelationIdFilter extends OncePerRequestFilter {

    private static final String TRACE_HEADER = "X-Trace-Id";
    private static final String SPAN_HEADER = "X-Span-Id";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain chain) throws ServletException, IOException {
        try {
            String traceId = headerOrNew(request, TRACE_HEADER);
            String spanId = headerOrNew(request, SPAN_HEADER);

            MDC.put("trace_id", traceId);
            MDC.put("span_id", spanId);
            MDC.put("request_method", request.getMethod());
            MDC.put("request_path", request.getRequestURI());
            MDC.put("user_id", safeGetCurrentUserId());
            MDC.put("tenant_id", safeGetCurrentTenantId());

            response.setHeader(TRACE_HEADER, traceId);
            chain.doFilter(request, response);
        } finally {
            MDC.clear();   // ★ Quan trọng: clear để tránh leak sang thread pool
        }
    }

    private String headerOrNew(HttpServletRequest req, String header) {
        String value = req.getHeader(header);
        return (value == null || value.isBlank()) ? UUID.randomUUID().toString() : value;
    }
}
```

#### 1.6.5 Access Log (HTTP Request/Response)

```java
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger("ACCESS");

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain chain) throws ServletException, IOException {
        long startNanos = System.nanoTime();
        try {
            chain.doFilter(request, response);
        } finally {
            long durationMs = (System.nanoTime() - startNanos) / 1_000_000;
            int status = response.getStatus();

            // ★ Log access với đầy đủ MDC
            if (status >= 500) {
                log.error("HTTP {} {} status={} latency_ms={}",
                    request.getMethod(), request.getRequestURI(), status, durationMs);
            } else if (status >= 400) {
                log.warn("HTTP {} {} status={} latency_ms={}",
                    request.getMethod(), request.getRequestURI(), status, durationMs);
            } else {
                log.info("HTTP {} {} status={} latency_ms={}",
                    request.getMethod(), request.getRequestURI(), status, durationMs);
            }

            // ★ Slow request warning
            if (durationMs > 1000) {
                LoggerFactory.getLogger("PERFORMANCE")
                    .warn("Slow API: {} {} took {}ms",
                        request.getMethod(), request.getRequestURI(), durationMs);
            }
        }
    }
}
```

#### 1.6.6 Audit Log (Business Events)

**Audit log PHẢI được lưu vào database** (audit table) để đảm bảo compliance — file log chỉ là phụ.

```java
@Component
@RequiredArgsConstructor
public class AuditLogger {

    private static final Logger log = LoggerFactory.getLogger("AUDIT");
    private final AuditLogRepository auditRepo;

    public void record(AuditEvent event) {
        // 1. Ghi DB (bắt buộc)
        AuditLogEntity entity = AuditLogEntity.builder()
            .eventId(event.getEventId() != null ? event.getEventId() : UUID.randomUUID().toString())
            .traceId(MDC.get("trace_id"))
            .tenantId(MDC.get("tenant_id"))
            .userId(MDC.get("user_id"))
            .action(event.getAction())
            .entityType(event.getEntityType())
            .entityId(event.getEntityId())
            .before(safeToJson(event.getBefore()))
            .after(safeToJson(event.getAfter()))
            .ipAddress(MDC.get("client_ip"))
            .userAgent(MDC.get("user_agent"))
            .timestamp(Instant.now())
            .build();
        auditRepo.save(entity);

        // 2. Ghi file log (cho log aggregation)
        log.info("audit action={} entity={}:{} actor={}",
            event.getAction(), event.getEntityType(), event.getEntityId(),
            MDC.get("user_id"));
    }
}
```

**Audit table schema (Flyway migration):**

```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID NOT NULL UNIQUE,
    trace_id VARCHAR(64),
    tenant_id VARCHAR(64),
    user_id VARCHAR(64) NOT NULL,
    action VARCHAR(100) NOT NULL,        -- EMPLOYEE_CREATED, ORDER_UPDATED, ...
    entity_type VARCHAR(100) NOT NULL,   -- Employee, Order, ...
    entity_id VARCHAR(64),
    before JSONB,                        -- Snapshot trước (cho UPDATE/DELETE)
    after JSONB,                         -- Snapshot sau
    ip_address VARCHAR(64),
    user_agent VARCHAR(512),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_tenant_user_time ON audit_logs(tenant_id, user_id, timestamp DESC);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_action_time ON audit_logs(action, timestamp DESC);
```

#### 1.6.7 Performance Log (Slow Query / Slow API)

```java
@Aspect
@Component
@RequiredArgsConstructor
public class PerformanceLoggingAspect {

    private static final Logger perfLog = LoggerFactory.getLogger("PERFORMANCE");
    private static final long SLOW_API_MS = 1000;
    private static final long SLOW_QUERY_MS = 500;

    @Around("execution(* com.cachesol.platform.*.application.controller..*(..))")
    public Object logControllerPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.nanoTime();
        try {
            return joinPoint.proceed();
        } finally {
            long ms = (System.nanoTime() - start) / 1_000_000;
            if (ms > SLOW_API_MS) {
                perfLog.warn("Slow API: {}.{} took {}ms",
                    joinPoint.getSignature().getDeclaringTypeName(),
                    joinPoint.getSignature().getName(), ms);
            }
        }
    }

    @Around("execution(* org.springframework.data.repository.Repository+.*(..))")
    public Object logRepositoryPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.nanoTime();
        try {
            return joinPoint.proceed();
        } finally {
            long ms = (System.nanoTime() - start) / 1_000_000;
            if (ms > SLOW_QUERY_MS) {
                perfLog.warn("Slow query: {}.{} took {}ms sql_hint={}",
                    joinPoint.getSignature().getDeclaringTypeName(),
                    joinPoint.getSignature().getName(), ms, "check_index");
            }
        }
    }
}
```

#### 1.6.8 Log Levels chuẩn

| Tình huống | Level | Ví dụ |
|------------|-------|-------|
| HTTP 2xx | INFO | `API success: GET /employees 200 45ms` |
| HTTP 4xx (business error) | WARN | `Business violation: email already exists` |
| HTTP 5xx (system error) | ERROR | `Unhandled exception: NullPointerException ...` |
| Slow API (>1s) | WARN | `Slow API: POST /orders took 2340ms` |
| Slow query (>500ms) | WARN | `Slow query: findAllByStatus took 850ms` |
| Auth fail | WARN | `Auth fail: invalid token userId=xxx` |
| Permission denied | WARN | `Permission denied: user x lacks role y` |
| Suspicious activity | ERROR | `Brute force detected: 50 failed logins in 1min` |
| Degraded mode | WARN | `Cache miss fallback to DB for key=xxx` |
| Scheduled job success | INFO | `Job employee-sync completed: 1000 records` |
| Scheduled job fail | ERROR | `Job employee-sync failed at step 2` |

#### 1.6.9 Không được log

> ⛔ **CẤM** log các thông tin nhạy cảm sau (PII, secrets):
> - Mật khẩu, password hash, OTP
> - Số CMND/CCCD, số tài khoản ngân hàng đầy đủ
> - Token, JWT, API key, refresh token
> - Thông tin thẻ tín dụng
> - Email/SĐT (khi không cần thiết — chỉ log khi debug có kiểm soát)
>
> Sử dụng **masking** khi cần log: `email=ng***@example.com`, `phone=****5678`

#### 1.6.10 Checklist logging khi review PR

- [ ] Mọi Controller có log access (start/success/fail)
- [ ] Mọi business mutation (create/update/delete) có audit log vào DB
- [ ] Mọi external call (HTTP/Kafka) có log request/response
- [ ] Slow query / slow API được log ở level WARN
- [ ] MDC có đủ `trace_id`, `user_id`, `tenant_id`
- [ ] Không log password, token, PII
- [ ] Exception có log đầy đủ stack trace + context
- [ ] Log ở format JSON ở môi trường dev/staging/prod

---

### 1.7 Shared Common Package

**Package dùng chung cho tất cả microservice** — nằm trong `src/backend/shared/`:

```text
src/backend/shared/
├── shared-common/                ← com.cachesol.platform.shared.common
│   └── src/main/java/com/cachesol/platform/shared/common/
│       ├── api/
│       │   ├── ApiClient.java
│       │   ├── PageRequest.java
│       │   └── PageResponse.java
│       ├── dto/
│       │   ├── BaseDTO.java
│       │   └── AuditDTO.java
│       ├── exception/
│       │   ├── BusinessException.java
│       │   ├── ResourceNotFoundException.java
│       │   └── ErrorCode.java
│       └── util/
│           ├── DateUtils.java
│           ├── StringUtils.java
│           ├── MaskUtils.java           # ★ PII masking
│           └── ValidationUtils.java
│
├── shared-messaging/             ← com.cachesol.platform.shared.messaging
│   └── src/main/java/com/cachesol/platform/shared/messaging/
│       ├── event/
│       │   ├── BaseEvent.java
│       │   └── EventEnvelope.java
│       ├── schema/                   # Kafka schema definitions
│       └── audit/
│           ├── AuditEvent.java
│           └── AuditLogEntity.java
│
└── shared-security/              ← com.cachesol.platform.shared.security
    └── src/main/java/com/cachesol/platform/shared/security/
        ├── SecurityContext.java
        ├── JwtUtils.java
        └── filter/
            └── SecurityMdcFilter.java  # ★ Inject user_id, tenant_id vào MDC
```

**Các module này được publish lên internal Maven repository và import vào từng microservice:**

```xml
<!-- pom.xml của mỗi microservice -->
<dependency>
    <groupId>com.cachesol.platform</groupId>
    <artifactId>shared-common</artifactId>
    <version>${platform.version}</version>
</dependency>
<dependency>
    <groupId>com.cachesol.platform</groupId>
    <artifactId>shared-messaging</artifactId>
    <version>${platform.version}</version>
</dependency>
<dependency>
    <groupId>com.cachesol.platform</groupId>
    <artifactId>shared-security</artifactId>
    <version>${platform.version}</version>
</dependency>
```

---

## 2. Frontend - Mono-repo Workspace Structure

### 2.1 Tổng quan Mô hình

**Quan trọng:** Frontend KHÔNG phải là web app độc lập. Đây là **mono-repo workspace** với:
- **Host App / Shell:** DUY NHẤT có `index.html` + `main.tsx` (chạy thực tế)
- **Mini Apps:** Là **LIBRARY/PACKAGE** được Shell nhúng vào runtime
- **Shared Libraries:** Dùng chung cho nhiều mini app

Xem chi tiết tại: [`MINI-APP-ARCHITECTURE.md`](MINI-APP-ARCHITECTURE.md)

### 2.2 Vị trí Frontend Workspace

```text
src/frontend/                     ★ Frontend mono-repo nằm trong src/
├── package.json                  ← Root workspace config (workspaces)
│
├── apps/                         ← HOST APPS (Shell) - DUY NHẤT có index.html
│   └── web-shell/                # Web container app
│       ├── index.html           ★ Chỉ shell có file này
│       ├── src/
│       │   ├── main.tsx         ★ Chỉ shell có file này
│       │   ├── App.tsx          ← Load mini apps
│       │   ├── shell/           ← Shell-specific code
│       │   ├── routes/          ← Global routes (RequireAuth)
│       │   ├── layouts/         ← MainLayout
│       │   ├── pages/           ← Shell pages (Login, Dashboard, 404)
│       │   ├── stores/          ← authStore, appStore, miniAppStore
│       │   ├── hooks/
│       │   ├── i18n/            ← Shell i18n
│       │   └── styles/
│       │   └── vite.config.ts
│
├── mini-apps/                    ← MINI APPS - Là LIBRARY
│   ├── hrm-mini-app/
│   ├── erp-mini-app/
│   └── sales-mini-app/
│
├── shared/                       ← SHARED LIBRARIES
│   ├── shared-ui/
│   ├── shared-types/
│   └── shared-api/
│
└── design-system/                ← ★ Design System CODE library (@cachesol/design-system)
                                    // DOCS markdown tương ứng ở /design-system/ ở root
```

### 2.3 Phân biệt Web App vs Mini App

| Đặc điểm | Web App (❌) | Mini App Library (✅) |
|---------|-------------|----------------------|
| Có `index.html` | ✅ Có | ❌ KHÔNG |
| Có `main.tsx` entry | ✅ Có | ❌ KHÔNG |
| Có `index.ts` export | ❌ | ✅ Có |
| Có `manifest.ts` | ❌ | ✅ Có |
| Vite build mode | App | Library (`build.lib`) |
| Routing | Tự đăng ký | Qua manifest |
| Authentication | Tự xử lý | Dùng shell's auth |
| Deploy | URL riêng | Nhúng vào shell |

### 2.4 Cấu trúc Mini App (Library)

```text
src/frontend/mini-apps/{name}-mini-app/
├── src/
│   │
│   ├── index.ts                  ★ Public API (Shell sẽ import default)
│   │                                Export: manifest, pages, hooks, types
│   │
│   ├── manifest.ts               ★ Metadata cho Shell
│   │                                - routes[], menu[], permissions[], i18n{}, api{}
│   │
│   ├── features/                 ← Feature modules
│   │   └── {feature}/
│   │       ├── api/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── pages/            ← Page components (lazy loaded)
│   │       ├── types/
│   │       └── utils/
│   │
│   ├── types/                    ← Mini app specific types
│   │
│   └── i18n/
│       ├── locales/{vi,en}.json
│       └── index.ts
│
├── package.json                  ← name: "@cachesol/{name}-mini-app"
├── vite.config.ts                ← build.lib config
├── tsconfig.json
└── README.md
```

### 2.5 Mini App `index.ts` - Public API

```typescript
// src/index.ts - PUBLIC API
import type { MiniAppPackage } from '@cachesol/shared-types';
import { manifest } from './manifest';

const MiniApp: MiniAppPackage = {
  manifest,
  lifecycle: {
    onMount: () => console.log('Mounted'),
    onUnmount: () => console.log('Unmounted'),
  },
};

export default MiniApp;
export { manifest };

// Public exports cho Shell có thể dùng trực tiếp
export { EmployeeListPage } from './features/employees/pages/EmployeeListPage';
export { EmployeeDetailPage } from './features/employees/pages/EmployeeDetailPage';

export type * from './types/employee.types';
```

### 2.6 Mini App `manifest.ts`

```typescript
// src/manifest.ts
import type { MiniAppManifest } from '@cachesol/shared-types';

export const manifest: MiniAppManifest = {
  id: 'hrm-mini-app',
  name: 'HRM',
  version: '1.0.0',

  routes: [
    {
      path: '/employees',
      title: 'Quản lý nhân viên',
      component: () => import('./features/employees/pages/EmployeeListPage'),
      layout: 'main',
      permissions: ['employee:read'],
    },
  ],

  menu: [
    {
      key: 'employees',
      labelKey: 'menu.employees',
      icon: 'TeamOutlined',
      path: '/employees',
      order: 10,
    },
  ],

  permissions: ['employee:read', 'employee:write'],

  i18n: {
    vi: () => import('./i18n/locales/vi.json'),
    en: () => import('./i18n/locales/en.json'),
  },
};
```

### 2.7 Mini App `package.json`

```json
{
  "name": "@cachesol/hrm-mini-app",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./manifest": {
      "types": "./dist/manifest.d.ts",
      "import": "./dist/manifest.mjs"
    }
  },
  "peerDependencies": {
    "react": "^18.2.0",
    "antd": "^5.0.0",
    "@tanstack/react-query": "^5.0.0"
  },
  "dependencies": {
    "@cachesol/shared-ui": "workspace:*",
    "@cachesol/shared-types": "workspace:*"
  }
}
```

### 2.8 Mini App `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'antd', '@tanstack/react-query'],
    },
  },
});
```

---

## 3. Shared Library Structure

### 3.1 Shared Common (`shared-common`) — Backend

```text
src/backend/shared/shared-common/
└── src/main/java/com/cachesol/platform/shared/common/
    ├── api/
    │   ├── ApiClient.java
    │   ├── PageRequest.java
    │   └── PageResponse.java
    ├── dto/
    │   ├── BaseDTO.java
    │   └── AuditDTO.java
    ├── exception/
    │   ├── BusinessException.java
    │   ├── ResourceNotFoundException.java
    │   └── ErrorCode.java
    └── util/
        ├── DateUtils.java
        ├── StringUtils.java
        ├── MaskUtils.java               # ★ PII masking (dùng trong logging)
        └── ValidationUtils.java
```

### 3.2 Shared UI (`@cachesol/shared-ui`) — Frontend

```text
src/frontend/shared/shared-ui/
├── src/
│   ├── components/
│   │   ├── DataTable.tsx
│   │   ├── FormBuilder.tsx
│   │   ├── PageHeader.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── StatusTag.tsx
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   └── usePagination.ts
│   ├── utils/formatters/
│   │   ├── formatDate.ts
│   │   ├── formatCurrency.ts
│   │   └── formatNumber.ts
│   ├── theme/
│   │   ├── tokens.ts
│   │   └── antd-theme.ts
│   ├── types/
│   └── index.ts
├── package.json              ← name: "@cachesol/shared-ui"
└── vite.config.ts            ← build.lib config
```

### 3.3 Shared Types (`@cachesol/shared-types`) — Frontend

```text
src/frontend/shared/shared-types/
├── src/
│   ├── mini-app.ts           ← MiniAppManifest, MiniAppRoute types
│   ├── api.ts                ← ApiResponse, PageResponse types
│   ├── auth.ts               ← AuthUser, AuthState types
│   └── index.ts
├── package.json              ← name: "@cachesol/shared-types"
└── tsconfig.json
```

### 3.4 Shared API (`@cachesol/shared-api`) — Frontend

```text
src/frontend/shared/shared-api/
├── src/
│   ├── client/
│   │   ├── axios-instance.ts ← createApiClient, apiClient
│   │   └── query-client.ts   ← createQueryClient (React Query)
│   └── index.ts
├── package.json              ← name: "@cachesol/shared-api"
└── tsconfig.json
```

### 3.5 Shell App - Host Application

**DUY NHẤT** shell có `index.html` và `main.tsx` ở root:

```text
src/frontend/apps/web-shell/
├── index.html                ★ Web app entry HTML
├── src/
│   ├── main.tsx              ★ Application bootstrap (DUY NHẤT)
│   ├── App.tsx               ← Load mini apps
│   │
│   ├── shell/                ← Shell-specific code
│   │   ├── buildRouter.tsx   ← Dynamic router từ mini app manifests
│   │   └── ...
│   │
│   ├── routes/               ← Global route guards
│   │   └── RequireAuth.tsx
│   │
│   ├── layouts/              ← Global layout
│   │   └── MainLayout.tsx
│   │
│   ├── pages/                ← Shell-only pages
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── stores/               ← Global stores
│   │   ├── authStore.ts      ← Authentication state
│   │   ├── appStore.ts       ← App UI state
│   │   └── miniAppStore.ts   ← Quản lý mini apps đã register
│   │
│   ├── hooks/
│   │   └── useI18n.ts        ← Load i18n từ mini apps
│   │
│   ├── i18n/                 ← Global i18n
│   │   ├── index.ts
│   │   └── locales/
│   │
│   └── styles/
│
├── package.json
├── vite.config.ts            ← App build (NOT lib)
└── tsconfig.json
```

---

## 4. Platform Services

Các platform service có cấu trúc tương tự backend microservice, nằm trong `src/backend/platform/`:

```text
src/backend/platform/
├── iam/                       # Identity & Access Management
│   └── src/main/java/com/cachesol/platform/iam/
│       ├── application/
│       ├── domain/
│       ├── infrastructure/
│       │   └── logging/       # ★ Tuân thủ §1.6 Logging
│       └── config/
├── social-integration/        # Social Integration Service (notifications + social channels + posts + pages + analytics)
├── workflow/                  # Workflow Engine
├── file/                      # File Management
└── search/                    # Search Service
```

---

## 5. Database Naming Conventions

### 5.1 Table Naming

| Type | Convention | Example |
|------|-----------|---------|
| Table | `snake_case`, plural | `employees`, `employee_addresses` |
| Join Table | `{table1}_{table2}` | `employee_roles` |
| Audit Table | `{table}_audit` | `employee_audit` |
| Audit Log Table | (platform-wide) | `audit_logs` |

### 5.2 Column Naming

| Type | Convention | Example |
|------|-----------|---------|
| Primary Key | `{table}_id` | `employee_id` |
| Foreign Key | `{ref_table}_id` | `department_id` |
| Standard Column | `snake_case` | `first_name`, `created_at` |
| Boolean | `is_{condition}` | `is_active`, `is_deleted` |
| Audit columns | `created_at`, `updated_at`, `created_by`, `updated_by` | |

---

## 6. API Versioning

### 6.1 URL Structure

```
/api/v1/{resource}
/api/v1/{resource}/{id}
/api/v1/{resource}/{id}/{sub-resource}
```

### 6.2 Example

```
GET    /api/v1/employees              # List employees
POST   /api/v1/employees              # Create employee
GET    /api/v1/employees/{id}         # Get employee
PUT    /api/v1/employees/{id}         # Update employee
DELETE /api/v1/employees/{id}         # Delete employee
GET    /api/v1/employees/{id}/salaries # Get salaries
```

---

## 7. Event/Messaging Naming

### 7.1 Kafka Topic Naming

```
{domain}.{service}.{entity}.{action}

VD:
- hrm.employee.created
- hrm.employee.updated
- erp.order.completed
- iam.user.password-changed
```

### 7.2 Event Schema

```json
{
  "eventId": "uuid",
  "eventType": "EmployeeCreated",
  "eventSource": "hrm-service",
  "eventTime": "2024-01-15T10:30:00Z",
  "traceId": "uuid",          // ★ Từ MDC, để trace xuyên service
  "data": {
    "employeeId": "uuid",
    "firstName": "Nguyen",
    "lastName": "Van A"
  }
}
```

---

## 8. Cấu trúc Docker

### 8.1 Backend Microservice

```dockerfile
# Dockerfile (Backend)
FROM eclipse-temurin:21-jre-alpine
COPY target/*.jar app.jar
# ★ Export service name cho logback-spring.xml
ENV SERVICE_NAME=hrm-service
ENV SPRING_PROFILES_ACTIVE=prod
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### 8.2 Frontend Mini App

```dockerfile
# Dockerfile (Frontend)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 9. Tổng kết cấu trúc Source Code

```text
src/                                    ★ Source code duy nhất
│
├── backend/
│   ├── applications/                   ← Microservices nghiệp vụ
│   │   ├── hrm/
│   │   ├── erp/
│   │   ├── sales/
│   │   └── finance/
│   ├── platform/                       ← Microservices nền tảng (CHỈ 8)
│   │   ├── iam/
│   │   ├── platform-registry/
│   │   ├── tenant-manager/
│   │   ├── feature-flag/
│   │   ├── master-data/
│   │   ├── social-integration/
│   │   ├── workflow/
│   │   └── approval/
│   └── shared/                         ← Backend shared libs
│       ├── shared-common/
│       ├── shared-messaging/
│       └── shared-security/
│
└── frontend/                           ← Frontend mono-repo
    ├── apps/
    │   └── web-shell/
    ├── mini-apps/
    │   ├── hrm-mini-app/
    │   ├── erp-mini-app/
    │   └── sales-mini-app/
    ├── shared/
    │   ├── shared-ui/
    │   ├── shared-types/
    │   └── shared-api/
    └── design-system/                        # @cachesol/design-system (code); DOCS ở /design-system/ root
```

**Mọi microservice backend đều phải tuân thủ [§1.6 Logging](#16-logging--quan-trọng).**

---

## Liên kết

- [MINI-APP-ARCHITECTURE.md](MINI-APP-ARCHITECTURE.md) - Chi tiết về mô hình Mini App
- [Architecture Principles](governance/architecture/principles.md)
- [Backend Standards](governance/architecture/standards/backend.md)
- [Frontend Standards](governance/architecture/standards/frontend.md)
- [Database Naming](governance/database/naming.md)
- [API Standards](governance/api/naming.md)
- [Design System](../design-system/README.md)
