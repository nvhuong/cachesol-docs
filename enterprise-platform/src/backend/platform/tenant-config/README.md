# Tenant Config Service

## Vai trò

`tenant-config` là **service trung tâm quản lý "metadata" của nền tảng**: tenant, user, role/permission, mini-app registry, và mapping org root. Nó KHÔNG chứa nghiệp vụ HRM/Sales/Finance — dữ liệu nghiệp vụ nằm trong application services tương ứng.

Service này dùng **schema `public`** (cross-tenant metadata), không phải per-tenant schema.

## 5 Bounded Contexts

| # | Bounded Context | Bảng chính |
|---|-----------------|-------------|
| 1 | **Tenants** | `tenants` |
| 2 | **Org Units Mapping** (root-level lookup) | `tenant_root_orgs` |
| 3 | **Users** (CRUD + mapping employee) | `users_extra` |
| 4 | **Roles / Permissions** (per-tenant + org-scoped) | `permissions`, `roles`, `role_permissions`, `user_app_roles` |
| 5 | **Mini-apps Registry** (per-tenant enable/disable + config) | `mini_apps`, `tenant_mini_apps`, `tenant_mini_app_configs` |

> **Lưu ý:** `organizations`, `employees`, `job_titles` ở dạng cây đầy đủ vẫn thuộc HRM service (per-tenant schema). `tenant-config` chỉ giữ **root-level mapping** để biết tenant nào ↔ root org nào.

## 1. Tenants — Metadata công ty khách hàng

```sql
CREATE TABLE tenants (
    id                UUID PRIMARY KEY,
    slug              VARCHAR(50) UNIQUE NOT NULL,        -- 'acme', 'globex'
    schema_name       VARCHAR(63) UNIQUE NOT NULL,        -- 'tenant_acme'
    display_name      VARCHAR(255) NOT NULL,
    legal_name        VARCHAR(255) NULL,
    tax_code          VARCHAR(50)  NULL,                  -- mã số thuế công ty
    plan              VARCHAR(20)  NOT NULL DEFAULT 'trial',
    status            VARCHAR(20)  NOT NULL DEFAULT 'active',  -- active | suspended | offboarding
    region            VARCHAR(20)  NOT NULL DEFAULT 'vn',
    keycloak_realm    VARCHAR(50)  NOT NULL,              -- 'tenant-acme' (per-tenant realm)
    default_locale    VARCHAR(10)  NOT NULL DEFAULT 'vi',
    default_currency  VARCHAR(10)  NOT NULL DEFAULT 'VND',
    default_timezone  VARCHAR(50)  NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    contact_email     VARCHAR(255) NOT NULL,
    contact_phone     VARCHAR(50)  NULL,
    metadata          JSONB        NOT NULL DEFAULT '{}'::jsonb,
    created_at        TIMESTAMPTZ  NOT NULL,
    activated_at      TIMESTAMPTZ  NULL,
    suspended_at      TIMESTAMPTZ  NULL,
    offboarded_at     TIMESTAMPTZ  NULL
);
CREATE INDEX idx_tenants_status ON tenants(status) WHERE status != 'offboarding';
```

**Khi tạo tenant mới → tự động trigger (qua Keycloak Admin API):**
1. `CREATE SCHEMA tenant_<slug>` (qua Flyway callback)
2. Tạo Keycloak realm `tenant-<slug>` (qua Admin API)
3. Cấu hình LDAP Federation nếu tenant cung cấp
4. Tạo root organization trong HRM per-tenant schema → lưu mapping vào `tenant_root_orgs`
5. Tạo super-admin user đầu tiên (qua Keycloak Admin API)
6. Enable default mini-apps cho tenant

## 2. Org Units Mapping (root-level)

```sql
-- 1 row / tenant: root org ID trong HRM per-tenant schema
CREATE TABLE tenant_root_orgs (
    tenant_id         UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
    hrm_employee_id   UUID NULL,                          -- optional: nhân viên đầu tiên của tenant
    root_org_code     VARCHAR(50) NOT NULL,               -- 'ACME_ROOT' — code trong HRM organizations
    metadata          JSONB NOT NULL DEFAULT '{}'::jsonb,
    synced_at         TIMESTAMPTZ NOT NULL
);
```

→ Khi cần biết tenant nào ↔ root org ID nào (vd: gửi notification cho lãnh đạo cấp cao nhất), query từ đây. Cấy con/cháu vẫn query từ HRM.

## 3. Users (CRUD + Keycloak Admin API + Employee mapping)

User CRUD gọi sang **Keycloak Admin API** để tạo user trong realm của tenant. Bảng `users_extra` chỉ lưu **app-specific metadata** (KHÔNG có credential):

```sql
CREATE TABLE users_extra (
    id                UUID PRIMARY KEY,
    keycloak_user_id  UUID NOT NULL,                      -- sub trong JWT
    tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    default_language  VARCHAR(10) NOT NULL DEFAULT 'vi',
    avatar_url        TEXT NULL,
    display_name      VARCHAR(255) NULL,
    employee_id       UUID NULL,                          -- FK → hrm.employees.id (per-tenant schema, lookup qua tenant_id)
    status            VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    last_login_at     TIMESTAMPTZ NULL,
    metadata          JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at        TIMESTAMPTZ NOT NULL,
    updated_at        TIMESTAMPTZ NOT NULL,
    UNIQUE (keycloak_user_id, tenant_id)
);
CREATE INDEX idx_ue_tenant ON users_extra(tenant_id);
CREATE INDEX idx_ue_employee ON users_extra(employee_id);
```

### API

```
# CRUD user (gọi Keycloak Admin API để tạo + insert users_extra)
POST   /api/v1/tenants/{slug}/users                    → Tạo user mới trong realm + extra
GET    /api/v1/tenants/{slug}/users                    → List users (pagination, filter status/role)
GET    /api/v1/tenants/{slug}/users/{id}               → Detail
PATCH  /api/v1/tenants/{slug}/users/{id}               → Update users_extra (Keycloak user update riêng)
DELETE /api/v1/tenants/{slug}/users/{id}               → Disable user (Keycloak + status=DISABLED)
POST   /api/v1/tenants/{slug}/users/{id}/reset-password → Gọi Keycloak "execute-actions-email"

# Sync
POST   /api/v1/tenants/{slug}/users/ldap-sync          → Trigger Keycloak LDAP sync (admin only)

# Mapping
POST   /api/v1/tenants/{slug}/users/{id}/link-employee → Link user → employee_id trong HRM
```

## 4. Roles / Permissions (per-tenant + org-scoped)

```sql
-- Permission = 1 capability nhỏ nhất (atomic)
CREATE TABLE permissions (
    id          UUID PRIMARY KEY,
    code        VARCHAR(100) NOT NULL,            -- 'HRM.EMPLOYEE.READ', 'SALES.ORDER.CREATE'
    description VARCHAR(255) NULL,
    UNIQUE (code)
);

-- Role = tập hợp permissions + có thể có realm/client role mapping
CREATE TABLE roles (
    id           UUID PRIMARY KEY,
    tenant_id    UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    code         VARCHAR(100) NOT NULL,           -- 'HRM_MANAGER', 'SALES_ADMIN', 'COMPANY_ADMIN'
    name         VARCHAR(255) NOT NULL,
    description  TEXT NULL,
    is_system    BOOLEAN NOT NULL DEFAULT FALSE,  -- role hệ thống không xoá được
    keycloak_role_id UUID NULL,                   -- mapping sang Keycloak realm role
    created_at   TIMESTAMPTZ NOT NULL,
    UNIQUE (tenant_id, code)
);
CREATE INDEX idx_roles_tenant ON roles(tenant_id);

-- Role ↔ Permission (n-n)
CREATE TABLE role_permissions (
    role_id        UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id  UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- User ↔ Role (per-tenant, có thể scope theo org)
CREATE TABLE user_app_roles (
    id                UUID PRIMARY KEY,
    tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    keycloak_user_id  UUID NOT NULL,             -- trỏ sang Keycloak user
    application       VARCHAR(50) NOT NULL,      -- 'HRM', 'SALES', 'ERP', ...
    role_id           UUID NOT NULL REFERENCES roles(id),
    org_scope_path    LTREE NULL,                -- áp dụng trong cây tổ chức nào (NULL = toàn tenant)
    valid_from        TIMESTAMPTZ NOT NULL,
    valid_to          TIMESTAMPTZ NULL,
    granted_by        UUID NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_uar_tenant_user ON user_app_roles(tenant_id, keycloak_user_id);
CREATE INDEX idx_uar_org_scope   ON user_app_roles USING GIST (org_scope_path);
```

### Permission codes (chuẩn hoá)

```
HRM.EMPLOYEE.READ
HRM.EMPLOYEE.WRITE
HRM.EMPLOYEE.DELETE
HRM.EMPLOYEE.APPROVE_LEAVE
HRM.ORG.READ
HRM.ORG.WRITE
SALES.CUSTOMER.READ
SALES.CUSTOMER.WRITE
SALES.ORDER.CREATE
SALES.ORDER.APPROVE
ERP.INVENTORY.READ
ERP.INVENTORY.WRITE
FINANCE.JOURNAL.POST
FINANCE.REPORT.READ
MARKETING.CAMPAIGN.LAUNCH
...
```

### API

```
# Permissions (global catalog)
GET    /api/v1/permissions                              → List tất cả permission codes
POST   /api/v1/permissions                              → Tạo permission mới (admin only)

# Roles (per-tenant)
GET    /api/v1/tenants/{slug}/roles                     → List roles của tenant
POST   /api/v1/tenants/{slug}/roles                     → Tạo role mới (đồng thời tạo Keycloak realm role)
GET    /api/v1/tenants/{slug}/roles/{id}                → Detail (kèm permissions)
PATCH  /api/v1/tenants/{slug}/roles/{id}                → Update role + permissions
DELETE /api/v1/tenants/{slug}/roles/{id}                → Xoá role (trừ is_system=true)

# User role assignment
GET    /api/v1/tenants/{slug}/users/{id}/roles          → List effective roles của user
POST   /api/v1/tenants/{slug}/users/{id}/roles          → Grant role (kèm org_scope_path)
DELETE /api/v1/tenants/{slug}/users/{id}/roles/{uarId}  → Revoke role

# Effective permissions
GET    /api/v1/tenants/{slug}/users/{id}/permissions    → Permissions effective của user (union qua roles × org_scope_path)
```

### Org-scope enforcement

`org_scope_path` (ltree) → khi check permission, so sánh với path của resource:

```java
// Effective permission check
public boolean hasPermission(String userId, String tenant, String permissionCode, String resourceOrgPath) {
    List<UserAppRole> roles = userAppRoleRepo.findByUserAndTenant(userId, tenant);
    for (UserAppRole r : roles) {
        if (!r.getRole().hasPermission(permissionCode)) continue;
        if (r.getOrgScopePath() == null) return true;  // toàn tenant
        if (resourceOrgPath != null && resourceOrgPath.startsWith(r.getOrgScopePath().toString())) {
            return true;
        }
    }
    return false;
}
```

## 5. Mini-apps Registry

Mini-app registry quản lý **mini-app nào có sẵn** trong hệ thống + **mini-app nào được bật** cho từng tenant + **cấu hình per-tenant**.

```sql
-- Catalog: tất cả mini-app có sẵn trong platform (super-admin manage)
CREATE TABLE mini_apps (
    id              UUID PRIMARY KEY,
    code            VARCHAR(50) UNIQUE NOT NULL,       -- 'hrm', 'sales', 'erp', 'finance', 'marketing'
    name            VARCHAR(255) NOT NULL,
    description     TEXT NULL,
    version         VARCHAR(20) NOT NULL,             -- '1.0.0', '1.5.2'
    category        VARCHAR(50) NOT NULL,             -- 'core', 'addon', 'industry-specific'
    icon_url        TEXT NULL,
    documentation_url TEXT NULL,
    base_price      DECIMAL(12,2) NULL,                -- giá hàng tháng (display only, billing riêng)
    is_core         BOOLEAN NOT NULL DEFAULT FALSE,   -- core mini-app (HRM/Sales) bắt buộc cho mọi tenant
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,    -- tắt catalog nếu không bán nữa
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL
);

-- Per-tenant enable + config
CREATE TABLE tenant_mini_apps (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    mini_app_id     UUID NOT NULL REFERENCES mini_apps(id),
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    enabled_at      TIMESTAMPTZ NOT NULL,
    enabled_by      UUID NOT NULL,                    -- admin user (keycloak_user_id)
    config          JSONB NOT NULL DEFAULT '{}'::jsonb,  -- per-tenant config (URL, theme, ...)
    notes           TEXT NULL,
    UNIQUE (tenant_id, mini_app_id)
);

-- (Optional) Per-tenant user access cho mini-app (cho marketplace-style enable)
CREATE TABLE tenant_mini_app_user_access (
    id                UUID PRIMARY KEY,
    tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    mini_app_id       UUID NOT NULL REFERENCES mini_apps(id),
    keycloak_user_id  UUID NOT NULL,
    can_access        BOOLEAN NOT NULL DEFAULT TRUE,
    valid_from        TIMESTAMPTZ NOT NULL,
    valid_to          TIMESTAMPTZ NULL,
    UNIQUE (tenant_id, mini_app_id, keycloak_user_id)
);
```

### API

```
# Catalog (super-admin)
GET    /api/v1/mini-apps                              → List catalog
POST   /api/v1/mini-apps                              → Thêm mini-app mới vào catalog
GET    /api/v1/mini-apps/{code}                       → Detail
PATCH  /api/v1/mini-apps/{code}                       → Update catalog entry

# Per-tenant enable/disable (tenant admin)
GET    /api/v1/tenants/{slug}/mini-apps               → List mini-apps enabled cho tenant (kèm config)
POST   /api/v1/tenants/{slug}/mini-apps               → Enable mini-app cho tenant
PATCH  /api/v1/tenants/{slug}/mini-apps/{code}        → Cập nhật config mini-app
DELETE /api/v1/tenants/{slug}/mini-apps/{code}        → Disable mini-app

# Per-user access
GET    /api/v1/tenants/{slug}/mini-apps/{code}/users  → Users có access
POST   /api/v1/tenants/{slug}/mini-apps/{code}/users  → Grant user access
DELETE /api/v1/tenants/{slug}/mini-apps/{code}/users/{userId} → Revoke
```

### Default enable khi tạo tenant

```java
// Trong TenantBootstrapService
public void onTenantCreated(UUID tenantId) {
    // Enable default mini-apps
    List<MiniApp> defaults = miniAppRepo.findByIsCoreTrue();
    for (MiniApp m : defaults) {
        tenantMiniAppRepo.enable(tenantId, m.getId(), /* adminId */);
    }
}
```

### Frontend consume mini-app list

```
GET /api/v1/tenants/{slug}/mini-apps
→ [
    { code: 'hrm', name: 'HRM', enabled: true, config: {...} },
    { code: 'sales', name: 'Sales', enabled: true, config: {...} },
    { code: 'marketing', name: 'Marketing', enabled: false, config: {...} },
    ...
  ]
```

→ Frontend web-shell render sidebar chỉ với mini-app `enabled: true`.

## Dependencies

| Dependency | Vai trò |
|------------|---------|
| **Keycloak Admin API** | CRUD user/role trong realm của tenant |
| **HRM service** (qua HTTP) | Tạo root org + employee mapping |
| **Kafka** | Publish `TenantCreatedEvent`, `UserGrantedRoleEvent`, `MiniAppEnabledEvent` |
| **Redis** | Cache permission catalog, mini-app catalog |

## Database Schema

- Dùng schema `public` (cross-tenant metadata).
- KHÔNG động vào per-tenant schemas.

## Configuration

```yaml
tenant-config:
  default-plan: trial
  default-mini-apps:  # auto-enable khi tạo tenant
    - hrm
    - sales
  keycloak:
    server-url: ${KC_URL}
    super-admin-realm: master
  bootstrap:
    auto-create-keycloak-realm: true
    auto-create-root-org: true
```

## Domain Events Published

```
TenantCreatedEvent       (tenant_id, slug, plan)
TenantActivatedEvent
TenantSuspendedEvent
TenantOffboardedEvent
UserCreatedEvent         (tenant_id, keycloak_user_id, display_name)
UserDeactivatedEvent
UserRoleGrantedEvent     (tenant_id, keycloak_user_id, role_code, org_scope_path)
UserRoleRevokedEvent
MiniAppEnabledEvent      (tenant_id, mini_app_code)
MiniAppDisabledEvent
```

## API tổng quan (tất cả endpoints)

```
# Tenants
POST   /api/v1/tenants                                   → Tạo tenant (admin only)
GET    /api/v1/tenants                                   → List (super-admin)
GET    /api/v1/tenants/{slug}
PATCH  /api/v1/tenants/{slug}
POST   /api/v1/tenants/{slug}/activate
POST   /api/v1/tenants/{slug}/suspend
POST   /api/v1/tenants/{slug}/offboard

# Org Mapping
GET    /api/v1/tenants/{slug}/root-org

# Users (CRUD qua Keycloak Admin API + users_extra)
POST   /api/v1/tenants/{slug}/users
GET    /api/v1/tenants/{slug}/users
GET    /api/v1/tenants/{slug}/users/{id}
PATCH  /api/v1/tenants/{slug}/users/{id}
DELETE /api/v1/tenants/{slug}/users/{id}
POST   /api/v1/tenants/{slug}/users/{id}/reset-password
POST   /api/v1/tenants/{slug}/users/ldap-sync

# Roles / Permissions
GET    /api/v1/permissions
POST   /api/v1/permissions
GET    /api/v1/tenants/{slug}/roles
POST   /api/v1/tenants/{slug}/roles
GET    /api/v1/tenants/{slug}/roles/{id}
PATCH  /api/v1/tenants/{slug}/roles/{id}
DELETE /api/v1/tenants/{slug}/roles/{id}
GET    /api/v1/tenants/{slug}/users/{id}/roles
POST   /api/v1/tenants/{slug}/users/{id}/roles
DELETE /api/v1/tenants/{slug}/users/{id}/roles/{uarId}
GET    /api/v1/tenants/{slug}/users/{id}/permissions

# Mini-apps
GET    /api/v1/mini-apps
POST   /api/v1/mini-apps
GET    /api/v1/mini-apps/{code}
PATCH  /api/v1/mini-apps/{code}
GET    /api/v1/tenants/{slug}/mini-apps
POST   /api/v1/tenants/{slug}/mini-apps
PATCH  /api/v1/tenants/{slug}/mini-apps/{code}
DELETE /api/v1/tenants/{slug}/mini-apps/{code}
GET    /api/v1/tenants/{slug}/mini-apps/{code}/users
POST   /api/v1/tenants/{slug}/mini-apps/{code}/users
DELETE /api/v1/tenants/{slug}/mini-apps/{code}/users/{userId}
```

## Phối hợp với services khác

| Service | Tương tác |
|---------|-----------|
| **iam** | JWT verify, KHÔNG có user CRUD |
| **HRM** | `tenant-config` gọi HRM khi tạo tenant → tạo root org + super-admin employee record |
| **Sales/ERP/Finance/Marketing** | Tự check `tenant_mini_apps.enabled` cho user request (qua shared-security lib) |
| **web-shell** (frontend) | Gọi `GET /api/v1/tenants/me/mini-apps` để render sidebar |

## Không thuộc tenant-config

- ❌ Employee CRUD nghiệp vụ (HRM)
- ❌ Customer CRUD (Sales)
- ❌ Org tree CRUD (HRM — `organizations`, `job_titles`)
- ❌ Workflow definition (workflow-service)
- ❌ Login/register UI (Keycloak)

## Xem thêm

- IAM thin bridge: [`../iam/README.md`](../iam/README.md)
- Multi-tenant schema: [`../../../governance/architecture/multi-tenant.md`](../../../governance/architecture/multi-tenant.md)
- Architecture v3: [`../../../ARCHITECTURE.md`](../../../ARCHITECTURE.md)
