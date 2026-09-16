import type { MiniAppManifest } from '@cachesol/shared-types';

/**
 * HRM Mini App Manifest
 * 
 * Khai báo tất cả metadata mà Shell cần biết để load mini app này.
 */
export const manifest: MiniAppManifest = {
  id: 'hrm-mini-app',
  name: 'HRM',
  version: '1.0.0',
  description: 'Quản lý nhân sự - Employees, Departments, Positions',
  icon: 'TeamOutlined',
  author: 'CacheSol HRM Team',

  // Routes mà mini app này đăng ký
  // Shell sẽ tự động load component từ đường dẫn này
  routes: [
    {
      path: '/employees',
      title: 'Quản lý nhân viên',
      component: () => import('./features/employees/pages/EmployeeListPage'),
      layout: 'main',
      showInMenu: true,
      permissions: ['employee:read'],
    },
    {
      path: '/employees/new',
      title: 'Tạo nhân viên',
      component: () => import('./features/employees/pages/EmployeeFormPage'),
      layout: 'main',
      permissions: ['employee:write'],
    },
    {
      path: '/employees/:id',
      title: 'Chi tiết nhân viên',
      component: () => import('./features/employees/pages/EmployeeDetailPage'),
      layout: 'main',
      permissions: ['employee:read'],
    },
    {
      path: '/employees/:id/edit',
      title: 'Sửa nhân viên',
      component: () => import('./features/employees/pages/EmployeeFormPage'),
      layout: 'main',
      permissions: ['employee:write'],
    },
  ],

  // Menu items cho Shell
  menu: [
    {
      key: 'employees',
      labelKey: 'menu.employees',
      icon: 'TeamOutlined',
      order: 10,
      path: '/employees',
      permissions: ['employee:read'],
    },
  ],

  // Permissions yêu cầu
  permissions: [
    'employee:read',
    'employee:write',
    'employee:delete',
  ],

  // i18n resources - lazy load
  i18n: {
    vi: () => import('./i18n/locales/vi.json'),
    en: () => import('./i18n/locales/en.json'),
  },

  // API configuration
  api: {
    baseUrl: '/api/v1/employees',
  },
};
