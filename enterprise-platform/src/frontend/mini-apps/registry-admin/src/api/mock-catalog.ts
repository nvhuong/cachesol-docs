/**
 * Registry Admin — local catalog mock.
 * Trong production sẽ fetch từ `GET /v1/admin/mini-apps` của Platform Registry.
 */
export interface RegistryAdminMiniApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  iconUrl?: string;
  category: 'hr' | 'sales' | 'finance' | 'operations' | 'analytics' | 'productivity';
  status: 'draft' | 'published' | 'archived';
  /** Tenant count using this app. */
  tenantCount: number;
  /** Total monthly revenue. */
  monthlyRevenue: number;
  currency: string;
  features: string[];
  publisherName: string;
  publishedAt?: string;
  updatedAt: string;
}

export const MOCK_REGISTRY_MINI_APPS: RegistryAdminMiniApp[] = [
  { id: 'hrm', name: 'HRM', tagline: 'Quản lý nhân sự toàn diện', description: '...', category: 'hr', status: 'published', tenantCount: 12, monthlyRevenue: 3_750_000, currency: 'VND', features: ['Hồ sơ', 'Chấm công', 'Tính lương'], publisherName: 'CacheSol', publishedAt: '2025-01-15', updatedAt: '2025-09-01' },
  { id: 'sales', name: 'Sales', tagline: 'CRM + pipeline', description: '...', category: 'sales', status: 'published', tenantCount: 8, monthlyRevenue: 2_240_000, currency: 'VND', features: ['CRM', 'Pipeline', 'Báo giá'], publisherName: 'CacheSol', publishedAt: '2025-03-22', updatedAt: '2025-09-01' },
  { id: 'finance', name: 'Finance', tagline: 'Kế toán & tài chính', description: '...', category: 'finance', status: 'published', tenantCount: 5, monthlyRevenue: 12_500_000, currency: 'VND', features: ['Sổ cái', 'Hóa đơn điện tử'], publisherName: 'CacheSol', publishedAt: '2025-05-10', updatedAt: '2025-09-01' },
  { id: 'operations', name: 'Operations', tagline: 'Vận hành kho', description: '...', category: 'operations', status: 'published', tenantCount: 4, monthlyRevenue: 1_440_000, currency: 'VND', features: ['Kho', 'BOM'], publisherName: 'CacheSol', publishedAt: '2025-07-04', updatedAt: '2025-09-01' },
  { id: 'analytics', name: 'Analytics', tagline: 'BI + dashboard', description: '...', category: 'analytics', status: 'published', tenantCount: 6, monthlyRevenue: 1_440_000, currency: 'VND', features: ['BI', 'Dashboard'], publisherName: 'CacheSol', publishedAt: '2025-09-01', updatedAt: '2025-09-01' },
  { id: 'helpdesk', name: 'Helpdesk', tagline: 'Ticketing & CSKH', description: '...', category: 'productivity', status: 'draft', tenantCount: 0, monthlyRevenue: 0, currency: 'VND', features: ['Ticket', 'SLA'], publisherName: 'CacheSol', updatedAt: '2025-09-15' },
];

export function fetchMockCatalog(): Promise<RegistryAdminMiniApp[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_REGISTRY_MINI_APPS), 250));
}
