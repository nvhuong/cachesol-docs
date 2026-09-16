# Quy tắc Workflow & Orchestration

## 1. Mục đích
Định nghĩa cách Orchestrator điều phối pipeline phát triển feature miniapp.

## 2. Nguyên tắc
- Một pipeline instance gắn với cặp `(miniapp, feature-id)`.
- Artifact phải ghi đúng path trong [FEATURE-LIFECYCLE.md](../FEATURE-LIFECYCLE.md).
- Bước sau chỉ chạy khi bước trước pass validation.
- Escalate cho người dùng khi ambiguity hoặc CRITICAL architecture violation.

## 3. Trạng thái Pipeline
`queued` → `running` → `blocked` → `review` → `ready-for-release` | `failed`

## 4. Concurrent tasks
Tối đa số agent song song theo `agents/orchestrator/tools.yaml` (`max_concurrent_tasks`).
Ưu tiên chạy song song: API Architect ∥ UX Designer; Backend ∥ Frontend (sau khi có api-spec + ui-spec).

## 5. Validation tối thiểu mỗi bước
Xem `workflows/feature-development.yaml` — mỗi step có `validation[]`. Fail → `on_failure: escalate`.

## 6. Shortcut
Dùng workflow rút gọn khi phù hợp (`bug-fix`, `api-change`, `architecture-change`) — xem PIPELINE-PROMPTS.md mục Shortcut.
