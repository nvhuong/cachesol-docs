# Skill: Phân tích Kiến trúc

## Mục tiêu
Phân tích ảnh hưởng của một yêu cầu mới lên hệ thống hiện tại, định hướng kiến trúc tối ưu và đánh giá rủi ro.

## Phạm vi áp dụng
Sử dụng trước khi bắt đầu thiết kế chi tiết (Solution Architecture) để đưa ra các phương án (options) kiến trúc.

## Điều kiện tiên quyết
- Có `requirement-doc.md` và `domain-model.md`.
- Nắm rõ kiến trúc Microservice, Kafka, PostgreSQL hiện tại.

## Input cần thiết
- `Feature Requirement`: Yêu cầu kỹ thuật/nghiệp vụ.
- `Current Architecture Layout`: Sơ đồ kiến trúc hiện tại.

## Quy trình thực hiện
### Bước 1: Phân tích Impact lên kiến trúc
Xem xét yêu cầu mới cần sửa đổi những thành phần nào, có cần thêm công nghệ mới không (ví dụ: cần thêm Redis Cache?).
### Bước 2: Identify Affected Services
Chỉ ra đích danh các microservices bị ảnh hưởng hoặc cần tạo mới (ví dụ: `payment-service`, `notification-service`).
### Bước 3: Assess Risks
Xác định rủi ro về hiệu năng (dữ liệu lớn?), tính toàn vẹn (distributed transaction), bảo mật.
### Bước 4: Propose Architecture Options
Đề xuất 2-3 phương án kiến trúc, kèm theo Trade-offs (Ưu/Nhược điểm) cho từng phương án.

## Output chuẩn
- `architecture-analysis.md`: Tài liệu phân tích lựa chọn kiến trúc (ADR - Architecture Decision Record format).

## Checklist kiểm tra
- [ ] Đã xác định đầy đủ các services bị ảnh hưởng chưa?
- [ ] Các options đã có bảng so sánh Trade-offs rõ ràng chưa?
- [ ] Đã tính đến giới hạn của hệ thống hiện tại chưa?

## Ví dụ
### Ví dụ Input
Yêu cầu: "Đồng bộ dữ liệu khách hàng theo thời gian thực sang hệ thống CRM ngoài."
### Ví dụ Output
`architecture-analysis.md` so sánh 2 options: (1) Gọi API đồng bộ, (2) Dùng Kafka (Event-driven). Khuyên dùng Option 2.

## Tham chiếu
- [Architecture Guidelines](../../governance/architecture/standards/backend.md)
