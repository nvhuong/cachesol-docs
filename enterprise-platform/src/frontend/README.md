# CacheSol Frontend — Workspace

Mono-repo chứa **TẤT CẢ** frontend code của CacheSol Enterprise Platform.

---

## Package map

| Package | Type | Auth | Chứa gì |
|---------|------|------|---------|
| `@cachesol/design-system` | **Library** | — | Design tokens (TS + CSS vars), AntD theme, React components, patterns, templates, hooks |
| `@cachesol/shared-ui` | **Library** | — | Utilities — formatters, hooks, generic types |
| `@cachesol/shared-types` | **Library** | — | API response shapes, auth types, mini-app manifest types |
| `@cachesol/shared-api` | **Library** | — | Axios instance, query client, interceptors |
| `web-shell` | **App** | — | Host app — duy nhất có `index.html` |
| `@cachesol/landing-mini-app` | **Mini-app** | **Public** | Landing page — xem mini-apps + đăng ký tenant |
| `@cachesol/hrm-mini-app` | **Mini-app** | Auth (tenant) | HRM feature module |
| `@cachesol/registry-admin` | **Mini-app** | Auth (registry_admin) | Web admin Platform Registry |
| `@cachesol/tenant-manager-admin` | **Mini-app** | Auth (tenant_admin) | Web admin Tenant Manager |

---

## Cấu trúc thư mục

```
src/frontend/
├── apps/
│   └── web-shell/              # Host app (index.html + shell layout)
│       └── src/
│           ├── main.tsx       # Register all mini-apps
│           └── styles/
│               └── global.css # @import '@cachesol/design-system/styles.css'
│
├── mini-apps/
│   ├── landing-mini-app/       # ⭐ PUBLIC — landing + tenant registration
│   ├── hrm-mini-app/           # HRM HRIS
│   ├── registry-admin/         # ⭐ Platform Registry web admin
│   └── tenant-manager-admin/   # ⭐ Tenant Manager web admin
│
├── shared/
│   ├── shared-api/             # @cachesol/shared-api
│   ├── shared-types/           # @cachesol/shared-types
│   └── shared-ui/              # @cachesol/shared-ui (utilities only)
│
└── design-system/              # @cachesol/design-system (canonical UI library)
    ├── src/patterns/AppHeader.tsx     # Topbar shell — dùng cho 2 admin webs
    └── src/patterns/AdminShell.tsx    # Sidebar + AdminShell layout
```

---

## Phân biệt design-system vs shared-ui

| | `@cachesol/design-system` | `@cachesol/shared-ui` |
|---|---|---|
| **Tokens** | ✅ CSS vars + TS | ❌ |
| **Theme** | ✅ `cachesolTheme` (AntD) | ❌ |
| **Components** | ✅ 13 primitives + 12 patterns + 4 templates | ❌ |
| **Formatters** | ❌ | ✅ `formatCurrency`, `formatDate`, `formatNumber`, ... |
| **Hooks** | ✅ `useDensity`, `useBreakpoint`, `useNotifications`, `useHeaderVisibility` | ✅ `useDebounce`, `usePagination` |
| **AdminShell** | ✅ + `AppHeader` (dùng cho 2 admin webs) | — |
| **Types** | Design token types | Generic `BaseEntity`, `BaseComponentProps` |
| **CSS** | ✅ `styles.css` | ❌ |

> **Rule:** Mini-apps import UI từ `@cachesol/design-system`, utilities từ `@cachesol/shared-ui`.

---

## Catalog sử dụng — `@cachesol/design-system`

### 1. Theme & CSS (bắt buộc set up 1 lần)

```tsx
// web-shell/src/main.tsx (root)
import { ConfigProvider } from 'antd';
import { cachesolTheme } from '@cachesol/design-system';
import '@cachesol/design-system/styles.css';   // CSS variables + classes

<ConfigProvider theme={cachesolTheme} locale={viVN}>
  <App />
</ConfigProvider>
```

```css
/* web-shell/src/styles/global.css */
@import '@cachesol/design-system/styles.css';
```

### 2. Tokens — đọc trực tiếp CSS variables hoặc TS

```tsx
import { brand, neutral, spacing, radius, shadow, fontSize } from '@cachesol/design-system';

// CSS variable trong styled CSS hoặc inline style
// var(--color-brand-600), var(--spacing-4), var(--radius-lg), var(--shadow-md), var(--font-size-body-md)
```

| Export | Mô tả |
|--------|--------|
| `brand`, `neutral`, `success`, `warning`, `error`, `chart` | Color palettes |
| `fontFamily`, `fontSize`, `fontWeight`, `lineHeight` | Typography |
| `spacing`, `radius`, `borderWidth`, `control`, `icon`, `avatar`, `modal` | Spacing & sizing |
| `shadow` | 7 elevation levels |
| `duration`, `easing` | Motion tokens |
| `breakpoints`, `breakpointOrder` | Responsive breakpoints |

### 3. Components — 13 primitives

```tsx
import {
  Button, Input, Select, Modal, Drawer, Table, DatePicker,
  DateRangePicker, Tabs, Tree, Form, FormItem, FormErrorList,
  Tag, Avatar, Alert,
} from '@cachesol/design-system';
```

| Component | Variants / Sizes | Use case |
|-----------|-----------------|----------|
| `Button` | 6 variants × 3 sizes | Action trigger |
| `Input` | single + TextArea, label + helper + error + counter | Text/number/textarea |
| `Select` | `single` `multi` `searchable` | Picker |
| `Modal` | 4 variants × 4 sizes | Dialog |
| `Drawer` | 4 sides × 4 sizes | Slide-in panel |
| `Table` | density-aware + helpers `columnAlign`, `tabularCell` | Data grid |
| `DatePicker` | `date` `month` `dateTime` | Date selection |
| `DateRangePicker` | range | Date range |
| `Tabs` | `line` `pill` `card` | Navigation tabs |
| `Tree` | `basic` `checkable` `draggable` `async` | Hierarchical |
| `Form` + `FormItem` + `FormErrorList` | `vertical` `horizontal` `inline` | Form layout |
| `Tag` | 6 semantic variants, `pill`, dot | Status chip |
| `Avatar` | 4 sizes, initials fallback | User avatar |
| `Alert` | 4 types, `banner` mode | Inline notice |

### 4. Patterns — 13 composites

```tsx
import {
  PageHeader, AppHeader, AdminShell, EmptyState, StatusBadge, KPI, DataCard, ConfirmModal,
  LoadingState, ErrorState, Toolbar, FormSection, DetailField, CopyButton, Timeline,
} from '@cachesol/design-system';
```

| Pattern | Use case |
|---------|----------|
| `PageHeader` | Header từng page (title, description, breadcrumb, actions) |
| `AppHeader` | **⭐ Topbar shell cho 2 admin webs** (logo + app switcher 4 inline + More + grid + config + notice + hide/show + account) |
| `AdminShell` | **⭐ Full admin shell** (AppHeader + optional sidebar + content) |
| `EmptyState` | Trạng thái rỗng (4 loại) |
| `StatusBadge` | 16 status enum → màu |
| `KPI` | Label + value + trend + comparison (dashboard metric) |
| `DataCard` | 4 variants (default/elevated/interactive/flush) |
| `ConfirmModal` | Destructive action với name-typing safeguard |
| `LoadingState` | Skeleton/spinner (4 shape) |
| `ErrorState` | Lỗi UI (5 loại) + retry |
| `Toolbar` | List page toolbar (search + filter + bulk) |
| `FormSection` | Nhóm field |
| `DetailField` | Read-only field |
| `CopyButton` | Copy-to-clipboard |
| `Timeline` | Activity log |

### 5. Templates — 4 page-level

```tsx
import { ListPage, DetailPage, FormPage, DashboardPage } from '@cachesol/design-system';
```

| Template | Use case |
|----------|----------|
| `ListPage` | List + toolbar + table + pagination |
| `DetailPage` | Header + tabs + sections |
| `FormPage` | Header + sections + sticky action bar |
| `DashboardPage` | KPI row + charts + secondary |

### 6. Hooks

```tsx
import {
  useDensity, useBreakpoint, useBreakpointAtLeast,
  useNotifications, useHeaderVisibility,
} from '@cachesol/design-system';

const { density, setDensity } = useDensity();
const { current, isMobile, isDesktop } = useBreakpoint();
const isLarge = useBreakpointAtLeast('lg');
const { list, unreadCount, markRead, markAllRead } = useNotifications({ storageKey: 'admin-1' });
const { visible: headerVisible, toggle } = useHeaderVisibility('admin-1');
```

### 7. AdminShell — topbar shell chung cho 2 admin webs

`registry-admin` và `tenant-manager-admin` dùng cùng pattern:

```tsx
import { AdminShell } from '@cachesol/design-system';

<AdminShell
  adminId="registry-admin"                // unique per admin for localStorage
  logo={<img src="/logo.svg" />}
  appName="Platform Registry"
  appSwitcher={[
    { id: 'registry', label: 'Registry', href: '/', active: true, icon: 'R' },
    { id: 'landing', label: 'Landing', href: '/_/landing', icon: 'L' },
    { id: 'tenant-admin', label: 'Tenant Admin', href: '/_/tenant-admin', icon: 'T' },
    // ... more apps; nếu > 4 thì tự động có nút "More"
  ]}
  user={{ name: 'Admin', email: 'admin@cachesol.io' }}
  notifications={[...]}
  sidebar={<Menu ... />}
  onAppSelect={(app) => navigate(app.href)}
  onLogout={() => navigate('/login')}
  onLanguageClick={...}
  onThemeClick={...}
>
  {/* Pages render ở đây */}
</AdminShell>
```

`AppHeader` layout (left → right):
`[Logo] [App1 · App2 · App3 · App4 · More▼] | [Config▼] [Notice🔔] [Hide/Show👁] [Account▼]`

---

## Catalog sử dụng — `@cachesol/shared-ui`

### 1. Formatters

```tsx
import {
  formatCurrency, formatDate, formatDateTime, formatRelative,
  formatNumber, formatCompact, formatPercent,
} from '@cachesol/shared-ui';
```

| Function | Default | Ví dụ |
|----------|---------|-------|
| `formatCurrency(value, currency?, locale?)` | `'VND'`, `'vi-VN'` | `formatCurrency(1234000)` → `"1.234.000 ₫"` |
| `formatDate(date, format?, locale?)` | `'DD MMM YYYY'`, `'en-GB'` | `formatDate(new Date(), 'DD/MM/YYYY')` → `"23/09/2026"` |
| `formatDateTime(date, format?, locale?)` | `'DD/MM/YYYY HH:mm:ss'` | `formatDateTime(new Date())` → `"23/09/2026 14:30:45"` |
| `formatRelative(date, locale?)` | `'en-GB'` | `formatRelative(Date.now() - 3600_000)` → `"1h ago"` |
| `formatNumber(value, locale?)` | `'en-US'` | `formatNumber(1234567, 'vi-VN')` → `"1.234.567"` |
| `formatCompact(value, locale?)` | `'en-US'` | `formatCompact(1_234_567)` → `"1.2M"` |
| `formatPercent(value, locale?, decimals?)` | `'en-US'`, `1` | `formatPercent(0.1234)` → `"12.3%"` |

**Tất cả formatter đều xử lý `null`/`undefined`/`''`/`NaN` → trả `"—"`.**

### 2. Hooks

```tsx
import { useDebounce, usePagination } from '@cachesol/shared-ui';

const debouncedKeyword = useDebounce(keyword, 300);   // generic <T>(value, delayMs)

const {
  page, pageSize, setPage, setPageSize, onChange, reset,
} = usePagination({ defaultPage: 0, defaultPageSize: 20 });
// onChange(newPage, newPageSize) — AntD Table pagination shape
```

### 3. Generic types

```tsx
import type { BaseComponentProps, BaseEntity } from '@cachesol/shared-ui';

interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

// Domain entity extend BaseEntity
interface Employee extends BaseEntity {
  fullName: string;
  email: string;
}
```

---

## Decision tree — dùng package nào?

```
Cần hiển thị button, modal, table, page header, KPI?   → @cachesol/design-system
Cần CSS variable màu/spacing/shadow?                    → @cachesol/design-system
Cần cấu hình AntD theme?                               → @cachesol/design-system
Cần hook cho density/breakpoint/notifications/header?   → @cachesol/design-system
Cần shell chung cho admin web (topbar + sidebar)?       → @cachesol/design-system (AdminShell)

Cần format tiền/ngày/số/% theo locale?                  → @cachesol/shared-ui
Cần debounce input hoặc pagination state?               → @cachesol/shared-ui
Cần generic BaseEntity/BaseComponentProps?              → @cachesol/shared-ui

Cần API response shape (ApiResponse, PageResponse)?     → @cachesol/shared-types
Cần axios instance / query client?                      → @cachesol/shared-api
```

---

## Mini-apps

### 1. `landing-mini-app` (Public)

Trang landing công khai cho khách truy cập + đăng ký tenant:

- **Auth**: Không cần
- **Routes**: `/`, `/apps/:appId`, `/register`, `/register/success`
- **Pages**:
  - `LandingPage` — Hero + grid 6 mini-apps + highlights
  - `MiniAppDetailPage` — Detail + sticky "buy box" (giá + CTA)
  - `RegistrationPage` — Multi-step form (company / contact / subscription)
  - `RegistrationSuccessPage` — Kết quả + tenant ID + admin URL
- **API**: `POST /api/platform-registry/v1/tenants/register` (mock trong dev via `mock-registration.ts`)

### 2. `registry-admin` (Auth: `registry_admin`)

Web admin cho Platform Registry:

- **Auth**: Keycloak role `registry_admin`
- **Routes**: `/login`, `/`, `/tenants`, `/tenants/:id`, `/mini-apps`, `/providers`, `/settings`, `/audit`
- **Pages**: Dashboard, Tenants List + Detail, Mini-apps catalog, Providers, Settings, Audit log
- **Dùng**: `<AdminShell>` với app switcher, sidebar, notifications, hide/show header, account

### 3. `tenant-manager-admin` (Auth: `tenant_admin`)

Web admin cho Tenant Manager (backend của tenant):

- **Auth**: Keycloak role `tenant_admin`
- **Routes**: `/login`, `/`, `/organizations`, `/employees`, `/job-titles`, `/roles`, `/users`, `/keycloak`, `/provisioning`, `/audit`, `/settings`
- **Pages**: Dashboard (KPI + provisioning + audit), Organizations (tree), Employees (with Keycloak sync), Job titles, Roles, App users (Keycloak-synced), Keycloak sync dashboard, Provisioning jobs (retry), Audit log, Settings
- **Dùng**: `<AdminShell>` (same shell như registry-admin)

---

## Quick start — tạo mini-app mới

```bash
# 1. Tạo folder
mkdir -p src/frontend/mini-apps/my-mini-app/src

# 2. package.json
{
  "name": "@cachesol/my-mini-app",
  "dependencies": {
    "@cachesol/design-system": "workspace:*",
    "@cachesol/shared-api": "workspace:*",
    "@cachesol/shared-types": "workspace:*"
  }
}

# 3. Register trong web-shell/src/main.tsx
import myMiniApp from '@cachesol/my-mini-app';
const MINI_APPS = [landingMiniApp, hrmMiniApp, registryAdmin, tenantManagerAdmin, myMiniApp];
```

---

## Dev scripts

```bash
# Từ src/frontend/
npm install
npm run dev                    # web-shell dev server (port 3000)
npm run dev:landing            # landing mini-app dev server (port 5174)
npm run dev:registry           # registry-admin dev server (port 5175)
npm run dev:tenant-admin       # tenant-manager-admin dev server (port 5176)
npm run dev:hrm                # hrm-mini-app dev server
```

---

## Build

```bash
# Từ src/frontend/
npm run build                  # Build tất cả
npm run build:shell            # Build shell only
npm run build:mini-apps        # Build 4 mini-apps
npm run build:shared           # Build shared libs + design-system
```

---

## Tham khảo

- Design system docs: [`/design-system/README.md`](../../design-system/README.md)
- Mini-app architecture: [`/MINI-APP-ARCHITECTURE.md`](../../MINI-APP-ARCHITECTURE.md)
- Source code structure: [`/SOURCE-CODE-STRUCTURE.md`](../../SOURCE-CODE-STRUCTURE.md)
