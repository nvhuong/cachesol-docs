-- =====================================================================
-- V4: Public catalog seed — marketing metadata cho 6 mini-apps.
--
-- Marketing data (tagline, features, pricing, currency, ...) được lưu trong
-- cột mini_apps.metadata (JSONB). PublicCatalogController sẽ transform
-- entity này sang PublicMiniAppResponse cho landing page.
--
-- Idempotent: dùng ON CONFLICT để update marketing data nếu mini-app đã tồn tại.
-- =====================================================================

-- HRM — quản lý nhân sự toàn diện
UPDATE mini_apps
SET category = 'HRM',
    metadata = jsonb_build_object(
        'tagline',         'Quản lý nhân sự toàn diện',
        'description',     'Quản lý hồ sơ nhân viên, hợp đồng, chấm công, tính lương, đánh giá hiệu suất và tuyển dụng — tất cả trong một hệ thống thống nhất.',
        'category',        'hr',
        'pricing',         'per-user',
        'minSeats',        5,
        'currency',        'VND',
        'pricePerMonth',   25000,
        'publisherName',   'CacheSol',
        'publishedAt',     '2025-01-15',
        'features',        jsonb_build_array(
            'Hồ sơ nhân viên + lịch sử',
            'Chấm công GPS / QR / Web',
            'Tính lương BHXH tự động',
            'Đánh giá KPI 360°',
            'Tuyển dụng + ATS'
        ),
        'installEndpoint', '/api/tenant-manager/v1/mini-apps/hrm/install'
    )::jsonb
WHERE code = 'HRM';

-- SALES — CRM + pipeline + báo giá
UPDATE mini_apps
SET category = 'SALES',
    metadata = jsonb_build_object(
        'tagline',         'CRM + pipeline + báo giá',
        'description',     'Quản lý leads, opportunities, pipeline bán hàng, tạo báo giá chuyên nghiệp và theo dõi hiệu suất đội ngũ sales.',
        'category',        'sales',
        'pricing',         'per-user',
        'minSeats',        3,
        'currency',        'VND',
        'pricePerMonth',   35000,
        'publisherName',   'CacheSol',
        'publishedAt',     '2025-03-22',
        'features',        jsonb_build_array(
            'CRM + Lead scoring',
            'Pipeline kanban',
            'Báo giá PDF + e-sign',
            'Báo cáo doanh thu',
            'Tích hợp Email / SMS'
        ),
        'installEndpoint', '/api/tenant-manager/v1/mini-apps/sales/install'
    )::jsonb
WHERE code = 'SALES';

-- FINANCE — kế toán & tài chính
INSERT INTO mini_apps (code, name, description, version, category, is_core, is_active, metadata)
VALUES (
    'FINANCE', 'Finance', 'Kế toán — sổ cái, công nợ, hóa đơn điện tử, báo cáo tài chính theo chuẩn VAS/IFRS.',
    '1.0.0', 'FINANCE', FALSE, TRUE,
    jsonb_build_object(
        'tagline',         'Kế toán & tài chính doanh nghiệp',
        'description',     'Sổ cái, công nợ, hóa đơn điện tử, báo cáo tài chính theo chuẩn VAS/IFRS, tích hợp ngân hàng.',
        'category',        'finance',
        'pricing',         'flat-rate',
        'currency',        'VND',
        'pricePerMonth',   2500000,
        'publisherName',   'CacheSol',
        'publishedAt',     '2025-05-10',
        'features',        jsonb_build_array(
            'Sổ cái + sổ phụ',
            'Hóa đơn điện tử VNPT/MISA',
            'Công nợ phải thu/phải trả',
            'Báo cáo tài chính',
            'Kết nối ngân hàng'
        ),
        'installEndpoint', '/api/tenant-manager/v1/mini-apps/finance/install'
    )
)
ON CONFLICT (code) DO UPDATE
SET metadata = EXCLUDED.metadata,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    is_active = TRUE;

-- OPERATIONS — vận hành & kho
INSERT INTO mini_apps (code, name, description, version, category, is_core, is_active, metadata)
VALUES (
    'OPERATIONS', 'Operations', 'Vận hành — quản lý kho, xuất nhập, định tuyến giao hàng, BOM.',
    '1.0.0', 'OPERATIONS', FALSE, TRUE,
    jsonb_build_object(
        'tagline',         'Vận hành & quản lý kho',
        'description',     'Quản lý kho, xuất nhập, định tuyến giao hàng, theo dõi BOM và chi phí sản xuất.',
        'category',        'operations',
        'pricing',         'per-user',
        'currency',        'VND',
        'pricePerMonth',   30000,
        'publisherName',   'CacheSol',
        'publishedAt',     '2025-07-04',
        'features',        jsonb_build_array(
            'Kho + barcode/QR',
            'Xuất nhập theo lô/HSD',
            'BOM + định mức NVL',
            'Định tuyến giao hàng',
            'Chi phí sản xuất'
        ),
        'installEndpoint', '/api/tenant-manager/v1/mini-apps/operations/install'
    )
)
ON CONFLICT (code) DO UPDATE
SET metadata = EXCLUDED.metadata,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    is_active = TRUE;

-- ANALYTICS — BI + dashboard
INSERT INTO mini_apps (code, name, description, version, category, is_core, is_active, metadata)
VALUES (
    'ANALYTICS', 'Analytics', 'BI + dashboard + báo cáo self-service.',
    '1.0.0', 'ANALYTICS', FALSE, TRUE,
    jsonb_build_object(
        'tagline',         'BI + dashboard + báo cáo',
        'description',     'Kết nối dữ liệu từ mọi mini-app, xây dựng dashboard, báo cáo self-service và chia sẻ với team.',
        'category',        'analytics',
        'pricing',         'per-user',
        'currency',        'VND',
        'pricePerMonth',   20000,
        'publisherName',   'CacheSol',
        'publishedAt',     '2025-09-01',
        'features',        jsonb_build_array(
            'Kết nối dữ liệu realtime',
            'Dashboard drag-drop',
            'Báo cáo self-service',
            'Export Excel/PDF',
            'Phân quyền dòng dữ liệu'
        ),
        'installEndpoint', '/api/tenant-manager/v1/mini-apps/analytics/install'
    )
)
ON CONFLICT (code) DO UPDATE
SET metadata = EXCLUDED.metadata,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    is_active = TRUE;

-- HELPDESK — ticketing + CSKH
INSERT INTO mini_apps (code, name, description, version, category, is_core, is_active, metadata)
VALUES (
    'HELPDESK', 'Helpdesk', 'Ticketing & CSKH — multi-channel, SLA, knowledge base.',
    '1.0.0', 'PRODUCTIVITY', FALSE, TRUE,
    jsonb_build_object(
        'tagline',         'Ticketing & CSKH',
        'description',     'Hệ thống ticket, SLA, knowledge base, multi-channel (Email/Web/Chat) và báo cáo CSKH.',
        'category',        'productivity',
        'pricing',         'per-user',
        'currency',        'VND',
        'pricePerMonth',   18000,
        'publisherName',   'CacheSol',
        'publishedAt',     '2025-10-12',
        'features',        jsonb_build_array(
            'Ticket + SLA',
            'Knowledge base',
            'Multi-channel inbox',
            'Auto-assign',
            'CSAT scoring'
        ),
        'installEndpoint', '/api/tenant-manager/v1/mini-apps/helpdesk/install'
    )
)
ON CONFLICT (code) DO UPDATE
SET metadata = EXCLUDED.metadata,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    is_active = TRUE;
