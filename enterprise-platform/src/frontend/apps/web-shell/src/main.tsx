import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import { cachesolTheme } from '@cachesol/design-system';
import { createQueryClient, apiClient } from '@cachesol/shared-api';
import hrmMiniApp from '@cachesol/hrm-mini-app';
import landingMiniApp from '@cachesol/landing-mini-app';
import registryAdmin from '@cachesol/registry-admin';
import tenantManagerAdmin from '@cachesol/tenant-manager-admin';
import { useAuthStore } from '@/stores/authStore';
import './i18n';
import './styles/global.css';

const queryClient = createQueryClient();

/**
 * Đăng ký mini-apps.
 *
 * Landing mini-app là public (no auth), mounted ở top-level path '/_/landing/*'.
 * HRM, registry-admin, tenant-manager-admin đều cần auth và thường vào subdomain riêng.
 *
 * Trong dev (single-port), tất cả cùng mount ở '/_/...'.
 * Trong prod, mỗi admin sẽ chạy ở subdomain riêng (registry.cachesol.io, acme.cachesol.io).
 */
const MINI_APPS = [landingMiniApp, hrmMiniApp, registryAdmin, tenantManagerAdmin];

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={cachesolTheme} locale={viVN}>
        <App miniApps={MINI_APPS} />
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
