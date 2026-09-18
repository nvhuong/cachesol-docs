# Patterns

Patterns are **composition rules** that solve recurring UX problems by combining components. They do not introduce new primitives — they define how components work together.

## What lives here

| File | Pattern |
|---|---|
| [`forms.md`](forms.md) | Form composition patterns |
| [`navigation.md`](navigation.md) | App shell, sidebar, tabs, breadcrumbs |
| [`data-display.md`](data-display.md) | Cards, badges, KPIs, status tags, charts |
| [`feedback.md`](feedback.md) | Toast, alerts, loading, empty states, confirmation |

## What does NOT live here

- **Components** — go in [`../components/`](../components/) (e.g. Button, Input, Table).
- **Templates** — go in [`../templates/`](../templates/) (e.g. Customer List Page).

## Rules

1. **Patterns compose components.** No new primitives.
2. **Patterns don't reference templates.** Only components.
3. **Patterns are reusable.** A pattern must solve a general problem, not a specific screen.
4. **Document the why.** Each pattern explains when to use and when not to use.

## Architecture

```
Tokens (raw values)
   ↓
Components (primitives)
   ↓
Patterns (composition rules)   ← you are here
   ↓
Templates (page wireframes)
```

---

## Cross-references

- Components: [`../components/`](../components/)
- Templates use patterns: [`../templates/`](../templates/)
- Tokens: [`../tokens/`](../tokens/)
