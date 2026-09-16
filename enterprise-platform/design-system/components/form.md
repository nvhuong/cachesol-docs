# Component: Form
## Mô tả
Tổ hợp các input components, xử lý việc thu thập và validate dữ liệu.

## Khi nào dùng / Không dùng
- **Nên dùng**: Mọi trường hợp cần nhận input từ user.
- **Không nên dùng**: -

## Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| layout | string | 'horizontal' | horizontal, vertical, inline |

## Variants
- Vertical form
- Horizontal form
- Inline form

## States (default, hover, focus, disabled, loading, error)
Xử lý thông báo lỗi đỏ dưới từng field nếu validate thất bại.

## Accessibility (ARIA)
- Autofocus vào input đầu tiên hoặc input lỗi đầu tiên khi submit fail.

## Examples (JSX code)
```jsx
import { Form, Input, Button } from 'antd';

const App = () => (
  <Form layout="vertical">
    <Form.Item label="Tên" name="name">
      <Input />
    </Form.Item>
  </Form>
);
```

## Do / Don't
- **Do**: Gom nhóm các fields logic (ví dụ: Thông tin cá nhân, Thông tin thanh toán).
- **Don't**: Bắt user nhập lại từ đầu nếu form submit lỗi.
