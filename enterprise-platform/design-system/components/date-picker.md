# Date Picker

The Date Picker lets the user select a single date, date range, or month from a calendar interface.

---

## Purpose

Capture a date or date range without requiring the user to type the format.

**Use when:**
- The user needs to pick a specific date (birthday, expiry, deadline).
- The user needs a date range (reporting period, schedule).
- The user needs month/year selection (billing cycle, period).

**Not for:**
- Free-form date entry → use Input with format helper.
- Time-only → use Time Picker.
- Predefined relative dates (today, last 7 days) → use a Date range preset Select.

---

## Anatomy

### Closed state

```
┌────────────────────────────────────────┐
│ 📅  18 Sep 2026                        │
└────────────────────────────────────────┘
```

### Open state (single date)

```
┌──────────────────────────────────────────────┐
│  ◀   September 2026                        ▶ │
│ ───────────────────────────────────────────── │
│  Mo  Tu  We  Th  Fr  Sa  Su                   │
│       1   2   3   4   5   6                   │
│   7   8   9  10  11  12  13                   │
│  14  15  16  [17]  18  19  20   ← today       │
│  21  22  23  24  25  26  27                   │
│  28  29  30                                  │
│ ───────────────────────────────────────────── │
│           [Today]   [Clear]                  │
└──────────────────────────────────────────────┘
```

### Range picker open state

```
┌─────────────────────────────┬─────────────────────────────┐
│  ◀  September 2026        ▶ │  ◀  October 2026          ▶ │
│  Mo Tu We Th Fr Sa Su       │  Mo Tu We Th Fr Sa Su       │
│       1  2  3  4  5  6      │           1  2  3  4  5     │
│   7  8  9 10 11 12 13       │   6  7  8  9 10 11 12      │
│  14 15[16]17[18]19 20 21    │  13 14 15 16 17 18 19      │
│  ...                        │   ...                       │
└─────────────────────────────┴─────────────────────────────┘
       Start date             End date
```

| Part | Required | Notes |
|---|---|---|
| Trigger | Yes | Shows selected date or placeholder |
| Calendar icon | Yes | 16px, prefix |
| Calendar header | Yes | Month/year nav |
| Day cells | Yes | In 7-column grid |
| Selected day | Yes | Highlighted |
| Today indicator | Yes | Border or underline |
| Range selection | Yes (range) | Shows start–end span |
| Today / Clear actions | Yes | Bottom-right |

---

## Variants

| Variant | Use case |
|---|---|
| `date` | Single date selection |
| `range` | Start + end date |
| `month` | Month + year only |
| `dateTime` | Date + time |
| `time` | Time only (separate Time Picker if standalone needed) |

Default: `date`.

---

## Sizes

Same sizing as Input. Default: `md`.

| Size | Height | Padding |
|---|---|---|
| `sm` | 32px | `spacing.3` (12px) |
| `md` | 40px | `spacing.3` (12px) |
| `lg` | 48px | `spacing.4` (16px) |

---

## States

| State | Visual |
|---|---|
| `default` | Border `color.border.default` |
| `hover` | Border `color.border.strong` |
| `focus` | Border + focus ring (`color.border.focus`) |
| `open` | Border + focus ring, calendar visible below |
| `disabled` | 50% opacity, `not-allowed` cursor |
| `error` | Border `color.border.error` + error message |
| `readonly` | Shows value, not editable |

### Day cell states

| State | Visual |
|---|---|
| `default` | `color.text.primary` |
| `hover` | `color.bg.subtle` |
| `today` | Border, ring of `color.brand.500` |
| `selected` | `color.bg.brand` + white text |
| `in-range` | `color.bg.brand-subtle` (range picker) |
| `disabled` | `color.text.disabled` + strikethrough |
| `outside-month` | `color.text.tertiary` |

---

## Props / conceptual API

```text
variant:        "date" | "range" | "month" | "dateTime"
size:           "sm" | "md" | "lg"
value:          Date | [Date, Date] | null
defaultValue:   Date | [Date, Date] | null
placeholder:    string                       // hint when no value
format:         string                       // "DD MMM YYYY", "DD/MM/YYYY", etc.
disabled:       boolean
error:          boolean
required:       boolean
minDate:        Date | null                  // min selectable date
maxDate:        Date | null                  // max selectable date
disabledDate:   (date: Date) => boolean      // dynamic disable
helperText:     string | null
onChange:       (value: Date | [Date, Date] | null) => void
onOpenChange:   (open: boolean) => void
locale:         string                       // "vi-VN", "en-US"
firstDayOfWeek: 0 | 1                         // 0=Sunday, 1=Monday
```

---

## Behavior

### Opening

- Click trigger to open.
- Or focus + `Enter` / `Space`.
- Calendar appears below trigger, aligned to left edge.
- On mobile, calendar becomes full-width overlay.

### Selection

- Click day → selects.
- Range: first click sets start, second click sets end (if after start) or resets.
- Range: shift+click extends range.

### Today / Clear

- "Today" sets value to current date (closes calendar).
- "Clear" empties value.

### Keyboard

| Key | Action |
|---|---|
| `Tab` / `Shift+Tab` | Move to / from picker |
| `Enter` / `Space` | Open calendar (when closed) |
| `↑` / `↓` | Previous / next week |
| `←` / `→` | Previous / next day |
| `Page Up` / `Page Down` | Previous / next month |
| `Shift+Page Up/Down` | Previous / next year |
| `Home` / `End` | First / last day of month |
| `Enter` | Select focused day |
| `Escape` | Close calendar |

### Locale

- Use the user's locale to determine first day of week, weekday labels, and date format.
- Default: `en-US` if no locale specified.
- Vietnamese (vi-VN): `Thứ 2 → CN`, first day Monday.

---

## Format guidelines

| Locale | Default format |
|---|---|
| `en-US` | `MM/DD/YYYY` |
| `vi-VN` | `DD/MM/YYYY` |
| `en-GB` | `DD/MM/YYYY` |
| Custom | Configurable |

Recommended display formats:

| Type | Format | Example |
|---|---|---|
| Standard | `DD MMM YYYY` | `18 Sep 2026` |
| With time | `DD MMM YYYY HH:mm` | `18 Sep 2026 14:30` |
| Numeric | `DD/MM/YYYY` | `18/09/2026` |
| ISO | `YYYY-MM-DD` | `2026-09-18` (for technical fields) |

---

## Accessibility

- Trigger has `aria-haspopup="dialog"`, `aria-expanded`.
- Calendar has `role="dialog"` with `aria-label="Choose date"`.
- Each day has `role="gridcell"`, `aria-selected`.
- Selected day has `aria-label="Selected: 18 Sep 2026"`.
- Today announced: `aria-label="Today, 18 Sep 2026"`.
- Disabled days have `aria-disabled="true"`.
- Error uses `aria-invalid="true"` and message via `aria-describedby`.

---

## Responsive behavior

| Breakpoint | Behavior |
|---|---|
| `≥ md` | Calendar popup 320px wide |
| `< md` | Calendar fills viewport width minus `spacing.4` |

Range picker on mobile: two calendars stack vertically.

---

## Content guidelines

### Placeholder

- "Select date", "Pick a date range".
- Don't put a sample date as placeholder (confusing).

### Helper text

- Use to clarify format: "Format: DD/MM/YYYY".
- Or to clarify date semantics: "Filter by submission date".

### Empty state

- Trigger shows placeholder.
- Calendar shows current month with no selection.

---

## Do

- ✅ Use locale-aware format.
- ✅ Provide helper text for non-standard formats.
- ✅ Support keyboard navigation.
- ✅ Use `aria-label` with full date for selected day.
- ✅ Show "Today" indicator.

## Don't

- ❌ Don't use MM/DD/YYYY for international users (ambiguous).
- ❌ Don't disable past dates without showing why.
- ❌ Don't require manual date typing.
- ❌ Don't show time picker for date-only fields.
- ❌ Don't show all 12 months — use month/year navigation.

---

## Related

- Input field (for manual date entry): [`input.md`](input.md)
- Select (for predefined date ranges): [`select.md`](select.md)
- Forms pattern: [`../patterns/forms.md`](../patterns/forms.md)
- Filter / search pattern: [`../patterns/forms.md`](../patterns/forms.md)
