/**
 * Dev-only entry: renders Registry Admin mini-app as a standalone SPA.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { RegistryAdminShell } from './layout/RegistryAdminShell';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { TenantsListPage } from './pages/tenants/TenantsListPage';
import { TenantDetailPage } from './pages/tenants/TenantDetailPage';
import { MiniAppsCatalogPage } from './pages/mini-apps/MiniAppsCatalogPage';
import { ProvidersPage } from './pages/providers/ProvidersPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { AuditLogPage } from './pages/settings/AuditLogPage';
import '@cachesol/design-system/tokens.css';
import '@cachesol/design-system/styles.css';
import 'antd/dist/reset.css';

function ShellLayout() {
  return (
    <RegistryAdminShell>
      <Outlet />
    </RegistryAdminShell>
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
              <Route path="/tenants" element={<TenantsListPage />} />
              <Route path="/tenants/:id" element={<TenantDetailPage />} />
              <Route path="/mini-apps" element={<MiniAppsCatalogPage />} />
              <Route path="/providers" element={<ProvidersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/audit" element={<AuditLogPage />} />
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
