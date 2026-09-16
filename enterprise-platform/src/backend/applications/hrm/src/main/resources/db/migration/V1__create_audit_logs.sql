-- Audit logs table — bắt buộc cho mọi microservice có business mutation.
-- Xem SOURCE-CODE-STRUCTURE.md §1.6.6.

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID NOT NULL UNIQUE,
    trace_id VARCHAR(64),
    tenant_id VARCHAR(64),
    user_id VARCHAR(64) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(64),
    before JSONB,
    after JSONB,
    ip_address VARCHAR(64),
    user_agent VARCHAR(512),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_tenant_user_time ON audit_logs(tenant_id, user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_action_time ON audit_logs(action, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_trace ON audit_logs(trace_id);
