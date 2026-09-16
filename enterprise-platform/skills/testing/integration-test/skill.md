# Skill: Viết Integration Tests

## Mục tiêu
Kiểm tra khả năng tích hợp giữa hệ thống phần mềm với các thành phần thực tế như Database, Redis, Kafka mà không dùng mock.

## Phạm vi áp dụng
Backend API testing, Data layer testing.

## Điều kiện tiên quyết
- Unit test đã pass. Docker môi trường có sẵn.

## Input cần thiết
- Các endpoints cần test.

## Quy trình thực hiện
### Bước 1: Spring Boot Test Setup
Sử dụng `@SpringBootTest` để nạp context thực. Dùng `MockMvc` hoặc `TestRestTemplate` để gọi API nội bộ.
### Bước 2: Testcontainers
Khởi tạo tự động Database (PostgreSQL) và Broker (Kafka) qua Docker trong lúc chạy test bằng thư viện `Testcontainers`.
### Bước 3: Database Integration Tests
Lưu dữ liệu thử nghiệm, kiểm tra xem các query (JPA/SQL) có chạy đúng không, transaction có commit/rollback đúng không.
### Bước 4: Kafka Integration Tests
Gửi message thực tế lên topic Kafka Testcontainers và kiểm tra xem Consumer có nhận được đúng không.

## Output chuẩn
- Các file `*IT.java` (Integration Test).

## Checklist kiểm tra
- [ ] Có sử dụng Testcontainers thay vì H2 (in-memory db)?
- [ ] Tests chạy độc lập (cần dọn dẹp dữ liệu sau mỗi test)?
- [ ] Test API có chạy qua toàn bộ layer từ Controller đến DB không?

## Tham chiếu
- [Integration Testing Standards](../../governance/quality/testing-standard.md)
