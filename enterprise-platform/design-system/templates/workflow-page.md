# Template: Workflow Page
## Mô tả
Bố cục trang thiết kế quy trình nghiệp vụ (Flow builder).

## Layout Structure (ASCII diagram)
```
+---------------------------------------+
| Header (Name, Save, Deploy)           |
+------+-------------------------+------+
| Node |                         | Prop |
| List |       CANVAS            | Pan- |
|      |                         | el   |
+------+-------------------------+------+
```

## Required Components
- Layout (Sidebar - Content - Sidebar)
- Canvas engine

## Optional Components
- Minimap

## Responsive Behavior
- Thường không hỗ trợ Mobile cho Editor, hiển thị cảnh báo yêu cầu dùng Desktop.

## Code Skeleton (React JSX)
```jsx
export default function WorkflowPage() {
  return (
    <Layout>
      <SidebarLeft />
      <Content><FlowCanvas /></Content>
      <SidebarRight />
    </Layout>
  );
}
```

## Checklist
- [ ] Bật prompt cảnh báo khi đóng trình duyệt mà chưa save.
- [ ] Nút Zoom in/out hoạt động tốt.
