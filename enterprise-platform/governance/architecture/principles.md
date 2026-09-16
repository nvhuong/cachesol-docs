# Architecture Principles (Nguyên tắc Kiến trúc)

Tài liệu này định nghĩa các nguyên tắc cốt lõi để xây dựng hệ thống Enterprise Platform.

## 1. Microservice Independence
- **Mô tả:** Mỗi service phải hoàn toàn độc lập, có thể tự do phát triển, build, deploy, và scale mà không làm ảnh hưởng đến các service khác.
- **Lý do:** Tránh "distributed monolith", giảm rủi ro gián đoạn toàn hệ thống.
- **Cách áp dụng:** Triển khai CI/CD riêng biệt. Các thay đổi của API phải backward-compatible.

## 2. Single Responsibility (Bounded Context)
- **Mô tả:** Mỗi service phụ trách duy nhất một Bounded Context (phạm vi nghiệp vụ).
- **Lý do:** Giữ codebase nhỏ, dễ hiểu, trách nhiệm rõ ràng.
- **Ví dụ đúng:** `OrderService` chỉ lo việc xử lý đơn hàng.

## 3. API-First Design
- **Mô tả:** API (OpenAPI/Swagger/GraphQL) phải được thiết kế và thống nhất trước khi viết code logic.
- **Lý do:** Đảm bảo Backend và Frontend/Client có thể làm việc song song, chuẩn hóa giao tiếp.

## 4. Database per Service
- **Mô tả:** Không chia sẻ Database giữa các service. Mỗi service quản lý DB/Schema của riêng nó.
- **Lý do:** Chống tight-coupling mức dữ liệu.
- **Ví dụ sai:** Service A select trực tiếp từ bảng của Service B.

## 5. Event-Driven Communication
- **Mô tả:** Dùng Message Broker (Kafka) để giao tiếp bất đồng bộ (async) cho các luồng nghiệp vụ không cần kết quả ngay.
- **Lý do:** Giảm độ trễ, tăng tính decoupling, chịu tải tốt.

## 6. Fault Tolerance & Resiliency
- **Mô tả:** Phải áp dụng Circuit Breaker, Retry, Fallback, Timeout cho các cuộc gọi liên service (sync calls).
- **Lý do:** Xử lý lỗi liên hoàn (cascading failures).

## 7. Observability
- **Mô tả:** Các service phải cung cấp đầy đủ Logs (cấu trúc JSON), Metrics (Prometheus), và Distributed Traces (OpenTelemetry).
- **Lý do:** Hỗ trợ troubleshoot hệ thống phức tạp nhanh chóng.

## 8. Security by Design
- **Mô tả:** Authenticate & Authorize phải được kiểm tra ở API Gateway VÀ cấp độ Microservice (Zero-Trust).
- **Lý do:** Ngăn chặn leo thang đặc quyền nội bộ.

## 9. Feature Flags (Toggles)
- **Mô tả:** Các tính năng mới phải được bọc trong Feature Flag để bật/tắt runtime.
- **Lý do:** Cho phép thử nghiệm (A/B testing, Canary release) an toàn trên Production.

## 10. Stateless Services
- **Mô tả:** Service không được lưu trạng thái user (session) trên local memory. Trạng thái nên lưu trên Redis/Database.
- **Lý do:** Hỗ trợ scale-out (thêm pod/container) dễ dàng.

## 11. Infrastructure as Code (IaC)
- **Mô tả:** Toàn bộ cấu hình hệ thống (K8s, DB, Kafka topics) phải được mô tả bằng code (Terraform/Helm).
- **Lý do:** Đảm bảo môi trường đồng nhất và có thể tái tạo.

## 12. Automated Testing Core
- **Mô tả:** Mọi tính năng phải có Unit Test và Integration Test. Code Coverage tối thiểu 80%.
- **Lý do:** Tránh hồi quy bug, đảm bảo tự tin khi refactor.

## 13. Smart Endpoints, Dumb Pipes
- **Mô tả:** Logic nghiệp vụ nằm ở microservices, không đặt logic ở Message Broker hay ESB.
- **Lý do:** Tránh bị lock-in và giữ hệ thống đơn giản.

## 14. Immutable Deployments
- **Mô tả:** Không sửa đổi trực tiếp trên container đang chạy. Muốn thay đổi phải build image mới.
- **Lý do:** Giảm thiểu cấu hình trôi dạt (configuration drift).

## 15. Continuous Delivery Ready
- **Mô tả:** Code trên branch `main` luôn phải ở trạng thái sẵn sàng deploy lên Production bất kỳ lúc nào.
- **Lý do:** Giảm thời gian time-to-market.
