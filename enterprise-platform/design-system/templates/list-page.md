# List Page

The primary screen for browsing, searching, and managing collections of entities: customers, invoices, orders, users, approvals.

---

## Purpose

Display a large collection of records with tools to search, filter, sort, and act on them.

**Use when:**
- The user needs to find a specific record among many.
- The user needs to compare multiple records.
- The user needs to perform bulk or individual actions on records.

**Not for:**
- < 5 records → use a Description list or Cards.
- Detail view of a single record → use Detail Page.
- Creating a new record → use Form Page.

---

## Anatomy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ App Shell                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Sidebar │ Page Header                                                    │ │
│ │         │ ┌─────────────────────────────────────────────────────────┐  │ │
│ │         │ │ Breadcrumb > List title           [Secondary] [Primary] │  │ │
│ │         │ │ Description text                                         │  │ │
│ │         │ └─────────────────────────────────────────────────────────┘  │ │
│ │         │ Toolbar                                                       │ │
│ │         │ ┌─────────────────────────────────────────────────────────┐  │ │
│ │         │ │ 🔍 Search…  │ Status ▼ │ Date ▼ │  Columns ▼ │  Actions │  │ │
│ │         │ └─────────────────────────────────────────────────────────┘  │ │
│ │         │ Bulk action bar (shown when rows selected)                    │ │
│ │         │ ┌─────────────────────────────────────────────────────────┐  │ │
│ │         │ │ 3 selected   [Export]  [Delete]  [Assign]         Clear │  │ │
│ │         │ └─────────────────────────────────────────────────────────┘  │ │
│ │         │ Data Table                                                     │ │
│ │         │ ┌───┬─────────────────┬──────────────┬────────┬─────────┐  │ │
│ │         │ │ □ │ Customer  ↑    │ Status       │ Revenue│ Actions │  │ │
│ │         │ ├───┼─────────────────┼──────────────┼────────┼─────────┤  │ │
│ │         │ │ □ │ ACME Corp      │ ● Active    │$123.4K │   ⋮    │  │ │
│ │         │ │ □ │ Globex Inc     │ ● Active    │ $98.2K │   ⋮    │  │ │
│ │         │ │ □ │ Initech        │ ● Pending   │  $2.1K │   ⋮    │  │ │
│ │         │ │ □ │ Umbrella Corp  │ ● Active    │ $45.6K │   ⋮    │  │ │
│ │         │ └───┴─────────────────┴──────────────┴────────┴─────────┘  │ │
│ │         │ Pagination                                                     │ │
│ │         │ Showing 1–50 of 1,234      [< 1 2 3 … 25 >]                  │ │
│ │         └─────────────────────────────────────────────────────────────┘  │ │
│ └─────────┴─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Part | Component / Pattern |
|---|---|
| Breadcrumb | Navigation pattern |
| Page title | Navigation pattern |
| Page description | Navigation pattern |
| Primary action | Button (primary) |
| Secondary action | Button (secondary) or overflow menu |
| Search | Input (search variant) |
| Quick filters | Select (single/multi) |
| Column visibility | Select (checkbox dropdown) |
| Bulk action bar | Pattern: appears on selection |
| Data table | Table component |
| Pagination | Table component |

---

## Toolbar

### Search

- Full-text search across all columns (client-side ≤ 500 rows; server-side > 500).
- Debounce: 300ms.
- Clear button appears when search has value.
- Placeholder: "Search {entity}…" (e.g. "Search customers…").

### Quick filters

- Predefined dropdown filters.
- Common: Status, Date range, Owner.
- Active filters shown as removable chips.
- "Clear all" when ≥ 1 active.

### Column visibility

- Dropdown with checkboxes.
- Minimum 2 columns must remain visible.
- Persist to user preference.

### Bulk actions

- Appears when ≥ 1 row selected.
- Shows count: "3 selected".
- Actions: Export, Delete, Assign, custom per entity.
- "Clear" to deselect all.

---

## Data Table

See [`../components/Table.md`](../components/Table.md) for full component spec.

Key columns for a typical list page:

| Column | Type | Align | Notes |
|---|---|---|---|
| Checkbox | selection | center | Optional |
| Primary identifier | text | left | Name, ID, code — the main label |
| Key attribute | text/date/status | left | Status, owner, date |
| Metric | number | right | Revenue, count, amount |
| Actions | buttons | right | 1–2 + overflow menu |

---

## Density

Default density is `default` (48px rows). Users can switch to `comfortable` (56px) or `compact` (36px). See Table component for density spec.

---

## Responsive behavior

### Desktop (≥ 1024px)

Full table layout as above.

### Tablet (768–1023px)

- Table scrolls horizontally.
- First column (primary identifier) is sticky.
- Toolbar wraps or condenses.

### Mobile (< 768px)

Table transforms to **card view** (see Table component).

```
┌─────────────────────────────────────────────┐
│ □ ACME Corporation                   [⋮]   │
│   ● Active  |  $123,400  |  Created 18 Sep │
├─────────────────────────────────────────────┤
│ □ Globex Inc                        [⋮]   │
│   ● Active  |   $98,200  |  Created 12 Sep │
└─────────────────────────────────────────────┘
```

- Each row becomes a card.
- Show 2–3 most important columns as "card details".
- Actions remain in overflow menu.

---

## States

### Default (with data)

See anatomy above.

### Loading

Show skeleton rows (same row height, same column structure). See Table component.

### Empty — No data (new)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              📋                                     │
│                                                     │
│          No customers yet                           │
│                                                     │
│    Create your first customer to get started.       │
│                                                     │
│              [+ Create customer]                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Empty — No search results

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  🔍 No results for "Acme Corporation"               │
│                                                     │
│     Try a different search or clear filters.        │
│                                                     │
│         [Clear search]    [Clear filters]           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Error — failed to load

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│           ⚠ Failed to load customers               │
│                                                     │
│        Something went wrong. Try again.             │
│                                                     │
│              [Try again]                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Permission denied

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│        🔒 You don't have access to customers        │
│                                                     │
│    Contact your admin to request access.             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Interaction flow

```
List Page ──click row──> Detail Page
List Page ──primary action──> Form Page (create)
List Page ──row action──> Detail Page (edit) or confirmation
List Page ──bulk action──> Confirmation / Form Page
List Page ──filter──> Same List Page (filtered)
```

---

## Use cases

- Customer List
- Transaction List
- Invoice List
- Order List
- Approval List
- User List
- Product List
- Report List

---

## Do

- ✅ Show bulk action bar when rows are selected.
- ✅ Right-align numeric columns.
- ✅ Differentiate the 4 empty state types.
- ✅ Show skeleton loading (not spinner).
- ✅ Allow user to change density.
- ✅ Persist column visibility and density to user preference.

## Don't

- ❌ Don't show > 50 rows without pagination.
- ❌ Don't mix clickable rows with inline action buttons.
- ❌ Don't use the same empty state for all scenarios.
- ❌ Don't hard-code column widths.

---

## Related

- Table component: [`../components/Table.md`](../components/Table.md)
- Navigation pattern: [`../patterns/navigation.md`](../patterns/navigation.md)
- Data display patterns: [`../patterns/data-display.md`](../patterns/data-display.md)
- Detail page: [`detail-page.md`](detail-page.md)
- Form page: [`form-page.md`](form-page.md)
