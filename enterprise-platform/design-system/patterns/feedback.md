# Feedback

Patterns for communicating system status to the user: notifications, alerts, loading states, empty states, errors, and confirmations.

---

## Toast / Notification

A short, auto-dismissing message that acknowledges an action's result.

### Toast anatomy

```
┌──────────────────────────────────────────────────┐
│ ℹ Information message                    [Dismiss]│
└──────────────────────────────────────────────────┘
```

| Part | Notes |
|---|---|
| Icon | Semantic color, 20px |
| Message | `font.size.body.sm`, 1–2 lines max |
| Dismiss | × button, optional |

### Toast types

| Type | Icon | Color | When to use |
|---|---|---|---|
| `success` | ✓ (check) | `success.*` | Action completed |
| `info` | (i) | `info.*` | Neutral information |
| `warning` | ⚠ | `warning.*` | Attention needed |
| `error` | ✗ | `error.*` | Action failed |

### Toast behavior

| Property | Value |
|---|---|
| Position | Top-right (desktop), top-center (mobile) |
| Duration | `success/info/warning`: 4s. `error`: 6s. |
| Animation | Slide in from top, fade out |
| Max visible | 3 (queue additional) |
| Manual dismiss | × button always visible |
| Screen reader | `role="status"` for success/info; `role="alert"` for warning/error |

### Don't use toast for

- Critical errors that require action → use Alert or inline message.
- Multi-step information → use a dedicated page or modal.
- Confirmation of destructive actions → the action itself is the confirmation.

---

## Alert / Inline Message

A persistent message displayed inline within the page content.

### Alert anatomy

```
┌─────────────────────────────────────────────────────┐
│ ⚠ Warning title                                      │
│ This is a warning message that requires attention.    │
│ [Action link]                                        │
└─────────────────────────────────────────────────────┘
```

| Part | Notes |
|---|---|---|
| Icon | Semantic color, 20px |
| Title | `font.size.label.md`, semibold (optional) |
| Message | `font.size.body.sm`, 1–3 lines |
| Action | Optional link/button |

### Alert types

Same semantic types as Toast: `success`, `info`, `warning`, `error`.

### Alert variants

| Variant | Use case |
|---|---|
| `banner` | Full-width, top of page (e.g. "Maintenance in 1 hour") |
| `inline` | Within a section or card |
| `field` | Inside a form field (see Input) |

### When to use Alert vs Toast

| Use | Pattern |
|---|---|
| "Record saved" | Toast (success) |
| "Your session expires in 5 minutes" | Alert (warning banner) |
| "Approval rejected" | Alert (inline, error) |
| "Network error, retry?" | Toast (error) + retry action |
| "Maintenance scheduled" | Alert (banner) |

---

## Validation Messages

Displayed inside or below form fields. See [`forms.md`](forms.md).

```
⚠ Email is required
⚠ Must be at least 8 characters
```

- Always start with icon.
- Short, specific message.
- Use `aria-live="polite"` for screen reader announcement.
- See [`forms.md`](forms.md) for full validation pattern.

---

## Loading States

### Spinner

For button loading, small areas, or when the exact duration is unknown.

```
◐  (CSS spinner)
```

- Size: 16px (inline with text), 24px (standalone).
- Color: `color.text.tertiary` or `color.brand.600`.
- Don't use in place of skeleton for large content areas.

### Skeleton

For page sections and tables while data loads.

```
████████████████████████
████  ██████████████  ██
████████████  ██████████
```

- Matches the exact shape of the content that loads.
- Animation: shimmer, 1.5s, `ease-in-out`.
- Respects `prefers-reduced-motion` — static gray rectangles.
- See Table component for skeleton table example.

### Progress bar

For operations with a known or measurable progress.

```
████████████░░░░░░░  60%
```

- Show percentage when available.
- Use indeterminate mode when percentage unknown but operation is active.
- Color: `color.brand.600`.

### Long-running operations

**Never** hold a modal open for > 3 seconds of loading.

For operations that take longer:

```
Step 1: Submitting…   ✓
Step 2: Processing…   ◐
Step 3: Finalizing…   ○
```

- Show a step-by-step progress indicator.
- Or: dismiss the modal, move to background processing.
- Show result via Toast when complete.
- Show in Notification center for critical operations.

---

## Empty State

Displayed when a list, table, or section has no data.

### Anatomy

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              📋 (illustration, optional)            │
│                                                     │
│           No invoices yet                           │
│                                                     │
│     Create your first invoice to get started.       │
│                                                     │
│              [+ Create invoice]                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Four empty state types

| Scenario | Message | Action |
|---|---|---|
| **No data (new)** | "No customers yet" | CTA: "Create customer" |
| **No results** | "No results for 'Acme'" | "Clear search" link |
| **Permission denied** | "You don't have access" | None or "Request access" |
| **System error** | "Failed to load" | "Try again" button |

### Content rules

- Illustration: optional, simple, muted (not cartoon-style).
- Title: 1–5 words, specific.
- Description: one sentence, explains what's missing and why.
- Action: primary CTA when actionable.
- Don't blame the user.

### Empty states to avoid

- "No data" with no explanation.
- "Nothing here yet" with no action.
- Error states styled like empty states.

---

## Error States

### Inline error (field-level)

Shown below a form field. See Validation above.

### Section error

When a page section fails to load:

```
┌─────────────────────────────────────────────────────┐
│ ⚠ Failed to load billing history                    │
│         Something went wrong. [Try again]            │
└─────────────────────────────────────────────────────┘
```

- Message + retry action.
- Doesn't block the rest of the page.

### Page error (full)

When the entire page fails:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                    ⚠                               │
│                                                     │
│         Something went wrong                        │
│                                                     │
│     We couldn't load this page. Try refreshing.     │
│                                                     │
│              [Refresh page]                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Centered, minimal.
- Specific title: not just "Error".
- Description with what to do.
- Don't show technical error codes to users.

### HTTP error pages

| Status | Title | Description |
|---|---|---|
| `400` | Bad request | "The page couldn't be loaded." |
| `401` | Unauthorized | "Sign in to continue." |
| `403` | Forbidden | "You don't have access to this." |
| `404` | Not found | "This page doesn't exist." |
| `500` | Server error | "Something went wrong on our end." |
| `503` | Maintenance | "We'll be back soon." |

---

## Confirmation

A dialog that requires explicit user consent before proceeding.

### Risk levels

| Level | Confirmation | Example |
|---|---|---|
| **Low** | No confirmation | Toggle a preference |
| **Medium** | Toast after action | Change status |
| **High** | Inline confirmation | "Are you sure?" in-page |
| **Destructive** | Modal confirmation | Delete record |

### Destructive confirmation rules

- Always use `destructive` Modal variant.
- State clearly what will happen.
- "This action cannot be undone" for permanent deletions.
- For high-impact: require typing to confirm (e.g. type the name).
- Destructive button is always rightmost, always `btn-destructive`.

### Confirmation with consequences

```
┌─────────────────────────────────────────────┐
│ Revoke access                           [X] │
├─────────────────────────────────────────────┤
│                                             │
│  Revoke John Smith's access to Finance?     │
│  They will immediately lose access to all  │
│  Finance resources.                        │
│                                             │
│  This action takes effect immediately.     │
│                                             │
├─────────────────────────────────────────────┤
│                     [Cancel]  [Revoke]      │
└─────────────────────────────────────────────┘
```

---

## Notification Center

Dropdown panel from the bell icon in the topbar.

```
┌──────────────────────────────────────────────┐
│ Notifications                    [Mark all read]│
├──────────────────────────────────────────────┤
│ ● John approved invoice #1234        2h ago │
│ ○ Mike requested your approval       5h ago │
│ ● System exported report            1d ago │
├──────────────────────────────────────────────┤
│                View all notifications         │
└──────────────────────────────────────────────┘
```

- Show most recent first.
- Badge count on bell icon.
- "Mark all read" action.
- Link to full notifications page.
- Empty state: "You're all caught up."

---

## Do

- ✅ Use Toast for brief, auto-dismissing success/info/warning messages.
- ✅ Use Alert (inline) for persistent, important messages.
- ✅ Use skeleton for large content loading areas.
- ✅ Differentiate 4 empty state types.
- ✅ Show actionable error descriptions ("What happened? Why? What to do?").
- ✅ Map risk level to confirmation intensity.

## Don't

- ❌ Don't use Toast for errors that require user action.
- ❌ Don't hold a modal for > 3s loading.
- ❌ Don't show the same Toast more than once per action.
- ❌ Don't show technical error codes to end users.
- ❌ Don't confirm every action — reserve for medium and above risk.
- ❌ Don't use color alone to communicate error (pair with icon + text).

---

## Related

- Toast / Alert: these are patterns, no separate component
- Modal component: [`../components/Modal.md`](../components/Modal.md)
- Button: [`../components/Button.md`](../components/Button.md)
- Forms: [`forms.md`](forms.md)
- Input (validation): [`../components/Input.md`](../components/Input.md)
