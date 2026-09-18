# Workflow Pattern

Patterns for designing, editing, and visualizing business processes and automated workflows.

---

## Purpose

Allow users to create, view, and modify multi-step business processes visually. Workflows combine tasks, decisions, and approvals into a directed graph.

**Use cases:**
- Approval routing configuration.
- Marketing automation sequences.
- Onboarding workflows.
- Order processing pipelines.
- Document review chains.

---

## Anatomy

### Workflow editor

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Toolbar: [Save] [Test] [Publish] [⋯]    Workflow: Customer onboarding       │
├─────────────┬─────────────────────────────────────────────┬─────────────────┤
│ Node        │                                              │ Properties      │
│ palette     │              Canvas                           │                 │
│             │                                              │ Selected node:  │
│ ▶ Start     │           ┌────────┐                         │ Send welcome    │
│             │           │ Start  │                          │                 │
│ ◆ Task      │           └────┬───┘                          │ Channel:        │
│             │                │                              │ [Email ▼]       │
│ ◇ Decision  │                ▼                              │                 │
│             │           ┌────────┐                         │ Delay:          │
│ ◯ Approval  │           │  Task  │                          │ [1 hour]        │
│             │           │ Send   │                          │                 │
│ ⏱ Delay    │           │welcome │                          │ Conditions:     │
│             │           └────┬───┘                          │ [Add condition] │
│ ✉ Notify   │                │                              │                 │
│             │                ▼                              │                 │
│ ⌖ End       │           ┌────────┐                          │                 │
│             │           │  End   │                          │                 │
│             │           └────────┘                          │                 │
├─────────────┴─────────────────────────────────────────────┴─────────────────┤
│ Zoom: 100%  [Fit to screen]  [Zoom in] [Zoom out]                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Part | Notes |
|---|---|
| Top toolbar | Save, Test, Publish, undo/redo |
| Node palette | Drag from here to canvas |
| Canvas | Where nodes are placed and connected |
| Properties panel | Configuration for selected node |
| Mini-map | Optional overview of entire workflow |
| Zoom controls | Zoom in/out, fit to screen |

---

## Node types

| Icon | Type | Description |
|---|---|---|
| ▶ | `start` | Workflow entry point (one only) |
| ⌖ | `end` | Workflow exit point |
| ◆ | `task` | Action to perform |
| ◇ | `decision` | Branching based on conditions |
| ◯ | `approval` | Human approval step |
| ⏱ | `delay` | Wait for time period |
| ✉ | `notify` | Send notification |
| ⌘ | `webhook` | Call external API |
| ⊕ | `sub-workflow` | Embed another workflow |

Each node has:
- Title
- Icon
- Color (semantic)
- Configuration in properties panel

---

## Edge (connection)

```
[Node A] ──────────────► [Node B]
       default label
```

- Arrow direction: data flow.
- Edge label: condition or default.
- Color: matches source node or semantic.

### Decision edges

```
            ┌─ [Approved] ─────► [Task]
[Decision] ─┤
            └─ [Rejected] ─────► [End]
```

- Each edge has condition label.
- Default edge if no condition matches.

---

## Properties panel

When a node is selected, show its config:

```
┌────────────────────────────────┐
│ Selected: Send welcome email   │
├────────────────────────────────┤
│ Node ID:        node_1         │
│ Label:          Send welcome   │
│ Channel:        [Email ▼]     │
│ Template:       welcome_v1     │
│ Recipients:     [+ Add]       │
│ Delay before:   [1 hour ▼]    │
│ Retry:          [3 attempts]   │
│                                  │
│ [Delete node]                   │
└────────────────────────────────┘
```

| Section | Notes |
|---|---|
| Basic | ID, label, description |
| Behavior | Type-specific config |
| Validation | Required fields, formats |
| Advanced | Error handling, timeouts |

---

## States

### Workflow state

| State | Notes |
|---|---|
| `draft` | Editable, not running |
| `published` | Live, executing new instances |
| `paused` | Published but not accepting new |
| `archived` | Hidden, kept for history |

### Editor state

| State | Notes |
|---|---|
| `clean` | No unsaved changes |
| `dirty` | Has unsaved changes |
| `saving` | Save in progress |
| `error` | Save failed, retry |

### Node state (when executing)

| State | Visual |
|---|---|
| `pending` | Default gray |
| `running` | Blue, animated border |
| `success` | Green check |
| `failed` | Red X |
| `skipped` | Gray, dashed border |
| `waiting` | Yellow clock |

---

## Canvas interactions

| Action | Behavior |
|---|---|
| Drag from palette | Drop creates node |
| Click node | Select + show properties |
| Drag node | Move within canvas |
| Drag from node port | Create edge |
| Click edge | Select edge |
| Delete key | Remove selection |
| Ctrl+Z / Ctrl+Y | Undo / redo |
| Ctrl+C / Ctrl+V | Copy / paste node |
| Double-click node | Open inline editor |
| Scroll | Zoom |
| Right-click | Context menu |

---

## Validation

Validate workflow before publish:

| Rule | Example |
|---|---|
| Has start node | Required |
| Has end node | Required |
| All nodes connected | No orphans |
| All paths reachable | No dead ends |
| Required fields filled | All node configs valid |
| No infinite loops | Decision must have exit |
| Max nodes | e.g. 100 nodes per workflow |

Show errors with a panel:

```
┌────────────────────────────────────┐
│ ⚠ 3 errors before publish           │
├────────────────────────────────────┤
│ • Node "Send welcome" missing      │
│   email template                   │
│ • Decision "Approved?" has no      │
│   default branch                   │
│ • Node "Webhook" loops back        │
│   to "Decision" — possible        │
│   infinite loop                    │
└────────────────────────────────────┘
```

---

## Testing

```
[Test workflow]

Trigger: New customer created
[Run with sample data]

Step 1: Send welcome email  ✓ Success (took 0.8s)
Step 2: Wait 1 hour           ✓ Success (took 1.0s)
Step 3: Notify sales          ✓ Success (took 0.2s)

Total: 2.0s
[Close]   [Edit]
```

- Run workflow with sample data.
- Show step-by-step execution.
- Highlight failures.
- Allow inspection of variables.

---

## Workflow viewer (read-only)

For viewing a running or completed workflow:

```
┌────────────────────────────────────────────────┐
│ Workflow execution #1234              2h ago    │
├────────────────────────────────────────────────┤
│                                                 │
│  ●  Step 1: Send welcome         ✓ 18 Sep 14:30│
│  │                                            │
│  ●  Step 2: Wait 1 hour          ✓ 18 Sep 15:30│
│  │                                            │
│  ◐  Step 3: Notify sales         Running...    │
│  │                                            │
│  ○  Step 4: Update CRM           Pending       │
│                                                 │
└────────────────────────────────────────────────┘
```

- Step list with status.
- Click step for detail.
- Show variables and outputs.

---

## Accessibility

Canvas-based editors are inherently difficult for screen readers. Provide:

### Alternative interface

For keyboard / screen reader users, provide a **list-based editor**:

```
Workflow: Customer onboarding

1. ▶ Start
2. Task: Send welcome email    [Edit] [Delete]
3. Delay: 1 hour              [Edit] [Delete]
4. Task: Notify sales          [Edit] [Delete]
5. ⌖ End

[+ Add step]  [Add branch]
```

All operations available without canvas:
- Add, edit, delete nodes.
- Connect, disconnect nodes.
- Reorder, move nodes.
- Validate, save, publish.

### Keyboard navigation in canvas

| Key | Action |
|---|---|
| `Tab` | Next node |
| `Shift+Tab` | Previous node |
| `Arrow keys` | Move selected node |
| `Enter` | Open properties |
| `Delete` | Delete selected |
| `Cmd+Z` | Undo |
| `Cmd+Shift+Z` | Redo |

---

## Performance

| Concern | Solution |
|---|---|
| Many nodes | Virtual rendering, mini-map |
| Large workflows | Auto-layout algorithm |
| Slow drag | Snap-to-grid |
| Save latency | Debounce auto-save |

---

## Do

- ✅ Provide keyboard / list-based alternative.
- ✅ Validate before publish.
- ✅ Show execution state clearly.
- ✅ Auto-save drafts.
- ✅ Allow undo/redo.
- ✅ Show node states when executing.
- ✅ Provide mini-map for large workflows.

## Don't

- ❌ Don't make canvas the only way to edit.
- ❌ Don't auto-publish on save.
- ❌ Don't allow infinite loops without warning.
- ❌ Don't lose unsaved changes on navigation.

---

## Related

- Drawer (properties panel): [`../components/drawer.md`](../components/drawer.md)
- Forms: [`forms.md`](forms.md)
- Approval pattern: [`approval.md`](approval.md)
- Workflow page template: [`../templates/workflow-page.md`](../templates/workflow-page.md)
