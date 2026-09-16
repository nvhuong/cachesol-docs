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
│   │   └── tenant_<slug>_socialintegration ← notifications + posts + pages per tenant │
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

### 4.1 Danh sách 8 platform services

| # | Service | Lý do GIỮ riêng |
|---|---------|-----------------|
| 1 | **iam** | JWT verify, JWK cache, Keycloak webhook receiver — KHÔNG có user CRUD |
| 2 | **platform-registry** | Tenants registry, mini-apps catalog, org-root mapping, role/permission template |
| 3 | **tenant-manager** | Users (CRUD qua Keycloak Admin API), roles/permissions, user_app_roles + org_scope_path — per-tenant schema |
| 4 | **feature-flag** | Feature flags only — self-host FF4j từ GitHub (WebConsole + REST API + PostgreSQL store), scope CHỈ feature toggle (system params/tenant config gộp vào tenant-manager hoặc env) |
| 5 | **master-data** | Cross-tenant lookup (country, currency, unit), nhiều app đọc, cần API CRUD + cache |
| 6 | **social-integration** | Đa kênh: notifications + social channels + posts + pages + analytics |
| 7 | **workflow** | BPMN-lite engine, state machine dài hơi, cần DB riêng cho process instances |
| 8 | **approval** | Ticket duyệt gắn với workflow user-tasks, lịch sử duyệt dài |

### 4.2 Các service ĐÃ XOÁ khỏi platform → gộp vào đâu

| Cũ (platform) | Mới | Cách gộp |
|---------------|-----|----------|
| `organization` | → `tenant-manager` | Bảng `organizations`, `job_titles` thuộc schema `tenant_<slug>_tenantmanager` |
| `employee` | → `tenant-manager` | Bảng `employees`, `employee_assignments`, `employee_contracts` thuộc schema `tenant_<slug>_tenantmanager` |
| `customer` | → Sales application | Bảng `customers` thuộc Sales |
| `audit` | → `shared-common` library | Ghi audit event ra Kafka topic `audit.<tenant>.events` — không cần service |
| `file` | → `shared-common` library | S3/MinIO wrapper, không cần service |
| `search` | → PostgreSQL full-text + ltree | Dùng extension có sẵn, ES chỉ thêm khi cần |
| `reporting` | → Application | BI/reports trong từng app nghiệp vụ |
| `scheduler` | → `@Scheduled` Spring | Cron job in-app |
| `integration` | → Application | 3rd-party connector trong từng app |

### 4.3 Sơ đồ kiến trúc

```
┌──────────────────────────────────────────────────────────────────────────┐
│            API Gateway (per-tenant subdomain, JWT verify)                  │
│   4 prefix routing:                                                       │
│     /client-api/v1      → user JWT + RBAC                                │
│     /service-api/v1     → service JWT + scope                            │
│     /integration-api/v1 → HMAC signature                                  │
│     /public-api/v1      → no auth                                          │
└──┬───────────┬──────────┬──────┬──────┬───────┬──────┬──────┬────────┬────┘
   │           │          │      │      │       │      │      │        │
   ▼           ▼          ▼      ▼      ▼       ▼      ▼      ▼        ▼
┌──────┐ ┌──────────┐ ┌──────┐ ┌─────┐ ┌──────┐ ┌────┐ ┌────┐ ┌─────┐ ┌──────┐
│ IAM  │ │ Platform │ │Tenant│ │Conf │ │Master│ │Noti│ │Wfl │ │Appr │ │  HRM │
│(JWT) │ │ Registry │ │ Mgr  │ │ ig  │ │ Data │ │ fi │ │     │ │ oval │ │      │
└──┬───┘ └────┬─────┘ └──┬───┘ └──┬──┘ └──┬───┘ └──┬─┘ └──┬─┘ └──┬──┘ └──┬───┘
   │          │            │        │       │        │     │     │       │
   │      Keycloak API    │        │       │        │     │     │       │
   ▼          ▼            ▼        ▼       ▼        ▼     ▼     ▼       ▼
┌────────────────────────────────────────────────────────────────────────┐
│            Keycloak (1 realm / tenant)                                  │
│      users · credentials · roles · LDAP sync · SSO · MFA              │
└────────────────────────────────────────────────────────────────────────┘
   │
   └────────────────────────────────────────────────────────────────┐
                                                                ▼
                                                  ┌──────────────────┐
                                                  │   Applications   │
                                                  │ HRM/ERP/Sales/... │
                                                  └────────┬─────────┘
                                                           │
                                                           ▼
                                                  ┌──────────────────┐
                                                  │  Kafka (events)  │
                                                  └──────────────────┘
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

### 5.2 IAM Service — thin bridge (JWT verify only)

IAM service CHỈ verify JWT. Mọi user/role CRUD do **tenant-config service** đảm nhiệm (qua Keycloak Admin API).

```
┌───────────────────────────────────────────────────────────────┐
│  Keycloak (1 container, 1 realm per tenant)                   │
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
│  DB: schema `public` — chỉ lưu:                               │
│  ├── keycloak_webhook_events (audit log cho events nhận)      │
│                                                                │
│  JWK Cache: Caffeine TTL 1h                                   │
│                                                                │
│  API:                                                          │
│  ├── GET  /api/v1/keys/jwks.json  (mirror Keycloak JWKS)      │
│  ├── POST /webhooks/keycloak      (nhận event từ Keycloak SPI)│
│  └── GET  /health/live, /health/ready                          │
└───────────────────────────────────────────────────────────────┘
```

### 5.3 Platform Registry Service — tenants, mini-apps, role template

`platform-registry` quản lý metadata cross-tenant + role/permission template:

| # | Bounded Context | Schema |
|---|-----------------|--------|
| 1 | **Tenants** | `public` |
| 2 | **Mini-apps** (catalog + per-tenant enable) | `public` (catalog) + `tenant_<slug>_platformregistry` (per-tenant enable) |
| 3 | **Org-root mapping** | `tenant_<slug>_platformregistry` |
| 4 | **Role / Permission Template** (NEW) | `public` |

Service này KHÔNG có users/roles/org runtime (chuyển sang `tenant-manager`). Xem chi tiết: [`src/backend/platform/platform-registry/README.md`](src/backend/platform/platform-registry/README.md).

### 5.4 Tenant Manager Service — users, roles, cây tổ chức, employees

`tenant-manager` là "service trung tâm quản lý cấu trúc tổ chức" của từng tenant. **5 bounded contexts**, tất cả trong per-tenant schema `tenant_<slug>_tenantmanager`:

| # | Bounded Context | Vai trò |
|---|-----------------|---------|
| 1 | **Users** | CRUD qua Keycloak Admin API + users_extra |
| 2 | **Roles / Permissions** | per-tenant runtime, clone snapshot từ `platform-registry` template |
| 3 | **Organizations** | Toàn bộ cây đơn vị (ltree) — công ty mẹ → công ty con → chi nhánh → trung tâm → phòng ban → nhóm |
| 4 | **Job Titles** | Chức danh tự khai báo (level, is_leader, scope_org_id) |
| 5 | **Employees + Assignments** | Hồ sơ nhân viên, hợp đồng, employee_assignments (n-n-n) |

Xem chi tiết: [`src/backend/platform/tenant-manager/README.md`](src/backend/platform/tenant-manager/README.md).

> **HRM giờ KHÔNG còn quản lý org tree nữa.** HRM chỉ giữ nghiệp vụ HR (attendance/leave/payroll/recruitment/performance/training) và đọc data qua `service-api` của `tenant-manager`.

### 5.5 API patterns (4 prefix)

```
acme.platform.com  →  Keycloak realm "tenant-acme"   (LDAP: ldap.acme.local)
globex.platform.com → Keycloak realm "tenant-globex" (LDAP: ldap.globex.com)
initech.platform.com → Keycloak realm "tenant-initech"
```

**Tại sao 1 realm / tenant:**
- Cô lập user pool (user ACME không thấy user Globex).
- LDAP Federation per-tenant (mỗi công ty có 1 LDAP server riêng).
- Custom theme riêng (logo, màu sắc).
- Custom login flow per-tenant (xem §5.5).

**SSO qua email công ty (Keycloak Conditional Authenticator):**
- User có email `@acme.com` → tự redirect sang SAML SSO của ACME (Okta/Azure-AD).
- User email khác → login username/password bình thường trong realm `acme`.

**LDAP Sync (Keycloak User Federation):**
- Mỗi realm có 1 LDAP provider config.
- Periodic full sync mỗi ngày 2h sáng + changed-sync mỗi 60s.
- Cache policy: NO_CACHE (luôn query LDAP khi login).

### 5.5 Custom Login Flow per tenant

Keycloak hỗ trợ custom Authentication Flow qua Admin API. Ví dụ:

```
Flow "acme-strict":    username → password → email-otp → success
Flow "globex-simple":  username → password → success
Flow "initech-sso":    saml-redirect (Okta) → success
```

→ `platform-registry.tenants.login_flow_alias` bind với realm qua Keycloak API.

Sau này có thể customize theo nhiều flow của từng công ty:
- Email-only (magic link)
- SMS OTP
- WebAuthn (passkey)
- Certificate (smartcard)

Sau này có thể customize theo nhiều flow của từng công ty:
- Email-only (magic link)
- SMS OTP
- WebAuthn (passkey)
- Certificate (smartcard)

### 5.6 JWT verification (shared-security)

JWT verify chạy ở **API Gateway** (KHÔNG ở IAM service mỗi request). IAM chỉ cung cấp JWK cache.

```java
// shared-security/src/main/java/.../KeycloakJwtDecoder.java (dùng chung)
@Component
public class KeycloakJwtDecoder {
    private final JWKSource<SecurityContext> jwkSource;
    private final String expectedIssuer;
    private final String expectedAudience;

    public DecodedJwt decode(String token) {
        // 1. Verify signature với Keycloak JWK
        // 2. Verify iss == keycloak realm URL
        // 3. Verify aud == this-app-client-id
        // 4. Verify exp
        // 5. Extract claims: sub, tenant_id, realm_access.roles
        return new DecodedJwt(...);
    }
}
```

### 5.7 Tenant claim trong JWT

Keycloak Protocol Mapper inject `tenant_id` vào JWT khi user login:

```
Host: acme.platform.com  → Keycloak realm tenant-acme → JWT claim: { "tenant_id": "acme", ... }
Host: globex.platform.com → JWT claim: { "tenant_id": "globex", ... }
```

→ `shared-security.TenantContextFilter` đọc claim `tenant_id` → set schema cho connection.

### 5.8 RBAC + Org-scope

`user_app_roles` ở `tenant-manager` (per-tenant schema `tenant_<slug>_tenantmanager`), có `org_scope_path` ltree:

```sql
CREATE TABLE user_app_roles (
    id                UUID PRIMARY KEY,
    tenant_id         UUID NOT NULL,
    keycloak_user_id  UUID NOT NULL,
    application       VARCHAR(50) NOT NULL,       -- 'HRM', 'SALES'
    role_id           UUID NOT NULL,
    org_scope_path    LTREE NULL,                  -- áp dụng trong cây tổ chức nào
    valid_from        TIMESTAMPTZ NOT NULL,
    valid_to          TIMESTAMPTZ NULL,
    granted_by        UUID NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_uar_org_scope ON user_app_roles USING GIST (org_scope_path);
```

→ 1 user có thể là `HRM_MANAGER` ở `tenant_acme.sales.team_a` và `SALES_ADMIN` ở `tenant_acme.sales.team_b` cùng lúc.

## 6. Backend — Applications (nghiệp vụ)

| Application | Chứa gì |
|-------------|---------|
| **hrm** | HR nghiệp vụ (attendance, leave, payroll, recruitment, performance, training). **KHÔNG còn** org/employee — đọc qua `tenant-manager /service-api/v1/` |
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
├── platform/                            ← nền tảng (8 services — GIẢM từ 15)
│   ├── iam/                  (JWT verify only — thin)
│   ├── platform-registry/    (tenants, mini-apps catalog, org-root mapping, role template)
│   ├── tenant-manager/       (users, roles, permissions — per-tenant schema)
│   ├── feature-flag/         (FF4j self-host: ff4j_features, ff4j_properties, ff4j_audit)
│   ├── master-data/          (danh mục dùng chung)
│   ├── social-integration/   (notifications, channels, posts, pages, analytics)
│   ├── workflow/             (BPMN-lite)
│   └── approval/             (duyệt ticket)
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
| 7 | Viết 4 service mới: `feature-flag` (FF4j), `master-data`, `social-integration`, `workflow` (nếu cần ngay), `approval` |

---

**Liên kết:**
- Code structure chi tiết: [`SOURCE-CODE-STRUCTURE.md`](SOURCE-CODE-STRUCTURE.md)
- Multi-tenant schema detail: [`governance/multi-tenant.md`](governance/multi-tenant.md)
- IAM Keycloak setup: [`src/backend/platform/iam/README.md`](src/backend/platform/iam/README.md)
