# Tree

Tree displays hierarchical data with expandable/collapsible nodes. Used for navigation, org charts, file browsers, and category hierarchies.

---

## Purpose

Display and interact with hierarchical data.

**Use when:**
- Data has clear parent-child relationships.
- User needs to navigate the hierarchy.
- User needs to select one or multiple nodes.
- Categories, departments, file systems.

**Not for:**
- Flat lists → use List or Select.
- Tables with multiple fields → use Table.
- Visualizations of network graphs.

---

## Anatomy

```
▼ 📁 Engineering
  ▼ 📁 Frontend
    • React Team
    • Vue Team
  ▶ 📁 Backend
  • DevOps
▶ 📁 Sales
▼ 📁 Operations
  • HR
  • Finance
```

| Part | Required | Notes |
|---|---|---|
| Tree node | Yes | Label + expand indicator |
| Expand/collapse icon | Yes | `▶` collapsed, `▼` expanded |
| Icon | No | Custom icon per node type |
| Checkbox | No | When using checkable variant |
| Drag handle | No | When using draggable variant |
| Connection lines | No | Optional visual hierarchy |

---

## Variants

| Variant | Use case |
|---|---|
| `basic` | Display hierarchy, click to navigate |
| `checkable` | Multi-select nodes (org membership) |
| `draggable` | Reorganize hierarchy |
| `async` | Lazy load children on expand |
| `searchable` | Filter and highlight matching nodes |

Default: `basic`.

---

## Sizes

| Size | Row height | Padding Y | Padding X | Font |
|---|---|---|---|---|
| `sm` | 28px | `spacing.1` | `spacing.2` | `font.size.body.sm` |
| `md` | 36px | `spacing.2` | `spacing.3` | `font.size.body.md` |
| `lg` | 44px | `spacing.2` | `spacing.4` | `font.size.body.lg` |

Default: `md`.

---

## States

| State | Visual |
|---|---|
| `default` | `color.text.primary` |
| `hover` | `color.bg.subtle` |
| `selected` | `color.bg.selected`, `color.text.primary` |
| `focus` | 2px focus ring around row |
| `disabled` | `color.text.disabled` |
| `dragging` | Slight shadow, 50% opacity on source |
| `drop-target` | Border around target, highlight |

---

## Props / conceptual API

```text
data:           TreeNode[]
variant:        "basic" | "checkable" | "draggable" | "async" | "searchable"
size:           "sm" | "md" | "lg"
defaultExpandAll: boolean
expandedKeys:   string[]
onExpand:       (keys: string[], info: { node, expanded }) => void
selectedKeys:   string[]
onSelect:       (keys: string[], info: { node, selected }) => void
checkedKeys:    string[] | { checked: string[], halfChecked: string[] }
onCheck:        (keys) => void
loadData:       (node: TreeNode) => Promise<TreeNode[]>      // async variant
searchValue:    string                                       // searchable variant
onSearch:       (value: string) => void
showLine:       boolean
showIcon:       boolean
draggable:      boolean
onDrop:         (info: { dragNode, dropNode, dropPosition }) => void
virtual:        boolean                                      // for large trees
height:         number                                       // virtual height

TreeNode {
  key:         string
  title:       string
  icon?:       IconName
  children?:   TreeNode[]
  isLeaf?:     boolean
  disabled?:   boolean
  selectable?: boolean
  checkable?:  boolean
  draggable?:  boolean
}
```

---

## Behavior

### Expand / collapse

- Click expand icon → expand / collapse.
- Click label → in basic variant, also toggles expand.
- In selectable variant, click label selects but doesn't expand.

### Selection (basic)

- Click selects node.
- Hold `Shift` to select range.
- Hold `Cmd/Ctrl` to add to selection.

### Checkable

- Click checkbox → check / uncheck.
- Parent auto-checks when all children checked.
- Parent shows indeterminate when partially checked.

### Async

- On expand, call `loadData(node)` to fetch children.
- Show spinner inside node while loading.
- If load fails, show retry option.

### Search

- Type in search → highlight matching nodes.
- Auto-expand path to matches.
- "No results" when no matches.
- Match: case-insensitive substring.

### Drag and drop

- Drag node → show drop indicator.
- Drop on node → as child.
- Drop above/below node → as sibling.
- Drop on root → as root-level node.
- Prevent dropping on self or descendants.

### Virtualization

- Use when > 200 visible nodes.
- Render only visible rows.
- Smooth scrolling.

---

## Keyboard interaction

| Key | Action |
|---|---|
| `Tab` | Move focus to tree |
| `↑` / `↓` | Move to previous / next visible node |
| `←` | Collapse node (or move to parent) |
| `→` | Expand node (or move to first child) |
| `Home` / `End` | First / last node |
| `Enter` / `Space` | Toggle expand or select |
| `Cmd/Ctrl+A` | Select all |
| `Cmd/Ctrl+F` | Focus search |

---

## Accessibility

- `role="tree"` on container.
- `role="treeitem"` on each node.
- `aria-expanded` for expandable nodes.
- `aria-selected` for selected nodes.
- `aria-checked` for checkable variant.
- `aria-level` for nested depth.
- `aria-setsize`, `aria-posinset` for sibling count and position.
- `aria-disabled` for disabled nodes.
- Drag and drop requires alternative keyboard mechanism.

---

## Performance

- **≤ 100 nodes:** render directly.
- **100–500 nodes:** use virtual scrolling.
- **> 500 nodes:** async loading + virtualization required.
- **> 5000 nodes:** consider server-side search + flat list.

---

## Content guidelines

### Node labels

- Short and clear.
- Avoid deep hierarchy: 4–5 levels max.
- Show counts when relevant: "Engineering (24)".

### Icons

- Use semantic icons: folder, department, file.
- Same icon for same entity type.

---

## Do

- ✅ Show expand state clearly with chevron.
- ✅ Support keyboard navigation.
- ✅ Use virtual scrolling for large trees.
- ✅ Lazy-load children when using async.
- ✅ Show loading state during async load.

## Don't

- ❌ Don't auto-expand all nodes if > 20.
- ❌ Don't mix navigation with checkboxes without clarity.
- ❌ Don't nest > 5 levels deep — restructure.
- ❌ Don't disable expand on parent nodes.
- ❌ Don't render > 500 nodes without virtualization.

---

## Related

- Org structure / hierarchy: see [`../patterns/data-display.md`](../patterns/data-display.md)
- Search pattern: [`../patterns/forms.md`](../patterns/forms.md)
