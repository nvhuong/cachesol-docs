# CacheSol Enterprise Platform — Architecture v3

> **Phiên bản:** v3 — Multi-tenant chuẩn hoá, giảm platform services tối đa.

## 1. Tổng quan

Enterprise Platform là hệ sinh thái microservice phục vụ **multi-tenant SaaS**:

- **Mỗi khách hàng (tenant) = 1 công ty / tập đoàn** — có thể có nhiều công ty con, chi nhánh, trung tâm, phòng ban, chức danh.
- **Mỗi tenant có dữ liệu cô lập** — schema-per-tenant (PostgreSQL).
- **Backend tối giản** — 1 platform service + 5 platform services nghiệp vụ nền + các applications nghiệp vụ.
- **IAM dùng Keycloak** — login/register/LDAP/SSO/OAuth2 qua Keycloak; IAM service chỉ là thin bridge.

## 2. Multi-tenant Strategy

### Schema-per-tenant

```
┌─────────────────────────────────────────────────────────────────────┐
│ PostgreSQL Server                                                    │
│                                                                       │
│   database: cachesol_platform                                       │
│   ├── schema: public                                                │
│   │   ├── tenants                       ← tenant registry           │
│   │   ├── flyway_schema_history         ← migration tracking        │
│   │   ├── keycloak_buckets/...          ← Keycloak internal         │
│   │   ├── tenant_<slug>_iam             ← IAM data per tenant       │
│   │   ├── tenant_<slug>_config          ← config per tenant         │
│   │   ├── tenant_<slug>_master_data     ← danh mục per tenant       │
│   │   └── tenant_<slug>_notif           ← notification log per tenant│
│   │                                                                    │
│   └── database: cachesol_<tenant_slug>   ← (OPTIONAL, large tenants)│
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Mặc định:** dùng multi-schema trong 1 database. **Large tenants** (> 500GB) có thể move sang database riêng mà không ảnh hưởng code.

### Tenant registry (`public.tenants`)

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | |
| `slug` | VARCHAR(50) UNIQUE | `acme`, `globex`, `initech` |
| `schema_prefix` | VARCHAR(50) | `tenant_acme` |
| `display_name` | VARCHAR(255) | "ACME Corporation" |
| `plan` | VARCHAR(20) | `trial`, `standard`, `enterprise` |
| `status` | VARCHAR(20) | `active`, `suspended`, `offboarding` |
| `created_at` | TIMESTAMPTZ | |
| `offboarded_at` | TIMESTAMPTZ NULL | |

### Tenant resolution flow

```
HTTP Request
  ↓ Headers: X-Tenant-Id: acme (hoặc Host: acme.platform.com)
  ↓
TenantContextFilter (shared-security)
  ├── 1. Extract tenant slug từ header/subdomain
  ├── 2. Lookup tenants table → lấy schema_prefix
  ├── 3. Set TenantContext.setSchema("tenant_acme")
  ├── 4. Set HikariCP search_path cho request
  └── 5. Inject vào MDC (logging)
  ↓
Controller / Service
  ↓
  TenantContext.getSchema()  → "tenant_acme"
  ↓
  Flyway migrate tất cả schemas khi deploy
```

## 3. Organization Hierarchy (per-tenant schema)

Mỗi tenant có cây tổ chức riêng (multi-tenant vì 1 công ty có thể là tập đoàn có nhiều công ty con, chi nhánh).

### Bảng `organizations`

```sql
CREATE EXTENSION IF NOT EXISTS ltree;

CREATE TABLE organizations (
    id          UUID PRIMARY KEY,
    tenant_id   UUID NOT NULL,                   -- redundancy cho query (lookup nhanh)
    code        VARCHAR(50)  NOT NULL,           -- mã định danh ngắn, unique trong tenant
    name        VARCHAR(255) NOT NULL,
    type        VARCHAR(30)  NOT NULL,           -- COMPANY | SUBSIDIARY | BRANCH | CENTER | DEPARTMENT | TEAM
    parent_id   UUID NULL REFERENCES organizations(id),
    path        LTREE        NOT NULL,           -- vd: acme.vn.hcmc.sales (ltree extension)
    level       SMALLINT     NOT NULL,           -- 0 = root
    manager_id  UUID NULL,                       -- FK → employees (nullable khi mới tạo)
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    metadata    JSONB        NOT NULL DEFAULT '{}'::jsonb,
    created_at  TIMESTAMPTZ  NOT NULL,
    updated_at  TIMESTAMPTZ  NOT NULL,
    UNIQUE (tenant_id, code)
);
CREATE INDEX idx_org_path_gist ON organizations USING GIST (path);
CREATE INDEX idx_org_parent    ON organizations(parent_id);
CREATE INDEX idx_org_tenant    ON organizations(tenant_id);
```

**Type enum (tự khai báo theo tenant):**
- `COMPANY` — root (level 0)
- `SUBSIDIARY` — công ty con (level 1+)
- `BRANCH` — chi nhánh
- `CENTER` — trung tâm
- `DEPARTMENT` — phòng ban
- `TEAM` — nhóm

### Bảng `job_titles` — chức danh tự khai báo

Mỗi tenant có thể khai báo chức danh riêng (CEO, CFO, Trưởng phòng, Nhân viên, ...).

```sql
CREATE TABLE job_titles (
    id          UUID PRIMARY KEY,
    tenant_id   UUID NOT NULL,
    code        VARCHAR(50) NOT NULL,            -- mã nội bộ
    name        VARCHAR(255) NOT NULL,           -- tên hiển thị (vd: "Trưởng phòng Kế toán")
    level       SMALLINT NOT NULL,               -- thứ bậc, dùng cho approval routing
    is_leader   BOOLEAN NOT NULL DEFAULT FALSE,  -- có quyền duyệt không
    scope_org_id UUID NULL REFERENCES organizations(id),  -- phạm vi áp dụng (NULL = toàn tenant)
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL,
    UNIQUE (tenant_id, code)
);
```

### Bảng `employee_assignments` — 1 nhân viên, nhiều vị trí

```sql
CREATE TABLE employee_assignments (
    id           UUID PRIMARY KEY,
    tenant_id    UUID NOT NULL,
    employee_id  UUID NOT NULL REFERENCES employees(id),
    org_id       UUID NOT NULL REFERENCES organizations(id),
    job_title_id UUID NOT NULL REFERENCES job_titles(id),
    is_primary   BOOLEAN NOT NULL DEFAULT FALSE, -- 1 assignment chính
    start_date   DATE NOT NULL,
    end_date     DATE NULL,
    created_at   TIMESTAMPTZ NOT NULL,
    UNIQUE (employee_id, org_id, job_title_id, start_date)
);
```

→ 1 nhân viên có thể kiêm nhiều chức danh ở nhiều org khác nhau, vd: "Giám đốc chi nhánh HCM" + "Thành viên HĐQT" + "Trưởng phòng KD".

## 4. Backend — Platform Services

> **Nguyên tắc:** ít platform service nhất có thể. Mọi thứ có thể là library hoặc gộp vào application → đều KHÔNG làm service riêng.

### 4.1 Danh sách 6 platform services

| # | Service | Lý do GIỮ riêng |
|---|---------|-----------------|
| 1 | **iam** | Cần DB riêng (users_extra, app_roles), bridge tới Keycloak, expose API cho tất cả app |
| 2 | **configuration** | Cross-tenant feature flags + system params, cần API CRUD + cache invalidation |
| 3 | **master-data** | Cross-tenant lookup (country, currency, unit), nhiều app đọc, cần API CRUD + cache |
| 4 | **notification** | Đa kênh (email/SMS/push/in-app), cần retry queue, template engine, log lịch sử |
| 5 | **workflow** | BPMN-lite engine, state machine dài hơi, cần DB riêng cho process instances |
| 6 | **approval** | Ticket duyệt gắn với workflow user-tasks, lịch sử duyệt dài |

### 4.2 Các service ĐÃ XOÁ khỏi platform → gộp vào đâu

| Cũ (platform) | Mới | Cách gộp |
|---------------|-----|----------|
| `organization` | → HRM application | Bảng `organizations`, `job_titles` thuộc HRM service (mỗi tenant schema) |
| `employee` | → HRM application | Bảng `employees`, `employee_assignments` thuộc HRM |
| `customer` | → Sales application | Bảng `customers` thuộc Sales |
| `audit` | → `shared-common` library | Ghi audit event ra Kafka topic `audit.<tenant>.events` — không cần service |
| `file` | → `shared-common` library | S3/MinIO wrapper, không cần service |
| `search` | → PostgreSQL full-text + ltree | Dùng extension có sẵn, ES chỉ thêm khi cần |
| `reporting` | → Application | BI/reports trong từng app nghiệp vụ |
| `scheduler` | → `@Scheduled` Spring | Cron job in-app |
| `integration` | → Application | 3rd-party connector trong từng app |

### 4.3 Sơ đồ kiến trúc

```
┌──────────────────────────────────────────────────────────────────┐
│                     API Gateway (per tenant subdomain)            │
└──────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┘
       │         │         │         │         │         │
       ▼         ▼         ▼         ▼         ▼         ▼
   ┌───────┐ ┌─────────┐ ┌────────┐ ┌─────────┐ ┌────────┐ ┌──────────┐
   │  IAM  │ │ Config  │ │ Master │ │ Notif   │ │Workflow│ │ Approval │
   │(Keycl)│ │ Flags   │ │ Data   │ │         │ │ Engine │ │          │
   └───┬───┘ └────┬────┘ └───┬────┘ └────┬────┘ └────┬───┘ └────┬─────┘
       │          │          │           │           │          │
       └──────────┴──────────┴───────────┴───────────┴──────────┘
                                  │       │
                                  ▼       ▼
                            ┌──────────────────┐
                            │   Applications   │
                            │ HRM/ERP/Sales/... │
                            └────────┬─────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │  Kafka (events)  │
                            └──────────────────┘
```

## 5. IAM — Keycloak-backed

### 5.1 Tại sao dùng Keycloak

- **Login, Register, Forgot/Reset password, Email verify** → Keycloak built-in
- **LDAP / Active Directory sync** → Keycloak User Federation
- **OAuth2 / OIDC / SAML SSO** → Keycloak built-in
- **MFA (TOTP, WebAuthn)** → Keycloak built-in
- **Social login (Google, Facebook)** → Keycloak Identity Brokering
- **Password policy, brute-force protection** → Keycloak built-in

→ Không phải tự build lại những thứ này.

### 5.2 IAM Service — thin bridge

IAM service KHÔNG quản lý credential/identity. Nó chỉ:

```
┌───────────────────────────────────────────────────────────────┐
│  Keycloak (container)                                          │
│  - users, credentials, roles, groups                          │
│  - login flows, MFA, LDAP sync                                │
│  - OAuth2/OIDC token issuer                                   │
└──────────────────┬────────────────────────────────────────────┘
                   │  Verify JWT (JWK public key)
                   │  Webhook SPI (user lifecycle events)
                   ▼
┌───────────────────────────────────────────────────────────────┐
│  IAM Service (Spring Boot)                                     │
│                                                                │
│  DB: schema `public` (cross-tenant metadata)                  │
│  ├── users_extra                                              │
│  │     (keycloak_user_id, tenant_id, default_language,        │
│  │      avatar_url, status, last_login_at, ...)               │
│  ├── user_app_roles                                           │
│  │     (keycloak_user_id, tenant_id, role_code,               │
│  │      org_scope_path, valid_from, valid_to)                 │
│  ├── ldap_sync_log                                            │
│  └── keycloak_webhook_events (audit)                          │
│                                                                │
│  API:                                                          │
│  ├── GET  /api/v1/users/me                                    │
│  ├── GET  /api/v1/users/{id}                                  │
│  ├── GET  /api/v1/users (tenant-scoped)                       │
│  ├── GET  /api/v1/permissions (current user's effective roles)│
│  ├── POST /api/v1/users (admin create → call Keycloak API)   │
│  ├── POST /api/v1/users/{id}/roles                            │
│  ├── POST /webhooks/keycloak  (nhận event từ Keycloak SPI)   │
│  └── GET  /api/v1/tenants/{slug}/users (cross-tenant admin)   │
└───────────────────────────────────────────────────────────────┘
```

### 5.3 JWT verification (shared-security)

```java
@Component
public class KeycloakJwtDecoder {
    private final RSAPublicKey publicKey;  // load từ Keycloak JWKS endpoint

    public Jwt verify(String token) {
        // 1. Verify signature với publicKey
        // 2. Verify issuer (iss == keycloak realm URL)
        // 3. Verify audience (aud == this-app-client-id)
        // 4. Extract claims: sub (keycloak user id), tenant_id, realm_access.roles
        return decoded;
    }
}
```

### 5.4 Tenant claim trong JWT

Keycloak hỗ trợ **custom protocol mapper** — inject `tenant_id` vào JWT khi user login từ tenant subdomain.

```
Host: acme.platform.com → Keycloak login → JWT claim: { "tenant_id": "acme", ... }
Host: globex.platform.com → JWT claim: { "tenant_id": "globex", ... }
```

→ Frontend không cần truyền `X-Tenant-Id`; tenant tự xác định từ host. Cờ `X-Tenant-Id` chỉ dùng cho internal API/CLI.

### 5.5 RBAC + Org-scope

```sql
-- user_app_roles (per-tenant)
CREATE TABLE user_app_roles (
    id          UUID PRIMARY KEY,
    tenant_id   UUID NOT NULL,
    keycloak_user_id UUID NOT NULL,
    role_code   VARCHAR(100) NOT NULL,          -- HRM_MANAGER, SALES_ADMIN, ...
    org_scope_path LTREE NULL,                  -- áp dụng trong cây tổ chức nào (NULL = toàn tenant)
    valid_from  TIMESTAMPTZ NOT NULL,
    valid_to    TIMESTAMPTZ NULL,
    granted_by  UUID NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_uar_tenant_user ON user_app_roles(tenant_id, keycloak_user_id);
```

→ 1 user có thể là `HRM_MANAGER` ở chi nhánh HCM và `SALES_ADMIN` ở chi nhánh HN cùng lúc.

## 6. Backend — Applications (nghiệp vụ)

| Application | Chứa gì |
|-------------|---------|
| **hrm** | employees, employee_assignments, organizations, job_titles, attendance, payroll, leave, recruitment, performance, training, **approval** in-app (HR workflows) |
| **erp** | inventory, procurement, production, fixed-assets |
| **sales** | customers, contacts, opportunities, orders, invoices |
| **finance** | chart-of-accounts, journal, gl, ap/ar, banking |
| **marketing** | campaigns, leads, segments, analytics |
| (tương lai) | logistics, manufacturing, healthcare, ... |

→ Mỗi app là microservice độc lập, schema riêng (`tenant_<slug>_hrm`, `tenant_<slug>_sales`, ...) hoặc gộp vào multi-schema tùy size.

## 7. Folder layout mới

```
src/backend/
├── applications/                        ← nghiệp vụ (6 services)
│   ├── hrm/        (chứa org/employee/job-title/attendance/...)
│   ├── erp/
│   ├── sales/      (chứa customer)
│   ├── finance/
│   └── marketing/
│
├── platform/                            ← nền tảng (6 services — GIẢM từ 15)
│   ├── iam/             (Keycloak-backed, thin bridge)
│   ├── configuration/   (feature flags, system params)
│   ├── master-data/     (danh mục dùng chung)
│   ├── notification/    (đa kênh, async)
│   ├── workflow/        (BPMN-lite)
│   └── approval/        (duyệt ticket)
│
└── shared/                              ← libraries (Java, không có HTTP API)
    ├── shared-common/         (audit publisher, file wrapper, tenant util, util chung)
    ├── shared-messaging/      (Kafka producer/consumer, event base classes)
    └── shared-security/       (KeycloakJwtDecoder, TenantContextFilter, @PreAuthorize)
```

## 8. Luồng dữ liệu điển hình (cross-tenant)

### User login flow

```
1. User truy cập https://acme.platform.com/login
2. Frontend redirect → Keycloak realm "acme" → login form
3. Keycloak authenticate → trả JWT (chứa tenant_id="acme", roles)
4. Frontend lưu token, gọi API: GET /api/v1/employees
5. Backend:
   a. JwtAuthFilter → verify signature, extract tenant_id từ claim
   b. TenantContextFilter → set schema = "tenant_acme"
   c. AuthorizationFilter → check role từ IAM service (cached)
   d. EmployeeController → query schema "tenant_acme".employees
6. Response trả về chỉ data của tenant acme
```

### Approval flow (cross-service)

```
1. HRM tạo đơn nghỉ phép → publish event: LeaveRequestedEvent
2. Notification service consume → gửi email/SMS cho quản lý
3. Workflow service consume → tạo process instance (BPMN: 2-step approval)
4. Workflow → tạo user task → Approval service
5. Quản lý vào web → thấy task pending → approve
6. Approval service → publish event: LeaveApprovedEvent
7. Workflow consume → complete task → next step
8. Notification consume → gửi email kết quả cho nhân viên
9. Audit (shared-common) ghi vào Kafka topic audit.<tenant>.events
```

## 9. Migration path từ v2 → v3

| Bước | Hành động |
|------|-----------|
| 1 | Spin up Keycloak container, tạo realm template |
| 2 | Viết `iam` service (thin bridge) + `shared-security` library |
| 3 | Migrate HRM → gộp organization + employee + job_title vào HRM |
| 4 | Migrate Sales → gộp customer vào Sales |
| 5 | Xoá folder `src/backend/platform/{organization,employee,customer,audit,file,search,reporting,scheduler,integration}/` |
| 6 | Tạo schema-per-tenant migration (Flyway: `flyway.tenant-schemas=tenant_*`) |
| 7 | Viết 4 service mới: `configuration`, `master-data`, `notification`, `workflow` (nếu cần ngay), `approval` |

---

**Liên kết:**
- Code structure chi tiết: [`SOURCE-CODE-STRUCTURE.md`](SOURCE-CODE-STRUCTURE.md)
- Multi-tenant schema detail: [`governance/multi-tenant.md`](governance/multi-tenant.md)
- IAM Keycloak setup: [`src/backend/platform/iam/README.md`](src/backend/platform/iam/README.md)
