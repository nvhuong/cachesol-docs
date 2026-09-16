# Skill: Phân tích Yêu cầu

## Mục tiêu
Phân tích và làm rõ yêu cầu nghiệp vụ từ user story hoặc business request để tạo ra tài liệu requirement chuẩn.

## Phạm vi áp dụng
Sử dụng khi nhận được một tính năng mới, sự cố nghiệp vụ hoặc request từ Product Owner/Stakeholder.

## Điều kiện tiên quyết
- Có sẵn bản draft User Story hoặc Business Request.
- Đã xác định được Business Owner.

## Input cần thiết
- `applications/<miniapp>/requirement/<feature-id>/requirement.txt` (+ `images/`).
- Hoặc `User Story` / Business Request thô.
- `Stakeholder List` (nếu có).

## Quy trình thực hiện
### Bước 1: Phân tích và làm rõ yêu cầu nghiệp vụ
Đọc hiểu ngữ cảnh, xác định vấn đề cốt lõi cần giải quyết.
### Bước 2: Xác định Stakeholders
Xác định ai là người dùng cuối, ai chịu ảnh hưởng, ai phê duyệt.
### Bước 3: Viết Functional Requirements
Mô tả chi tiết các chức năng hệ thống cần có.
### Bước 4: Viết Non-functional Requirements
Xác định yêu cầu về hiệu năng, bảo mật, khả năng mở rộng.
### Bước 5: Tạo Acceptance Criteria
Sử dụng định dạng BDD (Given-When-Then) để viết tiêu chí nghiệm thu.
### Bước 6: Identify Risks & Assumptions
Đánh giá rủi ro và các giả định liên quan đến yêu cầu.

## Output chuẩn
- `applications/<miniapp>/requirement/<feature-id>/requirement-doc.md`

## Checklist kiểm tra
- [ ] Yêu cầu đã rõ ràng, không mâu thuẫn.
- [ ] Đầy đủ acceptance criteria theo BDD.
- [ ] Đã bao gồm non-functional requirements.
- [ ] Đã liệt kê rủi ro.

## Ví dụ
### Ví dụ Input
User Story: "Là một khách hàng, tôi muốn xem lịch sử giao dịch để kiểm soát chi tiêu."
### Ví dụ Output
Tài liệu `requirement-doc.md` với Given (KH đã login), When (chọn lịch sử GD), Then (hiển thị danh sách).

## Tham chiếu
- [Governance: Requirements](../../../governance/requirements-guideline.md)
- [FEATURE-LIFECYCLE.md](../../../FEATURE-LIFECYCLE.md)
