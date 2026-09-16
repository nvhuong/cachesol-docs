# Component: DatePicker
## Mô tả
Thành phần chọn ngày tháng, khoảng thời gian.

## Khi nào dùng / Không dùng
- **Nên dùng**: Khi người dùng cần nhập ngày cụ thể (sinh nhật, ngày hết hạn).
- **Không nên dùng**: Nếu chỉ cần nhập năm, dùng Input hoặc Select năm.

## Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| format | string | 'DD/MM/YYYY' | Định dạng ngày |

## Variants
- DatePicker
- RangePicker
- MonthPicker

## States (default, hover, focus, disabled, loading, error)
Viền đỏ nếu chọn ngày không hợp lệ.

## Accessibility (ARIA)
- Có thể dùng bàn phím để di chuyển qua các ngày trên lịch.

## Examples (JSX code)
```jsx
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

const App = () => (
  <RangePicker />
);
```

## Do / Don't
- **Do**: Luôn hiển thị format gợi ý (vd: DD/MM/YYYY) ở placeholder.
- **Don't**: Yêu cầu nhập ngày bằng tay không có validate format.
