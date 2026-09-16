# Tiêu Chuẩn Coding (Coding Standards)

Tài liệu này xác định các quy tắc viết code đảm bảo tính dễ đọc, bảo trì và đồng nhất trong toàn dự án.

## 1. Java Coding Style
Dựa trên nền tảng **Google Java Style Guide**.
- **Formatting:** 
  - Indentation: 4 spaces (Không dùng Tab).
  - Max line length: 120 ký tự.
  - Bracket mở `{` ở cuối dòng, bracket đóng `}` ở đầu dòng mới.
- **Quy tắc Naming:**
  - `Class/Interface/Enum`: PascalCase (VD: `OrderService`, `PaymentStatus`).
  - `Method/Variable`: camelCase (VD: `calculateTotal`, `userId`).
  - `Constants`: UPPER_SNAKE_CASE (VD: `MAX_RETRY_COUNT`).
- **Tự Động Hóa:** Bắt buộc cài đặt plugin Checkstyle và SpotBugs trong IDE/Maven.

## 2. Javadoc và Comments
- Mọi Interface của Service, public method chứa logic phức tạp đều phải có Javadoc.
- Javadoc phải giải thích **TẠI SAO (Why)** và **NHƯ THẾ NÀO (How)**, thay vì chỉ dịch tên hàm ra tiếng Anh.
- Xóa bỏ mọi comment code thừa (dead code) thay vì comment out.

## 3. Code Complexity (Độ Phức Tạp)
- **Cyclomatic Complexity:** Bắt buộc `<= 10` cho mỗi method. Nếu lớn hơn, phải tách thành các sub-method nhỏ hơn.
- Độ dài method: Không nên vượt quá 50 dòng code.
- Số lượng tham số truyền vào hàm (Parameters): Tối đa 4 tham số. Nếu nhiều hơn, hãy gom thành một đối tượng (DTO / Parameter Object).

## 4. Xóa Bỏ Magic Numbers / Magic Strings
- Tuyệt đối không hardcode các con số hoặc chuỗi ký tự trực tiếp trong logic code.
- Phải khai báo là `public static final` hằng số hoặc config properties.
- ✅ `if (status.equals(Status.ACTIVE))` 
- ❌ `if (status.equals("A"))`

## 5. ReactJS & TypeScript Coding Style
- Sử dụng **Functional Component** và Hooks (Cấm dùng Class Component cho code mới).
- **TypeScript:** Bắt buộc define `interface` hoặc `type` cho mọi Props và State. Không dùng type `any`.
- **Formatting:** Sử dụng ESLint kết hợp Prettier. Cấu hình tự động format on save.
- **Quy tắc Naming Front-end:**
  - Component files: PascalCase (VD: `UserProfile.tsx`).
  - Utility/Hook files: camelCase (VD: `useAuth.ts`, `formatDate.ts`).

## 6. Import Organization
- Gom nhóm Import theo thứ tự: Java standard -> Libraries -> Project code.
- Cấu hình IDE (IntelliJ / VSCode) tự động loại bỏ unused imports lúc lưu file.
