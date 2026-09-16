# Skill: Architecture Review

## Mục tiêu
Đánh giá tính tuân thủ của giải pháp hoặc hệ thống đối với kiến trúc tổng thể đã định.

## Phạm vi áp dụng
Khi thiết kế kiến trúc (Solution Architecture) được đề xuất hoặc trong đợt kiểm định định kỳ.

## Điều kiện tiên quyết
- Có `solution-architecture.md` hoặc hệ thống thực tế đang chạy.

## Input cần thiết
- Tài liệu kiến trúc.

## Quy trình thực hiện
### Bước 1: Verify Compliance
Đối chiếu thiết kế với các rules trong `architecture-rules.yaml` (nếu có) hoặc bộ quy tắc công ty.
### Bước 2: Service Boundary Check
Đảm bảo các microservices không dính líu chặt chẽ (tight coupling). Mỗi service tự quản lý DB của riêng mình (Database per service).
### Bước 3: Dependency Rules Check
Kiểm tra vòng lặp phụ thuộc (Circular dependency) giữa các services.
### Bước 4: Event Design Review
Đánh giá các event schemas, đảm bảo tính asynchronous. Tránh dùng Kafka như một RPC call (Request-Reply pattern) một cách sai lầm.

## Output chuẩn
- `architecture-review-report.md`: Báo cáo đánh giá kiến trúc.

## Checklist kiểm tra
- [ ] Các service có chung 1 database không (Anti-pattern)?
- [ ] Có rủi ro Single Point of Failure (SPOF) không?
- [ ] Các call API chéo (synchronous) có được bảo vệ bằng Circuit Breaker chưa?

## Tham chiếu
- [Architecture Principles](../../governance/architecture/principles.md)
