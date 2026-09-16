# Template: Form Page
## Mô tả
Bố cục dành cho form tạo mới hoặc chỉnh sửa dữ liệu lớn.

## Layout Structure (ASCII diagram)
```
+-----------------------------------+
| PageHeader (Title)                |
+-----------------------------------+
|                                   |
| Block 1: Thông tin chung          |
| Block 2: Cài đặt nâng cao         |
|                                   |
+-----------------------------------+
| Fixed Footer (Cancel, Save)       |
+-----------------------------------+
```

## Required Components
- Form
- Card (Chia khối)
- Fixed Bottom Bar

## Optional Components
- Steps (Nếu là multi-step form)

## Responsive Behavior
- Tránh fixed footer che lấp nội dung trên màn hình nhỏ.

## Code Skeleton (React JSX)
```jsx
export default function FormPage() {
  return (
    <Form layout="vertical">
      <Card title="Cơ bản"><Input /></Card>
      <FooterBar>
        <Button>Hủy</Button>
        <Button type="primary">Lưu</Button>
      </FooterBar>
    </Form>
  );
}
```

## Checklist
- [ ] Chặn user chuyển trang nếu có thay đổi chưa lưu (Dirty check)
- [ ] Validate ngay tại client trước khi gọi API
