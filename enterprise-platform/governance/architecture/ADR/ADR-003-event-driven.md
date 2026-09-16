# ADR 003: Sử dụng Event-Driven Architecture với Kafka cho Giao tiếp Bất đồng bộ

- **Status:** Accepted
- **Date:** 2026-08-28
- **Author:** Architecture Team

## Context (Bối cảnh)
Với kiến trúc Microservices và Database per Service, nhiều luồng nghiệp vụ cần cập nhật dữ liệu xuyên suốt các dịch vụ. Nếu sử dụng các cuộc gọi REST API đồng bộ (synchronous) nối tiếp nhau, hệ thống sẽ trở nên chậm chạp, mong manh (dễ bị cascading failures) và tight-coupling.

## Decision (Quyết định)
Chúng ta áp dụng **Event-Driven Architecture (EDA)** cho các giao tiếp liên dịch vụ (cross-service) không yêu cầu phản hồi tức thời.
- Công nghệ lựa chọn: **Apache Kafka**.
- Khi trạng thái của một aggregate thay đổi, service quản lý aggregate đó sẽ xuất bản (publish) một Domain Event lên Kafka.
- Các services quan tâm sẽ đăng ký (subscribe) và xử lý event này một cách bất đồng bộ.

## Consequences (Hậu quả)
**Tích cực:**
- Lỏng lẻo hóa liên kết (Decoupling): Producer không cần biết Consumer là ai.
- Tăng tính chịu lỗi: Nếu Consumer down, Kafka vẫn giữ message; Consumer xử lý tiếp khi up lại.
- Hiệu năng cao: Không block luồng xử lý chính.

**Tiêu cực:**
- Eventual Consistency: Dữ liệu giữa các services không đồng bộ tức thời, UI phải xử lý UX phù hợp.
- Phức tạp trong việc xử lý lỗi (Dead Letter Queue, Idempotency).
- Khó trace luồng dữ liệu (Cần có công cụ Distributed Tracing tốt).

## Alternatives Considered (Các phương án đã xem xét)
- **RabbitMQ:** Phù hợp hơn cho task queuing nhưng Kafka lại vượt trội hơn ở khả năng lưu trữ event (event sourcing/retention) và replay events. Chúng ta ưu tiên đặc tính này của Kafka.
- **REST Sync Calls:** Bị loại do tính chịu lỗi kém và latency cao khi có chain of calls.

## References
- [Event-driven architecture](https://microservices.io/patterns/data/event-driven-architecture.html)
- [Kafka vs RabbitMQ](https://www.confluent.io/kafka-vs-rabbitmq/)
