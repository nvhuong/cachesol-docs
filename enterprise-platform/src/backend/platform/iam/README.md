# IAM Service (Keycloak-backed thin bridge)

## Mục đích

IAM Service **KHÔNG** quản lý identity trực tiếp. Nó là **thin bridge** giữa:
- **Keycloak** (chạy như container riêng) — làm Source of Truth cho users, credentials, roles, login flows, LDAP sync, SSO, OAuth2, MFA.
- **Các application khác** — cần app-specific metadata về user (`tenant_id`, `avatar_url`, `default_language`, ...) và app-specific roles không thuộc Keycloak realm roles.

## Trách nhiệm

| # | Trách nhiệm | Implementation |
|---|-------------|----------------|
| 1 | Verify JWT (signature + iss + aud + exp) | `shared-security` lib: `KeycloakJwtDecoder` |
| 2 | Verify Keycloak realm public key (JWK rotation) | `shared-security` lib: refresh mỗi 1h |
| 3 | Extract `tenant_id` claim từ JWT | `shared-security` lib: `TenantContextFilter` |
| 4 | API đọc user profile cho frontend | IAM service: `GET /api/v1/users/me` |
| 5 | Quản lý **app-specific** user data | IAM service: `users_extra` table |
| 6 | Quản lý **app-specific** roles (per-tenant, org-scoped) | IAM service: `user_app_roles` table |
| 7 | Nhận user lifecycle events từ Keycloak (create/update/delete) | Keycloak SPI → webhook |
| 8 | Admin CRUD user (gọi Keycloak Admin API) | IAM service: `POST /api/v1/users` |
| 9 | LDAP sync orchestration (delegate cho Keycloak User Federation) | IAM service: trigger sync qua Keycloak Admin API |

## Bounded Context

- `users_extra` — mở rộng Keycloak `User` với data per-tenant
- `user_app_roles` — role trong app nghiệp vụ (HRM_MANAGER, SALES_ADMIN, ...), kèm `org_scope_path` (ltree)
- `ldap_sync_log` — log khi sync user từ LDAP/AD
- `keycloak_webhook_events` — audit trail cho mọi event nhận từ Keycloak

## Bảng dữ liệu (cross-tenant schema `public`)

```sql
-- users_extra: 1 row / (keycloak_user_id, tenant_id)
CREATE TABLE users_extra (
    id               UUID PRIMARY KEY,
    keycloak_user_id UUID NOT NULL,
    tenant_id        UUID NOT NULL REFERENCES tenants(id),
    default_language VARCHAR(10) NOT NULL DEFAULT 'vi',
    avatar_url       TEXT NULL,
    display_name     VARCHAR(255) NULL,
    employee_id      UUID NULL,                 -- FK → hrm.employees.id nếu user là nhân viên
    status           VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE | LOCKED | DISABLED
    last_login_at    TIMESTAMPTZ NULL,
    metadata         JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at       TIMESTAMPTZ NOT NULL,
    updated_at       TIMESTAMPTZ NOT NULL,
    UNIQUE (keycloak_user_id, tenant_id)
);

-- user_app_roles: app-specific roles, có thể org-scoped
CREATE TABLE user_app_roles (
    id                UUID PRIMARY KEY,
    tenant_id         UUID NOT NULL REFERENCES tenants(id),
    keycloak_user_id  UUID NOT NULL,
    application       VARCHAR(50) NOT NULL,         -- 'HRM', 'SALES', 'ERP', ...
    role_code         VARCHAR(100) NOT NULL,        -- 'HRM_MANAGER', 'SALES_ADMIN'
    org_scope_path    LTREE NULL,                   -- áp dụng trong cây tổ chức nào (NULL = toàn tenant)
    valid_from        TIMESTAMPTZ NOT NULL,
    valid_to          TIMESTAMPTZ NULL,
    granted_by        UUID NOT NULL,                -- keycloak_user_id của admin
    created_at        TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_uar_tenant_user ON user_app_roles(tenant_id, keycloak_user_id);
CREATE INDEX idx_uar_app_role    ON user_app_roles(application, role_code);

-- keycloak_webhook_events: audit cho mọi event từ Keycloak SPI
CREATE TABLE keycloak_webhook_events (
    id          UUID PRIMARY KEY,
    event_type  VARCHAR(50) NOT NULL,            -- USER_CREATED, USER_UPDATED, USER_DELETED, ...
    keycloak_user_id UUID NULL,
    tenant_id   UUID NULL,
    payload     JSONB NOT NULL,
    processed   BOOLEAN NOT NULL DEFAULT FALSE,
    received_at TIMESTAMPTZ NOT NULL,
    processed_at TIMESTAMPTZ NULL,
    error_msg   TEXT NULL
);
```

## API Overview

```
# User self-service (caller là chính user)
GET    /api/v1/users/me                          → User profile (từ Keycloak + users_extra)
PATCH  /api/v1/users/me                          → Cập nhật users_extra

# User management (caller có role ADMIN)
GET    /api/v1/users?tenantId=...&page=...       → List users
POST   /api/v1/users                             → Create user (gọi Keycloak Admin API + insert users_extra)
GET    /api/v1/users/{keycloakUserId}            → Detail
PATCH  /api/v1/users/{keycloakUserId}            → Update users_extra
DELETE /api/v1/users/{keycloakUserId}            → Disable user (Keycloak + users_extra.status)

# Permissions
GET    /api/v1/permissions                       → Effective permissions của current user
GET    /api/v1/permissions/{keycloakUserId}      → Effective permissions của 1 user

# App-specific roles
GET    /api/v1/users/{keycloakUserId}/roles      → List roles của 1 user
POST   /api/v1/users/{keycloakUserId}/roles      → Grant role
DELETE /api/v1/users/{keycloakUserId}/roles/{id} → Revoke role

# Webhook (Keycloak gọi vào)
POST   /webhooks/keycloak                        → Nhận event từ Keycloak SPI
```

## Keycloak Setup (1 lần)

```yaml
# docker-compose.yml (snippet)
services:
  keycloak:
    image: quay.io/keycloak/keycloak:24.0
    command: start --auto-reload --features=preview,token-exchange
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: ${KC_ADMIN_PASS}
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres/cachesol_platform
      KC_DB_USERNAME: cachesol
      KC_DB_PASSWORD: ${DB_PASS}
    ports:
      - "8080:8080"
```

### Keycloak Realm per Tenant (recommended)

- Mỗi tenant = 1 Keycloak realm (`acme`, `globex`, ...).
- Realm URL: `https://kc.platform.com/realms/acme`.
- Frontend redirect: `https://kc.platform.com/realms/acme/protocol/openid-connect/auth?client_id=web-shell&...`.
- **Trade-off:** nặng Keycloak hơn, nhưng cô lập user pools.

### Hoặc 1 Realm + tenant claim (lighter)

- 1 realm duy nhất `cachesol`.
- User có attribute `tenant_id` → Keycloak custom mapper → inject vào JWT.
- Frontend redirect với `login_hint=acme` → Keycloak tự check `tenant_id` claim từ LDAP attribute.

→ Bắt đầu với cách 1 realm (đơn giản, ít overhead). Nếu > 50 tenants hoặc cần cô lập user pool mới move sang per-realm.

## Custom JWT Claim: tenant_id

Keycloak hỗ trợ **Protocol Mapper** — inject claim vào JWT. Setup:

```
Keycloak Admin UI → Realm "cachesol" → Clients → web-shell → Mappers → Create
  - Name: tenant_id
  - Mapper Type: User Attribute
  - User Attribute: tenant_id
  - Token Claim Name: tenant_id
  - Claim JSON Type: String
```

Khi user login, frontend sẽ nhận JWT có claim `"tenant_id": "acme"`.

Backend `shared-security` đọc claim này → set `TenantContext` → filter SQL `WHERE tenant_id = ?`.

## Dependencies

- **Keycloak** (container riêng) — Source of Truth cho identity
- **PostgreSQL** schema `public` — `users_extra`, `user_app_roles`, `keycloak_webhook_events`
- **Kafka** — publish `UserCreatedEvent`, `RoleGrantedEvent` để app khác consume

## Domain Events

### Published
- `UserCreatedEvent` (keycloak_user_id, tenant_id)
- `UserUpdatedEvent` (keycloak_user_id, tenant_id, changed_fields)
- `UserDeactivatedEvent`
- `RoleGrantedEvent` (keycloak_user_id, application, role_code, org_scope_path)
- `RoleRevokedEvent`
- `LdapSyncCompletedEvent` (added, updated, removed counts)

### Consumed
- (không có)

## Configuration (application.yml)

```yaml
keycloak:
  server-url: https://kc.platform.com
  realm: cachesol
  client-id: iam-service
  client-secret: ${KC_IAM_SECRET}
  admin-client-id: admin-cli
  admin-username: ${KC_ADMIN_USER}
  admin-password: ${KC_ADMIN_PASS}
  jwk-refresh-interval: 3600000   # 1h

iam:
  default-tenant-slug: ${DEFAULT_TENANT:acme}
  sync:
    ldap-cron: "0 0 2 * * *"       # 2h sáng mỗi ngày
    webhook-queue-size: 10000
```

## Security Notes

- **KHÔNG BAO GIỜ** lưu password trong IAM DB — Keycloak làm.
- **JWT verify** bằng Keycloak JWK public key (rotate tự động mỗi 1h).
- **Tenant scope** enforcement: mọi query đều có `WHERE tenant_id = ?` — không bao giờ trust JWT claim mà không check DB.
- **Audit**: mọi admin action ghi vào `audit_logs` + publish Kafka event.

## Không có ở đây (đã làm ở chỗ khác)

- ❌ **Login/register UI** → Keycloak built-in (themeable)
- ❌ **Password reset flow** → Keycloak built-in
- ❌ **LDAP sync logic** → Keycloak User Federation (chỉ cần config LDAP server URL)
- ❌ **OAuth2 token issuance** → Keycloak
- ❌ **MFA (TOTP, WebAuthn)** → Keycloak built-in
- ❌ **Social login** → Keycloak Identity Brokering
