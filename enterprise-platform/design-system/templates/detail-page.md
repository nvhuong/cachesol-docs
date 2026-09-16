# Template: Detail Page
## Mô tả
Bố cục hiển thị chi tiết một bản ghi.

## Layout Structure (ASCII diagram)
```
+-----------------------------------+
| Back / Breadcrumb                 |
+-----------------------------------+
| Title + Status Badge + Actions    |
+-----------------------------------+
| Tabs (Info, History, Related)     |
+-----------------------------------+
|             |                     |
| Main Info   | Side Info (Meta)    |
|             |                     |
+-----------------------------------+
```

## Required Components
- PageHeader
- Descriptions (Antd)
- Tabs

## Optional Components
- Timeline (Lịch sử thay đổi)

## Responsive Behavior
- Sidebar (Side Info) đẩy xuống dưới cùng trên mobile.

## Code Skeleton (React JSX)
```jsx
export default function DetailPage() {
  return (
    <div>
      <PageHeader onBack={() => {}} title="Chi tiết #123" />
      <Row>
        <Col span={16}><MainInfo /></Col>
        <Col span={8}><SideInfo /></Col>
      </Row>
    </div>
  );
}
```

## Checklist
- [ ] Xử lý Not Found (404)
- [ ] Ẩn các tab không có quyền xem
