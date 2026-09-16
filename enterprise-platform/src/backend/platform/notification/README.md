# Notification Service
## Mô tả & Trách nhiệm
Gửi thông báo đa kênh: Push (In-app/Web), Email, SMS.

## Bounded Context
Notification Template, Notification Log, Channel Routing.

## Domain Events
### Published Events
- `NotificationSentEvent`
- `NotificationFailedEvent`
### Consumed Events
- Consume hầu hết mọi sự kiện quan trọng trong hệ thống để gửi thông báo (VD: `ApprovalRequestedEvent`).

## API Overview
- `POST /api/v1/notifications/send` (Sync)
- Lắng nghe Kafka topics (Async)

## Dependencies
- MongoDB (Lưu trữ log thông báo tốc độ cao)
- Kafka/RabbitMQ
- SendGrid (Email), Twilio/VNFPT (SMS), Firebase/WebSocket (Push).

## Database Schema (overview)
- `templates`, `notification_logs` (NoSQL collections)

## Configuration
- API Keys của các 3rd party providers.

## Getting Started
Chạy local cần mock các 3rd party APIs hoặc dùng mock-server.
