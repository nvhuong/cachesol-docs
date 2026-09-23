/**
 * Mini App Manifest Types
 * 
 * Định nghĩa cấu trúc manifest mà mỗi mini app phải khai báo
 * để shell có thể load và tích hợp.
 */

export interface MiniAppManifest {
  /** Unique ID của mini app (VD: 'hrm-mini-app') */
  id: string;
  /** Tên hiển thị */
  name: string;
  /** Version */
  version: string;
  /** Mô tả */
  description?: string;
  /** Icon cho menu */
  icon?: string;
  /** Author */
  author?: string;

  /** Routes mà mini app đăng ký */
  routes: MiniAppRoute[];

  /** Permissions mà mini app yêu cầu */
  permissions?: string[];

  /** Dependencies với mini app khác (id của mini app khác) */
  dependencies?: string[];

  /** i18n resources */
  i18n?: Record<string, () => Promise<unknown>>;

  /** API configuration */
  api?: {
    baseUrl?: string;
    endpoints?: Record<string, string>;
  };

  /** Menu items cho shell hiển thị */
  menu?: MenuConfig[];

  /** Lifecycle hooks */
  lifecycle?: {
    onMount?: () => void | Promise<void>;
    onUnmount?: () => void | Promise<void>;
  };
}

export interface MiniAppRoute {
  /** Path của route (VD: '/employees') */
  path: string;
  /** Title cho page */
  title?: string;
  /** Lazy load component */
  component: () => Promise<{ default: React.ComponentType }>;
  /** Layout sử dụng */
  layout?: 'main' | 'blank' | 'auth';
  /** Permissions yêu cầu để truy cập */
  permissions?: string[];
  /** Hiển thị trong menu */
  showInMenu?: boolean;
  /** Meta data bổ sung */
  meta?: Record<string, unknown>;
}

export interface MenuConfig {
  key: string;
  /** i18n key cho label */
  labelKey: string;
  /** Icon name (Ant Design icon) */
  icon?: string;
  /** Order hiển thị */
  order?: number;
  /** Parent menu key (nếu có) */
  parentKey?: string;
  /** Permissions yêu cầu */
  permissions?: string[];
  /** Path để navigate */
  path?: string;
}

export interface MiniAppLifecycle {
  onMount?: () => void | Promise<void>;
  onUnmount?: () => void | Promise<void>;
}

export interface MiniAppPackage {
  manifest: MiniAppManifest;
  /** Optional lifecycle hooks fired by web-shell khi mount/unmount. */
  lifecycle?: MiniAppLifecycle;
  /** Default export — toàn bộ module của mini-app (router, store, ...). */
  default?: unknown;
}
