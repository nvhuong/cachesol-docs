# Colors

The color system has three layers: **brand palette** (primitive), **semantic tokens** (purpose-bound), and **status colors** (with text/icon/border/background variants).

---

## Brand Palette

### Primary — Modern Blue (Indigo)

| Token | HEX | Usage |
|---|---|---|
| `color.brand.50` | `#EFF6FF` | Subtle highlights, selected backgrounds |
| `color.brand.100` | `#DBEAFE` | Hover backgrounds, light fills |
| `color.brand.200` | `#BFDBFE` | Borders on accent surfaces |
| `color.brand.300` | `#93C5FD` | Decorative accents |
| `color.brand.400` | `#60A5FA` | Hover on primary |
| `color.brand.500` | `#3B82F6` | Lighter primary |
| `color.brand.600` | `#2563EB` | **Primary 600 — default primary action** |
| `color.brand.700` | `#1D4ED8` | Active state, pressed primary |
| `color.brand.800` | `#1E40AF` | Dark accents |
| `color.brand.900` | `#1E3A8A` | Strong text on light bg |
| `color.brand.950` | `#172554` | Maximum contrast on accent surfaces |

### Why these values?

- **`color.brand.600` (#2563EB)** — primary CTAs. Contrast vs white = 4.83:1 (WCAG AA pass for normal text).
- **`color.brand.700` (#1D4ED8)** — active state. Provides clear visual feedback without dimming the action.
- **`color.brand.500` (#3B82F6)** — only for hover on light primary surfaces where 600 would feel heavy.

---

## Neutral Palette

Cool slate-based neutral for enterprise UI feel. Use this for text, borders, surfaces.

| Token | HEX | Usage |
|---|---|---|
| `color.neutral.0` | `#FFFFFF` | Pure white surface |
| `color.neutral.50` | `#F8FAFC` | App background |
| `color.neutral.100` | `#F1F5F9` | Subtle surface, hover on white |
| `color.neutral.200` | `#E2E8F0` | Borders, dividers |
| `color.neutral.300` | `#CBD5E1` | Stronger borders, disabled controls |
| `color.neutral.400` | `#94A3B8` | Placeholder text, disabled icons |
| `color.neutral.500` | `#64748B` | Tertiary text, captions |
| `color.neutral.600` | `#475569` | Secondary text |
| `color.neutral.700` | `#334155` | Primary text on light surface |
| `color.neutral.800` | `#1E293B` | Headings |
| `color.neutral.900` | `#0F172A` | Maximum emphasis text |
| `color.neutral.950` | `#020617` | Near-black, rare |
| `color.neutral.1000` | `#000000` | Pure black, reserved |

### Contrast guidance

| Use | Token | Contrast vs neutral.0 |
|---|---|---|
| Body text | `color.neutral.700` | 11.0:1 ✅ AAA |
| Secondary text | `color.neutral.600` | 7.0:1 ✅ AAA |
| Tertiary / captions | `color.neutral.500` | 4.7:1 ✅ AA |
| Disabled text | `color.neutral.400` | 2.9:1 — use only with disabled affordance |

---

## Semantic Palette

Each semantic color has a 50–900 scale. Use the semantic token (`color.status.success.bg`) in components — not the primitive.

### Success — Green

| Token | HEX |
|---|---|
| `color.success.50` | `#F0FDF4` |
| `color.success.100` | `#DCFCE7` |
| `color.success.200` | `#BBF7D0` |
| `color.success.500` | `#22C55E` |
| `color.success.600` | `#16A34A` |
| `color.success.700` | `#15803D` |
| `color.success.800` | `#166534` |
| `color.success.900` | `#14532D` |

### Warning — Amber

| Token | HEX |
|---|---|
| `color.warning.50` | `#FFFBEB` |
| `color.warning.100` | `#FEF3C7` |
| `color.warning.200` | `#FDE68A` |
| `color.warning.500` | `#F59E0B` |
| `color.warning.600` | `#D97706` |
| `color.warning.700` | `#B45309` |
| `color.warning.800` | `#92400E` |
| `color.warning.900` | `#78350F` |

### Error — Red

| Token | HEX |
|---|---|
| `color.error.50` | `#FEF2F2` |
| `color.error.100` | `#FEE2E2` |
| `color.error.200` | `#FECACA` |
| `color.error.500` | `#EF4444` |
| `color.error.600` | `#DC2626` |
| `color.error.700` | `#B91C1C` |
| `color.error.800` | `#991B1B` |
| `color.error.900` | `#7F1D1D` |

### Info — Blue (matches brand)

Reuse brand palette for info to maintain visual cohesion.

| Token | Maps to |
|---|---|
| `color.info.50` | `color.brand.50` |
| `color.info.100` | `color.brand.100` |
| `color.info.500` | `color.brand.500` |
| `color.info.600` | `color.brand.600` |
| `color.info.700` | `color.brand.700` |
| `color.info.900` | `color.brand.900` |

---

## Semantic Tokens

These tokens bind colors to purpose. **Always use semantic tokens in components.**

### Text

| Token | Value | Usage | Contrast req. |
|---|---|---|---|
| `color.text.primary` | `neutral.900` | Headings, primary content | ≥ 7:1 |
| `color.text.secondary` | `neutral.700` | Body text | ≥ 4.5:1 |
| `color.text.tertiary` | `neutral.500` | Captions, helper text | ≥ 4.5:1 |
| `color.text.disabled` | `neutral.400` | Disabled controls | + non-color signal |
| `color.text.inverse` | `neutral.0` | Text on dark surfaces | ≥ 7:1 |
| `color.text.link` | `brand.600` | Interactive text links | ≥ 4.5:1 |
| `color.text.link-hover` | `brand.700` | Link hover state | ≥ 4.5:1 |
| `color.text.success` | `success.700` | Success messages | ≥ 4.5:1 |
| `color.text.warning` | `warning.700` | Warning messages | ≥ 4.5:1 |
| `color.text.error` | `error.700` | Error messages | ≥ 4.5:1 |
| `color.text.on-brand` | `neutral.0` | Text on `color.bg.brand` | ≥ 7:1 |

### Background

| Token | Value | Usage |
|---|---|---|
| `color.bg.app` | `neutral.50` | App canvas behind everything |
| `color.bg.surface` | `neutral.0` | Cards, panels, sheets |
| `color.bg.subtle` | `neutral.100` | Subtle separation, hover on white |
| `color.bg.hover` | `neutral.100` | Generic hover state |
| `color.bg.selected` | `brand.50` | Selected row, active item |
| `color.bg.disabled` | `neutral.100` | Disabled control bg |
| `color.bg.inverse` | `neutral.900` | Tooltips, dark surfaces |
| `color.bg.brand` | `brand.600` | Brand-filled backgrounds |
| `color.bg.brand-subtle` | `brand.50` | Light brand surface |

### Border

| Token | Value | Usage |
|---|---|---|
| `color.border.default` | `neutral.200` | Default border for cards, inputs |
| `color.border.subtle` | `neutral.100` | Very faint separators |
| `color.border.strong` | `neutral.300` | Emphasized border, hover state |
| `color.border.focus` | `brand.600` | Focus ring |
| `color.border.error` | `error.500` | Error state |
| `color.border.success` | `success.500` | Success state (rare) |
| `color.border.inverse` | `neutral.900` | Border on inverse surface |

### Actions

| Token | Value | Usage |
|---|---|---|
| `color.action.primary` | `brand.600` | Primary button background |
| `color.action.primary-hover` | `brand.700` | Primary button hover |
| `color.action.primary-active` | `brand.800` | Primary button pressed |
| `color.action.secondary` | `neutral.100` | Secondary button bg |
| `color.action.secondary-hover` | `neutral.200` | Secondary hover |
| `color.action.tertiary` | `transparent` | Tertiary / ghost button bg |
| `color.action.tertiary-hover` | `neutral.100` | Tertiary hover |
| `color.action.destructive` | `error.600` | Destructive button bg |
| `color.action.destructive-hover` | `error.700` | Destructive hover |
| `color.action.disabled` | `neutral.200` | Disabled action bg |

---

## Semantic Status Tokens

Status has 4 roles — text, icon, border, background. Always use the semantic token, not the primitive.

### Info

| Token | Value | Usage |
|---|---|---|
| `color.status.info.text` | `info.700` | Info message text |
| `color.status.info.icon` | `info.600` | Info icon |
| `color.status.info.border` | `info.200` | Info border |
| `color.status.info.bg` | `info.50` | Info background |

**Use for:** neutral informational messages, tips, in-progress states that aren't warnings.
**Don't use for:** errors, success confirmations.

### Success

| Token | Value | Usage |
|---|---|---|
| `color.status.success.text` | `success.700` | Success message text |
| `color.status.success.icon` | `success.600` | Success icon (check, etc.) |
| `color.status.success.border` | `success.200` | Success border |
| `color.status.success.bg` | `success.50` | Success background |

**Use for:** confirmations, "Approved", completed steps, healthy KPI.
**Don't use for:** warnings about a problem.

### Warning

| Token | Value | Usage |
|---|---|---|
| `color.status.warning.text` | `warning.700` | Warning message text |
| `color.status.warning.icon` | `warning.600` | Warning icon |
| `color.status.warning.border` | `warning.200` | Warning border |
| `color.status.warning.bg` | `warning.50` | Warning background |

**Use for:** pending states, attention needed, soft errors, expiring soon.
**Don't use for:** completed actions (use success), or fatal errors (use error).

### Error

| Token | Value | Usage |
|---|---|---|
| `color.status.error.text` | `error.700` | Error message text |
| `color.status.error.icon` | `error.600` | Error icon |
| `color.status.error.border` | `error.200` | Error border |
| `color.status.error.bg` | `error.50` | Error background |

**Use for:** validation errors, failed actions, rejected states, system errors.
**Don't use for:** warnings about future issues.

---

## Data Visualization Palette

For charts. Distinct, accessible, color-blind aware.

| Token | HEX | Recommended pair |
|---|---|---|
| `color.chart.1` | `#2563EB` | Brand blue — primary |
| `color.chart.2` | `#16A34A` | Green |
| `color.chart.3` | `#D97706` | Amber |
| `color.chart.4` | `#DC2626` | Red |
| `color.chart.5` | `#7C3AED` | Purple |
| `color.chart.6` | `#0891B2` | Cyan |
| `color.chart.7` | `#DB2777` | Pink |
| `color.chart.8` | `#475569` | Slate |

**Rules:**

- Use sequential order (1, 2, 3…) by default.
- Don't use more than 6 colors in one chart.
- For accessibility, pair color with pattern or label.

---

## Surface Hierarchy

| Token | Layer | Visual |
|---|---|---|
| `color.bg.app` | Background | Lowest — sits behind everything |
| `color.bg.surface` | Surface | One elevation level |
| `color.bg.subtle` | Subtle separator | Slight differentiation |
| Elevated surfaces | Use `shadow.sm` + `color.bg.surface` | Above page |
| Overlay (modal backdrop) | `rgba(neutral.900, 0.5)` | Above all |

---

## Don't

- ❌ Don't use `color.brand.600` directly in components when `color.action.primary` exists.
- ❌ Don't introduce new hex values without adding them to the palette.
- ❌ Don't use saturated brand colors for body text (use `color.text.*`).
- ❌ Don't use `color.error.*` for non-error UI (e.g. accent decoration).
- ❌ Don't rely on color alone — pair with icon/text/shape for status.

---

## Related

- Typography: [`typography.md`](typography.md)
- Components must consume semantic tokens: [`../components/README.md`](../components/README.md)
