# Form Page

A dedicated page for creating or editing a record. Used when the form is long, complex, or requires the user's full attention.

---

## Purpose

Create or edit a record when the form is too long for a modal, requires the user's full attention, or benefits from URL-addressable state.

**Use when:**
- Creating or editing a complex entity (10+ fields).
- The form requires multiple sections.
- The user needs to reference other data while filling the form.
- The form needs to be bookmarkable or shareable.

**Not for:**
- Quick 1–5 field forms → use Modal.
- Multi-step wizards with branching → consider dedicated wizard component.
- Read-only display → use Detail Page.

---

## Anatomy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ App Shell                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Sidebar │ Page Header                                                    │ │
│ │         │ ┌─────────────────────────────────────────────────────────┐  │ │
│ │         │ │ Breadcrumb > Form title                                     │  │ │
│ │         │ │ Descriptive subtitle about what this form does              │  │ │
│ │         │ └─────────────────────────────────────────────────────────┘  │ │
│ │         │                                                                 │ │
│ │         │ Form Container (max-width: 720px)                              │ │
│ │         │                                                                 │ │
│ │         │ ┌─────────────────────────────────────────────────────────┐  │ │
│ │         │ │ Section 1: Basic Information                              │  │ │
│ │         │ │                                                          │  │ │
│ │         │ │  [First name       ]  [Last name         ]               │  │ │
│ │         │ │  [Email address *  ]                                     │  │ │
│ │         │ │  [Company          ]                                      │  │ │
│ │         │ └─────────────────────────────────────────────────────────┘  │ │
│ │         │                                                                 │ │
│ │         │ ┌─────────────────────────────────────────────────────────┐  │ │
│ │         │ │ Section 2: Contact Details                               │  │ │
│ │         │ │                                                          │  │ │
│ │         │ │  [Phone number   ]  [Mobile         ]                   │  │ │
│ │         │ │  [Address line 1 ]                                      │  │ │
│ │         │ │  [Address line 2 ]                                      │  │ │
│ │         │ │  [City       ]  [Postal code   ]  [Country   ▼]       │  │ │
│ │         │ └─────────────────────────────────────────────────────────┘  │ │
│ │         │                                                                 │ │
│ │         │ ┌─────────────────────────────────────────────────────────┐  │ │
│ │         │ │ Section 3: Preferences                                   │  │ │
│ │         │ │                                                          │  │ │
│ │         │ │  ☑ Send marketing emails                                 │  │ │
│ │         │ │  ☑ Accept terms and conditions *                        │  │ │
│ │         │ └─────────────────────────────────────────────────────────┘  │ │
│ │         │                                                                 │ │
│ │         │                                                                 │ │
│ │         └─────────────────────────────────────────────────────────────┘  │ │
│ │         │                                                                 │ │
│ │         │ Action Bar (sticky)                                          │ │
│ │         │                                           [Cancel] [Save]   │ │
│ │         │                                                                 │ │
│ └─────────┴─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Part | Notes |
|---|---|
| Breadcrumb | `List > Create {Entity}` or `List > {Entity} > Edit` |
| Page title | `"Create {Entity}"` or `"Edit {Entity}"` |
| Subtitle | One sentence: what the form does |
| Form container | Max-width 720px, centered |
| Section | Groups related fields |
| Section title | `heading.sm`, optional |
| Field | Input, Select, DatePicker, Checkbox |
| Action bar | Sticky at bottom |
| Cancel | Secondary button, left |
| Save | Primary button, right |

---

## Page header

```
Create customer
Add a new customer to your account
```

- Title: `"Create {Entity}"` for new, `"Edit {Entity}"` for edit.
- Subtitle: one line explaining the form's purpose.

---

## Sectioning

For forms with 10+ fields, divide into sections:

| Form length | Sections |
|---|---|
| 5–9 fields | 1 section |
| 10–20 fields | 2–3 sections |
| 20+ fields | 3–5 sections |

### Section title

```
Section 1: Basic Information
─────────────────────────────
```

- `font.size.heading.sm` (16px), `font.weight.semibold`.
- `spacing.6` (24px) above.
- Optional horizontal rule below.

### Section gap

- Gap between sections: `spacing.8` (32px).

---

## Form layout

### Single column (default)

For all forms on mobile and default on desktop.

### Two-column fields

For forms with many short fields (name, phone, postal code):

```
┌──────────────────┐  ┌──────────────────┐
│ First name       │  │ Last name        │
│ [John            ]  │ [Smith           ]  │
├──────────────────┤  ├──────────────────┤
│ Phone            │  │ Mobile           │
│ [+84 90 123 4567]  │ [+84 90 654 3210] │
└──────────────────┘  └──────────────────┘
```

- Gap between columns: `spacing.4` (16px).
- Max width: 720px.
- Break to single column on `< md`.

### Full-width fields

```
┌──────────────────────────────────────────────────────────────┐
│ Company address                                             │
│ [123 Main Street, District 1, Ho Chi Minh City              ]│
└──────────────────────────────────────────────────────────────┘
```

- For address, description, URL, long text.

---

## Field width guidelines

| Field type | Width |
|---|---|
| Name (first + last) | 2 columns |
| Email, phone, mobile | 1 column |
| Short code / ID | 200px |
| Address line | full-width |
| Long description / notes | full-width textarea |
| Date | 200px |
| Select (short list) | 200px |
| Country / region | 200px |

---

## Action bar

The action bar is **sticky** at the bottom of the viewport when the form scrolls.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                      [Cancel]  [Save]   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Behavior

- `position: sticky; bottom: 0;`
- Background: `color.bg.surface`.
- Border-top: 1px `color.border.default`.
- Shadow: `shadow.sm` (appears when scrolled).
- Padding: `spacing.4` vertical, `spacing.6` horizontal.

### Button hierarchy

| Button | Variant | Position |
|---|---|---|
| Cancel | `secondary` | Left |
| Save draft | `tertiary` | Left of Save (if applicable) |
| Save / Submit | `primary` | Right |

### States

| State | Behavior |
|---|---|
| Default | All buttons enabled |
| Unsaved changes | No visual change until navigation attempted |
| Submitting | All buttons disabled, spinner on Save |
| Error | Form re-enabled, error message shown |

---

## Validation

See [`../patterns/forms.md`](../patterns/forms.md).

- Validate on blur, revalidate on change.
- Show errors below fields.
- Form-level error on submit failure.
- Required fields marked with `*` + `aria-required`.

---

## Unsaved changes

When navigating away with unsaved changes:

1. Intercept navigation.
2. Show confirmation: "You have unsaved changes."
3. Options: "Discard" (destructive) or "Keep editing".

Implementation:
- Track `isDirty` state.
- On route change / back navigation: show confirmation if `isDirty`.

---

## Create vs Edit

### Create

- Title: `"Create {Entity}"`.
- Subtitle: "Add a new {entity} to your account."
- All fields blank.
- No audit fields (created by/date hidden).
- "Cancel" → back to list.

### Edit

- Title: `"Edit {Entity}"`.
- Subtitle: "Update {entity name}."
- Fields pre-filled with existing values.
- Audit fields shown: "Created by John · 18 Sep 2026 · Updated by Jane · 20 Sep 2026".
- "Cancel" → discard changes → back to detail or list.

---

## Responsive behavior

### Desktop (≥ 1024px)

- Form max-width: 720px.
- 2-column layout for paired fields.
- Sticky action bar.

### Tablet (768–1023px)

- Single column.
- Action bar sticky.

### Mobile (< 768px)

- Single column.
- Buttons stack: Cancel (full width), Save (full width).
- Action bar sticky.

---

## States

### Default (empty / pre-filled)

See anatomy above.

### Submitting

```
[Cancel]  [◐ Saving…]
```

- Save button: `aria-busy="true"`, spinner, label "Saving…".
- Form fields: disabled.
- Cancel still clickable.

### Error on submit

```
┌─────────────────────────────────────────────────────┐
│ ⚠ Some fields have errors. Please review below.     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [field errors]                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Form-level error at top.
- Scroll to first error.
- Fields with errors highlighted.
- Form re-enabled for retry.

### Success

- Redirect to the created/edited entity's Detail Page.
- Toast: "Customer created" / "Changes saved".

---

## Do

- ✅ Use for forms with 10+ fields.
- ✅ Section long forms into logical groups.
- ✅ Keep the action bar sticky.
- ✅ Handle unsaved changes on navigation.
- ✅ Redirect to detail page on success.
- ✅ Validate on blur, revalidate on change.

## Don't

- ❌ Don't use for quick 1–5 field forms (use Modal).
- ❌ Don't make the action bar non-sticky on long forms.
- ❌ Don't validate on first focus.
- ❌ Don't show generic error messages.
- ❌ Don't forget to pre-fill fields in edit mode.

---

## Related

- Forms pattern: [`../patterns/forms.md`](../patterns/forms.md)
- Input component: [`../components/Input.md`](../components/Input.md)
- Select component: [`../components/Select.md`](../components/Select.md)
- Button component: [`../components/Button.md`](../components/Button.md)
- Detail page: [`detail-page.md`](detail-page.md)
- List page: [`list-page.md`](list-page.md)
