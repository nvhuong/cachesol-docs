import type { MiniAppPackage } from '@cachesol/shared-types';
import { manifest } from './manifest';

const RegistryAdmin: MiniAppPackage = {
  manifest,
  lifecycle: {
    onMount: () => console.log('[Registry Admin] Mounted'),
    onUnmount: () => console.log('[Registry Admin] Unmounted'),
  },
};

export default RegistryAdmin;
export { manifest } from './manifest';

// Pages
export { DashboardPage } from './pages/dashboard/DashboardPage';
export { TenantsListPage } from './pages/tenants/TenantsListPage';
export { TenantDetailPage } from './pages/tenants/TenantDetailPage';
export { MiniAppsCatalogPage } from './pages/mini-apps/MiniAppsCatalogPage';
export { ProvidersPage } from './pages/providers/ProvidersPage';
export { SettingsPage } from './pages/settings/SettingsPage';
export { AuditLogPage } from './pages/settings/AuditLogPage';

// Shell + layout
export { RegistryAdminShell } from './layout/RegistryAdminShell';
export { usePlatformRegistryContext, PlatformRegistryProvider } from './layout/PlatformRegistryContext';

// Types
export type * from './types/tenant.types';
export type * from './types/admin.types';
