# Form

The Form component is a **composition pattern** that organizes Input, Select, DatePicker, Checkbox, and Button into a cohesive data-entry experience with validation.

> **Note:** Form is not a primitive component but a **composition pattern**. See [`../patterns/forms.md`](../patterns/forms.md) for the full form pattern specification. This file documents the conceptual API for a Form container component.

---

## Purpose

Coordinate the behavior of multiple input fields: validation, submission, error display, and reset. Provide a single source of truth for form state.

---

## When to use

- 1+ input fields with related data.
- Validation rules (required, format, length, range).
- Coordinated submit / reset.
- Field-level and form-level errors.

## When not to use

- Single field with no validation → use Input directly.
- Pure display → use Description List.

---

## Anatomy

```
┌─────────────────────────────────────────────────────┐
│ Form-level error (when present)                      │
│ ⚠ Some fields have errors. Please review below.     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Field 1 Label                                      │
│  [____________________]                             │
│  helper text                                        │
│                                                     │
│  Field 2 Label *                                    │
│  [____________________]                             │
│  ⚠ Field 2 is required                              │
│                                                     │
│  ...                                                │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                  [Cancel]  [Save]   │
└─────────────────────────────────────────────────────┘
```

---

## Layout variants

| Layout | Use case |
|---|---|
| `vertical` (default) | Standard forms. Label above input. |
| `horizontal` | Compact forms with labels next to inputs. |
| `inline` | Single-row forms (search, filters). |

### Vertical (default)

```
Label
[input      ]
helper
```

### Horizontal

```
Label           [input      ]
helper
```

### Inline

```
[input]  [Select]  [Submit]
```

---

## Props / conceptual API

```text
layout:           "vertical" | "horizontal" | "inline"
initialValues:    Record<string, any>
values:           Record<string, any>           // controlled
onValuesChange:   (values: Record<string, any>, changed: string[]) => void
onSubmit:         (values: Record<string, any>) => void | Promise<void>
onReset:          () => void
validationSchema: ValidationSchema | null       // runtime validation
validateOn:       "submit" | "blur" | "change"   // default: ["blur", "submit"]
requiredMark:     boolean                        // show * for required
disabled:         boolean
loading:          boolean
size:             "sm" | "md" | "lg"
labelWidth:       string | null                  // for horizontal layout
aria-label:       string | null
```

---

## Validation

### When

| Event | Behavior |
|---|---|
| On field focus | No validation |
| On field blur | Validate that field |
| On change after error | Revalidate that field |
| On submit | Validate all fields |

### Schema

```text
ValidationSchema = {
  [fieldName]: {
    required?: boolean | string
    minLength?: { value: number, message: string }
    maxLength?: { value: number, message: string }
    pattern?:   { value: RegExp, message: string }
    custom?:    (value: any, formValues: any) => string | null
  }
}
```

### Field-level vs form-level errors

- **Field-level:** tied to a specific field, shown below the input.
- **Form-level:** not tied to any field (e.g. server returns generic error), shown at top.

---

## States

| State | Behavior |
|---|---|
| `pristine` | Initial state, no interaction yet |
| `dirty` | User has interacted, values differ from `initialValues` |
| `valid` | All values pass validation |
| `invalid` | At least one field has an error |
| `submitting` | Async submission in progress |
| `submitted` | Submission succeeded |
| `error` | Submission failed (form-level error) |

`pristine && valid` → submit button may be disabled.
`dirty && valid` → submit button enabled.

---

## Behavior

### Submit

1. Validate all fields.
2. If invalid: scroll to first error, focus first invalid field, show form-level error.
3. If valid: disable form, show loading, call `onSubmit`.
4. On success: navigate / toast.
5. On failure: re-enable form, show error.

### Reset

1. Set values back to `initialValues`.
2. Clear all errors.
3. Clear `dirty` state.

### Unsaved changes

- Track `dirty` state.
- On route change / modal close: show "unsaved changes" confirmation if dirty.

---

## Required indicator

- Required fields show `*` next to label.
- Pair with `aria-required="true"`.
- Hide `*` from screen readers: `aria-hidden="true"` on the asterisk.

---

## Accessibility

- `<form>` element with `aria-label` if no visible title.
- Each field group has `<label>` connected by `for`/`id`.
- Error message connected via `aria-describedby`.
- `aria-invalid="true"` on invalid inputs.
- Submit button has `type="submit"`.
- `aria-live="polite"` on form-level error region.
- Keyboard: Tab cycles through fields, Enter submits (when focus in input).

---

## Do

- ✅ Always have a visible label per field.
- ✅ Show specific, actionable error messages.
- ✅ Disable form while submitting.
- ✅ Scroll to first error on submit fail.
- ✅ Preserve user input on validation error.

## Don't

- ❌ Don't validate on first focus.
- ❌ Don't lose user input on error.
- ❌ Don't show generic error messages.
- ❌ Don't disable Enter to submit (users expect it).

---

## Related

- Forms pattern (full spec): [`../patterns/forms.md`](../patterns/forms.md)
- Input: [`input.md`](input.md)
- Select: [`select.md`](select.md)
- Button: [`button.md`](button.md)
- Form Page template: [`../templates/form-page.md`](../templates/form-page.md)
