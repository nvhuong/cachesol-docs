# SALES Service - Backend Microservice

Backend microservice với package gốc `com.cachesol.platform.sales`.

## Owned Bounded Contexts

Sales service quản lý toàn bộ CRM + bán hàng của tenant:

- `customers` — Thông tin khách hàng (doanh nghiệp & cá nhân)
- `contacts` — Người liên hệ của customer
- `addresses` — Địa chỉ giao hàng / hóa đơn
- `opportunities` — Cơ hội bán hàng
- `orders` — Đơn hàng
- `invoices` — Hóa đơn (publish event để Finance consume)
- `products` (catalog) — Danh mục sản phẩm (chỉ phần nghiệp vụ sales, không phải inventory của ERP)

→ Trước đây `customer` là platform service riêng; giờ **gộp vào Sales** vì customer gắn chặt với order/opportunity.

## Quick Start

```bash
mvn spring-boot:run
```

App chạy ở `http://localhost:8080/api/v1`.

## Cấu trúc

```
src/main/java/com/cachesol/platform/sales/
├── SalesServiceApplication.java
├── application/
│   ├── controller/
│   │   ├── CustomerController.java          ← ★ khách hàng (gộp từ platform/customer)
│   │   ├── ContactController.java
│   │   ├── OpportunityController.java
│   │   └── OrderController.java
│   ├── dto/
│   └── service/
├── domain/
│   ├── entity/
│   │   ├── Customer.java
│   │   ├── Contact.java
│   │   ├── Opportunity.java
│   │   └── Order.java
│   └── repository/
└── infrastructure/                          # Kafka publisher, search index (sẽ thêm)
```

## Customer API

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET    | /customers                    | Danh sách (filter: type, status, owner_id) |
| GET    | /customers/{id}               | Chi tiết |
| POST   | /customers                    | Tạo mới |
| PATCH  | /customers/{id}               | Cập nhật |
| DELETE | /customers/{id}               | Soft delete (set status=INACTIVE) |
| GET    | /customers/search?q=...       | Full-text search (PostgreSQL FTS) |

Xem chi tiết cấu trúc: [SOURCE-CODE-STRUCTURE.md](../../SOURCE-CODE-STRUCTURE.md)
