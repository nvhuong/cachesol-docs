# Configuration Service
## Mô tả & Trách nhiệm
Quản lý cấu hình toàn hệ thống, Feature Flags (Toggles), và các tham số động không muốn hardcode.

## Bounded Context
System Parameter, Feature Flag, Tenant Config.

## Domain Events
### Published Events
- `ConfigChangedEvent` (Để các service khác invalidate cache).
### Consumed Events
- -

## API Overview
- `GET /api/v1/configs/{key}`
- `GET /api/v1/features/check`

## Dependencies
- PostgreSQL
- Redis (Bắt buộc dùng Cache để đạt độ trễ < 5ms).

## Database Schema (overview)
- `system_configs`, `feature_flags`

## Configuration
- Redis TTL.

## Getting Started
Chạy Spring Boot profile `local`.
