# Tokens

Tokens are the **atomic values** of the Design System. They are pure data — no decisions, no components, no behavior.

## Token hierarchy

```
Primitive tokens        ← raw values (color palette, spacing scale)
   ↓
Semantic tokens        ← purpose-bound (text.primary, bg.surface)
   ↓
Component tokens        ← component-specific (button.primary.background)
```

### Why three layers?

**Primitive tokens** are the raw scale. They define "what colors exist" without saying what they're for.

**Semantic tokens** answer "what is this color used for?" They reference primitive tokens but bind them to intent. When you re-theme the app, you change semantic mappings, not components.

**Component tokens** (optional) let a component override its look without breaking the semantic mapping. For example, a specific data viz chart may need a different blue than `color.action.primary`.

**Rule:** Components **must not** reference primitive tokens directly when a semantic token exists. If you find yourself writing `color.brand.600` in a component, you're missing a semantic token — add it.

---

## Token type layers

| Type | Example | Layer |
|---|---|---|
| `color.brand.600` | `#2563EB` | Primitive |
| `color.text.primary` | `neutral.900` | Semantic |
| `button.primary.bg` | `color.action.primary` | Component |

---

## Files

| File | Purpose |
|---|---|
| [`colors.md`](colors.md) | Color system: palette, semantic tokens, status colors |
| [`typography.md`](typography.md) | Font families, type scale, weights, numeric formatting |
| [`spacing.md`](spacing.md) | Spacing scale, radius, layout sizing |
| [`shadows.md`](shadows.md) | Elevation system |

---

## Extension principles

### When to add a new token

- The value is **reused** in at least 3 places.
- The value represents a **concept**, not a one-off.
- Removing it would force hard-coded values somewhere.

### When NOT to add a token

- Used only once → inline value or local CSS variable.
- Just a slightly different shade → use existing token.

### Naming

- Always lowercase, dot-separated.
- Type prefix first: `color`, `spacing`, `font`, `radius`, `shadow`, `motion`.
- Semantic names describe **purpose**, not appearance. `color.text.primary` ✓, `color.gray.900` ✗.

### Token conflicts

If two tokens resolve to the same value but have different names, that's a **conflict**. Resolve by:
1. Picking the more semantic name.
2. Deprecating the other.
3. Adding a migration note.

---

## Implementation notes

These tokens can be expressed in:

- **CSS custom properties** — `--color-text-primary: var(--color-neutral-900);`
- **JSON** — for tooling and Figma sync
- **TypeScript / typed objects** — for code-level usage
- **Tailwind config** — `colors: { 'text.primary': 'var(--color-text-primary)' }`

The token **names** defined in this design system are framework-agnostic. Bind them to your tooling of choice.

---

## Cross-references

- Components must consume tokens: see [`../components/README.md`](../components/README.md)
- Patterns compose components that already use tokens: see [`../patterns/README.md`](../patterns/README.md)
