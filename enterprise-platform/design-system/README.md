# Design System

## Giới thiệu
Hệ thống thiết kế (Design System) chuẩn cho nền tảng Enterprise, đảm bảo tính nhất quán và hiệu quả trong phát triển.

## Mục tiêu
- Nhất quán UI/UX trên toàn bộ hệ thống
- Tái sử dụng components giúp giảm thời gian phát triển

## Cách sử dụng
Sử dụng các component đã được tùy chỉnh sẵn thay vì viết lại từ đầu. Đọc kỹ documentation của từng component.

## Công cụ
- Ant Design 5.x
- Custom tokens via CSS-in-JS

## Cấu trúc thư mục
- `/tokens`: Chứa các giá trị nền tảng (color, typography, spacing,...)
- `/components`: Các thành phần UI cơ bản (Button, Input,...)
- `/patterns`: Cách kết hợp nhiều components cho một luồng (CRUD, Approval,...)
- `/templates`: Bố cục trang tổng thể (List, Form,...)

## Quy trình thêm component mới
1. Đề xuất component và use-case
2. Review thiết kế trên Figma
3. Implement với ReactJS & Ant Design
4. Viết documentation
