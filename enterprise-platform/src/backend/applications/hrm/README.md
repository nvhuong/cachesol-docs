# HRM Service - Backend Microservice

Backend microservice với package gốc `com.cachesol.platform.hrm`.

## Owned Bounded Contexts

HRM service quản lý toàn bộ **HR + Organization** của tenant:

- `employees` — Hồ sơ nhân viên
- `employee_assignments` — Nhân viên ↔ Org ↔ Job title (1 user có thể kiêm nhiều chức danh)
- `employee_contracts` — Hợp đồng lao động
- `organizations` — **Cây tổ chức (per-tenant, ltree)** — COMPANY → SUBSIDIARY → BRANCH → CENTER → DEPARTMENT → TEAM
- `job_titles` — **Chức danh tự khai báo (per-tenant)** — CEO, Trưởng phòng, ...
- `attendance`, `leave`, `payroll`, `recruitment`, `performance`, `training` (modules nghiệp vụ HR)

→ Trước đây `organization` và `employee` là platform service riêng; giờ **gộp vào HRM** vì logic HR ↔ org ↔ position gắn chặt với nhau.

## Quick Start

```bash
mvn spring-boot:run
```

App chạy ở `http://localhost:8080/api/v1`.

## Cấu trúc

```
src/main/java/com/cachesol/platform/hrm/
├── HrmServiceApplication.java
├── application/
│   ├── controller/
│   │   ├── EmployeeController.java
│   │   ├── OrganizationController.java      ← ★ cây tổ chức (tree API)
│   │   └── JobTitleController.java         ← ★ chức danh tự khai báo
│   ├── dto/
│   └── service/
├── domain/
│   ├── entity/
│   │   ├── Employee.java
│   │   ├── Organization.java               ← ltree path
│   │   ├── JobTitle.java
│   │   └── EmployeeAssignment.java
│   └── repository/
└── infrastructure/                          # (sẽ thêm khi cần)
```

## Organization Hierarchy

Xem chi tiết schema tại [`ARCHITECTURE.md`](../../../ARCHITECTURE.md#3-organization-hierarchy-per-tenant-schema).

API chính:

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET    | /organizations/tree                 | Cây tổ chức đầy đủ của tenant |
| GET    | /organizations/{id}/descendants      | Tất cả con/cháu của 1 node |
| GET    | /organizations/{id}/ancestors        | Tất cả cha/ông của 1 node (cho breadcrumb) |
| POST   | /organizations                       | Tạo node mới (auto-set path từ parent) |
| PATCH  | /organizations/{id}/move             | Di chuyển node sang parent khác (update path cho cả subtree) |

## API Endpoints (Employee)

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET    | /employees | Danh sách |
| GET    | /employees/{id} | Chi tiết |
| POST   | /employees | Tạo mới |
| DELETE | /employees/{id} | Xóa |

Xem chi tiết: [SOURCE-CODE-STRUCTURE.md](../../SOURCE-CODE-STRUCTURE.md)
