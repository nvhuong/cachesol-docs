# Security Standards (Quy chuẩn Bảo mật)

## 1. Authentication (Xác thực)
- Sử dụng **OAuth2 / OIDC** cho luồng đăng nhập.
- Sau khi đăng nhập thành công, IAM Service trả về Token (Access Token - JWT, và Refresh Token).
- Access Token có thời gian sống ngắn (ví dụ 15-30 phút). Refresh Token sống dài hơn (1-7 ngày) và phải lưu trong HttpOnly Cookie (đối với Web).

## 2. Authorization (Phân quyền)
- **API Gateway:** Nhận Request, xác thực chữ ký JWT. Nếu JWT hợp lệ, forward request kèm theo các headers chứa UserID, Roles... xuống Microservices.
- **Microservices:** Không cần parse lại JWT (nếu tin tưởng Gateway), nhưng **BẮT BUỘC** phải kiểm tra quyền (`@PreAuthorize("hasRole('ADMIN')")` hoặc kiểm tra Resource Owner).

## 3. Data Encryption (Mã hóa)
- **Data in Transit:** Mọi giao tiếp bên ngoài (Client <-> API Gateway) phải dùng **HTTPS/TLS 1.2+**. Nội bộ (Service <-> Service) tùy theo quy định network nội bộ (khuyến khích mTLS).
- **Data at Rest:** Các thông tin siêu nhạy cảm trong Database (Mật khẩu, Số thẻ tín dụng) phải được mã hóa/hash. Mật khẩu phải dùng Bcrypt hoặc Argon2.

## 4. OWASP Top 10 Compliance
- **SQL Injection:** Ngăn chặn bằng cách dùng Parametrized Query, ORM (JPA/Hibernate).
- **XSS (Cross-Site Scripting):** Frontend React đã chống XSS mặc định (nếu không dùng `dangerouslySetInnerHTML`). Backend phải validate input sanitize.
- **CSRF:** Bảo vệ chống CSRF nếu sử dụng session/cookie. Nếu dùng thuần API + Bearer Token thì không bị ảnh hưởng.

## 5. Secret Management
- Tuyệt đối **KHÔNG HARDCODE** bất kỳ Key/Password nào trong source code.
- Mọi secrets phải được lưu trong Vault (HashiCorp Vault) hoặc quản lý bởi Kubernetes Secrets / AWS Secrets Manager.

## 6. Dependency Scanning
- Tích hợp công cụ quét lỗ hổng thư viện (như Snyk, SonarQube, hoặc OWASP Dependency Check) vào CI/CD Pipeline.
- Cập nhật các thư viện phụ thuộc định kỳ để vá lỗ hổng zero-day.

## 7. Rate Limiting
- Cấu hình Rate Limit trên API Gateway để ngăn chặn tấn công DDoS, Brute-force mật khẩu.
- Ví dụ: API `/login` chỉ cho phép 5 requests/phút từ 1 IP.
