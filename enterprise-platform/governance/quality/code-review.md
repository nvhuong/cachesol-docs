# Quy Trình Đánh Giá Mã Nguồn (Code Review)

Mọi dòng code trước khi được merge vào nhánh chính (develop/main) đều phải trải qua quá trình Pull Request (PR) review khắt khe.

## 1. Yêu Cầu Phê Duyệt (Approvals)
- Bắt buộc có tối thiểu **2 người reviewers** phê duyệt (Approve) đối với code backend/core, **1 người** đối với UI không quan trọng.
- Người tạo PR không được tự approve PR của chính mình.

## 2. Check Khóa Bằng Máy (Automated Checks)
Trở thành Reviewer thứ 0 - Pipeline tự động. Tất cả các job sau phải `Passed` trước khi human reviewer bắt đầu đọc code:
- Code Compile thành công.
- Unit Test Pass 100%.
- SonarQube Quality Gate Passed (Coverage >= 80%, 0 Blocker, 0 Critical, 0 Vulnerabilities).

## 3. Checklist Dành Cho Reviewer (Con Người)
Người review kiểm tra các khía cạnh mà máy tính không check được:
1. **Functionality (Chức năng):** Logic có đúng yêu cầu nghiệp vụ (Jira ticket) không? Có cover case dị (edge cases) chưa?
2. **Design (Thiết kế):** Có phá vỡ kiến trúc (VD: Controller gọi thẳng DB)? Code có thể tái sử dụng không?
3. **Readability (Tính dễ đọc):** Tên biến, tên hàm có tối nghĩa không? Có comment những đoạn phức tạp chưa?
4. **Performance (Hiệu năng):** Có gọi query N+1? Có loop quá nhiều vòng?
5. **Security (Bảo mật):** Đã validate input chưa? Có log nhầm dữ liệu nhạy cảm?
6. **Tests:** Unit test viết có ý nghĩa không hay chỉ gọi hàm không có assert?

## 4. Phân Loại Comment Review
Sử dụng các tiền tố để người viết code biết mức độ ưu tiên của comment:
- `[Must Fix] / [Blocker]`: Lỗi nghiêm trọng, bắt buộc sửa mới được merge (VD: Lỗ hổng bảo mật, lỗi logic core).
- `[Should Fix]`: Code xấu, vi phạm standard nhưng không gây sập, khuyến cáo sửa.
- `[Nice to Have]`: Gợi ý cách viết đẹp hơn/ngắn hơn. Không bắt buộc sửa.
- `[Question]`: Đặt câu hỏi tại sao lại code thế này.

## 5. Kích Thước PR (PR Size Guidelines)
- **Tối đa < 400 lines of code changed** (Loại trừ file tự render hoặc package-lock).
- Nếu task quá lớn, dev phải tự tách nhỏ thành các PR riêng (VD: 1 PR cho DB/Entity, 1 PR cho Service logic, 1 PR cho Controller).
- PR càng nhỏ -> Tốc độ review càng nhanh -> Càng ít lỗi.

## 6. Service Level Agreement (SLA)
- Người review nên phản hồi PR trong vòng **48h** (ngày làm việc). Nếu gấp (Hotfix) báo trực tiếp qua chat.
- Thái độ review: Tập trung vào code, không tấn công cá nhân. Tôn trọng người viết code.
