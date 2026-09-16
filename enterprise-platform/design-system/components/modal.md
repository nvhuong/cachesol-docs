# Component: Modal
## Mô tả
Cửa sổ dialog hiển thị đè lên nội dung chính.

## Khi nào dùng / Không dùng
- **Nên dùng**: Yêu cầu user tương tác/xác nhận thông tin khẩn cấp mà không rời trang.
- **Không nên dùng**: Dành cho form quá lớn hoặc nhiều step phức tạp.

## Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| open | boolean | false | Trạng thái hiển thị |

## Variants
- Info Modal
- Confirm Modal
- Form Modal

## States (default, hover, focus, disabled, loading, error)
Cung cấp loading cho nút Submit khi đang xử lý dữ liệu.

## Accessibility (ARIA)
- Focus trap: User chỉ có thể tab qua lại trong Modal khi mở.
- Bấm ESC để đóng.

## Examples (JSX code)
```jsx
import { Modal } from 'antd';

const App = () => (
  <Modal title="Xác nhận" open={true}>
    Bạn có chắc chắn?
  </Modal>
);
```

## Do / Don't
- **Do**: Tiêu đề rõ ràng, action button cụ thể.
- **Don't**: Modal lồng Modal (Modal inception).
