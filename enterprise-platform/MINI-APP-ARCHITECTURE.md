# Mini App Architecture - Library Pattern

Tài liệu này làm rõ cách **Mini App** hoạt động trong Enterprise Platform: mỗi mini app được build dưới dạng **library/package** và được host app (shell) nhúng vào runtime.

> **Phiên bản:** Đồng bộ với cấu trúc `src/` (SOURCE-CODE-STRUCTURE.md v2).

---

## Tổng quan Mô hình

```
┌─────────────────────────────────────────────────────────────┐
│              HOST APP / SHELL (Container)                    │
│  - Web Shell (React)                                        │
│  - Mobile Shell (React Native)                              │
│  - Desktop Shell (Electron)                                 │
│                                                              │
│  Chứa năng:                                                  │
│  - Authentication, Routing, Layout, Menu                     │
│  - Global stores (auth, app, ui)                            │
│  - i18n provider, Theme provider                             │
└─────────────────────────────────────────────────────────────┘
                        │
                        │ nhúng runtime
                        ▼
┌─────────────────────────────────────────────────────────────┐
│   MINI APP #1 (Library)         MINI APP #2 (Library)       │
│   - HRM Mini App               - Sales Mini App             │
│   - Đăng ký routes             - Đăng ký routes             │
│   - Đăng ký menu items         - Đăng ký menu items         │
│   - Export components          - Export components          │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Phân biệt: Web App vs Library

### ❌ Web App độc lập (KHÔNG phải mini app)

```
hrm-miniapp/
├── index.html       ← Web app độc lập
├── main.tsx         ← Entry point riêng
└── App.tsx          ← Root component riêng
```

- Chạy độc lập trên URL riêng (`hrm.cachesol.com`)
- Có authentication, layout, routing riêng
- Không thể nhúng vào app khác

### ✅ Mini App dạng Library (ĐÚNG mô hình)

```
hrm-miniapp/
├── src/
│   ├── index.ts           ← Entry point export
│   ├── manifest.ts        ← Khai báo routes, menu, permissions
│   └── ...
├── package.json           ← "main": "dist/index.js"
└── vite.config.ts         ← Build dạng library (lib mode)
```

- **KHÔNG** có `index.html`, `main.tsx`
- Export qua `index.ts`: routes, components, hooks, manifest
- Host app import và đăng ký runtime

---

## 2. Cấu trúc Mono-repo

**Quan trọng:** Frontend workspace nằm trong `src/frontend/` ở **root** của enterprise-platform (cấu trúc `src/` từ v2 — xem `SOURCE-CODE-STRUCTURE.md`). Mỗi mini app nằm ở `src/frontend/mini-apps/`, **KHÔNG** tạo `frontend/` riêng trong từng `applications/{name}/`.

```
enterprise-platform/
├── src/                              # ⭐ SOURCE CODE DUY NHẤT
│   └── frontend/                     # Frontend mono-repo
│       ├── package.json              ← Root workspace config (npm/yarn workspaces)
│       │
│       ├── apps/                     ← HOST APPS (Shell) - toàn cục
│       │   ├── web-shell/            ← Web container - DUY NHẤT có index.html
│       │   └── mobile-shell/         ← (Tùy chọn) React Native shell
│
│       ├── mini-apps/                ← MINI APPS (Libraries)
│       │   ├── hrm-mini-app/
│       │   │   ├── src/
│       │   │   │   ├── index.ts     ← Public API
│       │   │   │   ├── manifest.ts  ← Routes, menu, permissions
│       │   │   │   ├── features/    ← Feature modules
│       │   │   │   ├── components/  ← Feature components
│       │   │   │   └── common/      ← Mini app specific common
│       │   │   ├── vite.config.ts   ← Library build config
│       │   │   ├── tsconfig.json
│       │   │   └── package.json     ← name: @cachesol/hrm-mini-app
│       │   │
│       │   ├── sales-mini-app/
│       │   └── erp-mini-app/
│
│       ├── shared/                   ← Shared libraries (dùng cho nhiều mini app)
│       │   ├── shared-ui/           ← Shared UI components
│       │   │   ├── src/
│       │   │   │   ├── components/
│       │   │   │   ├── hooks/
│       │   │   │   ├── utils/
│       │   │   │   └── index.ts
│       │   │   └── package.json     ← @cachesol/shared-ui
│       │   │
│       │   ├── shared-types/        ← Shared TypeScript types
│       │   │   └── package.json     ← @cachesol/shared-types
│       │   │
│       │   ├── shared-api/          ← API client, interceptors
│       │   │   └── package.json     ← @cachesol/shared-api
│       │   │
│       │   └── shared-config/       ← ESLint, TSConfig, Vite config
│       │       └── package.json
│
│       ├── design-system/           ← Design System CODE library (@cachesol/design-system: tokens TS + base components)
│       │   └── package.json         // DOCS markdown tương ứng ở /design-system/ ở root repo
│
│       └── package.json
│
├── applications/                     # CHỈ CHỨA docs / requirement / tests (KHÔNG có code)
│   ├── hrm/
│   │   ├── docs/
│   │   ├── requirement/
│   │   └── tests/
│   ├── erp/
│   └── sales/
│
├── governance/, agents/, skills/, workflows/
```

---

## 3. Cấu trúc Mini App (Library)

### 3.1 File Structure

```
hrm-mini-app/
├── src/
│   │
│   ├── index.ts                      ← PUBLIC API - quan trọng nhất
│   │                                   Export: MiniAppConfig, routes, components
│   │
│   ├── manifest.ts                   ← Khai báo metadata
│   │                                   - routes
│   │                                   - menu items
│   │                                   - permissions
│   │                                   - dependencies
│   │
│   ├── common/                       ← Mini app specific common
│   │   ├── components/              ← Common components riêng của mini app
│   │   ├── hooks/                   ← Custom hooks riêng
│   │   ├── utils/                   ← Utilities riêng
│   │   └── constants/               ← Constants riêng
│   │
│   ├── features/                     ← Feature modules
│   │   └── employees/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── pages/               ← Page components (KHÔNG tự routing)
│   │       ├── api/
│   │       ├── types/
│   │       └── index.ts             ← Export của feature
│   │
│   └── components/                   ← Mini app specific components
│
├── package.json                      ← "main", "module", "types"
├── vite.config.ts                    ← build.lib config
├── tsconfig.json
└── README.md
```

### 3.2 `index.ts` - Public API

```typescript
// src/index.ts
import type { MiniAppManifest } from '@cachesol/shared-types';

// Manifest khai báo metadata
export const manifest: MiniAppManifest = {
  id: 'hrm-mini-app',
  name: 'HRM',
  version: '1.0.0',
  routes: [
    {
      path: '/employees',
      component: () => import('./features/employees/pages/EmployeeListPage'),
      menuItem: { label: 'Nhân viên', icon: 'TeamOutlined' },
      permissions: ['employee:read'],
    },
    // ...
  ],
};

// Export các component quan trọng (nếu shell cần dùng)
export { EmployeeListPage } from './features/employees/pages/EmployeeListPage';
export { EmployeeDetailPage } from './features/employees/pages/EmployeeDetailPage';
export { EmployeeFormPage } from './features/employees/pages/EmployeeFormPage';

// Export hooks
export { useEmployees } from './features/employees/hooks';

// Default export - Shell sẽ import default
export default {
  manifest,
  // có thể thêm lifecycle hooks
  onMount: () => console.log('HRM mini app mounted'),
  onUnmount: () => console.log('HRM mini app unmounted'),
};
```

### 3.3 `manifest.ts` - Metadata

```typescript
// src/manifest.ts
import type { MiniAppManifest } from '@cachesol/shared-types';

export const manifest: MiniAppManifest = {
  id: 'hrm-mini-app',
  name: 'HRM',
  version: '1.0.0',

  // Routes mà mini app đăng ký
  routes: [
    {
      path: '/employees',
      title: 'Quản lý nhân viên',
      component: () => import('./features/employees/pages/EmployeeListPage'),
      menuItem: {
        key: 'employees',
        labelKey: 'menu.employees',
        icon: 'TeamOutlined',
        order: 10,
      },
      permissions: ['employee:read'],
    },
    {
      path: '/employees/new',
      title: 'Tạo nhân viên',
      component: () => import('./features/employees/pages/EmployeeFormPage'),
      permissions: ['employee:write'],
    },
  ],

  // Permissions mà mini app yêu cầu
  permissions: [
    'employee:read',
    'employee:write',
    'employee:delete',
  ],

  // Dependencies (mini app khác)
  dependencies: ['iam-mini-app'],

  // i18n resources
  i18n: {
    vi: () => import('./i18n/locales/vi.json'),
    en: () => import('./i18n/locales/en.json'),
  },

  // API endpoints mini app sử dụng
  api: {
    baseUrl: '/api/v1/employees',
  },
};
```

### 3.4 `package.json`

```json
{
  "name": "@cachesol/hrm-mini-app",
  "version": "1.0.0",
  "description": "HRM Mini App - Quản lý nhân sự",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./manifest": {
      "import": "./dist/manifest.mjs",
      "types": "./dist/manifest.d.ts"
    },
    "./style": "./dist/style.css"
  },
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "dev": "vite build --watch",
    "build": "tsc && vite build",
    "test": "vitest"
  },
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.0.0",
    "antd": "^5.0.0",
    "@tanstack/react-query": "^5.0.0"
  },
  "dependencies": {
    "@cachesol/shared-ui": "workspace:*",
    "@cachesol/shared-types": "workspace:*",
    "@cachesol/shared-api": "workspace:*",
    "@cachesol/design-system": "workspace:*",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0"
  }
}
```

### 3.5 `vite.config.ts` - Library Build

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'HrmMiniApp',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-router-dom',
        'antd',
        '@ant-design/icons',
        '@tanstack/react-query',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css';
          return assetInfo.name;
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
```

---

## 4. Shared Libraries

### 4.1 `shared-ui` - Shared UI Components

```
shared-ui/
├── src/
│   ├── components/
│   │   ├── DataTable/              ← Generic data table
│   │   ├── FormBuilder/            ← Generic form builder
│   │   ├── PageHeader/             ← Page header
│   │   ├── EmptyState/             ← Empty state UI
│   │   ├── LoadingState/           ← Loading UI
│   │   ├── ErrorBoundary/          ← Error boundary
│   │   ├── ConfirmDialog/          ← Confirm dialog
│   │   └── ...
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── usePagination.ts
│   │   ├── useTableSort.ts
│   │   └── ...
│   │
│   ├── utils/
│   │   ├── formatters/
│   │   │   ├── formatCurrency.ts
│   │   │   ├── formatDate.ts
│   │   │   └── formatNumber.ts
│   │   └── validators/
│   │
│   ├── constants/
│   │
│   ├── types/
│   │
│   ├── theme/
│   │   ├── tokens.ts               ← Design tokens
│   │   └── antd-theme.ts
│   │
│   └── index.ts                    ← Public exports
│
└── package.json                    ← @cachesol/shared-ui
```

### 4.2 `shared-types` - Shared Types

```typescript
// src/types/mini-app.ts
export interface MiniAppManifest {
  id: string;
  name: string;
  version: string;
  routes: MiniAppRoute[];
  permissions?: string[];
  dependencies?: string[];
  i18n?: Record<string, () => Promise<unknown>>;
  api?: {
    baseUrl?: string;
    endpoints?: Record<string, string>;
  };
}

export interface MiniAppRoute {
  path: string;
  title?: string;
  component: () => Promise<{ default: React.ComponentType }>;
  menuItem?: MenuItemConfig;
  permissions?: string[];
  layout?: 'main' | 'blank' | 'auth';
  meta?: Record<string, unknown>;
}

export interface MenuItemConfig {
  key: string;
  labelKey: string;  // i18n key
  icon?: string;
  order?: number;
  parentKey?: string;
  permissions?: string[];
}

// Shared API types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  traceId?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
```

### 4.3 `shared-api` - API Client

```typescript
// src/index.ts
export { apiClient } from './client/axios-instance';
export { createQueryClient } from './client/query-client';
export { setupAuthInterceptor } from './interceptors/auth';
export { setupErrorInterceptor } from './interceptors/error';
```

### 4.4 `shared-config` - Shared Build Configs

```
shared-config/
├── eslint/
│   ├── base.js
│   ├── react.js
│   └── typescript.js
├── tsconfig/
│   ├── base.json
│   ├── react.json
│   └── library.json
└── vite/
    ├── base.config.ts
    └── library.config.ts
```

---

## 5. Shell App - Host Application

### 5.1 Cấu trúc Shell

> Vị trí mới: `src/frontend/apps/web-shell/` (theo cấu trúc `src/` v2)

```
src/frontend/apps/web-shell/
├── src/
│   │
│   ├── main.tsx                     ← Entry point (DUY NHẤT có)
│   ├── App.tsx
│   │
│   ├── shell/                       ← Shell-specific code
│   │   ├── MiniAppLoader.tsx       ← Load & register mini apps
│   │   ├── DynamicRouter.tsx       ← Dynamic router based on mini apps
│   │   ├── MenuBuilder.tsx         ← Build menu từ manifests
│   │   └── PermissionGuard.tsx     ← Permission guard
│   │
│   ├── routes/                      ← Global routes (login, 404)
│   │   ├── RequireAuth.tsx
│   │   └── routes.config.ts
│   │
│   ├── layouts/
│   │   └── MainLayout.tsx          ← Global layout
│   │
│   ├── stores/                      ← Global stores
│   │   ├── authStore.ts
│   │   ├── appStore.ts
│   │   └── miniAppStore.ts         ← Quản lý loaded mini apps
│   │
│   ├── i18n/                        ← Global i18n
│   │
│   └── pages/                       ← Shell-only pages
│       ├── LoginPage.tsx
│       └── NotFoundPage.tsx
│
├── index.html
├── vite.config.ts                   ← Shell build (NOT lib mode)
└── package.json
```

### 5.2 Shell `main.tsx`

```tsx
// src/frontend/apps/web-shell/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

// Import mini apps (workspace packages)
import hrmMiniApp from '@cachesol/hrm-mini-app';
import salesMiniApp from '@cachesol/sales-mini-app';
import erpMiniApp from '@cachesol/erp-mini-app';

// Register mini apps
const miniApps = [hrmMiniApp, salesMiniApp, erpMiniApp];

// Global registry
window.__CACHESOL_MINI_APPS__ = miniApps;

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <App miniApps={miniApps} />
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
```

### 5.3 Shell `App.tsx`

```tsx
// src/frontend/apps/web-shell/src/App.tsx
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useMiniAppStore } from './stores/miniAppStore';
import { buildRouter } from './shell/DynamicRouter';
import { useI18n } from './shell/I18nProvider';
import type { MiniAppManifest } from '@cachesol/shared-types';

interface AppProps {
  miniApps: Array<{
    manifest: MiniAppManifest;
    default?: unknown;
  }>;
}

const App = ({ miniApps }: AppProps) => {
  const { registerMiniApps } = useMiniAppStore();
  const { loadMiniAppI18n } = useI18n();

  useEffect(() => {
    // Register all mini apps
    registerMiniApps(miniApps);

    // Load i18n từ tất cả mini apps
    miniApps.forEach((app) => loadMiniAppI18n(app.manifest));
  }, [miniApps, registerMiniApps, loadMiniAppI18n]);

  const router = buildRouter();

  return <RouterProvider router={router} />;
};

export default App;
```

### 5.4 `DynamicRouter.tsx`

```tsx
// src/frontend/apps/web-shell/src/shell/DynamicRouter.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { RequireAuth } from '@/routes/RequireAuth';
import { useMiniAppStore } from '@/stores/miniAppStore';

export const buildRouter = () => {
  const { miniApps } = useMiniAppStore.getState();

  const miniAppRoutes = miniApps.flatMap((app) => {
    return app.manifest.routes.map((route) => ({
      path: route.path,
      lazy: route.component,
      // Có thể thêm permissions check ở đây
    }));
  });

  return createBrowserRouter([
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      element: <RequireAuth><MainLayout /></RequireAuth>,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: 'dashboard', element: <DashboardPage /> },
        ...miniAppRoutes,
      ],
    },
  ]);
};
```

---

## 6. Workspace Setup

### 6.1 Root `package.json`

> Vị trí: `src/frontend/package.json`

```json
{
  "name": "@cachesol/frontend",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "mini-apps/*",
    "shared/*",
    "design-system"
  ],
  "scripts": {
    "dev": "npm run dev --workspace=apps/web-shell",
    "build": "npm run build --workspaces --if-present",
    "build:mini-app": "npm run build --workspace=@cachesol/hrm-mini-app",
    "test": "npm run test --workspaces --if-present",
    "lint": "eslint . --ext ts,tsx"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

### 6.2 `pnpm-workspace.yaml` (nếu dùng pnpm)

> Vị trí: `src/frontend/pnpm-workspace.yaml`

```yaml
packages:
  - 'apps/*'
  - 'mini-apps/*'
  - 'shared/*'
  - 'design-system'
```

---

## 7. Tóm tắt Phân biệt

| Aspect | Web App (❌) | Mini App Library (✅) |
|--------|-------------|----------------------|
| Entry point | `index.html` + `main.tsx` | `index.ts` (export) |
| Build mode | App (SPA) | Library (lib) |
| `package.json` main | - | `dist/index.js` |
| Routing | Tự đăng ký | Đăng ký qua manifest |
| Authentication | Tự xử lý | Dùng shell's auth |
| Layout | Tự có | Dùng shell's layout |
| Deploy | URL riêng | Nhúng vào shell |
| Hot reload | Độc lập | Qua shell |
| Test | E2E riêng | Unit test + Integration với shell |
| Vị trí | (root project) | `src/frontend/mini-apps/{name}-mini-app/` |

---

## 8. Quy trình phát triển

```
1. Tạo mini app mới trong src/frontend/mini-apps/
   ↓
2. Develop với HMR (mini app watch mode + shell dev mode)
   ↓
3. Build mini app → dist/
   ↓
4. Shell import từ workspace package
   ↓
5. Test integration trong shell
   ↓
6. Publish lên internal registry (nếu cần share với team khác)
```

---

## 9. Liên kết

- [SOURCE-CODE-STRUCTURE.md](./SOURCE-CODE-STRUCTURE.md) - Cấu trúc `src/` tổng thể
- [Frontend Standards](./governance/architecture/standards/frontend.md)
