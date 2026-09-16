# IAM Service (Keycloak JWT Verifier — thin)

## Vai trò

IAM Service **CHỈ** làm 1 việc chính: **verify JWT do Keycloak phát hành** và cung cấp JWK cache cho gateway. Nó KHÔNG quản lý user, role, hay tenant metadata — tất cả những thứ đó nằm ở **tenant-config service** và **Keycloak** trực tiếp.

> **Lý do tách:** Keycloak đã có sẵn User/Role management UI + Admin API. Tự build thêm trong IAM là duplicate. Tất cả user/role/permission nghiệp vụ → tenant-config.

## Trách nhiệm (rất gọn)

| # | Trách nhiệm | Implementation |
|---|-------------|----------------|
| 1 | Verify JWT signature (RS256) với Keycloak public key | JWK cache, refresh mỗi 1h |
| 2 | Verify JWT claims (iss, aud, exp, nbf) | Validate trước khi pass xuống service khác |
| 3 | Cache JWK public key (rotating keys) | Caffeine cache TTL 1h |
| 4 | Nhận Keycloak webhook (user lifecycle events) | POST /webhooks/keycloak → log + forward Kafka |
| 5 | (Optional) Cung cấp endpoint `/api/v1/keys/jwks.json` cho client-side verify | Mirror của Keycloak JWKS |

## KHÔNG thuộc IAM (chuyển sang chỗ khác)

| Tính năng | Service mới |
|-----------|-------------|
| CRUD user, user_extra mapping | **tenant-config** |
| CRUD role/permission, user_app_roles | **tenant-config** |
| Tenant registry, org units metadata | **tenant-config** |
| Mini-apps registry | **tenant-config** |
| LDAP/SSO config | Keycloak (trực tiếp) |
| Login/register UI | Keycloak theme |

## Bounded Context (database)

IAM service về cơ bản **không cần DB riêng**. Nếu cần lưu trữ thì chỉ:

```sql
-- public.keycloak_webhook_events (audit cho events nhận từ Keycloak)
CREATE TABLE keycloak_webhook_events (
    id              UUID PRIMARY KEY,
    event_type      VARCHAR(50) NOT NULL,            -- USER_CREATED, USER_UPDATED, USER_DELETED, ...
    realm           VARCHAR(50) NOT NULL,
    keycloak_user_id UUID NULL,
    payload         JSONB NOT NULL,
    received_at     TIMESTAMPTZ NOT NULL,
    processed       BOOLEAN NOT NULL DEFAULT FALSE,  -- forward sang Kafka chưa
    error_msg       TEXT NULL
);
```

## API Overview

```
# Health
GET  /health/live
GET  /health/ready

# JWK mirror (cho client-side JWT verify)
GET  /api/v1/keys/jwks.json                    → Keycloak public keys (cache 1h)

# Webhook (Keycloak SPI gọi vào)
POST /webhooks/keycloak                        → Nhận event từ Keycloak SPI

# (Internal) JWKS for service-to-service verify
# Mỗi microservice KHÔNG gọi IAM mà dùng trực tiếp Keycloak JWKS endpoint.
# IAM chỉ làm layer bảo vệ tại gateway.
```

## JWT Verify (shared-security library)

Code thật nằm ở `src/backend/shared/shared-security/`. IAM service không implement lại logic này — gateway + các service khác đều dùng lib chung.

```java
// shared-security/src/main/java/.../KeycloakJwtDecoder.java
@Component
public class KeycloakJwtDecoder {
    private final JWKSource<SecurityContext> jwkSource;
    private final String expectedIssuer;
    private final String expectedAudience;

    public DecodedJwt decode(String token) {
        SignedJWT jwt = SignedJWT.parse(token);

        // 1. Verify signature
        JWKSelector selector = new JWKSelector(
            new JWKMatcher.Builder().keyID(jwt.getHeader().getKeyID()).build()
        );
        JWK jwk = jwkSource.get(selector, null).get();
        if (!jwt.verify(new DefaultJWSVerifier((RSAPublicKey) jwk.toRSAKey().toPublicKey()))) {
            throw new InvalidJwtException("Bad signature");
        }

        // 2. Verify iss
        if (!expectedIssuer.equals(jwt.getJWTClaimsSet().getIssuer())) {
            throw new InvalidJwtException("Bad issuer");
        }

        // 3. Verify aud
        if (!jwt.getJWTClaimsSet().getAudience().contains(expectedAudience)) {
            throw new InvalidJwtException("Bad audience");
        }

        // 4. Verify exp / nbf
        Date now = new Date();
        if (jwt.getJWTClaimsSet().getExpirationTime() != null
            && jwt.getJWTClaimsSet().getExpirationTime().before(now)) {
            throw new InvalidJwtException("Expired");
        }

        // 5. Extract claims
        return new DecodedJwt(
            jwt.getJWTClaimsSet().getSubject(),                              // keycloak_user_id
            jwt.getJWTClaimsSet().getStringClaim("tenant_id"),
            jwt.getJWTClaimsSet().getStringListClaim("realm_access.roles"),
            jwt.getJWTClaimsSet().getStringListClaim("resource_access.<client>.roles")
        );
    }
}
```

## Keycloak Setup (1 lần)

```yaml
# docker-compose.yml
services:
  keycloak:
    image: quay.io/keycloak/keycloak:24.0
    command: start --auto-reload
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: ${KC_ADMIN_PASS}
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/cachesol_platform
      KC_DB_USERNAME: cachesol
      KC_DB_PASSWORD: ${DB_PASS}
      KC_HOSTNAME: kc.platform.com
      KC_PROXY: edge
    ports:
      - "8080:8080"
```

## Keycloak Realms

### Chiến lược: 1 Realm per tenant (cô lập user pool)

Mỗi tenant = 1 Keycloak realm (`acme`, `globex`, `initech`). Realm URL: `https://kc.platform.com/realms/acme`.

**Lý do chọn per-realm:**
- User pool cô lập hoàn toàn giữa các công ty (bảo mật tốt hơn).
- LDAP Federation per-tenant (mỗi công ty có 1 LDAP server riêng).
- Theme riêng (logo, màu sắc) nếu cần.

**Trade-off:** Nặng Keycloak hơn (~50MB RAM / realm). Chấp nhận được.

### Realm bootstrap

Mỗi tenant mới được tạo qua **tenant-config service** → gọi Keycloak Admin API tạo realm:

```java
// tenant-config service gọi sang Keycloak
POST /admin/realms
{
  "realm": "tenant-acme",
  "enabled": true,
  "loginTheme": "cachesol",
  "userFederationProviders": [
    {
      "providerName": "ldap",
      "config": {
        "connectionUrl": ["ldap://ldap.acme.local:389"],
        "bindDn": ["cn=admin,dc=acme,dc=local"],
        "bindCredential": ["***"],
        "usersDn": ["ou=users,dc=acme,dc=local"],
        "usernameLDAPAttribute": ["sAMAccountName"]
      }
    }
  ]
}
```

## Custom Login Flow per tenant

**Mặc định:** Username + Password (Keycloak built-in flow `browser`).

**Tuỳ chỉnh theo từng công ty (sau này):** Keycloak hỗ trợ tạo custom flow qua Admin API:

```
POST /admin/realms/{realm}/authentication/flows
  - Flow "acme-strict": username → password → email-otp → success
  - Flow "globex-simple": username → password → success
  - Flow "acme-sso-only": org-mail-detection → saml-redirect → success
```

→ tenant-config lưu `login_flow_id` của mỗi tenant → bind với realm qua Keycloak API.

## SSO qua email công ty (Browser Flow + Conditional OTP)

Keycloak có sẵn **Conditional Authenticator** — phát hiện email domain → bật SSO hoặc bắt MFA.

```
Browser flow:
  1. Username/Password Form
  2. Conditional - Level:  ☐ Username/Password
  3. Conditional - Authenticator: ☐ Identity Provider Redirect
       Condition: User Attribute → email → matches-regex → "@acme\\.com$"
       THEN: redirect to IdP "acme-saml" (SAML SSO tới Okta/Azure-AD của ACME)
```

→ User có email `@acme.com` login → tự redirect qua SSO công ty ACME.
→ User có email bất kỳ khác → login username/password bình thường.

## LDAP Sync

Keycloak User Federation tự động sync:

```
Realm → User Federation → ldap provider
  Periodic Sync:
    Full sync:    ON  (cron: "0 0 2 * * *")  # 2h sáng
    Changed sync: ON  (every 60s)
  Cache Policy: NO_CACHE  # luôn query LDAP khi login
```

→ Nhân viên mới được thêm vào AD công ty ACME → tự động có user trong realm `acme` → có thể login ngay.

## IAM Service Configuration

```yaml
# application.yml (iam-service)
keycloak:
  server-url: https://kc.platform.com
  default-realm: cachesol-admin           # realm admin (super-user) để gọi Admin API
  admin-client-id: admin-cli
  admin-username: ${KC_SUPER_ADMIN}
  admin-password: ${KC_SUPER_ADMIN_PASS}

iam:
  jwks-cache-ttl: 3600000                 # 1h
  webhook:
    forward-to-kafka-topic: keycloak.events.<realm>
    max-retries: 3
```

## Security Notes

- IAM service KHÔNG lưu bất kỳ user credential nào.
- JWT verify ngay tại gateway, IAM service KHÔNG nằm trong hot path của mọi request (gateway cache JWK 1h).
- Webhook endpoint PHẢI có signature verification (HMAC-SHA256 từ Keycloak SPI).

## Xem thêm

- Tenant + user + role + mini-app registry: [`tenant-config/README.md`](../tenant-config/README.md)
- Multi-tenant schema: [`../../../governance/architecture/multi-tenant.md`](../../../governance/architecture/multi-tenant.md)
- JWT verify lib: [`../../shared/shared-security/`](../../shared/shared-security/)
