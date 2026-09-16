# Skill: Code Review

## Mục tiêu
Đảm bảo mã nguồn đạt chất lượng cao, dễ bảo trì, tuân thủ tiêu chuẩn lập trình trước khi merge.

## Phạm vi áp dụng
Mọi Pull Request (PR).

## Điều kiện tiên quyết
- PR đã pass CI (build, tests, linters).

## Input cần thiết
- Pull Request diff, link Jira ticket.

## Quy trình thực hiện
### Bước 1: Đọc hiểu mục đích
Đọc ticket, hiểu rõ mã đang giải quyết vấn đề gì.
### Bước 2: Kiểm tra Clean Code & Standards (Java/React)
- Naming (biến, hàm rõ nghĩa).
- Độ phức tạp (hàm quá dài, lồng nhau sâu).
- Áp dụng đúng Design Patterns.
### Bước 3: Security Review
- Không có credentials/secrets hardcoded.
- Input từ user có được validate?
### Bước 4: Performance Review
- Phát hiện các query DB vòng lặp (N+1 query).
- Các rò rỉ bộ nhớ (memory leaks) trong React (quên clear interval).
### Bước 5: Test Coverage Check
Đảm bảo dev đã viết đủ test cho code mới, tests có ý nghĩa (không chỉ chạy để lấy điểm coverage).

## Output chuẩn
- Comments trực tiếp trên PR và quyết định (Approve / Request Changes).
- `code-review-report.md` (nếu review cho đợt audit).

## Checklist kiểm tra
- [ ] Có vi phạm SOLID principles không?
- [ ] Exception có bị catch và bỏ qua (swallowed) không?
- [ ] React components có dependency list của useEffect đúng không?

## Tham chiếu
- [Code Review Checklist](../../governance/quality/code-review.md)
