# Skill: Phát triển Frontend (ReactJS)

## Mục tiêu
Phát triển giao diện web bằng ReactJS, tích hợp API, đảm bảo performance và chuẩn UI/UX.

## Phạm vi áp dụng
Implement giao diện người dùng trên nền tảng Web.

## Điều kiện tiên quyết
- Có `ui-spec.md` và `api-spec.yaml`.

## Input cần thiết
- Thiết kế UI và tài liệu API.

## Quy trình thực hiện
### Bước 1: Tạo Page/Component Structure
Phân chia ứng dụng thành các Smart Components (Pages) và Dumb Components (UI elements).
### Bước 2: API Integration
Sử dụng `React Query` (TanStack Query) để fetch dữ liệu, handle loading và error state, cấu hình caching.
### Bước 3: Form Handling
Sử dụng `React Hook Form` kết hợp với `Zod` để xử lý schema validation tại client-side.
### Bước 4: State Management
Quản lý local state bằng `useState`/`useReducer`. Quản lý global state (nếu cần) bằng `Zustand` hoặc `Redux Toolkit`.
### Bước 5: Feature Flag Integration
Bọc các tính năng mới trong các Higher-Order Components hoặc Hooks của hệ thống Feature Toggle.
### Bước 6: Error Handling & Boundary
Tạo `ErrorBoundary` để bắt các lỗi crash React. Hiển thị Fallback UI thân thiện.

## Output chuẩn
- Các file `.tsx`, `.ts` React code.

## Checklist kiểm tra
- [ ] Component có tái sử dụng cao không?
- [ ] API fetching dùng React Query thay vì useEffect trực tiếp chưa?
- [ ] Form đã có validation đầy đủ chưa?
- [ ] Có ErrorBoundary không?

## Ví dụ
### Ví dụ Input
Form tạo mới tài khoản.
### Ví dụ Output
`UserForm.tsx` dùng `useForm` và resolver `zodResolver`.

## Tham chiếu
- [Frontend Coding Standards](../../governance/architecture/standards/frontend.md)
