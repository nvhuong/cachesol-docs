-- =====================================================================
-- V1: Tenant-manager base schema (tenant_manager)
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------- app_users ----------
CREATE TABLE IF NOT EXISTS tenant_manager.app_users (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keycloak_user_id  UUID NOT NULL,
    username          VARCHAR(100) NOT NULL,
    email             VARCHAR(255),
    full_name         VARCHAR(255),
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    status            VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    last_login_at     TIMESTAMPTZ,
    metadata          JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (keycloak_user_id)
);
CREATE INDEX IF NOT EXISTS idx_app_users_username ON tenant_manager.app_users(username);
CREATE INDEX IF NOT EXISTS idx_app_users_email    ON tenant_manager.app_users(email);

-- ---------- permissions (clone từ platform-registry permission_templates) ----------
CREATE TABLE IF NOT EXISTS tenant_manager.permissions (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code        VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    category    VARCHAR(50),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_perm_code ON tenant_manager.permissions(code);

-- ---------- roles ----------
CREATE TABLE IF NOT EXISTS tenant_manager.roles (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code             VARCHAR(100) UNIQUE NOT NULL,
    name             VARCHAR(255) NOT NULL,
    description      TEXT,
    app_code         VARCHAR(50),
    is_system        BOOLEAN NOT NULL DEFAULT FALSE,
    template_role_id UUID,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_role_app_code ON tenant_manager.roles(app_code);

-- ---------- role_permissions ----------
CREATE TABLE IF NOT EXISTS tenant_manager.role_permissions (
    role_id       UUID NOT NULL REFERENCES tenant_manager.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES tenant_manager.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- ---------- user_app_roles (user ↔ role + org_scope) ----------
CREATE TABLE IF NOT EXISTS tenant_manager.user_app_roles (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID NOT NULL REFERENCES tenant_manager.app_users(id),
    role_id          UUID NOT NULL REFERENCES tenant_manager.roles(id),
    app_code         VARCHAR(50) NOT NULL,
    org_scope_path   VARCHAR(500),
    valid_from       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_to         TIMESTAMPTZ,
    granted_by       UUID,
    granted_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_uar_user    ON tenant_manager.user_app_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_uar_role    ON tenant_manager.user_app_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_uar_app     ON tenant_manager.user_app_roles(app_code);

-- ---------- organizations ----------
CREATE TABLE IF NOT EXISTS tenant_manager.organizations (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code        VARCHAR(50) UNIQUE NOT NULL,
    name        VARCHAR(255) NOT NULL,
    org_type    VARCHAR(30) NOT NULL,
    parent_id   UUID REFERENCES tenant_manager.organizations(id),
    path        VARCHAR(500),
    level       SMALLINT NOT NULL DEFAULT 0,
    manager_id  UUID,
    description TEXT,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_org_parent  ON tenant_manager.organizations(parent_id);
CREATE INDEX IF NOT EXISTS idx_org_path    ON tenant_manager.organizations(path);

-- ---------- job_titles ----------
CREATE TABLE IF NOT EXISTS tenant_manager.job_titles (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code         VARCHAR(50) UNIQUE NOT NULL,
    name         VARCHAR(255) NOT NULL,
    level        SMALLINT NOT NULL DEFAULT 0,
    is_leader    BOOLEAN NOT NULL DEFAULT FALSE,
    scope_org_id UUID REFERENCES tenant_manager.organizations(id),
    description  TEXT,
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_jt_scope_org ON tenant_manager.job_titles(scope_org_id);

-- ---------- employees ----------
CREATE TABLE IF NOT EXISTS tenant_manager.employees (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID REFERENCES tenant_manager.app_users(id),
    employee_code  VARCHAR(50) UNIQUE NOT NULL,
    full_name      VARCHAR(255) NOT NULL,
    email          VARCHAR(255),
    phone          VARCHAR(50),
    date_of_birth  DATE,
    gender         VARCHAR(10),
    national_id    VARCHAR(30),
    address        TEXT,
    avatar_url     TEXT,
    status         VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    hired_at       DATE,
    terminated_at  DATE,
    metadata       JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_emp_user    ON tenant_manager.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_emp_code    ON tenant_manager.employees(employee_code);

-- ---------- employee_contracts ----------
CREATE TABLE IF NOT EXISTS tenant_manager.employee_contracts (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id   UUID NOT NULL REFERENCES tenant_manager.employees(id) ON DELETE CASCADE,
    contract_type VARCHAR(30) NOT NULL,
    start_date    DATE NOT NULL,
    end_date      DATE,
    salary        DECIMAL(15,2),
    currency      VARCHAR(10),
    notes         TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- employee_assignments ----------
CREATE TABLE IF NOT EXISTS tenant_manager.employee_assignments (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id  UUID NOT NULL REFERENCES tenant_manager.employees(id),
    org_id       UUID NOT NULL REFERENCES tenant_manager.organizations(id),
    job_title_id UUID REFERENCES tenant_manager.job_titles(id),
    is_primary   BOOLEAN NOT NULL DEFAULT FALSE,
    start_date   DATE NOT NULL,
    end_date     DATE,
    reports_to   UUID REFERENCES tenant_manager.employees(id),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (employee_id, org_id, job_title_id, start_date)
);
CREATE INDEX IF NOT EXISTS idx_ea_employee ON tenant_manager.employee_assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_ea_org      ON tenant_manager.employee_assignments(org_id);
CREATE INDEX IF NOT EXISTS idx_ea_reports  ON tenant_manager.employee_assignments(reports_to);
