-- =====================================================================
-- V2: Seed permission + role templates (cross-tenant defaults)
-- =====================================================================

-- Permission templates
INSERT INTO permission_templates (code, description, category) VALUES
  ('COMMON.USER.READ',         'Xem users',                'COMMON'),
  ('COMMON.USER.WRITE',        'CRUD users',               'COMMON'),
  ('COMMON.ROLE.READ',         'Xem roles',                'COMMON'),
  ('COMMON.ROLE.WRITE',        'Quản lý roles',            'COMMON'),
  ('COMMON.ORG.READ',          'Xem cây tổ chức',          'COMMON'),
  ('COMMON.ORG.WRITE',         'CRUD cây tổ chức',         'COMMON'),
  ('COMMON.AUDIT.READ',        'Xem audit log',            'COMMON'),
  ('HRM.EMPLOYEE.READ',        'Xem nhân viên',            'HRM'),
  ('HRM.EMPLOYEE.WRITE',       'CRUD nhân viên',           'HRM'),
  ('HRM.EMPLOYEE.APPROVE',     'Duyệt đơn HR',             'HRM'),
  ('SALES.CUSTOMER.READ',      'Xem khách hàng',           'SALES'),
  ('SALES.CUSTOMER.WRITE',     'CRUD khách hàng',          'SALES'),
  ('SALES.ORDER.CREATE',       'Tạo đơn hàng',             'SALES'),
  ('SALES.ORDER.APPROVE',      'Duyệt đơn hàng',           'SALES')
ON CONFLICT (code) DO NOTHING;

-- Role templates
INSERT INTO role_templates (code, name, description, category, is_default) VALUES
  ('COMPANY_ADMIN',  'Company Admin',   'Quản trị viên cấp công ty',            'COMMON', TRUE),
  ('HRM_MANAGER',    'HRM Manager',     'Quản lý nhân sự',                       'HRM',    TRUE),
  ('HRM_EMPLOYEE',   'HRM Employee',    'Nhân viên (đọc profile)',              'HRM',    TRUE),
  ('SALES_MANAGER',  'Sales Manager',   'Quản lý bán hàng',                     'SALES',  TRUE),
  ('SALES_REP',      'Sales Rep',       'Nhân viên bán hàng',                   'SALES',  TRUE),
  ('AUDITOR',        'Auditor',         'Xem audit logs (compliance)',          'COMMON', FALSE)
ON CONFLICT (code) DO NOTHING;

-- Role ↔ Permission mappings
-- COMPANY_ADMIN: all COMMON.*
INSERT INTO role_template_permissions (role_template_id, permission_template_id)
SELECT rt.id, pt.id FROM role_templates rt, permission_templates pt
WHERE rt.code = 'COMPANY_ADMIN' AND pt.code LIKE 'COMMON.%'
ON CONFLICT DO NOTHING;

-- HRM_MANAGER: HRM.EMPLOYEE.* + COMMON.ORG.READ + COMMON.USER.READ + COMMON.ROLE.READ
INSERT INTO role_template_permissions (role_template_id, permission_template_id)
SELECT rt.id, pt.id FROM role_templates rt, permission_templates pt
WHERE rt.code = 'HRM_MANAGER'
  AND pt.code IN ('HRM.EMPLOYEE.READ','HRM.EMPLOYEE.WRITE','HRM.EMPLOYEE.APPROVE',
                  'COMMON.ORG.READ','COMMON.USER.READ','COMMON.ROLE.READ')
ON CONFLICT DO NOTHING;

-- HRM_EMPLOYEE: HRM.EMPLOYEE.READ + COMMON.ORG.READ
INSERT INTO role_template_permissions (role_template_id, permission_template_id)
SELECT rt.id, pt.id FROM role_templates rt, permission_templates pt
WHERE rt.code = 'HRM_EMPLOYEE'
  AND pt.code IN ('HRM.EMPLOYEE.READ','COMMON.ORG.READ')
ON CONFLICT DO NOTHING;

-- SALES_MANAGER: SALES.CUSTOMER.* + SALES.ORDER.* + COMMON.ORG.READ
INSERT INTO role_template_permissions (role_template_id, permission_template_id)
SELECT rt.id, pt.id FROM role_templates rt, permission_templates pt
WHERE rt.code = 'SALES_MANAGER'
  AND pt.code IN ('SALES.CUSTOMER.READ','SALES.CUSTOMER.WRITE',
                  'SALES.ORDER.CREATE','SALES.ORDER.APPROVE',
                  'COMMON.ORG.READ')
ON CONFLICT DO NOTHING;

-- SALES_REP: SALES.CUSTOMER.READ/WRITE + SALES.ORDER.CREATE + COMMON.ORG.READ
INSERT INTO role_template_permissions (role_template_id, permission_template_id)
SELECT rt.id, pt.id FROM role_templates rt, permission_templates pt
WHERE rt.code = 'SALES_REP'
  AND pt.code IN ('SALES.CUSTOMER.READ','SALES.CUSTOMER.WRITE',
                  'SALES.ORDER.CREATE','COMMON.ORG.READ')
ON CONFLICT DO NOTHING;

-- AUDITOR: COMMON.AUDIT.READ + COMMON.USER.READ + COMMON.ORG.READ
INSERT INTO role_template_permissions (role_template_id, permission_template_id)
SELECT rt.id, pt.id FROM role_templates rt, permission_templates pt
WHERE rt.code = 'AUDITOR'
  AND pt.code IN ('COMMON.AUDIT.READ','COMMON.USER.READ','COMMON.ORG.READ')
ON CONFLICT DO NOTHING;

-- Seed mini-apps catalog
INSERT INTO mini_apps (code, name, description, version, category, is_core) VALUES
  ('HRM',     'Human Resources',     'Quản lý nhân sự cơ bản',          '1.0.0', 'HRM',    TRUE),
  ('SALES',   'Sales CRM',           'Quản lý khách hàng + đơn hàng',   '1.0.0', 'SALES',  FALSE),
  ('FINANCE', 'Finance',             'Kế toán — sổ sách, báo cáo',     '1.0.0', 'FINANCE', FALSE),
  ('AUDIT',   'Audit Log',           'Xem audit logs toàn tenant',      '1.0.0', 'COMMON', FALSE)
ON CONFLICT (code) DO NOTHING;
