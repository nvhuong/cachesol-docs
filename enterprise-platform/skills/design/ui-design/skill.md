# Skill: Thiết kế UI

## Mục tiêu
Thiết kế giao diện người dùng chi tiết, áp dụng Design System để đảm bảo tính nhất quán trên nền ReactJS.

## Phạm vi áp dụng
Sử dụng sau khi đã có UX spec và wireframe, chuẩn bị chuyển giao cho frontend developer.

## Điều kiện tiên quyết
- Đã hoàn thành `ux-spec.md`.
- Hiểu về Design Tokens của công ty.

## Input cần thiết
- `UX Spec`: Tài liệu UX và luồng.
- `Design System`: Hệ thống components và tokens.

## Quy trình thực hiện
### Bước 1: Apply Design Tokens
Lựa chọn các tokens về màu sắc, typography, spacing từ hệ thống.
### Bước 2: Component Selection
Chỉ định các components có sẵn từ Design System (ví dụ: `PrimaryButton`, `DataTable`, `Modal`).
### Bước 3: Layout Design
Sử dụng Grid/Flexbox concepts để định hình bố cục trang.
### Bước 4: Responsive Design Spec
Chỉ định cách UI hiển thị trên Desktop, Tablet, Mobile (Breakpoints).
### Bước 5: State Design
Thiết kế chi tiết cho các trạng thái: Empty (không có dữ liệu), Loading (Skeleton/Spinner), Error (thông báo lỗi), Success.

## Output chuẩn
- `ui-spec.md`: Tài liệu đặc tả giao diện (có thể kèm mã giả JSX component structure).

## Checklist kiểm tra
- [ ] Chỉ sử dụng token và component chuẩn của công ty?
- [ ] Đã có mô tả đầy đủ 4 trạng thái UI (Empty, Loading, Error, Success)?
- [ ] Có thông số responsive không?

## Ví dụ
### Ví dụ Input
Text-based wireframe của trang Dashboard.
### Ví dụ Output
`ui-spec.md` liệt kê: "Header dùng token `color-bg-primary`, Layout 12 cột, Breakpoint MD chuyển sang stacked card".

## Tham chiếu
- [UI Tokens & Design System](../../design-system/README.md)
