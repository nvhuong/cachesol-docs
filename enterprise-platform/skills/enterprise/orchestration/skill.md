# Skill: Orchestration

## Mục tiêu
Điều phối pipeline feature: assign agent, track trạng thái, escalate, tổng hợp release readiness.

## Input
- `miniapp`, `feature-id`
- Path `applications/<miniapp>/requirement/<feature-id>/`

## Quy trình
1. Đọc `requirement.txt` — xác nhận đủ điều kiện bắt đầu.
2. Tạo/ cập nhật `docs/<feature-id>/pipeline-progress.md`.
3. Chạy tuần tự/song song theo `workflows/feature-development.yaml`.
4. Validate output path theo FEATURE-LIFECYCLE.
5. Escalate khi fail validation hoặc ambiguity.

## Output
- `pipeline-progress.md`
- Báo cáo sẵn sàng release

## Checklist
- [ ] Mọi artifact đúng path
- [ ] `_index.md` status được cập nhật
- [ ] Không bỏ bước bắt buộc (trừ shortcut workflow)

## Tham chiếu
- [governance/workflow-rules.md](../../../governance/workflow-rules.md)
- [FEATURE-LIFECYCLE.md](../../../FEATURE-LIFECYCLE.md)
