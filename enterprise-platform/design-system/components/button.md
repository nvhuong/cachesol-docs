# Button

The button is the primary trigger of action. It must look clickable, communicate hierarchy, and behave consistently.

---

## Purpose

Trigger an immediate action. Communicate that an action is available and what happens when activated.

---

## When to use

- Trigger a primary action on a page (e.g. "Create customer", "Approve", "Save").
- Submit a form.
- Navigate to the next step in a workflow.

## When not to use

- For navigation only (use Link instead).
- For toggle state (use Switch or Checkbox).
- To display status (use Badge).

---

## Anatomy

```
┌────────────────────────────────┐
│  [icon]   Label text   [icon]  │
└────────────────────────────────┘
```

| Part | Required | Notes |
|---|---|---|
| Label | Yes | Always present, always meaningful verb |
| Leading icon | No | Reinforces action ("Save" + 💾) |
| Trailing icon | No | Usually `→` for "Continue" or `⌄` for dropdown |
| Icon-only button | No | Must have `aria-label` + tooltip |

---

## Variants

| Variant | Use case | Visual |
|---|---|---|
| `primary` | One per region — the main CTA | Solid `brand.600`, white text |
| `secondary` | Supporting actions next to primary | Light bg, dark text |
| `tertiary` | Low-emphasis actions | Transparent bg, brand color text |
| `ghost` | Inline actions, toolbar | Transparent → hover shows neutral.100 |
| `destructive` | Dangerous actions | Solid `error.600`, white text |
| `link` | Inline link-style action | Brand color, underline on hover |

### Hierarchy rules

- **One primary button per region.** Don't compete.
- Secondary buttons sit next to primary as alternatives (e.g. "Cancel" + "Save").
- Tertiary buttons are for less important actions below the fold.
- Destructive is reserved for actions that are hard to reverse.

---

## Sizes

| Size | Height | Horizontal padding | Icon size | Font |
|---|---|---|---|---|
| `sm` | 32px | `spacing.3` (12px) | 16px | `font.size.body.sm` (13px) |
| `md` | 40px | `spacing.4` (16px) | 16px | `font.size.label.md` (14px) |
| `lg` | 48px | `spacing.5` (20px) | 20px | `font.size.label.md` (14px) |

Common properties:
- Border radius: `radius.lg` (8px)
- Font weight: `font.weight.semibold` (600)
- Gap between icon and label: `spacing.2` (8px)

---

## States

| State | Visual change | Implementation |
|---|---|---|
| `default` | Base styling | Per variant |
| `hover` | Darker background | `motion.duration.fast` (100ms) |
| `focus` | Focus ring (2px solid `color.border.focus` + 2px offset) | Visible only via keyboard |
| `focus-visible` | Same as focus, modern browsers | Same |
| `active` | Even darker / pressed look | `motion.duration.fast` |
| `disabled` | 50% opacity + `cursor: not-allowed` | Not `pointer-events: none` (need hover/focus for tooltip) |
| `loading` | Spinner replaces icon, label remains, button non-clickable | `aria-busy="true"` |
| `error` (rare, e.g. submit failed) | Brief shake animation + error color border | Resets after delay |

### Disabled state rules

- Opacity: 0.5
- Cursor: `not-allowed`
- DO NOT use `pointer-events: none` (breaks tooltip showing why disabled)
- Pair with `aria-disabled="true"` for screen readers

---

## Props / conceptual API

```text
variant:        "primary" | "secondary" | "tertiary" | "ghost" | "destructive" | "link"
size:           "sm" | "md" | "lg"
disabled:       boolean
loading:        boolean
fullWidth:      boolean
iconLeading:    IconName | null
iconTrailing:   IconName | null
iconOnly:       IconName | null    // mutually exclusive with text
type:           "button" | "submit" | "reset"
aria-label:     string             // required when iconOnly
aria-describedby: string | null
onClick:        () => void
```

---

## Behavior

- **Click** triggers `onClick`. If `disabled` or `loading`, no-op.
- **Loading** shows spinner, retains width (no layout shift), repeats no-ops on click.
- **Enter/Space** activate when focused (default `<button>` behavior).
- **Form submit** triggers when `type="submit"` and inside `<form>`. Loading state engages from form submission.

---

## Keyboard interaction

| Key | Action |
|---|---|
| `Tab` / `Shift+Tab` | Move focus to / from button |
| `Enter` | Activate (when not `disabled`) |
| `Space` | Activate (when not `disabled`) |

Disabled buttons are skipped in tab order by default; if you want them focusable for tooltips, use `aria-disabled="true"` instead of `disabled`.

---

## Accessibility

- Always have a meaningful accessible name (text content or `aria-label`).
- Icon-only buttons **must** have `aria-label` + tooltip showing same text.
- Disabled state uses `aria-disabled="true"` and visual non-color signal.
- Loading state uses `aria-busy="true"`; live region announces "Loading…".
- Don't put a `<button>` inside an `<a>` or vice versa.

---

## Responsive behavior

| Breakpoint | Recommendation |
|---|---|
| `< md` | `fullWidth` is recommended for primary actions in modals or sheets. Keep `md` size. |
| `md`+ | Default — use `md` size, `fullWidth: false`. |
| Dense lists | Use `sm` size. |

### Mobile considerations

- Minimum touch target: 44×44 px. `sm` button (32px) wraps in a clickable area extending to 44px on touch.
- On small screens, prefer a single primary CTA per view.
- Avoid icon-only buttons without text below 768px (low discoverability).

---

## Content guidelines

### Labels

- **Use verbs.** "Save", "Create", "Approve", "Reject".
- **Be specific.** "Approve invoice" beats "Submit".
- **Sentence case.** Don't use Title Case or ALL CAPS for button text.
- **Avoid:** "OK", "Yes", "No", "Cancel" alone — make labels descriptive where space allows.

### Icon pairing

- Icon must match label meaning (don't add random decoration).
- Same icon = same meaning across the product.
- If in doubt, no icon is better than a wrong icon.

---

## Do

- ✅ Use **one primary button** per region. Hierarchy > decoration.
- ✅ Use verb labels: "Save changes", "Create customer", "Approve".
- ✅ Pair destructive label with destructive variant.
- ✅ Show loading state on async actions.
- ✅ Use `fullWidth` for primary buttons inside modals on mobile.

## Don't

- ❌ Don't use more than one primary button in the same visible area.
- ❌ Don't use generic labels: "Submit", "OK", "Click here".
- ❌ Don't disable a button without explanation (use tooltip or helper text).
- ❌ Don't use uppercase for button text.
- ❌ Don't use `pointer-events: none` on disabled (breaks accessibility).
- ❌ Don't make icon-only buttons without `aria-label`.

---

## Examples

### Primary CTA

```html
<button class="btn btn-primary btn-md">
  Create customer
</button>
```

### Secondary + Primary pair

```html
<div class="btn-group">
  <button class="btn btn-secondary btn-md">Cancel</button>
  <button class="btn btn-primary btn-md">Save</button>
</div>
```

### With leading icon

```html
<button class="btn btn-primary btn-md">
  <svg class="icon-md" aria-hidden="true">...</svg>
  Save draft
</button>
```

### Destructive confirmation

```html
<button class="btn btn-destructive btn-md">
  <svg class="icon-md" aria-hidden="true">...</svg>
  Delete customer
</button>
```

### Loading state

```html
<button class="btn btn-primary btn-md" aria-busy="true">
  <svg class="spinner icon-md" aria-hidden="true">...</svg>
  Saving…
</button>
```

### Icon-only

```html
<button class="btn btn-ghost btn-md btn-icon" aria-label="Edit">
  <svg class="icon-md" aria-hidden="true">...</svg>
</button>
```

---

## Related

- Color tokens: [`../tokens/colors.md`](../tokens/colors.md)
- Typography: [`../tokens/typography.md`](../tokens/typography.md)
- Spacing: [`../tokens/spacing.md`](../tokens/spacing.md)
- Input field (next to buttons): [`Input.md`](Input.md)
- Form actions pattern: [`../patterns/forms.md`](../patterns/forms.md)
- Confirmation pattern: [`../patterns/feedback.md`](../patterns/feedback.md)
