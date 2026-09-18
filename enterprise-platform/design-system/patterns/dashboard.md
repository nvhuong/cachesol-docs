# Dashboard Pattern

A dashboard presents a high-level view of business or system metrics. The goal is to support decision-making, not just to display data.

---

## Purpose

Give users a quick overview of key metrics, trends, and alerts so they can monitor status and take action.

**Use cases:**
- Executive overview (CEO, manager).
- Operations monitoring (support, sales ops).
- System health (admin, SRE).
- Personal productivity (today's tasks, pending approvals).

---

## Dashboard principle

> **A dashboard supports decision making, not data display.**

Each chart and metric must answer a question:
- What decision does this support?
- What action does the user take based on this?
- What happens if this data isn't here?

Don't add a chart because it looks good.

---

## Anatomy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ App Shell                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Sidebar │ Page Header                                                    │ │
│ │         │ ┌─────────────────────────────────────────────────────────┐  │ │
│ │         │ │ Dashboard title          [Date range ▼] [Refresh] [⚙]  │  │ │
│ │         │ │ Last updated 2 minutes ago                              │  │ │
│ │         │ └─────────────────────────────────────────────────────────┘  │ │
│ │         │ Global Filters                                                  │ │
│ │         │ ┌─────────────────────────────────────────────────────────┐  │ │
│ │         │ │ [All regions ▼]  [All teams ▼]                         │  │ │
│ │         │ └─────────────────────────────────────────────────────────┘  │ │
│ │         │                                                                 │ │
│ │         │ KPI Row (4 cards)                                              │ │
│ │         │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │ │
│ │         │ │ Revenue  │ │ Orders   │ │ Customers│ │ Approval │         │ │
│ │         │ │ $123.4K  │ │  1,234   │ │   892    │ │ rate     │         │ │
│ │         │ │ +12.4%   │ │ +8.2%    │ │ +5.1%    │ │ 98.2%    │         │ │
│ │         │ └──────────┘ └──────────┘ └──────────┘ └──────────┘         │ │
│ │         │                                                                 │ │
│ │         │ Primary Charts (2-col)                                          │ │
│ │         │ ┌────────────────────────┐  ┌────────────────────────┐       │ │
│ │         │ │ Revenue trend          │  │ Top customers          │       │ │
│ │         │ │ (line chart)           │  │ (bar chart)            │       │ │
│ │         │ └────────────────────────┘  └────────────────────────┘       │ │
│ │         │                                                                 │ │
│ │         │ Secondary (full width)                                          │ │
│ │         │ ┌──────────────────────────────────────────────────────────┐ │ │
│ │         │ │ Recent transactions (table)                              │ │ │
│ │         │ └──────────────────────────────────────────────────────────┘ │ │
│ │         │                                                                 │ │
│ │         │ Alerts / Activity                                              │ │
│ │         │ ┌────────────────────────┐  ┌────────────────────────┐       │ │
│ │         │ │ ⚠ Alerts (3)           │  │ 📋 Recent activity    │       │ │
│ │         │ └────────────────────────┘  └────────────────────────┘       │ │
│ │         │                                                                 │ │
│ └─────────┴─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Part | Notes |
|---|---|
| Title | Dashboard name |
| Date range | Global filter, default: Last 30 days |
| Refresh | Manual refresh button |
| Global filters | Region, team, product (apply to all widgets) |
| KPI row | 2–6 metrics with comparison |
| Primary charts | 1–2 large charts |
| Secondary | Full-width chart or table |
| Alerts | Items needing attention |
| Activity | Recent events |

---

## KPI Row

**2–6 KPIs** in a row. Each:

```
Label
Value     ↑ +12.4%
vs last
```

See [`data-display.md`](data-display.md) for full KPI pattern.

### Layout by count

| Count | Layout |
|---|---|
| 2 | 2 equal columns |
| 3 | 3 equal columns |
| 4 | 4 equal columns |
| 5 | 3 + 2 |
| 6 | 3 + 3 |

---

## Charts

### Hierarchy

| Type | Size | Use |
|---|---|---|
| Line chart | 2 columns | Trends over time |
| Bar chart | 2 columns | Comparisons |
| Donut | 1 column | Part-to-whole (≤ 6 segments) |
| Area chart | 2 columns | Stacked trends |
| Data table | full width | Detailed breakdowns |

### Chart rules

- Always show axis labels with units.
- Include legend for multi-series.
- Use tooltips on hover.
- Show data point on click (drill-through).
- 4-color max per chart.
- No 3D charts.
- Consistent palette: see chart colors in [`../tokens/colors.md`](../tokens/colors.md).

---

## Global filters

Apply to all widgets on the page.

| Filter | Widget |
|---|---|
| Date range | Date range picker with presets |
| Region | Single select |
| Team | Single or multi select |
| Product | Single or multi select |

### Date range presets

| Preset | Range |
|---|---|
| Today | Today, 00:00 → now |
| Yesterday | Yesterday, full day |
| Last 7 days | 7 days ago → now |
| Last 30 days (default) | 30 days ago → now |
| Last 90 days | 90 days ago → now |
| This month | 1st → now |
| Last month | Last month 1st → last day |
| This quarter | Quarter start → now |
| Custom | User picks |

---

## Layouts

### Static dashboard

- Fixed layout chosen by admin.
- All users see the same.
- Easier to maintain.

### Customizable dashboard

- Users can drag, drop, resize, add/remove widgets.
- Persist to user preference.
- More flexible but harder to maintain.

Recommendation: **start with static, add customization only if asked.**

---

## Loading

### Skeleton

Show skeleton for each widget during load:

```
┌──────────────┐
│ ████████     │
│ ████████████ │
│ ██████       │
└──────────────┘
```

- Match final widget dimensions exactly.
- Prevent layout shift.

### Per-widget loading

Each widget loads independently. If one fails, others still show.

### Refresh

- Manual refresh button in header.
- Optional: auto-refresh every N minutes (configurable).
- Show "Last updated: 2 minutes ago".

---

## Empty state

When no data for selected period:

```
┌─────────────────────────────────────────────────┐
│                                                  │
│       No data for this period                    │
│                                                  │
│   Try selecting a different date range.          │
│                                                  │
│        [Last 90 days]                           │
│                                                  │
└─────────────────────────────────────────────────┘
```

Show per-widget, not whole dashboard.

---

## Error state

When widget fails to load:

```
┌─────────────────────────────────────────────────┐
│  Failed to load revenue                          │
│  Something went wrong.                           │
│  [Retry]                                        │
└─────────────────────────────────────────────────┘
```

Other widgets remain functional.

---

## Real-time / live dashboards

For monitoring dashboards, data updates automatically:

- Use WebSocket or polling.
- Animate value changes.
- Don't show loading indicator after initial load.
- Pause auto-update when tab is hidden.

---

## Accessibility

- Charts have text alternative (data table view).
- Color-blind safe palettes.
- Keyboard navigation between widgets.
- Screen reader announces refresh / data updates (configurable).
- Focus visible.

### Data table alternative for charts

Each chart has a hidden data table for screen readers:

```
[Line chart of revenue trend]
Last 6 months:
- Sep 2026: $123,400
- Aug 2026: $112,000
- ...
```

---

## Do

- ✅ Add every metric to answer a specific question.
- ✅ Show comparison to previous period.
- ✅ Allow users to change date range.
- ✅ Show trend direction contextually.
- ✅ Use 2–6 KPIs (not more).
- ✅ Provide data table alternative for charts.
- ✅ Auto-save dashboard layout (if customizable).

## Don't

- ❌ Don't add charts for decoration.
- ❌ Don't use more than 6 colors in a chart.
- ❌ Don't use 3D charts.
- ❌ Don't hard-code dates.
- ❌ Don't refresh the whole dashboard when only one filter changes (debounce).
- ❌ Don't use pie charts with > 6 segments.

---

## Related

- Dashboard template: [`../templates/dashboard-page.md`](../templates/dashboard-page.md)
- Data display patterns: [`data-display.md`](data-display.md)
- Token colors: [`../tokens/colors.md`](../tokens/colors.md)
- Token spacing: [`../tokens/spacing.md`](../tokens/spacing.md)
