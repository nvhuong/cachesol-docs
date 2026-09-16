# Pattern: Search & Filter
## Mô tả
Giao diện tìm kiếm, lọc dữ liệu phức tạp trên danh sách.

## Use Cases
Trang báo cáo, danh sách đơn hàng lớn, tra cứu giao dịch.

## Anatomy (các phần cấu thành)
- Ô Search tổng quát.
- Các dropdown filter (Select/DatePicker).
- Nút "Apply", "Reset".
- Tags hiển thị bộ lọc đang áp dụng.

## Flow / Interaction Design
1. User chọn các tiêu chí.
2. Bấm Apply (hoặc auto-fetch nếu debounce).
3. URL cập nhật query params.
4. Bảng load data mới.

## Components sử dụng
Input.Search, Select, Form, Tag.

## Code Example
```jsx
<FilterBar>
  <Input.Search />
  <Select placeholder="Trạng thái" />
  <Button>Lọc</Button>
</FilterBar>
<FilterTags tags={currentFilters} />
```

## Variations
- Basic Search (Chỉ có ô input).
- Advanced Search (Form ẩn/hiện với nhiều fields).

## Accessibility
Gắn nhãn rõ ràng cho từng ô filter.
