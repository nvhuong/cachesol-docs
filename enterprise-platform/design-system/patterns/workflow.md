# Pattern: Workflow
## Mô tả
Giao diện quản lý quy trình động (BPMN, Flowchart).

## Use Cases
Thiết lập quy trình duyệt động, tự động hóa marketing.

## Anatomy (các phần cấu thành)
- Canvas (Khu vực vẽ).
- Node Palette (Các loại bước: Start, Task, Gateway).
- Property Panel (Cài đặt cho node được chọn).

## Flow / Interaction Design
1. Kéo thả node từ Palette vào Canvas.
2. Nối các node bằng các cạnh (edges).
3. Click vào node -> Mở Property panel bên phải cấu hình.

## Components sử dụng
React Flow / G6, Drawer/Panel, Form.

## Code Example
```jsx
<WorkflowBuilder>
  <Sidebar />
  <Canvas nodes={nodes} edges={edges} />
  <PropertyPanel selectedNode={activeNode} />
</WorkflowBuilder>
```

## Variations
- Workflow Viewer (Chỉ xem, readonly).
- Workflow Editor.

## Accessibility
Cần cung cấp phương thức thay thế bằng form/table để thêm các bước (vì canvas rất khó truy cập với screen reader).
