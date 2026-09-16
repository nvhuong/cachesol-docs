# Pattern: Notification
## Mô tả
Hệ thống thông báo đẩy, toast, và trung tâm thông báo trong ứng dụng.

## Use Cases
Cảnh báo lỗi hệ thống, thông báo có người nhắc đến, tiến trình nền hoàn tất.

## Anatomy (các phần cấu thành)
- Bell Icon với Badge counter.
- Notification Dropdown (Inbox).
- Toast/Snackbar (Góc trên phải).
- Inline Alert.

## Flow / Interaction Design
1. Event xảy ra -> Hiện Toast (tự tắt sau 3s).
2. Lưu vào Inbox -> Tăng số trên Bell icon.
3. User bấm vào Inbox -> Đánh dấu đã đọc.

## Components sử dụng
Badge, Dropdown, List, message/notification (API), Alert.

## Code Example
```jsx
import { notification } from 'antd';

const showSuccess = () => {
  notification.success({ message: 'Lưu thành công!' });
};
```

## Variations
- Tương tác Toast (Có nút Undo).

## Accessibility
Sử dụng `aria-live="polite"` hoặc `assertive` cho toast notifications.
