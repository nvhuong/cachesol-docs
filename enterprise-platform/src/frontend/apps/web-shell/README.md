# Web Shell

Host application cho CacheSol Enterprise Platform. Đây là **DUY NHẤT** app có `index.html` và `main.tsx` ở root.

## Chức năng

- Load và đăng ký các **mini apps**
- Quản lý authentication (login/logout)
- Cung cấp layout chung (sidebar, header)
- Build dynamic router từ mini app manifests
- Cung cấp global stores (auth, app, miniApp)

## Cấu trúc

```
web-shell/
├── src/
│   ├── main.tsx               ← Entry point (DUY NHẤT)
│   ├── App.tsx
│   │
│   ├── shell/                 ← Shell-specific code
│   │   └── buildRouter.tsx   ← Dynamic router từ mini apps
│   │
│   ├── routes/
│   │   └── RequireAuth.tsx
│   │
│   ├── layouts/
│   │   └── MainLayout.tsx
│   │
│   ├── pages/                 ← Shell-only pages
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── appStore.ts
│   │   └── miniAppStore.ts   ← Quản lý mini apps
│   │
│   ├── hooks/
│   │   └── useI18n.ts
│   │
│   ├── i18n/                 ← Global i18n
│   └── styles/
│
├── index.html
├── package.json
└── vite.config.ts
```

## Chạy

```bash
# Từ root workspace
npm run dev:web

# Hoặc trong thư mục này
npm run dev
```

App chạy ở: http://localhost:3000

## Thêm Mini App mới

1. Tạo mini app trong `mini-apps/`
2. Import trong `main.tsx`:
```typescript
import newMiniApp from '@cachesol/new-mini-app';

const MINI_APPS = [hrmMiniApp, newMiniApp];
```
3. Shell tự động nhận routes và menu từ manifest
