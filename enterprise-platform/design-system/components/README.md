# Components

Components are **self-contained UI primitives** with a defined API, states, and behavior. They consume tokens — they do not invent their own values.

## What lives here

| File | Component |
|---|---|
| [`Button.md`](Button.md) | Button |
| [`Input.md`](Input.md) | Input |
| [`Select.md`](Select.md) | Select / Combobox |
| [`Table.md`](Table.md) | Data Table |
| [`Modal.md`](Modal.md) | Modal / Dialog |

## What does NOT live here

- **Composites** — go in [`../patterns/`](../patterns/) (e.g. a Form Section).
- **Screens** — go in [`../templates/`](../templates/) (e.g. a Customer List Page).

---

## Component documentation standard

Every component file follows the same structure so designers, developers, and AI agents can navigate predictably.

```
1. Purpose
2. When to use
3. When not to use
4. Anatomy
5. Variants
6. Sizes
7. States
8. Props / conceptual API
9. Behavior
10. Keyboard interaction
11. Accessibility
12. Responsive behavior
13. Content guidelines
14. Do
15. Don't
16. Examples
17. Related components
```

---

## Rules for components

### Consumption

1. **Always use semantic tokens.** No raw hex, no ad-hoc values.
2. **Always use the spacing scale.** No `13px`.
3. **Always use the typography scale.** No `15px` font size.

### Composition

4. **Compose before creating.** If you need a "Save + Continue" button, use existing Button + spacing, don't make a new component.
5. **Same problem → same component.** Variants handle differences; new components are last resort.

### States

6. **States are exhaustive.** A component must define: default, hover, focus, focus-visible, active, disabled, loading, error, success (where applicable), readonly.
7. **Never convey state with color alone.** Pair color with icon, text, or shape.
8. **Disabled is not invisible.** Disabled controls still show their structure, just with reduced opacity + non-color signal.

### Accessibility

9. **Keyboard accessible.** Tab to focus, Enter/Space to activate.
10. **Focus always visible.**
11. **Screen reader names.** Every interactive element has an accessible name.

### Naming

12. **Variants** use kebab-case: `primary`, `secondary`, `destructive`.
13. **Sizes** use `sm | md | lg`.
14. **States** use predefined names: `default`, `hover`, `focus`, `disabled`, `loading`, `error`, `readonly`.

---

## Cross-references

- Tokens: [`../tokens/`](../tokens/)
- Patterns compose components: [`../patterns/`](../patterns/)
- Templates combine patterns: [`../templates/`](../templates/)
