/**
 * Mock data cho Registry Admin dev mode.
 * Trong production thay thế bằng `apiClient.get('/v1/admin/tenants')`.
 */
import type { Tenant } from '../types/tenant.types';
import type { AuditEntry, ProviderConfig, RegistrySettings } from '../types/admin.types';

export const MOCK_TENANTS: Tenant[] = [
  {
    id: 'tnt_acme',
    slug: 'acme',
    name: 'ACME Corp',
    taxCode: '0123456789',
    country: 'VN',
    status: 'active',
    plan: 'business',
    enabledMiniApps: [
      { miniAppId: 'hrm', enabledAt: '2025-02-01', seats: 50, monthlyCost: 1_250_000, currency: 'VND' },
      { miniAppId: 'sales', enabledAt: '2025-04-15', seats: 20, monthlyCost: 700_000, currency: 'VND' },
    ],
    contactEmail: 'admin@acme.com',
    contactPhone: '+84 901 234 567',
    seats: 50,
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-09-15T10:30:00Z',
    lastActivityAt: '2025-09-22T08:14:00Z',
  },
  {
    id: 'tnt_globex',
    slug: 'globex',
    name: 'Globex Vietnam',
    taxCode: '9876543210',
    country: 'VN',
    status: 'provisioning',
    plan: 'starter',
    enabledMiniApps: [],
    contactEmail: 'it@globex.vn',
    seats: 10,
    createdAt: '2025-09-20T00:00:00Z',
    updatedAt: '2025-09-20T00:00:00Z',
  },
  {
    id: 'tnt_initech',
    slug: 'initech',
    name: 'Initech JSC',
    taxCode: '111222333',
    country: 'SG',
    status: 'suspended',
    plan: 'business',
    enabledMiniApps: [
      { miniAppId: 'finance', enabledAt: '2025-06-01', seats: 30, monthlyCost: 2_500_000, currency: 'VND' },
    ],
    contactEmail: 'finance@initech.sg',
    seats: 30,
    createdAt: '2025-06-01T00:00:00Z',
    updatedAt: '2025-09-10T00:00:00Z',
    lastActivityAt: '2025-08-30T00:00:00Z',
  },
];

export const MOCK_PROVIDERS: ProviderConfig[] = [
  { id: 'kc_main', kind: 'keycloak', name: 'Keycloak (main)', enabled: true, baseUrl: 'https://kc.cachesol.io', hasSecrets: true, updatedAt: '2025-08-01T00:00:00Z' },
  { id: 'kc_legacy', kind: 'keycloak', name: 'Keycloak (legacy)', enabled: false, hasSecrets: false, updatedAt: '2024-12-01T00:00:00Z' },
  { id: 'stripe', kind: 'stripe', name: 'Stripe', enabled: true, baseUrl: 'https://api.stripe.com', hasSecrets: true, updatedAt: '2025-07-12T00:00:00Z' },
  { id: 'sendgrid', kind: 'sendgrid', name: 'SendGrid', enabled: true, hasSecrets: true, updatedAt: '2025-07-12T00:00:00Z' },
  { id: 'vnpay', kind: 'vnpay', name: 'VNPay', enabled: false, hasSecrets: false, updatedAt: '2025-05-01T00:00:00Z' },
];

export const MOCK_SETTINGS: RegistrySettings = {
  supportEmail: 'support@cachesol.io',
  defaultPlan: 'trial',
  registrationEnabled: true,
  emailFromAddress: 'no-reply@cachesol.io',
  emailFromName: 'CacheSol',
  smtpConfigured: true,
  docsUrl: 'https://docs.cachesol.io',
  statusPageUrl: 'https://status.cachesol.io',
};

export const MOCK_AUDIT: AuditEntry[] = [
  {
    id: 'a1',
    actor: { id: 'admin_1', email: 'nguyen@cachesol.io', name: 'Nguyễn Văn Admin' },
    category: 'tenant.create',
    subject: { type: 'tenant', id: 'tnt_globex', label: 'Globex Vietnam' },
    description: 'Tạo tenant mới từ form đăng ký công khai',
    ip: '14.225.12.34',
    userAgent: 'Chrome 124 / macOS',
    timestamp: '2025-09-20T10:14:33Z',
  },
  {
    id: 'a2',
    actor: { id: 'admin_2', email: 'trang@cachesol.io' },
    category: 'tenant.suspend',
    subject: { type: 'tenant', id: 'tnt_initech', label: 'Initech JSC' },
    description: 'Tạm dừng — quá hạn thanh toán 7 ngày',
    diff: { status: { before: 'active', after: 'suspended' } },
    ip: '14.225.12.40',
    userAgent: 'Firefox 124 / Ubuntu',
    timestamp: '2025-09-10T09:00:00Z',
  },
  {
    id: 'a3',
    actor: { id: 'system', email: 'system@cachesol.io', name: 'System' },
    category: 'mini-app.publish',
    subject: { type: 'mini-app', id: 'analytics', label: 'Analytics' },
    description: 'Phát hành Analytics 1.0 ra catalog công khai',
    ip: '127.0.0.1',
    userAgent: 'cachesol-publisher/1.0',
    timestamp: '2025-09-01T12:00:00Z',
  },
];

export function fetchMockTenants(): Promise<Tenant[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_TENANTS), 300));
}

export function fetchMockTenant(id: string): Promise<Tenant | null> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_TENANTS.find((t) => t.id === id) ?? null), 200),
  );
}

export function fetchMockAudit(): Promise<AuditEntry[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_AUDIT), 200));
}

export function fetchMockProviders(): Promise<ProviderConfig[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_PROVIDERS), 200));
}

export function fetchMockSettings(): Promise<RegistrySettings> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_SETTINGS), 200));
}
