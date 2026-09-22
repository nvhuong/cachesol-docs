# CacheSol Frontend — Workspace

Mono-repo chứa **TẤT CẢ** frontend code của CacheSol Enterprise Platform.

---

## Package map

| Package | Type | Chứa gì |
|---------|------|---------|
| `@cachesol/design-system` | **Library** | Design tokens (TS + CSS vars), AntD theme, React components, patterns, templates, hooks |
| `@cachesol/shared-ui` | **Library** | Utilities — formatters, hooks, generic types |
| `@cachesol/shared-types` | **Library** | API response shapes, auth types, mini-app manifest types |
| `@cachesol/shared-api` | **Library** | Axios instance, query client, interceptors |
| `web-shell` | **App** | Host app — duy nhất có `index.html` |
| `@cachesol/hrm-mini-app` | **Library (mini-app)** | HRM feature module |

---

## Cấu trúc thư mục

```
src/frontend/
├── apps/
│   └── web-shell/              # Host app (index.html + shell layout)
│       └── src/
│           ├── main.tsx       # ConfigProvider → cachesolTheme
│           └── styles/
│               └── global.css # @import '@cachesol/design-system/styles.css'
│
├── mini-apps/
│   └── hrm-mini-app/          # HRM mini-app (feature library)
│
├── shared/
│   ├── shared-api/             # @cachesol/shared-api
│   ├── shared-types/           # @cachesol/shared-types
│   └── shared-ui/              # @cachesol/shared-ui (utilities only)
│
└── design-system/              # @cachesol/design-system (canonical UI library)
```

---

## Phân biệt design-system vs shared-ui

| | `@cachesol/design-system` | `@cachesol/shared-ui` |
|---|---|---|
| **Tokens** | ✅ CSS vars + TS | ❌ |
| **Theme** | ✅ `cachesolTheme` (AntD) | ❌ |
| **Components** | ✅ 13 primitives + 12 patterns + 4 templates | ❌ |
| **Formatters** | ❌ | ✅ `formatCurrency`, `formatDate`, `formatNumber`, ... |
| **Hooks** | ✅ `useDensity`, `useBreakpoint` | ✅ `useDebounce`, `usePagination` |
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
| `Button` | 6 variants (`primary` `secondary` `tertiary` `ghost` `destructive` `link`) × 3 sizes (`sm` `md` `lg`) | Action trigger |
| `Input` | single + TextArea, label + helper + error + counter | Text/number/textarea |
| `Select` | `single` `multi` `searchable`, label + helper + error | Picker |
| `Modal` | 4 variants (`standard` `confirmation` `destructive` `form`) × 4 sizes | Dialog |
| `Drawer` | 4 sides × 4 sizes | Slide-in panel |
| `Table` | density-aware (`comfortable` `default` `compact`) + helpers `columnAlign`, `tabularCell` | Data grid |
| `DatePicker` | `date` `month` `dateTime` | Date selection |
| `DateRangePicker` | range | Date range |
| `Tabs` | `line` `pill` `card` | Navigation tabs |
| `Tree` | `basic` `checkable` `draggable` `async` | Hierarchical |
| `Form` + `FormItem` + `FormErrorList` | `vertical` `horizontal` `inline` | Form layout |
| `Tag` | 6 semantic variants, `pill`, dot | Status chip |
| `Avatar` | 4 sizes, initials fallback | User avatar |
| `Alert` | 4 types, `banner` mode | Inline notice |

### 4. Patterns — 12 composites

```tsx
import {
  PageHeader, EmptyState, StatusBadge, KPI, DataCard, ConfirmModal,
  LoadingState, ErrorState, Toolbar, FormSection, DetailField, CopyButton, Timeline,
} from '@cachesol/design-system';
```

| Pattern | Props quan trọng | Use case |
|---------|------------------|----------|
| `PageHeader` | `title`, `description`, `breadcrumb[]`, `actions`, `tabs`, `metadata` | Đầu mỗi page |
| `EmptyState` | `type`: `no-data` `no-results` `permission` `error`, `action` | Khi list rỗng |
| `StatusBadge` | `status` (16 status enum) | Trạng thái đơn, deal, ticket... |
| `KPI` | `label`, `value`, `trend`, `comparison`, `icon` | Dashboard metric |
| `DataCard` | `variant`: `default` `elevated` `interactive` `flush` | Card surface |
| `ConfirmModal` | `riskLevel`, `requireText`, `confirmationText` | Destructive action |
| `LoadingState` | `shape`: `inline` `section` `table` `page` | Skeleton/spinner |
| `ErrorState` | `kind`: `network` `permission` `not-found` `server` `generic`, `onRetry` | Error UI |
| `Toolbar` | `search`, `filters`, `bulkActions`, `activeFilters[]` | List page header |
| `FormSection` | `title`, `description`, `columns` (1 hoặc 2) | Nhóm field |
| `DetailField` | `label`, `value`, `copyable`, `monospace`, `layout` | Read-only field |
| `CopyButton` | `value`, `label` | Copy-to-clipboard inline |
| `Timeline` | `items[]`, `groupBy` | Activity log |

### 5. Templates — 4 page-level

```tsx
import { ListPage, DetailPage, FormPage, DashboardPage } from '@cachesol/design-system';
```

| Template | Use case |
|----------|----------|
| `ListPage` | List + toolbar + table + pagination + states |
| `DetailPage` | Header + tabs + sections + states |
| `FormPage` | Header + sections + sticky action bar + unsaved guard |
| `DashboardPage` | Header + filters + KPI row + charts + secondary |

### 6. Hooks

```tsx
import { useDensity, useBreakpoint, useBreakpointAtLeast } from '@cachesol/design-system';

const { density, setDensity } = useDensity();           // 'comfortable' | 'default' | 'compact'
const { current, isMobile, isDesktop } = useBreakpoint();
const isLarge = useBreakpointAtLeast('lg');
```

---

## Catalog sử dụng — `@cachesol/shared-ui`

### 1. Formatters

```tsx
import {
  formatCurrency, formatDate, formatRelative,
  formatNumber, formatCompact, formatPercent,
} from '@cachesol/shared-ui';
```

| Function | Signature | Default | Ví dụ |
|----------|-----------|---------|-------|
| `formatCurrency(value, currency?, locale?)` | `(number \| string \| null, string?, string?) => string` | `'VND'`, `'vi-VN'` | `formatCurrency(1234000)` → `"1.234.000 ₫"` |
| `formatDate(date, format?, locale?)` | `(Date \| string \| number \| null, string?, string?) => string` | `'DD MMM YYYY'`, `'en-GB'` | `formatDate(new Date(), 'DD/MM/YYYY')` → `"23/09/2026"` |
| `formatRelative(date, locale?)` | `(Date \| string \| number \| null, string?) => string` | `'en-GB'` | `formatRelative(Date.now() - 3600_000)` → `"1h ago"` |
| `formatNumber(value, locale?)` | `(number \| string \| null, string?) => string` | `'en-US'` | `formatNumber(1234567, 'vi-VN')` → `"1.234.567"` |
| `formatCompact(value, locale?)` | `(number \| string \| null, string?) => string` | `'en-US'` | `formatCompact(1_234_567)` → `"1.2M"` |
| `formatPercent(value, locale?, decimals?)` | `(number \| string \| null, string?, number?) => string` | `'en-US'`, `1` | `formatPercent(0.1234)` → `"12.3%"` |

**Tất cả formatter đều xử lý `null`/`undefined`/`''`/`NaN` → trả `"—"`.**

### 2. Hooks

```tsx
import { useDebounce, usePagination } from '@cachesol/shared-ui';

const debouncedKeyword = useDebounce(keyword, 300);     // generic <T>(value, delayMs)

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
Cần hiển thị button, modal, table, page header, KPI? → @cachesol/design-system
Cần CSS variable màu/spacing/shadow?                  → @cachesol/design-system
Cần cấu hình AntD theme?                             → @cachesol/design-system
Cần hook cho density/breakpoint?                     → @cachesol/design-system

Cần format tiền/ngày/số/% theo locale?                → @cachesol/shared-ui
Cần debounce input hoặc pagination state?             → @cachesol/shared-ui
Cần generic BaseEntity/BaseComponentProps?            → @cachesol/shared-ui

Cần API response shape (ApiResponse, PageResponse)?   → @cachesol/shared-types
Cần axios instance / query client?                    → @cachesol/shared-api
```

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
const MINI_APPS = [hrmMiniApp, myMiniApp];
```

---

## Build

```bash
# Từ src/frontend/
npm install
npm run build

# Build riêng
npm run build --workspace=@cachesol/design-system
npm run build --workspace=@cachesol/shared-ui
npm run build --workspace=@cachesol/hrm-mini-app
```

---

## Tham khảo

- Design system docs: [`/design-system/README.md`](../../design-system/README.md)
- Mini-app architecture: [`/MINI-APP-ARCHITECTURE.md`](../../MINI-APP-ARCHITECTURE.md)
- Source code structure: [`/SOURCE-CODE-STRUCTURE.md`](../../SOURCE-CODE-STRUCTURE.md)
