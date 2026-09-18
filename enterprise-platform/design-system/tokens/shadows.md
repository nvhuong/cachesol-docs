# Shadows & Elevation

Elevation uses **borders first, then subtle shadows**. Don't lean on heavy shadows — they're a sign of poorly structured layout.

---

## Elevation hierarchy

```
shadow.none  → no elevation, default surface
shadow.xs    → barely lifted, table row hover
shadow.sm    → dropdown menu, popover
shadow.md    → sticky header, floating button
shadow.lg    → modal, drawer
shadow.xl    → dialog overlay (rare)
shadow.2xl   → reserved for marketing / hero
```

**Rule:** Try border + bg color first. Only escalate to shadow when you need the element to truly lift off the page (dropdowns, modals).

---

## Shadow tokens

| Token | Value (CSS) | Usage |
|---|---|---|
| `shadow.none` | `none` | Reset, default surface |
| `shadow.xs` | `0 1px 2px rgba(15, 23, 42, 0.05)` | Table row hover, very subtle lift |
| `shadow.sm` | `0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)` | Dropdown menu, popover, tooltip |
| `shadow.md` | `0 4px 8px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)` | Sticky header, floating action button, hover on card |
| `shadow.lg` | `0 12px 24px -8px rgba(15, 23, 42, 0.12), 0 4px 8px -2px rgba(15, 23, 42, 0.06)` | Modal, drawer, raised card on hover |
| `shadow.xl` | `0 24px 48px -12px rgba(15, 23, 42, 0.18), 0 8px 16px -4px rgba(15, 23, 42, 0.08)` | Reserved — large dialog, fullscreen modal |
| `shadow.2xl` | `0 32px 64px -16px rgba(15, 23, 42, 0.24)` | Hero surfaces, marketing |

### Inner shadow (inset)

| Token | Value | Usage |
|---|---|---|
| `shadow.inner.sm` | `inset 0 1px 2px rgba(15, 23, 42, 0.06)` | Input field (default) |
| `shadow.inner.focus` | `inset 0 0 0 1px color.border.focus` | Input focused — combines with focus ring |

---

## Color of shadow

All shadows use `rgba(15, 23, 42, ...)` — that's `color.neutral.900` with alpha. This keeps shadows subtle and consistent.

For tinted shadows on primary surfaces:

```css
shadow.glow.primary: 0 0 16px rgba(37, 99, 235, 0.24);
shadow.glow.error:   0 0 16px rgba(220, 38, 38, 0.20);
```

---

## When to use which elevation

| Surface | Elevation | Token |
|---|---|---|
| Page background | none | `shadow.none` |
| Card on page | border + `shadow.none` | border-only |
| Card on hover | `shadow.md` | `shadow.md` |
| Dropdown menu | `shadow.sm` | `shadow.sm` |
| Popover | `shadow.sm` | `shadow.sm` |
| Tooltip | `shadow.sm` | `shadow.sm` |
| Toast | `shadow.lg` | `shadow.lg` |
| Sticky header | `shadow.sm` (when scrolled) | `shadow.sm` |
| Modal | `shadow.lg` | `shadow.lg` |
| Drawer | `shadow.lg` | `shadow.lg` |
| Fullscreen modal | `shadow.xl` | `shadow.xl` |

---

## Sticky header pattern

Sticky headers don't always need a shadow. Use this rule:

```
Default state:        no shadow, only border-bottom
On scroll (scrolled): shadow.sm, keep border-bottom
```

This avoids visual noise on initial load while still creating separation when the user scrolls.

---

## Modal pattern

Modal = `shadow.lg` content + backdrop.

```
backdrop:        rgba(15, 23, 42, 0.5)  /* neutral.900 with 50% alpha */
modal content:   color.bg.surface + shadow.lg + radius.lg
```

---

## Don't

- ❌ Don't use `shadow.xl` or `shadow.2xl` for ordinary UI — they're reserved for hero/marketing.
- ❌ Don't mix shadow directions — always use top-down ambient shadow.
- ❌ Don't use colored shadows outside the `shadow.glow.*` tokens.
- ❌ Don't elevate every element — restraint signals quality.

---

## Reduced motion / accessibility

Shadows themselves don't move. But elements with shadows that animate (e.g. dropdowns opening) must respect `prefers-reduced-motion: reduce` — in that case, show/hide instantly instead of transitioning.

---

## Related

- Color tokens: [`colors.md`](colors.md)
- Spacing tokens: [`spacing.md`](spacing.md)
- Modal component: [`../components/Modal.md`](../components/Modal.md)
- Table component: [`../components/Table.md`](../components/Table.md)
