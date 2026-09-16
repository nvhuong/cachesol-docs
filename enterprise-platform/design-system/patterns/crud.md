# Pattern: CRUD Operations
## Mô tả
Mẫu giao diện tiêu chuẩn cho thao tác Create, Read, Update, Delete.

## Use Cases
Quản lý danh mục, dữ liệu master, user management.

## Anatomy (các phần cấu thành)
- Filter/Search bar ở trên cùng.
- Table hiển thị dữ liệu (Read).
- Actions cột cuối (Edit, Delete).
- Nút "Thêm mới" (Create) ở góc trên phải.

## Flow / Interaction Design
1. Mở trang -> Gọi API Read (có phân trang).
2. Create/Update -> Mở Drawer hoặc Modal.
3. Delete -> Hiển thị Popconfirm.

## Components sử dụng
Table, Button, Form, Drawer/Modal, Popconfirm.

## Code Example
```jsx
<Page>
  <Header actions={<Button>Thêm mới</Button>} />
  <Table columns={crudColumns} />
</Page>
```

## Variations
- Inline CRUD (edit trực tiếp trên bảng).
- Detail page CRUD (Click vào row để chuyển trang chi tiết).

## Accessibility
Sử dụng role="grid" cho table, các nút action cần aria-label.
