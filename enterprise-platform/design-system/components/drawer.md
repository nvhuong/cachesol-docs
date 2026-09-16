# Component: Drawer
## Mô tả
Bảng điều khiển trượt ra từ mép màn hình (thường là bên phải).

## Khi nào dùng / Không dùng
- **Nên dùng**: Hiển thị detail, form nhập liệu dài mà không che mất context hiện tại.
- **Không nên dùng**: Cảnh báo ngắn, alert (dùng Modal).

## Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| placement | string | 'right' | left, right, top, bottom |

## Variants
- Basic Drawer
- Form Drawer

## States (default, hover, focus, disabled, loading, error)
-

## Accessibility (ARIA)
- Focus trap tương tự Modal.
- Hỗ trợ ESC để đóng.

## Examples (JSX code)
```jsx
import { Drawer } from 'antd';

const App = () => (
  <Drawer title="Chi tiết" placement="right" open={true}>
    Nội dung chi tiết...
  </Drawer>
);
```

## Do / Don't
- **Do**: Lưu trữ form state nếu user vô tình bấm ra ngoài (hoặc maskClosable=false cho form quan trọng).
- **Don't**: Drawer tràn màn hình trên desktop (trừ khi cố ý).
