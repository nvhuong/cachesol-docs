/**
 * Dev-only entry: renders Tenant Manager Admin mini-app as a standalone SPA.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { TenantManagerAdminShell } from './layout/TenantManagerAdminShell';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { OrganizationsListPage } from './pages/organizations/OrganizationsListPage';
import { EmployeesListPage } from './pages/employees/EmployeesListPage';
import { JobTitlesPage } from './pages/job-titles/JobTitlesPage';
import { RolesPage } from './pages/roles/RolesPage';
import { UsersPage } from './pages/users/UsersPage';
import { KeycloakSyncPage } from './pages/keycloak/KeycloakSyncPage';
import { ProvisioningPage } from './pages/provisioning/ProvisioningPage';
import { AuditLogPage } from './pages/audit/AuditLogPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import '@cachesol/design-system/tokens.css';
import '@cachesol/design-system/styles.css';
import 'antd/dist/reset.css';

function ShellLayout() {
  return (
    <TenantManagerAdminShell>
      <Outlet />
    </TenantManagerAdminShell>
  );
}

function App() {
  return (
    <StrictMode>
      <ConfigProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ShellLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/organizations" element={<OrganizationsListPage />} />
              <Route path="/employees" element={<EmployeesListPage />} />
              <Route path="/job-titles" element={<JobTitlesPage />} />
              <Route path="/roles" element={<RolesPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/keycloak" element={<KeycloakSyncPage />} />
              <Route path="/provisioning" element={<ProvisioningPage />} />
              <Route path="/audit" element={<AuditLogPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </StrictMode>
  );
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
