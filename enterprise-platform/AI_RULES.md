# AI Agent Rules & Guidelines

Quy tắc **BẮT BUỘC** cho AI Agents khi phân tích, thiết kế, code, review hoặc test trên Enterprise Platform.

## 1. Quy tắc Chung
- **MUST** dùng tiếng Việt cho document, comments, PR description (trừ thuật ngữ kỹ thuật).
- **MUST** đọc `README.md`, `AI_RULES.md`, và [`FEATURE-LIFECYCLE.md`](FEATURE-LIFECYCLE.md) trước khi làm việc.
- **MUST NOT** đoán khi requirement mơ hồ — hỏi lại user.
- **MUST NOT** bỏ qua cảnh báo linting/sonar sau khi generate code.

## 2. Luồng Feature Miniapp (bắt buộc)
Mọi tính năng mới đi theo:

`applications/<miniapp>/requirement/<feature-id>/requirement.txt` (+ `images/`)
→ docs → code → tests

- **MUST** ghi artifact đúng path trong FEATURE-LIFECYCLE (không dump file ở root).
- **MUST** cập nhật `requirement/_index.md` khi đổi trạng thái feature.
- **MUST NOT** implement code khi chưa có `requirement-doc.md` và (với API mới) `api-spec.yaml` — trừ hotfix (`workflows/bug-fix.yaml`).

## 3. Tài liệu Bắt buộc Đọc theo vai trò
| Agent | Đọc |
|-------|-----|
| Tất cả | `README.md`, `AI_RULES.md`, `FEATURE-LIFECYCLE.md` |
| Business Analyst | `governance/requirements-guideline.md` |
| Architect | `governance/architecture/` |
| Backend Dev | `governance/architecture/standards/backend.md`, `database.md`, `governance/database/` |
| Frontend Dev | `governance/architecture/standards/frontend.md`, `design-system/` |
| Tester | `governance/quality/testing-standard.md` |
| Reviewers | `governance/architecture/architecture-rules.yaml`, `governance/quality/` |

## 4. Coding Convention
- **MUST** tuân thủ `governance/architecture/standards/backend.md` và `frontend.md`.
- **MUST** đặt tên rõ nghĩa (Java `PascalCase` class, React `PascalCase` components).
- **MUST NOT** để `TODO` chết hoặc code chết không được dùng.

## 5. Phạm vi Quyền Agent
- **BA:** chỉ requirement docs (`requirement-doc.md`, stories) — không sinh code.
- **Architect:** YAML governance + ADR + solution docs — không sinh business code.
- **Developer:** code + unit tests trong `frontend/` / `backend/` — không đổi architecture YAML khi chưa approve.
- **Reviewer:** read-only code → report trong `docs/<feature-id>/reviews/`.
- **Tester:** test cases/scripts + `test-report.md` — không sửa logic app.
- **Orchestrator:** điều phối pipeline, cập nhật `pipeline-progress.md`.

## 6. Security
- **MUST NOT** log mật khẩu, token, PII.
- **MUST NOT** hardcode secrets — dùng env / config server.
- **MUST** tuân thủ `governance/architecture/standards/security.md`.

## 7. Checklist trước khi Submit
1. Compile / typecheck pass?
2. Đúng Microservice + DB-per-service?
3. Unit tests đạt coverage chuẩn?
4. Không hardcode credentials?
5. Endpoint mới đã có trong `api-spec.yaml`?
6. Artifact nằm đúng `applications/<miniapp>/...`?

## 8. ADR
Quyết định ảnh hưởng hệ thống/domain lớn → ADR tại `governance/architecture/ADR/ADR-XXX-ten.md`.
