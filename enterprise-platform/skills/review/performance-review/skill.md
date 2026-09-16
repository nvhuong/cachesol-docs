# Skill: Performance Review

## Mục tiêu
Đánh giá và tối ưu hiệu suất của ứng dụng, đảm bảo thời gian phản hồi nhanh và khả năng chịu tải cao.

## Phạm vi áp dụng
Khi ứng dụng có dấu hiệu chậm hoặc trước các sự kiện lớn.

## Điều kiện tiên quyết
- Có công cụ monitoring (Prometheus/Grafana, APM).

## Input cần thiết
- Ứng dụng đang chạy và số liệu (metrics).

## Quy trình thực hiện
### Bước 1: Database Query Analysis
Bật log slow query. Phân tích kế hoạch thực thi (EXPLAIN ANALYZE) để xem có thiếu index hoặc Full Table Scan không.
### Bước 2: N+1 Query Detection
Kiểm tra log ORM (Hibernate) xem một request sinh ra bao nhiêu query. Dùng Fetch Join hoặc EntityGraph để khắc phục.
### Bước 3: Caching Opportunities
Xác định dữ liệu đọc nhiều/viết ít để đưa vào Redis cache.
### Bước 4: Frontend Bundle Size
Kiểm tra Webpack/Vite analyzer. Phân tích các thư viện nặng (như lodash import sai), thực hiện Code Splitting, Lazy Loading.
### Bước 5: Load Testing
Chạy thử nghiệm với K6 hoặc JMeter để xem mức chịu đựng của API ở giới hạn bao nhiêu RPS (Requests Per Second).

## Output chuẩn
- `performance-review-report.md`: Báo cáo hiệu năng và kế hoạch tối ưu.

## Checklist kiểm tra
- [ ] API Response time (P95) < 200ms?
- [ ] Frontend Time to Interactive (TTI) < 3s?
- [ ] Không có query N+1?

## Tham chiếu
- [Performance Optimization Guidelines](../../governance/quality/performance.md)
