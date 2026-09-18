# Notification Pattern

Patterns for system-to-user communication: toasts, alerts, notification center, and inline messages.

---

## Purpose

Keep users informed about events that affect them: task completion, system status, mentions, alerts, and reminders.

**Types of notifications:**
- **Toast** — transient, time-sensitive feedback.
- **Inline alert** — persistent context within a section.
- **Notification center** — persistent inbox in the topbar.
- **Push / email** — out-of-app reach.

---

## Toast / Snackbar

Short, auto-dismissing messages that acknowledge an action or event.

### Anatomy

```
┌──────────────────────────────────────────────────┐
│ ℹ Customer created                         [×]   │
└──────────────────────────────────────────────────┘
```

| Part | Required | Notes |
|---|---|---|
| Icon | Yes | Semantic, 20px |
| Message | Yes | 1–2 lines max |
| Action | Optional | e.g. "Undo", "View" |
| Dismiss | Yes | × button |

### Types

| Type | Icon | Color | When |
|---|---|---|---|
| `success` | ✓ | `success.*` | Action completed |
| `info` | (i) | `info.*` | Neutral info |
| `warning` | ⚠ | `warning.*` | Attention needed |
| `error` | ✗ | `error.*` | Action failed |
| `loading` | spinner | `info.*` | Long operation starting |

### Behavior

| Property | Value |
|---|---|
| Position | Top-right (desktop), top-center (mobile) |
| Duration | `success/info/warning`: 4s. `error`: 6s. `loading`: until done. |
| Animation | Slide in from top, fade out |
| Max visible | 3 (queue additional) |
| Manual dismiss | Always possible |
| Hover pauses | Yes |

### Accessibility

- `role="status"` for success/info (polite).
- `role="alert"` for warning/error (assertive).
- Visible focus on action button if present.
- Don't trap focus.

### Don't use for

- Critical errors that require action → use Alert.
- Multi-step info → use a page or modal.
- Persistent state → use Alert or Notification center.

---

## Inline Alert

Persistent message within a page or section.

### Anatomy

```
┌─────────────────────────────────────────────────────┐
│ ⚠ Maintenance scheduled                              │
│ Service will be unavailable on 20 Sep from 02:00    │
│ to 04:00 UTC. [Learn more]                          │
└─────────────────────────────────────────────────────┘
```

| Part | Required | Notes |
|---|---|---|
| Icon | Yes | Semantic, 20px |
| Title | Yes | Bold, 1 line |
| Description | No | 1–3 lines |
| Action | Optional | Link or button |

### Types

Same as toast: `success`, `info`, `warning`, `error`.

### Variants

| Variant | Use |
|---|---|
| `banner` | Top of page (system-wide message) |
| `inline` | Within a section or card |
| `dismissible` | User can close (with persistence) |
| `persistent` | Cannot be dismissed |

### When to use

| Scenario | Pattern |
|---|---|
| "Record saved" | Toast |
| "Maintenance in 1 hour" | Banner alert |
| "Session expires in 5 min" | Banner alert |
| "Approval rejected" | Inline alert |
| "Network error" | Toast with retry |

---

## Notification Center

Persistent inbox accessible from the bell icon in topbar.

### Anatomy

```
┌──────────────────────────────────────────────┐
│ Notifications                  [Mark all read]│
├──────────────────────────────────────────────┤
│ ● John approved invoice #1234         2h ago│
│ ○ Mike requested your approval       5h ago│
│ ● System exported report            1d ago│
├──────────────────────────────────────────────┤
│                View all notifications        │
└──────────────────────────────────────────────┘
```

### Notification item

```
● John approved invoice #1234          2h ago
[Severity icon] [Subject]
                              [Timestamp]
```

| Part | Notes |
|---|---|
| Unread indicator | Blue dot, `color.brand.600` |
| Severity icon | Optional, semantic |
| Subject | Primary text |
| Actor | Secondary text (who) |
| Action | Subject is clickable |
| Timestamp | Relative: "2h ago", "Yesterday", "18 Sep" |

### Trigger

- Bell icon in topbar.
- Badge shows unread count (e.g. `5`, `99+`).
- Click opens dropdown panel.
- Empty state: "You're all caught up" with illustration.

### Interactions

| Action | Behavior |
|---|---|
| Click notification | Open related entity, mark as read |
| Hover | Background changes |
| Cmd/Ctrl+click | Open in new tab |
| "Mark all read" | Clear unread badge |
| "View all" | Navigate to /notifications page |

---

## Notification categories

| Category | Channel | Example |
|---|---|---|
| Task updates | Toast + Inbox | "Invoice approved" |
| Mention | Inbox + Email | "@you please review" |
| System alert | Banner + Email | "Maintenance in 1 hour" |
| Reminder | Inbox + Email | "Approval expires in 24h" |
| Failure | Toast (error) + Inbox | "Import failed" |

---

## Real-time delivery

- WebSocket or Server-Sent Events for instant.
- Fallback to polling if WebSocket unavailable.
- Don't auto-refresh if tab is hidden.
- Reconnect gracefully on network restore.

---

## Notification preferences

Users can configure:

- Per-category on/off.
- Per-channel (in-app, email, push).
- Quiet hours.
- Digest mode (batch low-priority).

UI: in user settings page.

---

## Priority levels

| Priority | Channel | Examples |
|---|---|---|
| `critical` | In-app + Email + Push + SMS | Security alert, payment failed |
| `high` | In-app + Email | Approval needed, account change |
| `normal` | In-app + Email digest | Status update, mention |
| `low` | In-app only | Weekly summary |

---

## Do

- ✅ Use semantic colors and icons for severity.
- ✅ Group by date or category in Notification Center.
- ✅ Allow users to mark all read.
- ✅ Persist notification history.
- ✅ Respect user preferences for channel.
- ✅ Show relative timestamps.

## Don't

- ❌ Don't use Toast for persistent state.
- ❌ Don't send critical info only via Toast.
- ❌ Don't open modals for notifications.
- ❌ Don't auto-mark all as read on open.
- ❌ Don't lose unread state on navigation.

---

## Related

- Toast / Alert patterns: [`feedback.md`](feedback.md)
- Topbar: [`../patterns/navigation.md`](../patterns/navigation.md)
- Status badges: [`data-display.md`](data-display.md)
