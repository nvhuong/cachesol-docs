# Chuẩn Thiết Kế Phân Trang (Pagination)

Tài liệu hướng dẫn cách thiết kế và triển khai API phân trang.

## 1. Offset-Based Pagination (Phân trang theo số trang)
Đây là chiến lược mặc định cho 90% các danh sách hiển thị trên UI.

### Request Format
Client truyền các query parameters:
- `page`: Số trang, bắt đầu bằng **0** (0-indexed). Mặc định: 0.
- `size`: Số lượng record mỗi trang. Mặc định: 20. Limit tối đa: 100.
- `sort`: Trường để sắp xếp. Định dạng `{field},{asc|desc}`. Có thể lặp lại cho nhiều trường.

**Ví dụ Request:**
`GET /api/v1/users?page=1&size=20&sort=createdAt,desc&sort=lastName,asc`

### Response Format Chuẩn
```json
{
  "content": [
    { "id": 1, "name": "User 1" },
    { "id": 2, "name": "User 2" }
  ],
  "page": {
    "number": 1,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrevious": true
  }
}
```

## 2. Cursor-Based Pagination
### Khi Nào Cần Dùng?
- Dữ liệu thêm mới liên tục (real-time feeds, chat messages). Tránh lỗi lặp data (duplicate) hoặc sót data khi đang xem trang.
- Dataset cực lớn (hàng triệu bản ghi), offset DB bị chậm (`OFFSET 100000 LIMIT 20`).

### Request Format
- `cursor`: Token (base64 encoded hoặc ID) trỏ tới bản ghi cuối cùng của page trước.
- `limit`: Số bản ghi cần lấy.

**Ví dụ:**
`GET /client-api/v1/notifications/history?limit=20&cursor=eyJpZCI6MTIzLCJ0aW1lc3RhbXAiOjE2OTczNDU2MDB9`

### Response Format
```json
{
  "content": [...],
  "nextCursor": "...",
  "hasNext": true
}
```

## 3. Implementation Trong Spring Boot
Sử dụng Spring Data `Pageable` đối với Offset-Based Pagination:

**Controller:**
```java
@GetMapping
public PageResponse<UserDto> getUsers(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @RequestParam(defaultValue = "createdAt,desc") String[] sort) {
    
    Pageable pageable = PageRequest.of(page, size, Sort.by(Direction.DESC, "createdAt"));
    Page<User> result = userService.findAll(pageable);
    
    return PageResponse.of(result.getContent(), result.getNumber(), result.getSize(), result.getTotalElements());
}
```
*Lưu ý: Luôn custom wrapper `PageResponse` thay vì trả thẳng `org.springframework.data.domain.Page` của Spring để kiểm soát JSON serialization schema.*
