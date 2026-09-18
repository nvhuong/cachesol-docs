# Templates

Templates are **page-level wireframes** that combine patterns into complete, production-ready screen layouts.

## What lives here

| File | Template |
|---|---|
| [`list-page.md`](list-page.md) | List page (e.g. Customer List, Transaction List) |
| [`detail-page.md`](detail-page.md) | Detail page (e.g. Customer Detail, Order Detail) |
| [`form-page.md`](form-page.md) | Create / Edit form page |
| [`dashboard-page.md`](dashboard-page.md) | Dashboard page |

## What does NOT live here

- **Components** — go in [`../components/`](../components/) (e.g. Button, Input).
- **Patterns** — go in [`../patterns/`](../patterns/) (e.g. Form Section, Card Grid).

## Rules

1. **Templates use patterns and components.** They don't define new primitives.
2. **Templates are specific to use cases.** They're not generic abstractions.
3. **Templates show full page structure.** Including app shell, page header, and all content.
4. **Templates define density, responsiveness, and interaction flow.**
5. **Each template covers all states:** loading, empty, error, default.

## Architecture

```
Tokens (raw values)
   ↓
Components (primitives)
   ↓
Patterns (composition rules)
   ↓
Templates (page wireframes)    ← you are here
```

**Templates must not reference Tokens directly.** They go through Components and Patterns.

## Content

Each template includes:

1. **Purpose** — what screen it is and when to use.
2. **Anatomy** — full wireframe structure.
3. **Desktop layout** — primary layout.
4. **Tablet layout** — adapted layout.
5. **Mobile layout** — adapted layout.
6. **States** — loading, empty, error, default.
7. **Interaction flow** — how users navigate to/from this page.
8. **Examples** — real-world use cases.

## Cross-references

- Components: [`../components/`](../components/)
- Patterns: [`../patterns/`](../patterns/)
- Tokens: [`../tokens/`](../tokens/)
