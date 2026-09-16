# Keycloak Integration Guide

## Tại sao Keycloak (thay vì build auth in-house)

| Tính năng | Build in-house | Keycloak |
|-----------|---------------|----------|
| Login (username/password) | 1 tuần | 5 phút (built-in) |
| Register + email verify | 1 tuần | 5 phút |
| Forgot/reset password | 1 tuần | 5 phút |
| OAuth2 / OIDC | 2-4 tuần | 5 phút |
| LDAP / Active Directory sync | 2-4 tuần | config UI |
| MFA (TOTP, WebAuthn) | 2-4 tuần | built-in |
| Social login (Google, FB) | 1-2 tuần | config UI |
| SAML SSO | 1-2 tuần | built-in |
| Brute-force protection | 1 tuần | built-in |
| Password policy | vài ngày | config UI |
| User federation (LDAP, Kerberos) | vài tuần | built-in |

→ Keycloak tiết kiệm **~6 tháng engineering** cho 1 team 2-3 người.

## Kiến trúc

```
┌────────────────────────────────────────────────────────────────┐
│                   CacheSol Enterprise Platform                  │
│                                                                  │
│  ┌──────────────┐    verify JWT    ┌──────────────────────────┐ │
│  │ shared-       │◄────────────────┤ Keycloak (24+)           │ │
│  │ security lib  │  public JWK     │                          │ │
│  │               │                 │ - Realm(s): acme, globex│ │
│  └──────┬────────┘                 │ - Users, Credentials     │ │
│         │                          │ - LDAP Federation        │ │
│         │ TenantContextFilter      │ - MFA, OAuth2, SAML      │ │
│         ▼                          │ - Themes (custom UI)     │ │
│  ┌──────────────┐   Admin API    │                          │ │
│  │ IAM Service  │◄───────────────┤                          │ │
│  │ (Spring Boot) │                └──────────────────────────┘ │
│  │               │                                              │
│  │ users_extra   │   Webhook SPI                                 │
│  │ user_app_roles│◄──────────────                                │
│  └──────┬────────┘                                                │
│         │ publish events                                          │
│         ▼                                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Kafka                                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

## Setup 1 lần (Docker Compose snippet)

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: cachesol_platform
      POSTGRES_USER: cachesol
      POSTGRES_PASSWORD: ${DB_PASS}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

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
    depends_on:
      - postgres
    ports:
      - "8080:8080"

  iam-service:
    build: ./src/backend/platform/iam
    environment:
      KEYCLOAK_SERVER_URL: http://keycloak:8080
      KEYCLOAK_REALM: cachesol
      KEYCLOAK_CLIENT_ID: iam-service
      KEYCLOAK_CLIENT_SECRET: ${KC_IAM_SECRET}
      KEYCLOAK_ADMIN_USERNAME: admin
      KEYCLOAK_ADMIN_PASSWORD: ${KC_ADMIN_PASS}
    depends_on:
      - keycloak
    ports:
      - "8081:8080"
```

## Tạo Realm khi có tenant mới

### Strategy: 1 Realm per tenant

Mỗi tenant = 1 Keycloak realm (`tenant-acme`, `tenant-globex`, ...). **Realm URL**: `https://kc.platform.com/realms/tenant-acme`.

**Lý do:**
- User pool cô lập giữa các công ty (user ACME không thấy user Globex).
- LDAP Federation per-tenant (mỗi công ty có 1 LDAP server riêng).
- Theme riêng (logo, màu sắc) nếu cần.
- Custom login flow per-tenant (sau này từng công ty customize).

**Trade-off:** Nặng Keycloak hơn (~50MB RAM / realm). Chấp nhận được.

### Realm bootstrap (qua tenant-config service)

Khi `tenant-config` tạo tenant mới → tự gọi Keycloak Admin API:

```java
// tenant-config service gọi sang Keycloak
POST /admin/realms
{
  "realm": "tenant-acme",
  "enabled": true,
  "displayName": "ACME Corporation",
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
  ],
  "browserFlow": "acme-flow"
}
```

→ Khi tạo tenant xong → đã có realm tương ứng, có LDAP sync, có user pool riêng.

## Protocol Mapper: inject `tenant_id` claim

Bước bắt buộc để JWT có `tenant_id`:

```
Keycloak Admin UI
  → Realm "cachesol"
  → Clients → web-shell
  → Mappers → Create mapper

  Name: tenant_id
  Mapper Type: User Attribute
  User Attribute: tenant_id
  Token Claim Name: tenant_id
  Claim JSON Type: String
  Add to ID token: ON
  Add to access token: ON
```

→ Khi user có LDAP attribute `tenant_id=acme`, JWT sẽ có claim `"tenant_id": "acme"`.

## Backend verify JWT (shared-security)

```java
// shared-security/src/main/java/com/cachesol/platform/shared/security/KeycloakJwtDecoder.java
@Component
public class KeycloakJwtDecoder {
    private final JWKSource<SecurityContext> jwkSource;
    private final String expectedIssuer;
    private final String expectedAudience;

    public Jwt decode(String token) {
        // 1. Parse JWS
        SignedJWT jwt = SignedJWT.parse(token);

        // 2. Verify signature với Keycloak public key
        JWSVerifier verifier = new DefaultJWSVerifier(
            (RSAPublicKey) jwkSource.get(JWKSelector.fromJWK(jwt.getHeader().getJWK()), null).get().getPublicKey()
        );
        if (!jwt.verify(verifier)) throw new InvalidTokenException("Bad signature");

        // 3. Verify iss
        if (!jwt.getJWTClaimsSet().getIssuer().equals(expectedIssuer))
            throw new InvalidTokenException("Bad issuer");

        // 4. Verify aud
        if (!jwt.getJWTClaimsSet().getAudience().contains(expectedAudience))
            throw new InvalidTokenException("Bad audience");

        // 5. Verify exp
        if (jwt.getJWTClaimsSet().getExpirationTime().before(new Date()))
            throw new InvalidTokenException("Expired");

        // 6. Extract claims
        String tenantId = jwt.getJWTClaimsSet().getStringClaim("tenant_id");
        String keycloakUserId = jwt.getJWTClaimsSet().getSubject();
        List<String> roles = jwt.getJWTClaimsSet().getStringListClaim("realm_access.roles");

        return new Jwt(keycloakUserId, tenantId, roles);
    }
}
```

## Keycloak Admin API (từ IAM service)

```java
@Component
public class KeycloakAdminClient {
    private final HttpClient http = HttpClient.newHttpClient();
    private final String adminBaseUrl = "http://keycloak:8080/admin/realms/cachesol";

    public String createUser(CreateUserRequest req) {
        // 1. Get access token (client credentials)
        String token = getAdminAccessToken();

        // 2. POST /admin/realms/{realm}/users
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(adminBaseUrl + "/users"))
            .header("Authorization", "Bearer " + token)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(toJson(req)))
            .build();

        HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());

        // 3. Response 201 Created + Location header chứa user ID
        return extractUserIdFromLocation(response.headers().firstValue("Location").orElseThrow());
    }
}
```

## Keycloak SPI Webhook (user lifecycle → IAM)

Setup:

```java
// Keycloak Event Listener SPI (deploy riêng)
public class CacheSolEventListener implements EventListenerProvider {
    @Override
    public void onEvent(Event event) {
        // Forward sang IAM service
        httpClient.post("http://iam-service:8080/webhooks/keycloak", event);
    }
}
```

Hoặc đơn giản hơn: bật Keycloak Event Listener và forward qua Logout/Event API.

## LDAP Federation (cho từng tenant)

```
Keycloak Admin UI
  → Realm "cachesol"
  → User Federation → Add LDAP provider

  Vendor: Active Directory (hoặc Other cho OpenLDAP)
  Connection URL: ldap://ldap.acme.local:389
  Bind DN: cn=admin,dc=acme,dc=local
  Bind Password: ***
  Users DN: ou=users,dc=acme,dc=local

  Search Base: ou=users,dc=acme,dc=local
  Username LDAP attribute: sAMAccountName   (AD) hoặc uid (OpenLDAP)
  LDAP User Object Classes: person, organizationalPerson, user
  LDAP Filter: (objectClass=user)

  Sync settings:
    Periodic full sync: ON (cron: "0 0 2 * * *" - 2h sáng)
    Periodic changed users sync: ON (every 60s)
    Cache policy: NO_CACHE
```

→ Khi nhân viên mới được thêm vào LDAP công ty ACME → Keycloak tự sync → user mới có trong realm → JWT có claim `tenant_id=acme`.

## Custom Theme (UI tiếng Việt)

```bash
# Trong keycloak/themes/cachesol/
keycloak/themes/cachesol/
├── login/
│   ├── login.ftl      ← custom login form
│   ├── register.ftl
│   ├── resources/css/login.css
│   └── messages/messages.properties   ← tiếng Việt
└── account/
    └── ...
```

Apply: Keycloak Admin → Realm Settings → Themes → Login theme = `cachesol`.

## Không gặp Keycloak (delegate cho Keycloak)

| Tính năng | Implementation |
|-----------|----------------|
| Login UI | Keycloak theme |
| Register UI | Keycloak theme |
| Forgot password | Keycloak built-in |
| Email verification | Keycloak built-in |
| MFA setup | Keycloak built-in |
| Social login button | Keycloak Identity Brokering |
| LDAP user creation | Keycloak User Federation |
| Password hashing | Keycloak (PBKDF2, bcrypt, Argon2) |
| Brute-force lockout | Keycloak built-in |

→ IAM service CHỈ lo:
- App-specific metadata (`users_extra`)
- App-specific roles (`user_app_roles` per-tenant + org-scoped)
- Webhook listener (đồng bộ vào DB riêng)
- API cho frontend: `/api/v1/users/me`, `/api/v1/permissions`
- Admin operations (qua Keycloak Admin API)
