# Hướng Dẫn Migration Cơ Sở Dữ Liệu

Quản lý thay đổi Database Schema tự động và an toàn bằng công cụ Migration.

## 1. Công Cụ Lựa Chọn
Toàn bộ Microservices sử dụng **Flyway** làm công cụ versioning database.

## 2. Quy Tắc Đặt Tên File Migration
Định dạng bắt buộc: `V{version}__{description}.sql`
*(Chú ý: 2 dấu gạch dưới giữa version và description)*

**Version Convention (Chuẩn phiên bản):**
- Sử dụng DateTime hoặc Sequence. Enterprise khuyến nghị dùng DateTime để tránh conflict khi merge code trong team.
- Format DateTime: `YYYYMMDDHHMMSS`
- VD: `V20231015143000__create_users_table.sql`

## 3. Quy Tắc Bất Biến (Golden Rules)
1. **Forward-Only**: Luôn đi tới. Nếu làm sai một file ở môi trường dev, phải tạo ra script sửa (ví dụ ALTER, DROP), **tuyệt đối không sửa lại file cũ** nếu nó đã được merge và chạy trên server.
2. **Không thay đổi các file migration cũ (Đã commit/push).** Vì Flyway sẽ băm checksum các file cũ. Thay đổi file cũ làm hỏng startup của Spring Boot (`FlywayException: Checksum mismatch`).

## 4. Rollback Strategy
Khác với Liquibase, Flyway bản community hỗ trợ Rollback hơi phức tạp, do đó:
- Chiến lược của nền tảng là "Roll-forward".
- Nếu có lỗi, thay vì undo script cũ, dev phải viết ngay một file `V{next}__fix_bug_or_revert.sql` để đưa DB về trạng thái ổn định.

## 5. Schema Change Review Process
- Các file `.sql` migration phải nằm cùng một Pull Request với code sử dụng nó.
- Phải được review bởi Senior hoặc DBA nếu thay đổi bảng lớn (ALTER TABLE hàng triệu record).
- **Tuyệt đối không cấp quyền CREATE/DROP trực tiếp cho user dev trên production DB. Chỉ ứng dụng có quyền thực thi migration lúc khởi động, hoặc dùng pipeline CD để chạy.**

## 6. Testing Migration
- Khuyến khích sử dụng **Testcontainers** trong Integration Test để kiểm tra quá trình chạy Flyway từ bảng trống lên phiên bản mới nhất xem có bị crash không.

## 7. Deployment Order Trong Microservices
- Spring Boot tự động chạy Flyway lúc startup trước khi Hibernate (JPA) ánh xạ Entity.
- Khi làm Blue-Green deployment, cần thiết kế migration **Tương thích ngược (Backward compatible)**.
  - **B1**: Thêm cột mới `new_col`, null-able (App cũ vẫn chạy).
  - **B2**: Triển khai App mới, nó ghi vào cả `old_col` và `new_col`, update dữ liệu cũ sang `new_col`.
  - **B3**: Bản release tiếp theo, xóa `old_col`.
