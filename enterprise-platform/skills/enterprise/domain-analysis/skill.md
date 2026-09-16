# Skill: Phân tích Domain (DDD)

## Mục tiêu
Phân tích và mô hình hóa domain theo phương pháp Domain-Driven Design (DDD) để định hình kiến trúc Microservice.

## Phạm vi áp dụng
Sử dụng khi thiết kế một module/hệ thống mới phức tạp, hoặc khi tách một monolithic app thành các microservices.

## Điều kiện tiên quyết
- Có tài liệu `requirement-doc.md` và `business-analysis-doc.md`.

## Input cần thiết
- `Business Documentation`: Tài liệu nghiệp vụ.

## Quy trình thực hiện
### Bước 1: Identify Domain và Subdomain
Phân chia toàn bộ không gian vấn đề (problem space) thành Core Domain, Supporting Subdomain, và Generic Subdomain.
### Bước 2: Xây dựng Ubiquitous Language
Tạo từ điển thuật ngữ chuẩn mực để cả team tech và business cùng sử dụng mà không gây nhầm lẫn.
### Bước 3: Xác định Bounded Contexts
Phân chia không gian giải pháp (solution space) thành các ranh giới hợp lý (sẽ map 1-1 với microservices).
### Bước 4: Thiết kế Aggregate Roots, Entities, Value Objects
Xác định cấu trúc dữ liệu bên trong mỗi Bounded Context. Xác định rõ Aggregate Root để quản lý transaction.
### Bước 5: Identify Domain Events
Xác định các sự kiện nghiệp vụ quan trọng (past tense) xảy ra trong hệ thống (vd: OrderPlaced).
### Bước 6: Context Mapping
Thiết lập mối quan hệ giữa các Bounded Context (ví dụ: ACL, Conformist, Partnership).

## Output chuẩn
- `domain-model.md`: Tài liệu kiến trúc hướng domain.

## Checklist kiểm tra
- [ ] Có từ điển thuật ngữ Ubiquitous Language rõ ràng?
- [ ] Ranh giới các Bounded Contexts có bị chồng chéo?
- [ ] Aggregates có quá lớn (God objects) không?
- [ ] Domain Events có ý nghĩa về mặt nghiệp vụ?

## Ví dụ
### Ví dụ Input
Tài liệu nghiệp vụ e-commerce.
### Ví dụ Output
`domain-model.md` chứa Bounded Context `OrderManagement`, Aggregate Root `Order`, Value Object `Money`, Entity `OrderItem`.

## Tham chiếu
- [DDD Guidelines](../../skills/enterprise/domain-analysis/skill.md)
