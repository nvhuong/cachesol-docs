# Platform Registry Service

## Vai trò

`platform-registry` quản lý **registry metadata cross-tenant** + **role/permission template**:

| # | Bounded Context | Schema |
|---|-----------------|--------|
| 1 | **Tenants** | `public` |
| 2 | **Mini-apps Catalog + Per-tenant enable** | `public` (catalog) + `tenant_<slug>_platformregistry` (per-tenant enable) |
| 3 | **Org-root mapping** (lookup root-level) | `tenant_<slug>_platformregistry` |
| 4 | **Role / Permission Template** | `public` |

> **Tách khỏi `tenant-manager`:** `tenant-manager` quản lý users + **toàn bộ cây tổ chức (organizations, job_titles, employees, employee_assignments)** + roles/permissions runtime (per-tenant schema).
> `platform-registry` chỉ giữ **role template snapshot** (catalog cross-tenant) — khi tạo tenant mới, clone snapshot này sang schema per-tenant của `tenant-manager`.

## Schema layout

```
cachesol_platform (1 PostgreSQL DB)
│
├── schema: public
│   ├── tenants                       ← registry tenants
│   ├── mini_apps                     ← catalog mini-apps (cross-tenant)
│   │
│   ├── # Role/Permission Template (NEW)
│   ├── permission_templates          ← atomic permission codes mặc định
│   ├── role_templates                ← role templates có sẵn (HRM_MANAGER, SALES_ADMIN, ...)
│   └── role_template_permissions      ← role ↔ permission (n-n)
│
└── schema: tenant_<slug>_platformregistry
    ├── tenant_root_orgs              ← mapping tenant ↔ root org (HRM → tenant-manager)
    ├── tenant_mini_apps              ← mini-apps enabled cho tenant + config
    ├── tenant_mini_app_user_access   ← per-user access cho mini-app
    └── flyway_schema_history
```

---

## 1. Tenants

```sql
CREATE TABLE tenants (
    id                UUID PRIMARY KEY,
    slug              VARCHAR(50) UNIQUE NOT NULL,
    schema_name       VARCHAR(63) UNIQUE NOT NULL,
    display_name      VARCHAR(255) NOT NULL,
    legal_name        VARCHAR(255) NULL,
    tax_code          VARCHAR(50)  NULL,
    plan              VARCHAR(20)  NOT NULL DEFAULT 'trial',
    status            VARCHAR(20)  NOT NULL DEFAULT 'active',
    region            VARCHAR(20)  NOT NULL DEFAULT 'vn',
    keycloak_realm    VARCHAR(50)  NOT NULL,
    default_locale    VARCHAR(10)  NOT NULL DEFAULT 'vi',
    default_currency  VARCHAR(10)  NOT NULL DEFAULT 'VND',
    default_timezone  VARCHAR(50)  NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    contact_email     VARCHAR(255) NOT NULL,
    contact_phone     VARCHAR(50)  NULL,
    login_flow_alias  VARCHAR(50)  NULL,
    role_template_id  UUID NULL REFERENCES role_templates(id),   -- ★ template sẽ clone khi tạo tenant
    metadata          JSONB        NOT NULL DEFAULT '{}'::jsonb,
    created_at        TIMESTAMPTZ  NOT NULL,
    activated_at      TIMESTAMPTZ  NULL,
    suspended_at      TIMESTAMPTZ  NULL,
    offboarded_at     TIMESTAMPTZ  NULL
);
```

**Khi tạo tenant → orchestrator trigger (qua Kafka hoặc direct call):**

1. `CREATE SCHEMA tenant_<slug>_platformregistry` (Flyway)
2. Migrate schema per-tenant
3. Gọi Keycloak Admin API → tạo realm `tenant-<slug>` + LDAP Federation
4. Gọi `tenant-manager` HTTP → `POST /service-api/v1/internal/init-schema`:
   - Tạo schema `tenant_<slug>_tenantmanager`
   - **Clone role template snapshot** từ `platform-registry` (idempotent)
   - Tạo root organization (COMPANY) đầu tiên
5. Tạo super-admin user đầu tiên (Keycloak Admin API + insert users_extra vào tenant-manager)
6. Enable default mini-apps

---

## 2. Mini-apps Registry

### 2.1 Catalog (schema `public`)

```sql
CREATE TABLE mini_apps (
    id                 UUID PRIMARY KEY,
    code               VARCHAR(50) UNIQUE NOT NULL,
    name               VARCHAR(255) NOT NULL,
    description        TEXT NULL,
    version            VARCHAR(20)  NOT NULL,
    category           VARCHAR(50)  NOT NULL,
    icon_url           TEXT NULL,
    documentation_url  TEXT NULL,
    base_price         DECIMAL(12,2) NULL,
    is_core            BOOLEAN NOT NULL DEFAULT FALSE,
    is_active          BOOLEAN NOT NULL DEFAULT TRUE,
    metadata           JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at         TIMESTAMPTZ NOT NULL,
    updated_at         TIMESTAMPTZ NOT NULL
);
```

### 2.2 Per-tenant enable + config (schema `tenant_<slug>_platformregistry`)

```sql
CREATE TABLE tenant_mini_apps (
    id              UUID PRIMARY KEY,
    mini_app_id     UUID NOT NULL REFERENCES public.mini_apps(id),
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    enabled_at      TIMESTAMPTZ NOT NULL,
    enabled_by      UUID NOT NULL,
    config          JSONB NOT NULL DEFAULT '{}'::jsonb,
    notes           TEXT NULL,
    UNIQUE (mini_app_id)
);

CREATE TABLE tenant_mini_app_user_access (
    id                UUID PRIMARY KEY,
    mini_app_id       UUID NOT NULL REFERENCES public.mini_apps(id),
    keycloak_user_id  UUID NOT NULL,
    can_access        BOOLEAN NOT NULL DEFAULT TRUE,
    valid_from        TIMESTAMPTZ NOT NULL,
    valid_to          TIMESTAMPTZ NULL,
    UNIQUE (mini_app_id, keycloak_user_id)
);
```

---

## 3. Org-root Mapping (per-tenant)

```sql
CREATE TABLE tenant_root_orgs (
    hrm_root_org_id   UUID NOT NULL,
    root_org_code     VARCHAR(50) NOT NULL,
    hrm_employee_id   UUID NULL,
    metadata          JSONB NOT NULL DEFAULT '{}'::jsonb,
    synced_at         TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (root_org_code)
);
```

→ Hỗ trợ lookup "tenant nào ↔ root org nào" nhanh. Các cây con/cháu vẫn query `service-api` từ `tenant-manager`.

---

## 4. Role / Permission Template (NEW)

> **Mục đích:** Cung cấp bộ role/permission mặc định có sẵn trong platform. Khi tạo tenant mới, bộ này được **clone snapshot** sang schema per-tenant của `tenant-manager`.

### 4.1 Permission Template (schema `public`)

```sql
CREATE TABLE permission_templates (
    id          UUID PRIMARY KEY,
    code        VARCHAR(100) NOT NULL,                  -- 'HRM.EMPLOYEE.READ'
    description VARCHAR(255) NULL,
    category    VARCHAR(50) NULL,                       -- 'HRM' | 'SALES' | 'ERP' | 'COMMON'
    UNIQUE (code)
);
```

### 4.2 Role Template

```sql
CREATE TABLE role_templates (
    id           UUID PRIMARY KEY,
    code         VARCHAR(100) NOT NULL,                 -- 'HRM_MANAGER', 'SALES_ADMIN', 'COMPANY_ADMIN'
    name         VARCHAR(255) NOT NULL,
    description  TEXT NULL,
    category     VARCHAR(50) NULL,                      -- 'HRM' | 'SALES' | 'COMMON' (super-admin,...)
    is_default   BOOLEAN NOT NULL DEFAULT FALSE,        -- template mặc định khi tạo tenant
    metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at   TIMESTAMPTZ NOT NULL,
    UNIQUE (code)
);

CREATE TABLE role_template_permissions (
    role_template_id      UUID NOT NULL REFERENCES role_templates(id) ON DELETE CASCADE,
    permission_template_id UUID NOT NULL REFERENCES permission_templates(id) ON DELETE CASCADE,
    PRIMARY KEY (role_template_id, permission_template_id)
);
```

### 4.3 Mẫu seed (ban đầu)

```sql
-- Permission templates (chạy 1 lần khi migrate)
INSERT INTO permission_templates (code, description, category) VALUES
  ('COMMON.USER.READ',         'Xem users',                'COMMON'),
  ('COMMON.USER.WRITE',        'CRUD users',               'COMMON'),
  ('COMMON.ROLE.READ',         'Xem roles',                'COMMON'),
  ('COMMON.ROLE.WRITE',        'Quản lý roles',            'COMMON'),
  ('COMMON.ORG.READ',          'Xem cây tổ chức',          'COMMON'),
  ('COMMON.ORG.WRITE',         'CRUD cây tổ chức',         'COMMON'),
  ('COMMON.AUDIT.READ',        'Xem audit log',            'COMMON'),
  ('HRM.EMPLOYEE.READ',        'Xem nhân viên',            'HRM'),
  ('HRM.EMPLOYEE.WRITE',       'CRUD nhân viên',           'HRM'),
  ('HRM.EMPLOYEE.APPROVE',     'Duyệt đơn HR',             'HRM'),
  ('SALES.CUSTOMER.READ',      'Xem khách hàng',           'SALES'),
  ('SALES.CUSTOMER.WRITE',     'CRUD khách hàng',          'SALES'),
  ('SALES.ORDER.CREATE',       'Tạo đơn hàng',             'SALES'),
  ('SALES.ORDER.APPROVE',      'Duyệt đơn hàng',           'SALES');

-- Role templates
INSERT INTO role_templates (code, name, description, category, is_default) VALUES
  ('COMPANY_ADMIN',  'Company Admin',   'Quản trị viên cấp công ty',            'COMMON', TRUE),
  ('HRM_MANAGER',    'HRM Manager',     'Quản lý nhân sự',                       'HRM',    TRUE),
  ('HRM_EMPLOYEE',   'HRM Employee',    'Nhân viên (đọc profile)',              'HRM',    TRUE),
  ('SALES_MANAGER',  'Sales Manager',   'Quản lý bán hàng',                     'SALES',  TRUE),
  ('SALES_REP',      'Sales Rep',       'Nhân viên bán hàng',                   'SALES',  TRUE),
  ('AUDITOR',        'Auditor',         'Xem audit logs (compliance)',          'COMMON', FALSE);

-- Role ↔ Permission
INSERT INTO role_template_permissions (role_template_id, permission_template_id)
SELECT rt.id, pt.id
FROM role_templates rt, permission_templates pt
WHERE
  (rt.code = 'COMPANY_ADMIN' AND pt.code LIKE 'COMMON.%')
  OR
  (rt.code = 'HRM_MANAGER' AND pt.code IN ('HRM.EMPLOYEE.READ', 'HRM.EMPLOYEE.WRITE', 'HRM.EMPLOYEE.APPROVE', 'COMMON.ORG.READ'))
  ...
```

### 4.4 API

```
# PUBLIC-API (không cần auth — landing page dùng)
GET    /public-api/v1/public/mini-apps                          ← Catalog (marketing shape, 6 mini-apps)
GET    /public-api/v1/public/mini-apps/{code}                   ← Detail (theo code: hrm, sales, finance, operations, analytics, helpdesk)
POST   /public-api/v1/tenants/register                         ← Self-service tenant registration (no auth)

GET    /public-api/v1/mini-apps/catalog                        ← Internal catalog (registry shape)
GET    /public-api/v1/health

# CLIENT-API (super-admin only)
GET    /client-api/v1/permissions/templates                   ← List permission codes
POST   /client-api/v1/permissions/templates                   ← Tạo permission template mới

GET    /client-api/v1/roles/templates                         ← List role templates
POST   /client-api/v1/roles/templates                         ← Tạo role template
GET    /client-api/v1/roles/templates/{id}                    ← Detail (kèm permissions)
PATCH  /client-api/v1/roles/templates/{id}                    ← Update name/description/permissions
DELETE /client-api/v1/roles/templates/{id}
POST   /client-api/v1/roles/templates/{id}/set-default        ← Đánh dấu template default

# CLIENT-API — Tenant management
POST   /client-api/v1/tenants
GET    /client-api/v1/tenants
GET    /client-api/v1/tenants/{slug}
PATCH  /client-api/v1/tenants/{slug}                          ← Có thể đổi role_template_id
POST   /client-api/v1/tenants/{slug}/activate
POST   /client-api/v1/tenants/{slug}/suspend
POST   /client-api/v1/tenants/{slug}/offboard
GET    /client-api/v1/tenants/{slug}/root-org

GET    /client-api/v1/tenants/{slug}/mini-apps                ← FE render sidebar
POST   /client-api/v1/tenants/{slug}/mini-apps
PATCH  /client-api/v1/tenants/{slug}/mini-apps/{code}
DELETE /client-api/v1/tenants/{slug}/mini-apps/{code}

# SERVICE-API — Service khác gọi
GET    /service-api/v1/roles/templates                        ← tenant-manager clone từ đây khi tạo tenant
GET    /service-api/v1/roles/templates/default               ← Get default templates
GET    /service-api/v1/permissions/templates
GET    /service-api/v1/tenants/{slug}/mini-apps               ← Check enable
GET    /service-api/v1/tenants/{slug}/root-org                ← Lookup root org ID
POST   /service-api/v1/tenants                                ← Orchestrator tạo tenant
POST   /service-api/v1/role-templates/{code}/snapshot        ← tenant-manager gọi khi cần clone
```

### 4.4.1 Public Catalog & Registration (Landing page — no auth)

Hai endpoint dưới đây **không yêu cầu authentication**, dùng cho Landing page để khách
hàng khám phá catalog mini-apps và tự đăng ký tenant mới:

#### `GET /public-api/v1/public/mini-apps`

Trả về marketing-shape catalog (6 mini-apps): HRM, Sales, Finance, Operations,
Analytics, Helpdesk. Marketing data (tagline, features, pricing, currency,
publisherName, publishedAt) được lưu trong `mini_apps.metadata` JSONB.

Response shape:
```json
{
  "success": true,
  "data": {
    "total": 6,
    "items": [
      {
        "id": "hrm",
        "name": "HRM",
        "tagline": "Quản lý nhân sự toàn diện",
        "description": "...",
        "category": "hr",
        "pricing": "per-user",
        "minSeats": 5,
        "currency": "VND",
        "pricePerMonth": 25000,
        "features": ["Hồ sơ nhân viên + lịch sử", "Chấm công GPS / QR / Web", ...],
        "publisherName": "CacheSol",
        "publishedAt": "2025-01-15",
        "iconUrl": null,
        "installEndpoint": "/api/tenant-manager/v1/mini-apps/hrm/install"
      }
    ]
  }
}
```

#### `GET /public-api/v1/public/mini-apps/{code}`

Detail một mini-app theo `code` (slug). Trả 404 nếu không tìm thấy hoặc đã bị `is_active=false`.

#### `POST /public-api/v1/tenants/register`

Self-service tenant registration. Validate `consents.termsAccepted` + `privacyAccepted`,
derive `slug` từ `companyName`, tạo `Tenant (status=provisioning)`, provision Keycloak
realm (best-effort), publish `TenantCreatedEvent`. Sau khi `tenant-manager` init xong
schema per-tenant thì sẽ callback `POST /service-api/v1/internal/tenants/{slug}/initialized`
→ `Tenant.status → active`.

Request:
```json
{
  "company":     { "companyName": "...", "taxCode": "...", "country": "VN", "companySize": "small" },
  "contact":     { "fullName": "...", "email": "...", "phone": "...", "jobTitle": "CEO" },
  "subscription":{ "selectedMiniAppIds": ["hrm","sales"], "estimatedSeats": 10, "billingCurrency": "VND" },
  "consents":    { "termsAccepted": true, "privacyAccepted": true, "marketingOptIn": false },
  "referrer":    "google"
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "tenantId":       "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "tenantSlug":     "cong-ty-acme",
    "adminUrl":       "https://cong-ty-acme.vn.cachesol.io/admin",
    "contactEmail":   "ceo@acme.com",
    "provisioningEta": "5-10 phút"
  }
}
```

Validation codes: `VALIDATION` (400), `CONSENT_REQUIRED` (400), `SLUG_TAKEN` (400),
`MISSING_COUNTRY` (400), `INTERNAL_ERROR` (500).

### 4.5 Clone snapshot sang tenant-manager (lúc tạo tenant)

Khi `platform-registry` tạo tenant → gọi `POST /service-api/v1/internal/init-schema` của `tenant-manager`:

```java
// tenant-manager service
@PostMapping("/service-api/v1/internal/init-schema")
public void initTenantSchema(@PathVariable String slug, @RequestBody InitTenantRequest req) {
    String schema = "tenant_" + slug + "_tenantmanager";

    // 1. CREATE SCHEMA + migrate
    flyway.migrate(schema);

    // 2. Set search_path
    DataSourceContextHolder.setSchema(schema);

    // 3. Snapshot permission templates
    List<PermissionTemplate> permTemplates = platformRegistryClient.getPermissionTemplates();
    Map<UUID, UUID> permTemplateIdToNewId = new HashMap<>();
    for (PermissionTemplate pt : permTemplates) {
        Permission cloned = new Permission();
        cloned.setCode(pt.getCode());
        cloned.setDescription(pt.getDescription());
        permissionRepo.save(cloned);
        permTemplateIdToNewId.put(pt.getId(), cloned.getId());
    }

    // 4. Snapshot role templates
    List<RoleTemplate> roleTemplates = platformRegistryClient.getRoleTemplates();
    for (RoleTemplate rt : roleTemplates) {
        Role role = new Role();
        role.setCode(rt.getCode());
        role.setName(rt.getName());
        role.setDescription(rt.getDescription());
        role.setIsSystem(true);                      // role snapshot gốc → system role
        role.setTemplateRoleId(rt.getId());
        roleRepo.save(role);

        // 5. Clone role_permissions
        for (PermissionTemplate pt : rt.getPermissions()) {
            UUID newPermId = permTemplateIdToNewId.get(pt.getId());
            rolePermissionRepo.save(new RolePermission(role.getId(), newPermId));
        }
    }

    // 6. Tạo root organization (COMPANY type)
    Organization root = new Organization();
    root.setCode(req.companyCode);    // 'ACME_ROOT'
    root.setName(req.companyName);
    root.setType("COMPANY");
    root.setPath(Ltree.of(req.companyCode.toLowerCase()));    // 'acme_root'
    root.setLevel(0);
    organizationRepo.save(root);
}
```

→ Sau khi `tenant-manager` xong, nó publish `TenantInitializedEvent`. `platform-registry` listen event → cập nhật `tenants.status = 'active'`.

---

## Dependencies

| Dependency | Vai trò |
|------------|---------|
| **Keycloak Admin API** | Tạo realm, LDAP Federation |
| **tenant-manager** | Gọi khi tạo tenant (clone template + tạo schema + tạo root org) |
| **HRM** | (qua service-api của tenant-manager) |
| **Kafka** | Publish events |

## Domain Events Published

```
TenantCreatedEvent
TenantInitializedEvent      (sau khi tenant-manager init xong)
TenantActivatedEvent
TenantSuspendedEvent
TenantOffboardedEvent
MiniAppEnabledEvent
MiniAppDisabledEvent
RoleTemplateCreatedEvent
RoleTemplateUpdatedEvent
PermissionTemplateCreatedEvent
```

## Không thuộc platform-registry

| Tính năng | Service |
|-----------|---------|
| User CRUD | **tenant-manager** |
| Role runtime (per-tenant) | **tenant-manager** |
| **Org tree CRUD** | **tenant-manager** (đổi từ HRM) |
| **Job title + employees + assignments** | **tenant-manager** (đổi từ HRM) |
| HR nghiệp vụ (attendance/leave/payroll/...) | HRM (giờ chỉ nghiệp vụ, đọc data qua service-api của tenant-manager) |
| Customer, Workflow, Approval | Sales, workflow-service, approval-service |

## Xem thêm

- User + role + **cây tổ chức** runtime: [`../tenant-manager/README.md`](../tenant-manager/README.md)
- IAM JWT verify: [`../iam/README.md`](../iam/README.md)
- Multi-tenant: [`../../../governance/architecture/multi-tenant.md`](../../../governance/architecture/multi-tenant.md)
- API patterns: [`../../../governance/architecture/api-patterns.md`](../../../governance/architecture/api-patterns.md)
