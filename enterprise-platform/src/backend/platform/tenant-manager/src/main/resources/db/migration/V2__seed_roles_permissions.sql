-- =====================================================
-- V2: seed roles + permissions
-- =====================================================

INSERT INTO roles (code, name, description, app_code, is_system) VALUES
  ('PLATFORM_ADMIN', 'Platform Administrator', 'Quản trị toàn platform', NULL, TRUE),
  ('TENANT_ADMIN',   'Tenant Administrator',   'Quản trị tenant',    NULL, TRUE),
  ('HRM_ADMIN',      'HRM Administrator',      'Quản trị HRM',       'HRM', FALSE),
  ('HRM_USER',       'HRM User',               'User thường HRM',    'HRM', FALSE),
  ('SALES_USER',     'Sales User',             'User sales',         'SALES', FALSE)
ON CONFLICT (code) DO NOTHING;

INSERT INTO permissions (code, name, resource, action) VALUES
  ('USER_READ',   'Read user',   'user', 'read'),
  ('USER_WRITE',  'Write user',  'user', 'write'),
  ('ROLE_READ',   'Read role',   'role', 'read'),
  ('ROLE_WRITE',  'Write role',  'role', 'write'),
  ('ORG_READ',    'Read org',    'organization', 'read'),
  ('ORG_WRITE',   'Write org',   'organization', 'write')
ON CONFLICT (code) DO NOTHING;

-- Gán toàn bộ permission cho PLATFORM_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'PLATFORM_ADMIN'
ON CONFLICT DO NOTHING;

-- HRM_ADMIN: USER_READ, USER_WRITE
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'HRM_ADMIN' AND p.code IN ('USER_READ','USER_WRITE')
ON CONFLICT DO NOTHING;
