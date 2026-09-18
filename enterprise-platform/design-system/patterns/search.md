# Search & Filter Pattern

Patterns for finding data in lists and tables: free-text search, structured filters, and combinations.

---

## Purpose

Help users narrow down a list of records to find specific data quickly.

**Components:**
- Search box (free text).
- Quick filters (dropdown, date range).
- Advanced filters (multi-field form).
- Filter chips (active filters).
- Saved filters / views.

---

## Anatomy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Toolbar                                                                       │
│ ┌──────────────────────────────────────────────────────────────────────────┐│
│ │ 🔍 Search customers…                            [Status ▼] [Date ▼]   ││
│ │                                              [Filters ▼]  [Columns ▼]  ││
│ └──────────────────────────────────────────────────────────────────────────┘│
│ Active filters                                                                 │
│ ┌──────────────────────────────────────────────────────────────────────────┐│
│ │ [Status: Active ×] [Date: Last 30 days ×] [Region: APAC ×] [Clear all]││
│ └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ Data Table...                                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Part | Component |
|---|---|
| Search input | Input (search variant) |
| Quick filters | Select / DatePicker |
| Filters button | Button → opens Advanced filter panel |
| Active filter chips | Tag (removable) |
| Clear all | Button (text) |

---

## Search

### Behavior

| Aspect | Value |
|---|---|
| Match | Case-insensitive substring |
| Fields | All visible columns (configurable) |
| Debounce | 300ms |
| Min chars | 0 (search as you type) |
| Clear | × button when has value |

### Server-side vs client-side

| Rows | Strategy |
|---|---|
| ≤ 500 | Client-side filter |
| > 500 | Server-side search |
| > 10,000 | Required server-side, indexed search |

### Search fields configuration

| Setting | Effect |
|---|---|
| All visible columns | Default for ≤ 500 rows |
| Specific fields only | Server-side, configured per entity |

### Global search (Cmd+K)

Cross-entity search from anywhere:

```
Cmd+K → Opens command palette

┌────────────────────────────────────────────┐
│ 🔍 Search anything…                        │
├────────────────────────────────────────────┤
│ Customers                                   │
│   → John Smith (john@acme.com)            │
│   → Jane Doe (jane@example.com)            │
│ Invoices                                    │
│   → #INV-2026-001 ($12,340)               │
│   → #INV-2026-002 ($4,500)                │
└────────────────────────────────────────────┘
```

- Group results by entity type.
- Show top 5 per group.
- "Show all results" link per group.
- Recent searches (last 5).

---

## Quick filters

Single-field filters shown directly in toolbar.

### Common quick filters

| Filter | Widget |
|---|---|
| Status | Select (single) |
| Date range | Date range picker |
| Owner / Assignee | User picker |
| Region | Select (single) |
| Type | Select (multi) |
| Amount range | Two number inputs |

### Layout

```
[Search]  [Status ▼]  [Date ▼]  [Region ▼]  [More filters ▼]
```

- Wrap on narrow screens.
- Max 3–4 visible; rest in "More filters".

---

## Advanced filters

For complex combinations:

```
┌────────────────────────────────────────────────────────┐
│ Advanced filters                                       │
├────────────────────────────────────────────────────────┤
│                                                         │
│  Field             Operator          Value             │
│  ─────────────────────────────────────────────────────  │
│  Status        is      [Active ▼]              [×]    │
│  Created       between [18 Sep] ─── [25 Sep]     [×]   │
│  Amount        >       [10000]                     [×]   │
│                                                         │
│  [+ Add condition]   [+ Add filter group]              │
│                                                         │
├────────────────────────────────────────────────────────┤
│                              [Reset]  [Cancel]  [Apply]│
└────────────────────────────────────────────────────────┘
```

### Operators by field type

| Field type | Operators |
|---|---|
| Text | contains, equals, starts with, ends with, is empty, is not empty |
| Number | =, ≠, >, <, ≥, ≤, between, is empty, is not empty |
| Date | before, after, between, today, last 7 days, last 30 days, custom |
| Select | is, is not, in, not in |
| Boolean | is true, is false |

### Filter groups

For complex logic:

```
Group 1: (Status = Active AND Amount > 10000)
OR
Group 2: (Created > 1 Jan 2026 AND Owner = John)
```

- Visual grouping with indentation.
- AND within group, OR between groups.

---

## Active filter chips

Show active filters as removable chips:

```
[Status: Active ×]  [Date: Last 30 days ×]  [Region: APAC ×]  Clear all
```

| Element | Notes |
|---|---|
| Each chip | Filter name: value |
| × button | Remove individual filter |
| Clear all | Remove all chips (only when ≥ 2 active) |
| Persist | URL params OR localStorage |

---

## Saved filters / views

For frequently-used combinations:

```
[Filters ▼] → [Save current as view]
[Views ▼]   → Last 7 days active
              Active customers
              Pending approvals
              [+ Save current view]
```

| Element | Notes |
|---|---|
| Save current | Named view, persists to user account |
| Star icon | Mark as default |
| Manage views | Edit/delete saved views |

---

## URL state

Reflect filters in URL for shareable links:

```
/customers?status=active&date=last_30_days&q=acme
```

- Each filter → query param.
- Reload preserves filters.
- Sharing link applies filters.
- Browser back/forward navigates filter history.

---

## Empty results

When filters return no results:

```
┌────────────────────────────────────────────┐
│                                             │
│         🔍 No results                       │
│                                             │
│  No customers match "acme" with filters    │
│  applied.                                   │
│                                             │
│   [Clear filters]   [Clear search]          │
│                                             │
└────────────────────────────────────────────┘
```

Distinguish from "no data" empty state.

---

## Performance

| Concern | Solution |
|---|---|
| Slow filter response | Show "Loading…" inline in toolbar |
| Many active filters | Show count: "5 filters applied" |
| Filter on huge list | Server-side, indexed |
| Filter changes rapidly | Debounce 300ms |

---

## Mobile behavior

| Breakpoint | Strategy |
|---|---|
| `< md` | Hide quick filters in toolbar; "Filters" button opens full panel |
| Tablet | Show 2 quick filters; rest in "More filters" |
| Desktop | All filters visible |

Mobile filter panel:

```
┌─────────────────────────┐
│ Filters              [×]│
├─────────────────────────┤
│ Status    [Active ▼]    │
│ Date      [Last 30d ▼]  │
│ Region    [APAC ▼]      │
│ Owner     [Anyone ▼]    │
├─────────────────────────┤
│ Reset              Apply│
└─────────────────────────┘
```

- Full-screen modal.
- Apply closes and refreshes.
- Reset clears all filters.

---

## Do

- ✅ Show active filters as removable chips.
- ✅ Reflect filters in URL.
- ✅ Debounce search input (300ms).
- ✅ Use server-side search for > 500 rows.
- ✅ Distinguish empty results from no data.
- ✅ Allow saving filter combinations as views.

## Don't

- ❌ Don't require Apply click for search (debounce instead).
- ❌ Don't hide active filters (always visible).
- ❌ Don't reset filters on page navigation (URL preserves).
- ❌ Don't allow filter combinations that don't make sense.

---

## Related

- Input (search variant): [`../components/input.md`](../components/input.md)
- Select: [`../components/select.md`](../components/select.md)
- Date Picker: [`../components/date-picker.md`](../components/date-picker.md)
- Table: [`../components/table.md`](../components/table.md)
- Forms: [`forms.md`](forms.md)
