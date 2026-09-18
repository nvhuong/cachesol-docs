# Select

Select allows the user to choose from a predefined list of options. For single values, searchable lists, or multi-value selection.

---

## Purpose

Choose one or more options from a list. When the list is known, finite, and not too long.

---

## When to use

- Single selection from 2–50 known options.
- Multi-select when multiple values are allowed.
- Searchable select when the list is long (> 20 items).
- Async select when options come from an API.

## When not to use

- Fewer than 3 options — consider Radio buttons.
- Text input with autocomplete — use Input with datalist or custom combobox.
- Date selection — use Date Picker.
- Time selection — use Time Picker.
- Complex multi-level navigation — use Tree view.

---

## Variants

| Variant | Use case | API |
|---|---|---|
| `single` | Choose one option | `value: string`, `onChange(value)` |
| `multi` | Choose multiple options | `value: string[]`, `onChange(values[])` |
| `searchable` | List > 10 items, user needs to filter | `search(query)`, `options[]` |
| `async` | Options loaded from API | `loadOptions(query): Promise<Option[]>` |

---

## Anatomy

### Closed state (single select)

```
┌──────────────────────────────────────────────────┐
│ Selected label                        [chevron ↓] │
└──────────────────────────────────────────────────┘
```

### Open state (dropdown)

```
┌──────────────────────────────────────────────────┐
│ 🔍 Search options…                               │  ← searchable only
├──────────────────────────────────────────────────┤
│ ○ Option 1                                        │
│ ● Option 2 (selected)                    ✓        │  ← checkmark for selected
│ ○ Option 3                                        │
│ ○ Option 4                                        │
├──────────────────────────────────────────────────┤
│    No results found                               │  ← empty state
└──────────────────────────────────────────────────┘
```

| Part | Required | Notes |
|---|---|---|
| Trigger | Yes | Shows selected value or placeholder |
| Chevron | Yes | 16px, rotates on open |
| Search input | Conditional | Searchable / async variants |
| Option list | Yes | Scrollable when > 7 items |
| Option | Yes | Label + optional description |
| Checkbox | Conditional | Multi-select shows checkbox |
| Empty state | Yes | When no options match |
| Loading indicator | Conditional | Async loading state |
| Footer | No | e.g. "Add new" action |

---

## Sizes

Same sizing as Input. Default: `md`.

| Size | Height | Font |
|---|---|---|
| `sm` | 32px | `font.size.body.sm` (13px) |
| `md` | 40px | `font.size.body.md` (14px) |
| `lg` | 48px | `font.size.body.lg` (16px) |

Styling inherits from Input:
- Border radius: `radius.md` (6px)
- Border: 1px solid `color.border.default`
- Padding: matches Input sizes

---

## States

| State | Visual change |
|---|---|
| `default` | Closed, shows placeholder or selected value |
| `hover` | Border darkens to `color.border.strong` |
| `focus` | Border + focus ring (`color.border.focus`) |
| `open` | Border + focus ring, dropdown visible below |
| `disabled` | 50% opacity, `not-allowed` cursor |
| `loading` | Spinner replaces chevron |
| `error` | `color.border.error`, error message shown |
| `readonly` | Shows value, chevron hidden, not editable |

### Option states

| Option state | Visual |
|---|---|
| `default` | Normal text |
| `hover` | `color.bg.subtle` |
| `selected` | Checkmark + `color.text.primary` |
| `disabled` | `color.text.disabled`, `not-allowed` cursor |
| `focused` | `color.bg.selected` (keyboard navigation) |

---

## Props / conceptual API

```text
variant:        "single" | "multi" | "searchable" | "async"
size:           "sm" | "md" | "lg"
options:        Option[]
value:          string | string[]
placeholder:    string
disabled:       boolean
error:          boolean
helperText:     string | null
required:       boolean
searchable:     boolean
loadOptions:    (query: string) => Promise<Option[]>   // async variant
onChange:       (value: string | string[]) => void
onSearch:       (query: string) => void               // searchable variant

Option {
  value:  string
  label:  string
  description?: string     // optional secondary text
  disabled?: boolean
  group?:  string         // optional group label
}

aria-label:     string | null
aria-describedby: string | null
```

---

## Behavior

### Dropdown behavior

- Opens on click or `Enter`/`Space` when focused.
- Closes on: outside click, `Escape`, selecting (single select).
- Multi-select closes on outside click or `Escape`, not on selection.
- Dropdown has `shadow.sm` + `radius.lg`.
- Max dropdown height: `320px` (scrollable).
- Dropdown aligns to the left edge of the trigger.
- On mobile, dropdown maxes out at viewport width minus `spacing.4`.

### Searchable select

- Debounce search: 300ms.
- On search, filter options locally (client-side) for ≤ 200 options.
- For > 200 options: use async variant with server-side search.
- Search clears on close.
- Pressing `Escape` clears search and closes.

### Async select

- Show spinner while loading.
- Cache recent queries (at least last 3).
- On error, show error message inside dropdown with retry option.
- Never leave the dropdown in a loading state indefinitely.

### Keyboard interaction

| Key | Action |
|---|---|
| `Tab` / `Shift+Tab` | Move focus to / from select |
| `Enter` / `Space` | Open dropdown (when closed); select focused option |
| `↑` / `↓` | Navigate options (when open) |
| `Escape` | Close, clear search |
| `Page Up` / `Page Down` | Jump 5 options |
| `Home` / `End` | First / last option |

---

## Multi-select behavior

- Selected values shown as tags inside the trigger.
- Each tag has an `×` remove button.
- `×` button has `aria-label="Remove {label}"`.
- Max tags shown before "+N more": 3. Remaining count: "+N more".
- Overflow wraps or scrolls within trigger.
- `aria-selected="true"` on selected options.
- Multi-select doesn't close on selection.

---

## Long lists (> 500 options)

Use server-side virtualization or pagination:

- Load first 100 options.
- Show "Load more" at bottom of dropdown.
- Or: warn that this field needs a different pattern (e.g. type-ahead API search).

---

## Accessibility

- Trigger has `aria-haspopup="listbox"` / `aria-expanded`.
- Options list has `role="listbox"`, `aria-label`.
- Each option has `role="option"`, `aria-selected` (single/multi) or `aria-checked` (checkbox variant).
- Multi-select uses `aria-multiselectable="true"`.
- Disabled options have `aria-disabled="true"`.
- Searchable input has `role="combobox"`, `aria-autocomplete="list"`.
- Empty state has `role="status"` or `aria-live="polite"`.

---

## Content guidelines

### Labels

Same rules as Input labels.

### Option labels

- Be specific. "Approved" beats "Active".
- Avoid very long labels — truncate with ellipsis.
- If using groups, group names should be broader categories.
- Show code/ID alongside label for technical fields: "John Smith (john@acme.com)".

---

## Do

- ✅ Use for 3–50 options. Below 3 → Radio. Above 50 → async searchable.
- ✅ Show placeholder when no value selected.
- ✅ Indicate required state with `aria-required` and visual `*`.
- ✅ Debounce search (300ms) to avoid excessive filtering calls.
- ✅ Show loading state for async variants.

## Don't

- ❌ Don't use for fewer than 3 options (use Radio).
- ❌ Don't show more than 7 options without scroll (use searchable).
- ❌ Don't use when user needs to type freeform (use Input).
- ❌ Don't leave async select in infinite loading.
- ❌ Don't show > 500 raw options (warn about server-side pattern).

---

## Examples

### Single select

```html
<label for="status">Status</label>
<div class="select" role="listbox" aria-label="Status">
  <div class="select-trigger" tabindex="0" role="option">
    Active
    <svg aria-hidden="true">▼</svg>
  </div>
  <div class="select-dropdown">
    <div class="select-option" role="option" aria-selected="false">Draft</div>
    <div class="select-option" role="option" aria-selected="true">Active ✓</div>
    <div class="select-option" role="option" aria-selected="false">Inactive</div>
  </div>
</div>
```

### Multi-select with tags

```html
<div class="select-trigger" aria-expanded="true">
  <div class="tag">
    Finance
    <button aria-label="Remove Finance">✕</button>
  </div>
  <div class="tag">
    Operations
    <button aria-label="Remove Operations">✕</button>
  </div>
  <span>+2 more</span>
  <svg aria-hidden="true">▼</svg>
</div>
```

### Searchable

```html
<div class="select-searchable">
  <input role="combobox" aria-autocomplete="list" aria-expanded="true" />
  <div class="select-dropdown" role="listbox">
    <div class="select-option" role="option">ACME Corporation</div>
    <div class="select-option" role="option">Globex Industries</div>
    <!-- filtered by search -->
  </div>
</div>
```

---

## Related

- Input (text entry): [`Input.md`](Input.md)
- Form patterns: [`../patterns/forms.md`](../patterns/forms.md)
- Data display (option labels): [`../patterns/data-display.md`](../patterns/data-display.md)
