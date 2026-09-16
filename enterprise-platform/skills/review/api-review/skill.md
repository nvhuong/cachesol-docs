# Skill: API Review

## Mục tiêu
Đảm bảo các giao diện lập trình (API) nhất quán, chuẩn RESTful, an toàn và dễ sử dụng.

## Phạm vi áp dụng
Khi một API mới được thiết kế qua Swagger/OpenAPI.

## Điều kiện tiên quyết
- Có file `api-spec.yaml`.

## Input cần thiết
- File API Spec.

## Quy trình thực hiện
### Bước 1: Verify API Rules
Kiểm tra bằng công cụ linter (Spectral) với file rule của công ty.
### Bước 2: Naming Convention Check
Kiểm tra URL paths, các trường JSON có tuân thủ `camelCase` hay `snake_case` theo quy định.
### Bước 3: Request/Response Format
Đảm bảo mọi response thành công và thất bại đều có format bọc dữ liệu chuẩn (ví dụ `{ "data": ..., "meta": ... }`).
### Bước 4: Error Handling
Kiểm tra mã trạng thái HTTP có được sử dụng đúng ngữ nghĩa không.
### Bước 5: Security
Các endpoints quan trọng phải có mô tả yêu cầu Authorization (Bearer JWT) và Rate Limiting.

## Output chuẩn
- `api-review-report.md`: Báo cáo đánh giá API.

## Checklist kiểm tra
- [ ] API có sử dụng versioning trong path (e.g., `/v1/`) chưa?
- [ ] Các phương thức trả về danh sách có Pagination mặc định không?
- [ ] Không rò rỉ dữ liệu nhạy cảm (như password hash) qua API response.

## Tham chiếu
- [API Design Standards](../../governance/api/api-rules.yaml)
