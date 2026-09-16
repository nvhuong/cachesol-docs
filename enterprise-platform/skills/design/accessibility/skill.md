# Skill: Kiểm tra Accessibility (a11y)

## Mục tiêu
Đảm bảo ứng dụng web đáp ứng các tiêu chuẩn trợ năng, đặc biệt là WCAG 2.1 AA.

## Phạm vi áp dụng
Trong quá trình thiết kế UI và implement Frontend.

## Điều kiện tiên quyết
- Có bản thiết kế UI hoặc web app đã build.

## Input cần thiết
- `UI Design` hoặc `Frontend Code`: Nguồn cần kiểm tra.

## Quy trình thực hiện
### Bước 1: WCAG 2.1 AA Compliance Check
Rà soát tổng thể dựa trên checklist tiêu chuẩn.
### Bước 2: Keyboard Navigation
Đảm bảo người dùng có thể Tab qua mọi elements (links, buttons, forms) mà không bị kẹt (keyboard trap).
### Bước 3: Screen Reader Compatibility
Kiểm tra các thẻ alt của ảnh, aria-label của icon buttons.
### Bước 4: Color Contrast Check
Đảm bảo độ tương phản giữa chữ và nền (tối thiểu 4.5:1 cho chữ thường).
### Bước 5: Focus Management
Kiểm tra focus outline có hiển thị rõ ràng không, khi mở Modal focus có được đưa vào Modal không.
### Bước 6: ARIA Implementation
Chỉ định các thuộc tính `aria-*` cần thiết (aria-expanded, aria-hidden, role).

## Output chuẩn
- `accessibility-report.md`: Báo cáo đánh giá và hướng dẫn khắc phục.

## Checklist kiểm tra
- [ ] Tương phản màu sắc >= 4.5:1?
- [ ] 100% chức năng tương tác được bằng phím Tab/Enter?
- [ ] Không có keyboard trap?

## Ví dụ
### Ví dụ Input
Trang đăng nhập có nút "Login" là thẻ `div` với onClick.
### Ví dụ Output
Report chỉ ra lỗi: Thẻ `div` không focus được. Yêu cầu đổi sang thẻ `<button>` hoặc thêm `tabindex="0"` và `role="button"`.

## Tham chiếu
- [Accessibility Guidelines](../../skills/design/accessibility/skill.md)
