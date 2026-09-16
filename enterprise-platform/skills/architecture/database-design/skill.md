# Skill: Thiết kế Cơ sở dữ liệu

## Mục tiêu
Thiết kế schema RDBMS (PostgreSQL) tối ưu, chuẩn hóa và tạo script migration (Flyway).

## Phạm vi áp dụng
Khi cần tạo mới hoặc thay đổi cấu trúc bảng trong database của một microservice.

## Điều kiện tiên quyết
- Có `service-design.md` và hiểu về Domain Entities.

## Input cần thiết
- `Domain Entities`: Các đối tượng dữ liệu.

## Quy trình thực hiện
### Bước 1: Đọc Governance Rules
Đảm bảo tuân thủ các nguyên tắc thiết kế database của công ty.
### Bước 2: Entity-Relationship Design
Thiết kế các bảng, mối quan hệ 1-1, 1-N, N-N. Đảm bảo chuẩn hóa (Normalization) mức 3NF.
### Bước 3: Table/Column Naming
Sử dụng `snake_case` cho tên bảng và cột. Tránh dùng từ khóa SQL (như `order`, `select`).
### Bước 4: Primary/Foreign Keys
Sử dụng UUID hoặc BIGSERIAL cho Primary Key. Định nghĩa Foreign Keys cẩn thận, xem xét chi phí lock table.
### Bước 5: Indexes
Phân tích câu truy vấn (từ API) để tạo B-Tree Index cho các cột thường xuyên dùng trong `WHERE`, `JOIN`.
### Bước 6: Viết Flyway Scripts
Tạo file SQL theo format `V<Version>__<Description>.sql` (vd: `V1.0.1__create_users_table.sql`).

## Output chuẩn
- `db-design.md`: Sơ đồ ERD (Mermaid/PlantUML) và mô tả.
- `V*_*.sql`: Các file migration.

## Checklist kiểm tra
- [ ] Tên bảng và cột dùng `snake_case`?
- [ ] Đã thêm Index cho cột tìm kiếm chưa?
- [ ] File Flyway SQL có chạy thành công không?
- [ ] Mọi bảng đều có cột audit (created_at, updated_at)?

## Tham chiếu
- [Database Guidelines](../../governance/architecture/standards/database.md)
