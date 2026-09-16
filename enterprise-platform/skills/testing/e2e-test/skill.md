# Skill: Viết E2E Tests

## Mục tiêu
Kiểm thử toàn bộ hệ thống từ góc nhìn người dùng thực tế bằng công cụ tự động hóa trình duyệt (Playwright/Cypress).

## Phạm vi áp dụng
Test luồng tính năng quan trọng nhất (Critical Paths).

## Điều kiện tiên quyết
- Môi trường Staging hoặc QA đã được deploy với dữ liệu test đầy đủ.

## Input cần thiết
- `User Journey`: Các kịch bản nghiệp vụ.

## Quy trình thực hiện
### Bước 1: Test Scenario Design
Viết các kịch bản thực thi từ lúc Login cho đến lúc hoàn thành hành động.
### Bước 2: Áp dụng Page Object Model (POM)
Tạo class cho từng trang giao diện (ví dụ `LoginPage`), bọc các locator và hành động. Tránh hardcode locator trong test.
### Bước 3: Authentication Setup
Sử dụng API để đăng nhập nhanh, lưu cookies/localStorage vào state để tránh việc phải lặp lại bước điền form login cho mọi test.
### Bước 4: Assertion Strategies
Kiểm tra dữ liệu trên UI thay đổi, thông báo toast xuất hiện. Playwright có cơ chế auto-waiting cho assertions.

## Output chuẩn
- Thư mục `e2e-tests/` chứa các scripts (Playwright).

## Checklist kiểm tra
- [ ] Test có ổn định (không Flaky) không?
- [ ] Locator có dùng `data-testid` để tránh vỡ test khi đổi UI không?
- [ ] Có lưu lại video/screenshot khi test fail không?

## Tham chiếu
- [E2E Testing Rules](../../governance/quality/testing-standard.md)
