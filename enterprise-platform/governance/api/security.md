# Hướng Dẫn Bảo Mật API (API Security)

## 1. Authentication (Xác thực)
- Tất cả private API phải được xác thực bằng **Bearer JWT Token** đặt trong header `Authorization`.
- Luồng cấp phát token sử dụng OAuth2/OIDC.
- API Gateway sẽ chịu trách nhiệm validate JWT signature, các Microservice phía sau chỉ cần decode JWT để lấy thông tin, hoặc xác thực lại với public key tùy mức độ critical.

## 2. Authorization (Phân quyền)
- Áp dụng mô hình cấp quyền theo từng Endpoint.
- Sử dụng Permission-based (Quyền) thay vì Role-based (Vai trò) ở mức API code.
- Format quyền: `{resource}:{action}` (VD: `users:read`, `orders:create`).

## 3. Rate Limiting
- Phải có cơ chế Rate Limit tại API Gateway để chống brute-force và DDoS.
- Trả về mã lỗi HTTP `429 Too Many Requests`.
- Kèm theo Headers:
  - `X-RateLimit-Limit`: Tổng số request cho phép trong khoảng thời gian.
  - `X-RateLimit-Remaining`: Số request còn lại.
  - `X-RateLimit-Reset`: Thời gian (UNIX timestamp) limit được reset.

## 4. Input Validation
- LUÔN LUÔN validate mọi input từ client (Headers, Query, Path, Body).
- Sử dụng framework validation (Hibernate Validator trong Spring Boot) với các anotations như `@NotNull`, `@Size`, `@Pattern`.
- Ngăn chặn XSS và SQL Injection bằng cách validate kiểu dữ liệu chặt chẽ và ORM.

## 5. Xử Lý Dữ Liệu Nhạy Cảm (Sensitive Data)
- **Log Masking**: Không bao giờ log ra mật khẩu, token, thông tin thẻ tín dụng, PII (Personal Identifiable Information) như CCCD. Các field này phải được che dạng `***` trên Log.
- API Response không được trả về mật khẩu hash hoặc thông tin thừa không cần thiết của đối tượng.

## 6. CORS (Cross-Origin Resource Sharing)
- Chỉ cấu hình origin hợp lệ (VD: `https://app.mycompany.com`). 
- Không bao giờ sử dụng `Access-Control-Allow-Origin: *` với `Access-Control-Allow-Credentials: true`.
- Giới hạn các method (GET, POST, PUT, DELETE) và header được phép.

## 7. Quản Lý API Key (Cho Server-to-Server)
- Khi partner hoặc hệ thống khác gọi API, sử dụng API Key kết hợp IP Whitelisting.
- API Key phải được truyền qua header riêng, VD: `X-Api-Key`, truyền qua HTTPS.

## 8. Audit Logging
- Mọi thao tác thay đổi dữ liệu (POST, PUT, PATCH, DELETE) bắt buộc phải được Audit Log.
- Thông tin lưu: User ID, Hành động, Resource ID, Thời gian, IP Address, Dữ liệu thay đổi.
