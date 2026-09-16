# Template: List Page
## Mô tả
Bố cục chuẩn cho trang danh sách tổng hợp.

## Layout Structure (ASCII diagram)
```
+-----------------------------------+
| PageHeader (Title, Actions)       |
+-----------------------------------+
| FilterPanel (Search, Filter tags) |
+-----------------------------------+
|                                   |
| DataTable (with Pagination)       |
|                                   |
+-----------------------------------+
```

## Required Components
- PageHeader
- Table
- Pagination

## Optional Components
- Breadcrumb
- Tabs (lọc nhanh theo trạng thái)

## Responsive Behavior
- Mobile: Ẩn bớt cột, hoặc chuyển bảng thành dạng List/Card.

## Code Skeleton (React JSX)
```jsx
export default function ListPage() {
  return (
    <div className="page-container">
      <PageHeader title="Danh sách" />
      <FilterForm />
      <Table />
    </div>
  );
}
```

## Checklist
- [ ] Tích hợp router (URL sync) cho phân trang & filter
- [ ] Xử lý empty state
- [ ] Kiểm tra quyền hiển thị các nút thao tác
