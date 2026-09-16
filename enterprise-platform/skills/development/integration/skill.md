# Skill: Phát triển Integration

## Mục tiêu
Viết mã nguồn để giao tiếp với hệ thống bên ngoài (3rd party APIs) hoặc nội bộ qua Message Broker (Kafka).

## Phạm vi áp dụng
Xây dựng các cầu nối giữa các microservices.

## Điều kiện tiên quyết
- Có `event-design.md` hoặc tài liệu API của hệ thống thứ 3.

## Input cần thiết
- Kafka Topics, Schema, API Keys.

## Quy trình thực hiện
### Bước 1: Kafka Producer Implementation
Cấu hình KafkaTemplate. Áp dụng Outbox Pattern (nếu cần thiết để đảm bảo transaction) khi gửi tin nhắn.
### Bước 2: Kafka Consumer Implementation
Tạo phương thức có `@KafkaListener`. Thiết kế xử lý theo batch (nếu có lưu lượng cao).
### Bước 3: External API Integration
Sử dụng `RestClient` (Spring 21) hoặc `WebClient` để gọi HTTP API bên ngoài.
### Bước 4: Retry và Error Handling
Cấu hình Resilience4j: Retry, Circuit Breaker, Timeout. Cấu hình Dead Letter Queue (DLQ) cho Kafka consumer.
### Bước 5: Idempotency
Đảm bảo Consumer hoặc REST API caller xử lý an toàn khi tin nhắn bị lặp (Duplicate messages) bằng cách dùng Idempotency Key (lưu Redis hoặc DB).

## Output chuẩn
- Mã nguồn integration (Kafka configs, REST clients).

## Checklist kiểm tra
- [ ] Consumer đã xử lý được Idempotent chưa?
- [ ] Đã có Dead Letter Queue (DLQ) cho các tin nhắn lỗi?
- [ ] Có Circuit Breaker bảo vệ API external không?

## Tham chiếu
- [Integration Best Practices](../../governance/architecture/standards/messaging.md)
