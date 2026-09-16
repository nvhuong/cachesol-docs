# Skill: Phát triển Backend (Java Spring Boot 21)

## Mục tiêu
Viết mã nguồn Java Spring Boot 21 chất lượng cao, an toàn và dễ bảo trì dựa trên thiết kế.

## Phạm vi áp dụng
Implement các tính năng backend API.

## Điều kiện tiên quyết
- Có `service-design.md`, `api-spec.yaml`, và `db-design.md`.

## Input cần thiết
- Các file thiết kế.

## Quy trình thực hiện
### Bước 1: Setup Project
Tạo base code, cấu hình `application.yml` theo môi trường.
### Bước 2: Implement Entity & Repository
Tạo các class `@Entity` (JPA), cấu hình table mapping. Tạo interface `@Repository` kế thừa `JpaRepository`.
### Bước 3: Implement DTOs & Mappers
Tạo DTO bằng Java Records (Spring 21 hỗ trợ tốt). Dùng `MapStruct` để map giữa Entity và DTO.
### Bước 4: Implement Service Layer
Tạo interface và class `@Service`. Viết logic nghiệp vụ.
### Bước 5: Exception Handling
Tạo các class custom exception, xử lý tập trung bằng `@ControllerAdvice`.
### Bước 6: Implement Controller Layer
Tạo class `@RestController`, ánh xạ các endpoints theo `api-spec.yaml`.
### Bước 7: Validation & Security
Sử dụng `jakarta.validation` (`@NotNull`, `@Size`). Thêm cấu hình Spring Security (`@PreAuthorize`).
### Bước 8: Viết Unit Tests
Phủ code với JUnit 5 và Mockito.

## Output chuẩn
- Các file `.java` tương ứng với tính năng.

## Checklist kiểm tra
- [ ] Code không có logic nghiệp vụ trong Controller?
- [ ] Dùng Record cho DTO chưa?
- [ ] Exception được xử lý tập trung không?
- [ ] Unit test đạt độ phủ yêu cầu (thường > 80%)?

## Ví dụ
### Ví dụ Input
Yêu cầu API GET `/users/{id}`.
### Ví dụ Output
File `UserController.java`, `UserService.java`, `UserRecordDTO.java`.

## Tham chiếu
- [Backend Coding Standards](../../governance/architecture/standards/backend.md)
