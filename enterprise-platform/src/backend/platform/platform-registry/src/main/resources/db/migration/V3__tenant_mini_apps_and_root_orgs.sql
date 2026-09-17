-- =====================================================================
-- V3: Per-tenant enable + root-org mapping tables
--
-- MVP giữ trong schema public (keyed bằng tenant_slug) để đơn giản bootstrap.
-- Production sẽ migrate sang per-tenant schema tenant_<slug>_platformregistry.
-- =====================================================================

CREATE TABLE IF NOT EXISTS tenant_mini_apps (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_slug VARCHAR(50) NOT NULL,
    mini_app_id UUID NOT NULL REFERENCES public.mini_apps(id) ON DELETE CASCADE,
    enabled     BOOLEAN NOT NULL DEFAULT TRUE,
    enabled_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    enabled_by  UUID NOT NULL,
    config      JSONB NOT NULL DEFAULT '{}'::jsonb,
    notes       TEXT NULL,
    UNIQUE (tenant_slug, mini_app_id)
);
CREATE INDEX IF NOT EXISTS idx_tma_tenant ON tenant_mini_apps(tenant_slug);

CREATE TABLE IF NOT EXISTS tenant_root_orgs (
    root_org_code    VARCHAR(50) PRIMARY KEY,
    tenant_slug      VARCHAR(50) NOT NULL,
    hrm_root_org_id  UUID NOT NULL,
    hrm_employee_id  UUID NULL,
    metadata         JSONB NOT NULL DEFAULT '{}'::jsonb,
    synced_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tro_tenant ON tenant_root_orgs(tenant_slug);
