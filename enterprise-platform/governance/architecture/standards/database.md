# Database Standards (PostgreSQL)

## 1. Naming Conventions (Quy tắc đặt tên DB)
- **Table Names:** `snake_case`, danh từ số nhiều (VD: `employees`, `purchase_orders`).
- **Column Names:** `snake_case` (VD: `first_name`, `created_at`).
- **Primary Keys:** Đặt tên là `id`, kiểu dữ liệu `UUID` hoặc `BIGINT` (tùy ngữ cảnh, ưu tiên UUID cho hệ thống phân tán).
- **Foreign Keys:** `[tên_bảng_số_ít]_id` (VD: `employee_id`).
- **Indexes:** `idx_[table]_[column]` (VD: `idx_employees_email`).

## 2. Common Columns
Mọi bảng (trừ các bảng join table N-N) đều phải có các cột Audit:
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `created_by` (UUID/String)
- `updated_at` (TIMESTAMP WITH TIME ZONE)
- `updated_by` (UUID/String)

## 3. Database Migrations
- **Công cụ:** Liquibase hoặc Flyway (tùy chọn của project).
- Không bao giờ được phép thay đổi schema thủ công bằng câu lệnh SQL trên DB Production. Mọi thay đổi phải nằm trong file migration (.sql hoặc .yaml).
- Các thay đổi cấu trúc bảng đang có dữ liệu lớn phải thực hiện cẩn thận, không lock bảng lâu.

## 4. Soft Delete (Xóa mềm)
- Hạn chế `DELETE` dữ liệu vật lý. Thêm cột `is_deleted` (BOOLEAN, default: false) hoặc `deleted_at` (TIMESTAMP).
- Ở mức ứng dụng, các câu Query mặc định lọc bỏ các bản ghi đã xóa.

## 5. Indexing Strategy
- Phải đánh index cho các cột thường xuyên dùng trong điều kiện `WHERE`, `JOIN`.
- Không lạm dụng Index vì sẽ làm chậm thao tác `INSERT`/`UPDATE`.
- Dùng `UNIQUE INDEX` ở level Database để đảm bảo toàn vẹn dữ liệu (VD: email nhân viên).

## 6. Connection Pooling
- Cấu hình HikariCP trên ứng dụng (Spring Boot).
- Max Pool Size không nên quá lớn, công thức khuyến nghị: `connections = ((core_count * 2) + effective_spindle_count)`.

## 7. JSONB Data Type
- PostgreSQL hỗ trợ cực tốt kiểu `JSONB`. Dùng nó cho các dữ liệu ít cấu trúc hoặc tính biến động cao (như metadata, extra attributes).
- Có thể tạo Index trên các key của JSONB. Tuy nhiên không nên lạm dụng để thay thế Relational Model.
