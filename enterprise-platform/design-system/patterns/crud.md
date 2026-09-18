# CRUD Operations Pattern

The CRUD (Create, Read, Update, Delete) pattern is the foundation of administrative interfaces. It standardizes how users interact with collections of records.

---

## Purpose

Provide consistent patterns for managing entity collections: viewing lists, creating new records, editing existing ones, and deleting.

**Use cases:**
- Master data management (categories, products, departments).
- User management.
- Configuration screens.
- Any entity where users need full lifecycle control.

---

## Anatomy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ App Shell                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Sidebar │ Page Header                                                    │ │
│ │         │ ┌─────────────────────────────────────────────────────────┐  │ │
│ │         │ │ Breadcrumb > List title              [+ Create new]      │  │ │
│ │         │ │ Description                                              │  │ │
│ │         │ └─────────────────────────────────────────────────────────┘  │ │
│ │         │ Toolbar                                                       │ │
│ │         │ ┌─────────────────────────────────────────────────────────┐  │ │
│ │         │ │ 🔍 Search…    │ Status ▼ │ Date ▼ │  Columns ▼ │  More  │  │ │
│ │         │ └─────────────────────────────────────────────────────────┘  │ │
│ │         │ Data Table                                                     │ │
│ │         │ ┌──────┬───────────────┬─────────┬──────────────┬────────┐  │ │
│ │         │ │  □   │ Name  ↑      │ Status  │ Created      │ Actions│  │ │
│ │         │ ├──────┼───────────────┼─────────┼──────────────┼────────┤  │ │
│ │         │ │  □   │ ACME Corp    │ ● Active │ 18 Sep 2026 │   ⋮   │  │ │
│ │         │ │  □   │ Globex Inc   │ ● Active │ 12 Sep 2026 │   ⋮   │  │ │
│ │         │ │  □   │ Initech      │ ● Pending│ 10 Sep 2026 │   ⋮   │  │ │
│ │         │ └──────┴───────────────┴─────────┴──────────────┴────────┘  │ │
│ │         │ Pagination: Showing 1–3 of 3                                 │ │
│ └─────────┴─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Part | Component |
|---|---|
| List page | List Page template |
| Create / Edit | Modal or Drawer for short forms; Form Page for long |
| Delete | Confirmation Modal |
| Bulk operations | Toolbar bulk action bar |

---

## Create

### Where

| Form length | Use |
|---|---|
| 1–5 fields | Modal |
| 6–10 fields | Drawer |
| > 10 fields | Form Page |

### Flow

```
List page ──[+ Create new]──> Form (Modal/Drawer/Page) ──[Save]──> List page (refresh)
                                                      ──[Cancel]──> List page (no change)
```

### Pre-create checks

- Validate unique constraints before allowing submit (e.g. "Name already exists").
- Show inline error on field.
- Or, allow submit and surface server error.

### Post-create

- Toast: "Customer created".
- Close form.
- Refresh list (insert new row at top).
- Or, redirect to detail page of new record.

---

## Read

### List view

Default view. See [`../templates/list-page.md`](../templates/list-page.md).

### Detail view

Click row → Detail Page. See [`../templates/detail-page.md`](../templates/detail-page.md).

### Inline preview (in Drawer)

For quick view without leaving list:

```
[List page with row click] ──> [Drawer slides in with detail]
                              ──> [Click "View full" → Detail Page]
```

---

## Update

### Edit-in-place

For simple fields (status, owner, single value):

```
Click cell → editable
Press Enter / blur → save
Press Escape → cancel
```

- Optimistic update.
- Revert on error with toast.

### Edit via Drawer

For 1–3 fields:

```
Click "Edit" in row → Drawer opens
Save → closes Drawer, refreshes row
```

### Edit via Form Page

For 5+ fields:

```
Click row → Detail Page → Edit button → Form Page
Save → redirect to Detail Page
```

### Edit via Modal

For 1–5 fields that don't warrant a full page:

```
Click "Edit" in row → Modal opens
Save → closes Modal, refreshes row
```

---

## Delete

### Single delete

```
Row action menu ──> Delete ──> Confirmation Modal ──> [Delete] → API call
                                                  ──> [Cancel] → close modal
```

Confirmation modal contents:

```
┌────────────────────────────────────────────┐
│ Delete customer                        [X] │
├────────────────────────────────────────────┤
│                                             │
│  Are you sure you want to delete            │
│  "John Smith"?                              │
│                                             │
│  This action cannot be undone.              │
│                                             │
│  ● Type "John Smith" to confirm:            │
│  [___________________________]              │
│                                             │
├────────────────────────────────────────────┤
│                       [Cancel]  [Delete]    │
└────────────────────────────────────────────┘
```

Rules:
- Always use destructive confirmation for delete.
- For high-impact: require typing the name.
- Show what will be affected (related records).
- "This action cannot be undone" for permanent delete.

### Bulk delete

```
Select rows ──> Bulk action bar ──> [Delete selected] ──> Confirmation
```

- Show count of items to delete.
- List affected items (truncate to 5 with "..." for more).
- "This will delete N records permanently."

### Soft delete vs hard delete

| Type | Behavior |
|---|---|
| Soft delete | Sets `deletedAt`, can be restored |
| Hard delete | Permanent, cannot be restored |

UI patterns:

| Type | Confirmation | Recovery |
|---|---|---|
| Soft delete | Standard "Delete" confirmation | "Undo" toast for 5s |
| Hard delete | Strong confirmation + type to confirm | None — explain permanence |

---

## Bulk operations

Selection pattern:

```
Header checkbox:
- Indeterminate: some selected
- Checked: all on current page selected
- Unchecked: none selected
```

Selection actions:

| Action | Use case |
|---|---|
| Delete | Multiple records |
| Export | Selected records to CSV/PDF |
| Assign | Change owner/assignee |
| Update status | Bulk status change |
| Send email | Notify selected users |

---

## Inline CRUD vs separate pages

| Pattern | Use when |
|---|---|
| **Inline edit** | Single field, status changes, simple updates |
| **Drawer edit** | 1–3 fields, frequent edits |
| **Modal edit** | 1–5 fields, occasional edits |
| **Form page** | 5+ fields, complex edits, needs URL state |

---

## Routing patterns

```
/customers                   → List page
/customers/new               → Create form
/customers/:id               → Detail page
/customers/:id/edit          → Edit form
/customers/:id/delete        → (just an action, no page)
```

Or modal-based:

```
/customers                   → List page (with modal for create/edit)
```

Choose one pattern per project and apply consistently.

---

## Permissions

| Action | Who can perform |
|---|---|
| View list | Authenticated users (filtered by permission) |
| View detail | Users with read permission |
| Create | Users with create permission |
| Update | Users with update permission (own / all) |
| Delete | Users with delete permission (rare) |

### UI behavior by permission

| No permission | Hide action vs Disable? |
|---|---|
| View | Hide (user doesn't know it exists) |
| Create | Hide |
| Update | Disable + tooltip "You don't have permission" |
| Delete | Disable + tooltip "Contact admin" |
| Sensitive view (e.g. salary) | Disable or hide based on context |

---

## Auditability

Every CRUD action should be logged and visible:

| Action | Log entry |
|---|---|
| Created | "John created customer ACME Corp at 18 Sep 2026 14:30" |
| Updated | "John changed status from Active to Inactive" (field-level) |
| Deleted | "John deleted customer ACME Corp at 18 Sep 2026 14:30" |

Show in Activity log on Detail Page.

---

## Error handling

| Error | Pattern |
|---|---|
| Network error | Toast + retry |
| Validation error | Inline on field + scroll to first error |
| Permission denied | Alert "You don't have permission" |
| Conflict (already exists) | Inline error on unique field |
| Server error | Toast + log reference |
| Optimistic update failed | Revert + toast "Couldn't save, please try again" |

---

## Do

- ✅ Use consistent create/edit pattern across the product.
- ✅ Always confirm destructive actions.
- ✅ Refresh list after CRUD operations.
- ✅ Show success / error feedback.
- ✅ Support keyboard for inline edit.
- ✅ Track changes for unsaved edit forms.
- ✅ Log all CRUD actions for audit.

## Don't

- ❌ Don't create data without user confirmation.
- ❌ Don't delete without confirmation.
- ❌ Don't hard-delete soft-deletable data.
- ❌ Don't show actions the user can't perform.
- ❌ Don't lose unsaved changes without warning.

---

## Related

- List page: [`../templates/list-page.md`](../templates/list-page.md)
- Detail page: [`../templates/detail-page.md`](../templates/detail-page.md)
- Form page: [`../templates/form-page.md`](../templates/form-page.md)
- Modal: [`../components/modal.md`](../components/modal.md)
- Drawer: [`../components/drawer.md`](../components/drawer.md)
- Forms: [`forms.md`](forms.md)
- Feedback: [`feedback.md`](feedback.md)
