# Master Data Service
## Mô tả & Trách nhiệm
Quản lý dữ liệu danh mục dùng chung (Tỉnh/Thành phố, Quốc gia, Tiền tệ, Đơn vị tính...). 

## Bounded Context
Reference Data, Lookup Table.

## Domain Events
### Published Events
- `MasterDataUpdatedEvent`
### Consumed Events
- -

## API Overview
- `GET /api/v1/master-data/categories/{categoryCode}`
- `POST /api/v1/master-data/items`

## Dependencies
- PostgreSQL
- Redis (Cache mạnh vì dữ liệu ít thay đổi).

## Database Schema (overview)
- `categories`, `category_items`

## Configuration
- Cache TTL dài.

## Getting Started
Chạy Spring Boot profile `local`. Dữ liệu seed mặc định trong `/seed`.
