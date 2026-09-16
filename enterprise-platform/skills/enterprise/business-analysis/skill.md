# Skill: Phân tích Nghiệp vụ

## Mục tiêu
Phân tích luồng nghiệp vụ kinh doanh, chuyển đổi từ trạng thái hiện tại (AS-IS) sang trạng thái mong muốn (TO-BE).

## Phạm vi áp dụng
Sử dụng khi cần tái cấu trúc một quy trình nghiệp vụ hoặc thiết kế một quy trình mới từ số không.

## Điều kiện tiên quyết
- Có tài liệu tổng quan hoặc yêu cầu ban đầu về thay đổi quy trình.
- Hiểu cơ bản về domain kinh doanh hiện tại.

## Input cần thiết
- `Process Outline`: Đề cương quy trình hoặc ý tưởng ban đầu.
- `Current System Docs`: Tài liệu hệ thống/quy trình hiện tại (nếu có).

## Quy trình thực hiện
### Bước 1: Phân tích Business Process (AS-IS → TO-BE)
Xác định các bước thực hiện thủ công hoặc hệ thống cũ. Đề xuất quy trình mới tối ưu hơn, tự động hóa cao hơn.
### Bước 2: Vẽ Process Flow
Sử dụng Mermaid hoặc PlantUML để vẽ biểu đồ luồng quy trình (Flowchart, BPMN).
### Bước 3: Identify Business Rules
Trích xuất và liệt kê cụ thể các quy tắc kinh doanh (ví dụ: "chỉ duyệt đơn khi giá trị < 100M").
### Bước 4: Phân tích Data Flow
Xác định dòng chảy dữ liệu giữa các bộ phận, các trạng thái của dữ liệu nghiệp vụ chính.
### Bước 5: Stakeholder Impact Analysis
Đánh giá sự thay đổi này ảnh hưởng đến các bộ phận, user groups nào và mức độ ảnh hưởng.

## Output chuẩn
- `business-analysis-doc.md`: Tài liệu phân tích nghiệp vụ.

## Checklist kiểm tra
- [ ] Quy trình TO-BE đã giải quyết được bottleneck của AS-IS chưa?
- [ ] Biểu đồ Process Flow có hợp lệ không?
- [ ] Đã xác định mọi business rules chưa?
- [ ] Tác động thay đổi (impact) đã được đánh giá rõ ràng chưa?

## Ví dụ
### Ví dụ Input
Yêu cầu: "Cải tiến quy trình duyệt vay tự động."
### Ví dụ Output
`business-analysis-doc.md` kèm theo sơ đồ Mermaid về quy trình chấm điểm tín dụng mới.

## Tham chiếu
- [Business Analysis Standards](../../governance/requirements-guideline.md)
