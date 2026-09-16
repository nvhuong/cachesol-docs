# Component: Tree
## Mô tả
Hiển thị dữ liệu phân cấp, dạng cây thư mục.

## Khi nào dùng / Không dùng
- **Nên dùng**: Chọn phòng ban, phân cấp danh mục, sơ đồ tổ chức.
- **Không nên dùng**: Danh sách phẳng đơn giản (dùng List/Select).

## Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| treeData | array | [] | Dữ liệu dạng node |

## Variants
- Checkable Tree
- Draggable Tree
- Async Directory Tree

## States (default, hover, focus, disabled, loading, error)
Loading lúc mở rộng (expand) node đối với async data.

## Accessibility (ARIA)
- Expand/Collapse bằng Space hoặc Enter.

## Examples (JSX code)
```jsx
import { Tree } from 'antd';

const App = () => (
  <Tree treeData={[{ title: 'Parent', key: '0', children: [] }]} />
);
```

## Do / Don't
- **Do**: Hỗ trợ search trên tree nếu số lượng node lớn.
- **Don't**: Mở rộng toàn bộ hàng trăm node mặc định (gây lác).
