-- =====================================================================
-- V1: Public schema initial — tenants + mini-apps catalog + role/perm templates
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------- Tenants ----------
CREATE TABLE IF NOT EXISTS tenants (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug              VARCHAR(50) UNIQUE NOT NULL,
    schema_name       VARCHAR(63) UNIQUE NOT NULL,
    display_name      VARCHAR(255) NOT NULL,
    legal_name        VARCHAR(255) NULL,
    tax_code          VARCHAR(50)  NULL,
    plan              VARCHAR(20)  NOT NULL DEFAULT 'trial',
    status            VARCHAR(20)  NOT NULL DEFAULT 'active',
    region            VARCHAR(20)  NOT NULL DEFAULT 'vn',
    keycloak_realm    VARCHAR(50)  NOT NULL,
    default_locale    VARCHAR(10)  NOT NULL DEFAULT 'vi',
    default_currency  VARCHAR(10)  NOT NULL DEFAULT 'VND',
    default_timezone  VARCHAR(50)  NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    contact_email     VARCHAR(255) NOT NULL,
    contact_phone     VARCHAR(50)  NULL,
    login_flow_alias  VARCHAR(50)  NULL,
    role_template_id  UUID NULL,
    metadata          JSONB        NOT NULL DEFAULT '{}'::jsonb,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    activated_at      TIMESTAMPTZ  NULL,
    suspended_at      TIMESTAMPTZ  NULL,
    offboarded_at     TIMESTAMPTZ  NULL
);
CREATE INDEX IF NOT EXISTS idx_tenants_status     ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenants_keycloak   ON tenants(keycloak_realm);

-- ---------- Mini-apps catalog (cross-tenant) ----------
CREATE TABLE IF NOT EXISTS mini_apps (
    id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code               VARCHAR(50) UNIQUE NOT NULL,
    name               VARCHAR(255) NOT NULL,
    description        TEXT NULL,
    version            VARCHAR(20)  NOT NULL DEFAULT '0.0.1',
    category           VARCHAR(50)  NOT NULL DEFAULT 'OTHER',
    icon_url           TEXT NULL,
    documentation_url  TEXT NULL,
    base_price         DECIMAL(12,2) NULL,
    is_core            BOOLEAN NOT NULL DEFAULT FALSE,
    is_active          BOOLEAN NOT NULL DEFAULT TRUE,
    metadata           JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- Permission templates (cross-tenant) ----------
CREATE TABLE IF NOT EXISTS permission_templates (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code        VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255) NULL,
    category    VARCHAR(50)  NULL
);

-- ---------- Role templates (cross-tenant) ----------
CREATE TABLE IF NOT EXISTS role_templates (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code         VARCHAR(100) UNIQUE NOT NULL,
    name         VARCHAR(255) NOT NULL,
    description  TEXT NULL,
    category     VARCHAR(50)  NULL,
    is_default   BOOLEAN NOT NULL DEFAULT FALSE,
    metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_template_permissions (
    role_template_id      UUID NOT NULL REFERENCES role_templates(id)      ON DELETE CASCADE,
    permission_template_id UUID NOT NULL REFERENCES permission_templates(id) ON DELETE CASCADE,
    PRIMARY KEY (role_template_id, permission_template_id)
);

-- FK từ tenants → role_templates (sau khi table tồn tại)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_tenants_role_template'
          AND table_name = 'tenants'
    ) THEN
        ALTER TABLE tenants
            ADD CONSTRAINT fk_tenants_role_template
            FOREIGN KEY (role_template_id) REFERENCES role_templates(id);
    END IF;
END $$;
