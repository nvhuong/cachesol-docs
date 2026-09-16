# Chuẩn Audit Log

Audit Log lưu vết tất cả thay đổi của hệ thống để đáp ứng bảo mật và truy vết lỗi.

## 1. Yêu Cầu Cốt Lõi (5W)
Một bản ghi Audit phải trả lời được 5 câu hỏi:
- **WHO (Ai)**: User ID, Username, hoặc Service Name.
- **WHAT (Cái gì)**: Tên Resource (Order, User, Setting) và ID của nó. Dữ liệu cũ/mới (Before/After image).
- **WHEN (Khi nào)**: Timestamp chính xác (ISO 8601).
- **WHERE (Ở đâu)**: IP Address, User-Agent, Microservice nào, Endpoint API nào.
- **HOW (Hành động)**: Thao tác CREATE, UPDATE, DELETE, LOGIN, EXPORT...

## 2. Format Sự Kiện Chuẩn (JSON)
```json
{
  "eventId": "uuid-v4",
  "timestamp": "2023-10-15T08:30:15Z",
  "actorId": "user-123",
  "actorName": "huongnv",
  "action": "UPDATE",
  "resourceType": "ORDER",
  "resourceId": "ORD-456",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "oldValue": { "status": "PENDING" },
  "newValue": { "status": "SHIPPED" },
  "traceId": "9b1deb4d..."
}
```

## 3. Danh Sách Hành Động Phải Audit
- Đăng nhập (Thành công/Thất bại), Đăng xuất.
- Đổi mật khẩu, Reset mật khẩu.
- Cấp quyền/Xóa quyền tài khoản.
- Tạo, Sửa, Xóa bất kỳ dữ liệu nghiệp vụ chính (Order, Payment, User).
- Xuất dữ liệu (Export Report, Download file).
- Truy cập vào dữ liệu được phân loại Nhạy cảm (RESTRICTED).

## 4. Chính Sách Lưu Trữ (Retention Policy)
- **Hot Storage (Elasticsearch/OpenSearch):** 3 tháng gần nhất để phục vụ query và dashboard.
- **Cold Storage (AWS S3, Blob Storage):** 5-7 năm (theo luật định).
- Hệ thống cronjob sẽ archive dữ liệu từ Hot sang Cold định kỳ.

## 5. Tính Bất Biến (Immutability)
- Dữ liệu Audit tuyệt đối **KHÔNG ĐƯỢC XÓA SỬA** bởi bất kỳ ai (Kể cả Super Admin).
- DB Audit phải sử dụng append-only.

## 6. Implementation (Spring AOP + Kafka)
Không ghi thẳng DB vì có thể làm chậm API.
Sử dụng AOP (Aspect-Oriented Programming) trên các hàm `@Service` hoặc sử dụng Event-Driven.
- Microservice sẽ ném log kiện dưới dạng Event vào Kafka topic `audit-logs`.
- Sẽ có một `audit-service` trung tâm consume Kafka và lưu vào Elasticsearch.

```java
// Ví dụ AOP Annotation
@AuditLog(action = "UPDATE", resource = "ORDER")
public void updateOrder(Order order) { ... }
```

## 7. Query và Search
Cung cấp giao diện Admin Dashboard để tra cứu Audit Log theo:
- Filter theo Date range.
- Tìm kiếm toàn văn (Full-text search) theo resourceId, actorId.
