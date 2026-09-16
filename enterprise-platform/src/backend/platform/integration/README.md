# Integration Service
## Mô tả & Trách nhiệm
Adapter kết nối với các hệ thống bên ngoài (ERP, CRM cũ, Cổng thanh toán, Tổng cục Thuế). Đóng vai trò Anti-corruption layer.

## Bounded Context
Adapter Config, External System Log.

## Domain Events
### Published Events
- `ExternalSyncCompletedEvent`
### Consumed Events
- Lắng nghe event nội bộ và gọi API ra ngoài (Ví dụ: `OrderCreated` -> Gọi ERP nội bộ).

## API Overview
- `POST /api/v1/webhooks/*` (Nhận callback từ bên ngoài).

## Dependencies
- PostgreSQL
- Kafka (Làm buffer để không bị quá tải khi external system chậm).

## Database Schema (overview)
- `integration_logs`, `webhook_configs`

## Configuration
- API Keys, URLs của các hệ thống đối tác. Circuit Breaker config.

## Getting Started
Chạy Spring Boot profile `local`. Yêu cầu config mock-server.
