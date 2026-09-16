# Skill: Thiết kế Solution Architecture

## Mục tiêu
Thiết kế giải pháp tổng thể cho một tính năng lớn, quy định cách các microservices tương tác với nhau, database và message broker (Kafka).

## Phạm vi áp dụng
Thực hiện sau quá trình phân tích (Domain/Architecture Analysis), trước khi coding.

## Điều kiện tiên quyết
- Có `requirement-doc.md`, `domain-model.md` và `architecture-analysis.md`.

## Input cần thiết
- Các tài liệu phân tích hệ thống.

## Quy trình thực hiện
### Bước 1: Xác định Services
Đọc requirement và domain analysis để chốt danh sách các services cần tạo mới hoặc cập nhật.
### Bước 2: Thiết kế Interaction
Vẽ sơ đồ luồng giao tiếp giữa các services (Synchronous qua REST/gRPC, Asynchronous qua Kafka).
### Bước 3: Chọn Patterns phù hợp
Quyết định áp dụng các kiến trúc nâng cao nếu cần: CQRS (tách Read/Write), Saga (cho phân tán transaction), Event Sourcing.
### Bước 4: Xác định Cross-cutting concerns
Thiết kế logging, tracing, authentication (JWT), authorization, rate limiting.
### Bước 5: Tạo C4 Diagrams
Sử dụng C4 Model (dưới dạng PlantUML hoặc Mermaid) để vẽ System Context và Container diagram.

## Output chuẩn
- `solution-architecture.md`: Tài liệu thiết kế giải pháp tổng thể.

## Checklist kiểm tra
- [ ] Đã giải quyết được toàn bộ yêu cầu phi chức năng (NFR)?
- [ ] Các patterns áp dụng (Saga, CQRS) có thực sự cần thiết hay gây over-engineering?
- [ ] C4 Diagram có rõ ràng, bao gồm toàn bộ database, message brokers chưa?

## Ví dụ
### Ví dụ Input
Tính năng Đặt vé xem phim (yêu cầu khóa ghế trong 5 phút).
### Ví dụ Output
`solution-architecture.md` mô tả dùng Saga pattern quản lý transaction, Redis để cache trạng thái ghế.

## Tham chiếu
- [Solution Architecture Standards](../../governance/architecture/principles.md)
