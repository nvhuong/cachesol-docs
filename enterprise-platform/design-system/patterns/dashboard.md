# Pattern: Dashboard
## Mô tả
Giao diện tổng quan sử dụng các widget để báo cáo số liệu.

## Use Cases
Trang chủ cho Manager/Admin, màn hình giám sát hệ thống.

## Anatomy (các phần cấu thành)
- Filter toàn cục (Date range, Department).
- Scorecards (KPI chính).
- Charts (Bar, Line, Pie).
- Data Tables (Top 10 list).

## Flow / Interaction Design
1. Load skeleton cho các widget.
2. Fetch data độc lập hoặc song song.
3. Cập nhật filter -> Reload tất cả widget.

## Components sử dụng
Card, Row/Col (Grid), Statistic, Chart (ECharts/Recharts).

## Code Example
```jsx
<DashboardLayout>
  <GlobalFilter />
  <Row gutter={16}>
    <Col span={6}><KpiCard /></Col>
    <Col span={18}><MainChart /></Col>
  </Row>
</DashboardLayout>
```

## Variations
- Customizable Dashboard (Kéo thả widget).
- Static Dashboard (Cố định layout).

## Accessibility
Cung cấp table view thay thế cho các biểu đồ đối với screen reader.
