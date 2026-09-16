# Messaging Standards (Apache Kafka)

## 1. Topic Naming Convention
Cấu trúc chuẩn: `<domain>.<service>.<entity>.<action>`
- **domain:** platform, hrm, erp...
- **service:** iam, employee, inventory...
- **entity:** user, order, ticket...
- **action:** created, updated, deleted, process...
**Ví dụ:** `hrm.employee.profile.created`, `erp.inventory.stock.updated`.

## 2. Message Format
- Định dạng payload chuẩn là **JSON** (Hoặc Avro/Protobuf nếu yêu cầu performance/schema registry khắt khe, nhưng mặc định JSON).
- Payload phải bao gồm Metadata chuẩn:
```json
{
  "metadata": {
    "eventId": "uuid-1234",
    "timestamp": "2026-08-28T10:00:00Z",
    "source": "iam-service",
    "version": "1.0",
    "traceId": "trace-5678"
  },
  "payload": {
    // Business data
  }
}
```

## 3. Producer Patterns
- **Transactional Outbox Pattern:** Để tránh mất dữ liệu hoặc không đồng bộ giữa DB và Kafka. Lưu event vào bảng `outbox` cùng transaction lúc save entity, sau đó dùng 1 process riêng (hoặc Debezium) đọc bảng `outbox` bắn lên Kafka.
- Cấu hình `acks=all` đối với các event quan trọng (tài chính, bảo mật).

## 4. Consumer Patterns & Idempotency
- **Idempotency (Tính lũy đẳng):** Kafka bảo đảm "at-least-once" delivery, do đó consumer có thể nhận cùng 1 event nhiều lần. Consumer **BẮT BUỘC** phải xử lý idempotency (vd: dựa vào `eventId` lưu trong DB xem đã xử lý chưa).
- **Dead Letter Queue (DLQ):** Khi consumer xử lý lỗi (ví dụ format lỗi, lỗi DB), sau số lần retry (thường là 3), phải đẩy message vào 1 topic `<original-topic>.dlq` để cảnh báo và xử lý thủ công sau.

## 5. Consumer Groups
- Các instances của cùng một service phải dùng chung 1 `group.id` để chia tải (Load balancing partitions).
- Hai services khác nhau nghe cùng 1 topic phải dùng `group.id` khác nhau (Broadcast).

## 6. Partitioning Key
- Chỉ định rõ Message Key (VD: `userId`, `orderId`) khi gửi nếu muốn đảm bảo **thứ tự xử lý (Ordering)** của các event thuộc về cùng 1 đối tượng. Các events có cùng Key sẽ vào cùng 1 Partition và được xử lý tuần tự.
