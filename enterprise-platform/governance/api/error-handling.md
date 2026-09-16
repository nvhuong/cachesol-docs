# Chuẩn Hóa Error Handling API

Để đảm bảo tính nhất quán giữa các Microservices, mọi phản hồi lỗi (Error Response) phải tuân theo cấu trúc chuẩn.

## 1. Cấu Trúc JSON Của Phản Hồi Lỗi
Mọi lỗi (HTTP Status 4xx, 5xx) phải trả về định dạng:

```json
{
  "errorCode": "IAM_USER_NOT_FOUND",
  "message": "Không tìm thấy thông tin người dùng với ID cung cấp.",
  "traceId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "timestamp": "2023-10-15T08:30:15Z",
  "details": [] 
}
```

### Validation Error (Field-level errors)
Khi có lỗi do validate input, trả về thêm mảng `details`:

```json
{
  "errorCode": "SYS_VALIDATION_FAILED",
  "message": "Dữ liệu đầu vào không hợp lệ",
  "traceId": "9b1deb4d-...",
  "timestamp": "2023-10-15T08:30:15Z",
  "details": [
    { "field": "email", "issue": "Email không đúng định dạng" },
    { "field": "password", "issue": "Mật khẩu phải lớn hơn 8 ký tự" }
  ]
}
```

## 2. Quy Ước Error Code (Mã Lỗi)
Format: `{DOMAIN}_{ENTITY}_{ERROR_TYPE}`
- `DOMAIN`: Viết tắt của service (IAM, ORD, PAY, SYS...)
- `ENTITY`: Đối tượng gặp lỗi (USER, INVOICE, TOKEN...)
- `ERROR_TYPE`: Loại lỗi (NOT_FOUND, INVALID, EXPIRED...)

## 3. Mapping HTTP Status Codes
- `400 Bad Request`: Lỗi validation, dữ liệu sai format.
- `401 Unauthorized`: Chưa đăng nhập, token hết hạn hoặc sai.
- `403 Forbidden`: Đã đăng nhập nhưng không có quyền truy cập.
- `404 Not Found`: Không tìm thấy resource.
- `409 Conflict`: Xung đột dữ liệu (VD: Username đã tồn tại).
- `429 Too Many Requests`: Vượt quá rate limit.
- `500 Internal Server Error`: Lỗi hệ thống, crash (hạn chế tối đa).

## 4. Danh Sách Error Codes (Ví dụ)

**System (SYS)**
- `SYS_VALIDATION_FAILED` (400)
- `SYS_METHOD_NOT_ALLOWED` (405)
- `SYS_INTERNAL_ERROR` (500)
- `SYS_RATE_LIMIT_EXCEEDED` (429)

**Identity & Access Management (IAM)**
- `IAM_USER_NOT_FOUND` (404)
- `IAM_TOKEN_EXPIRED` (401)
- `IAM_TOKEN_INVALID` (401)
- `IAM_ACCESS_DENIED` (403)
- `IAM_PASSWORD_WEAK` (400)

**Order Management (ORD)**
- `ORD_ORDER_NOT_FOUND` (404)
- `ORD_OUT_OF_STOCK` (409)
- `ORD_STATUS_INVALID_TRANSITION` (400)

## 5. Business Logic Error vs System Error
- **Business Error (4xx)**: Lỗi do quy tắc nghiệp vụ (Hết hàng, Số dư không đủ). Trả về message có ý nghĩa cho client xử lý.
- **System Error (5xx)**: Lỗi DB, NullPointer... Trả về chung chung như `Lỗi hệ thống nội bộ`. Tuyệt đối **không trả về Stacktrace**. Ghi chi tiết vào Log tập trung kèm `traceId`.

## 6. Implementation Trong Spring Boot 21
Sử dụng `@RestControllerAdvice` và `@ExceptionHandler`.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
            ex.getErrorCode(),
            ex.getMessage(),
            getTraceId(),
            Instant.now()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
    
    // Xử lý MethodArgumentNotValidException cho Validation...
}
```
