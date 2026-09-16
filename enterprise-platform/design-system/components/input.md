# Component: Input
## Mô tả
Thành phần Input chuẩn hóa cho việc nhập dữ liệu text.

## Khi nào dùng / Không dùng
- **Nên dùng**: Nhập text ngắn gọn, email, password.
- **Không nên dùng**: Nhập văn bản dài (dùng TextArea).

## Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| status | string | - | error, warning |

## Variants
- Text input
- Password input
- Search input

## States (default, hover, focus, disabled, loading, error)
Viền chuyển màu primary khi focus, viền đỏ khi error state.

## Accessibility (ARIA)
- Cần có `id` và map với `label` qua `htmlFor`.

## Examples (JSX code)
```jsx
import { Input } from 'antd';

const App = () => (
  <Input placeholder="Nhập tên..." />
);
```

## Do / Don't
- **Do**: Cung cấp placeholder ngắn gọn, có ý nghĩa.
- **Don't**: Tránh việc lạm dụng placeholder để thay thế hoàn toàn label.
