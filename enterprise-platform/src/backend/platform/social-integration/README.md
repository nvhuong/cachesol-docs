# Social Integration Service

## Vai trò

`social-integration` là service tích hợp tất cả các kênh giao tiếp và truyền thông của nền tảng:

| # | Bounded Context | Mô tả |
|---|----------------|--------|
| 1 | **Notifications** | Gửi notification đa kênh: email, SMS, push (FCM/Apple), in-app |
| 2 | **Channels** | Quản lý kết nối OAuth + credentials tới các nền tảng bên thứ ba |
| 3 | **Posts** | Publish content + đọc engagement (likes, shares, comments, replies) từ các nền tảng |
| 4 | **Pages** | Quản lý Facebook Pages, Instagram Business, LinkedIn Pages, YouTube Channels |
| 5 | **Analytics** | Engagement metrics tổng hợp từ các nền tảng |

## Supported Platforms

| Nền tảng | Channels | Posts | Pages | Notifications |
|-----------|---------|-------|-------|--------------|
| **Firebase** (FCM/APNs) | — | — | — | Push notification |
| **Gmail / Google Workspace** | Email (send) | — | — | Email notification |
| **Facebook** (Meta) | Messenger bot, comment | Page posts, stories | ✓ (Pages API) | In-app notification |
| **Instagram** (Meta) | DM, comment | Feed/Reels posts | ✓ (Business API) | — |
| **LinkedIn** | InMail, message | Company posts, articles | ✓ (Organization API) | — |
| **Slack** | Channel messages, DMs | — | — | Notification |
| **Telegram** | Bot messages, channel posts | ✓ | — | Notification |
| **YouTube** | — | Video posts, community posts | ✓ (YouTube Data API) | — |
| **Zalo** | Zalo OA messages | Zalo OA feed posts | ✓ (Zalo OA API) | Notification |
| **X (Twitter)** | DM, tweet replies | ✓ (v2 API) | — | Notification |
| **Threads** (Meta) | — | ✓ | — | — |
| **Viber** | Messages, broadcast | — | — | Notification |
| **SMS Gateway** (VNFPT, Twilio) | SMS | — | — | SMS notification |
| **In-App** | Real-time notification | — | — | ✓ (WebSocket) |

## Schema layout

```
cachesol_platform (1 PostgreSQL DB)
├── schema: public
│   ├── channel_definitions           ← catalog các platform được hỗ trợ
│   ├── channel_connections           ← kết nối OAuth / credentials per-tenant
│   └── social_analytics_cache        ← cache analytics từ platform (refresh 1h)
│
└── schema: tenant_<slug>_socialintegration
    ├── notification_templates        ← template notification (title, body, data)
    ├── notification_history          ← log lịch sử gửi
    ├── channel_credentials          ← encrypted OAuth tokens, API keys (per-tenant)
    ├── pages                        ← connected pages per-tenant
    ├── posts                        ← posts đã publish + metadata
    ├── post_engagements             ← engagement data (likes, shares, comments...)
    └── flyway_schema_history
```

---

## 1. Notifications (BC #1)

### Chiến lược Multi-Channel

```
Service gọi: notificationService.send(channel, template, recipient, data)
                           │
                           ▼
                    ChannelRouter
                    ┌─────────┬─────────┬──────────┬───────┐
                    │  Email  │   SMS   │   Push   │In-App │
                    └────┬────┴────┬────┴────┬─────┴───┬───┘
                         │         │         │         │
                         ▼         ▼         ▼         ▼
                    SendGrid   Twilio    Firebase   WebSocket
                    SMTP       VNFPT     APNs       / SSE
```

### Bảng `notification_templates`

```sql
CREATE TABLE notification_templates (
    id              UUID PRIMARY KEY,
    code            VARCHAR(100) NOT NULL,            -- 'LEAVE_APPROVED', 'ORDER_CONFIRMED'
    channel         VARCHAR(30) NOT NULL,             -- 'EMAIL', 'SMS', 'PUSH', 'IN_APP'
    locale          VARCHAR(10) NOT NULL DEFAULT 'vi',
    subject         VARCHAR(255) NULL,                 -- email subject (nullable cho SMS/PUSH)
    title           VARCHAR(255) NOT NULL,             -- notification title
    body_template   TEXT NOT NULL,                    -- 'Xin chào {{name}}, đơn nghỉ phép...'
    data_schema     JSONB NULL,                        -- schema validation cho data payload
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL,
    UNIQUE (code, channel, locale)
);
```

### Bảng `notification_history`

```sql
CREATE TABLE notification_history (
    id              UUID PRIMARY KEY,
    template_code   VARCHAR(100) NOT NULL,
    channel         VARCHAR(30) NOT NULL,
    recipient       VARCHAR(255) NOT NULL,             -- email, phone, fcm_token, user_id
    subject         VARCHAR(255) NULL,
    title           VARCHAR(255) NOT NULL,
    body            TEXT NOT NULL,
    status          VARCHAR(20) NOT NULL,              -- PENDING | SENT | DELIVERED | FAILED | BOUNCED
    provider_msg_id VARCHAR(255) NULL,                 -- message ID từ provider
    error_msg       TEXT NULL,
    sent_at         TIMESTAMPTZ NULL,
    delivered_at    TIMESTAMPTZ NULL,
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_nh_status   ON notification_history(status);
CREATE INDEX idx_nh_recipient ON notification_history(recipient);
CREATE INDEX idx_nh_created  ON notification_history(created_at DESC);
```

### API

```
# CLIENT-API
GET    /client-api/v1/notifications/templates                 ← List templates
POST   /client-api/v1/notifications/templates
GET    /client-api/v1/notifications/templates/{id}
PATCH  /client-api/v1/notifications/templates/{id}
GET    /client-api/v1/notifications/history                  ← Log gửi (phân trang)
GET    /client-api/v1/notifications/history/{id}

# SERVICE-API
POST   /service-api/v1/notifications/send                    ← Gửi 1 notification
POST   /service-api/v1/notifications/send-batch             ← Gửi batch
POST   /service-api/v1/notifications/send-channel          ← Gửi 1 kênh cụ thể

# INTEGRATION-API
POST   /integration-api/v1/webhooks/email-bounce             ← SendGrid/VNEL bounce webhook
POST   /integration-api/v1/webhooks/push-delivery          ← Firebase delivery receipt
POST   /integration-api/v1/webhooks/sms-delivery           ← Twilio/VNFPT DLR webhook
```

---

## 2. Channels (BC #2)

Quản lý kết nối OAuth 2.0 + credentials tới các nền tảng. Mỗi kết nối có thể dùng cho cả notifications và social posting.

### Bảng `channel_definitions` (catalog — schema `public`)

```sql
CREATE TABLE channel_definitions (
    id              UUID PRIMARY KEY,
    platform_code   VARCHAR(30) NOT NULL,             -- 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN', ...
    channel_type    VARCHAR(30) NOT NULL,             -- 'SOCIAL', 'MESSAGING', 'EMAIL', 'SMS', 'PUSH'
    display_name    VARCHAR(100) NOT NULL,
    icon_url        TEXT NULL,
    auth_type       VARCHAR(30) NOT NULL,             -- OAUTH2 | API_KEY | WEBHOOK
    scopes          TEXT[] NULL,                      -- ['pages_read_engagement', 'pages_manage_posts']
    config_schema   JSONB NULL,                       -- schema cho extra config
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL
);
```

### Bảng `channel_connections` (schema `public`)

```sql
CREATE TABLE channel_connections (
    id                  UUID PRIMARY KEY,
    tenant_id           UUID NOT NULL REFERENCES tenants(id),
    channel_def_id      UUID NOT NULL REFERENCES channel_definitions(id),
    connection_name     VARCHAR(100) NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE | DISCONNECTED | ERROR
    auth_type           VARCHAR(30) NOT NULL,
    oauth_access_token  TEXT NULL,                     -- encrypted
    oauth_refresh_token TEXT NULL,                    -- encrypted
    oauth_token_expiry  TIMESTAMPTZ NULL,
    api_key             TEXT NULL,                    -- encrypted (cho SMS, Zalo OA)
    api_secret          TEXT NULL,                    -- encrypted
    webhook_secret      TEXT NULL,                    -- encrypted (verify webhook signature)
    extra_config        JSONB NOT NULL DEFAULT '{}'::jsonb,
    last_used_at        TIMESTAMPTZ NULL,
    error_msg           TEXT NULL,
    created_at          TIMESTAMPTZ NOT NULL,
    updated_at          TIMESTAMPTZ NOT NULL,
    UNIQUE (tenant_id, channel_def_id, connection_name)
);
CREATE INDEX idx_cc_tenant ON channel_connections(tenant_id);
```

### Bảng `channel_credentials` (per-tenant schema)

```sql
CREATE TABLE channel_credentials (
    id                  UUID PRIMARY KEY,
    connection_id       UUID NOT NULL,                -- FK → channel_connections.id
    credential_key      VARCHAR(50) NOT NULL,         -- 'page_id', 'bot_token', 'phone_number'
    credential_value   TEXT NOT NULL,                -- encrypted
    UNIQUE (connection_id, credential_key)
);
```

### OAuth Flow

```
1. Frontend gọi: POST /client-api/v1/channels/connect
   → Backend trả: { authorizationUrl: 'https://facebook.com/v18.0/dialog/oauth?...' }

2. User redirect sang Facebook → approve → callback
   → Backend nhận code → exchange token → lưu vào channel_connections

3. Backend tự động refresh token khi hết hạn (background scheduler)
```

### API

```
# CLIENT-API
GET    /client-api/v1/channels/definitions                     ← Catalog platforms được hỗ trợ
GET    /client-api/v1/channels                               ← List connections của tenant
POST   /client-api/v1/channels/connect                      ← Bắt đầu OAuth flow
GET    /client-api/v1/channels/oauth-callback               ← OAuth callback (redirect)
POST   /client-api/v1/channels/disconnect                   ← Ngắt kết nối
POST   /client-api/v1/channels/test                         ← Test kết nối

GET    /client-api/v1/channels/{connectionId}
GET    /client-api/v1/channels/{connectionId}/status        ← Health check

# SERVICE-API
GET    /service-api/v1/channels/{connectionId}/send         ← Gửi message/notification qua kênh
POST   /service-api/v1/channels/by-platform/{platform}/send
```

---

## 3. Posts (BC #3)

Publish content lên nhiều nền tảng từ 1 template. Đọc engagement data về.

### Bảng `posts`

```sql
CREATE TABLE posts (
    id              UUID PRIMARY KEY,
    content         TEXT NOT NULL,
    media_urls      TEXT[] NULL,                       -- image/video URLs
    link_url       TEXT NULL,
    scheduled_at   TIMESTAMPTZ NULL,                  -- NULL = publish ngay
    published_at   TIMESTAMPTZ NULL,
    status         VARCHAR(20) NOT NULL,              -- DRAFT | SCHEDULED | PUBLISHED | FAILED
    error_msg      TEXT NULL,
    metadata       JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at     TIMESTAMPTZ NOT NULL,
    updated_at     TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_scheduled ON posts(scheduled_at) WHERE status = 'SCHEDULED';
```

### Bảng `post_platforms` (n-n post ↔ channel)

```sql
CREATE TABLE post_platforms (
    id              UUID PRIMARY KEY,
    post_id         UUID NOT NULL REFERENCES posts(id),
    connection_id   UUID NOT NULL,
    platform_post_id VARCHAR(255) NULL,               -- post ID trên platform (sau khi publish)
    platform_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    platform_error  TEXT NULL,
    published_at    TIMESTAMPTZ NULL,
    UNIQUE (post_id, connection_id)
);
CREATE INDEX idx_pp_post ON post_platforms(post_id);
```

### Bảng `post_engagements`

```sql
CREATE TABLE post_engagements (
    id              UUID PRIMARY KEY,
    post_platform_id UUID NOT NULL REFERENCES post_platforms(id),
    collected_at    TIMESTAMPTZ NOT NULL,
    likes           INTEGER DEFAULT 0,
    shares          INTEGER DEFAULT 0,
    comments        INTEGER DEFAULT 0,
    views           INTEGER DEFAULT 0,
    clicks          INTEGER DEFAULT 0,
    reach           INTEGER DEFAULT 0,
    impressions     INTEGER DEFAULT 0,
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb
);
```

### API

```
# CLIENT-API
GET    /client-api/v1/posts                                   ← List posts
POST   /client-api/v1/posts                                   ← Tạo post
GET    /client-api/v1/posts/{id}
PATCH  /client-api/v1/posts/{id}
DELETE /client-api/v1/posts/{id}
POST   /client-api/v1/posts/{id}/publish                     ← Publish ngay (lên nhiều channels)
POST   /client-api/v1/posts/{id}/schedule                    ← Schedule
POST   /client-api/v1/posts/{id}/cancel-schedule

GET    /client-api/v1/posts/{id}/engagements                 ← Timeline engagement
GET    /client-api/v1/posts/{id}/platforms                  ← Status trên từng platform

# SERVICE-API
GET    /service-api/v1/posts/{id}/analytics                  ← Engagement tổng hợp
```

---

## 4. Pages (BC #4)

Quản lý Facebook Pages, Instagram Business, LinkedIn Organizations, YouTube Channels, Zalo OA đã kết nối.

### Bảng `pages`

```sql
CREATE TABLE pages (
    id              UUID PRIMARY KEY,
    connection_id   UUID NOT NULL,
    platform_code   VARCHAR(30) NOT NULL,
    platform_page_id VARCHAR(255) NOT NULL,              -- page ID trên platform
    page_name       VARCHAR(255) NOT NULL,
    page_username   VARCHAR(100) NULL,
    page_category   VARCHAR(100) NULL,
    follower_count  INTEGER DEFAULT 0,
    avatar_url      TEXT NULL,
    cover_url       TEXT NULL,
    last_synced_at  TIMESTAMPTZ NULL,
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL,
    UNIQUE (connection_id, platform_page_id)
);
```

### API

```
# CLIENT-API
GET    /client-api/v1/pages                                   ← List connected pages
GET    /client-api/v1/pages/{id}
POST   /client-api/v1/pages/sync                              ← Sync page info + follower count
GET    /client-api/v1/pages/{id}/analytics                   ← Page-level analytics
GET    /client-api/v1/pages/{id}/posts                       ← Posts trên page

# SERVICE-API
GET    /service-api/v1/pages/by-connection/{connectionId}
```

---

## 5. Analytics (BC #5)

### Bảng `social_analytics_cache` (schema `public`)

```sql
CREATE TABLE social_analytics_cache (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    connection_id   UUID NOT NULL,
    platform_code   VARCHAR(30) NOT NULL,
    metric_type     VARCHAR(50) NOT NULL,              -- 'PAGE_FOLLOWERS', 'POST_IMPRESSIONS', ...
    metric_value    INTEGER DEFAULT 0,
    period          VARCHAR(20) NOT NULL,              -- 'DAY', 'WEEK', 'MONTH'
    period_start    DATE NOT NULL,
    period_end      DATE NOT NULL,
    cached_at       TIMESTAMPTZ NOT NULL,
    UNIQUE (connection_id, metric_type, period, period_start)
);
```

### API

```
# CLIENT-API
GET    /client-api/v1/analytics/overview                    ← Tổng quan tất cả channels
GET    /client-api/v1/analytics/channels/{connectionId}    ← Analytics 1 channel
GET    /client-api/v1/analytics/posts/{postId}             ← Analytics 1 post
GET    /client-api/v1/analytics/pages/{pageId}             ← Analytics 1 page

# SERVICE-API
GET    /service-api/v1/analytics/summary                   ← Summary cho dashboard
```

---

## API tổng quan (4 prefix pattern)

```
# CLIENT-API (Web/Mobile) — user JWT + RBAC
/client-api/v1/notifications/templates
/client-api/v1/notifications/templates/{id}
/client-api/v1/notifications/history
/client-api/v1/channels/definitions
/client-api/v1/channels
/client-api/v1/channels/connect
/client-api/v1/channels/oauth-callback
/client-api/v1/channels/disconnect
/client-api/v1/posts
/client-api/v1/posts/{id}
/client-api/v1/posts/{id}/publish
/client-api/v1/pages
/client-api/v1/pages/{id}
/client-api/v1/analytics/overview

# SERVICE-API (Service-to-service) — service JWT
/service-api/v1/notifications/send
/service-api/v1/notifications/send-batch
/service-api/v1/channels/{connectionId}/send
/service-api/v1/posts/{id}/analytics
/service-api/v1/analytics/summary

# INTEGRATION-API (External webhooks)
/integration-api/v1/webhooks/email-bounce
/integration-api/v1/webhooks/push-delivery
/integration-api/v1/webhooks/sms-delivery
/integration-api/v1/webhooks/facebook-page        ← Facebook Page webhook
/integration-api/v1/webhooks/instagram            ← Instagram webhook
/integration-api/v1/webhooks/linkedin             ← LinkedIn webhook
/integration-api/v1/webhooks/youtube              ← YouTube webhook
/integration-api/v1/webhooks/telegram             ← Telegram webhook
/integration-api/v1/webhooks/zalo                 ← Zalo OA webhook
/integration-api/v1/webhooks/x-twitter            ← X/Twitter webhook

# PUBLIC-API
/public-api/v1/health
```

---

## Dependencies

| Dependency | Vai trò |
|------------|---------|
| **Firebase Cloud Messaging** | Push notification (Android/iOS) |
| **Apple Push Notifications Service** | Push notification (iOS) |
| **SendGrid / SMTP** | Email |
| **Twilio / VNFPT** | SMS |
| **Meta Graph API** | Facebook/Instagram posts + pages |
| **LinkedIn API v2** | LinkedIn posts + pages |
| **Twitter/X API v2** | X posts |
| **Telegram Bot API** | Telegram messages |
| **YouTube Data API v3** | YouTube posts + channels |
| **Zalo OA API** | Zalo messages + posts |
| **Slack Web API** | Slack messages |
| **Kafka** | Async send, webhook processing |
| **Redis** | Token cache, rate limit |
| **platform-registry** | Tra cứu tenant info |

## Domain Events Published

```
NotificationSentEvent         (tenant, channel, template, recipient, status)
NotificationFailedEvent
PostPublishedEvent            (postId, platforms)
PostScheduledEvent
PostFailedEvent
ChannelConnectedEvent         (tenant, platform, connectionName)
ChannelDisconnectedEvent
ChannelErrorEvent             (connectionId, error)
PageSyncedEvent               (pageId, followerCount)
```

## Quy tắc quan trọng

- **Token encryption:** Tất cả OAuth tokens, API keys, secrets **PHẢI** mã hoá trước khi lưu (AES-256).
- **Webhook verification:** Mỗi platform có cách verify signature riêng (HMAC-SHA256 cho Facebook, JWT cho Slack, plain token cho Telegram).
- **Rate limit:** Mỗi platform có rate limit riêng — dùng bucket token algorithm.
- **Idempotency:** Publish post → platformPostId mapping → retry không tạo duplicate.

## Xem thêm

- Platform registry: [`../platform-registry/README.md`](../platform-registry/README.md)
- IAM JWT verify: [`../iam/README.md`](../iam/README.md)
- Multi-tenant: [`../../../governance/architecture/multi-tenant.md`](../../../governance/architecture/multi-tenant.md)
- API patterns: [`../../../governance/architecture/api-patterns.md`](../../../governance/architecture/api-patterns.md)
