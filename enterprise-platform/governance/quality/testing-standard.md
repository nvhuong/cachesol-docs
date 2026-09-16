# Tiêu Chuẩn Kiểm Thử (Testing Standard)

## 1. Test Pyramid (Kim Tự Tháp Kiểm Thử)
Phân bổ công sức viết test tuân thủ theo tỷ lệ:
- **Unit Test (70%)**: Test các method độc lập (Service, Utils, Mapper). Chạy cực nhanh.
- **Integration Test (20%)**: Test luồng tích hợp có database, caching (Repository, API endpoint nội bộ).
- **End-to-End (E2E) Test (10%)**: Giả lập người dùng thật tương tác trên UI gọi xuống API.

## 2. Test Coverage Requirements
SonarQube Quality Gate sẽ block merge PR nếu không đạt:
- **Line Coverage (Dòng code):** Tối thiểu 80%.
- **Branch Coverage (Nhánh if/else):** Tối thiểu 70%.
*(Note: Không ép buộc 100% để tránh viết test đối phó, thiếu assert).*

## 3. Unit Test Conventions (Backend)
- Stack: **JUnit 5**, **Mockito** (để mock dependencies), **AssertJ** (để viết chuỗi assert dễ đọc).
- Nguyên tắc F.I.R.S.T: Fast, Isolated, Repeatable, Self-Validating, Timely.
- **Naming Convention (Tên Method Test):** 
  Sử dụng chuẩn `MethodName_Given_When_Then` hoặc `Condition_Should_Result`.
  VD: `calculateDiscount_GivenVipUser_ShouldReturn20Percent()`
- **Cấu trúc ruột method test:** Tuân thủ BDD (Behavior-Driven Development) chia 3 block rõ ràng bằng comment:
  ```java
  // Given (Thiết lập data giả)
  // When (Gọi hàm cần test)
  // Then (Assert kết quả)
  ```

## 4. Integration & API Test (Backend)
- Không dùng In-memory DB (H2) vì khác biệt cú pháp với Postgres thực tế.
- Bắt buộc sử dụng **Testcontainers** để dựng PostgreSQL / Kafka / Redis Docker container lúc chạy test.
- Sử dụng `MockMvc` hoặc `WebTestClient` để test HTTP layer (Controller) mà không cần start toàn bộ Tomcat server thật lên port thực.

## 5. End-to-End Test (Frontend)
- Khuyến nghị sử dụng **Playwright** hoặc **Cypress**.
- Focus E2E test vào các luồng quan trọng nhất (Critical Paths) như: Đăng nhập, Checkout giỏ hàng.
- Tạo test data động thay vì phụ thuộc dữ liệu tĩnh để tránh flaky tests.

## 6. Quản Lý Dữ Liệu Test (Test Data)
- Sử dụng các thư viện như `Instancio` hoặc `JavaFaker` để sinh dữ liệu ngẫu nhiên thay vì hard-code các String/Number giả.
- Dọn dẹp dữ liệu (Clean up) sau khi xong Integration test để không làm ảnh hưởng test khác.

## 7. Mutation Testing
- Nâng cao: Chạy Mutation Testing (VD: Pitest) định kỳ để đánh giá chất lượng của các bộ Unit Test (kiểm tra xem có assert sót hay không).
