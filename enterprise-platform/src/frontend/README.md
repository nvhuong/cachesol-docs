# CacheSol Frontend — Workspace

Mono-repo chứa **TẤT CẢ** frontend code của CacheSol Enterprise Platform.

---

## Package map

| Package | Type | Chứa gì |
|--------|------|---------|
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

## Thiết lập root (ConfigProvider)

```tsx
// web-shell/src/main.tsx
import { ConfigProvider } from 'antd';
import { cachesolTheme } from '@cachesol/design-system';
import '@cachesol/design-system/styles.css';  // ← required

<ConfigProvider theme={cachesolTheme} locale={viVN}>
  <App />
</ConfigProvider>
```

---

## Thiết lập CSS trong app / mini-app

```css
/* app/src/styles/global.css */
@import '@cachesol/design-system/styles.css';
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
