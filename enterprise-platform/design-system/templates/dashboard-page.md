# Template: Dashboard Page
## Mô tả
Bố cục cho trang tổng quan số liệu.

## Layout Structure (ASCII diagram)
```
+-----------------------------------+
| Title                 [DateRange] |
+-----------------------------------+
| [ KPI 1 ] [ KPI 2 ] [ KPI 3 ]     |
+-----------------------------------+
|             |                     |
| Chart Area  |  Top List           |
|             |                     |
+-----------------------------------+
```

## Required Components
- Row/Col (Grid)
- Card
- Charts

## Optional Components
- Global DatePicker

## Responsive Behavior
- Các Widget xếp dọc (1 cột) trên mobile.

## Code Skeleton (React JSX)
```jsx
export default function DashboardPage() {
  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        <Col span={8}><Card>Doanh thu</Card></Col>
      </Row>
      <Row gutter={16}>
        <Col span={16}><Card>Biểu đồ</Card></Col>
      </Col>
    </div>
  );
}
```

## Checklist
- [ ] Xử lý loading state bằng Skeleton đẹp mắt
- [ ] Handle API timeout cho từng widget riêng lẻ
