# Logging Skeleton

Skeleton code minh họa cho hệ thống logging đầy đủ theo
[`SOURCE-CODE-STRUCTURE.md` §1.6](../../../SOURCE-CODE-STRUCTURE.md).

## Cấu trúc file

```
src/backend/shared/
├── shared-common/src/main/java/com/cachesol/platform/shared/logging/
│   ├── StructuredLogContext.java     # MDC helper (try-with-resources)
│   ├── CorrelationIdFilter.java      # Inject trace_id, span_id
│   ├── RequestLoggingFilter.java     # Access log HTTP
│   └── MaskUtils.java                # Mask PII (email, phone, card)
│
├── shared-messaging/src/main/java/com/cachesol/platform/shared/audit/
│   ├── AuditEvent.java               # Immutable audit event
│   ├── AuditLogEntity.java           # JPA entity → audit_logs table
│   └── AuditLogger.java              # Ghi DB + file log
│
└── shared-security/src/main/java/com/cachesol/platform/shared/security/
    ├── SecurityContext.java          # Lấy user/tenant từ SecurityContext
    └── filter/SecurityMdcFilter.java # Inject user_id, tenant_id vào MDC
```

## MDC keys bắt buộc

| Key | Nguồn | Mô tả |
|-----|-------|-------|
| `trace_id` | CorrelationIdFilter | UUID, propagate xuyên service |
| `span_id` | CorrelationIdFilter | UUID, mỗi request một span |
| `user_id` | SecurityMdcFilter | User đang thao tác |
| `tenant_id` | SecurityMdcFilter | Tenant từ JWT claim |
| `request_method` | CorrelationIdFilter | GET / POST / PUT / DELETE |
| `request_path` | CorrelationIdFilter | /api/v1/employees |
| `client_ip` | CorrelationIdFilter | IP qua X-Forwarded-For |
| `user_agent` | CorrelationIdFilter | User-Agent header |

## Checklist khi review PR

- [ ] Mọi Controller có log access (start/success/fail) với trace_id
- [ ] Mọi business mutation (create/update/delete) có audit log vào DB
- [ ] Mọi external call (HTTP/Kafka) có log request/response
- [ ] Slow query / slow API được log ở level WARN
- [ ] MDC có đủ `trace_id`, `user_id`, `tenant_id`
- [ ] Không log password, token, CMND/CCCD, số thẻ
- [ ] Email/SĐT được mask trước khi log
- [ ] Exception có log đầy đủ stack trace + context
- [ ] Log ở format JSON ở môi trường dev/staging/prod
