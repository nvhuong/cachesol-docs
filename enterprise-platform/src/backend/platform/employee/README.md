# Employee Service
## Mô tả & Trách nhiệm
Quản lý hồ sơ nhân viên (Master Data), thông tin cá nhân, hợp đồng, trạng thái làm việc.

## Bounded Context
Employee Profile, Contract, Job History. Liên kết chặt chẽ với IAM (để map Employee -> User) và Organization (Employee -> Department).

## Domain Events
### Published Events
- `EmployeeOnboardedEvent`
- `EmployeeTerminatedEvent`
- `EmployeeTransferredEvent`
### Consumed Events
- `DepartmentDeletedEvent`

## API Overview
- `GET /api/v1/employees`
- `POST /api/v1/employees`

## Dependencies
- PostgreSQL (Lưu trữ chính)
- S3 (Lưu avatar, hồ sơ scan)

## Database Schema (overview)
- `employees`, `employee_contracts`, `employee_job_histories`

## Configuration
- Spring Boot YAML configs.

## Getting Started
Chạy Spring Boot profile `local`.
