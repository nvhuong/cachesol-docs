# Border Radius

Modern but not playful. Enterprise-appropriate radius values. Restrained to maintain a professional look.

---

## Radius scale

| Token | Value | Usage |
|---|---|---|
| `radius.none` | 0px | Sharp corners, table cells |
| `radius.xs` | 2px | Tiny elements, inner checkboxes |
| `radius.sm` | 4px | Subtle rounding, tags |
| `radius.md` | 6px | **Default for inputs** |
| `radius.lg` | 8px | **Default for buttons, cards, modals** |
| `radius.xl` | 12px | Large surfaces, hero cards |
| `radius.2xl` | 16px | Marketing surfaces (rare in enterprise) |
| `radius.full` | 9999px | Avatars, pills, circular elements |

### Why these values?

| Value | Rationale |
|---|---|
| `radius.lg` (8px) | Default for interactive surfaces. Visible but not playful. |
| `radius.md` (6px) | Slightly tighter for inputs — gives subtle distinction from buttons. |
| `radius.xl` (12px) | Reserved for surfaces that need visual weight. |

**Enterprise rule:** Don't go above `radius.xl` (12px) on enterprise UI components. Bigger radii feel consumer/playful.

---

## Radius by component

| Component | Token | Value |
|---|---|---|
| Button (sm) | `radius.md` | 6px |
| Button (md) | `radius.lg` | 8px |
| Button (lg) | `radius.lg` | 8px |
| Input | `radius.md` | 6px |
| Select trigger | `radius.md` | 6px |
| Card | `radius.lg` | 8px |
| Modal | `radius.lg` | 8px |
| Drawer | `radius.lg` | 8px |
| Tag / Badge (square) | `radius.sm` | 4px |
| Tag / Badge (pill) | `radius.full` | 9999px |
| Avatar | `radius.full` | 9999px |
| Dropdown menu | `radius.lg` | 8px |
| Tooltip | `radius.md` | 6px |
| Toast | `radius.lg` | 8px |
| Checkbox | `radius.sm` | 4px |
| Switch | `radius.full` | 9999px |
| Tab (line) | none | 0 |
| Tab (pill) | `radius.full` | 9999px |
| Table cell | none | 0 |
| Hero / Marketing | `radius.xl` | 12px |

---

## Density and radius

| Density | Adjustment |
|---|---|
| Compact | Keep radius same; reduce padding |
| Default | Default radius |
| Comfortable | Keep radius same; increase padding |

**Rule:** Density never affects radius. Larger elements don't need larger radius.

---

## Border width

| Token | Value | Usage |
|---|---|---|
| `border.width.0` | 0 | Reset |
| `border.width.1` | 1px | Default border |
| `border.width.2` | 2px | Focus ring, emphasized |
| `border.width.3` | 3px | Strong emphasis (rare) |

---

## Pairing radius with border width

| Border width | Recommended radius |
|---|---|
| 0 (borderless) | none |
| 1px (default) | `radius.md` or `radius.lg` |
| 2px (focus ring) | Outside radius, 2px offset |
| 3px (strong) | `radius.lg` or `radius.xl` |

### Focus ring

```
Focus ring:  2px solid color.border.focus
Offset:      2px from element border
Border-radius: same as element + 2px (to wrap element cleanly)
```

```css
.button:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```

---

## Examples

### Pill button

```css
.btn-pill {
  border-radius: var(--radius-full);
  padding: 6px 16px;
}
```

### Card with subtle rounding

```css
.card {
  border-radius: var(--radius-lg); /* 8px */
  border: 1px solid var(--color-border-default);
  padding: 24px;
}
```

### Avatar

```css
.avatar {
  border-radius: var(--radius-full); /* 9999px */
  width: 40px;
  height: 40px;
}
```

---

## Don't

- ❌ Don't use radius > 12px on enterprise components.
- ❌ Don't mix different radii in a tight visual grouping.
- ❌ Don't use `border-radius: 50%` for non-circular elements.
- ❌ Don't change radius per density — only per component role.
- ❌ Don't use `radius.full` for buttons that aren't pills.

---

## Related

- Spacing tokens: [`spacing.md`](spacing.md)
- Color tokens (border colors): [`colors.md`](colors.md)
- Shadows (for elevated surfaces): [`shadows.md`](shadows.md)
- Component specs: [`../components/`](../components/)
