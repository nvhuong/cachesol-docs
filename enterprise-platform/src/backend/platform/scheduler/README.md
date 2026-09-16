# Scheduler Service
## Mô tả & Trách nhiệm
Quản lý các tác vụ định kỳ (Cron jobs) phân tán. Đảm bảo job chỉ chạy 1 lần dù có nhiều instance của service (Distributed Lock).

## Bounded Context
Job Config, Job Execution History.

## Domain Events
### Published Events
- Bắn event kích hoạt job (VD: `JobTriggeredEvent`).
### Consumed Events
- -

## API Overview
- `POST /api/v1/scheduler/jobs` (Thêm job)
- `PUT /api/v1/scheduler/jobs/{id}/pause`

## Dependencies
- PostgreSQL (Lưu lịch sử).
- Quartz Scheduler hoặc Redis/Redisson cho distributed lock.

## Database Schema (overview)
- `quartz_tables` hoặc custom `job_configs`, `job_logs`.

## Configuration
- `scheduler.pool-size`

## Getting Started
Chạy Spring Boot profile `local`.
