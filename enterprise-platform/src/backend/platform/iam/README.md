# IAM Service (Keycloak Realm & User Manager — thin wrapper)

## Vai trò

IAM Service là một **thin wrapper** của **Keycloak Admin API** với phạm vi **RẤT HẸP**:

> **Chỉ quản lý Keycloak Realms và Users. KHÔNG quản lý Groups, KHÔNG quản lý Roles** —
> những thứ đó thuộc `tenant-manager` (org tree, app permissions) hoặc dùng trực tiếp
> Keycloak Admin UI.

Mục tiêu chính:

1. Cho phép `platform-registry` **tạo / xoá Keycloak realm** khi on/offboard tenant.
2. Cho phép `tenant-manager` **CRUD user** trong Keycloak realm của từng tenant.
3. (Tuỳ chọn) **Custom login theme per tenant** — mỗi tenant có thể có giao diện đăng nhập riêng.

## Trách nhiệm

| # | Trách nhiệm | Implementation |
|---|-------------|----------------|
| 1 | Provision Keycloak realm khi tạo tenant | `POST /service-api/v1/realms/provision` |
| 2 | Xoá Keycloak realm khi offboard tenant | `DELETE /service-api/v1/realms/{name}` |
| 3 | Inspect realm metadata | `GET /service-api/v1/realms/{name}` |
| 4 | CRUD user trong realm | `POST/GET/PATCH/DELETE /service-api/v1/users/**` |
| 5 | Reset password cho user | `PUT /service-api/v1/users/{id}/password` |
| 6 | Gán / thu hồi realm role cho user | `POST/DELETE /service-api/v1/users/{id}/roles/**` |
| 7 | Liệt kê realm roles | `GET /service-api/v1/realms/{name}/roles` |
| 8 | Verify JWT do Keycloak phát hành (JWK cache) | `shared-security` lib |
| 9 | Nhận Keycloak webhook (user lifecycle) → Kafka | `POST /integration-api/v1/webhooks/keycloak` |

## KHÔNG thuộc IAM (chuyển sang chỗ khác)

| Tính năng | Service mới |
|-----------|-------------|
| **Keycloak Groups** (org tree node) | **tenant-manager** (Keycloak Admin API trực tiếp từ tenant-manager nếu cần) |
| App-level roles / permissions (`user_app_roles`) | **tenant-manager** |
| Tenant registry, mini-apps catalog | **platform-registry** |
| LDAP/SSO config | Keycloak Admin UI / `tenant-manager` |
| Login/register UI (theme rendering) | **Keycloak** (theme files) |
| User business metadata (`users_extra`) | **tenant-manager** |

> ⚠️ IAM service **KHÔNG** quản lý Keycloak Groups. Nếu cần org-tree, dùng Keycloak
> Admin UI trực tiếp hoặc để `tenant-manager` gọi Keycloak Admin API.

## API endpoints (tất cả dưới `/service-api/v1/**`)

### Realms

```
POST   /service-api/v1/realms/provision          → Tạo Keycloak realm + optional super-admin
DELETE /service-api/v1/realms/{name}             → Xoá realm (offboard tenant)
GET    /service-api/v1/realms/{name}             → Inspect realm metadata
```

### Realm roles (giữ lại cho inspection — KHÔNG tạo/xoá role)

```
GET    /service-api/v1/realms/{name}/roles       → Liệt kê roles trong realm
```

### Users

```
POST   /service-api/v1/users                     → Tạo user trong realm (header X-Realm)
GET    /service-api/v1/users/{id}                → Lấy user theo id
GET    /service-api/v1/users/by-username/{u}     → Lấy user theo username
PATCH  /service-api/v1/users/{id}                → Update user (email, firstName, lastName, enabled, ...)
DELETE /service-api/v1/users/{id}                → Xoá user
PUT    /service-api/v1/users/{id}/password       → Reset password (body: {password, temporary})
POST   /service-api/v1/users/{id}/roles          → Gán realm role(s)
DELETE /service-api/v1/users/{id}/roles/{role}   → Thu hồi realm role
GET    /service-api/v1/users/{id}/roles          → Liệt kê roles của user
```

### Other prefixes

```
GET    /public-api/v1/health/live                → Health check (no auth)
GET    /public-api/v1/health/ready               → Health check (no auth)
POST   /integration-api/v1/webhooks/keycloak     → Keycloak SPI webhook (HMAC verified)
```

> **Không có `/client-api` ở IAM** — client không bao giờ gọi trực tiếp IAM. Tất cả
> flow đều là service-to-service.

## Provision Realm với custom login theme

```http
POST /service-api/v1/realms/provision
Content-Type: application/json

{
  "realm": "tenant-acme",
  "displayName": "ACME Corporation",
  "loginTheme": "acme-theme",         // ← optional: Keycloak login theme
  "initialRoles": ["COMPANY_ADMIN"],
  "superAdmin": {
    "username": "root",
    "email": "root@acme.com",
    "firstName": "Root",
    "lastName": "Admin",
    "password": "ChangeMe123!",
    "realmRoles": ["COMPANY_ADMIN"]
  }
}
```

**Field `loginTheme` (tuỳ chọn):**

- Nếu **không truyền** → Keycloak dùng default theme (`keycloak.v2`).
- Nếu **truyền** → realm sẽ dùng theme có tên tương ứng (vd. `"acme-theme"`).
- Theme phải tồn tại trong Keycloak trước khi realm được tạo (mount
  `./keycloak/themes:/opt/keycloak/themes:ro` trong docker-compose).

**Ví dụ cấu trúc theme:**

```
keycloak/themes/
├── acme-theme/
│   └── login/
│       ├── theme.properties
│       ├── login.ftl
│       ├── resources/css/login.css
│       └── resources/img/logo.png
├── globex-theme/
│   └── login/...
└── cachesol/
    └── login/...        # default cho realm 'cachesol' (init-keycloak.sh)
```

> 💡 MVP: chưa có custom theme. Có thể bật bằng cách uncomment dòng
> `./keycloak/themes:/opt/keycloak/themes:ro` trong `docker-compose.mvp.yml`.

## Tenant provisioning flow

```
platform-registry                          IAM service                  Keycloak
─────────────────                          ───────────                  ────────
POST /tenants
  │
  ├─ INSERT tenant (DB) 
  │
  ├─► POST /service-api/v1/realms/provision ──► create realm ────────────► POST /admin/realms
  │                                            │                            │
  │                                            ◄────────── 201 Created ─────┤
  │
  ├─ publish Kafka: tenant.created
  │
  └─► 200 OK { tenantId, slug, ... }
```

## User management flow

```
tenant-manager                            IAM service                  Keycloak
──────────────                            ───────────                  ────────
POST /tenants/{slug}/users
  │
  ├─ validate user payload
  │
  ├─► POST /service-api/v1/users ─────────► createUser() ──────────────► POST /admin/realms/{realm}/users
  │   (X-Realm: tenant-acme)                │
  │   { username, email, ... }              ◄────────── KeycloakUserResponse ─────┤
  │
  ├─ INSERT users_extra (DB) ←─────────── NOTE: IAM KHÔNG quản lý user_extra.
  │                                    Đó là việc của tenant-manager DB.
  │
  └─► 200 OK { userId, ... }
```

## JWT Verify (chỉ verify, không issue)

```java
// shared-security/src/main/java/.../KeycloakJwtDecoder.java
@Component
public class KeycloakJwtDecoder {
    public DecodedJwt decode(String token) {
        // 1. Verify signature (RS256) với Keycloak JWK
        // 2. Verify iss / aud / exp / nbf
        // 3. Return DecodedJwt(subject, tenant_id, realm_access.roles, ...)
    }
}
```

Chi tiết xem ở `shared/shared-security/`. Gateway + tất cả service dùng lib chung.

## IAM Service Configuration

```yaml
# application.yml (iam-service)
keycloak:
  server-url: ${KEYCLOAK_URL}
  default-realm: master                    # realm admin (super-user) để gọi Admin API
  admin-client-id: ${KEYCLOAK_ADMIN_CLIENT:-admin-cli}
  admin-username: ${KEYCLOAK_ADMIN_USER}
  admin-password: ${KEYCLOAK_ADMIN_PASSWORD}

iam:
  jwks-cache-ttl: 3600000                  # 1h
  webhook:
    forward-to-kafka-topic: keycloak.events.<realm>
    hmac-secret: ${KC_WEBHOOK_HMAC_SECRET}
    max-retries: 3
```

## Keycloak Setup (1 lần, xem `docker-compose.mvp.yml`)

```yaml
services:
  keycloak:
    image: quay.io/keycloak/keycloak:25.0
    command: ["start-dev", "--http-port=8080", "--health-enabled=true"]
    environment:
      KC_BOOTSTRAP_ADMIN_USERNAME: admin
      KC_BOOTSTRAP_ADMIN_PASSWORD: ${KC_ADMIN_PASS}
    # Mount custom login themes (uncomment when ready):
    # volumes:
    #   - ./keycloak/themes:/opt/keycloak/themes:ro
```

## Security Notes

- IAM service **KHÔNG** lưu bất kỳ user credential nào — chỉ proxy sang Keycloak.
- Webhook endpoint PHẢI có HMAC signature verification (Keycloak SPI ký event với shared secret).
- Tất cả endpoint dưới `/service-api/v1/**` đều là **service-to-service** (gọi từ
  `platform-registry`, `tenant-manager`). Có thể bật mTLS hoặc shared secret tầng
  network giữa các service trong cùng docker network.

## Xem thêm

- API patterns (4 prefix): [`../../../governance/architecture/api-patterns.md`](../../../governance/architecture/api-patterns.md)
- Tenants + mini-apps: [`../platform-registry/README.md`](../platform-registry/README.md)
- User + role + org tree: [`../tenant-manager/README.md`](../tenant-manager/README.md)
- Multi-tenant: [`../../../governance/architecture/multi-tenant.md`](../../../governance/architecture/multi-tenant.md)
- Keycloak chi tiết: [`../../../governance/architecture/keycloak.md`](../../../governance/architecture/keycloak.md)
