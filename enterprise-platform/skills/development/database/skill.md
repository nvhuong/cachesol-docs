# Skill: Implement Database

## Mục tiêu
Triển khai thiết kế database thành code thực tế (Flyway SQL và JPA Entities) một cách tối ưu.

## Phạm vi áp dụng
Khi tích hợp database cho một Spring Boot microservice.

## Điều kiện tiên quyết
- Có `db-design.md` và môi trường PostgreSQL.

## Input cần thiết
- Thiết kế database.

## Quy trình thực hiện
### Bước 1: Viết Flyway Migrations
Viết mã SQL tạo bảng (CREATE TABLE), thêm khóa chính, ngoại, index. Đảm bảo script có thể chạy lặp lại an toàn (Idempotent nếu cần).
### Bước 2: Implement JPA Entity Classes
Tạo các class `@Entity`. Cấu hình lazy loading cho các `@OneToMany`, `@ManyToOne` (tránh N+1 query).
### Bước 3: Repository Interfaces
Khai báo các phương thức query trong `JpaRepository`.
### Bước 4: Query Optimization
Với các query phức tạp, sử dụng JPQL, `@Query`, hoặc Native Query. Cấu hình Entity Graph để fetch dữ liệu liên quan hiệu quả thay vì dùng Eager Fetch.

## Output chuẩn
- `V*_*.sql` migration files.
- Các class Entity `.java`.

## Checklist kiểm tra
- [ ] Script Flyway không phá vỡ dữ liệu cũ (Backward compatible)?
- [ ] Mọi quan hệ `@ManyToOne` đều set `fetch = FetchType.LAZY`?
- [ ] Không có EAGER fetch ở bất cứ đâu?

## Tham chiếu
- [Database Development Rules](../../governance/database/migration.md)
