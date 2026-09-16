# Skill: Đóng góp Design System

## Mục tiêu
Đánh giá và thiết kế các UI component mới để bổ sung vào Design System dùng chung.

## Phạm vi áp dụng
Khi thiết kế UI phát hiện ra một pattern hoặc component chưa từng tồn tại nhưng có khả năng tái sử dụng cao.

## Điều kiện tiên quyết
- Có yêu cầu tạo component mới.

## Input cần thiết
- `Component Proposal`: Đề xuất component và use case.

## Quy trình thực hiện
### Bước 1: Evaluate tính tái sử dụng
Kiểm tra xem component này đã có biến thể nào tương tự chưa. Nếu có thì sửa component cũ, nếu chưa thì tạo mới.
### Bước 2: Design theo Token System
Sử dụng chuẩn màu, khoảng cách (spacing), font chữ của Design System hiện tại.
### Bước 3: Document Component Spec
Viết tài liệu chi tiết: Properties (Props), States, Variants, Behavior.
### Bước 4: Accessibility Check
Đảm bảo component tuân thủ a11y (ARIA roles, keyboard support, contrast).

## Output chuẩn
- `component-spec.md`: Đặc tả của component mới.

## Checklist kiểm tra
- [ ] Component thực sự có khả năng tái sử dụng ở nhiều nơi?
- [ ] Đã define đủ Props interface (cho React/TypeScript) chưa?
- [ ] Đã vượt qua checklist Accessibility chưa?

## Ví dụ
### Ví dụ Input
Đề xuất làm một `DateRangePicker` tùy chỉnh.
### Ví dụ Output
`component-spec.md` định nghĩa Props `startDate`, `endDate`, các states: hover vào ngày, select khoảng ngày.

## Tham chiếu
- [Design System Governance](../../design-system/README.md)
