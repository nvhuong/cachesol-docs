# Approval Service
## Mô tả & Trách nhiệm
Quản lý các ticket chờ duyệt, lịch sử duyệt và phân quyền người duyệt. Có thể hoạt động độc lập hoặc tích hợp với Workflow Service.

## Bounded Context
Approval Request, Approval Step, Approver Rule, Comment.

## Domain Events
### Published Events
- `ApprovalApprovedEvent`
- `ApprovalRejectedEvent`
### Consumed Events
- `UserTaskCreatedEvent` (từ Workflow).

## API Overview
- `POST /api/v1/approvals/requests`
- `POST /api/v1/approvals/tasks/{id}/approve`

## Dependencies
- PostgreSQL
- IAM Service (Để lấy cây quản lý và quyền hạn)

## Database Schema (overview)
- `approval_requests`, `approval_steps`, `approval_histories`

## Configuration
- SLA Timeout.

## Getting Started
Chạy Spring Boot profile `local`.
