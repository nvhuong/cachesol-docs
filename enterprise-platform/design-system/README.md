# CacheSol Design System

> Modern enterprise software: clean, trustworthy, efficient, youthful.

## Overview

The CacheSol Design System is a **production-ready UI specification** for building consistent enterprise-grade interfaces across all CacheSol products. It serves as the single source of truth for visual language, interaction patterns, and component behavior.

**Goals:**

1. Give product designers a shared vocabulary and rules to design consistent UI.
2. Give frontend developers unambiguous specifications to implement components.
3. Give AI coding agents enough context to generate UI directly from documentation.
4. Enable multiple squads to ship consistent interfaces without coordination overhead.
5. Provide a foundation that can later evolve into a full component library.

**Scope:**

- **In scope:** Tokens, components, patterns, templates, accessibility, responsive behavior, density modes.
- **Out of scope:** Implementation framework (React/Vue/Angular), build tooling, brand marketing assets.

**Audience:**

| Role | Use this for |
|---|---|
| Product Designer | Designing screens with consistent visual language |
| Frontend Developer | Implementing components to exact specification |
| Design System Maintainer | Extending tokens, components, and patterns |
| AI Coding Agent | Generating UI from structured specification |

---

## Design Principles

### Clarity
Information hierarchy must be unambiguous. Users should never wonder what action to take next, what a value means, or whether something succeeded.

### Consistency
Every component is built from the same tokens. Same problem → same solution across the product.

### Efficiency
Enterprise users perform the same tasks hundreds of times. Density, keyboard shortcuts, and bulk actions are first-class citizens.

### Accessibility
WCAG 2.2 AA is the floor, not the ceiling. Color is never the only signal. Keyboard navigation works everywhere.

### Scalability
The system grows with the product. New components compose from existing primitives. Tokens can be re-themed without rewriting components.

### Trust
Predictable behavior. No surprise destructive actions. Always show the path forward when something fails.

### Progressive Disclosure
Show only what's needed for the current task. Reveal complexity as users need it.

---

## Architecture

The Design System follows a strict 4-layer architecture. **Dependencies flow downward only.**

```
Tokens          ← Raw values (colors, sizes, durations)
   ↓
Components      ← Self-contained UI primitives (Button, Input, Table)
   ↓
Patterns        ← Composition rules for solving recurring UX problems (forms, navigation)
   ↓
Templates       ← Page-level wireframes combining patterns into complete screens
```

### Layer responsibilities

| Layer | Responsibility | Example |
|---|---|---|
| **Tokens** | Atomic values. No decisions, only data. | `--color-brand-600`, `--spacing-4` |
| **Components** | Self-contained UI with API, states, behavior. Use tokens only. | `<Button variant="primary">` |
| **Patterns** | Compose components to solve recurring UX problems. No new primitives. | "Form section with required indicators" |
| **Templates** | Page wireframes combining patterns. Specific to use cases. | Customer List Page |

**Rule:** A Component **must not** reference a Template. A Pattern must not reference a Template. Dependencies only flow downward.

---

## Naming Convention

### Token naming

Tokens use dot-separated names. Type prefix first, then purpose, then variant.

```
color.brand.600           # primitive: brand palette
color.text.primary        # semantic: text color
color.bg.surface          # semantic: surface background
spacing.4                 # primitive: spacing value
radius.md                 # primitive: radius value
shadow.lg                 # primitive: shadow value
font.size.body.md         # typography
font.weight.semibold      # typography
motion.duration.fast      # motion
```

### Component naming

Component names use PascalCase. Variants use kebab-case lowercase.

```
Button.primary
Button.secondary
Button.destructive

Table.comfortable
Table.default
Table.compact
```

### State naming

```
default
hover
focus
focus-visible
active
selected
disabled
loading
error
success
readonly
```

### Size naming

```
xs
sm
md           # default
lg
xl
2xl
```

### Semantic color naming

```
color.bg.surface
color.text.primary
color.border.default
color.action.primary
color.status.success
color.status.error
color.status.warning
color.status.info
```

---

## Design System Rules

These rules are **non-negotiable**. They prevent drift and inconsistency.

### Token rules

1. **Never use hex/rgb directly in components** when a semantic token exists.
2. **Never create ad-hoc spacing values** — use the 4px scale (`spacing.1`, `spacing.2`, etc.).
3. **Never use a font size outside the typography scale.**
4. **Never use a color outside the palette + semantic tokens.**

### Component rules

5. **Compose before creating.** If a need can be solved by combining existing components, do not create a new one.
6. **Same problem → same component.** Do not create variants that duplicate functionality.
7. **Component states are exhaustive.** A component missing a state must be fixed, not worked around.

### Interaction rules

8. **Color is never the only signal.** Pair color with icon, text, or shape.
9. **Destructive actions require confirmation** when consequences are hard to reverse.
10. **Loading states have a timeout.** Long operations move to background with status updates.
11. **Focus state is always visible** for keyboard navigation.

### Content rules

12. **Error messages answer three questions:** What happened? Why? What can the user do?
13. **Avoid jargon.** Use business language, not technical language.
14. **Action labels are verbs.** "Approve", "Reject", "Save Draft" — not "OK", "Submit", "Confirm".

---

## Accessibility

### Baseline requirements (WCAG 2.2 AA)

- **Color contrast:** text ≥ 4.5:1 against background; large text (≥ 18.66px bold or 24px) ≥ 3:1.
- **UI component contrast:** interactive borders and focus rings ≥ 3:1 against adjacent colors.
- **Keyboard navigation:** every interactive element is reachable via Tab; Enter/Space activates.
- **Focus visible:** focus ring is never suppressed without an alternative indicator.
- **Screen reader:** every interactive element has an accessible name; icons without text have `aria-label`.
- **Error identification:** errors are announced (`aria-live="polite"`); described in text, not only color.
- **Disabled state:** never conveyed by color alone — also reduce opacity + add `aria-disabled`.
- **Motion:** respect `prefers-reduced-motion`. Animations must be disable-able.
- **Touch targets:** minimum 44×44 px on touch devices.

### Focus ring

```
focus-ring: 2px solid color.border.focus
focus-ring-offset: 2px
focus-ring-color: currentColor where applicable
```

---

## Responsive Philosophy

Desktop-first for enterprise productivity. Responsive down to mobile.

### Breakpoints

| Token | Min-width | Typical device |
|---|---|---|
| `xs` | 0px | Mobile portrait |
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape / small laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

### Component behavior by breakpoint

| Component | <md | md–lg | ≥lg |
|---|---|---|---|
| Sidebar | Drawer | Collapsible | Always visible |
| Table | Card view or horizontal scroll | Full table | Full table |
| Form | Single column | Single column | 2-column where appropriate |
| Modal | Full screen | Centered 80% width | Centered, max-width |
| Dashboard cards | 1 column | 2 columns | 3–4 columns |

### Page horizontal padding

| Breakpoint | Padding |
|---|---|
| < 768px (`<md`) | 16px |
| 768–1279px (`md`–`xl`) | 24px |
| ≥ 1280px (`xl`+) | 32px |

---

## Density Philosophy

Enterprise apps show lots of data. Density is a first-class concern.

### Three density modes

| Mode | Row height (table) | Use case |
|---|---|---|
| **Comfortable** | 56px | Read-heavy screens, dashboards, on-detail review |
| **Default** | 48px | Default for tables and forms |
| **Compact** | 36px | Power users, dense lists, search results |

### When to use each

- **Comfortable:** tables with rich content per row (avatars, multi-line cells), approval screens, mobile.
- **Default:** standard CRUD lists.
- **Compact:** financial tables, transaction logs, dense admin views.

### User preference

Density is exposed as a **user preference** (not just per-page). Saved to user profile. Default = `Default`.

---

## Content Principles

### Voice

- **Concise.** Prefer 4 words over 8.
- **Action-oriented.** Buttons are verbs.
- **Specific.** "Approve invoice" beats "Submit".

### Labels

| Avoid | Prefer |
|---|---|
| Submit | Save, Create, Approve |
| OK | Got it, Continue |
| Cancel | Discard changes |
| Error | Specific problem description |

### Numbers

- Use `tabular-nums` for numeric columns.
- Currency: include symbol, thousands separator, decimal places consistent with locale.
- Dates: locale-aware. Default `DD MMM YYYY` (e.g. `18 Sep 2026`).
- Truncate large numbers with tooltip showing exact value.

### Status labels

| Status | Label | Color semantic |
|---|---|---|
| Draft | Draft | neutral |
| Pending | Pending | warning |
| In review | In review | info |
| Approved | Approved | success |
| Rejected | Rejected | error |
| Cancelled | Cancelled | neutral |
| Expired | Expired | warning |
| Failed | Failed | error |

---

## Iconography

### Icon family

**Primary:** [Lucide](https://lucide.dev) — clean, consistent stroke-based icons.

**Acceptable:** [Phosphor](https://phosphoricons.com) — when more visual weight is needed.

**Do not mix** icon families in the same product area.

### Sizes

```
16px   — inline with body text, table actions
18px   — slightly larger inline
20px   — form field icons, list-item icons
24px   — standalone icons, sidebar nav, top-bar actions
```

### Usage rules

- Icon-only buttons **must** have `aria-label` or tooltip.
- Never use icon alone when text would be clearer.
- Icons inside text follow text color, unless semantically different.
- Decorative icons use `aria-hidden="true"`.

---

## Interaction & Motion

### Duration

| Token | Duration | Usage |
|---|---|---|
| `motion.duration.instant` | 0ms | Disabled, no animation |
| `motion.duration.fast` | 100ms | Hover, focus, small state changes |
| `motion.duration.default` | 150ms | Most transitions (buttons, inputs) |
| `motion.duration.slow` | 200ms | Modals, drawers, large surfaces |

> No interaction animation should exceed 300ms.

### Easing

| Token | Value | Usage |
|---|---|---|
| `motion.easing.standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default — entrance/exit |
| `motion.easing.decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Entering elements |
| `motion.easing.accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | Leaving elements |
| `motion.easing.emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | Important state changes |

### Reduced motion

All animations respect `@media (prefers-reduced-motion: reduce)`. When reduced motion is enabled, replace transitions with instant state changes — do not just shorten them.

---

## Folder Structure

```
design-system/
├── README.md              ← you are here
├── tokens/                ← atomic values
│   ├── README.md
│   ├── colors.md
│   ├── typography.md
│   ├── spacing.md
│   └── shadows.md
├── components/            ← self-contained UI primitives
│   ├── README.md
│   ├── Button.md
│   ├── Input.md
│   ├── Select.md
│   ├── Table.md
│   └── Modal.md
├── patterns/              ← composition rules
│   ├── README.md
│   ├── forms.md
│   ├── navigation.md
│   ├── data-display.md
│   └── feedback.md
└── templates/             ← page-level wireframes
    ├── README.md
    ├── list-page.md
    ├── detail-page.md
    ├── form-page.md
    └── dashboard-page.md
```

See also:

- Tokens: [`tokens/README.md`](tokens/README.md)
- Components: [`components/README.md`](components/README.md)
- Patterns: [`patterns/README.md`](patterns/README.md)
- Templates: [`templates/README.md`](templates/README.md)
