# Import & Export Pattern

Patterns for bringing data into the system (Import) and getting data out (Export). Both handle files (CSV, XLSX, PDF) and large datasets.

---

## Purpose

Allow users to bulk-import data from files and bulk-export data to files for offline work or sharing.

---

## Import flow

### Anatomy

```
┌─────────────────────────────────────────────────────────────────────┐
│ Import customers                                                 [X] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Step 1 of 3: Upload file                                          │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                                                              │ │
│  │              📁                                               │ │
│  │                                                              │ │
│  │       Drag and drop a file here, or click to browse          │ │
│  │                                                              │ │
│  │       Accepted formats: .xlsx, .csv (max 10MB)              │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  [Download template] [Cancel]                          [Next →]    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Step 2 of 3: Preview & validate                                     │
│                                                                      │
│  ✓ 245 rows valid   ⚠ 3 rows have errors                           │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ Row │ Name            │ Email              │ Status           │ │
│  ├─────┼─────────────────┼────────────────────┼──────────────────┤ │
│  │ 1   │ John Smith      │ john@acme.com      │ ✓ Valid          │ │
│  │ 2   │ Jane Doe        │ jane@example.com    │ ✓ Valid          │ │
│  │ 3   │                 │ bob@acme.com        │ ⚠ Name missing   │ │
│  │ 4   │ Mike Wilson     │ mike@acme           │ ⚠ Invalid email  │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  [← Back]   [Download error log]              [Import 245 valid rows] │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Step 3 of 3: Importing                                              │
│                                                                      │
│  Importing 245 rows...                                              │
│                                                                      │
│  ████████████████░░░░░░░░  65%  (159/245)                          │
│                                                                      │
│  ETA: 12 seconds                                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Steps

1. **Upload file** — drag-drop or browse.
2. **Preview & validate** — show rows, highlight errors.
3. **Import** — progress bar.
4. **Done** — summary.

### Step 1: Upload

| Element | Notes |
|---|---|
| Drop zone | Big area, clear instructions |
| Accepted formats | Listed clearly (`.xlsx`, `.csv`) |
| Max size | Listed (e.g. 10MB) |
| Template download | Always available |
| Multi-file | Single file only for MVP |

### Step 2: Validate

| Element | Notes |
|---|---|
| Total rows | `245 rows` |
| Valid count | `✓ 245 valid` |
| Error count | `⚠ 3 errors` |
| Preview table | First 100 rows max |
| Error highlighting | Per cell |
| Download error log | For fixing in source |
| Import button | Disabled if 0 valid |

### Step 3: Import

| Element | Notes |
|---|---|
| Progress bar | Percentage + count |
| ETA | Estimated time remaining |
| Cancel | Allow cancel (warn about partial state) |

### Step 4: Done

```
┌─────────────────────────────────────────────┐
│                                              │
│        ✓ Import complete                     │
│                                              │
│   245 rows imported                          │
│   0 errors                                   │
│                                              │
│   [View imported]    [Import another]        │
│                                              │
└─────────────────────────────────────────────┘
```

| Element | Notes |
|---|---|
| Success message | Concise |
| Counts | Imported + skipped |
| View imported | Navigate to list with filter |
| Import another | Reset to step 1 |

### Partial failure

```
┌─────────────────────────────────────────────┐
│                                              │
│        ⚠ Import partially complete           │
│                                              │
│   240 imported                               │
│   5 failed                                   │
│                                              │
│   [Download error log]                       │
│                                              │
└─────────────────────────────────────────────┘
```

---

## Validation rules

| Rule | Behavior |
|---|---|
| Required field missing | Block import, show error per row |
| Format invalid (email, phone) | Block import, show error per row |
| Duplicate (e.g. email) | Skip with warning, continue import |
| Foreign key invalid | Block import, show error |
| File too large | Block before upload |
| Wrong file type | Block before upload |

---

## Template file

Always provide a downloadable template:

```
Templates should have:
- Correct column headers (matching field names)
- Sample row with valid data
- Data validation (dropdowns where possible)
- Instructions sheet (optional)
```

Example for customers.xlsx:

```
| name          | email          | phone           | company   |
|---------------|----------------|-----------------|-----------|
| John Smith    | john@acme.com  | +84 90 123 4567 | ACME Corp |
```

---

## Error log

Provide downloadable error log when import fails partially:

```
| row | column | value      | error              |
|-----|--------|------------|--------------------|
| 3   | name   | (empty)    | Required field      |
| 4   | email  | mike@acme  | Invalid email format|
```

Format: CSV, easy to open in Excel.

---

## Export flow

### Sync export (small data)

```
[Export] ──> Progress (1-2s) ──> File downloads
```

For small datasets (≤ 10k rows), synchronous export with brief loading.

### Async export (large data)

```
[Export to email] ──> Confirmation ──> Submit ──> Toast: "We'll email when ready"
                                            ──> Background processing
                                            ──> Email notification when done
```

For large datasets (> 10k rows), async export.

### Export modal

```
┌─────────────────────────────────────────────┐
│ Export customers                        [X] │
├─────────────────────────────────────────────┤
│                                              │
│  Format:    [Excel (.xlsx) ▼]                │
│                                              │
│  Columns:   ☑ All columns                   │
│             ☐ Custom selection              │
│                                              │
│  Filters:   Current filter applied          │
│             245 customers                    │
│                                              │
│  Delivery:  ◉ Download now                  │
│             ○ Email to me                   │
│                                              │
├─────────────────────────────────────────────┤
│                       [Cancel]  [Export]    │
└─────────────────────────────────────────────┘
```

### Export options

| Option | Notes |
|---|---|
| Format | XLSX (default), CSV |
| Columns | All (default), Custom (selectable) |
| Filters | Current filters applied |
| Delivery | Download (default), Email |

---

## Large dataset handling

### Server-side streaming

For exports > 1MB:

- Stream the file in chunks.
- Show progress bar with byte count.
- Use HTTP range requests.

### Async export with email

For exports > 10MB or > 10k rows:

- Submit to background job.
- Show confirmation: "We'll email when ready".
- User can continue working.
- Email contains download link (expires in 24h).
- Link includes all current filters.

---

## Bulk import/export UI locations

| Location | Use |
|---|---|
| List page toolbar | "Import" / "Export" buttons |
| Empty state | "Import your first batch" CTA |
| Settings | "Bulk import" for advanced |

---

## Loading states

| State | UI |
|---|---|
| Upload | Progress bar with % |
| Validate | Spinner (usually <2s) |
| Import | Progress bar with row count |
| Export sync | Spinner overlay |
| Export async | Toast + email notification |

---

## Error handling

| Error | Pattern |
|---|---|
| File too large | "File exceeds 10MB limit" |
| Wrong format | "Only .xlsx and .csv accepted" |
| Network error | "Upload failed. Please try again." |
| Server error | "Couldn't import. Try again or contact support." |
| Timeout | "Import took too long. Use smaller batches." |

---

## Do

- ✅ Always provide a template file.
- ✅ Validate before import, show errors clearly.
- ✅ Allow downloading error log.
- ✅ Support partial imports (import valid, skip invalid).
- ✅ Show progress for any operation > 2s.
- ✅ Use async export for large datasets.

## Don't

- ❌ Don't require manual column mapping (use template).
- ❌ Don't silently skip invalid rows.
- ❌ Don't block the UI during large exports.
- ❌ Don't allow imports without preview.
- ❌ Don't lose user's place when import is done.

---

## Related

- Modal: [`../components/modal.md`](../components/modal.md)
- Forms: [`forms.md`](forms.md)
- Feedback: [`feedback.md`](feedback.md)
- List page: [`../templates/list-page.md`](../templates/list-page.md)
- Workflow page: [`../templates/workflow-page.md`](../templates/workflow-page.md)
