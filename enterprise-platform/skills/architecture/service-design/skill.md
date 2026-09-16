# Skill: Thiết kế Service (Microservice)

## Mục tiêu
Thiết kế kiến trúc chi tiết bên trong của một Spring Boot Microservice (Cấu trúc thư mục, layer).

## Phạm vi áp dụng
Khi bắt đầu khởi tạo hoặc cấu trúc lại một microservice bằng Java Spring Boot 21.

## Điều kiện tiên quyết
- Có tài liệu `solution-architecture.md`.

## Input cần thiết
- Domain Model của service đó.

## Quy trình thực hiện
### Bước 1: Package Structure Design
Thiết kế cấu trúc package theo domain-driven (ví dụ: `com.company.service.order`) thay vì layer-driven.
### Bước 2: Layer Architecture
Áp dụng Hexagonal Architecture hoặc N-Tier chuẩn: Controller (Adapter) → Service (Use Case) → Domain (Entity) → Repository.
### Bước 3: Domain Model Design
Thiết kế các class JPA Entities, DTOs, Mappers.
### Bước 4: Spring Boot Project Structure
Xác định các dependencies (Spring Data JPA, Spring Web, Kafka, Lombok, MapStruct).
### Bước 5: Configuration
Xác định các properties cần thiết trong `application.yml` (DB url, Kafka broker, timeout, retry).

## Output chuẩn
- `service-design.md`: Tài liệu thiết kế nội bộ service.

## Checklist kiểm tra
- [ ] Packages được chia theo feature/domain chưa?
- [ ] Tách biệt hoàn toàn Entity (DB) và DTO (API) chưa?
- [ ] Cấu hình đủ linh hoạt (dùng biến môi trường) chưa?

## Ví dụ
### Ví dụ Input
Service Quản lý User.
### Ví dụ Output
Tài liệu định nghĩa cấu trúc: `controller/`, `service/`, `repository/`, `entity/`, `dto/` kèm mô tả nhiệm vụ mỗi layer.

## Tham chiếu
- [Spring Boot Best Practices](../../governance/architecture/standards/backend.md)
