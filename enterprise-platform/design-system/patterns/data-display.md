# Data Display

Patterns for presenting information: cards, KPIs, status tags, charts, and description lists.

---

## Card

A card groups related information and creates visual hierarchy on a page.

```
┌─────────────────────────────────────────┐
│ Card Title                      [Action] │
├─────────────────────────────────────────┤
│                                         │
│  Content area                           │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

### Anatomy

| Part | Notes |
|---|---|
| Header | Title + optional action button |
| Body | Content: text, metrics, list, chart |
| Footer | Optional: secondary action, metadata |

### Card variants

| Variant | Use case | Border | Shadow |
|---|---|---|---|
| `default` | General-purpose | `color.border.default` (1px) | none |
| `elevated` | Highlighted content | none | `shadow.sm` |
| `interactive` | Clickable card | hover shows `shadow.md` | `shadow.none` → `shadow.md` |
| `flush` | Inside a container with bg | no border, no shadow | none |

### When to use cards

- Group related content that can stand alone.
- Display a summary before drilling into detail.
- Break a dense page into scannable sections.

### When NOT to use

- Displaying tabular data → use Table.
- Simple key-value pairs → use Description list.
- Too much content → use a dedicated page.

---

## KPI (Key Performance Indicator)

A KPI highlights a single important metric with optional comparison.

```
┌─────────────────────────────────────┐
│ Revenue                         ↑  │
│ $1.23M                            │
│                                     │
│ vs last month: +12.4%              │
└─────────────────────────────────────┘
```

### Anatomy

```
Label            Trend icon
Value            Trend value
Comparison       Comparison label
```

| Part | Token / Style |
|---|---|
| Label | `font.size.label.sm`, `color.text.tertiary`, uppercase |
| Value | `font.size.display.md` (30px), `font.weight.bold`, tabular numbers |
| Trend icon | Up (green) / Down (red) / Neutral (gray), 16px |
| Trend value | `font.size.body.sm`, `color.text.secondary` |
| Comparison | `+12.4%` or `+$123,000`, relative time |

### KPI rules

- **1–6 KPIs per row.** Beyond 6, use a grid or paginate.
- Values use tabular numbers: `font-variant-numeric: tabular-nums`.
- Truncate large numbers: `$1.2M` with tooltip for exact.
- Always show comparison: vs yesterday, last week, last month.
- Trend: green for positive (revenue, approvals), red for negative (errors, downtime). Context determines direction.

---

## Statistic

Similar to KPI but simpler — a number with a label. Used in grids.

```
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ 128  │ │  64   │ │  12   │ │   3  │
│Pending│ │Active │ │Draft  │ │Expired│
└──────┘ └──────┘ └──────┘ └──────┘
```

- Compact stat card: label below number.
- Value: `font.size.heading.lg` (20px, 600).
- Label: `font.size.caption`, `color.text.tertiary`.

---

## Description List (Key-Value)

Display a set of label–value pairs.

```
┌──────────────────────────────────────────────┐
│ Contact information                          │
├──────────────────────────────────────────────┤
│ Email           john@acme.com                │
│ Phone           +84 90 123 4567              │
│ Address         123 Main St, Ho Chi Minh City │
│ Status          ● Active                     │
└──────────────────────────────────────────────┘
```

### Anatomy

```
Label (left)          Value (right)
color.text.tertiary   color.text.primary
```

- Label: `font.size.body.sm`, `color.text.tertiary`.
- Value: `font.size.body.md`, `color.text.primary`.
- Gap between label and value: `spacing.4` (16px).
- Gap between rows: `spacing.3` (12px).
- Use monospace for codes, IDs, technical values.

### Variants

- **Inline:** label and value on same line (default).
- **Stacked:** label above value (for long values).

---

## Badge / Status Tag

A small label that communicates status, category, or count.

```
● Active    ○ Pending    ● Rejected    ● Draft
```

### Anatomy

```
[●] Label
 icon  text
```

### Badge types

| Type | Use case | Style |
|---|---|---|
| `status` | Live status (Active, Pending) | Dot + text, semantic color |
| `category` | Non-status labels (Admin, VIP) | Text only, brand or neutral color |
| `count` | Numeric count (notification) | Number, `radius.full`, brand bg |
| `outline` | Secondary emphasis | Border + text, transparent bg |

### Status badge colors

| Status | Label | Color token | Dot |
|---|---|---|---|
| Active | Active | `success` | green dot |
| Pending | Pending | `warning` | amber dot |
| In Review | In review | `info` | blue dot |
| Approved | Approved | `success` | green dot |
| Rejected | Rejected | `error` | red dot |
| Draft | Draft | `neutral` | no dot |
| Cancelled | Cancelled | `neutral` | no dot |
| Expired | Expired | `warning` | amber dot |
| Failed | Failed | `error` | red dot |
| Suspended | Suspended | `error` | red dot |

### Rules

- Status labels are **consistent across the product.** Never create a new status without defining its semantic color.
- Use the same label everywhere for the same status.
- Pair color with a dot or icon — never color alone.
- Labels are **sentence case**: "In review", not "In Review".

### Sizes

| Size | Use case |
|---|---|
| `sm` (20px height) | Table cells, compact lists |
| `md` (24px height) | Default, form fields |
| `lg` (28px height) | Detail page headers |

---

## Tag / Chip

Similar to badge but used for removable items or taxonomy.

```
[Finance ×]  [Operations ×]  [+ Add tag]
```

- Removable: has `×` button with `aria-label="Remove {label}"`.
- Interactive: hover state.
- Can be selectable (multi-select).

---

## Timeline / Activity Log

Sequential events with timestamps.

```
Today
├── 14:30  John Smith approved invoice #1234          ✓
├── 11:15  Sarah Lee requested approval for $12,340   ⏳
└── 09:00  System created invoice #1234                (i)

Yesterday
├── 16:45  Mike Chen rejected invoice #1233           ✗
└── 14:00  Invoice #1233 submitted for approval       ⏳
```

### Anatomy

```
Timestamp    Actor    Action    Subject    Status icon
```

- Timestamp: `font.size.caption`, `color.text.tertiary`, monospace time.
- Actor: `font.size.body.sm`, `font.weight.medium`.
- Action: `font.size.body.sm`, `color.text.secondary`.
- Subject: `font.size.body.sm`, `color.text.primary`.
- Status: icon (16px), semantic color.
- Connector line: `color.border.subtle`, 1px.

---

## Chart Container

Wraps data visualizations with consistent styling.

```
┌─────────────────────────────────────────────┐
│ Revenue by Month                    [Export] │
├─────────────────────────────────────────────┤
│                                             │
│         ████                                │
│     ████████        ████                   │
│     ████████    ████████████                │
│                                             │
│     Jan    Feb    Mar    Apr    May          │
│                                             │
└─────────────────────────────────────────────┘
```

### Anatomy

```
Title         [Action button]
Chart area
Legend / axis labels
Footer (optional: source, date range)
```

### Chart rules

- Always show axis labels.
- Include units on axes.
- Use a legend for multi-series charts.
- Use tooltips on hover for data points.
- Export action: PNG or CSV.
- Source citation in footer when applicable.

### Color usage in charts

Use the data visualization palette (`color.chart.1`–`color.chart.8`) for series colors. See [`../tokens/colors.md`](../tokens/colors.md).

---

## Data table (inline summary)

For displaying 2–4 key metrics in a compact table.

```
┌──────────────────────┬────────────────┬──────────────────┐
│ Customer             │ Revenue        │ Status            │
├──────────────────────┼────────────────┼──────────────────┤
│ ACME Corporation     │ $12,340        │ ● Active         │
│ Globex Industries   │ $8,200         │ ● Active         │
└──────────────────────┴────────────────┴──────────────────┘
```

- Use for summary tables within cards or detail pages.
- For full data tables → use the Table component.

---

## Do

- ✅ Use semantic colors for status — same status = same color everywhere.
- ✅ Right-align numeric values in description lists.
- ✅ Use KPI trend direction contextually (up = good for revenue, bad for errors).
- ✅ Truncate long values with tooltip.
- ✅ Keep timeline entries short — actor + action + subject.

## Don't

- ❌ Don't create new status colors without updating this guide.
- ❌ Don't use color as the only indicator for status — always pair with text or icon.
- ❌ Don't use charts without axis labels or units.
- ❌ Don't show > 6 KPIs in one row — use a grid.
- ❌ Don't use badges for decorative purposes.

---

## Related

- Table component: [`../components/Table.md`](../components/Table.md)
- Token colors: [`../tokens/colors.md`](../tokens/colors.md)
- Dashboard template: [`../templates/dashboard-page.md`](../templates/dashboard-page.md)
