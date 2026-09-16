# HRM Service - Backend Microservice

Backend microservice với package gốc `com.cachesol.platform.hrm`.

## Quick Start

```bash
mvn spring-boot:run
```

App chạy ở `http://localhost:8080/api/v1`.

## Cấu trúc

```
src/main/java/com/cachesol/platform/hrm/
├── HrmServiceApplication.java
├── application/              # Controllers, DTOs, Services
│   ├── controller/
│   ├── dto/
│   └── service/
├── domain/                  # Entities, Repositories
│   ├── entity/
│   └── repository/
└── infrastructure/          # (Sẽ thêm sau)
```

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | /employees | Danh sách |
| GET | /employees/{id} | Chi tiết |
| POST | /employees | Tạo mới |
| DELETE | /employees/{id} | Xóa |

Xem chi tiết: [SOURCE-CODE-STRUCTURE.md](../../SOURCE-CODE-STRUCTURE.md)
