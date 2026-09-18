# Workflow Page Template

A page dedicated to designing, editing, and viewing business process workflows visually.

---

## Purpose

Provide a workspace for creating, editing, and visualizing workflows:
- **Workflow editor** — drag-and-drop canvas for designing.
- **Workflow viewer** — read-only display of an existing workflow.
- **Execution viewer** — see real-time progress of a running workflow.

---

## Anatomy

### Editor layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ App Shell (topbar only, no sidebar)                                          │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Topbar: [Workflow name] [Save] [Test] [Publish]   [User menu]            │ │
│ │ ┌─────────┬─────────────────────────────────────────┬─────────────────┐ │ │
│ │ │ Node    │                                         │ Properties      │ │ │
│ │ │ palette │              Canvas                     │                 │ │ │
│ │ │         │                                         │ Selected:       │ │ │
│ │ │ ▶ Start │           ┌────────┐                    │ Send welcome    │ │ │
│ │ │ ◆ Task  │           │ Start  │                    │                 │ │ │
│ │ │ ◇ Decision│          └────┬───┘                    │ Channel:        │ │ │
│ │ │ ◯ Approval│                ▼                       │ [Email ▼]       │ │ │
│ │ │ ⏱ Delay │           ┌────────┐                    │                 │ │ │
│ │ │ ✉ Notify│           │  Task  │                    │ Delay:          │ │ │
│ │ │ ⌘ Webhook│          └────┬───┘                    │ [1 hour ▼]      │ │ │
│ │ │ ⊕ Subflow │               ▼                       │                 │ │ │
│ │ │ ⌖ End   │           ┌────────┐                    │                 │ │ │
│ │ │         │           │  End   │                    │                 │ │ │
│ │ │         │           └────────┘                    │                 │ │ │
│ │ └─────────┴─────────────────────────────────────────┴─────────────────┘ │ │
│ │ Zoom: 100%  [Fit]  [+]  [−]  [Mini-map]               [Auto-saved 2s]   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Viewer layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ App Shell                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Sidebar │ Page Header                                                    │ │
│ │         │ ┌─────────────────────────────────────────────────────────┐  │ │
│ │         │ │ Customer onboarding (Workflow)              [Edit] [⋯] │  │ │
│ │         │ │ Status: ● Published · v3.2 · Last edited by John       │  │ │
│ │         │ └─────────────────────────────────────────────────────────┘  │ │
│ │         │ Tabs                                                           │ │
│ │         │ Diagram | Versions | Executions | Settings                   │ │
│ │         │                                                                  │ │
│ │         │ ──────────────────────────────────────────────────────────── │ │
│ │         │                                                                  │ │
│ │         │ [Diagram view — read-only canvas]                              │ │
│ │         │                                                                  │ │
│ │         │                                                                  │ │
│ └─────────┴─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Page header

```
Customer onboarding (Workflow)                    [Edit] [Test] [Publish]
Status: ● Published · v3.2 · Last edited by John · 18 Sep 2026
```

| Element | Notes |
|---|---|
| Title | Workflow name |
| Status badge | Draft / Published / Paused / Archived |
| Version | v3.2 |
| Metadata | Last edited by + date |
| Actions | Edit (if not in edit mode), Test, Publish |

---

## Editor canvas

### Top toolbar (in editor mode)

```
[Workflow name (editable)]  [Undo] [Redo]  ─  [Save] [Test] [Publish]
                                          [Auto-saved at 14:32]
```

### Node palette (left)

- Vertical list of available node types.
- Drag to canvas to create.
- Each node type has icon + label.

### Canvas (center)

- SVG-based or canvas-based renderer.
- Pan with click + drag on empty space.
- Zoom with scroll wheel or buttons.
- Snap-to-grid for alignment.
- Mini-map (bottom-right corner) for navigation in large workflows.

### Properties panel (right)

- Slides in when node selected.
- Empty state: "Select a node to edit its properties".
- Sticky footer with Delete and Duplicate actions.

### Bottom toolbar

```
Zoom: 100%  [Fit]  [+]  [−]      [Mini-map toggle]    [Auto-saved 2s ago]
```

---

## Viewer canvas

Same canvas but:
- No node palette.
- No properties panel (or read-only).
- No editing interactions.
- Click node → opens detail in Drawer.

---

## Execution viewer

Show real-time progress on the canvas:

```
[Same canvas layout, but nodes have status colors]

● Pending    (gray)
◐ Running    (blue, animated border)
✓ Success    (green)
✗ Failed     (red)
⚠ Skipped    (yellow)
```

- Click a node to see execution detail.
- Show timestamps on hover.

---

## Tabs

| Tab | Content |
|---|---|
| `Diagram` | Canvas (edit or view) |
| `Versions` | Version history with diff view |
| `Executions` | List of workflow runs |
| `Settings` | Workflow metadata, permissions, schedule |

Default tab: `Diagram`.

---

## States

### Workflow state

| State | Visual |
|---|---|
| `draft` | Yellow badge, "Edit" available |
| `published` | Green badge, "Test" + "Edit" available |
| `paused` | Gray badge, "Resume" action |
| `archived` | Hidden, kept for history |

### Editor state

| State | Behavior |
|---|---|
| `clean` | Save button disabled, no auto-save |
| `dirty` | Save button enabled, auto-save debounced |
| `saving` | Save in progress, button shows spinner |
| `saved` | Auto-saved indicator |
| `error` | Error banner, retry |
| `validating` | Validation in progress |

### Canvas state

| State | Visual |
|---|---|
| `empty` | "Drag a node to start" hint |
| `with-nodes` | Normal canvas |
| `invalid` | Validation errors highlighted, banner shown |
| `readonly` | No editing interactions |

---

## Empty state

```
┌────────────────────────────────────────────────┐
│                                                  │
│         📋 Create your first workflow            │
│                                                  │
│   Workflows automate multi-step business         │
│   processes like approvals, notifications,       │
│   and data syncing.                              │
│                                                  │
│         [+ Create from scratch]                  │
│         [Browse templates ▼]                     │
│                                                  │
└────────────────────────────────────────────────┘
```

For first-time workflow creation. Offer templates for common patterns.

---

## Workflow templates

```
Templates:
├── Customer onboarding
├── Employee onboarding
├── Approval workflow (single-step)
├── Approval workflow (multi-step)
├── Marketing automation
├── Order processing
└── Invoice approval
```

- Pre-built starting points.
- User customizes after.

---

## Versions tab

```
┌────────────────────────────────────────────────────┐
│ Versions                                            │
├────────────────────────────────────────────────────┤
│  v3.2 ● Published    John Smith  18 Sep 2026  ⋯   │
│  v3.1                John Smith  10 Sep 2026  ⋯   │
│  v3.0                Jane Doe    01 Sep 2026  ⋯   │
│  v2.5                John Smith  15 Aug 2026  ⋯   │
└────────────────────────────────────────────────────┘
```

| Action | Result |
|---|---|
| View | Read-only canvas of that version |
| Diff | Visual diff vs current |
| Restore | Make this version current (creates new version) |
| Promote | Mark as latest published |

---

## Executions tab

```
┌────────────────────────────────────────────────────┐
│ Executions                                         │
├────────────────────────────────────────────────────┤
│  ● Running (2)                                     │
│  ├── #1234  Triggered by Customer created    2h ago │
│  └── #1235  Triggered by Schedule            1h ago │
│                                                     │
│  ✓ Successful (124)                                │
│  ✗ Failed (3)                                       │
└────────────────────────────────────────────────────┘
```

- List with status filter.
- Click execution → execution detail page.

---

## Settings tab

```
Settings:
├── Basic
│   ├── Name
│   ├── Description
│   └── Tags
├── Trigger
│   ├── Manual / Schedule / Event
│   └── Cron expression (if schedule)
├── Permissions
│   ├── Who can edit
│   ├── Who can trigger
│   └── Who can view executions
├── Notifications
│   ├── On failure
│   ├── On success
│   └── SLA breach
└── Advanced
    ├── Timeout
    ├── Retry policy
    └── Error handling
```

---

## Mobile behavior

Workflow editor is **desktop-only** for editing. On mobile:

```
┌──────────────────────────────────────┐
│                                       │
│      ⚠ Editor not available on mobile  │
│                                       │
│   For the best experience, please     │
│   use a desktop or tablet.            │
│                                       │
│   You can still:                      │
│   ✓ View workflow diagram             │
│   ✓ Trigger workflow                  │
│   ✓ View executions                   │
│                                       │
│   [View diagram]                      │
│                                       │
└──────────────────────────────────────┘
```

For view / trigger, provide a **list-based interface** that works on mobile.

---

## Do

- ✅ Provide keyboard alternative for canvas editing.
- ✅ Auto-save drafts (debounced).
- ✅ Validate before publish.
- ✅ Show version history.
- ✅ Allow undo/redo.
- ✅ Support mini-map for large workflows.
- ✅ Warn before leaving with unsaved changes.

## Don't

- ❌ Don't auto-publish on save.
- ❌ Don't allow infinite loops.
- ❌ Don't lose unsaved changes.
- ❌ Don't make canvas the only way to edit.

---

## Related

- Workflow pattern: [`../patterns/workflow.md`](../patterns/workflow.md)
- Approval pattern: [`../patterns/approval.md`](../patterns/approval.md)
- Drawer: [`../components/drawer.md`](../components/drawer.md)
- Tabs: [`../components/tabs.md`](../components/tabs.md)
