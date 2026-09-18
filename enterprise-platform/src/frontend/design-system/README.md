# @cachesol/design-system (Code Library)

Code library cho **Design System** của CacheSol Enterprise Platform — triển khai trực tiếp từ đặc tả markdown ở `/design-system/` (root).

## Phân biệt 2 vị trí

| Vị trí | Loại | Chứa gì |
|--------|------|---------|
| `/design-system/` (root) | **DOCS** (markdown) | Tokens, components, patterns, templates — đặc tả thiết kế |
| `src/frontend/design-system/` (đây) | **CODE library** (`@cachesol/design-system`) | Tokens TS, AntD theme bridge, React components |

## Cấu trúc

```
src/frontend/design-system/
├── src/
│   ├── index.ts                    # Public API
│   ├── theme.ts                    # AntD 5 theme bridged to CacheSol tokens
│   ├── styles.css                  # Component class styles
│   │
│   ├── tokens/                     # Layer 1: Atomic values
│   │   ├── index.ts
│   │   ├── styles.css              # CSS variables (single source of truth)
│   │   ├── colors.ts               # brand / neutral / success / warning / error / chart
│   │   ├── typography.ts           # Inter, 13 styles, font weights
│   │   ├── spacing.ts              # 4px scale + density + control / icon / modal sizes
│   │   ├── shadows.ts              # 7 elevation levels
│   │   ├── motion.ts               # duration + easing tokens
│   │   └── breakpoints.ts          # xs → 2xl
│   │
│   ├── components/                 # Layer 2: Self-contained primitives
│   │   ├── Button.tsx              # 6 variants × 3 sizes, loading
│   │   ├── Input.tsx               # label + helper + error + maxCount
│   │   ├── Select.tsx              # single/multi/searchable
│   │   ├── Modal.tsx               # 4 variants × 4 sizes, destructive variant
│   │   ├── Drawer.tsx              # 4 sides × 4 sizes
│   │   ├── Table.tsx               # density-aware + alignment helpers
│   │   ├── DatePicker.tsx          # date / range / month / datetime
│   │   ├── Tabs.tsx                # line / pill / card variants
│   │   ├── Tree.tsx                # basic / checkable / draggable / async
│   │   ├── Form.tsx                # vertical / horizontal / inline
│   │   ├── Tag.tsx                 # 6 semantic variants + pill + dot
│   │   ├── Avatar.tsx              # 4 sizes, initials from name
│   │   └── Alert.tsx               # 4 types, banner mode
│   │
│   ├── patterns/                   # Layer 3: Composition rules
│   │   ├── PageHeader.tsx          # breadcrumb + title + description + actions + tabs
│   │   ├── EmptyState.tsx          # 4 types (no-data, no-results, permission, error)
│   │   ├── StatusBadge.tsx         # 16 statuses → consistent color
│   │   ├── KPI.tsx                 # label + value + trend + comparison
│   │   ├── DataCard.tsx            # 4 variants (default, elevated, interactive, flush)
│   │   ├── ConfirmModal.tsx        # risk-level confirmation + name-typing safeguard
│   │   ├── LoadingState.tsx        # 4 shapes (inline, section, table, page)
│   │   ├── ErrorState.tsx          # 5 kinds (network, permission, not-found, server, generic)
│   │   ├── Toolbar.tsx             # search + filters + bulk actions + active chips
│   │   ├── FormSection.tsx         # grouped fields, 1-col or 2-col
│   │   ├── DetailField.tsx         # label/value pair with copy + mono
│   │   ├── CopyButton.tsx
│   │   └── Timeline.tsx            # grouped activity log
│   │
│   ├── templates/                  # Layer 4: Page-level wireframes
│   │   ├── ListPage.tsx            # PageHeader + Toolbar + body + Pagination
│   │   ├── DetailPage.tsx          # PageHeader + tabs + body + states
│   │   ├── FormPage.tsx            # PageHeader + sections + sticky action bar
│   │   └── DashboardPage.tsx       # KPI row + primary charts + secondary + alerts
│   │
│   ├── hooks/
│   │   ├── useDensity.ts           # user density preference (localStorage)
│   │   └── useBreakpoint.ts        # xs → 2xl matching window.innerWidth
│   │
│   └── Showcase.tsx                # Internal demo (not exported)
│
├── package.json                    # "@cachesol/design-system"
├── tsconfig.json
└── vite.config.ts                  # Build library (ES + CJS)
```

## Quick start

### 1. Install (workspace already wired)

Already wired via npm workspaces (`@cachesol/design-system` lives in `src/frontend/design-system`).

### 2. Apply theme to root

```tsx
import { ConfigProvider } from 'antd';
import { cachesolTheme } from '@cachesol/design-system';
import '@cachesol/design-system/tokens.css';
import '@cachesol/design-system/styles.css';

export function App() {
  return (
    <ConfigProvider theme={cachesolTheme}>
      <YourApp />
    </ConfigProvider>
  );
}
```

### 3. Use components

```tsx
import { Button, Input, Select, Tag } from '@cachesol/design-system';
import { PageHeader, EmptyState, StatusBadge } from '@cachesol/design-system';
import { ListPage } from '@cachesol/design-system';

<PageHeader title="Customers" primaryAction={<Button variant="primary">Create customer</Button>} />
```

## Naming & token mapping

| Doc (markdown)              | Code (this lib)                       |
|-----------------------------|----------------------------------------|
| `color.brand.600`           | `brand[600]` / `var(--color-brand-600)` |
| `color.text.primary`        | `var(--color-text-primary)`            |
| `spacing.4`                 | `spacing[4]` (= 16) / `var(--spacing-4)` |
| `radius.lg`                 | `radius.lg` (= 8) / `var(--radius-lg)` |
| `shadow.md`                 | `shadow.md` / `var(--shadow-md)`       |
| `font.size.body.md`         | `fontSize['body-md']` (= 14) / `var(--font-size-body-md)` |
| `Button.primary`            | `<Button variant="primary" />`         |
| `Table.compact`             | `<Table density="compact" />`          |
| `Density.comfortable`       | `density.comfortable` / `useDensity()` |

## Density

Three modes drive row height, button size, and form spacing:

```tsx
import { useDensity } from '@cachesol/design-system';

const { density, setDensity } = useDensity();
// 'comfortable' (56px) | 'default' (48px) | 'compact' (36px)
```

Persisted to `localStorage['cachesol:density']`. Apply via density toggle in user settings.

## Layer rules

```
Tokens  →  Components  →  Patterns  →  Templates
```

- Templates use Patterns.
- Patterns compose Components.
- Components consume Tokens only (no hardcoded values).
- Lower layers never reference upper layers.

## For AI agents

This library is structured so an AI coding agent can:

1. Read a doc page (e.g. `/design-system/components/table.md`).
2. Find the matching code file (e.g. `components/Table.tsx`).
3. Use the API to generate UI without guessing values.

Every component exposes a typed `Props` interface. Tokens are imported by name — never hardcoded.

## Build

```bash
npm run build --workspace=@cachesol/design-system
# → dist/index.mjs, dist/index.js, dist/index.d.ts
```

## Liên kết

- DOCS markdown: [`/design-system/README.md`](../../../design-system/README.md)
- Frontend workspace: [`src/frontend/README.md`](../../README.md)
