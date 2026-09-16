# Chiến Lược Phiên Bản Hóa API (API Versioning)

## 1. Phương Pháp Versioning
Enterprise Platform thống nhất sử dụng **URL Path Versioning** vì tính rõ ràng, dễ test và tương thích với mọi API Gateway.
Định dạng: `/api/v{major}/...`
**Ví dụ:** `/api/v1/users`

## 2. Khi Nào Tăng Version (Breaking Changes)
Chỉ tăng Major version (từ v1 lên v2) khi có những thay đổi phá vỡ tương thích (breaking changes) đối với client:
- Xóa hoặc đổi tên một resource/endpoint.
- Xóa hoặc đổi tên một field trong Response hoặc Request.
- Đổi kiểu dữ liệu của một field (VD: từ `integer` sang `string`).
- Thêm một tham số/field bắt buộc (required) vào Request.
- Thay đổi logic nghiệp vụ làm thay đổi ý nghĩa của kết quả (VD: format lại mã hóa đơn).

## 3. Khi Nào KHÔNG Tăng Version (Non-Breaking Changes)
Client phải có khả năng chấp nhận các thay đổi sau mà không bị sập (Tolerant Reader pattern):
- Thêm các field mới vào Response (Client nên phớt lờ field lạ).
- Thêm một tham số tùy chọn (optional) vào Request.
- Thêm một API endpoint mới.
- Thêm các HTTP Headers mới.

## 4. Chính Sách Khấu Hao (Deprecation Policy)
Khi một API v1 được thay thế bởi v2, v1 không được xóa ngay lập tức.
1. **Thông báo**: Thêm header HTTP `Deprecation: true` và `Link: </api/v2/resource>; rel="latest-version"` vào phản hồi của v1.
2. **Timeline**: Cần hỗ trợ tối thiểu **6 tháng** (hoặc 2 release cycles) cho các phiên bản cũ kể từ ngày ra thông báo.
3. **Shutdown**: Sau thời gian ân hạn, trả về lỗi HTTP `410 Gone`.

## 5. Changelog
Mỗi API phải duy trì một `CHANGELOG.md` ghi chú rõ các thay đổi:
- `[ADDED]`: Thêm tính năng/field mới.
- `[DEPRECATED]`: Đánh dấu sắp loại bỏ.
- `[REMOVED]`: Xóa bỏ (Breaking change).
- `[CHANGED]`: Cập nhật logic (Breaking hoặc Non-breaking).
- `[FIXED]`: Sửa lỗi.
