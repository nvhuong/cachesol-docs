# Skill: Thiết kế API (REST)

## Mục tiêu
Thiết kế RESTful APIs chuẩn mực với OpenAPI 3.0 cho giao tiếp giữa Frontend-Backend và Backend-Backend.

## Phạm vi áp dụng
Thực hiện trong pha thiết kế kỹ thuật, trước khi backend và frontend implement.

## Điều kiện tiên quyết
- Có `requirement-doc.md` và tuân thủ `governance/api/`.

## Input cần thiết
- Nhu cầu giao tiếp giữa các thành phần.

## Quy trình thực hiện
### Bước 1: Đọc Governance Rules
Hiểu các quy định về API trong tổ chức.
### Bước 2: Resource Identification
Xác định tài nguyên chính (Noun - ví dụ: `/users`, `/orders`).
### Bước 3: URL Design & HTTP Methods
Sử dụng đúng phương thức HTTP: GET (đọc), POST (tạo), PUT/PATCH (cập nhật), DELETE (xóa).
### Bước 4: Request/Response Schema
Thiết kế cấu trúc JSON, bao gồm phân trang (pagination), lọc (filtering), sắp xếp (sorting).
### Bước 5: Error Responses
Thiết kế mã lỗi chuẩn: HTTP 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Internal). Cấu trúc `ErrorResponse` đồng nhất.
### Bước 6: Viết OpenAPI 3.0 Spec
Viết tài liệu Swagger/OpenAPI dưới định dạng YAML.

## Output chuẩn
- `api-spec.yaml`: File định nghĩa API chuẩn OpenAPI 3.0.

## Checklist kiểm tra
- [ ] Tên resource là danh từ số nhiều?
- [ ] Không dùng verb trong URL (trừ các action đặc thù như `/orders/1/cancel`)?
- [ ] Đầy đủ schema cho request, response và lỗi?
- [ ] File YAML hợp lệ (valid)?

## Ví dụ
### Ví dụ Input
Yêu cầu tạo API cập nhật trạng thái đơn hàng.
### Ví dụ Output
`api-spec.yaml` chứa endpoint `PATCH /v1/orders/{id}` kèm body `{ "status": "SHIPPED" }`.

## Tham chiếu
- [API Governance](../../governance/api/naming.md)
