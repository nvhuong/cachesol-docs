# Role-Based Access Control (RBAC)

Tài liệu định nghĩa các Role và quy tắc quản lý vai trò trong hệ thống.

## 1. Thiết Kế Phân Cấp (Role Hierarchy)
Hệ thống sử dụng cơ chế cấp bậc quyền hạn. Role cấp cao sẽ tự động thừa kế mọi quyền của Role cấp thấp hơn.
- `SUPER_ADMIN` > `ADMIN` > `MANAGER` > `USER` > `VIEWER`

## 2. Predefined System Roles (Vai Trò Hệ Thống)
Hệ thống có sẵn các nhóm quyền mặc định:
- **SUPER_ADMIN**: Quyền cao nhất, quản lý cấu hình hệ thống, tenant, không bị giới hạn RLS.
- **ADMIN**: Quản trị viên của một Tenant (Tổ chức). Quản lý user nội bộ.
- **MANAGER**: Quản lý bộ phận. Được duyệt/sửa dữ liệu của nhân viên cấp dưới.
- **USER**: Nhân viên/Người dùng thao tác nghiệp vụ hàng ngày. Chỉ thấy/sửa dữ liệu của mình.
- **VIEWER**: Quyền read-only. Thường cấp cho auditor hoặc tài khoản tạm thời.

## 3. Permission Sets (Bộ Quyền)
Mỗi role được ánh xạ tới một danh sách (Set) các permissions.
Ví dụ: Role `VIEWER`:
- `users:read`, `orders:read`, `products:read`

Role `USER`:
- Gồm quyền VIEWER + `orders:create`, `orders:update_own`, `profile:update`

## 4. Custom Role Creation
- Hệ thống cho phép ADMIN tự định nghĩa các Custom Roles (VD: `ACCOUNTANT`).
- Custom Role được ghép từ các permissions hiện có của hệ thống.
- Custom Roles bị giới hạn trong phạm vi Tenant của người tạo ra nó.

## 5. Quy Tắc Gán Quyền (Role Assignment)
- User có thể mang nhiều Role cùng lúc (Mảng list Roles).
- Phân quyền thực tế khi tính toán sẽ là phép `UNION` (Gộp) tất cả permission từ mọi role user đó có.

## 6. Bảng Ma Trận Role-Permission (Ví dụ)

| Permission      | VIEWER | USER | MANAGER | ADMIN |
|-----------------|:------:|:----:|:-------:|:-----:|
| products:read   | ✅      | ✅    | ✅       | ✅     |
| products:write  | ❌      | ❌    | ✅       | ✅     |
| orders:read     | ✅      | ✅    | ✅       | ✅     |
| orders:write    | ❌      | ✅    | ✅       | ✅     |
| users:manage    | ❌      | ❌    | ❌       | ✅     |

## 7. Multi-Tenant Role Isolation
Mỗi tenant có cấu trúc Role riêng. User A là `ADMIN` ở Tenant 1 nhưng có thể chỉ là `VIEWER` ở Tenant 2 (Trong trường hợp hỗ trợ User đa Tenant).
Trong Access Token, cấu trúc lưu trữ sẽ dạng map:
```json
"roles": {
  "tenant_1": ["ADMIN"],
  "tenant_2": ["VIEWER"]
}
```
