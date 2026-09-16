# API Patterns — 4 Prefix Convention

## Quy tắc

Mọi backend service trong CacheSol phải expose 4 loại API prefix riêng biệt, **KHÔNG trộn lẫn**. Mỗi prefix có audience và security policy rõ ràng.

| Prefix | Audience | Authorize | Ghi chú |
|--------|----------|-----------|---------|
| **`/client-api/v1/...`** | Web frontend, mobile app gọi vào | BẮT BUỘC có JWT (user JWT) | Subject = end-user. Có CSRF/CORS. |
| **`/service-api/v1/...`** | Service A gọi sang Service B | BẮT BUỘC có JWT (service JWT hoặc user JWT forward) | Subject = service account hoặc user được forward |
| **`/integration-api/v1/...`** | Từ hệ thống ngoài (webhook, third-party) | BẮT BUỘC có signature/HMAC verification | Thường là webhook nhận event, KHÔNG phải REST CRUD |
| **`/public-api/v1/...`** | Bất kỳ client nào (không cần auth) | KHÔNG cần authorize | Chỉ dùng cho data public (catalog, login page config...) |

## Cấu trúc URL

```
<prefix>/v1/<resource>
<prefix>/v1/<resource>/{id}
<prefix>/v1/<resource>/{id}/<sub-resource>
```

**Ví dụ đầy đủ:**

```
/client-api/v1/users
/client-api/v1/users/{id}
/client-api/v1/users/{id}/roles
/client-api/v1/users/{id}/permissions

/service-api/v1/permissions/check
/service-api/v1/tenants/{slug}/mini-apps
/service-api/v1/users/{keycloakUserId}

/integration-api/v1/webhooks/keycloak
/integration-api/v1/webhooks/payment-gateway

/public-api/v1/mini-apps/catalog
/public-api/v1/health
```

## Phân biệt rõ ràng

### `/client-api` vs `/service-api` — dùng khi nào?

```
/client-api/v1/users          ← Web SPA gọi để hiển thị danh sách user cho admin
/service-api/v1/users/{id}    ← HRM service gọi để lookup user metadata khi process request
```

| Tiêu chí | `client-api` | `service-api` |
|----------|--------------|---------------|
| Caller | Browser/Mobile | Service khác |
| Token | User JWT (lấy từ login user) | Service JWT (client_credentials) hoặc forward user JWT |
| Authorize | Check user permission (RBAC + org-scope) | Check service có quyền gọi không + scope |
| Logging | Log user_id, tenant_slug, request URI | Log service_id, tenant_slug, request URI |
| Rate limit | Per-user | Per-service |
| Audit | Ghi `audit_logs` (user action) | Ghi `service_call_logs` |

### `/integration-api` vs `/client-api`

```
/integration-api/v1/webhooks/keycloak   ← Keycloak gọi vào khi user lifecycle event
/client-api/v1/users                    ← Web SPA gọi để CRUD user
```

| Tiêu chí | `integration-api` | `client-api` |
|----------|-------------------|--------------|
| Caller | External system (Keycloak, payment gateway, Slack...) | Web/Mobile |
| Auth | HMAC signature, mTLS, hoặc API key | JWT |
| Rate limit | Per-IP/per-system | Per-user |
| Response | Async (200 OK + process in background) | Sync (REST CRUD) |

### `/public-api` — dùng khi nào?

Hạn chế tối đa. Chỉ dùng cho:

- Health check (`/public-api/v1/health`)
- Mini-app catalog public (giúp frontend render trang login marketing)
- Login page config (logo, theme) — user chưa login cần biết
- Public docs endpoint (OpenAPI spec)

**Không bao giờ** dùng `/public-api` cho data nhạy cảm.

## Mapping service nào expose prefix nào

| Service | `/client-api` | `/service-api` | `/integration-api` | `/public-api` |
|---------|---------------|----------------|--------------------|----------------|
| **iam** | — | — | `/webhooks/keycloak` | `/health` |
| **platform-registry** | `/tenants`, `/tenants/{slug}/mini-apps` | `/tenants`, `/tenants/{slug}/mini-apps` | — | `/mini-apps/catalog` |
| **tenant-manager** | `/users`, `/roles`, `/permissions` | `/permissions/check`, `/users/{id}` | — | — |
| **configuration** | `/configs`, `/features` | `/configs/{key}` | — | — |
| **master-data** | `/master-data/categories/{code}` | `/master-data/categories/{code}` | — | — |
| **social-integration** | `/client-api/v1/notifications/templates`, `/client-api/v1/channels`, `/client-api/v1/posts`, `/client-api/v1/pages` | `/service-api/v1/notifications/send` | `/integration-api/v1/webhooks/*` | — |
| **workflow** | `/workflows/deploy`, `/workflows/start` | `/workflows/start` | — | — |
| **approval** | `/client-api/v1/approval-types`, `/client-api/v1/approval-requests`, `/client-api/v1/approval-inbox`, `/client-api/v1/approval-steps/{id}/approve` | `/service-api/v1/approval-types/{code}/resolve-approvers`, `/service-api/v1/approval-requests` | — | `/health` |
| **HRM** | `/attendance`, `/leaves`, `/payroll`, `/recruitments`, `/performance`, `/training` | `/employees/{id}`, `/organizations/{id}/descendants` | — | — |
| **Sales** | `/customers`, `/orders` | `/customers/{id}` | — | — |
| **ERP, Finance, Marketing** | tương tự | tương tự | tương tự | tương tự |

## Implementation

### Spring Boot routing

```java
@Configuration
public class ApiRoutingConfig {
    @Bean
    public RouterFunction<ServerResponse> clientApiRoutes(UserHandler h) {
        return route()
            .path("/client-api/v1", () -> route()
                .GET("/users", h::list)
                .GET("/users/{id}", h::get)
                .POST("/users", h::create)
                // ...
                .build())
            .build();
    }

    @Bean
    public RouterFunction<ServerResponse> serviceApiRoutes(UserHandler h) {
        return route()
            .path("/service-api/v1", () -> route()
                .GET("/users/{id}", h::getById)
                .POST("/permissions/check", h::checkPermission)
                .build())
            .build();
    }
}
```

### Security filter chains (4 chain riêng)

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    @Order(1)
    public SecurityFilterChain publicApiChain(HttpSecurity http) {
        return http
            .securityMatcher("/public-api/**")
            .authorizeHttpRequests(a -> a.anyRequest().permitAll())
            .csrf(c -> c.disable())
            .build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain integrationApiChain(HttpSecurity http) {
        return http
            .securityMatcher("/integration-api/**")
            .authorizeHttpRequests(a -> a.anyRequest().authenticated())
            .oauth2ResourceServer(o -> o.jwt(j -> j.jwkSetUri(...)))
            // + HMAC filter riêng cho webhook
            .build();
    }

    @Bean
    @Order(3)
    public SecurityFilterChain serviceApiChain(HttpSecurity http) {
        return http
            .securityMatcher("/service-api/**")
            .authorizeHttpRequests(a -> a.anyRequest().authenticated())
            .oauth2ResourceServer(o -> o.jwt(j -> j.jwkSetUri(...)))
            // scope check: service must have 'service:<target-service>' scope
            .build();
    }

    @Bean
    @Order(4)
    public SecurityFilterChain clientApiChain(HttpSecurity http) {
        return http
            .securityMatcher("/client-api/**")
            .authorizeHttpRequests(a -> a.anyRequest().authenticated())
            .oauth2ResourceServer(o -> o.jwt(j -> j.jwkSetUri(...)))
            // + RBAC check (user_app_roles)
            .build();
    }
}
```

### Controller annotation (tuỳ chọn)

```java
@RestController
@RequestMapping("/client-api/v1/users")
@PreAuthorize("hasAnyRole('USER_ADMIN', 'SUPER_ADMIN')")
public class UserClientController { ... }

@RestController
@RequestMapping("/service-api/v1/users")
public class UserServiceController { ... }
```

## Quy tắc KHÔNG ĐƯỢC PHÉP

- ❌ Trộn lẫn prefix: `/api/v1/users` (KHÔNG — phải là `/client-api/v1/users` HOẶC `/service-api/v1/users`).
- ❌ `/client-api` cho service-to-service call.
- ❌ `/service-api` cho browser/mobile gọi vào.
- ❌ `/public-api` cho data nhạy cảm.
- ❌ `/integration-api` thiếu signature/HMAC verification.

## Quy tắc BẮT BUỘC

- ✅ Mỗi endpoint có 1 prefix duy nhất.
- ✅ Mỗi prefix có security policy riêng (filter chain riêng).
- ✅ Audit log ghi rõ prefix nào được gọi.
- ✅ Rate limit per-prefix.
- ✅ OpenAPI spec phân chia theo 4 prefix (4 file riêng hoặc 4 tag).

## OpenAPI / Swagger

```yaml
openapi: 3.1.0
info:
  title: CacheSol Service API
  version: 1.0.0
tags:
  - name: client-api
    description: Endpoints for Web/Mobile clients
  - name: service-api
    description: Endpoints for inter-service communication
  - name: integration-api
    description: Endpoints for external system webhooks
  - name: public-api
    description: Endpoints with no authentication required
```

## Lợi ích

1. **Audit rõ ràng** — biết ngay request đến từ user, service, hay external system.
2. **Security policy riêng** — `/client-api` enforce user JWT + RBAC, `/service-api` enforce service JWT + scope, `/integration-api` enforce HMAC.
3. **Rate limit chính xác** — per-user vs per-service vs per-IP.
4. **Migration an toàn** — thêm prefix mới cho version mới không ảnh hưởng prefix cũ.
5. **Phát hiện misuse** — log analytics thấy `/client-api` bị service gọi → cảnh báo.
