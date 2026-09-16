# Enterprise Platform

## Tổng quan
Enterprise Platform là hệ sinh thái microservice phục vụ **multi-tenant SaaS doanh nghiệp**:

- **Mỗi khách hàng (tenant) = 1 công ty / tập đoàn**, có thể có nhiều công ty con, chi nhánh, trung tâm, phòng ban, chức danh tự khai báo.
- **Multi-tenant schema-per-tenant**: mỗi tenant 1 PostgreSQL schema riêng → cô lập dữ liệu tuyệt đối.
- **Backend tối giản**: 8 platform services (iam/platform-registry/tenant-manager/configuration/master-data/notification/workflow/approval) + 6+ applications nghiệp vụ.
- **IAM dùng Keycloak**: login/register/LDAP/SSO/OAuth2/MFA qua Keycloak, IAM service chỉ là thin bridge.

Xem chi tiết: [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Cấu trúc nền tảng
- **Backend:** Microservices với package gốc `com.cachesol.platform` (Xem: [`SOURCE-CODE-STRUCTURE.md`](SOURCE-CODE-STRUCTURE.md))
- **Frontend:** Mono-repo với **Mini App dạng Library** + Host Shell (Xem: [`MINI-APP-ARCHITECTURE.md`](MINI-APP-ARCHITECTURE.md))
- **Cấu trúc tài liệu:** Xem [`DOCUMENTATION-STRUCTURE.md`](DOCUMENTATION-STRUCTURE.md)

## Mục tiêu
- Chuẩn hoá phát triển phần cứng doanh nghiệp **multi-tenant**.
- Tối giản platform services (8 thay vì 15) → giảm overhead vận hành.
- Tái sử dụng module nền (Keycloak cho identity, shared libs cho audit/file/notification).
- Squad tự chủ triển khai từng miniapp/feature trong tenant của họ.

## Tech Stack
- **Backend:** Java Spring Boot 21, PostgreSQL (schema-per-tenant + ltree)
- **Frontend:** ReactJS + Ant Design 5
- **Identity:** Keycloak 24+ (login/LDAP/SSO/OAuth2)
- **Messaging:** Apache Kafka
- **Infrastructure:** Docker, Kubernetes

## Kiến trúc Tổng quan
```mermaid
graph TD
    Client[Web Browser / ReactJS] -->|Host: acme.platform.com| API_Gateway[API Gateway + Tenant Resolver]
    API_Gateway -->|JWT verify| Keycloak[Keycloak - acme realm]
    API_Gateway --> IAM[IAM Service - thin bridge]
    API_Gateway --> HRM[HRM Miniapp - tenant_acme schema]
    API_Gateway --> Sales[Sales Miniapp - tenant_acme schema]
    API_Gateway --> Config[Configuration Service]
    API_Gateway --> Notif[Notification Service]

    IAM --> Keycloak
    HRM --> DB_HRM[(PostgreSQL tenant_acme_hrm)]
    Sales --> DB_Sales[(PostgreSQL tenant_acme_sales)]

    HRM -->|Events| Kafka[Kafka]
    Sales -->|Events| Kafka
    Notif -->|Consume| Kafka
```

## Cấu trúc Thư mục
```text
enterprise-platform/
├── README.md
├── FEATURE-LIFECYCLE.md      # Luồng requirement → docs → code → test
├── SOURCE-CODE-STRUCTURE.md  # Cấu trúc source code (cập nhật v2: src/)
├── MINI-APP-ARCHITECTURE.md  # Kiến trúc Mini App
├── DOCUMENTATION-STRUCTURE.md# Cấu trúc tài liệu
├── AI_RULES.md
├── CONTRIBUTING.md
│
├── src/                      # ⭐ SOURCE CODE DUY NHẤT
│   ├── backend/
│   │   ├── applications/     # Microservices nghiệp vụ (HRM, ERP, Sales, Finance, Marketing, ...)
│   │   │                     # HRM chứa organizations, employees, job_titles, attendance, ...
│   │   │                     # Sales chứa customers
│   │   ├── platform/         # Microservices nền tảng (CHỈ 8 — xem ARCHITECTURE.md)
│   │   │                     # iam (JWT verify), platform-registry, tenant-manager,
│   │   │                     # configuration, master-data, notification, workflow, approval
│   │   └── shared/           # Backend shared libs
│   │       ├── shared-common  # audit publisher, file wrapper, tenant util
│   │       ├── shared-messaging  # Kafka producer/consumer
│   │       └── shared-security  # Keycloak JWT decoder, TenantContextFilter, @PreAuthorize
│   └── frontend/
│       ├── apps/web-shell/
│       ├── mini-apps/
│       ├── shared/
│       └── design-system/       # ★ Design System code library (@cachesol/design-system)
│
├── applications/             # CHỈ CHỨA docs / requirement / tests (KHÔNG có code)
│   ├── _templates/
│   ├── hrm/{docs, requirement, tests}
│   ├── erp/{docs, requirement, tests}
│   ├── sales/{docs, requirement, tests}
│
├── governance/               # Principles, ADR, standards, API, security, quality
├── design-system/            # ★ Design System docs (markdown): components, patterns, tokens, templates
├── agents/                   # 11 AI agents + PIPELINE-PROMPTS
├── skills/                   # Skills + enterprise aliases
└── workflows/                # YAML pipelines (feature, bugfix, release, ...)
```

**Nguyên tắc:**
- Toàn bộ source code nằm trong `src/` duy nhất — tách biệt hoàn toàn với docs/AI definitions.
- Backend code: `src/backend/{applications,platform,shared}/`. Java package gốc `com.cachesol.platform.*`.
- Frontend code: `src/frontend/{apps,mini-apps,shared,design-system}/`. Frontend package `@cachesol/*`.
- `applications/{name}/` ở root **chỉ** chứa `docs/`, `requirement/`, `tests/`.
- **Design System có 2 vị trí**:
  - `design-system/` ở root: **DOCS** (markdown) — components, patterns, tokens, templates.
  - `src/frontend/design-system/`: **CODE LIBRARY** — package `@cachesol/design-system` (tokens TS, base React components).
- **Multi-tenant**: mỗi tenant 1 PostgreSQL schema riêng (`tenant_<slug>`), tenant registry ở schema `public`.
- **Platform services tối giản** — CHỈ 8 services: iam (JWT verify only), platform-registry, tenant-manager, configuration, master-data, notification, workflow, approval.
- **IAM dùng Keycloak** cho mọi thứ liên quan identity (login/register/LDAP/SSO/OAuth2/MFA). IAM service chỉ là thin bridge.
- Mọi microservice backend **bắt buộc** có logging đầy đủ (access, audit, performance, error) — xem `SOURCE-CODE-STRUCTURE.md` §1.6.

## Luồng làm việc Feature (tóm tắt)
1. Tạo `applications/<miniapp>/requirement/<feature-id>/requirement.txt` + `images/`.
2. BA → `requirement-doc.md`.
3. Architect / API / UX → `docs/<feature-id>/`.
4. Backend + Frontend → `backend/`, `frontend/`.
5. Tester + Reviewers → `tests/` + `docs/.../reviews/`.
6. Orchestrator → release gate.

Workflow máy: [`workflows/feature-development.yaml`](workflows/feature-development.yaml).  
Hướng dẫn prompt: [`agents/PIPELINE-PROMPTS.md`](agents/PIPELINE-PROMPTS.md).

## Ví dụ đã có
- Feature mẫu HRM: [`applications/hrm/requirement/employee-profile/`](applications/hrm/requirement/employee-profile/)

## Hướng dẫn Navigate
| Bạn là… | Đọc trước |
|---------|-----------|
| Muốn chạy AI ngay | [`PROMPTS.md`](PROMPTS.md) |
| Stakeholder / PO | [`governance/requirements-guideline.md`](governance/requirements-guideline.md) |
| AI Agent | [`AI_RULES.md`](AI_RULES.md) + [`FEATURE-LIFECYCLE.md`](FEATURE-LIFECYCLE.md) |
| Kỹ sư mới | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| Architect | [`governance/architecture/principles.md`](governance/architecture/principles.md) |
