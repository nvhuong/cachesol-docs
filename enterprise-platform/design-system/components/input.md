# Input

The text input is the most-used form control. It must be efficient to scan, easy to fill, and never lose the user's typed value.

---

## Purpose

Capture free-form text from the user. Single line of input.

---

## When to use

- Short, single-line text (name, email, code, search).
- Number, password, email, URL — single value at a time.

## When not to use

- Multi-line text → Textarea.
- Predefined options → Select.
- Boolean → Checkbox or Switch.
- Date/time → Date Picker.

---

## Anatomy

```
Label                       [Required]
┌──────────────────────────────────────┐
│ [prefix]  Input value      [suffix] │
└──────────────────────────────────────┘
Helper text or error message
                       Character counter
```

| Part | Required | Notes |
|---|---|---|
| Label | Yes | Always — never placeholder-only |
| Required indicator | Conditional | Asterisk `*` if field is required |
| Input | Yes | The editable element |
| Prefix | No | Icon or unit (e.g. `$`, `🔍`) |
| Suffix | No | Icon (clear, eye for password) |
| Helper text | No | Explains expected format |
| Error message | Conditional | Replaces helper when invalid |
| Character counter | Conditional | When `maxLength` is set |

---

## Variants

| Variant | Use case |
|---|---|
| `default` | Standard text input |
| `search` | Has search icon and clear button |
| `password` | Has show/hide toggle |
| `number` | Numeric with optional steppers |

All variants share the same anatomy and sizing.

---

## Sizes

| Size | Height | Padding X | Padding Y | Font |
|---|---|---|---|---|
| `sm` | 32px | `spacing.3` (12px) | `spacing.1.5` (6px) | `font.size.body.sm` (13px) |
| `md` | 40px | `spacing.3` (12px) | `spacing.2` (8px) | `font.size.body.md` (14px) |
| `lg` | 48px | `spacing.4` (16px) | `spacing.3` (12px) | `font.size.body.lg` (16px) |

Default size: `md`.

Common properties:
- Border radius: `radius.md` (6px)
- Border: 1px solid `color.border.default`
- Background: `color.bg.surface`
- Focus ring: 2px `color.border.focus` with 2px offset, paired with `color.border.focus` border

---

## States

| State | Border | Background | Notes |
|---|---|---|---|
| `default` | `color.border.default` | `color.bg.surface` | Resting |
| `hover` | `color.border.strong` | `color.bg.surface` | Mouse over |
| `focus` | `color.border.focus` (2px) | `color.bg.surface` | Focus ring outside border |
| `filled` | `color.border.default` | `color.bg.surface` | Has value |
| `disabled` | `color.border.default` | `color.bg.disabled` | 50% opacity, `not-allowed` cursor |
| `readonly` | `color.border.default` | `color.bg.subtle` | Not editable, focusable |
| `error` | `color.border.error` | `color.bg.surface` | Pair with error icon and message |
| `success` | `color.status.success.border` | `color.bg.surface` | Optional, used sparingly |

### Placeholder

```css
color: color.text.tertiary;     /* neutral.500 */
font-style: normal;
opacity: 1;
```

**Rule:** Placeholder is a hint, not a label. Never replace the label with a placeholder.

---

## Props / conceptual API

```text
size:           "sm" | "md" | "lg"
variant:        "default" | "search" | "password" | "number"
type:           "text" | "email" | "password" | "number" | "tel" | "url" | "search"
value:          string
defaultValue:   string
placeholder:    string                  // hint only, never label
disabled:       boolean
readonly:       boolean
required:       boolean
error:          boolean                 // drives error styling + message
helperText:     string | null
maxLength:      number | null
prefix:         IconName | string | null
suffix:         IconName | string | null
onChange:       (value: string) => void
onBlur:         () => void
onFocus:        () => void
aria-label:     string | null           // use only if no visible label
aria-describedby: string | null         // points to helper / error message
```

---

## Behavior

### Validation timing

- **On blur** — show error after the user has finished with the field.
- **On change after error** — revalidate as they type (clear error if now valid).
- **Never on first focus** — don't yell at users before they've typed.

### Error display

- Replace helper text with error message in `color.status.error.text`.
- Pair with error icon (16px) at the start of the message.
- Keep messages short and actionable: "Email is required", "Must be at least 8 characters".

### Character counter

Show below the input, right-aligned:
- `12 / 100` — current / max
- Turns to `color.status.warning.text` when ≥ 80% of max.
- Turns to `color.status.error.text` when at max (input blocked).

### Password show/hide

- Eye icon on the right.
- Clicking toggles `type="password"` ↔ `type="text"`.
- Icon has `aria-label="Show password"` / `"Hide password"`.
- Don't disable paste. Don't auto-clear on submit.

---

## Keyboard interaction

| Key | Action |
|---|---|
| `Tab` / `Shift+Tab` | Move focus to / from input |
| `Enter` | (Inside `<form>`) submit form |
| `Escape` | (Search variant) clear value, blur |
| `↑` / `↓` | (Number variant) step value |
| `Cmd/Ctrl+A` | Select all (default) |

---

## Accessibility

- Always have a visible label, OR `aria-label` / `aria-labelledby` when no visible label.
- Required state communicated via `aria-required="true"` AND visible `*`.
- Error communicated via `aria-invalid="true"` AND visible message AND `aria-describedby` pointing to the message.
- Helper text connected via `aria-describedby`.
- Disabled uses `aria-disabled="true"` (and `disabled` HTML attribute).
- Don't disable paste, autofill, or spell-check by default.

---

## Responsive behavior

- On mobile (`< md`), default to `md` size. Inputs remain `fullWidth`.
- Date inputs trigger native pickers on mobile automatically.
- Number inputs use `inputmode="numeric"` to show numeric keyboard.

---

## Content guidelines

### Labels

- Use sentence case: "Email address", not "Email Address".
- Keep labels short — 1–3 words.
- Don't end labels with a colon.
- Don't use the same label twice in one form (add context if needed).

### Placeholder

- Use to show example format: `e.g. ACME-2026-001`.
- Don't use for required indicators.
- Don't repeat the label.

### Helper text

- One short sentence max.
- Specify format when important: "We'll send a code to this email".

### Error messages

- **What happened?** State the problem.
- **Why?** Be specific.
- **What to do?** Suggest a fix.

| Bad | Good |
|---|---|
| "Invalid input" | "Email must include @" |
| "Required" | "Company name is required" |
| "Error" | "Password must be at least 8 characters" |

---

## Width recommendation

| Width | Use for |
|---|---|
| `200px` (short) | Codes, abbreviations, single short values |
| `320px` (medium) | Names, emails, single-line addresses |
| `fullWidth` (long) | URLs, descriptions, when uncertain |

---

## Do

- ✅ Always have a visible label.
- ✅ Show required state with both visual `*` and `aria-required`.
- ✅ Validate on blur, revalidate on change.
- ✅ Use `helperText` to clarify expected format.
- ✅ Connect error message via `aria-describedby`.

## Don't

- ❌ Don't replace label with placeholder.
- ❌ Don't use placeholder as a label or hint for required state.
- ❌ Don't validate on first focus (before user has typed).
- ❌ Don't disable paste or autofill.
- ❌ Don't rely on color alone for error state — pair with icon + text.

---

## Examples

### Basic

```html
<label for="email">Email</label>
<input id="email" type="email" placeholder="you@company.com" />
```

### Required with helper

```html
<label for="tax-code">
  Tax code
  <span aria-hidden="true">*</span>
</label>
<input id="tax-code" required aria-required="true" aria-describedby="tax-hint" />
<div id="tax-hint">10-digit code issued by tax authority</div>
```

### With error

```html
<label for="email">Email</label>
<input id="email" type="email" aria-invalid="true" aria-describedby="email-err" />
<div id="email-err" role="alert">
  ⚠ Enter a valid email address
</div>
```

### Search

```html
<label for="search" class="visually-hidden">Search</label>
<div class="input-search">
  <svg class="icon-md" aria-hidden="true">🔍</svg>
  <input id="search" type="search" placeholder="Search customers…" />
  <button aria-label="Clear">✕</button>
</div>
```

### Password

```html
<label for="password">Password</label>
<div class="input-password">
  <input id="password" type="password" />
  <button aria-label="Show password">👁</button>
</div>
```

---

## Related

- Tokens: [`../tokens/colors.md`](../tokens/colors.md), [`../tokens/spacing.md`](../tokens/spacing.md)
- Button (form submit): [`Button.md`](Button.md)
- Select (predefined options): [`Select.md`](Select.md)
- Form patterns: [`../patterns/forms.md`](../patterns/forms.md)
- Validation pattern: [`../patterns/feedback.md`](../patterns/feedback.md)
