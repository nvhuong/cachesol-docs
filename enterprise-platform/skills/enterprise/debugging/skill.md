# Skill: Debugging

## Mục tiêu
Phân tích root cause bug từ báo cáo, đề xuất hướng sửa trước khi implement.

## Input
- Bug report / `requirement` mô tả lỗi
- Logs, reproduction steps

## Quy trình
1. Tái hiện hoặc xác nhận steps to reproduce.
2. Xác định layer (API / UI / data / infra).
3. Viết `fix-design.md` (nguyên nhân, phạm vi, rủi ro regression).
4. Chuyển Backend/Frontend Developer implement.

## Output
- `fix-design.md` (trong `docs/<feature-id>/` hoặc `docs/bugfixes/<id>/`)

## Checklist
- [ ] Có steps to reproduce
- [ ] Xác định component lỗi
- [ ] Có kế hoạch test regression

## Tham chiếu
- [workflows/bug-fix.yaml](../../../workflows/bug-fix.yaml)
