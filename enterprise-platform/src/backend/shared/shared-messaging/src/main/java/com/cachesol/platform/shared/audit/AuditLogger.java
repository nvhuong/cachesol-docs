package com.cachesol.platform.shared.audit;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

/**
 * AuditLogger — Ghi audit log cho business events.
 * Mỗi event PHẢI được ghi vào database (audit_logs) + file log riêng.
 */
@Component
public class AuditLogger {
    private static final Logger log = LoggerFactory.getLogger("AUDIT");
    private static final ObjectMapper MAPPER = new ObjectMapper();

    public void record(AuditEvent event) {
        if (event == null) return;

        if (event.getTraceId() == null) event.setTraceId(MDC.get("trace_id"));
        if (event.getTenantId() == null) event.setTenantId(MDC.get("tenant_id"));
        if (event.getUserId() == null) event.setUserId(MDC.get("user_id"));
        if (event.getIpAddress() == null) event.setIpAddress(MDC.get("client_ip"));
        if (event.getUserAgent() == null) event.setUserAgent(MDC.get("user_agent"));
        if (event.getEventId() == null) event.setEventId(UUID.randomUUID().toString());
        if (event.getTimestamp() == null) event.setTimestamp(Instant.now());

        // 1. TODO: ghi DB (cần inject AuditLogRepository)
        // 2. Ghi file log
        try {
            String beforeJson = event.getBefore() != null ? MAPPER.writeValueAsString(event.getBefore()) : null;
            String afterJson = event.getAfter() != null ? MAPPER.writeValueAsString(event.getAfter()) : null;

            log.info("audit action={} entity={}:{} actor={} tenant={} trace={} before={} after={}",
                    event.getAction(),
                    event.getEntityType(),
                    event.getEntityId(),
                    event.getUserId(),
                    event.getTenantId(),
                    event.getTraceId(),
                    beforeJson,
                    afterJson);
        } catch (JsonProcessingException e) {
            log.warn("audit serialize failed action={} entity={}:{} err={}",
                    event.getAction(), event.getEntityType(), event.getEntityId(), e.getMessage());
        }
    }

    public void record(String action, String entityType, String entityId) {
        record(AuditEvent.builder()
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .build());
    }
}
