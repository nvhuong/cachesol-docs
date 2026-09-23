/**
 * Local mock catalog — represents what Platform Registry would return from
 * GET /v1/public/mini-apps. Replace with real fetch when backend ready.
 */
import type { PublicMiniApp, MiniAppCatalogResponse } from '../types/miniapp-catalog.types';

export const MOCK_MINI_APPS: PublicMiniApp[] = [
  {
    id: 'hrm',
    name: 'HRM',
    tagline: 'Quản lý nhân sự toàn diện',
    description:
      'Quản lý hồ sơ nhân viên, hợp đồng, chấm công, tính lương, đánh giá hiệu suất và tuyển dụng — tất cả trong một hệ thống thống nhất.',
    category: 'hr',
    pricing: 'per-user',
    minSeats: 5,
    currency: 'VND',
    pricePerMonth: 25000,
    features: [
      'Hồ sơ nhân viên + lịch sử',
      'Chấm công GPS / QR / Web',
      'Tính lương BHXH tự động',
      'Đánh giá KPI 360°',
      'Tuyển dụng + ATS',
    ],
    publisherName: 'CacheSol',
    publishedAt: '2025-01-15',
    installEndpoint: '/api/tenant-manager/v1/mini-apps/hrm/install',
  },
  {
    id: 'sales',
    name: 'Sales',
    tagline: 'CRM + pipeline + báo giá',
    description:
      'Quản lý leads, opportunities, pipeline bán hàng, tạo báo giá chuyên nghiệp và theo dõi hiệu suất đội ngũ sales.',
    category: 'sales',
    pricing: 'per-user',
    minSeats: 3,
    currency: 'VND',
    pricePerMonth: 35000,
    features: [
      'CRM + Lead scoring',
      'Pipeline kanban',
      'Báo giá PDF + e-sign',
      'Báo cáo doanh thu',
      'Tích hợp Email / SMS',
    ],
    publisherName: 'CacheSol',
    publishedAt: '2025-03-22',
    installEndpoint: '/api/tenant-manager/v1/mini-apps/sales/install',
  },
  {
    id: 'finance',
    name: 'Finance',
    tagline: 'Kế toán & tài chính doanh nghiệp',
    description:
      'Sổ cái, công nợ, hóa đơn điện tử, báo cáo tài chính theo chuẩn VAS/IFRS, tích hợp ngân hàng.',
    category: 'finance',
    pricing: 'flat-rate',
    currency: 'VND',
    pricePerMonth: 2500000,
    features: [
      'Sổ cái + sổ phụ',
      'Hóa đơn điện tử VNPT/MISA',
      'Công nợ phải thu/phải trả',
      'Báo cáo tài chính',
      'Kết nối ngân hàng',
    ],
    publisherName: 'CacheSol',
    publishedAt: '2025-05-10',
  },
  {
    id: 'operations',
    name: 'Operations',
    tagline: 'Vận hành & quản lý kho',
    description:
      'Quản lý kho, xuất nhập, định tuyến giao hàng, theo dõi BOM và chi phí sản xuất.',
    category: 'operations',
    pricing: 'per-user',
    currency: 'VND',
    pricePerMonth: 30000,
    features: [
      'Kho + barcode/QR',
      'Xuất nhập theo lô/HSD',
      'BOM + định mức NVL',
      'Định tuyến giao hàng',
      'Chi phí sản xuất',
    ],
    publisherName: 'CacheSol',
    publishedAt: '2025-07-04',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    tagline: 'BI + dashboard + báo cáo',
    description:
      'Kết nối dữ liệu từ mọi mini-app, xây dựng dashboard, báo cáo self-service và chia sẻ với team.',
    category: 'analytics',
    pricing: 'per-user',
    currency: 'VND',
    pricePerMonth: 20000,
    features: [
      'Kết nối dữ liệu realtime',
      'Dashboard drag-drop',
      'Báo cáo self-service',
      'Export Excel/PDF',
      'Phân quyền dòng dữ liệu',
    ],
    publisherName: 'CacheSol',
    publishedAt: '2025-09-01',
  },
  {
    id: 'helpdesk',
    name: 'Helpdesk',
    tagline: 'Ticketing & CSKH',
    description:
      'Hệ thống ticket, SLA, knowledge base, multi-channel (Email/Web/Chat) và báo cáo CSKH.',
    category: 'productivity',
    pricing: 'per-user',
    currency: 'VND',
    pricePerMonth: 18000,
    features: [
      'Ticket + SLA',
      'Knowledge base',
      'Multi-channel inbox',
      'Auto-assign',
      'CSAT scoring',
    ],
    publisherName: 'CacheSol',
    publishedAt: '2025-10-12',
  },
];

export function fetchMockCatalog(): Promise<MiniAppCatalogResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ total: MOCK_MINI_APPS.length, items: MOCK_MINI_APPS });
    }, 300);
  });
}

export function fetchMockApp(id: string): Promise<PublicMiniApp | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_MINI_APPS.find((a) => a.id === id) ?? null);
    }, 200);
  });
}
