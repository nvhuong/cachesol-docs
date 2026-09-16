# Feature Flag Service

## Vai trò

`feature-flag` là centralized **feature toggle / feature flag** service cho toàn bộ platform. Service này dựa trên **[FF4j (Feature Flipping for Java)](https://github.com/ff4j/ff4j)** open-source — **self-hosted từ GitHub source** (không dùng SaaS), bao gồm:

- **FF4j core** — feature toggle engine (Spring Boot starter).
- **FF4j WebConsole** — UI quản trị flips (toggle on/off real-time).
- **FF4j REST API** — admin/property/feature operations.
- **FF4j Store** — PostgreSQL backing store (thay thế default in-memory).

## Bounded Context

| # | BC | Vai trò |
|---|----|---------|
| 1 | **Feature** | Catalog feature flags (`feature_uid`, `enable`, `description`, `group`) |
| 2 | **Feature Property** | Custom properties gắn với feature (config params cho flip strategy) |
| 3 | **Flipping Strategy** | Rule bật/tắt: simple, Pct, ReleaseDate, Expression, ... |
| 4 | **Audit** | Lịch sử thay đổi flip (FF4j EventBus → log) |

> **Lưu ý:** Service này **CHỈ quản lý feature flags**. System params (key/value config chung) và tenant config được gộp vào `tenant-manager` (per-tenant metadata) hoặc inject qua env vars. Chỉ giữ lại những gì FF4j hỗ trợ.

## FF4j — Self-Host từ GitHub

```
Repo:    https://github.com/ff4j/ff4j
Modules: ff4j-core, ff4j-web, ff4j-spring-boot-starter, ff4j-store-jdbc

Build lại từ source (không pull Maven Central):
  git clone https://github.com/ff4j/ff4j.git
  mvn -pl ff4j-core,ff4j-spring-boot-starter,ff4j-store-jdbc,ff4j-web -am install -DskipTests
```

Spring Boot setup:

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.ff4j</groupId>
    <artifactId>ff4j-spring-boot-starter</artifactId>
    <version>3.x.x-local</version>          <!-- version build từ GitHub source -->
</dependency>
<dependency>
    <groupId>org.ff4j</groupId>
    <artifactId>ff4j-store-jdbc</artifactId> <!-- PostgreSQL backing store -->
    <version>3.x.x-local</version>
</dependency>
```

```yaml
# application.yml
ff4j:
  web-console:
    enabled: true
    path: /ff4j-web-console
  store:
    jdbc:
      enabled: true
      datasource: dataSource                    # Spring Boot DataSource
      schema: PUBLIC                            # FF4j default schema
      autocreate: false                         # Liquibase/Flyway tự tạo
  auditing:
    enabled: true
    repository: jdbc
```

## Schema layout

```
cachesol_platform (1 PostgreSQL DB)
└── schema: ff4j                              ← FF4j native schema (giữ nguyên từ FF4j)
    ├── ff4j_features                         ← feature catalog
    ├── ff4j_properties                       ← feature custom properties
    ├── ff4j_roles                            ← role → feature mapping
    ├── ff4j_groups                           ← group → feature mapping
    ├── ff4j_audit                            ← audit log
    └── ff4j_user_roles

(schema này do Liquibase/Flyway tạo từ FF4j DDL gốc — KHÔNG custom)
```

> **Per-tenant:** FF4j là single-tenant. Để có per-tenant feature flags, dùng namespace convention trong `feature_uid`: `tenant_<slug>.<feature>` hoặc dùng FF4j multi-domain extension.

---

## 1. Feature (BC #1)

```sql
-- Schema FF4j gốc (KHÔNG sửa)
CREATE TABLE ff4j_features (
    feat_uid       VARCHAR(100) PRIMARY KEY,
    enable         INTEGER NOT NULL DEFAULT 0,
    description    VARCHAR(255) NULL,
    group_name     VARCHAR(100) NULL,
    flipping_strategy VARCHAR(255) NULL,
    creation_date  TIMESTAMP NULL,
    update_date    TIMESTAMP NULL
);
```

### Naming Convention

```
Format: <scope>.<module>.<feature_name>

scope:       GLOBAL | TENANT_<slug>
module:      HRM | SALES | ERP | WORKFLOW | NOTIFICATION | ...
feature:     enable_dark_mode, require_2fa, max_leave_days, ...

Examples:
  GLOBAL.HRM.enable_on_boarding_v2
  GLOBAL.SALES.show_discount_field
  TENANT_acme.WORKFLOW.require_2step_approval
  TENANT_acme.NOTIFICATION.enable_sms
```

### API (FF4j REST API gốc — không custom)

```
# FF4j native API (prefix /ff4j hoặc /api/ff4j — config trong application.yml)
GET    /api/ff4j/store/features                          ← List tất cả features
GET    /api/ff4j/store/features/{uid}                    ← 1 feature
POST   /api/ff4j/store/features/{uid}/enable             ← Enable
POST   /api/ff4j/store/features/{uid}/disable            ← Disable
POST   /api/ff4j/store/features                          ← Create
DELETE /api/ff4j/store/features/{uid}                    ← Delete
POST   /api/ff4j/store/features/{uid}/grant/{role}       ← Grant role
POST   /api/ff4j/store/features/{uid}/revoke/{role}      ← Revoke role
```

---

## 2. Feature Property (BC #2)

```sql
CREATE TABLE ff4j_properties (
    property_id    VARCHAR(100) NOT NULL,
    class_name     VARCHAR(255) NOT NULL,
    feat_uid       VARCHAR(100) NOT NULL,
    value          VARCHAR(255) NULL,
    description    VARCHAR(255) NULL,
    creation_date  TIMESTAMP NULL,
    update_date    TIMESTAMP NULL,
    PRIMARY KEY (property_id, feat_uid)
);
```

Ví dụ: feature `enable_dark_mode` có properties:
- `theme_color` = `#1a1a1a`
- `font_size` = `14`

## 3. Flipping Strategy (BC #3)

| Strategy | Ý nghĩa | Use case |
|----------|---------|----------|
| `org.ff4j.strategy.simple.AlwaysOnFlipStrategy` | Always on/off | Default |
| `org.ff4j.strategy.PctFlipStrategy` | % user được enable | Canary release |
| `org.ff4j.strategy.release.DateReleaseFlipStrategy` | Enable sau 1 ngày | Scheduled release |
| `org.ff4j.strategy.expression.ExpressionFlipStrategy` | SpEL expression | Complex rules |
| `org.ff4j.strategy.BlackListFlipStrategy` | Blacklist UID | Disable cho 1 số user |
| `org.ff4j.strategy.ClientFilterFlipStrategy` | Filter theo hostname/client | A/B test |

Ví dụ PctFlipStrategy:

```sql
UPDATE ff4j_features
SET flipping_strategy = 'org.ff4j.strategy.PctFlipStrategy'
WHERE feat_uid = 'GLOBAL.HRM.enable_on_boarding_v2';

INSERT INTO ff4j_properties (property_id, class_name, feat_uid, value) VALUES
('percentage', 'java.lang.Double', 'GLOBAL.HRM.enable_on_boarding_v2', '20');
```

---

## 4. Audit (BC #4)

FF4j ghi audit log khi feature bị enable/disable:

```sql
CREATE TABLE ff4j_audit (
    evt_uuid      VARCHAR(40) NOT NULL,
    evt_type      VARCHAR(20) NOT NULL,
    evt_action    VARCHAR(20) NOT NULL,
    evt_target    VARCHAR(100) NULL,
    evt_datas     VARCHAR(500) NULL,
    evt_user      VARCHAR(100) NULL,
    evt_timestamp TIMESTAMP NOT NULL
);
```

## WebConsole

FF4j cung cấp sẵn WebConsole đầy đủ chức năng:

```
URL:      /ff4j-web-console
Auth:     Spring Security (admin role)
Features:
  - List features (filter by group)
  - Toggle on/off real-time
  - Edit flipping strategy + properties
  - Audit log viewer
  - Import/export features (zip file)
```

> **Production:** BẮT BUỘC bảo vệ WebConsole bằng JWT (role=PLATFORM_ADMIN) và chỉ mở trong internal network.

---

## Cách dùng từ service khác

### 5.1 Dependency (Spring Boot)

```xml
<!-- shared-common lib — dùng cho mọi service -->
<dependency>
    <groupId>org.ff4j</groupId>
    <artifactId>ff4j-client</artifactId>
    <version>3.x.x-local</version>
</dependency>
```

### 5.2 HTTP API (cho non-Java services hoặc service độc lập)

```
# Check feature (cho service khác — gọi qua HTTP, không phải Spring embed)
POST   /service-api/v1/feature-flags/{featureUid}/check
   Body: { "userId": "uuid", "attributes": { "role": "HRM", "tenant": "acme" } }
   → 200 OK if enabled, 404 if disabled

GET    /service-api/v1/feature-flags/{featureUid}/properties
GET    /service-api/v1/feature-flags/search?group=HRM
GET    /service-api/v1/feature-flags/{featureUid}/status
```

### 5.3 Java embed (preferred — cùng JVM)

```java
@Service
public class OnBoardingService {
    @Autowired FF4j ff4j;

    public void onBoard(User user) {
        if (ff4j.check("GLOBAL.HRM.enable_on_boarding_v2")) {
            newOnBoardingFlow(user);
        } else {
            legacyOnBoardingFlow(user);
        }
    }
}
```

---

## Cache & Performance

- **L1 Cache**: FF4j core có in-memory cache (`FeatureStore caching`).
- **L2 Cache**: Redis (qua `ff4j-cache-redis`) — TTL 60s, invalidate khi admin toggle.
- **Latency target**: < 5ms (in-memory), < 20ms (Redis).

```yaml
ff4j:
  cache:
    redis:
      enabled: true
      ttl: 60
```

---

## API tổng quan (4 prefix pattern)

```
# CLIENT-API — Web/Mobile (user JWT, role=PLATFORM_ADMIN)
/client-api/v1/feature-flags                                ← Wrapper cho FE (FF4j WebConsole cũng expose)
/client-api/v1/feature-flags/{uid}
POST /client-api/v1/feature-flags/{uid}/enable
POST /client-api/v1/feature-flags/{uid}/disable
/client-api/v1/feature-flags/{uid}/properties

# SERVICE-API — service-to-service (service JWT)
/service-api/v1/feature-flags/{uid}/check
/service-api/v1/feature-flags/{uid}/status
/service-api/v1/feature-flags/{uid}/properties
/service-api/v1/feature-flags/search?group=HRM

# FF4j native API (giữ nguyên) — cho internal tooling
GET    /api/ff4j/store/features
POST   /api/ff4j/store/features/{uid}/enable
...

# FF4j WebConsole (UI)
/ff4j-web-console

# PUBLIC-API
/public-api/v1/health
```

## Dependencies

| Dependency | Vai trò |
|------------|---------|
| **FF4j (self-host)** | Feature toggle engine (GitHub source, build local) |
| **PostgreSQL** | FF4j store schema |
| **Redis** | Cache L2 (optional) |
| **Keycloak** | JWT verify cho API (qua iam-service) |
| **Kafka** | Publish `FeatureFlagChangedEvent` cho cache invalidation |

## Domain Events Published

```
FeatureFlagChangedEvent    (feat_uid, enabled, by)
FeatureFlagStrategyChangedEvent
FeatureFlagPropertyChangedEvent
```

## Quy tắc quan trọng

1. **Naming convention**: `<scope>.<module>.<feature_name>` — luôn dùng scope (`GLOBAL` hoặc `TENANT_<slug>`) để tránh nhầm lẫn.
2. **Không custom schema FF4j**: dùng nguyên schema gốc từ FF4j. Custom rule → dùng custom FlippingStrategy class.
3. **WebConsole auth**: chỉ role=PLATFORM_ADMIN, chỉ internal network.
4. **Audit bắt buộc**: mọi thay đổi feature phải qua FF4j EventBus → log vào `ff4j_audit`.
5. **Cache invalidation**: khi toggle feature, publish Kafka event để các service xoá cache L1.
6. **Version FF4j**: luôn pin version build từ GitHub source — không dùng Maven Central.

## Xem thêm

- FF4j GitHub: https://github.com/ff4j/ff4j
- IAM JWT verify: [`../iam/README.md`](../iam/README.md)
- Workflow dùng feature-flag để gate: [`../workflow/README.md`](../workflow/README.md)
- API patterns: [`../../../governance/architecture/api-patterns.md`](../../../governance/architecture/api-patterns.md)
