# @cachesol/design-system (Code Library)

Code library cho **Design System** của CacheSol Enterprise Platform.

## Phân biệt 2 vị trí

| Vị trí | Loại | Chứa gì |
|--------|------|---------|
| `design-system/` ở root | **DOCS** (markdown) | `components/`, `patterns/`, `templates/`, `tokens/` — đặc tả thiết kế |
| `src/frontend/design-system/` (đây) | **CODE library** (`@cachesol/design-system`) | Tokens TypeScript, base React components |

## Cấu trúc (sẽ thêm khi cần)

```
src/frontend/design-system/
├── src/
│   ├── index.ts                  # Public API
│   ├── tokens.ts                 # Design tokens (colors, spacing, typography)
│   ├── components/               # Base components (Button, Card, ...)
│   └── patterns/                 # Pattern components (DataCard, EmptyState, ...)
├── package.json                  # "@cachesol/design-system"
├── tsconfig.json
└── vite.config.ts                # Build library
```

## Liên kết

- DOCS markdown: [`/design-system/README.md`](../../../design-system/README.md)
- Frontend workspace: [`src/frontend/README.md`](../../README.md)
