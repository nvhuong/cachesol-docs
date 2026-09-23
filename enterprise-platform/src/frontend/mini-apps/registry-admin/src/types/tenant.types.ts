/**
 * Tenant — entity trong Platform Registry.
 */
export type TenantStatus =
  | 'pending'   // Đang tạo
  | 'provisioning'  // Đang provision infra
  | 'active'    // Hoạt động
  | 'suspended' // Tạm dừng (quá hạn thanh toán)
  | 'deleted';  // Soft-deleted

export type SubscriptionPlan = 'trial' | 'starter' | 'business' | 'enterprise';

export interface TenantMiniApp {
  miniAppId: string;
  enabledAt: string;
  seats: number;
  monthlyCost: number;
  currency: string;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  taxCode: string;
  country: string;
  status: TenantStatus;
  plan: SubscriptionPlan;
  enabledMiniApps: TenantMiniApp[];
  contactEmail: string;
  contactPhone?: string;
  seats: number;
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string;
}
