# @cachesol/hrm-mini-app

HRM Mini App - Quản lý nhân sự cho CacheSol Enterprise Platform.

## ⚠️ Đây là LIBRARY, không phải Web App!

Mini app này:
- ❌ KHÔNG có `index.html`
- ❌ KHÔNG có `main.tsx`
- ✅ Có `index.ts` làm public API
- ✅ Có `manifest.ts` khai báo routes, menu, permissions
- ✅ Build dưới dạng library (`vite.config.ts` với `build.lib`)

## Cấu trúc

```
hrm-mini-app/
├── src/
│   ├── index.ts                ← Public API (Shell import)
│   ├── manifest.ts             ← Routes, menu, permissions
│   │
│   ├── features/
│   │   └── employees/
│   │       ├── api/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── pages/         ← Page components (lazy load)
│   │       ├── types/
│   │       └── utils/
│   │
│   ├── types/
│   └── i18n/
│
├── package.json                ← "@cachesol/hrm-mini-app"
├── vite.config.ts              ← Library build config
└── tsconfig.json
```

## Public API

Shell sẽ import như sau:

```typescript
// Trong web-shell/src/main.tsx
import hrmMiniApp from '@cachesol/hrm-mini-app';

const MINI_APPS = [hrmMiniApp];
```

Manifest sẽ tự động được đọc để:
- Đăng ký routes
- Build menu
- Load i18n
- Trigger lifecycle hooks

## Build

```bash
# Từ root workspace
npm run build:mini-apps

# Hoặc trong thư mục này
npm run build
```

Output: `dist/index.js`, `dist/index.mjs`, `dist/index.d.ts`

## Development

```bash
# Watch mode
npm run dev

# Kết hợp với web-shell
npm run dev:web    # trong terminal 1
npm run dev:hrm    # trong terminal 2
```

## Thêm Page mới

1. Tạo page component trong `features/{feature}/pages/`
2. Thêm route vào `manifest.ts`:

```typescript
{
  path: '/employees/new-page',
  title: 'New Page',
  component: () => import('./features/employees/pages/NewPage'),
  layout: 'main',
  permissions: ['employee:read'],
}
```

3. Build lại mini app → Shell tự động nhận route mới

## Liên kết

- [MINI-APP-ARCHITECTURE.md](../../../../MINI-APP-ARCHITECTURE.md) - Kiến trúc Mini App
- [Frontend Standards](../../governance/architecture/standards/frontend.md)
