# Detail Page

Displays a single record in full detail. Shows the record's data, related information, audit history, and actions the user can perform.

---

## Purpose

Display a complete view of a single entity, its related data, and actions to manage it.

**Use when:**
- The user needs to view a record's full details.
- The user needs to take action on a specific record.
- The user needs to see related records or history.

**Not for:**
- Creating a new record → use Form Page.
- Overview dashboard of many entities → use Dashboard Page.
- Simple key-value display with no actions → use Description List pattern.

---

## Anatomy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ App Shell                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Sidebar │ Page Header                                                    │ │
│ │         │ ┌─────────────────────────────────────────────────────────┐  │ │
│ │         │ │ Breadcrumb > List title > Entity name            [Actions] │  │ │
│ │         │ │ Status badge  |  Created by John · 18 Sep 2026          │  │ │
│ │         │ └─────────────────────────────────────────────────────────┘  │ │
│ │         │ Tabs                                                          │ │
│ │         │ Overview | Details | Activity | Settings                     │ │
│ │         │                                                                 │ │
│ │         │ ────────────────────────────────────────────────────────────── │ │
│ │         │                                                                 │ │
│ │         │ [Tab Content]                                                  │ │
│ │         │                                                                 │ │
│ │         │                                                                 │ │
│ │         └─────────────────────────────────────────────────────────────┘  │ │
│ └─────────┴─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Overview tab content

```
┌──────────────────────────────────────────────────────┐
│ Summary card                                          │
│ ┌──────────────────┐  ┌──────────────────────────┐ │
│ │ Key Metric       │  │ Key Metric               │ │
│ │ $12,340          │  │ 23 invoices              │ │
│ │ Total revenue    │  │ Total orders             │ │
│ └──────────────────┘  └──────────────────────────┘ │
├──────────────────────────────────────────────────────┤
│ Primary details (2-column description list)            │
│ ┌──────────────────┐  ┌──────────────────────────┐ │
│ │ Email             │  │ Phone                    │ │
│ │ john@acme.com    │  │ +84 90 123 4567         │ │
│ ├───────────────────┤  ├──────────────────────────┤ │
│ │ Company          │  │ Tax code                 │ │
│ │ ACME Corporation │  │ 0123456789               │ │
│ └───────────────────┘  └──────────────────────────┘ │
├──────────────────────────────────────────────────────┤
│ Related records (mini table or cards)                  │
│ Recent invoices                                      │
│ ┌──────────┬──────────┬───────────┬────────────┐ │
│ │ Invoice  │ Date     │ Amount    │ Status    │ │
│ ├──────────┼──────────┼───────────┼────────────┤ │
│ │ INV-001  │ 18 Sep   │ $12,340   │ ● Approved │ │
│ │ INV-002  │ 10 Sep   │ $4,200    │ ● Pending │ │
│ └──────────┴──────────┴───────────┴────────────┘ │
│                                   [View all invoices] │
└──────────────────────────────────────────────────────┘
```

### Details tab content

Full entity data in sectioned description lists.

### Activity tab content

Timeline / Activity log of all events. See [`../patterns/data-display.md`](../patterns/data-display.md).

### Settings tab content

Entity-specific configuration (rare — only if entity has configuration).

---

| Part | Component / Pattern |
|---|---|
| Breadcrumb | Navigation pattern |
| Page title | Navigation pattern — entity name as title |
| Status badge | Badge / Status Tag |
| Metadata | Description list |
| Summary card | Card pattern |
| Related records | Mini table or card list |
| Activity / Audit log | Timeline pattern |
| Page tabs | Navigation pattern (local tabs) |

---

## Page Header

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Customers > ACME Corporation                                             │
│                                                                          │
│ ACME Corporation                      [Edit] [⋮ More]                  │
│ ● Active                        Created by John · 18 Sep 2026          │
└─────────────────────────────────────────────────────────────────────────┘
```

| Part | Notes |
|---|---|
| Breadcrumb | `Customers > ACME Corporation` |
| Title | Entity name, `heading.xl` (24px) |
| Status badge | Semantic status |
| Metadata | Created by + date, modified by + date |
| Actions | Primary: Edit, Secondary: More menu |

### Actions

| Action | Variant | When |
|---|---|---|
| Edit | `primary` | Always |
| More menu | `ghost` | Delete, duplicate, export, etc. |
| Approve / Reject | `primary` + `destructive` | In approval mode |
| Custom | `secondary` | Domain-specific |

---

## Tabs

| Tab | Content |
|---|---|
| `Overview` | Summary metrics, primary details, related records |
| `Details` | Full entity data, sectioned by topic |
| `Activity` | Audit log, all events |
| `Settings` | Only if entity has configuration |

Default tab: `Overview`. Never default to a tab that requires a permission the user might not have.

---

## View / Edit / Approval modes

### View mode (default)

```
┌──────────────────────────────────────┐
│ Email             john@acme.com       │
│ Phone             +84 90 123 4567    │
│ Status            ● Active            │
└──────────────────────────────────────┘
```

- Values displayed as text.
- Edit button in header.

### Edit mode

```
┌──────────────────────────────────────┐
│ Email                                 │
│ [john@acme.com                    ]   │
│ Phone                                 │
│ [+84 90 123 4567                 ]   │
│ Status                                │
│ [Active                           ▼]   │
└──────────────────────────────────────┘
```

- Fields become editable.
- Action bar: `Cancel` (secondary) + `Save` (primary).
- Sticky action bar.
- Track unsaved changes.

### Approval mode

```
┌──────────────────────────────────────┐
│ Review the details below.             │
│                                       │
│ Email             john@acme.com       │
│ Phone             +84 90 123 4567    │
│ Requested by      John Smith          │
│ Submitted         18 Sep 2026        │
│                                       │
├───────────────────────────────────────┤
│ [Reject]                        [Approve] │
└───────────────────────────────────────┘
```

- All fields are read-only.
- Approval buttons in sticky footer.
- Optional comment field before approve/reject.
- See [`../patterns/forms.md`](../patterns/forms.md) for approval pattern.

---

## Responsive behavior

### Desktop (≥ 1024px)

- 2-column description list layout.
- Tabs horizontal.
- Actions on same row as title.

### Tablet (768–1023px)

- Single column layout.
- Summary cards stack.
- Tabs remain horizontal.

### Mobile (< 768px)

- Single column.
- Tabs become scrollable horizontal strip.
- Actions stack below title.
- Related records use card view (not mini table).

---

## States

### Default (with data)

See anatomy above.

### Loading

```
┌─────────────────────────────────────────────────────┐
│ ████████████                                       │
│ ████████████████          ████████████████████      │
│                                                      │
│ ██████████  ████████████████████████████████        │
│ ██████████  ████████████████████████████████        │
└─────────────────────────────────────────────────────┘
```

- Skeleton for header.
- Skeleton for description list rows.
- Skeleton for related records.

### Error — failed to load

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│           ⚠ Failed to load customer                  │
│                                                      │
│        Something went wrong. [Try again]              │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Not found (404)

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│              🔍 Customer not found                    │
│                                                      │
│    This customer may have been deleted or             │
│    you don't have access to view it.                 │
│                                                      │
│            [← Back to customers]                     │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Permission denied

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│              🔒 Access restricted                    │
│                                                      │
│    You don't have permission to view this            │
│    customer's details.                               │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## Audit log (Activity tab)

Every detail page should show an Activity tab for audit purposes.

```
Today
├── 14:30  John Smith updated email address
│           From: old@acme.com → To: john@acme.com
├── 11:15  System updated status
│           From: Pending → To: Active
└── 09:00  John Smith created this customer
```

See Timeline pattern: [`../patterns/data-display.md`](../patterns/data-display.md).

---

## Interaction flow

```
Detail Page ──Edit──> Edit mode ──Save──> Detail Page
Detail Page ──Delete──> Confirmation modal ──Confirm──> List Page
Detail Page ──Approve──> Confirmation ──Confirm──> Detail Page (updated)
Detail Page ──Back──> List Page
```

---

## Use cases

- Customer Detail
- Invoice Detail
- Order Detail
- User Detail
- Product Detail
- Approval Request Detail

---

## Do

- ✅ Show breadcrumb that links back to the list.
- ✅ Show entity name as page title.
- ✅ Include audit log (Activity tab) for auditable entities.
- ✅ Support View / Edit / Approval modes clearly.
- ✅ Differentiate not-found vs permission-denied errors.
- ✅ Keep actions accessible in the header.

## Don't

- ❌ Don't put a full table of related records on the Overview tab — summarize and link.
- ❌ Don't show Settings tab if the entity has no configuration.
- ❌ Don't default to Edit mode.
- ❌ Don't make every field editable — some fields may be system-controlled.
- ❌ Don't show the Activity tab for non-auditable entities (e.g. simple lookup data).

---

## Related

- List page: [`list-page.md`](list-page.md)
- Form page: [`form-page.md`](form-page.md)
- Navigation pattern: [`../patterns/navigation.md`](../patterns/navigation.md)
- Data display patterns: [`../patterns/data-display.md`](../patterns/data-display.md)
- Feedback patterns: [`../patterns/feedback.md`](../patterns/feedback.md)
- Forms pattern: [`../patterns/forms.md`](../patterns/forms.md)
