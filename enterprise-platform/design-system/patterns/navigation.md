# Navigation

Navigation patterns define the app shell, sidebar, topbar, breadcrumbs, and tabs. Consistent navigation helps users build a mental model of the product.

---

## App Shell

The app shell is the **outermost structure** of every page.

```
┌─────────────────────────────────────────────────────────────────┐
│ Topbar                                                         │
│ ┌──────┐ ┌──────────────────────────────────┐ ┌─────────────┐ │
│ │ Logo │ │ Search                            │ │ Notifications│User│ │
│ └──────┘ └──────────────────────────────────┘ └─────────────┘ │
├─────────┬───────────────────────────────────────────────────────┤
│ Sidebar│                                                        │
│         │                                                        │
│  Nav   │  Main Content                                          │
│  Items │                                                        │
│         │  ┌─────────────────────────────────────────────────┐ │
│         │  │ Page Header                                      │ │
│         │  │ Breadcrumb > Title              [Actions]        │ │
│         │  ├─────────────────────────────────────────────────┤ │
│         │  │                                                  │ │
│         │  │  Content                                        │ │
│         │  │                                                  │ │
│         │  └─────────────────────────────────────────────────┘ │
│         │                                                        │
└─────────┴───────────────────────────────────────────────────────┘
```

Dimensions:
- **Topbar height:** 56px (desktop), 48px (tablet/mobile).
- **Sidebar width:** 240px (expanded), 64px (collapsed), 0 (mobile).
- **Main content padding:** `spacing.8` (32px) horizontal, `spacing.6` (24px) vertical.

---

## Topbar

```
┌──────┐ ┌──────────────────────────────────┐ ┌──────────────────┐
│ Logo │ │ Global search                     │ │ Notifications │User│
└──────┘ └──────────────────────────────────┘ └──────────────────┘
```

| Element | Purpose |
|---|---|
| Logo | Brand, links to home/dashboard |
| Global search | `Cmd+K` or click to open, searches across all entities |
| Notifications | Bell icon, badge count, dropdown panel |
| User menu | Avatar + name, dropdown: profile, settings, logout |

### Global search

- Trigger: click or `Cmd+K` / `Ctrl+K`.
- Opens a command palette or search overlay.
- Searches across: customers, invoices, orders, users.
- Results grouped by type.
- Keyboard navigable (↑↓ to navigate, Enter to select).

### User menu

```
┌─────────────────────────────┐
│ 👤 John Smith               │
│ john@acme.com               │
│ ─────────────────────────── │
│ Profile                     │
│ Settings                    │
│ ─────────────────────────── │
│ Sign out                    │
└─────────────────────────────┘
```

---

## Sidebar

### Expanded state

```
┌──────────────────────────┐
│ Logo                      │
├──────────────────────────┤
│ Section label             │
│  • Nav item (active)     │
│  • Nav item              │
│  • Nav item              │
├──────────────────────────┤
│ Section label             │
│  • Nav item              │
│  • Nav item              │
│  • Nav item              │
├──────────────────────────┤
│  [Collapse →]            │
└──────────────────────────┘
```

### Collapsed state

```
┌──────┐
│ Logo │
├──────┤
│  📊 │
│  👥 │
│  📋 │
│  ⚙  │
├──────┤
│  →  │
└──────┘
```

### Navigation item states

| State | Visual |
|---|---|
| `default` | `color.text.secondary`, no bg |
| `hover` | `color.bg.subtle` |
| `active` | `color.bg.selected`, `color.text.primary`, left border accent (4px, `brand.600`) |
| `disabled` | `color.text.disabled`, no interaction |

### Badge

```
• Item label         [3]
• Item label         [New]
```

- Badge appears on the right of the label.
- Types: count (numeric), label ("New", "Beta").
- Color: `brand.600` bg on `neutral.0` text or semantic colors for status.

### Nested navigation

```
• Parent item (expanded)
│ • Child item
│ • Child item (active)
│ • Child item
• Parent item (collapsed)
```

- Expand/collapse on click.
- Chevron icon rotates on expand.
- Only one parent can be expanded at a time (optional).

### Section label

```
SECTION LABEL
  • Item
  • Item
```

- `font.size.label.sm`, uppercase, `letter-spacing: 0.5px`.
- `color.text.tertiary`.
- Not clickable.
- Margin above: `spacing.4` (16px).

---

## Sidebar behavior

| Trigger | Behavior |
|---|---|
| Hover on collapsed | Show tooltip with label |
| Click collapse button | Toggle expanded / collapsed |
| `Cmd+\` / `Ctrl+\` | Toggle collapsed |
| Mobile open | Drawer slides from left |
| Mobile close | Tap outside or swipe back |

### Collapsed sidebar width

- 64px (icons only).
- Show tooltip on hover with item label.

### Responsive

| Breakpoint | Behavior |
|---|---|
| `≥ xl` (≥ 1280px) | Sidebar always visible |
| `lg`–`xl` (1024–1279px) | Sidebar collapsible |
| `md`–`lg` (768–1023px) | Sidebar collapsed by default |
| `< md` (< 768px) | Sidebar hidden, drawer on menu tap |

---

## Breadcrumb

```
Dashboard > Customers > ACME Corporation
```

- Shows path from root to current page.
- Each segment is clickable except the current (which is plain text).
- Truncate middle segments on long paths with `…` if > 4 levels.
- Mobile: show only `Dashboard > … > Current`.

### Anatomy

```
Segment 1 > Segment 2 > Segment 3 > Current
 [link]   [link]   [link]     [plain text]
```

- Separator: `>` or `/` (use consistently).
- Current page: no link, `color.text.primary`.
- Previous segments: `color.text.secondary`, hover → `color.text.link`.

---

## Tabs

### Page tabs (local tabs)

For switching between sub-sections of the same resource.

```
Overview | Details | Activity | Settings
─────────────────────────────────────────
[Content of active tab]
```

- Used within a page header context.
- Left-aligned under the page header.
- Max 6 tabs.

### Anatomy

```
Tab Label      Tab Label (active)     Tab Label
color.text.secondary    color.text.primary   color.text.secondary
              border-bottom: 2px      no border
              color.brand.600
```

| Part | Notes |
|---|---|
| Tab label | `font.size.label.md`, `font.weight.medium` |
| Active indicator | 2px bottom border, `color.brand.600` |
| Hover | `color.text.secondary` → `color.text.primary` |

### Tab states

| State | Visual |
|---|---|
| `default` | `color.text.secondary`, no border |
| `hover` | `color.text.primary` |
| `active` | `color.text.primary` + 2px `brand.600` border |
| `disabled` | `color.text.disabled` |

### Keyboard

- `Tab` / `Shift+Tab`: move to / from tab list.
- `→` / `←`: navigate tabs.
- `Enter` / `Space`: select focused tab.

---

## Page Header

The page header anchors the content below it.

```
┌─────────────────────────────────────────────────────────────────┐
│ Breadcrumb                                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Customers                                    [Invite] [Create]  │
│ Manage your customer base                                       │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│  Overview | Details | Activity                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Part | Required | Notes |
|---|---|---|
| Breadcrumb | Yes | See Breadcrumb section |
| Title | Yes | `heading.xl` (24px, 600), one per page |
| Description | No | One line, `body.md`, `color.text.secondary` |
| Metadata | No | Status badge, date, owner |
| Primary actions | No | Up to 2 buttons (primary + secondary) |
| Secondary actions | No | Overflow menu |
| Tabs | No | Page tabs for sub-sections |

### Title area

- Title: `font.size.heading.xl`, `font.weight.semibold`.
- Description: `font.size.body.md`, `color.text.secondary`.
- Actions right-aligned on same line as title.
- On mobile: actions below the title.

### Responsive

| Breakpoint | Behavior |
|---|---|
| `≥ md` | Actions on same row as title |
| `< md` | Actions below title, full width |

---

## Responsive navigation

### Desktop (≥ 1024px)

- Sidebar always visible (expanded or collapsed).
- Topbar visible.
- Breadcrumb shows full path.

### Tablet (768–1023px)

- Sidebar collapsed by default.
- Hamburger menu in topbar toggles sidebar.
- Breadcrumb truncates middle segments.

### Mobile (< 768px)

- Sidebar hidden.
- Hamburger → full-screen drawer navigation.
- Breadcrumb shows: `Home > Current`.
- Topbar collapses to: Logo + hamburger + user avatar.
- Action buttons full-width below page title.

---

## Do

- ✅ Show one active nav item clearly with left border accent.
- ✅ Keep nav hierarchy ≤ 2 levels deep.
- ✅ Use section labels to group related items.
- ✅ Show badge counts for items needing attention.
- ✅ Allow `Cmd+\` to toggle sidebar.
- ✅ Return to root after 4+ breadcrumb levels.

## Don't

- ❌ Don't nest navigation > 2 levels deep.
- ❌ Don't show > 10 nav items without grouping.
- ❌ Don't mix page tabs with sidebar navigation in the same visual space.
- ❌ Don't use tabs for more than 6 sub-sections.
- ❌ Don't use breadcrumb as primary navigation.
- ❌ Don't hard-code sidebar state — respect user preference.

---

## Related

- App shell structure: templates use this pattern
- Button: [`../components/Button.md`](../components/Button.md)
- Badge / status: [`data-display.md`](data-display.md)
- Templates: [`../templates/list-page.md`](../templates/list-page.md), [`../templates/detail-page.md`](../templates/detail-page.md)
