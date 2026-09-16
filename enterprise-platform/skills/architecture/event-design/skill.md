# Skill: Thiết kế Event (Kafka)

## Mục tiêu
Thiết kế các Domain Events, Topics và Schema để phục vụ giao tiếp bất đồng bộ qua Apache Kafka.

## Phạm vi áp dụng
Khi các microservices cần liên lạc bằng cơ chế pub/sub hoặc event-driven architecture.

## Điều kiện tiên quyết
- Có `solution-architecture.md`.

## Input cần thiết
- `Domain Model`: Sự kiện cần phát ra.

## Quy trình thực hiện
### Bước 1: Identify Events
Trích xuất từ domain model các sự kiện mang tính nghiệp vụ, xảy ra trong quá khứ (ví dụ: `UserRegistered`, `OrderCreated`).
### Bước 2: Event Naming Convention
Thiết kế tên Topic chuẩn (ví dụ: `domain.entity.event_name` -> `sales.order.created`).
### Bước 3: Event Schema Design
Thiết kế schema dữ liệu của sự kiện bằng JSON hoặc Avro. Cần có metadata (eventId, timestamp, source).
### Bước 4: Kafka Topic Design
Cấu hình topic: số lượng partitions, replication factor, retention policy (thời gian giữ log).
### Bước 5: Producer/Consumer Mapping
Xác định rõ service nào là Producer, service(s) nào là Consumer, và Consumer Group ID.

## Output chuẩn
- `event-design.md`: Tài liệu định nghĩa Event.

## Checklist kiểm tra
- [ ] Tên sự kiện dùng thì quá khứ (Past tense)?
- [ ] Schema đảm bảo tính tương thích ngược (Backward Compatibility) nếu dùng Avro?
- [ ] Partition key đã được chọn hợp lý (ví dụ: orderId) để giữ thứ tự (ordering) chưa?

## Ví dụ
### Ví dụ Input
Hệ thống cần gửi email sau khi user đăng ký.
### Ví dụ Output
Topic: `identity.user.registered`, Partition Key: `userId`, Consumer Group: `email-notification-service`.

## Tham chiếu
- [Kafka Guidelines](../../governance/architecture/standards/messaging.md)
