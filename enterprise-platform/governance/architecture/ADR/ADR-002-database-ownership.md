# ADR 002: Áp dụng Database per Service

- **Status:** Accepted
- **Date:** 2026-08-28
- **Author:** Architecture Team

## Context (Bối cảnh)
Cùng với quyết định áp dụng Microservices (ADR-001), chúng ta cần xác định chiến lược lưu trữ dữ liệu. Nếu tất cả các services cùng chia sẻ chung một Database (Shared Database), chúng ta sẽ gặp vấn đề tight-coupling: một service thay đổi schema có thể làm hỏng service khác; tài nguyên I/O của DB bị cạnh tranh.

## Decision (Quyết định)
Áp dụng pattern **Database per Service**:
- Mỗi microservice sẽ có database riêng, hoặc tối thiểu là logical schema riêng rẽ trên một database server dùng chung (để tiết kiệm chi phí ban đầu).
- Các service KHÔNG ĐƯỢC PHÉP truy cập trực tiếp vào schema của service khác.
- Việc chia sẻ dữ liệu chỉ được thực hiện thông qua API hoặc Event bus (Kafka).

## Consequences (Hậu quả)
**Tích cực:**
- Đảm bảo tính đóng gói (encapsulation). Bất kỳ thay đổi schema nào cũng không ảnh hưởng tới service khác.
- Dễ dàng tùy chọn công nghệ database phù hợp cho từng service (VD: PostgreSQL cho ERP, MongoDB cho Audit Log).

**Tiêu cực:**
- Khó khăn trong việc thực hiện các query join dữ liệu giữa các services.
- Không thể sử dụng ACID transactions xuyên suốt nhiều services (phải dùng Saga pattern).
- Tốn kém resource hơn (khi tách vật lý thành nhiều DB servers).

## Alternatives Considered (Các phương án đã xem xét)
- **Shared Database:** Bị loại vì vi phạm nguyên tắc độc lập của Microservice, dẫn đến tình trạng "Distributed Monolith".

## References
- [Database per Service Pattern](https://microservices.io/patterns/data/database-per-service.html)
