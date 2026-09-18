# Typography

Optimized for **enterprise interfaces**: dense information, long reading sessions, mixed numeric and text content. Modern, clean, and highly legible.

---

## Font Family

### Primary

```
Inter
```

Variable font, optimized for screen, excellent numeric features.

### Fallback stack

```css
font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
             Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Monospace (for code, IDs, technical values)

```
"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco,
Consolas, "Liberation Mono", "Courier New", monospace;
```

---

## Font Weight

| Token | Value | CSS | Usage |
|---|---|---|---|
| `font.weight.regular` | 400 | `400` | Body text |
| `font.weight.medium` | 500 | `500` | UI labels, table headers, button labels |
| `font.weight.semibold` | 600 | `600` | Section headings, emphasis |
| `font.weight.bold` | 700 | `700` | Page titles, KPI numbers |

**Rules:**

- Don't use weight below 400 for UI text.
- Don't use weight above 700 — go to a larger size instead.
- Pair weight + size deliberately. Don't compensate for low hierarchy with weight alone.

---

## Type Scale

12 named styles covering enterprise UI needs. Enterprise apps shouldn't have huge font sizes.

| Token | Size | Line height | Weight | Letter spacing | Usage |
|---|---|---|---|---|---|
| `font.size.display.lg` | 36px | 44px (1.22) | 700 | -0.5px | Hero numbers, login hero |
| `font.size.display.md` | 30px | 38px (1.27) | 700 | -0.4px | Marketing-style hero |
| `font.size.heading.xl` | 24px | 32px (1.33) | 600 | -0.3px | Page title |
| `font.size.heading.lg` | 20px | 28px (1.4) | 600 | -0.2px | Section title, modal title |
| `font.size.heading.md` | 18px | 26px (1.44) | 600 | -0.1px | Subsection title |
| `font.size.heading.sm` | 16px | 24px (1.5) | 600 | 0 | Card title, table header |
| `font.size.body.lg` | 16px | 24px (1.5) | 400 | 0 | Lead paragraph |
| `font.size.body.md` | 14px | 20px (1.43) | 400 | 0 | Default body, table cell |
| `font.size.body.sm` | 13px | 18px (1.38) | 400 | 0 | Dense tables, secondary info |
| `font.size.label.md` | 14px | 20px (1.43) | 500 | 0 | Form label, button text |
| `font.size.label.sm` | 12px | 16px (1.33) | 500 | 0.2px | Tag, badge, caption |
| `font.size.caption` | 12px | 16px (1.33) | 400 | 0 | Helper text, footnotes |
| `font.size.code` | 13px | 20px (1.54) | 400 | 0 | Code, technical IDs |

### Compact density adjustments

In Compact mode, do **not** shrink font size. Instead, reduce row height via padding.

---

## Heading Hierarchy

Use semantic HTML (`<h1>` → `<h6>`). Don't skip levels.

| Level | Token | Used for |
|---|---|---|
| `h1` | `font.size.heading.xl` | Page title (one per page) |
| `h2` | `font.size.heading.lg` | Section title |
| `h3` | `font.size.heading.md` | Subsection, card title |
| `h4` | `font.size.heading.sm` | Group within card |
| `h5` | `font.size.body.lg` + semibold | Minor heading |
| `h6` | `font.size.body.md` + semibold | Tiny heading |

**Rule:** Only ONE `h1` per page. Don't use `h2` size with `h4` weight to fake a heading — use the right level.

---

## Numeric Typography

Numbers in tables need consistent width and alignment.

### Tabular numbers

Apply to any column with numbers, currency, or percentages:

```css
font-variant-numeric: tabular-nums;
font-feature-settings: "tnum" 1;
```

| Token | Class | Effect |
|---|---|---|
| `font.numeric.tabular` | `tabular-nums` | Equal-width digits |
| `font.numeric.lining` | `lining-nums` | Default; numbers sit on baseline |
| `font.numeric.fraction` | `frac 1` | Auto-converts 1/2 → ½ |

### Right-align all numeric columns

Use `text-align: end` for table cells containing numbers, currency, or percentages.

### KPI numbers

```
font-size: font.size.display.lg (36px)
font-weight: font.weight.bold (700)
font-variant-numeric: tabular-nums
letter-spacing: -0.5px
```

### Large numbers

Truncate with `…K`, `…M`, `…B` for at-a-glance KPIs. Hover tooltip shows exact value.

```
1.2K    → 1,234
3.4M    → 3,456,789
$1.2M   → $1,234,567
```

---

## Long Text

### Truncation

Single line:

```css
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
```

Multi-line (max 2 lines):

```css
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;
```

### Wrapping

- Default `word-wrap: break-word` on long URLs/IDs.
- `word-break: break-word` for paths/identifiers without spaces.
- Don't break words in normal prose.

---

## Uppercase Usage

Use sparingly. Uppercase reduces readability.

| Use case | Style |
|---|---|
| Button labels | NO — sentence case preferred |
| Tags / Badges | YES, with `letter-spacing: 0.5px` |
| Section labels in dense forms | YES, optional |
| Form labels | NO |

Example tag:
```
STATUS
font-size: font.size.label.sm
font-weight: font.weight.semibold
text-transform: uppercase
letter-spacing: 0.5px
```

---

## Color in Typography

| Token | Hex | Used for |
|---|---|---|
| `color.text.primary` | `neutral.900` | Headings |
| `color.text.secondary` | `neutral.700` | Body text |
| `color.text.tertiary` | `neutral.500` | Captions |
| `color.text.disabled` | `neutral.400` | Disabled |
| `color.text.inverse` | `neutral.0` | On dark surface |
| `color.text.link` | `brand.600` | Links |
| `color.text.error` | `error.700` | Error text |

See [`colors.md`](colors.md) for full token list.

---

## Responsive typography

### Heading scale on mobile

| Desktop | Mobile (<768px) |
|---|---|
| `display.lg` (36px) | `display.md` (30px) |
| `display.md` (30px) | `heading.xl` (24px) |
| `heading.xl` (24px) | `heading.lg` (20px) |
| `heading.lg` (20px) | `heading.md` (18px) |

Body text stays at `body.md` (14px) on all breakpoints.

---

## Examples by use case

### Table

```css
font-size: font.size.body.md;       /* 14px */
font-weight: font.weight.regular;
font-variant-numeric: tabular-nums;
```

### Table header

```css
font-size: font.size.label.sm;      /* 12px */
font-weight: font.weight.semibold;
text-transform: uppercase;
letter-spacing: 0.5px;
color: color.text.tertiary;
```

### Page title

```html
<h1 style="font-size: 24px; font-weight: 600; letter-spacing: -0.3px;">
  Customers
</h1>
```

### Button label

```css
font-size: font.size.label.md;       /* 14px */
font-weight: font.weight.semibold;
```

### Form helper

```css
font-size: font.size.caption;
color: color.text.tertiary;
```

---

## Don't

- ❌ Don't go below 12px (12 is the minimum for readability).
- ❌ Don't use more than 3 weights on a single screen.
- ❌ Don't set line-height < 1.2 for body text.
- ❌ Don't use uppercase for paragraphs or button labels.
- ❌ Don't compensate for hierarchy by weight alone — use size and color.

---

## Related

- Color tokens: [`colors.md`](colors.md)
- Spacing tokens: [`spacing.md`](spacing.md)
- Button component uses these tokens: [`../components/Button.md`](../components/Button.md)
