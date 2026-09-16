# Organization Service
## Mô tả & Trách nhiệm
Quản lý cơ cấu tổ chức, phòng ban, chi nhánh, công ty con.

## Bounded Context
Department, Branch, Company, Position (Chức danh). Cung cấp cây phòng ban cho các dịch vụ khác (ví dụ: Workflow để tìm quản lý).

## Domain Events
### Published Events
- `DepartmentCreatedEvent`
- `ManagerChangedEvent`
### Consumed Events
- None.

## API Overview
- `GET /api/v1/departments/tree`
- `POST /api/v1/departments`

## Dependencies
- PostgreSQL (hỗ trợ truy vấn phân cấp bằng Ltree hoặc CTE).
- Redis (Cache cây tổ chức).

## Database Schema (overview)
- `departments` (id, parent_id, name, manager_id)
- `positions`

## Configuration
Cấu hình level tối đa của tổ chức nếu cần.

## Getting Started
Chạy Spring Boot profile mặc định. Dữ liệu mẫu nằm trong thư mục `src/main/resources/db/seed`.
