# Tối Ưu Hóa Query & Indexing (PostgreSQL)

## 1. Khi Nào Cần Tạo Index
- Tạo trên cột cấu thành Khóa chính (Postgres tự động tạo).
- Tạo trên các cột được dùng làm **Khóa ngoại** (Rất quan trọng cho các phép JOIN hoặc Delete Cascade, Postgres KHÔNG tự tạo).
- Tạo trên các cột thường xuyên nằm trong mệnh đề `WHERE`.
- Tạo trên các cột thường dùng trong mệnh đề `ORDER BY` ở các truy vấn phân trang.
- **KHÔNG tạo index** trên cột có quá ít giá trị phân biệt (Ví dụ: cột `gender` chỉ có Nam/Nữ).
- **KHÔNG tạo quá nhiều index** trên bảng ghi vào liên tục (Log, Event), sẽ làm chậm INSERT.

## 2. Các Loại Index (Index Types)
- **B-Tree**: Mặc định. Phù hợp cho hầu hết kiểu dữ liệu (>, <, =, BETWEEN).
- **GIN**: Dành cho JSONB, Array, Text-search. Cực kỳ hiệu quả nếu query có toán tử chứa (VD: `jsonb_column @> '{"key": "value"}'`).
- **GiST**: Phù hợp cho dữ liệu không gian, hình học (PostGIS).

## 3. Composite Index (Index Kết Hợp)
Dùng khi query thường xuyên gọi cả 2-3 cột cùng lúc:
`CREATE INDEX idx_orders_status_created ON orders (status, created_at);`

**Quy tắc:** Đặt cột có độ chọn lọc (Selectivity) cao nhất lên trước. Đặt các cột tìm kiếm dạng `=` (exact match) lên trước cột tìm khoảng `>`, `<` (range match).

## 4. Partial Index (Index Một Phần)
Rất hiệu quả cho các bảng lớn, chỉ index tập dữ liệu cần thiết.
- VD1: Soft Delete (Chỉ index bản ghi chưa xóa)
  `CREATE INDEX idx_users_email ON users (email) WHERE is_deleted = false;`
- VD2: Chỉ index các đơn hàng đang xử lý (rất ít so với các đơn đã hoàn thành)
  `CREATE INDEX idx_orders_pending ON orders (status) WHERE status = 'PENDING';`

## 5. Query Optimization Checklist
Trước khi push code có query phức tạp:
1. Có sử dụng Index trên các cột ở mệnh đề WHERE không?
2. Có gặp vấn đề **N+1 Query** ở JPA/Hibernate không? (Sử dụng `@EntityGraph` hoặc `JOIN FETCH`).
3. Khối lượng lấy ra có vượt quá số cần dùng không? (Select All rồi filter bằng java là cấm kỵ).

## 6. Phân Tích Bằng EXPLAIN ANALYZE
Sử dụng `EXPLAIN ANALYZE` trong DB client để kiểm tra kế hoạch truy vấn.
- Nếu thấy `Seq Scan` (Quét toàn bảng) trên bảng có hàng chục nghìn dòng -> Báo động đỏ, cần tạo index.
- Nếu thấy `Index Scan` hoặc `Index Only Scan` -> Tốt.
