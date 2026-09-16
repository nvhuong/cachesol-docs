# Hướng Dẫn Đặt Tên API (API Naming Conventions)

Tài liệu này định nghĩa chuẩn đặt tên và thiết kế URL cho toàn bộ các hệ thống API trong Enterprise Platform.

## 1. Cấu Trúc URL Cơ Bản
Tất cả các RESTful API phải tuân thủ cấu trúc URL sau:
`/api/v{version}/{resource}/{id}/{sub-resource}`

**Ví dụ:** `/api/v1/users/123/orders`

## 2. HTTP Methods Mapping
Sử dụng các HTTP methods đúng với ý nghĩa của REST:
- **GET**: Truy xuất dữ liệu (Idempotent, Safe).
- **POST**: Tạo mới một resource.
- **PUT**: Cập nhật/Thay thế toàn bộ một resource (Idempotent).
- **PATCH**: Cập nhật một phần resource.
- **DELETE**: Xóa resource (Idempotent).

## 3. Quy Tắc Đặt Tên Resource
- **Sử dụng danh từ, không dùng động từ:** URL đại diện cho tài nguyên (resource), động từ nằm ở HTTP Method.
  - ✅ ĐÚNG: `POST /api/v1/users`
  - ❌ SAI: `POST /api/v1/create-user`
- **Luôn sử dụng danh từ số nhiều (Plural):** 
  - ✅ ĐÚNG: `/api/v1/products/{id}`
  - ❌ SAI: `/api/v1/product/{id}`
- **Sử dụng kebab-case (chữ thường, cách nhau bằng gạch ngang):** Cho nhiều từ.
  - ✅ ĐÚNG: `/api/v1/payment-methods`
  - ❌ SAI: `/api/v1/paymentMethods`, `/api/v1/payment_methods`

## 4. Query Parameters và Fields Formatting
- **Query parameters (camelCase):** URL querystring phải dùng `camelCase`.
  - VD: `GET /api/v1/users?sortBy=createdAt&page=0`
- **Request/Response Body Fields (camelCase):** Toàn bộ key trong JSON payload phải dùng `camelCase`.
  - ✅ ĐÚNG: `{ "firstName": "John", "isActive": true }`
  - ❌ SAI: `{ "first_name": "John" }`

## 5. Bảng So Sánh ĐÚNG / SAI

| Mô tả | Khuyên Dùng (✅) | Cấm (❌) |
|---|---|---|
| Lấy danh sách nhân viên | `GET /api/v1/employees` | `GET /api/v1/getAllEmployees` |
| Lấy chi tiết một nhân viên | `GET /api/v1/employees/123` | `GET /api/v1/employees?id=123` |
| Tạo hóa đơn | `POST /api/v1/invoices` | `POST /api/v1/invoice/create` |
| Cập nhật địa chỉ KH | `PATCH /api/v1/customers/123/address` | `POST /api/v1/customers/123/update-address` |
| Phân trang | `?page=0&size=20` | `?Page=0&Limit=20` |

## 6. Đặt Tên Cho Singleton Resource
Trong trường hợp một resource chỉ tồn tại duy nhất trên mỗi cha (hoặc user hiện tại), có thể dùng danh từ số ít.
VD: `GET /api/v1/me/profile` (Người dùng chỉ có 1 profile).

## 7. Nested Resources (Resource lồng nhau)
Chỉ nên lồng nhau tối đa 2-3 cấp để tránh URL quá dài và phức tạp.
- ✅ Chấp nhận: `/api/v1/users/123/orders/456`
- ❌ Quá sâu: `/api/v1/users/123/orders/456/items/789/shipping-status`
*Giải pháp cho quá sâu:* Tách ra thành `/api/v1/order-items/789/shipping-status`.
