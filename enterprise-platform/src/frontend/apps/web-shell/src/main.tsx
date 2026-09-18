import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import { cachesolTheme } from '@cachesol/design-system';
import { createQueryClient, apiClient } from '@cachesol/shared-api';
import hrmMiniApp from '@cachesol/hrm-mini-app';
import { useAuthStore } from '@/stores/authStore';
import './i18n';
import './styles/global.css';

const queryClient = createQueryClient();

// Danh sách mini apps - có thể load dynamically từ config server
const MINI_APPS = [hrmMiniApp];

// Khởi tạo API client với auth store
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
