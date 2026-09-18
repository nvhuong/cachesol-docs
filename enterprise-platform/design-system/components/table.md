# Table

The Table is the **most important enterprise component**. It displays structured data with support for sorting, filtering, selection, pagination, and dense information display.

---

## Purpose

Display rows of structured data with consistent layout. Enable users to scan, compare, filter, sort, and act on data.

---

## When to use

- Display 5+ rows of structured data.
- User needs to compare values across rows.
- Data supports sorting, filtering, or bulk actions.

## When not to use

- Fewer than 5 rows — use a Description list or Cards.
- Hierarchical data — use Tree.
- Simple 2-column key-value — use Description list.
- Highly visual cards with images — use Cards.

---

## Table anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│ Toolbar                                                          │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────┐ │
│ │ 🔍 Search   │ │ Filter ▼     │ │  Bulk actions ▼ │ Actions │ │
│ └──────────────┘ └──────────────┘ └──────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ □ │ Column A    │ Column B    │ Column C    │ Column D   │ ⋮ │  ← sticky header
├─────────────────────────────────────────────────────────────────┤
│ □ │ Data        │ Data        │ Data        │ Data       │ ⋮ │
│ □ │ Data        │ Data        │ Data        │ Data       │ ⋮ │
│ □ │ Data        │ Data        │ Data        │ Data       │ ⋮ │
│ □ │ Data        │ Data        │ Data        │ Data       │ ⋮ │
├─────────────────────────────────────────────────────────────────┤
│ Footer: Showing 1–50 of 1,234   [< 1 2 3 … 25 >]             │
└─────────────────────────────────────────────────────────────────┘
```

| Part | Required | Notes |
|---|---|---|
| Toolbar | No | Search, filters, bulk actions |
| Column header | Yes | Label, sort control |
| Data row | Yes | One row per record |
| Cell | Yes | One per column |
| Row selection | No | Checkbox column |
| Row actions | No | Overflow menu or icon buttons |
| Pagination | No | Show when rows > page size |
| Footer | No | Row count summary |
| Empty state | Yes | When no data |
| Loading state | Yes | Skeleton rows |
| Error state | Yes | When data fails to load |

---

## Toolbar anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│ [🔍 Search…                     ] [Status ▼] [Date ▼]   [⋮ More]│
└─────────────────────────────────────────────────────────────────┘
```

| Part | Purpose |
|---|---|
| Search | Full-text search across all columns |
| Quick filters | Predefined filters (Status, Date range) |
| Column visibility | Show/hide columns |
| Bulk actions | Act on selected rows |
| Action menu | Export, refresh, settings |

---

## Features

### Sorting

- Click column header to sort ascending.
- Click again → descending.
- Click again → clear sort.
- Active sort column shows sort icon (↑ ↓) and is visually indicated.
- Server-side sort for > 100 rows; client-side for smaller.
- Multi-column sort: hold `Shift` + click (secondary sort).
- Default sort column: none. User chooses.

### Filtering

- **Quick filter:** Dropdown per column (text, enum, date range).
- **Advanced filter:** Panel/drawer for complex combinations.
- **Search:** Real-time filter on client-side for ≤ 500 rows.
- **Server-side filter:** API call on filter change, with debounce (300ms).
- Active filters shown as removable chips in toolbar.
- "Clear all filters" action when ≥ 1 active filter.

### Pagination

- Page size options: 10, 25, 50, 100. Default: 25.
- Page navigation: First, Prev, [page numbers], Next, Last.
- Jump to page: input field for large datasets.
- Row range display: "Showing 51–100 of 1,234".
- Client-side pagination for ≤ 500 rows; server-side otherwise.
- Preserve page position on return to list.

### Row selection

- **Row checkbox:** Select/deselect individual row.
- **Header checkbox:** Select all on current page / select all (with confirmation for > 100).
- **Bulk action bar:** Appears when ≥ 1 row selected. Shows count: "3 selected".
- Selection persists across pagination pages if using server-side.
- Clear selection on filter change (or show warning).

### Sticky header

- Column headers stick to top on scroll.
- Shadow appears on header when scrolled (`shadow.sm`).
- Works with horizontal scroll (first column(s) can also be sticky).

### Column resize

- Drag column edge to resize.
- Min column width: 60px.
- Double-click edge → auto-fit to content.
- Persist column widths to user preference.

### Column visibility

- Show/hide columns via dropdown menu.
- At least 2 columns must remain visible.
- Persist visibility to user preference.

### Row expansion

- Click to expand row and show detail content.
- Expanded content replaces the row, pushing others down.
- Use for: related detail, mini-form, audit log.
- Max 1 expanded row at a time (accordion).

### Inline actions

- Primary actions (1–2): Icon buttons in the row.
- Secondary actions: Overflow menu (⋯) for remaining actions.
- Never put more than 3 visible actions in a row.
- Actions must be contextual to the row data.

---

## Density

| Mode | Row height | Cell padding X | Cell padding Y | Use case |
|---|---|---|---|---|
| `comfortable` | 56px | `spacing.4` (16px) | `spacing.3` (12px) | Read-heavy, approval screens, mobile |
| `default` | 48px | `spacing.4` (16px) | `spacing.2` (8px) | Standard CRUD |
| `compact` | 36px | `spacing.3` (12px) | `spacing.1` (4px) | Power users, financial data |

Density is a **user preference** (saved to profile). Default = `default`.

**Rule:** Never shrink font size for density. Use padding only.

---

## Cell alignment

| Content type | Alignment | Rationale |
|---|---|---|
| Text | Left | Reading direction |
| Numbers | Right | Aligns decimal point, easier comparison |
| Currency | Right | Aligns decimal point + symbol |
| Dates | Left | Human-readable format |
| Percentages | Right | Compare magnitudes |
| Status / Badge | Left | Consistent with surrounding text |
| Checkbox | Center | Visual balance |
| Action buttons | Right | Actions are independent |
| Avatars | Left | Follows text direction |

---

## Numeric formatting

Always format numbers consistently:

| Type | Format | Example |
|---|---|---|
| Currency | `$1,234.56` | `Intl.NumberFormat` |
| Percentage | `12.3%` | With symbol |
| Large number | `1.2K` | With tooltip for exact |
| Date | `18 Sep 2026` | Locale-aware |
| DateTime | `18 Sep 2026 14:30` | 24h or 12h per locale |
| Duration | `2d 5h` | Human-readable |
| Code / ID | `ACM-2026-001` | Monospace font |

### Tabular numbers

Apply to all numeric columns:

```css
font-variant-numeric: tabular-nums;
font-feature-settings: "tnum" 1;
```

---

## Column header styling

```
font-size: font.size.label.sm          (12px)
font-weight: font.weight.semibold     (600)
text-transform: uppercase             (optional — recommended for tables)
letter-spacing: 0.5px
color: color.text.tertiary            (neutral.500)
```

Optional: remove `text-transform: uppercase` for simpler, modern look. Pick one approach per product and apply consistently.

---

## Row states

| State | Visual |
|---|---|
| `default` | Default styling |
| `hover` | `color.bg.subtle` background |
| `selected` | `color.bg.selected` background + checkbox checked |
| `expanded` | Shows expanded content below |
| `disabled` | `color.text.disabled` + 50% opacity |
| `loading` | Skeleton rows (see Loading state) |

---

## Actions in rows

### Hierarchy

- **1 primary action:** Single icon button, icon + text on hover.
- **1–2 secondary actions:** Icon buttons visible.
- **3+ actions:** Overflow menu (⋯).

### Overflow menu

```
┌──────────────────────┐
│ ✏️ Edit              │
│ 👁 View details      │
│ 📋 Duplicate         │
│ ──────────────────── │
│ 🗑️ Delete            │  ← destructive, red text
└──────────────────────┘
```

Rules:
- Destructive actions always last, separated by divider.
- Use `role="menuitem"` and `role="menu"`.
- Keyboard: Arrow keys to navigate, `Escape` to close.

### Row click behavior

- If entire row is clickable → cursor `pointer`.
- If only action → entire row is NOT clickable.
- Never mix clickable row + action buttons in same row (ambiguous).

---

## Responsive behavior

### Desktop (≥ 1024px)

Full table. All columns visible.

### Tablet (768–1023px)

- Horizontal scroll on table.
- First column sticky.
- Toolbar wraps.

### Mobile (< 768px)

Transform to **card view**:

```
┌─────────────────────────────────────────┐
│ □ Customer A                    [⋯]     │
│   Email: a@c.com                       │
│   Status: ● Active                     │
│   Revenue: $12,340                     │
│   Created: 18 Sep 2026                 │
├─────────────────────────────────────────┤
│ □ Customer B                    [⋯]     │
│   …                                    │
└─────────────────────────────────────────┘
```

- Each row becomes a card.
- Column header becomes card label.
- Keep: 1–3 most important columns.
- Secondary data in card body.
- Actions remain in overflow menu.

Alternative: horizontal scroll with frozen first column.

---

## Empty states

Four distinct empty states:

| Scenario | Message | Action |
|---|---|---|
| No data (new) | "No customers yet" | "Create customer" CTA |
| No data (cleared filter) | "No results for 'Acme'" | "Clear filter" link |
| Permission denied | "You don't have permission to view customers" | None |
| System error | "Failed to load customers" | "Try again" button |

---

## Loading state

Show **skeleton rows** — same structure as real rows, animated shimmer.

```
┌───────┬───────────────┬─────────────┬──────────────┐
│  □   │ ████  ████     │ ████████    │ ████████     │
│  □   │ ████  ████     │ ████████    │ ████████     │
│  □   │ ████  ████     │ ████████    │ ████████     │
└───────┴───────────────┴─────────────┴──────────────┘
```

- Keep row height and column widths identical to real data (prevents layout shift).
- Shimmer animation: 1.5s duration, ease-in-out.
- Respect `prefers-reduced-motion`: show static gray rows instead.

---

## Error state

```
┌─────────────────────────────────────────────────────────┐
│           ⚠ Failed to load customers                   │
│         Something went wrong. Try again.                │
│                    [Try again]                          │
└─────────────────────────────────────────────────────────┘
```

- Show error message in the table area.
- Include retry action.
- Don't show the error as a row.

---

## Props / conceptual API

```text
columns:          Column[]                    // required
rows:             Row[]                       // required
density:          "comfortable" | "default" | "compact"
selectable:       boolean
selectedRows:     string[]                    // row IDs
onSelectionChange: (ids: string[]) => void
sortable:         boolean
sortColumn:       string | null
sortDirection:    "asc" | "desc" | null
onSort:           (column: string, direction: "asc" | "desc") => void
filterable:       boolean
filters:          FilterState
onFilter:         (filters: FilterState) => void
paginated:        boolean
pageSize:         number
page:             number
totalRows:        number
onPageChange:     (page: number) => void
onPageSizeChange: (size: number) => void
rowKey:           string                      // unique row identifier field
loading:          boolean
error:            string | null
onRowClick:       (row: Row) => void
rowActions:       Action[]                   // for overflow menu
emptyState:       EmptyStateConfig
stickyHeader:     boolean
resizableColumns: boolean
columnVisibility: Record<string, boolean>
onColumnToggle:   (column: string, visible: boolean) => void
```

---

## Do

- ✅ Right-align numeric, currency, percentage columns.
- ✅ Apply tabular numbers to numeric columns.
- ✅ Show skeleton loading state (not spinner).
- ✅ Distinguish 4 empty states clearly.
- ✅ Show at least 1 primary action per row.
- ✅ Keep row actions in overflow menu when > 2.
- ✅ Use density as a user preference.

## Don't

- ❌ Don't left-align numbers.
- ❌ Don't show > 3 visible action buttons in a row.
- ❌ Don't mix clickable rows with inline actions.
- ❌ Don't use spinner for loading — use skeleton.
- ❌ Don't use the same empty state message for all scenarios.
- ❌ Don't hard-code column widths — use min/max + auto-fit.
- ❌ Don't show > 50 rows without pagination.

---

## Related

- Pattern: List page template uses Table: [`../templates/list-page.md`](../templates/list-page.md)
- Pattern: Data display patterns: [`../patterns/data-display.md`](../patterns/data-display.md)
- Tokens: [`../tokens/colors.md`](../tokens/colors.md), [`../tokens/spacing.md`](../tokens/spacing.md)
- Pagination: see [`../patterns/feedback.md`](../patterns/feedback.md)
