# Spacing & Sizing

A consistent spatial system. Based on a **4px base unit**. Enterprise-appropriate: tight enough for density, generous enough for clarity.

---

## Base unit

```
1 unit = 4px
```

---

## Spacing scale

| Token | Value | px | Usage |
|---|---|---|---|
| `spacing.0` | 0 | 0 | Reset |
| `spacing.0.5` | 0.125rem | 2px | Hairline gap (rare) |
| `spacing.1` | 0.25rem | 4px | Icon-to-text gap inside button |
| `spacing.1.5` | 0.375rem | 6px | Tiny inline gap |
| `spacing.2` | 0.5rem | 8px | Tight stack gap |
| `spacing.3` | 0.75rem | 12px | Default stack gap |
| `spacing.4` | 1rem | 16px | Standard gap, form field vertical |
| `spacing.5` | 1.25rem | 20px | Comfortable stack |
| `spacing.6` | 1.5rem | 24px | Section spacing |
| `spacing.8` | 2rem | 32px | Card inner padding (lg) |
| `spacing.10` | 2.5rem | 40px | Section break |
| `spacing.12` | 3rem | 48px | Page section |
| `spacing.16` | 4rem | 64px | Major page break |
| `spacing.20` | 5rem | 80px | Hero spacing |
| `spacing.24` | 6rem | 96px | Maximum spacing |

**Rule:** All spacing must come from this scale. No `13px`, no `22px`.

---

## Component spacing

### Button

| Token | Size sm | Size md | Size lg |
|---|---|---|---|
| Padding (horizontal) | `spacing.3` (12px) | `spacing.4` (16px) | `spacing.5` (20px) |
| Padding (vertical) | `spacing.1.5` (6px) | `spacing.2` (8px) | `spacing.3` (12px) |
| Gap (icon to label) | `spacing.1.5` (6px) | `spacing.2` (8px) | `spacing.2` (8px) |
| Height | 32px | 40px | 48px |

### Input

| Token | Size sm | Size md | Size lg |
|---|---|---|---|
| Padding (horizontal) | `spacing.3` | `spacing.3` | `spacing.4` |
| Padding (vertical) | `spacing.1.5` | `spacing.2` | `spacing.3` |
| Height | 32px | 40px | 48px |
| Label gap | `spacing.1.5` | `spacing.1.5` | `spacing.2` |
| Helper gap | `spacing.1.5` | `spacing.1.5` | `spacing.2` |

### Card

| Token | Value |
|---|---|
| Padding (default) | `spacing.6` (24px) |
| Padding (compact) | `spacing.4` (16px) |
| Padding (lg) | `spacing.8` (32px) |

### Modal

| Token | Value |
|---|---|
| Padding (header) | `spacing.6` (24px) |
| Padding (body) | `spacing.6` (24px) |
| Padding (footer) | `spacing.4` horizontal, `spacing.3` vertical |
| Gap (header to body) | 0 — flush |
| Gap (body to footer) | 0 — flush |

---

## Layout spacing

### Page gutters

| Breakpoint | Horizontal padding |
|---|---|
| `<md` (< 768px) | `spacing.4` (16px) |
| `md`–`xl` (768–1279px) | `spacing.6` (24px) |
| `xl+` (≥ 1280px) | `spacing.8` (32px) |

### Section spacing

| Token | Value | Use |
|---|---|---|
| `layout.section.gap` | `spacing.6` (24px) | Between sections on a page |
| `layout.subsection.gap` | `spacing.4` (16px) | Between subsections within a section |
| `layout.group.gap` | `spacing.3` (12px) | Between related items in a group |

### Stack gap (vertical rhythm)

| Context | Gap |
|---|---|
| Form fields | `spacing.4` (16px) |
| Tight form (e.g. inline) | `spacing.3` (12px) |
| Card content | `spacing.4` (16px) |
| List items | `spacing.2` (8px) |
| List items (comfortable) | `spacing.3` (12px) |
| List items (compact) | `spacing.1` (4px) |
| Dashboard cards | `spacing.4`–`spacing.6` |

---

## Form spacing

| Element | Spacing |
|---|---|
| Form section gap (between sections) | `spacing.8` (32px) |
| Field gap within section | `spacing.4` (16px) |
| Label to input | `spacing.1.5` (6px) |
| Input to helper text | `spacing.1.5` (6px) |
| Input to error message | `spacing.1.5` (6px) |
| Field set padding | `spacing.6` (24px) |
| Required indicator gap | `spacing.1` (4px) |

---

## Table density spacing

| Density | Row height | Cell padding (X) | Cell padding (Y) |
|---|---|---|---|
| **Comfortable** | 56px | `spacing.4` (16px) | `spacing.3` (12px) |
| **Default** | 48px | `spacing.4` (16px) | `spacing.2` (8px) |
| **Compact** | 36px | `spacing.3` (12px) | `spacing.1` (4px) |

Header row matches body row height. Add `spacing.1` (4px) extra for sticky header separation.

---

## Border Radius

Modern but not playful. Enterprise-appropriate values.

| Token | Value | Usage |
|---|---|---|
| `radius.none` | 0px | Sharp corners, table cells |
| `radius.sm` | 4px | Subtle rounding, tags |
| `radius.md` | 6px | Default for inputs, small cards |
| `radius.lg` | 8px | **Default for buttons, cards, modals** |
| `radius.xl` | 12px | Large surfaces, hero cards |
| `radius.2xl` | 16px | Marketing surfaces (rare in enterprise) |
| `radius.full` | 9999px | Avatars, pills, circular elements |

### Recommended by component

| Component | Token | Value |
|---|---|---|
| Button | `radius.lg` | 8px |
| Input | `radius.md` | 6px |
| Card | `radius.lg` | 8px |
| Modal | `radius.lg` | 8px |
| Tag / Badge | `radius.sm` | 4px |
| Avatar | `radius.full` | 9999px |
| Dropdown menu | `radius.lg` | 8px |
| Tooltip | `radius.md` | 6px |
| Toast | `radius.lg` | 8px |

**Rule:** Don't go above `radius.xl` (12px) on enterprise components. Bigger radii feel consumer/playful.

### Border width

| Token | Value | Usage |
|---|---|---|
| `border.width.0` | 0 | Reset |
| `border.width.1` | 1px | Default border |
| `border.width.2` | 2px | Focus ring, emphasized |
| `border.width.3` | 3px | Strong emphasis (rare) |

---

## Sizing tokens

| Token | Value | Usage |
|---|---|---|
| `size.icon.xs` | 12px | Inline with caption text |
| `size.icon.sm` | 16px | Inline with body, table actions |
| `size.icon.md` | 20px | Form field icons, list-item icons |
| `size.icon.lg` | 24px | Standalone, sidebar nav, top-bar |
| `size.icon.xl` | 32px | Hero icons |

| Token | Value | Usage |
|---|---|---|
| `size.control.sm` | 32px | Compact buttons, small inputs |
| `size.control.md` | 40px | Default buttons, inputs |
| `size.control.lg` | 48px | Primary CTAs, large inputs |

| Token | Value | Usage |
|---|---|---|
| `size.avatar.sm` | 24px | Inline avatar (table row) |
| `size.avatar.md` | 32px | User menu, comments |
| `size.avatar.lg` | 40px | Profile header |
| `size.avatar.xl` | 64px | Profile page |

| Token | Value | Usage |
|---|---|---|
| `size.modal.sm` | 400px | Confirmations |
| `size.modal.md` | 560px | Standard forms |
| `size.modal.lg` | 720px | Detailed forms |
| `size.modal.xl` | 960px | Wide content |
| `size.modal.full` | 100vw / 100vh | Full-screen |

---

## Z-index scale

| Token | Value | Usage |
|---|---|---|
| `z.hide` | -1 | Visually hidden |
| `z.base` | 0 | Default stacking |
| `z.dropdown` | 1000 | Dropdowns, popovers |
| `z.sticky` | 1100 | Sticky header |
| `z.drawer` | 1200 | Side drawers |
| `z.modal.backdrop` | 1300 | Modal backdrop |
| `z.modal` | 1400 | Modal content |
| `z.toast` | 1500 | Toast notifications |
| `z.tooltip` | 1600 | Tooltips |

**Rule:** Don't introduce ad-hoc z-index values. Use the scale.

---

## Don't

- ❌ Don't use `13px`, `22px`, or any other arbitrary value.
- ❌ Don't use `border-radius: 50%` for rectangular things (use `radius.full` for circular only).
- ❌ Don't use radius above 12px on enterprise UI.
- ❌ Don't use `z-index: 9999` — use the scale.

---

## Related

- Color tokens: [`colors.md`](colors.md)
- Typography: [`typography.md`](typography.md)
- Shadows/elevation: [`shadows.md`](shadows.md)
- Components consume these: [`../components/README.md`](../components/README.md)
