# Skill: Visual Review

## Mục tiêu
Review và đối chiếu mã nguồn Frontend (ReactJS) đã được implement so với bản thiết kế UI Spec để đảm bảo độ chính xác (pixel-perfect).

## Phạm vi áp dụng
Thực hiện trong quá trình PR Review hoặc QA Phase của Frontend.

## Điều kiện tiên quyết
- Cần có `ui-spec.md` và mã nguồn Frontend đang chạy.

## Input cần thiết
- `Deployed Preview/Screenshots`: Ứng dụng thực tế.
- `UI Spec`: Bản thiết kế chuẩn.

## Quy trình thực hiện
### Bước 1: Compare Implementation vs Design Spec
Đối chiếu khoảng cách, kích thước, font chữ giữa web thật và bản thiết kế.
### Bước 2: Check Design Tokens Usage
Xem code CSS/Styled Components có hardcode mã màu (#FF0000) thay vì dùng token (`var(--color-error)`) không.
### Bước 3: Responsive Check
Thu nhỏ màn hình về kích thước mobile/tablet xem bố cục có bị vỡ, tràn text không.
### Bước 4: Accessibility Check (Visual level)
Kiểm tra bằng mắt các trạng thái focus, hover xem có hiển thị chuẩn không.

## Output chuẩn
- `visual-review-report.md`: Danh sách các điểm chưa chuẩn cần chỉnh sửa.

## Checklist kiểm tra
- [ ] Code không chứa các giá trị hardcoded về màu sắc/spacing?
- [ ] Responsive hiển thị đúng theo breakpoints?
- [ ] Mọi element đều có trạng thái hover/focus rõ ràng?

## Ví dụ
### Ví dụ Input
Pull Request chứa component Card mới.
### Ví dụ Output
Báo cáo: "Padding sai (thực tế 16px, thiết kế 24px), Thiếu trạng thái hover của nút bấm."

## Tham chiếu
- [Review Guidelines](../../design-system/README.md)
