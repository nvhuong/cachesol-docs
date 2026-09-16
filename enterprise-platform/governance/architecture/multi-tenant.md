# Multi-tenant Architecture (Schema-per-tenant)

## Tại sao Schema-per-tenant

| Strategy | Ưu | Nhược | Phù hợp |
|----------|----|----|---------|
| Shared DB + `tenant_id` column | Đơn giản, dễ migrate | Rủi ro data leak nếu quên `WHERE`, khó offboard | SaaS nhỏ, ít tenant |
| Schema-per-tenant (CHỌN) | Cô lập tốt, backup/restore per-tenant dễ, dễ offboard | Connection pool phức tạp hơn | **SaaS B2B multi-company** ← đây |
| Database-per-tenant | Cô lập cao nhất, có thể scale riêng | Overhead vận hành lớn | Enterprise lớn (>100 tenants) |

CacheSol phục vụ doanh nghiệp (B2B) — mỗi tenant là 1 công ty/tập đoàn. **Schema-per-tenant** là sweet spot.

## Layout database

```
cachesol_platform (1 PostgreSQL database)
│
├── schema: public
│   ├── tenants                       ← registry tất cả tenants
│   ├── flyway_schema_history         ← chỉ migrations của public
│   ├── users_extra                   ← IAM data cross-tenant
│   ├── user_app_roles                ← role app-specific
│   ├── keycloak_webhook_events       ← audit Keycloak events
│   └── ... Keycloak internal tables
│
├── schema: tenant_acme               ← dữ liệu riêng công ty ACME
│   ├── organizations                 ← cây tổ chức ACME
│   ├── employees                     ← nhân viên ACME
│   ├── job_titles
│   ├── employee_assignments
│   ├── customers                     ← (Sales data ACME)
│   ├── orders
│   ├── ...
│   └── flyway_schema_history         ← migrations đã chạy cho schema này
│
├── schema: tenant_globex
│   └── ... (cùng cấu trúc)
│
└── (large tenants có thể move sang database riêng cachesol_<slug>)
```

## Bảng `public.tenants`

```sql
CREATE TABLE tenants (
    id              UUID PRIMARY KEY,
    slug            VARCHAR(50) UNIQUE NOT NULL,       -- 'acme', 'globex'
    schema_name     VARCHAR(63) UNIQUE NOT NULL,       -- 'tenant_acme'
    display_name    VARCHAR(255) NOT NULL,
    plan            VARCHAR(20) NOT NULL DEFAULT 'trial',
    status          VARCHAR(20) NOT NULL DEFAULT 'active',
    region          VARCHAR(20) NOT NULL DEFAULT 'vn',  -- for future geo-routing
    created_at      TIMESTAMPTZ NOT NULL,
    offboarded_at   TIMESTAMPTZ NULL
);
```

## Tenant resolution

### Qua subdomain (production)

```
acme.platform.com → JWT claim tenant_id="acme" (set bởi Keycloak login)
                    ↓
                  shared-security filter đọc claim → set schema = "tenant_acme"
```

### Qua header (internal API / CLI)

```
X-Tenant-Id: acme
```

### TenantContextFilter (shared-security)

```java
@Component
public class TenantContextFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) {
        String tenantSlug = extractTenantSlug(req);  // từ JWT claim hoặc X-Tenant-Id
        Tenant tenant = tenantRepository.findBySlug(tenantSlug)
            .orElseThrow(() -> new TenantNotFoundException(tenantSlug));

        // 1. Set schema cho connection
        DataSourceContextHolder.setSchema(tenant.getSchemaName());

        // 2. Set MDC cho logging
        MDC.put("tenant_id", tenant.getId().toString());
        MDC.put("tenant_slug", tenant.getSlug());

        try {
            chain.doFilter(req, res);
        } finally {
            DataSourceContextHolder.clear();
            MDC.remove("tenant_id");
            MDC.remove("tenant_slug");
        }
    }
}
```

### Schema routing trong HikariCP

Dùng `Spring AbstractRoutingDataSource` hoặc custom DataSource proxy:

```java
public class TenantAwareDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        return TenantContext.getSchemaName();  // "tenant_acme" hoặc "public"
    }

    @Override
    public Connection getConnection() throws SQLException {
        Connection conn = super.getConnection();
        try (Statement stmt = conn.createStatement()) {
            stmt.execute("SET search_path TO " + TenantContext.getSchemaName() + ", public");
        }
        return conn;
    }
}
```

## Flyway multi-schema migration

```yaml
# application.yml (cho service có data per-tenant)
spring:
  flyway:
    enabled: true
    schemas: public  # Flyway quản lý schema "public" cho cross-tenant data
    locations: classpath:db/migration/public

# Custom: migrate tất cả tenant schemas
cachesol:
  tenant-migration:
    schemas-pattern: "tenant_*"
    locations: classpath:db/migration/tenant
    on-startup: true
```

```java
@Component
public class TenantSchemaMigrator {
    @EventListener(ApplicationReadyEvent.class)
    public void migrateAllTenantSchemas() {
        List<String> schemas = tenantRepository.findAll().stream()
            .map(Tenant::getSchemaName)
            .toList();

        for (String schema : schemas) {
            TenantContext.setSchema(schema);
            flyway.migrate();  // chạy migration cho schema này
            TenantContext.clear();
        }
    }
}
```

## Cross-tenant query (chỉ IAM / Admin)

IAM service và admin tools mới có quyền query cross-tenant. Lập trình viên application **KHÔNG BAO GIỜ** được query bỏ qua `WHERE tenant_id = ?`.

Để đảm bảo:
- Mọi Repository method đều extend `TenantAwareRepository<T>` (auto-inject `tenant_id` filter).
- Test tự động: gọi endpoint mà không có `X-Tenant-Id` → expect 400.
- Code review checklist: PR nào query DB mà không có `tenant_id` → reject.

## Offboarding tenant

```
1. Set tenants.status = 'offboarding'
2. Run export job → dump tenant_<slug> data ra file (cho legal/audit)
3. Run anonymization job → thay PII bằng hash
4. DROP SCHEMA tenant_<slug> CASCADE;
5. Set tenants.offboarded_at = NOW()
6. Publish TenantOffboardedEvent (audit)
```

## Quy tắc KHÔNG ĐƯỢC PHÉP

- ❌ Lưu `tenant_id` thành column trong bảng data (trừ `users_extra`, `user_app_roles` ở public) — schema đã là tenant scope.
- ❌ Query cross-tenant từ application service — chỉ IAM/admin tools.
- ❌ Hard-code schema name — luôn qua `TenantContext.getSchemaName()`.
- ❌ Dùng 1 connection pool cho mọi schema — phải có routing.

## Performance

- Connection pool size: `10 connections × số tenants đang active` (giới hạn max=200).
- Cache: `organizations_tree` cache 30 phút per tenant (Redis).
- Hot tenants (>1000 employees): xem xét move sang database riêng.
