# Skill: Visual Regression Testing

## Mục tiêu
Tự động phát hiện các thay đổi không mong muốn về giao diện người dùng trên nhiều thiết bị và trình duyệt.

## Phạm vi áp dụng
Khi thay đổi mã CSS hoặc common components của hệ thống Frontend.

## Điều kiện tiên quyết
- Hệ thống Frontend có cấu hình Storybook.

## Input cần thiết
- Thay đổi liên quan đến UI.

## Quy trình thực hiện
### Bước 1: Storybook Setup
Tạo các `.stories.tsx` cho mọi UI component.
### Bước 2: Tích hợp Chromatic/Percy
Cấu hình pipeline gửi các stories lên hệ thống Visual Testing.
### Bước 3: Screenshot Comparison
Hệ thống tự động chụp ảnh màn hình các component. Đối chiếu (diff) với bản baseline để tìm ra những điểm ảnh thay đổi (pixel-level differences).
### Bước 4: Responsive Testing
Cấu hình để chụp ảnh trên nhiều kích thước viewport (Mobile, Desktop).
### Bước 5: Review và Cập nhật Baseline
QA hoặc Dev kiểm tra: nếu thay đổi là mong muốn -> Accept Baseline mới. Nếu là bug -> Reject.

## Output chuẩn
- Các file UI stories, kết quả từ Chromatic pipeline.

## Checklist kiểm tra
- [ ] Mọi variants của Component đều được chụp ảnh (Loading, Error)?
- [ ] Threshold so sánh ảnh được set hợp lý (tránh cảnh báo sai do anti-aliasing text)?

## Tham chiếu
- [Visual Testing Guidelines](../../governance/quality/testing-standard.md)
