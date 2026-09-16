# Audit Service
## Mô tả & Trách nhiệm
Ghi nhận mọi hoạt động quan trọng trong hệ thống (Audit trail). Phục vụ truy vết, tuân thủ (compliance) và bảo mật.

## Bounded Context
Audit Log, Activity Record.

## Domain Events
### Published Events
- Không có (Chỉ lưu trữ).
### Consumed Events
- Consume toàn bộ topic dạng `*.created`, `*.updated`, `*.deleted` qua Kafka.

## API Overview
- `GET /api/v1/audits` (Chủ yếu để Admin/SecTeam truy vấn).
- (Không có POST API, chỉ nhận qua Message Broker để đảm bảo performance).

## Dependencies
- Elasticsearch (Lưu trữ Log để search nhanh).
- Kafka (Nhận data streaming).

## Database Schema (overview)
- Index `audit_logs-*` theo tháng hoặc ngày.

## Configuration
- Retention policy (Xoá log sau 1 năm hoặc chuyển sang Cold Storage).

## Getting Started
Chạy Spring Boot profile `local`. Yêu cầu có Kafka và ES.
