# Danh sách Prompt — Làm mọi thứ với Enterprise Platform

File này là **catalog copy-paste**. Điền `{{MINIAPP}}`, `{{FEATURE_ID}}`, rồi dán vào Cursor / Claude / ChatGPT.

**Quy tắc chung (gắn vào mọi prompt dài):**
- Đọc `AI_RULES.md` + `FEATURE-LIFECYCLE.md`
- Ghi artifact đúng path trong bảng lifecycle
- Dùng tiếng Việt (trừ thuật ngữ kỹ thuật)
- Không đoán khi mơ hồ — hỏi lại

**Biến thay thế:**
| Biến | Ví dụ |
|------|--------|
| `{{MINIAPP}}` | `hrm` |
| `{{FEATURE_ID}}` | `employee-profile` |
| `{{TITLE}}` | `Quản lý hồ sơ nhân viên` |

**Path gốc feature:**
`applications/{{MINIAPP}}/requirement/{{FEATURE_ID}}/`

---

## Mục lục nhanh

1. [Khởi tạo feature](#1-khởi-tạo-feature)
2. [Chạy full pipeline 11 bước](#2-chạy-full-pipeline-11-bước)
3. [Prompt từng agent](#3-prompt-từng-agent)
4. [Shortcut: bug / API / UI / hotfix](#4-shortcut)
5. [Review & chất lượng](#5-review--chất-lượng)
6. [Diagram / Archify](#6-diagram--archify)
7. [Bảo trì tài liệu](#7-bảo-trì-tài-liệu)
8. [One-shot: làm hết trong 1 chat](#8-one-shot-làm-hết-trong-1-chat)

System prompt chi tiết: `agents/<tên-agent>/system-prompt.md`  
Workflow: `workflows/feature-development.yaml`

---

## 1. Khởi tạo feature

### P01 — Tạo folder requirement mới

```text
Hãy khởi tạo feature miniapp mới theo FEATURE-LIFECYCLE.md.

miniapp: {{MINIAPP}}
feature-id: {{FEATURE_ID}}
title: {{TITLE}}
priority: High|Medium|Low
owner: {{OWNER}}

Việc cần làm:
1. Copy template từ applications/_templates/requirement/FEATURE-ID/
   sang applications/{{MINIAPP}}/requirement/{{FEATURE_ID}}/
2. Điền requirement.txt theo governance/requirements-guideline.md
   (dùng thông tin tôi cung cấp bên dưới nếu có).
3. Tạo images/README.md với danh sách ảnh cần có.
4. Cập nhật applications/{{MINIAPP}}/requirement/_index.md (status: draft).
5. Tạo thư mục trống docs/{{FEATURE_ID}}/, tests/{{FEATURE_ID}}/ nếu chưa có.

Mô tả nghiệp vụ thô:
---
{{PASTE_RAW_REQUIREMENT_HERE}}
---
```

### P02 — Bổ sung / chuẩn hóa requirement.txt từ chat

```text
Đọc applications/{{MINIAPP}}/requirement/{{FEATURE_ID}}/requirement.txt (nếu có).
Chuẩn hóa lại theo template trong governance/requirements-guideline.md.
Hỏi tôi tối đa 5 câu nếu thiếu thông tin quan trọng.
Sau khi đủ, ghi đè requirement.txt và cập nhật _index.md.
Không tạo requirement-doc.md ở bước này.
```

### P03 — Gắn mô tả ảnh (khi đã có file trong images/)

```text
Liệt kê file trong applications/{{MINIAPP}}/requirement/{{FEATURE_ID}}/images/.
Cập nhật mục "Màn hình / Ảnh tham chiếu" trong requirement.txt cho khớp tên file thực tế.
Nếu thiếu ảnh quan trọng, liệt kê danh sách cần bổ sung (không bịa file).
```

---

## 2. Chạy full pipeline 11 bước

### P10 — Orchestrator: bắt đầu pipeline

```text
Kích hoạt Orchestrator theo agents/orchestrator/system-prompt.md và skills/enterprise/orchestration.

miniapp: {{MINIAPP}}
feature-id: {{FEATURE_ID}}
requirement-path: applications/{{MINIAPP}}/requirement/{{FEATURE_ID}}/

Nhiệm vụ:
1. Kiểm tra có requirement.txt (bắt buộc). images/ khuyến nghị.
2. Tạo applications/{{MINIAPP}}/docs/{{FEATURE_ID}}/pipeline-progress.md
   với bảng tracker 11 bước (status queued).
3. Cập nhật requirement/_index.md → status: docs (khi BA xong sẽ đổi tiếp).
4. Bắt đầu bước 1 (Business Analyst). Sau mỗi bước: cập nhật tracker, ghi path artifact.
5. Chạy đủ 11 bước theo workflows/feature-development.yaml.
   Song song khi được phép: API∥UX; Backend∥Frontend; các Review∥nhau.
6. Khi xong: status ready-for-release hoặc blocked + lý do.

Tuân thủ AI_RULES.md và FEATURE-LIFECYCLE.md.
```

### P11 — Chạy tiếp pipeline từ bước đang dang dở

```text
Tiếp tục pipeline feature.
miniapp: {{MINIAPP}}
feature-id: {{FEATURE_ID}}

Đọc docs/{{FEATURE_ID}}/pipeline-progress.md.
Xác định bước tiếp theo còn pending/failed.
Chạy bước đó theo đúng agent + skill + output path.
Cập nhật tracker sau khi xong.
```

---

## 3. Prompt từng agent

> Trước mỗi prompt: attach (hoặc @) các file Input. Nên paste thêm:  
> `Áp dụng agents/<agent>/system-prompt.md và skill tương ứng trong tools.yaml.`

### P20 — Business Analyst (bước 1)

```text
Vai trò: Business Analyst (agents/business-analyst/system-prompt.md).
Skill: skills/enterprise/requirement-analysis.

Input:
- applications/{{MINIAPP}}/requirement/{{FEATURE_ID}}/requirement.txt
- applications/{{MINIAPP}}/requirement/{{FEATURE_ID}}/images/ (nếu có)
- governance/requirements-guideline.md
- governance/architecture/domains.yaml

Output BẮT BUỘC:
applications/{{MINIAPP}}/requirement/{{FEATURE_ID}}/requirement-doc.md

Yêu cầu:
- Epics / Features / User Stories
- Acceptance Criteria Given-When-Then (≥ 3)
- NFR, Out-of-scope, Risks, Assumptions
- Traceability: story → ảnh → màn hình
- Cập nhật _index.md status phù hợp
Hỏi lại nếu mơ hồ. Không viết code.
```

### P21 — Solution Architect (bước 2)

```text
Vai trò: Solution Architect (agents/solution-architect/system-prompt.md).
Skill: skills/enterprise/solution-design.

Input:
- applications/{{MINIAPP}}/requirement/{{FEATURE_ID}}/requirement-doc.md
- governance/architecture/principles.md
- governance/architecture/architecture-rules.yaml
- governance/architecture/services.yaml

Output:
applications/{{MINIAPP}}/docs/{{FEATURE_ID}}/solution-architecture.md

Yêu cầu:
- C4 / Mermaid (context + container tối thiểu)
- Bounded context, services bị ảnh hưởng
- Data ownership (database-per-service)
- Sync vs async (Kafka), NFR
- Không viết business code
```

### P22 — API Architect (bước 3)

```text
Vai trò: API Architect (agents/api-architect/system-prompt.md).
Skill: skills/enterprise/api-design.

Input:
- docs/{{FEATURE_ID}}/solution-architecture.md
- requirement/{{FEATURE_ID}}/requirement-doc.md
- governance/api/

Output:
- applications/{{MINIAPP}}/docs/{{FEATURE_ID}}/api-spec.yaml
- applications/{{MINIAPP}}/docs/{{FEATURE_ID}}/event-design.md

Yêu cầu: OpenAPI 3, /api/v1, pagination, error schema chuẩn, không breaking change ẩn.
```

### P23 — UX Designer (bước 4)

```text
Vai trò: UX Designer (agents/ux-designer/system-prompt.md).
Skill: skills/enterprise/ux-design.

Input:
- requirement-doc.md + images/
- solution-architecture.md
- design-system/

Output:
applications/{{MINIAPP}}/docs/{{FEATURE_ID}}/ui-spec.md

Yêu cầu: wireframe ASCII/mô tả màn hình, states Empty/Loading/Error/Success,
map component Ant Design 5 / design-system, responsive + a11y cơ bản.
```

### P24 — Backend Developer (bước 5)

```text
Vai trò: Backend Developer (agents/backend-developer/system-prompt.md).
Skill: skills/enterprise/spring-boot-development.

Input:
- solution-architecture.md, api-spec.yaml, event-design.md
- governance/architecture/standards/backend.md
- governance/database/naming.md

Output:
- Code trong applications/{{MINIAPP}}/backend/
- applications/{{MINIAPP}}/docs/{{FEATURE_ID}}/db-design.md
- Flyway migration nếu cần

Yêu cầu: Spring Boot 21, DTO≠Entity, @PreAuthorize, không hardcode secrets,
không log PII, unit test service ≥ 80% cho phần mới.
```

### P25 — Frontend Developer (bước 6)

```text
Vai trò: Frontend Developer (agents/frontend-developer/system-prompt.md).
Skill: skills/enterprise/react-development.

Input:
- api-spec.yaml, ui-spec.md
- design-system/
- governance/architecture/standards/frontend.md

Output:
Code trong applications/{{MINIAPP}}/frontend/

Yêu cầu: React + Ant Design 5, React Query, RHF+Zod cho form,
loading/error/empty states, ARIA, không inline style lung tung, feature flag nếu cần.
```

### P26 — Tester (bước 7)

```text
Vai trò: Tester (agents/tester/system-prompt.md).
Skill: skills/enterprise/testing.

Input:
- requirement-doc.md, api-spec.yaml
- source backend/ + frontend/
- governance/quality/testing-standard.md

Output:
- applications/{{MINIAPP}}/tests/{{FEATURE_ID}}/test-cases.md
- applications/{{MINIAPP}}/tests/{{FEATURE_ID}}/test-report.md
- code test (unit/integration/e2e) vào tests/ hoặc cạnh source theo chuẩn repo

Yêu cầu: cover mọi Acceptance Criteria; ghi rõ pass/fail; không sửa logic app.
```

### P27 — Code Reviewer (bước 8)

```text
Vai trò: Code Reviewer (agents/code-reviewer/system-prompt.md).
Skill: skills/enterprise/code-review (+ security-check nếu cần).

Input: diff / source backend + frontend của feature.
Governance: governance/quality/coding-standard.md, code-review.md, standards/security.md

Output:
applications/{{MINIAPP}}/docs/{{FEATURE_ID}}/reviews/code-review-report.md

Format: CRITICAL / MAJOR / MINOR + gợi ý sửa. Không sửa code trừ khi tôi yêu cầu.
```

### P28 — Architecture Reviewer (bước 9)

```text
Vai trò: Architecture Reviewer (agents/architecture-reviewer/system-prompt.md).
Skill: skills/enterprise/architecture-review.

Input: solution-architecture.md + backend code liên quan.
Governance: architecture-rules.yaml, principles.md

Output:
applications/{{MINIAPP}}/docs/{{FEATURE_ID}}/reviews/architecture-review-report.md

Kiểm tra: DB-per-service, no cross-DB, circuit breaker sync calls, secrets, API versioning.
Trích dẫn Rule ID (ARCH-xxx).
```

### P29 — Design Reviewer (bước 10)

```text
Vai trò: Design Reviewer (agents/design-reviewer/system-prompt.md).
Skill: skills/enterprise/design-review.

Input: ui-spec.md + frontend code.
Governance: design-system/

Output:
applications/{{MINIAPP}}/docs/{{FEATURE_ID}}/reviews/design-review-report.md

Kiểm: tokens, consistency, a11y, responsive, states UI.
```

### P30 — Orchestrator đóng pipeline (bước 11)

```text
Vai trò: Orchestrator.
Đọc tất cả reports trong docs/{{FEATURE_ID}}/reviews/ và tests/{{FEATURE_ID}}/test-report.md.
Cập nhật pipeline-progress.md.
Nếu không còn CRITICAL: đánh dấu ready-for-release và cập nhật _index.md → testing hoặc done.
Nếu còn CRITICAL: liệt kê việc phải làm + agent phụ trách.
```

---

## 4. Shortcut

### P40 — Bug fix nhanh

```text
Chạy workflows/bug-fix.yaml.

miniapp: {{MINIAPP}}
feature-id: {{FEATURE_ID}}  (hoặc bugfixes/<id>)

Bug report:
---
{{STEPS_TO_REPRODUCE}}
Expected:
Actual:
---

Tuần tự: BA phân tích → debugging (fix-design.md) → implement → tester → code reviewer.
Ghi artifact dưới applications/{{MINIAPP}}/docs/bugfixes/... và tests/bugfixes/...
```

### P41 — Đổi API nhỏ

```text
Chạy workflows/api-change.yaml cho {{MINIAPP}} / {{FEATURE_ID}}.
Thay đổi API cần làm:
---
{{API_CHANGE_DESCRIPTION}}
---
Cập nhật api-spec.yaml → review kiến trúc → backend → frontend → test contract.
Không breaking change nếu chưa tăng version.
```

### P42 — Chỉ UI/UX

```text
Chỉ sửa UI cho {{MINIAPP}} / {{FEATURE_ID}}.
1) UX Designer cập nhật ui-spec.md (nếu cần)
2) Frontend Developer implement
3) Design Reviewer review
Không đụng backend trừ khi thiếu field API — khi đó escalate.
```

### P43 — Hotfix production

```text
Hotfix khẩn cấp {{MINIAPP}}.
Phạm vi tối thiểu. Implement → Code Reviewer fast-track → liệt kê rủi ro + rollback.
Không refactor ngoài phạm vi bug.
Mô tả lỗi:
---
{{HOTFIX_DESC}}
---
```

### P44 — Architecture / ADR

```text
Chạy workflows/architecture-change.yaml.
adr-id: ADR-XXX-{{slug}}
Proposal:
---
{{CHANGE_PROPOSAL}}
---
Output: governance/architecture/ADR/ADR-XXX-{{slug}}.md rồi architecture review.
```

---

## 5. Review & chất lượng

### P50 — Review tài liệu feature đã có

```text
Review toàn bộ artifact của applications/{{MINIAPP}}/.../{{FEATURE_ID}}/
theo FEATURE-LIFECYCLE.md.
Báo cáo: thiếu file nào, path sai, mâu thuẫn BA↔API↔UI↔code, link gãy.
Đề xuất thứ tự sửa. Chưa sửa trừ khi tôi bảo "fix".
```

### P51 — Security pass nhanh

```text
Chạy skills/enterprise/security-check trên code feature {{FEATURE_ID}}.
Checklist: secrets, PII logging, authz, OWASP phổ biến.
Ghi security-report.md vào docs/{{FEATURE_ID}}/reviews/.
```

### P52 — Performance pass nhanh

```text
Review performance cho feature {{FEATURE_ID}} theo skills/review/performance-review
và governance/quality/performance.md.
Tập trung N+1, pagination, P95 API, bundle FE.
```

---

## 6. Diagram / Archify

### P60 — Vẽ kiến trúc bằng Archify

```text
Dùng skill archify.
Đọc solution-architecture.md (hoặc toàn repo runtime) của {{MINIAPP}} / {{FEATURE_ID}}.
Tạo architecture diagram (8–12 node), primary path rõ, trust boundary.
Validate + deliver HTML vào applications/{{MINIAPP}}/docs/{{FEATURE_ID}}/diagrams/
(nếu thư mục chưa có thì tạo).
```

### P61 — Sequence / workflow diagram

```text
Dùng archify vẽ sequence (hoặc workflow) cho luồng chính của {{FEATURE_ID}}.
Nguồn: requirement-doc.md + api-spec.yaml.
Output HTML cùng docs/{{FEATURE_ID}}/diagrams/.
```

---

## 7. Bảo trì tài liệu

### P70 — Đồng bộ _index.md tất cả miniapp

```text
Quét applications/*/requirement/ và cập nhật từng _index.md
cho khớp folder thực tế + status suy ra từ artifact (draft/docs/implementing/testing/done).
Không xóa feature đang có.
```

### P71 — Sửa link gãy trong docs governance/skills/agents

```text
Tìm link markdown gãy trong enterprise-platform (đặc biệt skills/** và agents/**).
Sửa trỏ về file tồn tại gần nghĩa nhất. Báo cáo danh sách đã sửa.
```

### P72 — Thêm platform service README

```text
Bổ sung/chuẩn hóa platform/{{SERVICE}}/README.md
theo cấu trúc: mô tả, bounded context, events, API, dependencies, schema, getting started.
Đối chiếu governance/architecture/services.yaml.
```

---

## 8. One-shot: làm hết trong 1 chat

### P80 — Full feature từ requirement thô (khuyến nghị khi chat dài / agent mạnh)

```text
Bạn là Orchestrator điều phối toàn bộ pipeline Enterprise Platform.

Đọc bắt buộc: AI_RULES.md, FEATURE-LIFECYCLE.md, workflows/feature-development.yaml.

miniapp: {{MINIAPP}}
feature-id: {{FEATURE_ID}}

Requirement thô:
---
{{PASTE_OR_PATH_TO_requirement.txt}}
---

Thực hiện tuần tự (ghi file thật vào đúng path):
0) Đảm bảo folder requirement + _index
1) BA → requirement-doc.md
2) SA → solution-architecture.md
3) API → api-spec.yaml + event-design.md
4) UX → ui-spec.md
5) BE → backend + db-design.md
6) FE → frontend
7) Tester → test-cases + test-report (+ test code)
8–10) Code / Arch / Design review reports
11) pipeline-progress.md + cập nhật _index

Sau mỗi bước: tóm tắt 3–5 dòng + path file đã ghi.
Dừng và hỏi tôi nếu CRITICAL ambiguity hoặc thiếu ảnh bắt buộc cho UX.
Khi xong: checklist “Ready for release?” Yes/No + lý do.
```

### P81 — Chỉ docs (không code)

```text
Chạy pipeline CHỈ đến hết bước 4 (BA → SA → API → UX) cho {{MINIAPP}}/{{FEATURE_ID}}.
Không generate backend/frontend/tests.
Cập nhật pipeline-progress.md ghi rõ dừng ở docs-ready.
```

### P82 — Chỉ implement + test (docs đã có)

```text
Docs đã sẵn trong applications/{{MINIAPP}}/docs/{{FEATURE_ID}}/.
Chạy bước 5→7 (BE, FE, Tester) rồi 8→11 reviews + orchestrator.
Không viết lại requirement/architecture trừ khi phát hiện mâu thuẫn — khi đó escalate.
```

---

## 9. Cheat sheet gắn System Prompt

| Việc | System prompt file | Skill alias |
|------|--------------------|-------------|
| BA | `agents/business-analyst/system-prompt.md` | `skills/enterprise/requirement-analysis` |
| SA | `agents/solution-architect/system-prompt.md` | `skills/enterprise/solution-design` |
| API | `agents/api-architect/system-prompt.md` | `skills/enterprise/api-design` |
| UX | `agents/ux-designer/system-prompt.md` | `skills/enterprise/ux-design` |
| BE | `agents/backend-developer/system-prompt.md` | `skills/enterprise/spring-boot-development` |
| FE | `agents/frontend-developer/system-prompt.md` | `skills/enterprise/react-development` |
| QA | `agents/tester/system-prompt.md` | `skills/enterprise/testing` |
| CR | `agents/code-reviewer/system-prompt.md` | `skills/enterprise/code-review` |
| AR | `agents/architecture-reviewer/system-prompt.md` | `skills/enterprise/architecture-review` |
| DR | `agents/design-reviewer/system-prompt.md` | `skills/enterprise/design-review` |
| ORCH | `agents/orchestrator/system-prompt.md` | `skills/enterprise/orchestration` |

---

## 10. Ví dụ đã điền sẵn (HRM employee-profile)

### Bắt đầu full pipeline

```text
Kích hoạt Orchestrator theo agents/orchestrator/system-prompt.md.

miniapp: hrm
feature-id: employee-profile
requirement-path: applications/hrm/requirement/employee-profile/

Đọc AI_RULES.md + FEATURE-LIFECYCLE.md.
Chạy đủ 11 bước workflows/feature-development.yaml.
Ghi mọi artifact đúng path. Cập nhật pipeline-progress.md và requirement/_index.md.
```

### Chỉ BA

```text
Vai trò Business Analyst. Skill requirement-analysis.
Input: applications/hrm/requirement/employee-profile/requirement.txt (+ images/).
Output: applications/hrm/requirement/employee-profile/requirement-doc.md
≥ 3 AC Given-When-Then. Hỏi lại nếu mơ hồ. Không code.
```

---

## Liên kết
- [FEATURE-LIFECYCLE.md](FEATURE-LIFECYCLE.md)
- [agents/PIPELINE-PROMPTS.md](agents/PIPELINE-PROMPTS.md)
- [governance/requirements-guideline.md](governance/requirements-guideline.md)
- [skills/README.md](skills/README.md)
- [workflows/feature-development.yaml](workflows/feature-development.yaml)
