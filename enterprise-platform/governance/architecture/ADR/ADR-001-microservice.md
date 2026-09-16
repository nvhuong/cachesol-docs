# ADR 001: Áp dụng Kiến trúc Microservices cho Enterprise Platform

- **Status:** Accepted
- **Date:** 2026-08-28
- **Author:** Architecture Team

## Context (Bối cảnh)
Hệ thống Enterprise Platform phục vụ nhiều Domain khác nhau (IAM, HRM, ERP, CRM, Finance) với sự tham gia của nhiều nhóm phát triển (Squads) độc lập. Nếu sử dụng kiến trúc Monolith, codebase sẽ trở nên khổng lồ, việc build/deploy sẽ rất chậm chạp, dễ xảy ra conflict code, và khi một module lỗi (vd: Out of memory ở module HRM) có thể kéo theo toàn bộ hệ thống sập.

## Decision (Quyết định)
Chúng ta quyết định áp dụng **Kiến trúc Microservices**, trong đó mỗi bounded context (hoặc subdomain) sẽ được triển khai thành một hoặc nhiều services độc lập.
- Các services giao tiếp với nhau qua API Gateway (cho external) và REST/gRPC/Kafka (cho internal).
- Mỗi service có lifecycle riêng, tự do deploy.

## Consequences (Hậu quả)
**Tích cực:**
- Các Squad có thể hoạt động hoàn toàn độc lập, tăng tốc độ release.
- Có thể scale độc lập từng service khi có bottleneck (VD: Chỉ scale ERP Service vào dịp cuối tháng).
- Dễ dàng thay đổi công nghệ bên trong từng service (nếu thực sự cần thiết).

**Tiêu cực:**
- Tăng độ phức tạp trong vận hành hạ tầng (Cần Kubernetes, Service Mesh, CI/CD phức tạp).
- Yêu cầu xử lý các vấn đề của hệ thống phân tán (Distributed Tracing, Distributed Transactions).
- Quản lý phiên bản API (API Versioning) trở nên khắt khe.

## Alternatives Considered (Các phương án đã xem xét)
- **Modular Monolith:** Đã xem xét nhưng bị loại vì không giải quyết triệt để vấn đề deploy độc lập và scale độc lập của từng domain khi công ty đang scale up nhân sự dev nhanh.
- **SOA (Service-Oriented Architecture):** Quá nặng nề và phụ thuộc vào ESB (Enterprise Service Bus).

## References
- [Microservices Patterns by Chris Richardson](https://microservices.io/patterns/microservices.html)
