# Tenant Manager Service

## Vai trò

`tenant-manager` là **service trung tâm quản lý "cấu trúc tổ chức" của từng tenant**: users, roles/permissions, **toàn bộ cây tổ chức (organizations)**, chức danh (job_titles), và gán nhân viên vào đơn vị (employee_assignments) + hồ sơ employee.

Service này có **per-tenant schema riêng** (`tenant_<slug>_tenantmanager`) — không dùng schema `public`, không có data cross-tenant.

> **HRM giờ không còn quản lý org tree nữa.** HRM chỉ giữ nghiệp vụ HR (attendance, leave, payroll, recruitment...) và đọc org/employee qua `service-api` của `tenant-manager`.

## 5 Bounded Context

| # | Bounded Context | Bảng chính |
|---|-----------------|-------------|
| 1 | **Users** | `users_extra` |
| 2 | **Roles / Permissions** | `permissions`, `roles`, `role_permissions`, `user_app_roles` |
| 3 | **Organizations** (cây đơn vị) | `organizations` (ltree) |
| 4 | **Job Titles** (chức danh) | `job_titles` |
| 5 | **Employees + Assignments** | `employees`, `employee_contracts`, `employee_assignments` |

> **Tách khỏi `platform-registry`:** Role/Permission ở per-tenant schema. `platform-registry` chỉ giữ **role template snapshot** (cross-tenant, schema `public`) — khi tạo tenant mới sẽ clone snapshot sang schema per-tenant.

## Schema layout

```
cachesol_platform (1 PostgreSQL DB)
└── schema: tenant_<slug>_tenantmanager    ← MỖI TENANT 1 SCHEMA RIÊNG
    │
    ├── # === BC #1: Users ===
    ├── users_extra                        ← app-specific user metadata
    │
    ├── # === BC #2: Roles / Permissions ===
    ├── permissions                        ← atomic permission codes
    ├── roles                              ← per-tenant roles (clone từ template)
    ├── role_permissions                   ← role ↔ permission (n-n)
    ├── user_app_roles                     ← user ↔ role + org_scope_path (ltree)
    │
    ├── # === BC #3: Organizations ===
    ├── organizations                      ← cây đơn vị (ltree)
    │
    ├── # === BC #4: Job Titles ===
    ├── job_titles                         ← chức danh tự khai báo
    │
    ├── # === BC #5: Employees + Assignments ===
    ├── employees                          ← hồ sơ nhân viên
    ├── employee_contracts                 ← hợp đồng lao động
    ├── employee_assignments               ← employee ↔ org ↔ job_title (n-n-n)
    │
    └── flyway_schema_history
```

→ Khi `platform-registry` tạo tenant mới → trigger:
1. `CREATE SCHEMA tenant_<slug>_tenantmanager`
2. Chạy migration (tạo bảng trống)
3. **Clone role template snapshot** từ `platform-registry` → insert vào `permissions`, `roles`, `role_permissions`
4. Tạo root organization (COMPANY) đầu tiên

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
    employee_id       UUID NULL,                           -- FK → employees.id (cùng schema)
    status            VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE | DISABLED | LOCKED
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
# CLIENT-API
POST   /client-api/v1/users                                ← Tạo user (qua Keycloak Admin API)
GET    /client-api/v1/users                                ← List (pagination, filter status/role)
GET    /client-api/v1/users/me
GET    /client-api/v1/users/{id}
PATCH  /client-api/v1/users/{id}
DELETE /client-api/v1/users/{id}                           ← Soft delete (status=DISABLED)
POST   /client-api/v1/users/{id}/reset-password
POST   /client-api/v1/users/{id}/disable
POST   /client-api/v1/users/{id}/enable
POST   /client-api/v1/users/{id}/link-employee             ← Set employee_id
POST   /client-api/v1/users/{id}/unlink-employee

# SERVICE-API
GET    /service-api/v1/users/{keycloakUserId}
GET    /service-api/v1/users/by-employee/{employeeId}      ← Lookup by employee_id
POST   /service-api/v1/users/ldap-sync                     ← Trigger Keycloak LDAP sync
```

---

## 2. Roles / Permissions

### Snapshot từ platform-registry (lúc tạo tenant)

```sql
-- permissions (clone từ template trong platform-registry)
CREATE TABLE permissions (
    id          UUID PRIMARY KEY,
    code        VARCHAR(100) NOT NULL,                  -- 'HRM.EMPLOYEE.READ'
    description VARCHAR(255) NULL,
    UNIQUE (code)
);

-- roles (clone từ template)
CREATE TABLE roles (
    id               UUID PRIMARY KEY,
    code             VARCHAR(100) NOT NULL,              -- 'HRM_MANAGER', 'SALES_ADMIN'
    name             VARCHAR(255) NOT NULL,
    description      TEXT NULL,
    is_system        BOOLEAN NOT NULL DEFAULT FALSE,     -- role hệ thật thì is_system=true, tenant tự tạo thì false
    template_role_id UUID NULL,                          -- ref về role template trong platform-registry
    created_at       TIMESTAMPTZ NOT NULL,
    UNIQUE (code)
);

CREATE TABLE role_permissions (
    role_id        UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id  UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- user ↔ role (per-tenant, org-scoped)
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
CREATE INDEX idx_uar_user      ON user_app_roles(keycloak_user_id);
CREATE INDEX idx_uar_org_scope ON user_app_roles USING GIST (org_scope_path);
```

### Permission code

```
HRM.EMPLOYEE.READ
HRM.EMPLOYEE.WRITE
HRM.EMPLOYEE.DELETE
HRM.EMPLOYEE.APPROVE_LEAVE
HRM.ORG.READ
HRM.ORG.WRITE
SALES.CUSTOMER.READ
SALES.CUSTOMER.WRITE
...
```

### API

```
# CLIENT-API
GET    /client-api/v1/permissions                          ← List permission codes
POST   /client-api/v1/permissions                          ← Tạo mới (admin only)

GET    /client-api/v1/roles
POST   /client-api/v1/roles                                ← Tạo role mới (Keycloak realm role auto-create)
GET    /client-api/v1/roles/{id}
PATCH  /client-api/v1/roles/{id}
DELETE /client-api/v1/roles/{id}                           ← Xoá (trừ is_system=true)
GET    /client-api/v1/roles/{id}/permissions

GET    /client-api/v1/users/{id}/roles
POST   /client-api/v1/users/{id}/roles                     ← Grant role + org_scope_path
DELETE /client-api/v1/users/{id}/roles/{uarId}

GET    /client-api/v1/users/{id}/permissions
POST   /client-api/v1/users/{id}/permissions/check         ← Check perm trên 1 org path

# SERVICE-API
POST   /service-api/v1/permissions/check                   ← (userId, orgId, perm) → boolean
GET    /service-api/v1/users/{keycloakUserId}/permissions
```

### Org-scope enforcement

```java
// shared-common: PermissionChecker.java
public boolean hasPermission(UUID userId, String permissionCode, String resourceOrgPath) {
    List<UserAppRole> roles = userAppRoleRepo.findByUserAndTenant(userId, getCurrentTenant());
    for (UserAppRole r : roles) {
        if (!r.getRole().hasPermission(permissionCode)) continue;
        if (r.getOrgScopePath() == null) return true;
        if (resourceOrgPath != null
            && resourceOrgPath.startsWith(r.getOrgScopePath().toString())) {
            return true;
        }
    }
    return false;
}
```

---

## 3. Organizations (cây đơn vị)

Cây tổ chức của tenant, lưu ltree. Có thể có nhiều cấp: công ty mẹ, công ty con, chi nhánh, trung tâm, phòng ban, nhóm.

```sql
CREATE EXTENSION IF NOT EXISTS ltree;

CREATE TABLE organizations (
    id          UUID PRIMARY KEY,
    code        VARCHAR(50)  NOT NULL,                    -- unique trong tenant
    name        VARCHAR(255) NOT NULL,
    type        VARCHAR(30)  NOT NULL,                    -- COMPANY | SUBSIDIARY | BRANCH | CENTER | DEPARTMENT | TEAM
    parent_id   UUID NULL REFERENCES organizations(id),
    path        LTREE        NOT NULL,                    -- vd: acme.vn.hcmc.sales
    level       SMALLINT     NOT NULL,                    -- 0 = root
    manager_id  UUID NULL,                                -- FK → employees.id (nullable khi mới tạo)
    description TEXT NULL,
    metadata    JSONB        NOT NULL DEFAULT '{}'::jsonb,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL,
    updated_at  TIMESTAMPTZ  NOT NULL,
    UNIQUE (code)
);
CREATE INDEX idx_org_path_gist ON organizations USING GIST (path);
CREATE INDEX idx_org_parent    ON organizations(parent_id);
CREATE INDEX idx_org_manager   ON organizations(manager_id);
```

### API

```
# CLIENT-API
GET    /client-api/v1/organizations/tree                  ← Cây đầy đủ
GET    /client-api/v1/organizations/{id}
GET    /client-api/v1/organizations/{id}/descendants      ← Con/cháu
GET    /client-api/v1/organizations/{id}/ancestors        ← Cha/ông (breadcrumb)
POST   /client-api/v1/organizations                       ← Tạo node (auto-set path từ parent)
PATCH  /client-api/v1/organizations/{id}
PATCH  /client-api/v1/organizations/{id}/move             ← Di chuyển sang parent khác (update path cả subtree)
DELETE /client-api/v1/organizations/{id}                  ← Soft delete (set inactive)
POST   /client-api/v1/organizations/{id}/manager          ← Set manager_id

# SERVICE-API (HRM/Sales/Finance đọc)
GET    /service-api/v1/organizations/tree
GET    /service-api/v1/organizations/by-code/{code}
GET    /service-api/v1/organizations/{id}/descendants
GET    /service-api/v1/organizations/{id}/ancestors
GET    /service-api/v1/organizations/{id}/employees       ← List employees thuộc node (qua employee_assignments)
```

---

## 4. Job Titles (chức danh tự khai báo)

```sql
CREATE TABLE job_titles (
    id           UUID PRIMARY KEY,
    code         VARCHAR(50) NOT NULL,
    name         VARCHAR(255) NOT NULL,
    level        SMALLINT NOT NULL,                       -- thứ bậc
    is_leader    BOOLEAN NOT NULL DEFAULT FALSE,          -- có quyền duyệt không
    scope_org_id UUID NULL REFERENCES organizations(id),  -- phạm vi áp dụng
    description  TEXT NULL,
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ NOT NULL,
    UNIQUE (code)
);
CREATE INDEX idx_jt_scope_org ON job_titles(scope_org_id);
```

### API

```
# CLIENT-API
GET    /client-api/v1/job-titles
POST   /client-api/v1/job-titles
GET    /client-api/v1/job-titles/{id}
PATCH  /client-api/v1/job-titles/{id}
DELETE /client-api/v1/job-titles/{id}

# SERVICE-API
GET    /service-api/v1/job-titles
GET    /service-api/v1/job-titles/by-code/{code}
```

---

## 5. Employees + Assignments

### Bảng `employees`

```sql
CREATE TABLE employees (
    id           UUID PRIMARY KEY,
    code         VARCHAR(50) NOT NULL,                    -- mã nhân viên (MNV-001)
    full_name    VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NULL,
    phone        VARCHAR(50)  NULL,
    date_of_birth DATE NULL,
    gender       VARCHAR(10) NULL,
    national_id  VARCHAR(30) NULL,
    address      TEXT NULL,
    avatar_url   TEXT NULL,
    status       VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',   -- ACTIVE | INACTIVE | TERMINATED
    hired_at     DATE NULL,
    terminated_at DATE NULL,
    metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at   TIMESTAMPTZ NOT NULL,
    updated_at   TIMESTAMPTZ NOT NULL,
    UNIQUE (code)
);

CREATE TABLE employee_contracts (
    id            UUID PRIMARY KEY,
    employee_id   UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    contract_type VARCHAR(30) NOT NULL,                    -- PROBATION | FIXED | INDEFINITE | PART_TIME
    start_date    DATE NOT NULL,
    end_date      DATE NULL,
    salary        DECIMAL(15,2) NULL,
    currency      VARCHAR(10) NULL,
    notes         TEXT NULL,
    created_at    TIMESTAMPTZ NOT NULL
);
```

### Bảng `employee_assignments` (1 nhân viên nhiều org + nhiều chức danh)

```sql
CREATE TABLE employee_assignments (
    id            UUID PRIMARY KEY,
    employee_id   UUID NOT NULL REFERENCES employees(id),
    org_id        UUID NOT NULL REFERENCES organizations(id),
    job_title_id  UUID NOT NULL REFERENCES job_titles(id),
    is_primary    BOOLEAN NOT NULL DEFAULT FALSE,
    start_date    DATE NOT NULL,
    end_date      DATE NULL,
    reports_to    UUID NULL REFERENCES employees(id),     -- quản lý trực tiếp
    created_at    TIMESTAMPTZ NOT NULL,
    UNIQUE (employee_id, org_id, job_title_id, start_date)
);
CREATE INDEX idx_ea_employee ON employee_assignments(employee_id);
CREATE INDEX idx_ea_org      ON employee_assignments(org_id);
```

### API

```
# CLIENT-API
GET    /client-api/v1/employees
GET    /client-api/v1/employees/{id}
POST   /client-api/v1/employees
PATCH  /client-api/v1/employees/{id}
DELETE /client-api/v1/employees/{id}

GET    /client-api/v1/employees/{id}/assignments         ← List assignments của employee
POST   /client-api/v1/employees/{id}/assignments        ← Gán employee vào org + job_title
PATCH  /client-api/v1/employees/{id}/assignments/{aId}   ← Sửa
DELETE /client-api/v1/employees/{id}/assignments/{aId}   ← Thu hồi

GET    /client-api/v1/employees/{id}/contracts
POST   /client-api/v1/employees/{id}/contracts

# SERVICE-API (HRM đọc + ghi)
GET    /service-api/v1/employees
GET    /service-api/v1/employees/{id}
GET    /service-api/v1/employees/by-code/{code}
GET    /service-api/v1/employees/by-organization/{orgId} ← List employees thuộc org
GET    /service-api/v1/employees/{id}/assignments
GET    /service-api/v1/employees/{id}/manager            ← Lấy quản lý trực tiếp
GET    /service-api/v1/employees/by-manager/{managerId}  ← Direct reports
```

---

## Dependencies

| Dependency | Vai trò |
|------------|---------|
| **Keycloak Admin API** | CRUD user, CRUD realm role |
| **platform-registry** | Tra cứu tenant metadata + role template snapshot |
| **HRM/Sales/Finance** | Đọc org/employee qua `service-api` |
| **Kafka** | Publish events |
| **Redis** | Cache permission + tree |

## Domain Events Published

```
UserCreatedEvent
UserLinkedEmployeeEvent
UserRoleGrantedEvent
UserRoleRevokedEvent
RoleCreatedEvent
OrganizationCreatedEvent
OrganizationMovedEvent        (di chuyển node làm đổi path)
OrganizationDeletedEvent
JobTitleCreatedEvent
EmployeeCreatedEvent
EmployeeTerminatedEvent
EmployeeAssignedEvent         (gán nhân viên vào org + chức danh)
EmployeeUnassignedEvent
```

## Xem thêm

- Tenants + role template: [`../platform-registry/README.md`](../platform-registry/README.md)
- IAM JWT verify: [`../iam/README.md`](../iam/README.md)
- Multi-tenant: [`../../../governance/architecture/multi-tenant.md`](../../../governance/architecture/multi-tenant.md)
- API patterns: [`../../../governance/architecture/api-patterns.md`](../../../governance/architecture/api-patterns.md)
- HRM (giờ chỉ chứa nghiệp vụ, đọc data qua service-api này): [`../../applications/hrm/README.md`](../../applications/hrm/README.md)
