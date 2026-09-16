# Skill: Design Review (Frontend UI)

## Mục tiêu
Đảm bảo giao diện triển khai thực tế tuân thủ 100% tài liệu thiết kế (Design System & UI Spec).

## Phạm vi áp dụng
Giai đoạn nghiệm thu Frontend hoặc PR Review về UI.

## Điều kiện tiên quyết
- Ứng dụng đã được deploy preview.

## Input cần thiết
- Link ứng dụng, UI Spec.

## Quy trình thực hiện
### Bước 1: Design System Compliance
Sử dụng extension trình duyệt hoặc code review để đảm bảo mọi màu sắc, font, spacing đều là biến (CSS variables) của Design System, không phải màu fix cứng.
### Bước 2: Accessibility
Chạy thử Lighthouse Accessibility score hoặc công cụ Axe. Thử dùng bàn phím để điều hướng qua trang.
### Bước 3: Responsive Behavior
Thu nhỏ màn hình dần đều, kiểm tra các breakpoints. Chữ có dễ đọc không, nút bấm có dễ nhấn không.
### Bước 4: Cross-browser Testing
Mở trên Chrome, Safari, Firefox để đảm bảo không bị lệch layout (đặc biệt flex/grid quirks).

## Output chuẩn
- `design-review-report.md`: Danh sách bugs UI cần sửa.

## Checklist kiểm tra
- [ ] Điểm số Lighthouse Accessibility >= 90?
- [ ] Không có element nào đè lên nhau ở màn hình Mobile?
- [ ] Tuân thủ tuyệt đối Design System Tokens?

## Tham chiếu
- [Design Review Guidelines](../../design-system/README.md)
