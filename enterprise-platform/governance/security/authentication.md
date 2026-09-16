# Chiến Lược Xác Thực (Authentication)

Tài liệu quy định kiến trúc và tiêu chuẩn xác thực cho Enterprise Platform.

## 1. Authentication Strategy
Chúng ta sử dụng chiến lược **JWT (JSON Web Token) kết hợp Refresh Token**.
- **Access Token:** Định dạng JWT, chứa các claims (thông tin user, roles). Dùng để xác thực với API. Token này là stateless, backend không lưu trữ.
- **Refresh Token:** Token dạng chuỗi ngẫu nhiên (opaque token). Được lưu trong DB (kèm trạng thái thu hồi - revoke). Dùng để lấy Access Token mới khi hết hạn.

## 2. OAuth2 và OIDC Flows
Sử dụng các luồng OAuth2 tuỳ theo client:
- **Web App / SPA (ReactJS)**: Sử dụng luồng **Authorization Code Flow with PKCE** (Khuyên dùng) hoặc Resource Owner Password Credentials (nếu UI làm custom form).
- **Server to Server (Cronjob, Worker)**: Sử dụng luồng **Client Credentials Flow**.

## 3. Cấu Trúc và Vòng Đời Token
- **Access Token TTL (Time-to-Live):** 15 phút.
- **Refresh Token TTL:** 7 ngày. Sau 7 ngày người dùng bắt buộc phải đăng nhập lại.
- **Payload JWT (Claims):** Không chứa PII nhạy cảm (như sdt, địa chỉ). Chỉ chứa `sub` (userId), `email`, `roles`, `exp`, `iat`, `jti`.

## 4. Lưu Trữ Token Ở Frontend
Việc lưu trữ phụ thuộc vào loại ứng dụng:
- **Khuyên dùng (Security Tốt nhất):** Lưu trong cookie HTTPOnly, Secure, SameSite=Strict để chống XSS. Refresh Token bắt buộc lưu theo dạng này.
- **Local Storage / Session Storage:** Chỉ áp dụng nếu ứng dụng có cấu trúc an toàn cao, không chịu rủi ro XSS, nhưng cần kiểm soát nghiêm ngặt.

## 5. Multi-Factor Authentication (MFA)
- Bắt buộc đối với các role hệ thống cấp cao (SUPER_ADMIN, ADMIN).
- Tùy chọn cho người dùng cuối (TOTP qua Google Authenticator hoặc SMS OTP).

## 6. Session Management
- Quản lý phiên làm việc thông qua bảng quản lý Refresh Token.
- Hỗ trợ tính năng "Đăng xuất khỏi tất cả thiết bị" bằng cách xóa hoặc đánh dấu revoke tất cả Refresh Token của user.

## 7. Single Sign-On (SSO)
- Hệ thống tích hợp với Identity Provider tập trung, cụ thể là **Keycloak**.
- Keycloak chịu trách nhiệm lưu trữ mật khẩu, luồng đăng nhập, MFA, và liên kết tài khoản mạng xã hội (Google, Facebook).

## 8. Password Policy (Nếu không dùng SSO)
- Tối thiểu 8 ký tự.
- Chứa ít nhất: 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt.
- Không chứa username hoặc tên user.
- Buộc đổi mật khẩu 90 ngày/lần cho admin.

## 9. Implementation (Spring Boot 21 + Spring Security 6)
Cấu hình SecurityFilterChain trong Spring Boot:
```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
        .cors(Customizer.withDefaults())
        .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/v1/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
    return http.build();
}
```
