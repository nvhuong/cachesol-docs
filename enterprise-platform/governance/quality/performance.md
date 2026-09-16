# Tiêu Chuẩn Hiệu Năng (Performance Standards)

Tài liệu này đề ra các chỉ tiêu và hướng dẫn kỹ thuật để đảm bảo Enterprise Platform vận hành ổn định, tốc độ cao.

## 1. SLA Thời Gian Phản Hồi API (API Response Time)
- **p50 (Median)**: < 100ms. 50% số request phải hoàn thành dưới 100ms.
- **p99 (99th percentile)**: < 500ms. 99% số request phải trả về kết quả dưới nửa giây.
- **Quy tắc**: Các API xử lý file hoặc gọi 3rd-party (chậm) cần được chuyển qua xử lý bất đồng bộ (Asynchronous/Background task) và trả về HTTP 202 Accepted.

## 2. Database Query Limits
- Mọi câu truy vấn DB OLTP phải hoàn thành dưới **100ms**.
- Query vượt quá 500ms sẽ tự động bị log vào `Slow Query Log`.
- Kích thước tập kết quả không vượt quá 10,000 dòng. (Nhiều hơn cần phân trang/export nền).

## 3. Frontend Performance Budgets
Áp dụng các chỉ số Web Vitals của Google:
- **LCP (Largest Contentful Paint)**: < 2.5s.
- **FCP (First Contentful Paint)**: < 2.0s.
- Bundle size limit: `main.js` sau gzip không vượt quá 300KB. Sử dụng Code Splitting (Lazy Load) cho các module con.

## 4. Chiến Lược Caching
Áp dụng Multi-level cache để giảm tải cho DB:
- **Cấp độ API Gateway/CDN**: Cache các GET request không chứa data cá nhân (Public catalog, Config).
- **Cấp độ Redis (Distributed Cache)**: Cache metadata, user session, quyền, cấu hình tenant. Áp dụng Cache Aside pattern.
- **Cấp độ Application (Caffeine/Local Cache)**: Dùng cho các danh mục siêu nhỏ, tĩnh (như Country List) để bỏ qua network latency.

## 5. Database Connection Pool & Threads
- **Sizing Pool**: Dùng công thức HikariCP (số core CPU * 2 + số spindle). Không cấu hình pool quá lớn (như 1000) sẽ làm treo DB do quá tải context switch. Mặc định 20-50 connections/pod là đủ.
- Server Tomcat Spring Boot: Max threads giới hạn (mặc định 200). Đảm bảo Timeout của DB và API 3rd party phải nhỏ hơn để tránh treo luồng.

## 6. Quản Lý Bộ Nhớ (Memory Management)
- Giới hạn Heap Size của JVM (thông qua flag `-Xmx` container limit).
- Tránh tạo các Collection quá lớn (List chứa hàng triệu object) trong RAM. Dùng Stream/Batch processing.
- Giải phóng tài nguyên IO (File, InputStream, ResultSet) bằng try-with-resources.

## 7. Load Testing (Kiểm Thử Tải)
- Mọi tính năng lớn trước khi lên Prod phải trải qua Load Test (dùng JMeter hoặc K6).
- Test với mức độ tải dự kiến (Peak load) x 1.5 lần.
- Đảm bảo Pod có khả năng Scale-out tự động (HPA trong Kubernetes) khi CPU > 70%.

## 8. Giám Sát (Monitoring)
- Bắt buộc tích hợp **Micrometer** để expose số liệu (metrics).
- Cấu hình **Prometheus** lấy số liệu và hiển thị trên **Grafana**.
- Setup Alert (cảnh báo) tự động bắn qua Slack khi Error Rate tăng hoặc Latency vượt chuẩn p99.
