# CacheSol Frontend - Workspace

Mono-repo chứa **TẤT CẢ** frontend code của CacheSol Enterprise Platform.
Workspace này nằm trong `src/frontend/` (cấu trúc `src/` v2).

## Cấu trúc Workspace

```
src/frontend/                           ← Workspace này (trong src/)
├── package.json                       ← Root workspace config
│
├── apps/                             # HOST APPS (Shell) - toàn cục
│   └── web-shell/                    # Web container - DUY NHẤT có index.html
│
├── mini-apps/                        # MINI APPS (Libraries)
│   ├── hrm-mini-app/                # HRM Mini App
│   ├── sales-mini-app/              # Sales Mini App
│   └── erp-mini-app/               # ERP Mini App
│
├── shared/                           # Shared libraries (dùng cho nhiều mini app)
│   ├── shared-ui/                   # @cachesol/shared-ui
│   ├── shared-types/                # @cachesol/shared-types
│   ├── shared-api/                  # @cachesol/shared-api
│   └── shared-config/               # Shared build configs
│
└── design-system/                   # ★ @cachesol/design-system (code library: tokens TS + base components)
                                    # DOCS markdown tương ứng ở /design-system/ ở root repo
```

## Quan hệ với `applications/`

```
applications/                          # Domain apps (docs, requirements, backend)
├── hrm/
│   ├── docs/
│   ├── requirement/
│   ├── tests/
│   └── README.md                    # ← Mô tả HRM app

src/
└── frontend/
    ├── mini-apps/hrm-mini-app/      # ← Frontend code của HRM (trong src/)
    └── ...
```

**Nguyên tắc:** Mỗi mini app nằm ở `src/frontend/mini-apps/`, **KHÔNG** nằm trong `applications/{name}/frontend/`. Shared libraries chỉ tồn tại 1 lần, dùng chung cho tất cả mini app.

## Cài đặt

```bash
# Từ root workspace (src/frontend/)
cd src/frontend
npm install
```

## Chạy Development

```bash
# Chạy shell app (port 3000) - load tất cả mini apps đã register
npm run dev:web

# Watch mode cho HRM mini app
npm run dev:hrm
```

## Build

```bash
# Build tất cả
npm run build

# Build shell
npm run build:shell

# Build tất cả mini apps
npm run build:mini-apps
```

## Cú pháp Workspace

```typescript
// Trong mini app
import { DataTable, PageHeader } from '@cachesol/shared-ui';
import type { ApiResponse, MiniAppManifest } from '@cachesol/shared-types';
import { apiClient } from '@cachesol/shared-api';
```

## Thêm Mini App mới

1. Tạo folder mới trong `src/frontend/mini-apps/`:

```bash
mkdir -p src/frontend/mini-apps/sales-mini-app/src
```

2. Tạo `package.json` với name `@cachesol/sales-mini-app`
3. Implement `src/index.ts` và `src/manifest.ts`
4. Trong `src/frontend/apps/web-shell/src/main.tsx`:

```typescript
import salesMiniApp from '@cachesol/sales-mini-app';

const MINI_APPS = [hrmMiniApp, salesMiniApp];
```

## Tham khảo

- [`MINI-APP-ARCHITECTURE.md`](../../MINI-APP-ARCHITECTURE.md) - Kiến trúc Mini App
- [`SOURCE-CODE-STRUCTURE.md`](../../SOURCE-CODE-STRUCTURE.md) - Cấu trúc source code
