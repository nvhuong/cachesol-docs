# Workflow Service
## Mô tả & Trách nhiệm
Workflow engine siêu nhẹ (BPMN-lite) cho phép định nghĩa quy trình động và chạy các instance của quy trình đó.

## Bounded Context
Process Definition, Process Instance, User Task, Service Task.

## Domain Events
### Published Events
- `ProcessStartedEvent`
- `ProcessCompletedEvent`
- `UserTaskCreatedEvent`
### Consumed Events
- `UserTaskCompletedEvent` (từ Approval Service).

## API Overview
- `POST /api/v1/workflows/deploy`
- `POST /api/v1/workflows/start`

## Dependencies
- PostgreSQL (Lưu trạng thái state machine).
- Camunda/Flowable (Nếu dùng engine có sẵn) hoặc Custom Engine.

## Database Schema (overview)
- `process_defs`, `process_instances`, `execution_logs`

## Configuration
- Database lock timeout (cho concurrent execution).

## Getting Started
Chạy Spring Boot profile `local`.
