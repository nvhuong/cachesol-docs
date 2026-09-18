# Forms

Forms are the primary mechanism for data entry. This pattern defines how to compose Input, Select, Button, and feedback components into effective enterprise forms.

---

## Form anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│ Section Title                                                    │
│ ─────────────────────────────────────────────────────────────── │
│                                                                  │
│  Field group (related fields)                                   │
│                                                                  │
│  ┌──────────────────────┐  ┌──────────────────────┐           │
│  │ First name           │  │ Last name            │           │
│  │ [John             ]  │  │ [Smith            ]  │           │
│  └──────────────────────┘  └──────────────────────┘           │
│                                                                  │
│  ┌───────────────────────────────────────────────────────┐      │
│  │ Email address *                                        │      │
│  │ [john@acme.com                                      ] │      │
│  │ We'll send a confirmation to this address              │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ Action bar                                                       │
│                                          [Cancel]  [Save]       │
└─────────────────────────────────────────────────────────────────┘
```

| Part | Components used |
|---|---|
| Section title | Heading (`heading.md`) |
| Field | Input, Select, DatePicker, Checkbox |
| Label | from Input |
| Helper text | from Input |
| Error message | from Input |
| Action bar | Button group |

---

## Form layouts

### Single-column form

Most forms. Fields stack vertically.

```
Field 1
Field 2
Field 3
[Action bar]
```

- Best for: short forms (1–10 fields), mobile, simple workflows.
- Max content width: 640px centered.

### Two-column form

Use for forms with many fields where column pairing makes sense.

```
┌─────────────────┐  ┌─────────────────┐
│ Field 1         │  │ Field 2         │
├─────────────────┤  ├─────────────────┤
│ Field 3         │  │ Field 4         │
├─────────────────┤  ├─────────────────┤
│ Field 5 (full)  │  │                 │
└─────────────────┘  └─────────────────┘
[Action bar]
```

- Full-width fields span both columns.
- Use for: address forms, entity details, contact info.
- Break to single column on mobile (`< md`).
- 2-column grid gap: `spacing.4` (16px).

### Sectioned form

For long forms that cover distinct concerns.

```
Section 1: Basic Information
  Field 1
  Field 2

Section 2: Contact Details
  Field 3
  Field 4

Section 3: Billing
  Field 5

[Action bar]
```

- Each section: `spacing.8` (32px) gap from next section.
- Section title: `heading.sm` (16px, semibold).
- Section title: `spacing.6` (24px) above.
- Use for: wizard-like flows on one page, entity creation forms.

### Inline form

For compact, single-row entry.

```
┌─────────────────┐  ┌─────────┐
│ Email           │  │ [Invite]│
└─────────────────┘  └─────────┘
```

- Use for: add-to-list patterns (invite user, add tag).
- Field + action on same row.
- Field gap: `spacing.2` (8px).
- Mobile: stack vertically.

### Search / filter form

See [`data-display.md`](data-display.md) for toolbar patterns. Filter forms typically use 1–3 fields in a horizontal layout.

---

## Validation

### Timing

| Event | Behavior |
|---|---|
| On field focus | No validation |
| On blur | Show error if invalid |
| On change (after error) | Re-validate, clear error if valid |
| On submit | Validate all fields, show all errors |

### Required indicator

- Show `*` on the label for required fields.
- Connect via `aria-required="true"`.
- Never use the word "required" in the label.

### Field-level error

```
┌─────────────────────────────────┐
│ Email address *                 │
│ [john@                ]         │
│ ⚠ Enter a valid email address  │
└─────────────────────────────────┘
```

- Error icon (16px, `color.status.error.icon`).
- Error message in `color.status.error.text`.
- Error message replaces helper text (don't stack).
- Use `aria-invalid="true"` and `aria-describedby` pointing to error.

### Form-level error

When submit fails due to a backend error:

```
┌─────────────────────────────────────────────────────┐
│ ⚠ Some fields have errors. Please review below.    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [field errors listed]                              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Display at the top of the form body.
- Use `role="alert"` or `aria-live="polite"`.
- Scroll to first error field.

### Backend validation

- Backend returns field-level errors keyed by field name.
- Map backend errors to the correct field.
- Show server errors that aren't field-mappable as form-level errors.

---

## Form actions

### Hierarchy

```
[Cancel]                    [Save draft]  [Save]
```

| Action | Variant | When to show |
|---|---|---|
| Cancel | `secondary` | Always |
| Save draft | `tertiary` | When draft is meaningful |
| Save / Submit | `primary` | Always |

### Order

- Secondary actions (Cancel, Save Draft) on the **left**.
- Primary action (Save, Submit) on the **right**.
- Cancel is always the leftmost secondary.

### Action bar behavior

- Sticky at bottom of viewport when form scrolls.
- `position: sticky; bottom: 0;` with white bg + `shadow.sm`.
- On mobile: stack vertically (Cancel full width, Save full width).
- Loading state: disable all buttons, show spinner on primary.

---

## Unsaved changes

When user navigates away with unsaved changes:

1. Intercept navigation.
2. Show confirmation: "You have unsaved changes."
3. Options: "Discard changes" (destructive), "Keep editing".

Implementation:
- Track `isDirty` state.
- On route change / modal close: show confirmation if `isDirty`.
- Don't show for read-only views.

---

## Read-only mode

Display values without edit controls:

```
Company name    ACME Corporation
Industry        Manufacturing
Status          ● Active
Revenue         $12.4M
```

- Use Description list pattern (see [`data-display.md`](data-display.md)).
- Show "Edit" button in page header.
- "Edit" transitions to edit mode.

---

## Edit mode

Full form with existing values pre-filled.

- Show "Cancel" + "Save" in action bar.
- Track unsaved changes.

---

## Approval mode

For approval workflows (approve / reject):

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Review details below.                             │
│                                                     │
│  Requested by: John Smith                          │
│  Amount: $12,340.00                                │
│  Submitted: 15 Sep 2026                           │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌────────────────┐  [Reject]  [Approve]          │
│  │                │                                 │
│  └────────────────┘                                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Form fields are read-only.
- Approval actions: primary (Approve) + destructive (Reject).
- Optional: comment field before approve/reject.

---

## Width recommendation

| Field type | Width |
|---|---|
| Single short value (code, ID) | 200px |
| Name, email | 320px |
| URL, description | fullWidth |
| Date | 200px |
| Currency (amount only) | 160px |
| Currency (with symbol) | 200px |
| Phone | 200px |

---

## Long forms

For forms with 15+ fields:

1. **Section the form** into logical groups.
2. **Use sticky action bar** so Save is always visible.
3. **Show progress** if sections are sequential (step indicator).
4. **Don't** use a multi-step modal — use a dedicated page or wizard.

---

## Do

- ✅ Validate on blur, revalidate on change.
- ✅ Show specific, actionable error messages.
- ✅ Show required `*` on label + `aria-required`.
- ✅ Sticky action bar for long forms.
- ✅ Handle unsaved changes on navigation.
- ✅ Section long forms into logical groups.

## Don't

- ❌ Don't validate on first focus.
- ❌ Don't show generic errors like "Invalid input".
- ❌ Don't use placeholder as a label.
- ❌ Don't disable the browser's autofill / password manager.
- ❌ Don't make the user retype data that's already in the system.

---

## Related

- Input component: [`../components/Input.md`](../components/Input.md)
- Select component: [`../components/Select.md`](../components/Select.md)
- Button component: [`../components/Button.md`](../components/Button.md)
- Feedback patterns: [`feedback.md`](feedback.md)
- Templates: [`../templates/form-page.md`](../templates/form-page.md), [`../templates/detail-page.md`](../templates/detail-page.md)
