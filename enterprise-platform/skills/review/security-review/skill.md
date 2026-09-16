# Skill: Security Review

## Mục tiêu
Phát hiện và ngăn chặn các lỗ hổng bảo mật tiềm ẩn trong mã nguồn và kiến trúc.

## Phạm vi áp dụng
Trước khi đưa code lên Production (Pen-test, Static Code Analysis).

## Điều kiện tiên quyết
- Có mã nguồn hoặc kiến trúc.

## Input cần thiết
- Code base, API docs.

## Quy trình thực hiện
### Bước 1: OWASP Top 10 Checklist
Kiểm tra các rủi ro lớn nhất: SQL Injection, XSS, CSRF.
### Bước 2: Authentication / Authorization
Kiểm tra xem JWT token có an toàn không (secret key đủ mạnh, hạn sử dụng hợp lý). Đảm bảo mọi API (trừ public) đều check quyền. Thử tấn công IDOR (sửa ID của user khác).
### Bước 3: Data Exposure
Kiểm tra log xem có in ra password hoặc thông tin PII (Personally Identifiable Information) của user không.
### Bước 4: Input Validation
Mọi dữ liệu từ người dùng (body, params, headers) đều phải được validate kỹ càng (chống script injection, payload quá lớn).
### Bước 5: Dependency Checking
Quét thư viện bên thứ 3 (NPM/Maven) xem có chứa CVE (lỗ hổng bảo mật đã biết) không.

## Output chuẩn
- `security-review-report.md`: Báo cáo bảo mật chi tiết.

## Checklist kiểm tra
- [ ] Đã phòng thủ XSS trong React (dùng dangerouslySetInnerHTML an toàn)?
- [ ] Chặn CORS hợp lệ (không để origin `*`)?
- [ ] Mật khẩu được hash bằng Bcrypt/Argon2?

## Tham chiếu
- [Security Policies](../../governance/architecture/standards/security.md)
