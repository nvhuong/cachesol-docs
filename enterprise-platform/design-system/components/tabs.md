# Component: Tabs
## Mô tả
Cho phép chuyển đổi giữa các view nội dung khác nhau trong cùng một bối cảnh.

## Khi nào dùng / Không dùng
- **Nên dùng**: Cần phân loại thông tin thành các nhóm riêng biệt.
- **Không nên dùng**: Khi flow đòi hỏi người dùng đọc dữ liệu tuần tự (dùng Steps thay thế).

## Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| activeKey | string | - | Tab hiện tại đang mở |

## Variants
- Line Tabs
- Card Tabs
- Pill Tabs (Custom)

## States (default, hover, focus, disabled, loading, error)
Tab bị disabled không click được, màu xám nhạt.

## Accessibility (ARIA)
- Sử dụng phím mũi tên để chuyển tab qua lại.

## Examples (JSX code)
```jsx
import { Tabs } from 'antd';

const items = [{ key: '1', label: 'Tab 1', children: 'Content' }];

const App = () => <Tabs defaultActiveKey="1" items={items} />;
```

## Do / Don't
- **Do**: Số lượng tab vừa phải (3-7 tabs) để không bị tràn.
- **Don't**: Các tên tab quá dài, thành 2 dòng.
