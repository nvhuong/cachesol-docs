# Cấu Trúc Thư Mục Tài Liệu

Tài liệu này mô tả chi tiết cấu trúc tổ chức thư mục của Enterprise Platform Documentation.

---

## Tổng quan Cấu trúc

```
enterprise-platform/
│
├── README.md                     # Trang chủ tài liệu
├── SOURCE-CODE-STRUCTURE.md      # Cấu trúc source code
├── FEATURE-LIFECYCLE.md          # Vòng đời feature
├── AI_RULES.md                   # Quy tắc cho AI Agents
├── CONTRIBUTING.md                # Hướng dẫn đóng góp
├── PROMPTS.md                    # Catalog prompts có thể copy-paste
│
├── applications/                  # Tài liệu ứng dụng (Mini Apps)
├── platform/                     # Tài liệu Platform Services
├── governance/                   # Tài liệu Governance
├── design-system/                # Design System
├── agents/                       # AI Agent definitions
├── skills/                       # Skills cho agents
└── workflows/                   # CI/CD Workflows
```

---

## 1. Applications (`applications/`)

Tài liệu cho từng Mini App (Frontend + Backend).

### 1.1 Cấu trúc Application

```
applications/
├── _templates/                   # Template cho feature mới
│   └── requirement/
│       └── FEATURE-ID/          # Template folder feature
│           ├── README.md
│           ├── requirement.txt
│           ├── images/
│           │   └── README.md
│           └── docs/            # Docs template (optional)
│
├── hrm/                         # HRM Mini App
├── erp/                         # ERP Mini App
├── sales/                       # Sales Mini App
├── finance/                     # Finance Mini App
├── attendance/                  # Attendance Mini App
└── marketing/                   # Marketing Mini App
```

### 1.2 Cấu trúc từng Application

```
applications/{miniapp}/
│
├── README.md                     # Giới thiệu mini app
│
├── requirement/                  # Requirements theo feature
│   ├── _index.md                # Danh sách features
│   │
│   └── {feature-id}/            # Feature folder
│       ├── README.md            # Feature overview
│       ├── requirement.txt       # Raw requirement (Business)
│       ├── requirement-doc.md   # Tài liệu requirement (BA tạo)
│       ├── images/              # Ảnh mockup/wireframe
│       │   ├── screen-1.png
│       │   ├── screen-2.png
│       │   └── README.md       # Danh sách ảnh
│       └── docs/                # Technical docs (tạo sau)
│
├── docs/                        # Technical documents
│   ├── _index.md               # Danh sách tài liệu kỹ thuật
│   │
│   └── {feature-id}/           # Feature docs folder
│       ├── pipeline-progress.md # Theo dõi tiến độ pipeline
│       ├── solution-architecture.md  # Solution Architect
│       ├── api-spec.yaml       # API Specification (OpenAPI)
│       ├── event-design.md     # Kafka event design
│       ├── ui-spec.md          # UI/UX Specification
│       ├── db-design.md        # Database design
│       │
│       ├── diagrams/            # Architecture diagrams
│       │   ├── architecture.html
│       │   ├── sequence.html
│       │   └── workflow.html
│       │
│       └── reviews/            # Review reports
│           ├── code-review-report.md
│           ├── architecture-review-report.md
│           ├── design-review-report.md
│           └── security-report.md
│
├── backend/                     # Backend source code
│   ├── src/                    # Source code
│   ├── pom.xml
│   └── README.md
│
├── frontend/                    # Frontend source code
│   ├── src/                    # Source code
│   ├── package.json
│   └── README.md
│
└── tests/                      # Test documents & code
    ├── _index.md               # Danh sách test cases
    │
    └── {feature-id}/           # Feature tests folder
        ├── test-cases.md      # Test case specifications
        ├── test-report.md     # Test execution report
        └── test-code/         # Test source code (optional)
            ├── unit/
            ├── integration/
            └── e2e/
```

### 1.3 Feature Lifecycle Path Map

```
Requirement Input                              Technical Output
      │                                              │
      ▼                                              ▼
requirement.txt ──► requirement-doc.md ──► solution-architecture.md
                   (BA)                    (Solution Architect)
                                                    │
                         ┌──────────────────────────┴────────────────────┐
                         ▼                                                ▼
              api-spec.yaml ◄──────────────────────────────► ui-spec.md
              (API Architect)                                  (UX Designer)
                         │                                                │
                         ▼                                                ▼
              backend/ + db-design.md                         frontend/
              (Backend Dev)                                   (Frontend Dev)
                         │                                                │
                         └────────────────┬───────────────────────────────┘
                                          ▼
                                  test-cases.md + test-code/
                                      (Tester)
                                          │
                                          ▼
                         ┌────────────────┴────────────────┐
                         ▼                                 ▼
              code-review-report.md          design-review-report.md
              (Code Reviewer)                (Design Reviewer)
                         │                                 │
                         └──────────────┬──────────────────┘
                                        ▼
                            architecture-review-report.md
                              (Architecture Reviewer)
                                        │
                                        ▼
                           pipeline-progress.md (final)
                              (Orchestrator)
```

---

## 2. Platform Services (`platform/`)

Tài liệu cho các Platform Services dùng chung.

```
platform/
├── iam/                        # Identity & Access Management
│   └── README.md
│
├── social-integration/        # Social Integration (notifications + channels + posts + pages + analytics)
│   └── README.md
│
├── workflow/                  # Workflow Engine
│   └── README.md
│
├── file/                      # File Management
│   └── README.md
│
├── search/                   # Search Service
│   └── README.md
│
├── scheduler/                 # Job Scheduler
│   └── README.md
│
├── audit/                    # Audit Logging
│   └── README.md
│
├── master-data/             # Master Data Management
│   └── README.md
│
├── integration/              # Integration Platform
│   └── README.md
│
├── organization/            # Organization Management
│   └── README.md
│
├── employee/                # Employee Service
│   └── README.md
│
├── customer/                # Customer Service
│   └── README.md
│
├── reporting/               # Reporting Service
│   └── README.md
│
└── configuration/          # Configuration Service
    └── README.md
```

### 2.1 Platform Service README Structure

```markdown
# {Service Name}

## Mô tả
Mô tả ngắn gọn service và chức năng chính.

## Bounded Context
Phạm vi nghiệp vụ của service.

## API Endpoints
Danh sách API endpoints chính.

## Events (Kafka)
Các event mà service produce/consume.

## Database Schema
Mô tả database schema.

## Dependencies
Các service/platform phụ thuộc.

## Getting Started
Hướng dẫn local development.
```

---

## 3. Governance (`governance/`)

Tài liệu governance, standards, và best practices.

```
governance/
│
├── requirements-guideline.md    # Hướng dẫn viết requirement
├── workflow-rules.md           # Quy tắc workflow
│
├── api/                        # API Standards
│   ├── naming.md              # API naming conventions
│   ├── versioning.md          # API versioning
│   ├── pagination.md         # Pagination standard
│   ├── error-handling.md     # Error handling
│   ├── security.md          # API security
│   └── api-rules.yaml        # API rules (linter)
│
├── architecture/               # Architecture Standards
│   ├── principles.md         # Architecture principles
│   ├── system-context.md     # System context diagram
│   │
│   ├── standards/            # Technical standards
│   │   ├── backend.md       # Backend standards (Spring Boot)
│   │   ├── frontend.md      # Frontend standards (React)
│   │   ├── database.md      # Database standards
│   │   ├── messaging.md     # Kafka/messaging standards
│   │   └── security.md     # Security standards
│   │
│   ├── services.yaml         # Service catalog
│   ├── domains.yaml         # Domain definitions
│   │
│   └── ADR/                  # Architecture Decision Records
│       ├── ADR-001-microservice.md
│       ├── ADR-002-database-ownership.md
│       └── ADR-003-event-driven.md
│
├── database/                  # Database Standards
│   ├── naming.md             # Naming conventions
│   ├── ownership.md         # Database ownership
│   ├── migration.md         # Migration guidelines
│   └── indexing.md          # Indexing guidelines
│
├── security/                  # Security Standards
│   ├── authentication.md    # Authentication
│   ├── authorization.md     # Authorization (RBAC/ABAC)
│   ├── RBAC.md              # Role-based access control
│   ├── data-classification.md # Data classification
│   ├── audit.md             # Audit requirements
│   └── security-checklist.md # Security checklist
│
└── quality/                  # Quality Standards
    ├── coding-standard.md   # Coding standards
    ├── code-review.md       # Code review guidelines
    ├── testing-standard.md  # Testing standards
    └── performance.md       # Performance guidelines
```

---

## 4. Design System (`design-system/`)

Design System cho toàn platform.

```
design-system/
│
├── README.md                   # Design System overview
│
├── tokens/                    # Design tokens
│   ├── colors.md
│   ├── typography.md
│   ├── spacing.md
│   ├── shadows.md
│   └── README.md
│
├── components/                # Base components
│   ├── Button.md
│   ├── Input.md
│   ├── Select.md
│   ├── Table.md
│   ├── Modal.md
│   └── README.md
│
├── patterns/                  # Common patterns
│   ├── forms.md
│   ├── navigation.md
│   ├── data-display.md
│   ├── feedback.md
│   └── README.md
│
└── templates/                 # Page templates
    ├── list-page.md
    ├── detail-page.md
    ├── form-page.md
    ├── dashboard-page.md
    └── README.md
```

---

## 5. Agents (`agents/`)

AI Agent definitions và configurations.

```
agents/
│
├── PIPELINE-PROMPTS.md        # Pipeline prompts reference
│
├── orchestrator/              # Orchestrator Agent
│   ├── README.md
│   ├── system-prompt.md       # System prompt chính
│   ├── workflow.md           # Workflow definition
│   ├── tools.yaml            # Tools configuration
│   └── agent.yaml
│
├── backend-developer/         # Backend Developer Agent
│   ├── README.md
│   ├── system-prompt.md
│   ├── workflow.md
│   ├── tools.yaml
│   └── agent.yaml
│
├── frontend-developer/        # Frontend Developer Agent
│   ├── README.md
│   ├── system-prompt.md
│   ├── workflow.md
│   ├── tools.yaml
│   └── agent.yaml
│
├── business-analyst/          # Business Analyst Agent
│   ├── README.md
│   ├── system-prompt.md
│   ├── workflow.md
│   ├── tools.yaml
│   └── agent.yaml
│
├── solution-architect/        # Solution Architect Agent
│   ├── README.md
│   ├── system-prompt.md
│   ├── workflow.md
│   ├── tools.yaml
│   └── agent.yaml
│
├── api-architect/             # API Architect Agent
│   ├── README.md
│   ├── system-prompt.md
│   ├── workflow.md
│   ├── tools.yaml
│   └── agent.yaml
│
├── ux-designer/               # UX Designer Agent
│   ├── README.md
│   ├── system-prompt.md
│   ├── workflow.md
│   ├── tools.yaml
│   └── agent.yaml
│
├── tester/                     # Tester Agent
│   ├── README.md
│   ├── system-prompt.md
│   ├── workflow.md
│   ├── tools.yaml
│   └── agent.yaml
│
├── code-reviewer/              # Code Reviewer Agent
│   ├── README.md
│   ├── system-prompt.md
│   ├── workflow.md
│   ├── tools.yaml
│   └── agent.yaml
│
├── architecture-reviewer/       # Architecture Reviewer Agent
│   ├── README.md
│   ├── system-prompt.md
│   ├── workflow.md
│   ├── tools.yaml
│   └── agent.yaml
│
└── design-reviewer/             # Design Reviewer Agent
    ├── README.md
    ├── system-prompt.md
    ├── workflow.md
    ├── tools.yaml
    └── agent.yaml
```

---

## 6. Skills (`skills/`)

Skills cho agents sử dụng.

```
skills/
│
├── README.md                   # Skills overview
│
├── enterprise/                 # Enterprise skills (alias)
│   ├── requirement-analysis.md
│   ├── solution-design.md
│   ├── api-design.md
│   ├── ux-design.md
│   ├── spring-boot-development.md
│   ├── react-development.md
│   ├── testing.md
│   ├── code-review.md
│   ├── architecture-review.md
│   ├── design-review.md
│   ├── orchestration.md
│   ├── business-analysis.md
│   ├── domain-analysis.md
│   ├── architecture-analysis.md
│   ├── security-check.md
│   └── debugging.md
│
├── architecture/               # Architecture skills
│   ├── api-design/
│   ├── database-design/
│   ├── event-design/
│   ├── service-design/
│   └── solution-architecture/
│
├── design/                     # Design skills
│   ├── ui-design/
│   ├── ux-design/
│   ├── design-system/
│   ├── accessibility/
│   └── visual-review/
│
├── development/               # Development skills
│   ├── backend/
│   ├── frontend/
│   ├── database/
│   └── integration/
│
├── testing/                    # Testing skills
│   ├── unit-test/
│   ├── integration-test/
│   ├── e2e-test/
│   └── visual-test/
│
└── review/                     # Review skills
    ├── api-review/
    ├── architecture-review/
    ├── code-review/
    ├── design-review/
    ├── security-review/
    └── performance-review/
```

---

## 7. Workflows (`workflows/`)

CI/CD và business workflows.

```
workflows/
│
├── feature-development.yaml    # Feature development pipeline
├── bug-fix.yaml               # Bug fix workflow
├── api-change.yaml            # API change workflow
├── architecture-change.yaml   # Architecture change workflow
└── release.yaml              # Release workflow
```

---

## 8. Quy tắc đặt tên File/Folder

### 8.1 Tên Folder

| Loại | Quy tắc | Ví dụ |
|------|---------|-------|
| Application | kebab-case | `hrm`, `employee-profile` |
| Feature | kebab-case | `employee-profile`, `leave-request` |
| Module | kebab-case | `requirement`, `backend`, `frontend` |
| Platform | kebab-case | `iam`, `social-integration`, `workflow` |
| Governance | kebab-case | `api`, `architecture`, `security` |

### 8.2 Tên File

| Loại | Quy tắc | Ví dụ |
|------|---------|-------|
| Documentation | kebab-case, `.md` | `solution-architecture.md` |
| API Spec | kebab-case, `.yaml` | `api-spec.yaml` |
| Config | kebab-case, `.yml/.yaml` | `api-rules.yaml` |
| Workflow | kebab-case, `.yaml` | `feature-development.yaml` |
| Image | kebab-case, `.png/.jpg` | `screen-login.png` |

### 8.3 Feature ID

Format: `{domain}-{short-name}`

| Feature | ID |
|---------|-----|
| Quản lý hồ sơ nhân viên | `employee-profile` |
| Phê duyệt nghỉ phép | `leave-approval` |
| Báo cáo doanh thu | `revenue-report` |

---

## 9. Tài liệu bắt buộc theo Feature

Mỗi feature phải có đủ các tài liệu sau:

| # | Tài liệu | Location | Owner |
|---|-----------|----------|-------|
| 1 | `requirement.txt` | `requirement/{feature-id}/` | BA |
| 2 | `requirement-doc.md` | `requirement/{feature-id}/` | BA |
| 3 | `solution-architecture.md` | `docs/{feature-id}/` | SA |
| 4 | `api-spec.yaml` | `docs/{feature-id}/` | API |
| 5 | `event-design.md` | `docs/{feature-id}/` | API |
| 6 | `ui-spec.md` | `docs/{feature-id}/` | UX |
| 7 | `db-design.md` | `docs/{feature-id}/` | BE |
| 8 | `test-cases.md` | `tests/{feature-id}/` | QA |
| 9 | `code-review-report.md` | `docs/{feature-id}/reviews/` | CR |
| 10 | `architecture-review-report.md` | `docs/{feature-id}/reviews/` | AR |
| 11 | `design-review-report.md` | `docs/{feature-id}/reviews/` | DR |

---

## Liên kết

- [README.md](../README.md)
- [FEATURE-LIFECYCLE.md](../FEATURE-LIFECYCLE.md)
- [SOURCE-CODE-STRUCTURE.md](../SOURCE-CODE-STRUCTURE.md)
