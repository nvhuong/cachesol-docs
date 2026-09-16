# Pattern: Import & Export
## Mô tả
Quy trình nạp dữ liệu từ file (Excel/CSV) vào hệ thống và xuất dữ liệu ra file.

## Use Cases
Nhập danh sách nhân viên, xuất báo cáo doanh thu.

## Anatomy (các phần cấu thành)
- Nút Import/Export.
- Upload area (Drag & drop).
- Progress bar.
- Result summary (Success: X, Error: Y) + Download error log.

## Flow / Interaction Design
1. Bấm Import -> Mở Modal.
2. Chọn file -> Upload & Validate (Preview).
3. Nếu có lỗi, tải file log về sửa. Nếu OK, submit.

## Components sử dụng
Upload, Progress, Table (Preview), Alert.

## Code Example
```jsx
<ImportModal>
  <Dragger accept=".xlsx" action="/upload">
    <p>Kéo thả file vào đây</p>
  </Dragger>
</ImportModal>
```

## Variations
- Async Export (Gửi email khi tạo xong báo cáo lớn).
- Sync Export (Tải ngay lập tức).

## Accessibility
Thông báo hoàn thành bằng âm thanh hoặc thông báo màn hình nổi.
