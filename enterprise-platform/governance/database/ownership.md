# Quản Lý Quyền Sở Hữu Database (Database Ownership)

Microservice Architecture yêu cầu sự độc lập và phân rã dữ liệu chặt chẽ. Dưới đây là các quy tắc bất di bất dịch về Data Ownership.

## 1. Database per Service Rule (STRICT)
- **Mỗi Microservice phải sở hữu một database riêng biệt (hoặc một Schema logic riêng trong PostgreSQL).**
- Ví dụ: `order_service` dùng `order_db`, `user_service` dùng `user_db`.
- Không một service nào khác được phép truy cập trực tiếp vào DB không phải của nó.

## 2. Giao Tiếp Liên Dịch Vụ (Cross-service Data Access)
Khi Service A cần dữ liệu của Service B, **CẤM** query thẳng vào DB của B. Phải sử dụng một trong các cách sau:
1. **API Call (Synchronous)**: Gọi REST API hoặc gRPC của Service B. Dành cho các tác vụ cần response ngay (Read-time).
2. **Messaging / Event (Asynchronous)**: Service B publish event lên Kafka khi data thay đổi, Service A consume và cập nhật lại bản sao logic ở phía mình.
3. **CQRS (Command Query Responsibility Segregation)**: Bắn event để một service khác build Read-Model tối ưu cho việc View.

## 3. Quản Lý Dữ Liệu Tham Chiếu Chung (Shared Reference Data)
- Các danh mục như Quốc gia, Tỉnh/Thành, Tiền tệ... nên được quản lý bởi một `Master Data Service`.
- Các service khác nếu cần, có thể gọi API để lấy, hoặc cache trên Redis, hoặc replicate bảng danh mục này vào DB của chính nó qua hệ thống Event.

## 4. Xử Lý Giao Dịch Phân Tán (Data Consistency)
Do DB bị tách rời, không thể sử dụng ACID transaction quen thuộc (như `@Transactional` bao hàm nhiều DB).
- **Sử Dụng Eventual Consistency (Tính Nhất Quán Cuối)**.
- Áp dụng **Saga Pattern** cho các luồng giao dịch liên quan nhiều service (Ví dụ: Tạo Order -> Trừ Tiền -> Trừ Kho).
- Trong Saga, sử dụng **Outbox Pattern** để đảm bảo thao tác ghi DB và bắn Kafka message xảy ra đồng thời không mất mát. (Ghi event vào bảng `outbox` trong cùng transaction với nghiệp vụ, sau đó worker đọc `outbox` đẩy lên Kafka).

## 5. Những Mẫu Kiến Trúc Bị Cấm (Forbidden Patterns)
- ❌ **Shared Database Integration**: Các app khác nhau liên kết dữ liệu bằng cách JOIN bảng từ nhiều schema chung.
- ❌ **DB View qua Microservice**: Tạo View trong DB Order chọc trực tiếp vào bảng bảng Users ở schema bên cạnh (kể cả cùng PostgreSQL instance). Phá vỡ tính đóng gói của Microservice.
- ❌ **Tất Cả Mọi Thứ Trong Một DB**: Trừ phi hệ thống được định hình là Modular Monolith ở giai đoạn khởi đầu.
