# Backend Standards (Java Spring Boot 21)

## 1. Project Structure (Cấu trúc dự án)
Tuân theo **Onion/Clean Architecture** hoặc **Layered Architecture** chuẩn:
```text
src/main/java/com/cachesol/platform/{service-name}/
├── application/        # Controllers, REST endpoints, DTOs
├── domain/             # Entities, Value Objects, Domain Exceptions
├── infrastructure/     # Repositories (JPA), Kafka Producers/Consumers, External Clients
└── config/             # Spring Configurations, Security
```

## 2. Naming Conventions (Quy tắc đặt tên)
- **Class/Interface:** `PascalCase` (VD: `UserService`, `EmployeeRepository`)
- **Variables/Methods:** `camelCase` (VD: `getUserById`, `totalAmount`)
- **Constants:** `UPPER_SNAKE_CASE` (VD: `MAX_RETRY_COUNT`)
- **Packages:** chữ thường toàn bộ (VD: `com.cachesol.platform.hrm.payroll`)

## 3. Dependency Injection
- **MUST:** Sử dụng **Constructor Injection** với `@RequiredArgsConstructor` (Lombok).
- **MUST NOT:** Sử dụng Field Injection (`@Autowired` trên property).

## 4. Exception Handling
- Sử dụng `@RestControllerAdvice` ở mức global.
- Response luôn phải tuân theo chuẩn **RFC 7807 (Problem Details for HTTP APIs)**.
```json
{
  "type": "https://example.com/probs/out-of-credit",
  "title": "You do not have enough credit.",
  "status": 400,
  "detail": "Your current balance is 30, but that costs 50.",
  "instance": "/account/12345/msgs/abc"
}
```

## 5. Logging Standards
- **Framework:** SLF4J + Logback.
- **Format:** In ra JSON format khi chạy ở profile `prod` để đẩy log vào ELK.
- **MUST NOT:** Log mật khẩu, PII (Số điện thoại, CMND/CCCD) mà không mask.

## 6. Configuration Management
- Phân chia theo profile: `application-local.yml`, `application-dev.yml`, `application-prod.yml`.
- Các biến môi trường nhạy cảm phải đọc từ ENV variables: `${DB_PASSWORD}`.

## 7. Security (Spring Security)
- Tất cả APIs nội bộ phải validate JWT.
- Sử dụng `@PreAuthorize` để kiểm tra phân quyền (RBAC/ABAC).

## 8. Database Access (JPA/Hibernate)
- Ưu tiên sử dụng Spring Data JPA.
- Các câu query phức tạp hoặc báo cáo nên dùng JOOQ hoặc JdbcTemplate.
- Hạn chế N+1 query (Sử dụng `@EntityGraph` hoặc Fetch JOIN).

## 9. REST API Conventions
- URI là danh từ số nhiều: `/api/v1/employees`
- HTTP Methods chuẩn:
  - `GET`: Đọc
  - `POST`: Tạo mới
  - `PUT`: Cập nhật toàn bộ
  - `PATCH`: Cập nhật một phần
  - `DELETE`: Xóa (Nên áp dụng Soft Delete).
- Phải có phân trang (Pagination) trên các API trả về danh sách (`?page=0&size=20`).

## 10. Testing
- **Unit Test:** Dùng JUnit 5 + Mockito. Coverage tối thiểu 80%.
- **Integration Test:** Dùng Testcontainers để test với DB thực tế.

## 11. Health Check
- Phải enable Spring Boot Actuator (`/actuator/health`, `/actuator/metrics`).
- K8s sẽ dùng endpoint này cho Liveness/Readiness probe.
