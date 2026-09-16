# Component: Table
## Mô tả
Thành phần Table hiển thị dữ liệu dạng bảng.

## Khi nào dùng / Không dùng
- **Nên dùng**: Hiển thị danh sách dữ liệu có cấu trúc.
- **Không nên dùng**: Danh sách đơn giản chỉ gồm 1 trường text (dùng List).

## Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| dataSource | array | [] | Dữ liệu bảng |
| columns | array | [] | Định nghĩa cột |

## Variants
- Basic table
- Table with selection
- Nested / Tree table

## States (default, hover, focus, disabled, loading, error)
Loading state cần bọc trong Skeleton hoặc Spin layer.

## Accessibility (ARIA)
- Cần có thead/tbody rõ ràng.
- `aria-label` cho bảng hoặc `caption`.

## Examples (JSX code)
```jsx
import { Table } from 'antd';

const App = () => (
  <Table columns={cols} dataSource={data} />
);
```

## Do / Don't
- **Do**: Hỗ trợ phân trang khi dữ liệu lớn.
- **Don't**: Nhồi nhét quá nhiều cột khiến vỡ layout (nên dùng scroll ngang).
