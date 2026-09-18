# Dashboard Page

Displays key metrics, trends, and activity at a glance. Designed for at-a-glance decision making, not deep data exploration.

---

## Purpose

Present an executive or operational overview of a system: KPIs, trends, alerts, and recent activity.

**Use when:**
- The user needs a high-level view of system health or business metrics.
- Key decisions are made from aggregated data.
- Monitoring and alerting are primary use cases.

**Not for:**
- Detailed data exploration → use List Page.
- Transactional workflows → use List Page or Detail Page.
- Creating/editing records → use Form Page.

---

## Dashboard principle

> **A dashboard supports decision making, not data display.**

Every chart and metric must answer a question. Don't add a chart because it looks good — add it because it answers a question the user has.

Before adding a metric or chart, ask:
1. What decision does this support?
2. What action does the user take based on this?
3. What happens if this data isn't here?

---

## Anatomy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ App Shell                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Sidebar │ Page Header                                                    │ │
│ │         │ ┌─────────────────────────────────────────────────────────┐  │ │
│ │         │ │ Dashboard title                      [Date range ▼] [Refresh] │  │ │
│ │         │ │ Subtitle or last updated time                             │  │ │
│ │         │ └─────────────────────────────────────────────────────────┘  │ │
│ │         │                                                                 │ │
│ │         │ Global Filters                                                  │ │
│ │         │ ┌─────────────────────────────────────────────────────────┐  │ │
│ │         │ │ [All regions ▼]  [All teams ▼]  [All products ▼]        │  │ │
│ │         │ └─────────────────────────────────────────────────────────┘  │ │
│ │         │                                                                 │ │
│ │         │ KPI Row                                                        │ │
│ │         │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │  │
│ │         │ │ Metric 1 │ │ Metric 2 │ │ Metric 3 │ │ Metric 4 │         │  │
│ │         │ │ $123.4K  │ │ 1,234    │ │ 98.2%    │ │ 23        │         │  │
│ │         │ │ vs last  │ │ vs last  │ │ vs last  │ │ vs last  │         │  │
│ │         │ └──────────┘ └──────────┘ └──────────┘ └──────────┘         │  │
│ │         │                                                                 │ │
│ │         │ Primary Charts (2-column grid)                                  │  │
│ │         │ ┌────────────────────────┐  ┌────────────────────────┐       │  │
│ │         │ │                        │  │                        │       │  │
│ │         │ │    Line chart          │  │    Bar chart           │       │  │
│ │         │ │                        │  │                        │       │  │
│ │         │ └────────────────────────┘  └────────────────────────┘       │  │
│ │         │                                                                 │  │
│ │         │ Secondary (full width)                                          │  │
│ │         │ ┌──────────────────────────────────────────────────────────┐ │  │
│ │         │ │                                                          │ │  │
│ │         │ │                   Wide chart or table                    │ │  │
│ │         │ │                                                          │ │  │
│ │         │ └──────────────────────────────────────────────────────────┘ │  │
│ │         │                                                                 │  │
│ │         │ Alerts / Activity Feed                                         │  │
│ │         │ ┌────────────────────────┐  ┌────────────────────────┐       │  │
│ │         │ │ ⚠ Alerts               │  │ 📋 Recent activity    │       │  │
│ │         │ │                        │  │                        │       │  │
│ │         │ │ 3 items                │  │ 5 items                │       │  │
│ │         │ │                        │  │                        │       │  │
│ │         │ └────────────────────────┘  └────────────────────────┘       │  │
│ │         │                                                                 │  │
│ │         └─────────────────────────────────────────────────────────────┘  │ │
│ └─────────┴─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Part | Notes |
|---|---|
| Title | Dashboard name |
| Date range | Global filter for all metrics |
| Refresh | Manual refresh button |
| Global filters | Filter all data on the page |
| KPI row | 2–6 key metrics in a row |
| Primary charts | 1–2 large charts |
| Secondary charts | Full-width charts |
| Alerts | System alerts, warnings |
| Activity feed | Recent events |

---

## KPI Row

**2–6 KPIs** in a row. Each KPI shows:

```
Label
Value
Trend (vs previous period)
```

See KPI pattern: [`../patterns/data-display.md`](../patterns/data-display.md).

### KPI layout

| Number of KPIs | Layout |
|---|---|
| 2 | 2 equal columns |
| 3 | 3 equal columns |
| 4 | 4 equal columns |
| 5 | 3 + 2 columns |
| 6 | 3 + 3 columns |

### Trend calculation

Always show comparison to a previous period:

| Metric type | Trend format |
|---|---|
| Revenue | `+$12.3K (+8.2%)` |
| Count | `+123 (+10%)` |
| Percentage | `98.2% (+1.5pp)` |
| Duration | `-2.3s (-15%)` |

Use `+` for increase, `-` for decrease. Green for positive, red for negative — but direction depends on context. For errors, an increase is bad.

---

## Charts

### Chart hierarchy

| Type | Size | Use case |
|---|---|---|
| Line chart | Wide (2 columns) | Trends over time |
| Bar chart | Wide (2 columns) | Comparisons between categories |
| Donut / Pie chart | Standard | Part-to-whole (≤ 6 segments) |
| Area chart | Wide | Stacked trends |
| Data table | Wide | Tabular dashboard data |

### Chart layout

```
Primary (2 columns):     ┌──────────────────┐  ┌──────────────────┐
                         │                  │  │                  │
                         │   Line chart     │  │   Bar chart      │
                         │                  │  │                  │
                         └──────────────────┘  └──────────────────┘

Secondary (full width):  ┌──────────────────────────────────────────┐
                         │                                          │
                         │              Wide bar / table            │
                         │                                          │
                         └──────────────────────────────────────────┘
```

### Chart container

See Chart Container pattern: [`../patterns/data-display.md`](../patterns/data-display.md).

Every chart has:
- Title (top-left).
- Optional action: Export PNG / Export CSV (top-right).
- Legend (bottom or right).
- Axis labels and units.
- Tooltip on hover.

---

## Global filters

Filter all dashboard data at once:

```
[All regions ▼]  [All teams ▼]  [Date range ▼]
```

| Filter type | Widget |
|---|---|
| Date range | Select with presets: Today, 7 days, 30 days, 90 days, Custom |
| Category filter | Single-select or multi-select |
| Owner / assigned | User picker |

### Date range

| Preset | Range |
|---|---|
| Today | Today, 00:00 → now |
| 7 days | 7 days ago → now |
| 30 days | 30 days ago → now |
| 90 days | 90 days ago → now |
| This month | 1st of month → now |
| This quarter | Start of quarter → now |
| Custom | User picks start + end |

Default: **Last 30 days**.

---

## Alerts section

System alerts and attention-needed items:

```
⚠ 3 alerts
├── Revenue below target (–12%)        2h ago
├── 5 invoices overdue                4h ago
└── System maintenance scheduled        1d ago
```

- Each alert links to the relevant detail page.
- Color-coded by severity: error (red), warning (amber), info (blue).
- "View all" link if > 5 alerts.

---

## Activity feed

Recent events from the system:

```
📋 5 recent events
├── John approved invoice #1234       2h ago
├── Sarah requested approval           4h ago
├── Mike rejected invoice #1233       6h ago
└── System created invoice #1234      1d ago
```

See Timeline pattern: [`../patterns/data-display.md`](../patterns/data-display.md).

---

## Grid layout

### Desktop (≥ 1280px)

```
Row 1: KPI (1/4 each)    ┌────┐ ┌────┐ ┌────┐ ┌────┐
Row 2: Primary charts    ┌──────┐ ┌──────┐
Row 3: Secondary (wide)  ┌──────────────┐
Row 4: Alerts | Activity ┌──────┐ ┌──────┘
```

Grid: 12-column grid, `spacing.4` (16px) gap.

### Tablet (768–1023px)

```
Row 1: KPI (1/2 each)    ┌────┐ ┌────┐
Row 2: KPI (continue)     ┌────┐ ┌────┐
Row 3: Primary charts    ┌──────────────┐ (stacked)
Row 4: Secondary          ┌──────────────┐
Row 5: Alerts             ┌──────────────┘
```

2-column grid.

### Mobile (< 768px)

```
Row 1: KPI (1/2, stacked)  ┌────┐
                            └────┘
Row 2: KPI                  ┌────┐
                            └────┘
Row 3: All charts (stacked, full-width)
Row 4: Alerts (full-width)
Row 5: Activity (full-width)
```

Single-column stack.

---

## States

### Default (with data)

See anatomy above.

### Loading

- KPI: skeleton with correct dimensions.
- Charts: skeleton placeholder with shimmer.
- Do not show empty charts with "No data" — show skeleton.

### Empty (no data for period)

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│         No data for this period                       │
│                                                      │
│    Try selecting a different date range.              │
│                                                      │
│    [Last 90 days]                                   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

- Show on each card / chart individually.
- Don't show on the whole dashboard — some metrics may have data.

### Error (failed to load)

- Show error state on the individual card.
- Others load normally.
- "Retry" on each failed card.

---

## Date and time

- Dashboard data is always time-series aware.
- All dates: locale-aware format.
- Use relative time for recent events: "2h ago", "Yesterday".
- Use absolute date for historical data: "18 Sep 2026".

---

## Do

- ✅ Show 2–6 KPIs with comparison to previous period.
- ✅ Add every chart to answer a specific question.
- ✅ Use global date range filter.
- ✅ Show trend direction contextually (revenue up = good; errors up = bad).
- ✅ Use consistent color palette across charts.
- ✅ Make the dashboard dense but scannable.

## Don't

- ❌ Don't add charts "because they look good".
- ❌ Don't show > 6 KPIs in one row.
- ❌ Don't use more than 4 chart colors in one chart.
- ❌ Don't show a pie chart with > 6 segments.
- ❌ Don't use 3D charts.
- ❌ Don't hard-code dates — use relative time and filters.

---

## Related

- KPI pattern: [`../patterns/data-display.md`](../patterns/data-display.md)
- Chart container: [`../patterns/data-display.md`](../patterns/data-display.md)
- Timeline pattern: [`../patterns/data-display.md`](../patterns/data-display.md)
- Token colors (chart palette): [`../tokens/colors.md`](../tokens/colors.md)
- Token spacing: [`../tokens/spacing.md`](../tokens/spacing.md)
