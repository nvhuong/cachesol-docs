# Cơ Chế Phân Quyền (Authorization)

Tài liệu này định nghĩa cách hệ thống kiểm soát quyền truy cập tài nguyên.

## 1. Authorization Model
Nền tảng sử dụng mô hình kết hợp (Hybrid):
- **RBAC (Role-Based Access Control):** Dành cho kiểm soát mức độ thô (Coarse-grained). Phân nhóm user theo Role.
- **ABAC (Attribute-Based Access Control):** Dành cho kiểm soát mức độ mịn (Fine-grained). Quyền dựa trên thuộc tính đối tượng (Ví dụ: Chỉ được sửa hóa đơn do chính user đó tạo).

## 2. Định Dạng Permission (Quyền)
- Chuẩn định dạng: `{resource}:{action}`
- Mở rộng: `{resource}:{action}:{scope}`
- **Ví dụ:**
  - `users:read`: Xem danh sách user.
  - `orders:create`: Tạo hóa đơn mới.
  - `reports:view:all`: Xem tất cả report (scope all).

## 3. Resource-level vs Field-level
- **Resource-level**: Cấm/cho phép truy cập vào một API endpoint (vd: chặn không cho gọi `POST /api/v1/products`).
- **Field-level**: Cho phép gọi API, nhưng response sẽ ẩn các trường nhất định tuỳ quyền (VD: user thường không thấy trường `salary` của nhân viên khác). Thường handle logic ở Data Mapper (MapStruct/DTO).

## 4. Row-level Security (RLS) cho Multi-Tenant
- Dữ liệu của các khách hàng (Tenants) khác nhau cùng nằm trong một DB, nhưng phải được cách ly hoàn toàn.
- Bắt buộc kiểm tra `tenant_id` ở mọi câu truy vấn SQL hoặc sử dụng Hibernate Filters.
- Người dùng chỉ thấy dữ liệu có `tenant_id` khớp với tenant hiện tại của họ.

## 5. Implement Bằng Spring Security
Sử dụng annotation `@PreAuthorize` kết hợp SpEL (Spring Expression Language).

```java
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    // Yêu cầu quyền orders:read
    @GetMapping
    @PreAuthorize("hasAuthority('orders:read')")
    public List<Order> getOrders() { ... }

    // Dùng ABAC qua custom method security
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('orders:update') and @securityService.isOrderOwner(#id, authentication.name)")
    public Order updateOrder(@PathVariable String id, @RequestBody OrderDto dto) { ... }
}
```

## 6. Caching Quyền Truy Cập
Để không phải gọi DB kiểm tra quyền liên tục:
- Các quyền của user (Authorities) được encode thẳng vào trong JWT Access Token. (Tối ưu nhất cho Microservices).
- Nếu quyền quá lớn, chứa không vừa JWT, sẽ dùng Redis để cache danh sách quyền theo `userId`. Tái tạo cache khi quyền thay đổi.
