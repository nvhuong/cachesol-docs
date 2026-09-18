# Modal

A Modal (Dialog) overlays the page to focus the user's attention on a single task. It blocks interaction with the rest of the page until dismissed.

---

## Purpose

Capture focused attention for a task that must be completed before continuing. Use when:

- Confirmation is needed before a critical action.
- A short form needs to be filled.
- Detail needs to be shown without navigating away.

---

## When to use

- Confirmation dialogs (especially destructive).
- Short focused forms (1–5 fields).
- Single-task focused views (e.g. "Add user to team").

## When not to use

- Multi-step workflows → dedicated page or Wizard.
- Long forms → dedicated page.
- Complex nested content → dedicated page.
- When the user needs to reference other page content → use a Drawer or dedicated page.

---

## Anatomy

```
┌────────────────────────────────────────────────────┐
│ Header                                             │
│ ┌──────────────────────────────────────────────┐  │
│ │ Title                        [X]              │  │
│ │ Description                                  │  │
│ └──────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────┤
│ Body                                               │
│ ┌──────────────────────────────────────────────┐  │
│ │                                               │  │
│ │  Modal content (form, confirmation, etc.)     │  │
│ │                                               │  │
│ └──────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────┤
│ Footer                                             │
│ ┌──────────────────────────────────────────────┐  │
│ │ [Cancel]                    [Primary action] │  │
│ └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

| Part | Required | Notes |
|---|---|---|
| Header | Yes | Title + close button |
| Title | Yes | Clear, specific, what the user is doing |
| Close button | Yes | × in top-right corner |
| Description | No | One line of context |
| Body | Yes | Content area, scrollable |
| Footer | No | Action buttons |
| Divider | No | Separates body from footer |

---

## Variants

| Variant | Use case | Footer | Typical size |
|---|---|---|---|
| `standard` | General purpose | Optional | `md` |
| `confirmation` | Confirm a destructive or critical action | Yes (2 buttons) | `sm` |
| `destructive` | Confirm delete / revoke / cancel | Yes (2 buttons, destructive primary) | `sm` |
| `form` | Short form (1–5 fields) | Yes (2 buttons) | `md` |
| `fullscreen` | Complex, detail-heavy, multi-section | Optional | 100vw × 100vh |

---

## Sizes

| Size | Max-width | Use case |
|---|---|---|
| `sm` | 400px | Confirmations, simple messages |
| `md` | 560px | Standard forms, short content |
| `lg` | 720px | Detailed forms, multi-column content |
| `xl` | 960px | Wide data tables, report previews |
| `full` | 100vw × 100vh | Complex workflows, dedicated task views |

On mobile (`< md`): modals are full-screen (`width: 100vw`), not centered.

---

## States

| State | Behavior |
|---|---|
| `default` | Open, fully visible |
| `loading` | Loading indicator on primary action button, form disabled |
| `error` | Error message in body, form re-enabled for retry |
| `success` | Brief success state → auto-close (2s) or stay + close |

### Opening transition

- Fade in backdrop: `opacity 0→1`, `motion.duration.default` (150ms).
- Scale up modal: `scale(0.96)→scale(1)`, `motion.duration.default` (150ms), `decelerate`.

### Closing transition

- Fade out backdrop: `opacity 1→0`, `motion.duration.fast` (100ms).
- Scale down modal: `scale(1)→scale(0.96)`, `motion.duration.fast` (100ms), `accelerate`.

---

## Props / conceptual API

```text
variant:     "standard" | "confirmation" | "destructive" | "form" | "full"
size:        "sm" | "md" | "lg" | "xl" | "full"
open:        boolean
onClose:     () => void
title:       string
description: string | null
footer:      ReactNode | null        // for custom footer; omit to use default
loading:     boolean                 // disables footer actions
closeOnBackdrop: boolean             // default: true
closeOnEscape: boolean              // default: true
persistent:   boolean               // if true, no backdrop click or Escape; use carefully
initialFocus: Ref<HTMLElement>      // first focusable element inside
aria-label:  string                // use if no visible title
aria-describedby: string          // points to description
```

---

## Behavior

### Focus trap

- On open: focus moves to the first focusable element inside the modal.
- While open: Tab cycles within the modal. Cannot tab out.
- On close: focus returns to the trigger element that opened the modal.

### Backdrop

- Background: `rgba(15, 23, 42, 0.5)` — `color.neutral.900` at 50% opacity.
- Clicking backdrop closes the modal (unless `persistent: true`).
- Mobile: backdrop covers full screen.

### Scroll behavior

- Body scrolls independently.
- Header and footer stay fixed.
- Scroll indicator (fade or shadow) at top when body has scrolled content.

### Keyboard

| Key | Action |
|---|---|
| `Escape` | Close modal (unless `persistent`) |
| `Tab` / `Shift+Tab` | Navigate within modal |
| `Enter` | Submit form if in form modal (not confirmation) |

### Unsaved changes

- If the user tries to close a form modal with unsaved changes:
  - Show a confirmation: "You have unsaved changes. Discard them?"
  - Options: "Discard" (destructive), "Keep editing".

---

## Destructive confirmation pattern

For delete / cancel / revoke — always require explicit confirmation:

```
┌─────────────────────────────────────────────┐
│ Delete customer                         [X] │
├─────────────────────────────────────────────┤
│                                             │
│  Are you sure you want to delete            │
│  "John Smith"? This action cannot be        │
│  undone.                                    │
│                                             │
│  ● Type the name to confirm:                │
│  ┌──────────────────────────────────────┐  │
│  │ John Smith                            │  │
│  └──────────────────────────────────────┘  │
│                                             │
├─────────────────────────────────────────────┤
│                    [Cancel]  [Delete]       │
└─────────────────────────────────────────────┘
```

Rules:
- Destructive buttons always use `btn-destructive` variant.
- Always say what will be deleted / affected.
- For high-impact deletes: require typing the name to confirm.
- "This action cannot be undone" is required for permanent deletions.

---

## Content guidelines

### Title

- Be specific: "Delete customer", "Approve invoice #1234".
- Not: "Confirm", "Warning", "Are you sure?" (alone).
- Sentence case.

### Description

- Explain the consequence of the action.
- For destructive: include what will be affected.

### Footer

- Cancel first, primary action last.
- Right-align on desktop; stack on mobile.
- Primary action on right, secondary on left.
- Cancel = `secondary`, never `ghost` for destructive modals.

---

## Accessibility

- `role="dialog"` on modal container.
- `aria-modal="true"` to indicate content behind is inert.
- `aria-labelledby` pointing to the title element.
- `aria-describedby` pointing to the description element.
- Focus is trapped inside while open.
- On close, focus returns to the trigger.
- `Escape` closes the modal (unless `persistent`).
- Screen reader announces modal open/close.

---

## Responsive behavior

| Breakpoint | Behavior |
|---|---|
| `< md` | Full-screen modal (`width: 100vw`, `height: 100dvh`) |
| `md`+ | Centered, max-width per size prop |
| Max height | `90vh` on desktop, scroll body |

---

## Do

- ✅ Use for confirmations and short focused tasks.
- ✅ Always have a visible title.
- ✅ Right-align action buttons in footer.
- ✅ Return focus to trigger on close.
- ✅ Trap focus while open.
- ✅ Handle unsaved changes with confirmation.
- ✅ Use `destructive` variant for permanent deletions.

## Don't

- ❌ Don't use for multi-step workflows (use dedicated page or wizard).
- ❌ Don't use for long forms (use dedicated page).
- ❌ Don't make `persistent` modals the default.
- ❌ Don't show loading state for > 3 seconds — move to background + notify.
- ❌ Don't use generic titles like "Confirm" or "Warning".
- ❌ Don't disable backdrop click for critical information modals (unless persistent is necessary).

---

## Examples

### Confirmation modal

```html
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal-header">
    <h2 id="modal-title">Approve invoice</h2>
    <button aria-label="Close">×</button>
  </div>
  <div class="modal-body">
    <p>Approve invoice #INV-2026-001 for $12,340.00?</p>
  </div>
  <div class="modal-footer">
    <button class="btn btn-secondary">Cancel</button>
    <button class="btn btn-primary">Approve</button>
  </div>
</div>
```

### Destructive confirmation with name confirmation

```html
<div role="dialog" aria-modal="true">
  <div class="modal-header">
    <h2>Delete customer</h2>
    <button aria-label="Close">×</button>
  </div>
  <div class="modal-body">
    <p>Type <strong>John Smith</strong> to confirm deletion. This cannot be undone.</p>
    <label>Confirm name</label>
    <input type="text" placeholder="John Smith" />
  </div>
  <div class="modal-footer">
    <button class="btn btn-secondary">Cancel</button>
    <button class="btn btn-destructive" disabled>Delete customer</button>
  </div>
</div>
```

---

## Related

- Button (footer actions): [`Button.md`](Button.md)
- Form patterns: [`../patterns/forms.md`](../patterns/forms.md)
- Feedback patterns: [`../patterns/feedback.md`](../patterns/feedback.md)
- Navigation: sidebar/drawer — [`../patterns/navigation.md`](../patterns/navigation.md)
