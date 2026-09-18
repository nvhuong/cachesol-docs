# Approval Workflow Pattern

The Approval Workflow pattern handles multi-step review and decision-making on requests that require authorization.

---

## Purpose

Display an approval request's details, history, and provide reviewers with clear actions to approve or reject.

**Use cases:**
- Leave requests
- Purchase orders
- Document publishing
- Access grants
- Refunds / discounts
- Bonus payments
- Any business process requiring authorization

---

## Anatomy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Breadcrumb > Approvals > #REQ-2026-001                                       │
│                                                                              │
│ Request #REQ-2026-001                              [Reject]  [Approve]      │
│ Submitted by John Smith · 18 Sep 2026 at 14:30                              │
│                                                                              │
│ ─────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│  ┌─────────────────────────────────────┐ ┌──────────────────────────────┐ │
│  │ Request details (2-col)              │ │ Approval status              │ │
│  │                                      │ │                              │ │
│  │ Type:        Purchase order         │ │ Current step:                │ │
│  │ Amount:      $12,340.00             │ │ ● Step 2 of 3: Manager       │ │
│  │ Vendor:      ACME Corp             │ │                              │ │
│  │ Items:       ...                    │ │ Approvers:                   │ │
│  │ Justification: ...                  │ │ ✓ Sarah Lee    (Approved)   │ │
│  │                                      │ │ ● Mike Chen    (Pending)    │ │
│  └─────────────────────────────────────┘ │ ○ Anna Tran    (Waiting)    │ │
│                                          │                              │ │
│                                          │ [Comment]                    │ │
│                                          │ ┌──────────────────────────┐│ │
│                                          │ │                          ││ │
│                                          │ │                          ││ │
│                                          │ └──────────────────────────┘│ │
│                                          │ [Reject]      [Approve]    │ │
│                                          └──────────────────────────────┘ │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ Activity / Timeline                                                            │
│                                                                              │
│ Today                                                                        │
│ ├── 14:30  John Smith submitted request                                      │
│ ├── 14:32  Sarah Lee approved (Step 1)                                       │
│ ├── 14:45  Routed to Mike Chen (Manager)                                    │
│ 2 hours ago                                                                  │
│ ├── John Smith added attachment: invoice.pdf                                 │
│ 1 day ago                                                                    │
│ ├── John Smith created request                                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Part | Component |
|---|---|
| Header | Page header pattern |
| Reject / Approve buttons | Button (destructive / primary) |
| Request details | Description list (2-column) |
| Approval status | Steps / status with badges |
| Approver list | List with status indicators |
| Comment input | Textarea |
| Activity timeline | Timeline pattern |

---

## Approval steps display

### Steps pattern (horizontal)

```
[✓ Submitted]  ──  [✓ Step 1: Manager]  ──  [● Step 2: Finance]  ──  [○ Step 3: CFO]
                  Approved                Pending                  Waiting
```

- Each step has label, role, status.
- Status: ✓ Approved (green), ● Pending (amber), ○ Waiting (gray), ✗ Rejected (red).
- Current step highlighted.

### Vertical steps (when many steps)

```
▼ Step 1: Manager approval
│   ✓ Sarah Lee   Approved 18 Sep 14:32
│   Comment: "LGTM"
│
▶ Step 2: Finance approval
│   ● Mike Chen   Pending
│
○ Step 3: CFO approval
    ○ Anna Tran   Waiting
```

### Approver list

```
Approvers (in order):
1. Sarah Lee    ✓ Approved  18 Sep 14:32
   "Looks good"
2. Mike Chen    ● Pending   Awaiting action
3. Anna Tran    ○ Waiting   Not yet routed
```

---

## Approval modes

### Reviewer view (current step)

```
[Reject]                              [Approve]
```

- Reject: `destructive` variant, requires comment.
- Approve: `primary` variant, comment optional.
- Both buttons in sticky footer.

### Submitter view

```
[Cancel request]                       [Resend]
```

- Cancel: `destructive` (only when status allows).
- Resend: `secondary` (if no reviewer yet).

### Observer view (read-only)

```
[Add comment]
```

- No approve / reject actions.
- Only comments allowed.

---

## Comments

Comments accompany each approval step.

```
┌────────────────────────────────────────────────┐
│ Comment                                         │
│ ┌────────────────────────────────────────────┐ │
│ │                                            │ │
│ │                                            │ │
│ └────────────────────────────────────────────┘ │
│ Helper: This comment will be visible to all   │
│          approvers and the submitter.          │
└────────────────────────────────────────────────┘
```

- Optional for approve.
- **Required** for reject (min 10 characters).
- Use `placeholder` not label.

### Comment history

```
Comments
├── Sarah Lee (Step 1, 18 Sep 14:32):
│   "Looks good, approved."
├── Mike Chen (Step 2, 18 Sep 14:45):
│   "Need clarification on the vendor."
└── John Smith (Submitter, 18 Sep 14:50):
    "Vendor confirmed delivery by Friday."
```

---

## States

| State | Visual |
|---|---|
| `draft` | Submitter can edit, no approvers yet |
| `pending` | Routed to reviewer, awaiting action |
| `approved` | All approvers approved |
| `rejected` | Any approver rejected |
| `cancelled` | Submitter cancelled |
| `expired` | SLA exceeded without action |

### State badges

| Status | Color |
|---|---|
| Pending | `warning.*` |
| Approved | `success.*` |
| Rejected | `error.*` |
| Cancelled | `neutral.*` |
| Expired | `warning.*` |

---

## Bulk approval

For high-volume approvers (HR, finance teams):

```
┌──────────────────────────────────────────────────────────────────┐
│ ☑ Select all     [Reject selected] [Approve selected] [Export]   │
├──────────────────────────────────────────────────────────────────┤
│  □ │ Request        │ Submitter    │ Amount    │ Submitted │ ⋮ │
│ ──────────────────────────────────────────────────────────────── │
│  ☑ │ #REQ-001       │ John Smith   │ $12,340   │ 2h ago   │ ⋮ │
│  ☑ │ #REQ-002       │ Jane Doe     │ $4,500    │ 3h ago   │ ⋮ │
│  ☐ │ #REQ-003       │ Bob Wilson   │ $890      │ 1d ago   │ ⋮ │
└──────────────────────────────────────────────────────────────────┘
```

- Bulk action bar appears when ≥ 1 row selected.
- Max bulk-approve count: 50 (force individual review for more).
- Confirmation modal before bulk approval.
- Cannot bulk-approve if any selected item requires special handling.

---

## Routing

When approver A approves, the request routes to the next approver (B, C, ...).

- Routing logic determined by request type, amount, department.
- Configurable approval chain.
- Can route back to submitter if more info needed.

### Routing options

| Action | Next step |
|---|---|
| Approve | Next approver in chain, OR final state if last |
| Reject | Final state (rejected) |
| Request info | Back to submitter (resets chain when resubmitted) |
| Reassign | To different approver (admin only) |

---

## SLA / timing

Show time-sensitive info:

```
⏱ Awaiting action for 2 days 4 hours
```

- Display when pending.
- Turn red if past SLA.
- Notify approver when approaching SLA (e.g. 75%).

---

## Notifications

| Event | Notification |
|---|---|
| Submitted | Notify first approver |
| Approved | Notify next approver |
| Rejected | Notify submitter |
| Comments added | Notify relevant parties |
| SLA at 75% | Notify approver |
| SLA exceeded | Notify approver + admin |

---

## Do

- ✅ Always require comment on reject.
- ✅ Show full approval history (not just current state).
- ✅ Allow observers to add comments.
- ✅ Display SLA when time-sensitive.
- ✅ Use destructive variant for reject button.
- ✅ Show who has acted and when.
- ✅ Allow bulk approval when appropriate.

## Don't

- ❌ Don't auto-approve on timeout — escalate.
- ❌ Don't hide the rejection reason from submitter.
- ❌ Don't allow editing after first approval.
- ❌ Don't allow approval without seeing request details.
- ❌ Don't forget to notify on each transition.

---

## Related

- Timeline: [`data-display.md`](data-display.md)
- Form patterns: [`forms.md`](forms.md)
- Modal (confirmation): [`../components/modal.md`](../components/modal.md)
- Table (bulk): [`../components/table.md`](../components/table.md)
- Status badges: [`data-display.md`](data-display.md)
