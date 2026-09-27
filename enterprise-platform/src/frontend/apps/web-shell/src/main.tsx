import React from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntApp, ConfigProvider } from 'antd';
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
import { useMiniAppStore } from '@/stores/miniAppStore';
import { ShellProvider } from '@cachesol/design-system';
import './i18n';
import './styles/global.css';

// ── Global CSS ───────────────────────────────────────────────────
// Order: design tokens → component styles → antd reset → mini-app styles.
// Web-shell owns loading these so mini-app classes resolve when rendered here.
import '@cachesol/design-system/tokens.css';
import '@cachesol/design-system/styles.css';
import 'antd/dist/reset.css';
import '@cachesol/landing-mini-app/styles.css';

const queryClient = createQueryClient();

const MINI_APPS = [landingMiniApp, hrmMiniApp, registryAdmin, tenantManagerAdmin];

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Register mini-apps SYNCHRONOUSLY before any React render,
//    so App's router build can pick them up. ──
useMiniAppStore.getState().registerMiniApps(MINI_APPS);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* AntApp provides message/notification/modal contexts so `App.useApp()` works anywhere */}
    <AntApp>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={cachesolTheme} locale={viVN}>
          <ShellProvider>
            <App miniApps={MINI_APPS} />
          </ShellProvider>
        </ConfigProvider>
      </QueryClientProvider>
    </AntApp>
  </React.StrictMode>
);
