# HRM Application (Miniapp)

## Mô tả
HRM — Quản lý nhân sự, hồ sơ nhân viên, lương thưởng.

## Frontend Mini App
Frontend code của HRM nằm tại: [`../../frontend/mini-apps/hrm-mini-app/`](../../frontend/mini-apps/hrm-mini-app/)

HRM là một **library/package** trong workspace `frontend/`. Shell app sẽ nhúng nó runtime thông qua manifest.

## Backend Microservice
Backend code: [`backend/`](backend/)

- Package gốc: `com.cachesol.platform.hrm`
- Port mặc định: 8080
- Database: PostgreSQL (database-per-service)
- Messaging: Apache Kafka

Xem chi tiết: [`../../SOURCE-CODE-STRUCTURE.md`](../../SOURCE-CODE-STRUCTURE.md)

## Modules / Features
Xem danh mục đầy đủ tại [`requirement/_index.md`](requirement/_index.md).

Các nhóm chính:
- Quản lý hồ sơ (`employee-profile`)
- Quản lý hợp đồng
- Tính lương (Payroll)

## Microservices
- `hrm-service`: Quản lý nhân viên (HRM Core)
- `hrm-payroll-service`: Xử lý tính lương

Xem thêm: [`../../governance/architecture/services.yaml`](../../governance/architecture/services.yaml).

## Tech Stack
- Frontend Mini App: React 18 + Ant Design 5 (xem [`../../frontend/mini-apps/hrm-mini-app/`](../../frontend/mini-apps/hrm-mini-app/))
- Backend: Java Spring Boot 21
- Database: PostgreSQL (database-per-service)
- Messaging: Apache Kafka

## Cấu trúc thư mục
```text
hrm/
├── README.md           # File này
├── requirement/        # .txt + images theo từng feature
├── docs/               # solution, API, UI, DB, review reports
├── backend/            # Spring Boot microservice (com.cachesol.platform.hrm)
└── tests/              # unit / integration / e2e + test-report

# Frontend code (ở workspace frontend/)
frontend/mini-apps/hrm-mini-app/
├── src/
│   ├── index.ts        # Public API (Shell import)
│   ├── manifest.ts     # Routes, menu, permissions
│   └── features/
└── package.json        # @cachesol/hrm-mini-app
```

Chi tiết luồng: [`../../FEATURE-LIFECYCLE.md`](../../FEATURE-LIFECYCLE.md).

## Bắt đầu một feature
1. Tạo folder dưới `requirement/<feature-id>/` từ template `_templates`.
2. Điền `requirement.txt`, thêm ảnh vào `images/`.
3. Cập nhật `requirement/_index.md`.
4. Chạy pipeline AI theo [`../../agents/PIPELINE-PROMPTS.md`](../../agents/PIPELINE-PROMPTS.md).
5. Implement frontend trong `frontend/mini-apps/hrm-mini-app/src/features/<feature>/`
6. Implement backend trong `backend/src/main/java/com/cachesol/platform/hrm/`

## Feature Flags
- `hrm.feature.new_payroll_engine`
- `hrm.feature.employee_profile_v2`
