package com.cachesol.platform.shared.audit;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public class AuditEvent {
    private String eventId;
    private String traceId;
    private String tenantId;
    private String userId;
    private String action;
    private String entityType;
    private String entityId;
    private Object before;
    private Object after;
    private String ipAddress;
    private String userAgent;
    private Instant timestamp;
    private Map<String, Object> extra;

    public AuditEvent() {}

    public static Builder builder() { return new Builder(); }

    public String getEventId() { return eventId; }
    public String getTraceId() { return traceId; }
    public String getTenantId() { return tenantId; }
    public String getUserId() { return userId; }
    public String getAction() { return action; }
    public String getEntityType() { return entityType; }
    public String getEntityId() { return entityId; }
    public Object getBefore() { return before; }
    public Object getAfter() { return after; }
    public String getIpAddress() { return ipAddress; }
    public String getUserAgent() { return userAgent; }
    public Instant getTimestamp() { return timestamp; }
    public Map<String, Object> getExtra() { return extra; }

    public void setEventId(String v) { this.eventId = v; }
    public void setTraceId(String v) { this.traceId = v; }
    public void setTenantId(String v) { this.tenantId = v; }
    public void setUserId(String v) { this.userId = v; }
    public void setAction(String v) { this.action = v; }
    public void setEntityType(String v) { this.entityType = v; }
    public void setEntityId(String v) { this.entityId = v; }
    public void setBefore(Object v) { this.before = v; }
    public void setAfter(Object v) { this.after = v; }
    public void setIpAddress(String v) { this.ipAddress = v; }
    public void setUserAgent(String v) { this.userAgent = v; }
    public void setTimestamp(Instant v) { this.timestamp = v; }
    public void setExtra(Map<String, Object> v) { this.extra = v; }

    public static class Builder {
        private final AuditEvent e = new AuditEvent();
        public Builder eventId(String v) { e.eventId = v; return this; }
        public Builder action(String v) { e.action = v; return this; }
        public Builder entityType(String v) { e.entityType = v; return this; }
        public Builder entityId(String v) { e.entityId = v; return this; }
        public Builder tenantId(String v) { e.tenantId = v; return this; }
        public Builder userId(String v) { e.userId = v; return this; }
        public Builder before(Object v) { e.before = v; return this; }
        public Builder after(Object v) { e.after = v; return this; }
        public Builder ipAddress(String v) { e.ipAddress = v; return this; }
        public Builder userAgent(String v) { e.userAgent = v; return this; }
        public Builder timestamp(Instant v) { e.timestamp = v; return this; }
        public Builder extra(Map<String, Object> v) { e.extra = v; return this; }
        public AuditEvent build() {
            if (e.eventId == null) e.eventId = UUID.randomUUID().toString();
            if (e.timestamp == null) e.timestamp = Instant.now();
            return e;
        }
    }
}
