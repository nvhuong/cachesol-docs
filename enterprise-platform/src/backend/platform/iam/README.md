# IAM Service
## Mô tả & Trách nhiệm
Quản lý Định danh và Truy cập (Identity & Access Management). Xử lý đăng nhập (OAuth2, JWT), cấp quyền, quản lý User, Role và Permission.

## Bounded Context
Bao gồm thực thể User, Credential, Role, Permission, Session. Phục vụ việc xác thực cho toàn bộ Enterprise Platform.

## Domain Events
### Published Events
- `UserCreatedEvent`, `UserDeactivatedEvent`
- `RoleUpdatedEvent`
### Consumed Events
- (Ít consume, chủ yếu đóng vai trò Source of Truth).

## API Overview
- `POST /api/v1/auth/login`
- `GET /api/v1/users/me`
- `GET /api/v1/permissions`

## Dependencies
- Database: PostgreSQL
- Cache/Session: Redis
- LDAP/Active Directory (Tuỳ chọn)

## Database Schema (overview)
- `users`, `roles`, `permissions`, `user_roles`, `role_permissions`

## Configuration
- JWT Secret Key, Token Expiration.
- OAuth2 Client ID / Secret.

## Getting Started
Khởi chạy với Spring Boot profile `local`. Chạy Redis ở cổng 6379.
