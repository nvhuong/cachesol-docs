# Chuẩn Đặt Tên Database (PostgreSQL)

Quy chuẩn này áp dụng cho toàn bộ các database trong kiến trúc Microservices.

## 1. Bảng (Tables)
- Sử dụng **snake_case**, viết thường toàn bộ (VD: `user_profiles`).
- Luôn sử dụng danh từ **số nhiều** (Plural) (VD: `users`, `orders`, `categories`).
- Bảng trung gian (Join table) ghép tên 2 bảng liên quan lại (VD: `user_roles`, `order_items`).

## 2. Cột (Columns)
- Sử dụng **snake_case**, viết thường.
- Phải mô tả chính xác nội dung dữ liệu chứa trong nó.
- **Không** kèm tên bảng vào tên cột (❌ `user_name`, ✅ `name`).

### Khóa Chính (Primary Key)
- Luôn đặt tên là `id`.
- Kiểu dữ liệu mặc định: `UUID` v4.

### Khóa Ngoại (Foreign Key)
- Tên cột khóa ngoại phải là: `{bảng_số_ít}_id`.
- VD: Khóa ngoại trỏ đến bảng `users` sẽ có tên là `user_id`. Khóa ngoại trỏ tới `categories` là `category_id`.

### Các Cột Phổ Biến (Standard Columns)
- Cột Boolean (True/False) phải bắt đầu bằng `is_`, `has_`, hoặc `can_`. (VD: `is_active`, `has_discount`, `can_login`).
- Cột Timestamp lưu trữ thời gian luôn phải sử dụng chuẩn chung:
  - `created_at`: Khi khởi tạo.
  - `updated_at`: Lần update cuối.
  - `deleted_at`: Cho Soft-Delete.

## 3. Indexes (Chỉ Mục)
- Prefix là `idx_`.
- Cấu trúc: `idx_{tên_bảng}_{tên_cột_1}_{tên_cột_2}`
- VD: `idx_users_email` (Index trên bảng users cột email).

## 4. Constraints (Ràng Buộc)
- **Unique Constraint:** Bắt đầu bằng `uq_`.
  - Cấu trúc: `uq_{tên_bảng}_{tên_cột}`
  - VD: `uq_users_email`
- **Foreign Key Constraint:** Bắt đầu bằng `fk_`.
  - Cấu trúc: `fk_{tên_bảng}_{tên_bảng_đích}`
  - VD: `fk_orders_users` (Từ orders trỏ tới users).

## 5. Bảng Ví Dụ

| Đối tượng | ĐÚNG (✅) | SAI (❌) | Lỗi vì sao? |
|---|---|---|---|
| Bảng khách hàng | `customers` | `Customer` / `customer` | Không dùng CamelCase. Phải dùng số nhiều. |
| Khóa chính | `id` | `customer_id` | PK luôn là `id`. |
| Cột tên | `first_name` | `firstName` | Cột dùng snake_case. |
| Khóa ngoại bảng `roles` | `role_id` | `roles_id` | FK phải dùng số ít. |
| Cột boolean trạng thái | `is_published` | `status` | Boolean bắt đầu bằng `is/has`. `status` dành cho ENUM/String. |
