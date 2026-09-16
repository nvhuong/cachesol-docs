# Reporting Service
## Mô tả & Trách nhiệm
Tạo báo cáo động, xuất file Excel/PDF và cung cấp dữ liệu cho Dashboard.

## Bounded Context
Report Definition, Report Job, Dashboard Widget.

## Domain Events
### Published Events
- `ReportGeneratedEvent` (Kèm file URL).
### Consumed Events
- -

## API Overview
- `GET /api/v1/reports/execute/{id}`
- `POST /api/v1/reports/async-execute`

## Dependencies
- PostgreSQL (Hoặc Data Warehouse / Read Replica để không ảnh hưởng DB chính).
- Apache POI, JasperReports hoặc công cụ tương tự.

## Database Schema (overview)
- `report_templates`, `report_histories`

## Configuration
- DB Data Source cho read-only queries.

## Getting Started
Chạy Spring Boot profile `local`.
