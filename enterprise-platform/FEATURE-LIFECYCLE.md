# Vòng đời Tính năng Miniapp (Feature Lifecycle)

Tài liệu này định nghĩa luồng chuẩn từ **requirement thô** → **tài liệu kỹ thuật** → **implement code** → **testing** cho mỗi tính năng trong một miniapp (application).

## 1. Khái niệm

| Thuật ngữ | Ý nghĩa |
|-----------|---------|
| **Miniapp** | Một application nghiệp vụ trong `applications/` (vd: `hrm`, `erp`, `sales`) |
| **Feature** | Một tính năng có thư mục riêng dưới `requirement/<feature-id>/` |
| **Requirement thô** | File `.txt` + ảnh do stakeholder / BA cung cấp |
| **Artifact** | Tài liệu hoặc code sinh ra ở từng bước pipeline |

## 2. Cấu trúc thư mục mỗi Miniapp

```text
applications/<miniapp>/
├── README.md
├── requirement/                      # ĐẦU VÀO nghiệp vụ
│   ├── README.md                     # Quy ước đặt tên, cách thêm feature
│   ├── _index.md                     # Danh mục feature
│   └── <feature-id>/
│       ├── requirement.txt           # Bắt buộc — mô tả thô
│       ├── images/                   # Ảnh wireframe / mock / screenshot
│       │   ├── 01-list.png
│       │   └── 02-form.png
│       └── requirement-doc.md        # BA sinh ra (sau bước 1)
├── docs/                             # TÀI LIỆU kỹ thuật theo feature
│   └── <feature-id>/
│       ├── solution-architecture.md
│       ├── api-spec.yaml
│       ├── event-design.md
│       ├── ui-spec.md
│       ├── db-design.md
│       └── reviews/
│           ├── architecture-review-report.md
│           ├── code-review-report.md
│           └── design-review-report.md
├── frontend/                         # CODE ReactJS
├── backend/                          # CODE Spring Boot
└── tests/                            # TEST + báo cáo
    └── <feature-id>/
        ├── test-cases.md
        ├── test-report.md
        └── e2e/
```

Template mẫu: [`applications/_templates/`](applications/_templates/).

## 3. Quy ước đặt tên Feature ID

- Dùng `kebab-case`, ngắn, tiếng Anh kỹ thuật: `employee-profile`, `leave-request`, `payroll-run`.
- Một feature = một thư mục. Không gộp nhiều epic lớn vào một folder.
- Đăng ký vào `requirement/_index.md` ngay khi tạo folder.

## 4. Pipeline 11 bước (artifact paths)

Input gốc: `applications/<miniapp>/requirement/<feature-id>/requirement.txt` (+ `images/`).

| Bước | Agent | Output (đường dẫn tương đối feature) |
|------|-------|--------------------------------------|
| 1 | Business Analyst | `requirement/<feature-id>/requirement-doc.md` |
| 2 | Solution Architect | `docs/<feature-id>/solution-architecture.md` |
| 3 | API Architect | `docs/<feature-id>/api-spec.yaml`, `event-design.md` |
| 4 | UX Designer | `docs/<feature-id>/ui-spec.md` |
| 5 | Backend Developer | `backend/` + `docs/<feature-id>/db-design.md` |
| 6 | Frontend Developer | `frontend/` |
| 7 | Tester | `tests/<feature-id>/test-report.md`, test code |
| 8 | Code Reviewer | `docs/<feature-id>/reviews/code-review-report.md` |
| 9 | Architecture Reviewer | `docs/<feature-id>/reviews/architecture-review-report.md` |
| 10 | Design Reviewer | `docs/<feature-id>/reviews/design-review-report.md` |
| 11 | Orchestrator | `docs/<feature-id>/pipeline-progress.md` → Release |

Danh sách prompt copy-paste: [`PROMPTS.md`](PROMPTS.md).  
Chi tiết pipeline: [`agents/PIPELINE-PROMPTS.md`](agents/PIPELINE-PROMPTS.md).  
Workflow máy: [`workflows/feature-development.yaml`](workflows/feature-development.yaml).

## 5. Cách bắt đầu một Feature mới

1. Chọn miniapp: `applications/hrm/` (ví dụ).
2. Copy template:
   ```bash
   FEATURE=leave-request
   cp -R applications/_templates/requirement/FEATURE-ID \
     applications/hrm/requirement/$FEATURE
   # Đổi tên folder FEATURE-ID nếu cần, điền requirement.txt, thêm ảnh vào images/
   ```
3. Cập nhật `applications/hrm/requirement/_index.md`.
4. Kích hoạt Orchestrator / chạy workflow `feature-development` với input:
   - `miniapp`: `hrm`
   - `feature-id`: `leave-request`
   - `requirement-path`: `applications/hrm/requirement/leave-request/`

## 6. Quy tắc bắt buộc (MUST)

- **MUST** có `requirement.txt` trước khi chạy BA.
- **MUST** tham chiếu ảnh trong `requirement.txt` bằng tên file tương đối (`images/01-list.png`).
- **MUST** ghi mọi artifact vào đúng path trong bảng mục 4 (không để rải ở root repo).
- **MUST NOT** implement code khi chưa có `requirement-doc.md` và `api-spec.yaml` (trừ hotfix — dùng `workflows/bug-fix.yaml`).
- **MUST** cập nhật `_index.md` trạng thái feature: `draft` → `docs` → `implementing` → `testing` → `done`.

## 7. Liên kết Governance

- Yêu cầu: [`governance/requirements-guideline.md`](governance/requirements-guideline.md)
- Kiến trúc: [`governance/architecture/principles.md`](governance/architecture/principles.md)
- AI agents: [`AI_RULES.md`](AI_RULES.md)
- Design System: [`design-system/README.md`](design-system/README.md)
