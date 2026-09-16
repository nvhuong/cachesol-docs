# Component: Button
## Mô tả
Thành phần Button chuẩn hóa dựa trên Ant Design, được tùy biến theo Design System.

## Khi nào dùng / Không dùng
- **Nên dùng**: Thực hiện các thao tác chính (Submit, Cancel, Save)
- **Không nên dùng**: Làm Navigation links (Nên dùng thẻ <a>)

## Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| type | string | 'default' | primary, default, text, link |

## Variants
- Primary
- Secondary / Default
- Text
- Link

## States (default, hover, focus, disabled, loading, error)
Mô tả chi tiết trực quan cho mỗi state. Button disabled có opacity 0.5.

## Accessibility (ARIA)
- Hỗ trợ phím Tab, Enter/Space.
- `aria-label` cần thiết khi chỉ có Icon.

## Examples (JSX code)
```jsx
import { Button } from 'antd';

const App = () => (
  <Button type="primary">Thực hiện</Button>
);
```

## Do / Don't
- **Do**: Dùng button chính (Primary) cho action quan trọng nhất trên form.
- **Don't**: Không để quá nhiều nút Primary trên cùng một màn hình.
