# Drawer

A Drawer is a side panel that slides in from the edge of the screen. It provides focused content while keeping the underlying page partially visible.

---

## Purpose

Show focused content in a side panel without losing context of the page behind it.

**Use when:**
- Showing detail or supporting information while keeping the page visible.
- Editing a single record inline without navigating.
- Showing filters or settings.
- Quick forms (3–8 fields).

**Not for:**
- Critical confirmations → use Modal.
- Multi-step workflows → use dedicated page or Wizard.
- Content that requires full attention → use Modal or dedicated page.

---

## Anatomy

```
┌────────────────────────────────────────────────────┐
│ Page (dimmed)                                       │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒┌────────────────────┐│
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ Header             [X]││
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒├────────────────────┤│
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│                     ││
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  Body content       ││
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│                     ││
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│                     ││
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│                     ││
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│                     ││
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒└────────────────────┘│
└────────────────────────────────────────────────────┘
```

| Part | Required | Notes |
|---|---|---|
| Backdrop | Yes | Page dimmed (rgba(neutral.900, 0.5)) |
| Header | Yes | Title + close button |
| Body | Yes | Content area, scrollable |
| Footer | No | Action buttons |
| Close button | Yes | × in header |

---

## Variants

| Variant | Use case |
|---|---|
| `right` (default) | Detail panels, settings |
| `left` | Navigation (mobile sidebar) |
| `top` | Notifications, banners |
| `bottom` | Mobile sheets, action sheets |

---

## Sizes

| Size | Width |
|---|---|
| `sm` | 360px |
| `md` | 480px |
| `lg` | 640px |
| `xl` | 800px |
| `full` | 100vw (mobile sheets) |

On mobile, drawers default to `full` width with rounded top corners.

---

## Behavior

### Opening

- Slide in from the side (or top/bottom for those variants).
- Duration: `motion.duration.slow` (200ms).
- Easing: `motion.easing.decelerate`.

### Closing

- Slide out, fade backdrop.
- Duration: `motion.duration.default` (150ms).
- Easing: `motion.easing.accelerate`.

### Backdrop click

- Closes the drawer (unless `persistent: true`).
- Same rule as Modal.

### Focus

- On open: focus moves to the first focusable element inside the drawer.
- While open: focus is partially trapped (Tab cycles within drawer, then exits).
- On close: focus returns to the trigger.

### Keyboard

| Key | Action |
|---|---|
| `Escape` | Close drawer (unless `persistent`) |
| `Tab` / `Shift+Tab` | Navigate within drawer |

---

## States

| State | Visual |
|---|---|
| `default` | Open, fully visible |
| `loading` | Loading indicator on content |
| `error` | Error message in body |
| `success` | Auto-close after delay (when used for confirmations) |

---

## Props / conceptual API

```text
variant:       "left" | "right" | "top" | "bottom"
size:          "sm" | "md" | "lg" | "xl" | "full"
open:          boolean
onClose:       () => void
title:         string
description:   string | null
footer:        ReactNode | null
loading:       boolean
persistent:    boolean
closeOnBackdrop: boolean
closeOnEscape:  boolean
width:         string | number       // override size
aria-label:    string | null
```

---

## Accessibility

- `role="dialog"`, `aria-modal="true"` (treats page as inert).
- `aria-labelledby` to title.
- `role="document"` on body so screen readers don't read the dimmed page.
- Focus trap inside drawer.
- `Escape` closes (unless persistent).
- On close, focus returns to trigger.

---

## Responsive behavior

| Breakpoint | Width |
|---|---|
| `≥ md` | `size` as specified |
| `< md` | 100vw (drawer becomes full-screen sheet) |

For mobile sheet: rounded top corners (`radius.xl`), drag handle at top for swipe-to-close (optional).

---

## Do

- ✅ Use for detail views that need page context.
- ✅ Use for quick inline edit forms (3–8 fields).
- ✅ Return focus to trigger on close.
- ✅ Match backdrop style with Modal for consistency.

## Don't

- ❌ Don't use for critical destructive confirmations (use Modal).
- ❌ Don't use for forms longer than 8 fields (use Form Page).
- ❌ Don't have multiple drawers open at once.
- ❌ Don't use Top variant on desktop — reserved for mobile.

---

## Related

- Modal: [`modal.md`](modal.md)
- Forms: [`../patterns/forms.md`](../patterns/forms.md)
- Navigation (mobile sidebar): [`../patterns/navigation.md`](../patterns/navigation.md)
