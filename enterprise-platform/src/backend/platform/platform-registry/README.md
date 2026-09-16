# Platform Registry Service

## Vai trò

`platform-registry` quản lý **registry metadata cross-tenant** và **per-tenant mapping root-level**:

| # | Bounded Context | Schema |
|---|-----------------|--------|
| 1 | **Tenants** (metadata công ty khách hàng) | `public` |
| 2 | **Mini-apps Catalog + Per-tenant enable** | `public` (catalog) + `tenant_<slug>_platformregistry` (per-tenant enable) |
| 3 | **Org-root mapping** (lookup root-level) | `tenant_<slug>_platformregistry` |

> **Tách khỏi `tenant-manager`:** User/Role/Permission CRUD đã chuyển sang service `tenant-manager` (per-tenant schema riêng `tenant_<slug>_tenantmanager`).

## Schema layout

```
cachesol_platform (1 PostgreSQL DB)
├── schema: public
│   ├── tenants                       ← registry tất cả tenants
│   ├── mini_apps                     ← catalog mini-apps (cross-tenant)
│   ├── flyway_schema_history         ← migrations cho public
│   └── ...
│
└── schema: tenant_<slug>_platformregistry   ← mỗi tenant có schema riêng
    ├── tenant_root_orgs              ← mapping tenant ↔ root org (HRM)
    ├── tenant_mini_apps              ← mini-apps enabled cho tenant + config
    ├── tenant_mini_app_user_access   ← per-user access cho mini-app
    └── flyway_schema_history
```

→ Service này **KHÔNG CHỨA** users, roles, permissions (chuyển sang `tenant-manager`).

---

## 1. Tenants — metadata công ty khách hàng

```sql
CREATE TABLE tenants (
    id                UUID PRIMARY KEY,
    slug              VARCHAR(50) UNIQUE NOT NULL,
    schema_name       VARCHAR(63) UNIQUE NOT NULL,        -- 'tenant_<slug>'
    display_name      VARCHAR(255) NOT NULL,
    legal_name        VARCHAR(255) NULL,
    tax_code          VARCHAR(50)  NULL,
    plan              VARCHAR(20)  NOT NULL DEFAULT 'trial',
    status            VARCHAR(20)  NOT NULL DEFAULT 'active',
    region            VARCHAR(20)  NOT NULL DEFAULT 'vn',
    keycloak_realm    VARCHAR(50)  NOT NULL,              -- 'tenant-acme'
    default_locale    VARCHAR(10)  NOT NULL DEFAULT 'vi',
    default_currency  VARCHAR(10)  NOT NULL DEFAULT 'VND',
    default_timezone  VARCHAR(50)  NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    contact_email     VARCHAR(255) NOT NULL,
    contact_phone     VARCHAR(50)  NULL,
    login_flow_alias  VARCHAR(50)  NULL,                  -- Keycloak custom flow
    metadata          JSONB        NOT NULL DEFAULT '{}'::jsonb,
    created_at        TIMESTAMPTZ  NOT NULL,
    activated_at      TIMESTAMPTZ  NULL,
    suspended_at      TIMESTAMPTZ  NULL,
    offboarded_at     TIMESTAMPTZ  NULL
);
CREATE INDEX idx_tenants_status ON tenants(status) WHERE status != 'offboarding';
```

**Khi tạo tenant mới, service này tự trigger:**

1. `CREATE SCHEMA tenant_<slug>_platformregistry` (Flyway callback)
2. Migrate schema per-tenant với file ở `classpath:db/migration/tenant-registry/`
3. Gọi Keycloak Admin API tạo realm `tenant-<slug>` (qua shared-keycloak-client lib)
4. Tạo LDAP Federation nếu tenant có LDAP config
5. Tạo root organization trong HRM (HTTP call sang HRM) → lưu mapping vào `tenant_root_orgs`
6. Tạo super-admin user đầu tiên (qua Keycloak Admin API)
7. Enable default mini-apps cho tenant (insert `tenant_mini_apps` rows)

---

## 2. Mini-apps Registry

### 2.1 Catalog (schema `public`)

```sql
CREATE TABLE mini_apps (
    id                 UUID PRIMARY KEY,
    code               VARCHAR(50) UNIQUE NOT NULL,       -- 'hrm', 'sales', 'erp'
    name               VARCHAR(255) NOT NULL,
    description        TEXT NULL,
    version            VARCHAR(20)  NOT NULL,
    category           VARCHAR(50)  NOT NULL,            -- core | addon | industry-specific
    icon_url           TEXT NULL,
    documentation_url  TEXT NULL,
    base_price         DECIMAL(12,2) NULL,
    is_core            BOOLEAN NOT NULL DEFAULT FALSE,   -- auto-enable cho mọi tenant
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
    enabled_by      UUID NOT NULL,                        -- keycloak_user_id
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
    hrm_root_org_id   UUID NOT NULL,                  -- organizations.id trong HRM per-tenant schema
    root_org_code     VARCHAR(50) NOT NULL,           -- 'ACME_ROOT'
    hrm_employee_id   UUID NULL,                      -- nhân viên đầu tiên của tenant
    metadata          JSONB NOT NULL DEFAULT '{}'::jsonb,
    synced_at         TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (root_org_code)
);
```

→ Cấy con/cháu vẫn query từ HRM (`tenant_<slug>_hrm.organizations`). `platform-registry` chỉ giữ root mapping để biết "tenant nào ↔ root org nào".

---

## API (4 prefix pattern)

> Service này expose tất cả 4 loại prefix theo chuẩn CacheSol (xem [`governance/architecture/api-patterns.md`](../../../governance/architecture/api-patterns.md)):

```
# CLIENT-API — Web/Mobile gọi vào (cần JWT authorize)
POST   /client-api/v1/tenants
GET    /client-api/v1/tenants
GET    /client-api/v1/tenants/{slug}
PATCH  /client-api/v1/tenants/{slug}
POST   /client-api/v1/tenants/{slug}/activate
POST   /client-api/v1/tenants/{slug}/suspend
POST   /client-api/v1/tenants/{slug}/offboard
GET    /client-api/v1/tenants/{slug}/root-org

GET    /client-api/v1/tenants/{slug}/mini-apps                  ← List enabled mini-apps (FE render sidebar)
POST   /client-api/v1/tenants/{slug}/mini-apps
PATCH  /client-api/v1/tenants/{slug}/mini-apps/{code}
DELETE /client-api/v1/tenants/{slug}/mini-apps/{code}

# SERVICE-API — Service khác gọi vào (cần service JWT)
GET    /service-api/v1/tenants/{slug}/mini-apps                  ← HRM/Sales check "có enabled không"
GET    /service-api/v1/tenants/{slug}/root-org                   ← Lookup root org ID
POST   /service-api/v1/tenants                                   ← Tạo tenant + bootstrap (orchestrator only)

# PUBLIC-API — Không cần authorize (hiếm)
GET    /public-api/v1/mini-apps                                  ← Catalog public

# INTEGRATION-API — Từ hệ thống ngoài
POST   /integration-api/v1/webhooks/keycloak                    ← Keycloak realm event cho registry
```

---

## Dependencies

| Dependency | Vai trò |
|------------|---------|
| **Keycloak Admin API** | Tạo realm, LDAP Federation, super-admin user |
| **HRM service** | Tạo root organization (per-tenant schema HRM) |
| **Kafka** | Publish `TenantCreatedEvent`, `MiniAppEnabledEvent` |

## Domain Events Published

```
TenantCreatedEvent      (tenant_id, slug, plan, keycloak_realm)
TenantActivatedEvent
TenantSuspendedEvent
TenantOffboardedEvent
MiniAppEnabledEvent     (tenant_id, mini_app_code)
MiniAppDisabledEvent
TenantRootOrgSyncedEvent
```

## Không thuộc platform-registry

| Tính năng | Service |
|-----------|---------|
| User CRUD | **`tenant-manager`** |
| Role/Permission CRUD | **`tenant-manager`** |
| Org tree CRUD | HRM |
| Customer | Sales |
| Workflow | workflow-service |

## Xem thêm

- User + Role service: [`../tenant-manager/README.md`](../tenant-manager/README.md)
- IAM JWT verify: [`../iam/README.md`](../iam/README.md)
- Multi-tenant: [`../../../governance/architecture/multi-tenant.md`](../../../governance/architecture/multi-tenant.md)
- API patterns: [`../../../governance/architecture/api-patterns.md`](../../../governance/architecture/api-patterns.md)
