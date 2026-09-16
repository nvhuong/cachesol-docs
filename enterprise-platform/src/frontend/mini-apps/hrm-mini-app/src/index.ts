import type { MiniAppPackage } from '@cachesol/shared-types';
import { manifest } from './manifest';

/**
 * HRM Mini App Public API
 * 
 * Đây là entry point duy nhất mà Shell sẽ import.
 * Mini app này KHÔNG có index.html hay main.tsx.
 * 
 * Shell sẽ:
 * 1. Import default export
 * 2. Đăng ký routes từ manifest.routes
 * 3. Build menu từ manifest.menu
 * 4. Load i18n từ manifest.i18n
 */
const HrmMiniApp: MiniAppPackage = {
  manifest,
  
  lifecycle: {
    onMount: () => {
      console.log('[HRM Mini App] Mounted');
    },
    onUnmount: () => {
      console.log('[HRM Mini App] Unmounted');
    },
  },
};

export default HrmMiniApp;
export { manifest } from './manifest';

// Public exports - Shell có thể dùng trực tiếp
export { EmployeeListPage } from './features/employees/pages/EmployeeListPage';
export { EmployeeDetailPage } from './features/employees/pages/EmployeeDetailPage';
export { EmployeeFormPage } from './features/employees/pages/EmployeeFormPage';

export type * from './types/employee.types';
