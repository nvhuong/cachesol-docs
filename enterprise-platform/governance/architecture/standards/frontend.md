# Frontend Standards (ReactJS)

## 1. Project Structure (Cấu trúc dự án)
Sử dụng kiến trúc **Feature-based** thay vì type-based truyền thống:
```text
src/
├── assets/         # Images, fonts
├── components/     # Global/Shared components (UI kit: Button, Input, Table)
├── features/       # Group theo domain (e.g., auth, employees, payroll)
│   └── employees/
│       ├── api/        # RTK Query / Axios calls
│       ├── components/ # Components chỉ dùng riêng cho employees
│       ├── hooks/      # Custom hooks
│       ├── slices/     # Redux slices / Zustand store
│       └── utils/      # Helpers
├── hooks/          # Global hooks
├── layouts/        # Page layouts (Sidebar, Header)
├── routes/         # Cấu hình React Router
└── utils/          # Global helpers, formatters
```

## 2. Component Architecture
- Sử dụng Functional Components và Hooks.
- Giữ Components nhỏ gọn. Chia tách "Smart" (Container) và "Dumb" (Presentational) components.

## 3. State Management
- **Server State (API Cache):** Sử dụng **React Query** hoặc **RTK Query**.
- **Client State (Global):** Sử dụng **Zustand** hoặc Redux Toolkit cho các state phức tạp.
- **Local State:** Dùng `useState` hoặc `useReducer`.

## 4. Feature Flag Mechanism
Mọi tính năng mới (UI section, Menu item) phải được bọc trong một HOC hoặc Hook `useFeatureFlag`:
```tsx
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

export const PayrollMenu = () => {
  const isPayrollEnabled = useFeatureFlag('ENABLE_PAYROLL_V2');
  
  if (!isPayrollEnabled) return null;
  return <MenuItem>Payroll V2</MenuItem>;
};
```
Feature flags được load từ API lúc app khởi động và lưu vào Context/Store.

## 5. Form Handling & Validation
- **Bắt buộc:** Sử dụng **React Hook Form**.
- **Validation:** Sử dụng **Zod** để schema validation.
```tsx
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
```

## 6. Routing & Code Splitting
- Sử dụng `react-router-dom` v6+.
- Mọi trang (Pages) phải được **Lazy Load** bằng `React.lazy` và `Suspense` để tối ưu bundle size (Code splitting).

## 7. Error Handling
- Wrap toàn bộ Application và các Module lớn bằng `ErrorBoundary`.
- Cần có UI thân thiện cho các lỗi 403 (No Permission), 404 (Not Found), 500 (Server Error).

## 8. Internationalization (i18n)
- Sử dụng `react-i18next`.
- Tuyệt đối không hardcode text tiếng Việt trực tiếp trong JSX. Sử dụng hook `useTranslation()`.

## 9. Performance Optimization
- `useMemo` và `useCallback` chỉ dùng khi thực sự cần thiết (tránh re-render component con nặng).
- Pagination và Infinite Scroll cho danh sách lớn.
- Tối ưu image size.

## 10. Testing
- Dùng **Jest** + **React Testing Library**.
- Test tập trung vào hành vi người dùng (user behaviors) thay vì implementation details.
