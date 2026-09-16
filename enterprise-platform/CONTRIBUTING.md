# Hướng dẫn Đóng góp (Contributing Guidelines)

Cảm ơn bạn đã đóng góp cho Enterprise Platform. Để đảm bảo chất lượng, sự ổn định và quy trình làm việc mượt mà, vui lòng tuân thủ các hướng dẫn sau:

## 0. Feature Miniapp (bắt buộc khi thêm tính năng)
1. Tạo `applications/<miniapp>/requirement/<feature-id>/requirement.txt` + `images/`.
2. Đăng ký `_index.md`.
3. Chạy pipeline theo [`FEATURE-LIFECYCLE.md`](FEATURE-LIFECYCLE.md).
4. Artifact docs/code/tests phải nằm đúng path trong miniapp.

## 1. Quy trình Đóng góp (Git Workflow)
Chúng tôi sử dụng quy trình **Feature Branch Workflow**:
1. **Pull mới nhất** từ branch `main` hoặc `develop`.
2. **Tạo branch mới** từ branch hiện tại cho task của bạn.
3. **Thực hiện code**, viết test, đảm bảo pass toàn bộ linter và formatter.
4. **Commit** thay đổi theo chuẩn Conventional Commits.
5. **Push branch** lên repository và tạo Pull Request (PR).

## 2. Branch Naming Convention
Tên branch phải rõ ràng và thể hiện được mục đích:
- Tính năng mới: `feature/<jira-id>-<short-desc>` (VD: `feature/IAM-123-add-oauth2`)
- Sửa lỗi: `bugfix/<jira-id>-<short-desc>` (VD: `bugfix/ERP-404-fix-calc`)
- Lỗi nghiêm trọng: `hotfix/<jira-id>-<short-desc>` (Dùng cho production)
- Tài liệu/Cấu hình: `docs/<short-desc>` hoặc `chore/<short-desc>`

## 3. Commit Message Convention
Sử dụng [Conventional Commits](https://www.conventionalcommits.org/).
**Format:** `type(scope): message`

**Types:**
- `feat`: Tính năng mới
- `fix`: Vá lỗi
- `docs`: Cập nhật tài liệu
- `style`: Format code (không ảnh hưởng logic)
- `refactor`: Refactor code (không thêm tính năng, không sửa lỗi)
- `test`: Thêm/sửa test
- `chore`: Cập nhật build, tools...

**Ví dụ:** `feat(auth): thêm hỗ trợ đăng nhập qua Google`

## 4. Quy trình Pull Request (PR)
- Tạo PR sử dụng PR Template chuẩn của dự án.
- Gắn thẻ (Tag) reviewer liên quan (ít nhất 2 reviewers với Core service, 1 reviewer với service thường).
- PR phải pass toàn bộ CI pipeline (Build, Test, Lint, Security Scan).
- **Approval Criteria:** PR chỉ được merge khi có ít nhất 1 Approve và không có status *Changes Requested*.

## 5. Code Review Guidelines
- **Reviewers:** Đánh giá dựa trên kiến trúc, performance, security, tính rõ ràng và các `governance/architecture/standards`.
- Không chỉ tìm lỗi, hãy gợi ý giải pháp cải thiện.
- Sử dụng lời lẽ mang tính xây dựng.

## 6. Quy trình Release
- Các tính năng hoàn thiện được merge vào `develop`.
- Khi đến lịch Release, tạo branch `release/vX.Y.Z` từ `develop`.
- Triển khai lên UAT, thực hiện QA.
- Nếu Pass, merge `release` vào `main` và đánh tag version. Deploy lên Production.
