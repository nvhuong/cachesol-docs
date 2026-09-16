# Phân Loại Dữ Liệu (Data Classification)

Để đảm bảo bảo mật và tuân thủ (GDPR, PCI-DSS), mọi dữ liệu trong Enterprise Platform phải được phân loại và quản lý theo cấp độ rủi ro.

## 1. Các Cấp Độ Phân Loại

### Cấp 1: PUBLIC (Công khai)
- **Định nghĩa**: Dữ liệu có thể công bố rộng rãi ra ngoài tổ chức.
- **Ví dụ**: Thông tin giới thiệu công ty, danh mục sản phẩm chung, API docs công khai.
- **Xử lý**: 
  - Không cần mã hóa nội dung.
  - Vẫn cần bảo vệ chống giả mạo (thông qua chữ ký hoặc checksum) nhưng ai cũng xem được.

### Cấp 2: INTERNAL (Nội bộ)
- **Định nghĩa**: Dữ liệu chỉ dùng trong nội bộ công ty. Việc rò rỉ gây hậu quả không quá nghiêm trọng nhưng vi phạm nội quy.
- **Ví dụ**: Sơ đồ tổ chức, wiki, quy trình nội bộ, mã nguồn.
- **Xử lý**:
  - Truy cập phải đăng nhập (Yêu cầu token).
  - Không cần mã hóa mức Database, lưu text thường.

### Cấp 3: CONFIDENTIAL (Bảo mật)
- **Định nghĩa**: Dữ liệu PII (Thông tin cá nhân), dữ liệu kinh doanh quan trọng. Rò rỉ gây thiệt hại uy tín hoặc pháp lý.
- **Ví dụ**: Email, SDT, Họ tên khách hàng, chi tiết đơn hàng, báo cáo tài chính.
- **Xử lý**:
  - Quyền truy cập chặt chẽ (RBAC).
  - Mã hóa toàn bộ Storage (Encryption at rest).
  - Data Masking trên Log và UI (VD: `098*****123`).

### Cấp 4: RESTRICTED (Tuyệt mật)
- **Định nghĩa**: Dữ liệu nhạy cảm cao nhất. Rò rỉ gây thiệt hại tài chính nặng hoặc vi phạm luật nghiêm trọng.
- **Ví dụ**: Mật khẩu, Thẻ tín dụng, Khóa riêng tư (Private Keys), Bí mật y tế.
- **Xử lý**:
  - KHÔNG LƯU thẻ tín dụng (Dùng token từ Cổng thanh toán).
  - Mật khẩu bắt buộc băm (Hashing) với bcrypt/Argon2.
  - Phải có mã hóa cấp trường (Field-level encryption) trong Database.
  - Ghi Audit Log MỌI truy cập đọc dữ liệu này (Ai đã xem thẻ/khóa lúc nào).

## 2. Quản Lý Dữ Liệu PII (Personal Identifiable Information)
Các field chứa thông tin cá nhân cần được đánh dấu (Annotation trong Code) để đảm bảo không bị xuất sai vào Log.
```java
@Entity
public class User {
    @MaskLog(type = MaskType.EMAIL)
    private String email;
}
```

## 3. Chính Sách Xóa Dữ Liệu (GDPR Right to be Forgotten)
- Soft Delete (Xóa mềm): Mặc định sử dụng cờ `is_deleted = true`.
- Hard Delete (Xóa cứng) / Anonymization (Vô danh hóa): 
  - Áp dụng khi User yêu cầu xóa tài khoản (GDPR).
  - Phải thực thi việc xóa vĩnh viễn (hoặc băm vĩnh viễn) các dữ liệu PII trong vòng 30 ngày.
  - Các dữ liệu liên quan nghiệp vụ (như Order) được giữ nguyên nhưng liên kết với người dùng đã bị ẩn danh.

## 4. Thời Gian Lưu Trữ (Data Retention)
- Log truy cập, Log hệ thống: Giữ tối đa 1 năm.
- Dữ liệu giao dịch/tài chính: Giữ tối đa 10 năm.
- Dữ liệu tạm, Cache: Tự động xóa (TTL) trong 24h - 7 ngày.
