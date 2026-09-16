# Search Service
## Mô tả & Trách nhiệm
Cung cấp khả năng tìm kiếm Full-text trên toàn nền tảng (Global Search). Đồng bộ hóa dữ liệu từ các service khác vào Index.

## Bounded Context
Search Index, Sync Job.

## Domain Events
### Published Events
- -
### Consumed Events
- Lắng nghe các event thay đổi dữ liệu từ Employee, Customer, v.v. để update Index. Hoặc dùng Debezium (CDC) bắt từ Database.

## API Overview
- `GET /api/v1/search?q={query}` (Tìm đa domain)

## Dependencies
- Elasticsearch / OpenSearch
- Kafka (Nhận event update).

## Database Schema (overview)
- Các indices: `search_employees`, `search_customers`, v.v.

## Configuration
- Mappings và Analyzers cho tiếng Việt.

## Getting Started
Chạy Spring Boot profile `local`. Yêu cầu ES cluster hoạt động.
