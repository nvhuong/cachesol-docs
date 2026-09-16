# Component: Select
## Mô tả
Thành phần Select (Dropdown) để người dùng chọn một hoặc nhiều giá trị từ danh sách.

## Khi nào dùng / Không dùng
- **Nên dùng**: Có từ 5 lựa chọn trở lên.
- **Không nên dùng**: Nếu chỉ có < 4 options, hãy cân nhắc Radio Group.

## Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| mode | string | - | multiple, tags |

## Variants
- Single select
- Multiple select
- Searchable select

## States (default, hover, focus, disabled, loading, error)
Hiển thị spinner khi loading dữ liệu qua API.

## Accessibility (ARIA)
- Có thể dùng phím mũi tên lên/xuống để duyệt option.

## Examples (JSX code)
```jsx
import { Select } from 'antd';

const App = () => (
  <Select options={[{ value: '1', label: 'Option 1' }]} />
);
```

## Do / Don't
- **Do**: Cung cấp tính năng tìm kiếm nếu danh sách quá dài (>20 items).
- **Don't**: Load hàng nghìn option một lúc (hãy dùng async/debounce search).
