import type { MiniAppPackage } from '@cachesol/shared-types';
import { manifest } from './manifest';

const TenantManagerAdmin: MiniAppPackage = {
  manifest,
  lifecycle: {
    onMount: () => console.log('[Tenant Manager Admin] Mounted'),
    onUnmount: () => console.log('[Tenant Manager Admin] Unmounted'),
  },
};

export default TenantManagerAdmin;
export { manifest } from './manifest';

// Shell + context
export { TenantManagerAdminShell } from './layout/TenantManagerAdminShell';
export { TenantManagerProvider, useTenantManager } from './layout/TenantManagerContext';

// Pages
export { DashboardPage } from './pages/dashboard/DashboardPage';
export { OrganizationsListPage } from './pages/organizations/OrganizationsListPage';
export { EmployeesListPage } from './pages/employees/EmployeesListPage';
export { JobTitlesPage } from './pages/job-titles/JobTitlesPage';
export { RolesPage } from './pages/roles/RolesPage';
export { UsersPage } from './pages/users/UsersPage';
export { KeycloakSyncPage } from './pages/keycloak/KeycloakSyncPage';
export { ProvisioningPage } from './pages/provisioning/ProvisioningPage';
export { AuditLogPage } from './pages/audit/AuditLogPage';
export { SettingsPage } from './pages/settings/SettingsPage';
export { LoginPage } from './pages/LoginPage';

// Types
export type * from './types/organization.types';
export type * from './types/employee.types';
export type * from './types/provisioning.types';
