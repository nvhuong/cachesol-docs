#!/bin/bash
BASE="/Users/huongnv1/Documents/2.docs/cachesol-docs/enterprise-platform"

# FILE 1
cat << 'EOF' > "$BASE/design-system/README.md"
# Design System

## Giới thiệu
Hệ thống thiết kế (Design System) chuẩn cho nền tảng Enterprise, đảm bảo tính nhất quán và hiệu quả trong phát triển.

## Mục tiêu
- Nhất quán UI/UX trên toàn bộ hệ thống
- Tái sử dụng components giúp giảm thời gian phát triển

## Cách sử dụng
Sử dụng các component đã được tùy chỉnh sẵn thay vì viết lại từ đầu. Đọc kỹ documentation của từng component.

## Công cụ
- Ant Design 5.x
- Custom tokens via CSS-in-JS

## Cấu trúc thư mục
- `/tokens`: Chứa các giá trị nền tảng (color, typography, spacing,...)
- `/components`: Các thành phần UI cơ bản (Button, Input,...)
- `/patterns`: Cách kết hợp nhiều components cho một luồng (CRUD, Approval,...)
- `/templates`: Bố cục trang tổng thể (List, Form,...)

## Quy trình thêm component mới
1. Đề xuất component và use-case
2. Review thiết kế trên Figma
3. Implement với ReactJS & Ant Design
4. Viết documentation
EOF

# FILE 2
cat << 'EOF' > "$BASE/design-system/tokens/colors.md"
# Colors

## Hệ thống màu sắc
- **Primary**: #1677ff (Blue) - Nút chính, links, active state
- **Success**: #52c41a (Green) - Thành công, hoàn thành
- **Warning**: #faad14 (Yellow) - Cảnh báo, cần chú ý
- **Error**: #f5222d (Red) - Lỗi, xóa, nguy hiểm
- **Neutral**: Grays (#ffffff đến #000000) - Văn bản, viền, nền

## Semantic Colors
- `bg-base`: #ffffff
- `text-primary`: rgba(0, 0, 0, 0.88)
- `border-color`: #d9d9d9

## Dark Mode Variants
- Inverted colors with adjusted contrast ratios. Primary: #1668dc.

## Accessibility
Contrast ratio tối thiểu 4.5:1 đối với văn bản thông thường và 3:1 đối với văn bản lớn hoặc UI components.
EOF

# FILE 3
cat << 'EOF' > "$BASE/design-system/tokens/typography.md"
# Typography

## Font family
- Primary: Inter, sans-serif
- Fallback: Roboto, Helvetica, Arial

## Font sizes scale
- xs: 12px
- sm: 14px (Base)
- md: 16px
- lg: 20px
- xl: 24px

## Font weights
- Regular: 400
- Medium: 500
- SemiBold: 600
- Bold: 700

## Heading styles
- H1: 38px, SemiBold
- H2: 30px, SemiBold
- H3: 24px, Medium
- H4: 20px, Medium
- H5: 16px, Medium
- H6: 14px, Medium

## Body text styles
- Body1: 14px, Regular
- Body2: 12px, Regular

## Code font
- Fira Code, Consolas, monospace
EOF

# FILE 4
cat << 'EOF' > "$BASE/design-system/tokens/spacing.md"
# Spacing

## Spacing scale (4px base unit)
- 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px

## Usage guidelines
- **Padding/Margin**: Sử dụng spacing scale tương ứng. Ví dụ: khoảng cách giữa các khối lớn là 24px hoặc 32px.
- **Gap**: Trong flexbox hoặc grid, dùng gap 8px, 16px hoặc 24px.
EOF

# FILE 5
cat << 'EOF' > "$BASE/design-system/tokens/radius.md"
# Radius

## Border radius scale
- 0px: Sắc cạnh (không dùng)
- 2px: Checkbox, tag nhỏ
- 4px: Input, Button (Base)
- 6px: Card, Menu
- 8px: Modal, Drawer, Container
- 12px, 16px, 24px: Các khối lớn đặc biệt
- 50%: Avatar, Badge tròn

## Usage per component type
Mặc định các form element dùng 4px.
EOF

# FILE 6
cat << 'EOF' > "$BASE/design-system/tokens/shadows.md"
# Shadows

## Shadow levels
- **none**: Không có bóng
- **sm**: `0 1px 2px 0 rgba(0, 0, 0, 0.03)` - Box nhẹ, Card
- **md**: `0 4px 8px 0 rgba(0, 0, 0, 0.08)` - Dropdown, Popover
- **lg**: `0 8px 16px 0 rgba(0, 0, 0, 0.12)` - Modal, Drawer
- **xl**: `0 16px 32px 0 rgba(0, 0, 0, 0.16)` - Khối floating quan trọng

## Usage guidelines
Không lạm dụng shadow. Chủ yếu dùng cho các phần tử nổi đè lên trên (z-index cao).
EOF

# Components 7-16
COMPONENTS=("button" "input" "select" "table" "form" "modal" "drawer" "tabs" "tree" "date-picker")
for comp in "${COMPONENTS[@]}"; do
  # Capitalize first letter
  COMP_NAME="$(tr '[:lower:]' '[:upper:]' <<< ${comp:0:1})${comp:1}"
  cat << EOF > "$BASE/design-system/components/$comp.md"
# Component: $COMP_NAME

## Mô tả
Thành phần $COMP_NAME chuẩn hóa dựa trên Ant Design, được tùy biến theo Design System.

## Khi nào dùng / Không dùng
- **Nên dùng**: [Mô tả use-cases]
- **Không nên dùng**: [Mô tả anti-patterns]

## Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| prop1 | string | - | Mô tả prop1 |

## Variants
- Primary
- Secondary / Default
- Text
- Link

## States (default, hover, focus, disabled, loading, error)
Mô tả chi tiết trực quan cho mỗi state.

## Accessibility (ARIA)
- Hỗ trợ phím Tab, Enter/Space.
- `aria-label` cần thiết khi không có text.

## Examples (JSX code)
\`\`\`jsx
import { $COMP_NAME } from 'antd';

const App = () => (
  <$COMP_NAME>Example</$COMP_NAME>
);
\`\`\`

## Do / Don't
- **Do**: Dùng đúng màu sắc và kích thước.
- **Don't**: Không override CSS inline vô tội vạ.
EOF
done

# Patterns 17-23
PATTERNS=("crud" "search" "approval" "dashboard" "import-export" "notification" "workflow")
for pat in "${PATTERNS[@]}"; do
  PAT_NAME="$(tr '[:lower:]' '[:upper:]' <<< ${pat:0:1})${pat:1}"
  cat << EOF > "$BASE/design-system/patterns/$pat.md"
# Pattern: $PAT_NAME

## Mô tả
Quy chuẩn giao diện cho luồng xử lý $PAT_NAME.

## Use Cases
Phù hợp cho các tình huống nghiệp vụ cần $PAT_NAME.

## Anatomy (các phần cấu thành)
1. Header
2. Body / Content
3. Actions (Footer)

## Flow / Interaction Design
1. Người dùng bắt đầu hành động.
2. Hệ thống phản hồi / hiển thị dữ liệu.
3. Hoàn tất hoặc báo lỗi.

## Components sử dụng
- Button, Table, Form, Modal...

## Code Example
\`\`\`jsx
// Pseudocode
<Container>
  <Header />
  <MainContent />
</Container>
\`\`\`

## Variations
- Basic
- Advanced

## Accessibility
Đảm bảo focus trap nếu là modal, hoặc thứ tự tab logic hợp lý.
EOF
done

# Templates 24-28
TEMPLATES=("list-page" "detail-page" "form-page" "dashboard-page" "workflow-page")
for tpl in "${TEMPLATES[@]}"; do
  TPL_NAME="$(tr '[:lower:]' '[:upper:]' <<< ${tpl:0:1})${tpl:1}"
  cat << EOF > "$BASE/design-system/templates/$tpl.md"
# Template: $TPL_NAME

## Mô tả
Template cho $TPL_NAME, giúp xây dựng trang nhanh chóng.

## Layout Structure (ASCII diagram)
+-----------------------+
|        Header         |
+-----------------------+
| Filter / Breadcrumbs  |
+-----------------------+
|                       |
|        Content        |
|                       |
+-----------------------+

## Required Components
- PageHeader
- ContentContainer

## Optional Components
- Breadcrumb
- Footer Actions

## Responsive Behavior
- Desktop: Full width, multi-column.
- Mobile: Stacked blocks.

## Code Skeleton (React JSX)
\`\`\`jsx
export default function Page() {
  return (
    <PageLayout>
      <PageHeader title="$TPL_NAME" />
      <PageContent>
        {/* Content here */}
      </PageContent>
    </PageLayout>
  );
}
\`\`\`

## Checklist
- [ ] Responsive kiểm tra
- [ ] Kiểm tra quyền truy cập (IAM)
EOF
done

# Platforms 29-43
PLATFORMS=("iam" "organization" "employee" "customer" "notification" "workflow" "approval" "audit" "file" "search" "reporting" "scheduler" "configuration" "master-data" "integration")
for p in "${PLATFORMS[@]}"; do
  P_NAME="$(tr '[:lower:]' '[:upper:]' <<< ${p:0:1})${p:1}"
  cat << EOF > "$BASE/platform/$p/README.md"
# $P_NAME Service

## Mô tả & Trách nhiệm
Microservice chịu trách nhiệm quản lý domain $P_NAME trong enterprise platform.

## Bounded Context
Quản lý các thực thể liên quan đến $P_NAME. Đảm bảo tính nhất quán dữ liệu trong context của nó.

## Domain Events
### Published Events
- \`${p}.created\`
- \`${p}.updated\`

### Consumed Events
- Các events từ IAM hoặc Core systems.

## API Overview
Cung cấp RESTful API:
- \`GET /api/v1/${p}s\`
- \`POST /api/v1/${p}s\`

## Dependencies
- Database (PostgreSQL)
- Message Broker (Kafka/RabbitMQ)
- Redis (Cache)

## Database Schema (overview)
Gồm bảng chính \`${p}\` và các bảng phụ trợ (relations).

## Configuration
- Spring Boot \`application.yml\`
- Biến môi trường: \`DB_URL\`, \`KAFKA_BOOTSTRAP\`

## Getting Started
\`\`\`bash
# Build
./mvnw clean install

# Run
java -jar target/${p}-service.jar
\`\`\`
EOF
done

echo "Tạo file hoàn tất."
