# Customer Service
## Mô tả & Trách nhiệm
Quản lý thông tin khách hàng, đối tác (CRM mini). 

## Bounded Context
Customer, Partner, Contact Person, Address.

## Domain Events
### Published Events
- `CustomerCreatedEvent`
- `CustomerUpdatedEvent`
### Consumed Events
- -

## API Overview
- `GET /api/v1/customers`
- `POST /api/v1/customers`

## Dependencies
- PostgreSQL
- Elasticsearch (cho tính năng search khách hàng nhanh)

## Database Schema (overview)
- `customers`, `contacts`, `addresses`

## Configuration
- Elasticsearch cluster URL.

## Getting Started
Khởi chạy với Spring Boot `local`. Đảm bảo ES đang chạy ở cổng 9200.
