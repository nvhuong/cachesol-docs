# Tenant Manager Service

## Vai trò

`tenant-manager` quản lý **users, roles, permissions** cho từng tenant. Service này có **per-tenant schema riêng** (`tenant_<slug>_tenantmanager`) — không dùng schema `public`, không có data cross-tenant.

| # | Bounded Context | Schema |
|---|-----------------|--------|
| 1 | **Users** (CRUD qua Keycloak Admin API + users_extra + employee link) | `tenant_<slug>_tenantmanager` |
| 2 | **Roles / Permissions** (per-tenant + org-scope) | `tenant_<slug>_tenantmanager` |

> **Tách khỏi `platform-registry`:** `platform-registry` chỉ giữ tenants registry + mini-apps catalog + org-root mapping. Mọi thứ liên quan user/role → `tenant-manager`.

## Schema layout

```
cachesol_platform (1 PostgreSQL DB)
└── schema: tenant_<slug>_tenantmanager    ← MỖI TENANT 1 SCHEMA RIÊNG
    ├── users_extra                       ← app-specific user metadata
    ├── permissions                       ← atomic permission codes
    ├── roles                             ← per-tenant roles
    ├── role_permissions                  ← role ↔ permission (n-n)
    ├── user_app_roles                    ← user ↔ role + org_scope_path (ltree)
    └── flyway_schema_history
```

→ Khi `platform-registry` tạo tenant mới → trigger tạo schema `tenant_<slug>_tenantmanager` + chạy migrations.

---

## 1. Users

### Bảng `users_extra`

```sql
CREATE TABLE users_extra (
    id                UUID PRIMARY KEY,
    keycloak_user_id  UUID NOT NULL,                       -- sub trong JWT
    default_language  VARCHAR(10) NOT NULL DEFAULT 'vi',
    avatar_url        TEXT NULL,
    display_name      VARCHAR(255) NULL,
    employee_id       UUID NULL,                           -- FK → hrm.employees.id (lookup qua tenant_id)
    status            VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    last_login_at     TIMESTAMPTZ NULL,
    metadata          JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at        TIMESTAMPTZ NOT NULL,
    updated_at        TIMESTAMPTZ NOT NULL,
    UNIQUE (keycloak_user_id)
);
CREATE INDEX idx_ue_employee ON users_extra(employee_id);
```

### API

```
# CLIENT-API — Web/Mobile
POST   /client-api/v1/users                                ← Tạo user (qua Keycloak Admin API)
GET    /client-api/v1/users                                ← List (pagination, filter status/role)
GET    /client-api/v1/users/me                             ← Current user
GET    /client-api/v1/users/{id}
PATCH  /client-api/v1/users/{id}
DELETE /client-api/v1/users/{id}                           ← Soft delete (status=DISABLED)
POST   /client-api/v1/users/{id}/reset-password            ← Trigger email reset
POST   /client-api/v1/users/{id}/disable
POST   /client-api/v1/users/{id}/enable
POST   /client-api/v1/users/{id}/link-employee             ← Set employee_id
POST   /client-api/v1/users/{id}/unlink-employee

# SERVICE-API — Service khác
GET    /service-api/v1/users/{keycloakUserId}              ← Lookup user metadata
GET    /service-api/v1/users/by-employee/{employeeId}      ← Lookup by employee
POST   /service-api/v1/users/ldap-sync                     ← Trigger Keycloak LDAP sync
```

### Logic tạo user

```java
@PostMapping("/client-api/v1/users")
public UserDto create(@PathVariable String slug, @RequestBody CreateUserRequest req) {
    // 1. Lấy tenant từ slug → biết keycloak_realm
    Tenant tenant = platformRegistryClient.getTenant(slug);

    // 2. Gọi Keycloak Admin API: tạo user trong realm của tenant
    String keycloakUserId = keycloakAdminClient.createUser(
        tenant.getKeycloakRealm(),
        req.email, req.firstName, req.lastName, req.attributes
    );

    // 3. Insert users_extra trong schema tenant_<slug>_tenantmanager
    UserExtra user = new UserExtra();
    user.setKeycloakUserId(keycloakUserId);
    user.setDisplayName(req.displayName);
    user.setEmployeeId(req.employeeId);  // optional
    userRepo.save(user);

    // 4. Publish event
    kafka.publish("UserCreatedEvent", ...);

    return toDto(user);
}
```

---

## 2. Roles / Permissions

### Bảng `permissions` (atomic capability)

```sql
CREATE TABLE permissions (
    id          UUID PRIMARY KEY,
    code        VARCHAR(100) NOT NULL,                  -- 'HRM.EMPLOYEE.READ'
    description VARCHAR(255) NULL,
    UNIQUE (code)
);
```

Permission code convention: `<APPLICATION>.<ENTITY>.<ACTION>`

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

### Bảng `roles` (per-tenant)

```sql
CREATE TABLE roles (
    id               UUID PRIMARY KEY,
    code             VARCHAR(100) NOT NULL,              -- 'HRM_MANAGER', 'SALES_ADMIN'
    name             VARCHAR(255) NOT NULL,
    description      TEXT NULL,
    is_system        BOOLEAN NOT NULL DEFAULT FALSE,     -- role hệ thống không xoá được
    keycloak_role_id UUID NULL,                          -- mapping sang Keycloak realm role
    created_at       TIMESTAMPTZ NOT NULL,
    UNIQUE (code)
);
```

### Bảng `role_permissions` (n-n)

```sql
CREATE TABLE role_permissions (
    role_id        UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id  UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);
```

### Bảng `user_app_roles` (per-tenant, org-scoped)

```sql
CREATE TABLE user_app_roles (
    id                UUID PRIMARY KEY,
    keycloak_user_id  UUID NOT NULL,
    application       VARCHAR(50) NOT NULL,              -- 'HRM', 'SALES'
    role_id           UUID NOT NULL REFERENCES roles(id),
    org_scope_path    LTREE NULL,                        -- áp dụng trong cây tổ chức nào (NULL = toàn tenant)
    valid_from        TIMESTAMPTZ NOT NULL,
    valid_to          TIMESTAMPTZ NULL,
    granted_by        UUID NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_uar_user        ON user_app_roles(keycloak_user_id);
CREATE INDEX idx_uar_org_scope   ON user_app_roles USING GIST (org_scope_path);
```

### API

```
# CLIENT-API
GET    /client-api/v1/permissions                          ← List all permission codes
POST   /client-api/v1/permissions                          ← Tạo permission mới (admin only)

GET    /client-api/v1/roles                                ← List roles
POST   /client-api/v1/roles                                ← Tạo role (đồng thời tạo Keycloak realm role)
GET    /client-api/v1/roles/{id}
PATCH  /client-api/v1/roles/{id}                           ← Update name + permissions
DELETE /client-api/v1/roles/{id}                           ← Xoá (trừ is_system=true)
GET    /client-api/v1/roles/{id}/permissions

GET    /client-api/v1/users/{id}/roles                     ← Effective roles của user
POST   /client-api/v1/users/{id}/roles                     ← Grant role + org_scope_path
DELETE /client-api/v1/users/{id}/roles/{uarId}             ← Revoke

GET    /client-api/v1/users/{id}/permissions               ← Effective permissions (union qua roles × org_scope_path)
POST   /client-api/v1/users/{id}/permissions/check         ← Check: user có permission này trên org path này không

# SERVICE-API
POST   /service-api/v1/permissions/check                   ← (orgId, permissionCode) → boolean
GET    /service-api/v1/users/{keycloakUserId}/permissions
GET    /service-api/v1/users/{keycloakUserId}/roles
```

### Org-scope enforcement

```java
// shared-common: PermissionChecker.java
public boolean hasPermission(UUID userId, String permissionCode, String resourceOrgPath) {
    List<UserAppRole> roles = userAppRoleRepo.findByUserAndTenant(userId, getCurrentTenant());
    for (UserAppRole r : roles) {
        if (!r.getRole().hasPermission(permissionCode)) continue;
        if (r.getOrgScopePath() == null) return true;       // toàn tenant
        if (resourceOrgPath != null
            && resourceOrgPath.startsWith(r.getOrgScopePath().toString())) {
            return true;
        }
    }
    return false;
}
```

---

## Dependencies

| Dependency | Vai trò |
|------------|---------|
| **Keycloak Admin API** | CRUD user, CRUD realm role |
| **platform-registry** | Tra cứu tenant metadata (keycloak_realm, plan...) |
| **HRM** | Tra cứu employee mapping (link user ↔ employee) |
| **Kafka** | Publish `UserCreatedEvent`, `UserRoleGrantedEvent` |
| **Redis** | Cache permission catalog + user permission effective |

## Domain Events Published

```
UserCreatedEvent           (tenant_slug, keycloak_user_id, display_name)
UserUpdatedEvent
UserDeactivatedEvent
UserLinkedEmployeeEvent    (tenant_slug, keycloak_user_id, employee_id)
UserRoleGrantedEvent       (tenant_slug, keycloak_user_id, role_code, org_scope_path)
UserRoleRevokedEvent
RoleCreatedEvent
RoleUpdatedEvent
RoleDeletedEvent
```

## API tổng quan (theo 4 prefix pattern)

```
# CLIENT-API (Web/Mobile) — cần JWT authorize (user JWT)
... (xem các mục trên)

# SERVICE-API (Service khác) — cần service JWT
... (xem các mục trên)

# PUBLIC-API — không có endpoint public ở service này
# INTEGRATION-API — không có endpoint integration ở service này
```

## Xem thêm

- Tenants + mini-apps: [`../platform-registry/README.md`](../platform-registry/README.md)
- IAM JWT verify: [`../iam/README.md`](../iam/README.md)
- Multi-tenant: [`../../../governance/architecture/multi-tenant.md`](../../../governance/architecture/multi-tenant.md)
- API patterns: [`../../../governance/architecture/api-patterns.md`](../../../governance/architecture/api-patterns.md)
