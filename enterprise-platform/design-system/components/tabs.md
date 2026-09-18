# Tabs

Tabs switch between related content sections within the same page context.

---

## Purpose

Organize related content into multiple sub-sections that share the same context. Each tab is mutually exclusive.

**Use when:**
- 2–6 related sub-sections of the same entity.
- User switches between views of the same data (Overview / Details / Activity).
- Content is parallel in importance.

**Not for:**
- Sequential steps (use Steps / Wizard).
- Primary navigation (use Sidebar).
- > 6 tabs (use Sidebar or split into pages).

---

## Anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│ Overview | Details | Activity | Settings                         │
│ ─────────                                                        │
│                                                                  │
│ [Content of selected tab]                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

| Part | Required | Notes |
|---|---|---|
| Tab list | Yes | Horizontal list of tab labels |
| Tab | Yes | Label + optional badge |
| Active indicator | Yes | 2px bottom border on active tab |
| Tab panel | Yes | Content for active tab |
| Tab badge | No | Count or status indicator |

---

## Variants

| Variant | Use case | Visual |
|---|---|---|
| `line` (default) | Page tabs, content switching | Underline on active |
| `pill` | Filter chips, secondary navigation | Rounded pill background |
| `card` | When tabs are equal weight to content | Card-style with background |
| `vertical` | Side navigation within content | Stacked on left |

Default: `line`.

### Line variant (page tabs)

```
Tab Label   Tab Label (active)   Tab Label
            ────────────
```

- Active: 2px bottom border, `color.brand.600`.
- Hover: text darkens to `color.text.primary`.

### Pill variant

```
[ Tab 1 ]  [ Tab 2 (active) ]  [ Tab 3 ]
```

- Active: `color.bg.brand`, white text.
- Inactive: transparent, `color.text.secondary`.

---

## Sizes

| Size | Tab height | Padding X | Font |
|---|---|---|---|
| `sm` | 32px | `spacing.3` | `font.size.body.sm` |
| `md` | 40px | `spacing.4` | `font.size.body.md` |
| `lg` | 48px | `spacing.5` | `font.size.body.lg` |

Default: `md`.

---

## States

| State | Visual |
|---|---|
| `default` | `color.text.secondary` |
| `hover` | `color.text.primary` |
| `active` | `color.text.primary` + 2px `color.brand.600` border (line) or `color.bg.brand` (pill) |
| `focus` | 2px focus ring around tab |
| `disabled` | `color.text.disabled`, `cursor: not-allowed` |

---

## Props / conceptual API

```text
variant:        "line" | "pill" | "card" | "vertical"
size:           "sm" | "md" | "lg"
activeKey:      string
defaultActiveKey: string
items:          TabItem[]
onChange:       (key: string) => void
align:          "start" | "center" | "end"
fullWidth:      boolean                // each tab fills available space
aria-label:     string                 // for the tab list

TabItem {
  key:        string
  label:      string
  badge?:     number | string         // count or status
  disabled?:  boolean
  icon?:      IconName
  content:    ReactNode | null        // null = lazy load
}
```

---

## Behavior

### Switching

- Click tab → switch panel.
- Click already-active tab → no-op (unless lazy-loaded).
- Keyboard: `←` / `→` to navigate, `Enter` / `Space` to activate.

### Lazy loading

- Panels not visited are not rendered.
- First render: only active tab renders.
- When switching to a new tab, render that tab's content.
- Show skeleton briefly on first activation.

### URL sync (optional)

- Tab can be reflected in URL: `?tab=activity`.
- Reload preserves active tab.

---

## Keyboard interaction

| Key | Action |
|---|---|
| `Tab` | Move to tab list |
| `←` / `→` | Navigate between tabs |
| `Home` / `End` | First / last tab |
| `Enter` / `Space` | Activate focused tab |

- Tab list has `role="tablist"`.
- Each tab has `role="tab"`, `aria-selected="true" | false"`, `aria-controls`.
- Tab panel has `role="tabpanel"`, `aria-labelledby`.

---

## Accessibility

- Tab list: `role="tablist"`, `aria-label="Section tabs"`.
- Tab: `role="tab"`, `aria-selected="true"` (active) / `"false"` (inactive).
- Panel: `role="tabpanel"`, `aria-labelledby={tabId}`.
- Disabled tabs have `aria-disabled="true"`.
- Focus moves to active tab on activation (or stays depending on convention).
- Tab order matches visual order.

---

## Responsive behavior

| Breakpoint | Behavior |
|---|---|
| `≥ md` | Horizontal tabs as designed |
| `< md` | Tabs scroll horizontally OR become a Select dropdown if > 4 tabs |

### Mobile strategy

If tabs > 4 and would scroll: convert to a Select dropdown on mobile.

```
[Overview ▼] (mobile: Select)
[Details]
[Activity]
[Settings]
```

---

## Content guidelines

### Labels

- Short: 1–2 words.
- Sentence case: "Activity log", not "Activity Log".
- Same format across tabs.

### Badges

- Show count of items in tab: "Activity (5)".
- Or as separate badge: "Activity [5]".
- Use semantic color when count indicates action needed.

---

## Do

- ✅ Limit to 2–6 tabs.
- ✅ Make tab labels short and parallel (same part of speech).
- ✅ Sync tab with URL when possible.
- ✅ Lazy-load content for inactive tabs.
- ✅ Keep tab order stable.

## Don't

- ❌ Don't use tabs for sequential workflows (use Steps).
- ❌ Don't use > 6 tabs.
- ❌ Don't mix tab labels with different lengths.
- ❌ Don't put tabs in a modal if you can avoid it.
- ❌ Don't make tabs disappear / reappear based on state.

---

## Related

- Navigation pattern: [`../patterns/navigation.md`](../patterns/navigation.md)
- Detail page template: [`../templates/detail-page.md`](../templates/detail-page.md)
