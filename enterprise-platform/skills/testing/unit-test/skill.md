# Skill: Viết Unit Tests

## Mục tiêu
Đảm bảo mọi logic nghiệp vụ đơn lẻ hoạt động chính xác thông qua kiểm thử tự động.

## Phạm vi áp dụng
Luôn thực hiện khi phát triển tính năng mới cho cả Backend (Java) và Frontend (TS/JS).

## Điều kiện tiên quyết
- Đã hoàn thành code chức năng.

## Input cần thiết
- Source code (Classes, Functions, Components).

## Quy trình thực hiện
### Bước 1: Xác định Test Cases
Phân tích mã để tìm các đường đi (paths), bao gồm cả happy paths và edge cases.
### Bước 2: Setup Test Environment
Dùng JUnit 5 (Backend) hoặc Jest/Vitest (Frontend).
### Bước 3: Mocks and Stubs
Sử dụng Mockito (Java) để giả lập Repository, External API. Dùng `@Mock`, `@InjectMocks`.
### Bước 4: Given-When-Then Structure
Viết test case có cấu trúc rõ ràng:
- **Given**: Khởi tạo dữ liệu.
- **When**: Gọi phương thức cần test.
- **Then**: Assert (kiểm tra) kết quả (sử dụng AssertJ hoặc Jest expect).
### Bước 5: Code Coverage
Đo lường độ phủ mã (JaCoCo). Đảm bảo target coverage thường là >= 80% line coverage và branch coverage.

## Output chuẩn
- Các file `*Test.java` hoặc `*.test.tsx`.

## Checklist kiểm tra
- [ ] Test cases đọc dễ hiểu theo format BDD?
- [ ] Các mock objects không chứa logic (chỉ trả về kết quả cấu hình sẵn)?
- [ ] Độ phủ mã đạt chuẩn?

## Tham chiếu
- [Testing Guidelines](../../governance/quality/testing-standard.md)
