# Nghiện Sách

MVP nền tảng sách nói gồm:

- `backend/`: FastAPI, SQLite/PostgreSQL, trang quản trị tích hợp, xử lý PDF và VieNeu-TTS v3 Turbo.
- `react_native_app/`: React Native + Expo, một codebase chạy Android, iOS và Web.

## Chạy nhanh bằng Docker

```bash
cp .env.example .env
docker compose up --build
```

- API docs: http://localhost:8000/docs
- Admin: http://localhost:8000/admin (tài khoản phát triển mặc định `admin` / `admin`)
- Audio/text đã sinh: http://localhost:8000/media/...

Lần đầu tạo audio, VieNeu sẽ tải model từ Hugging Face nên cần Internet và có thể mất vài phút. Để phát triển không tải model, đặt `TTS_MOCK=true`; worker sẽ tạo WAV im lặng hợp lệ.

## Chạy backend không dùng Docker

Yêu cầu Python 3.11+, `ffmpeg` và thư viện hệ thống `libsndfile`.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
uvicorn app.main:app --reload
```

VieNeu v3 Turbo được import lazy khi job TTS chạy. Cài bản CPU/ONNX theo hướng dẫn chính thức của VieNeu nếu môi trường `pip` không phù hợp với máy đích.

## Chạy React Native / Expo

```bash
cd react_native_app
cp .env.example .env
npm install
npm run web
```

Khi dùng Expo Go trên điện thoại thật, điện thoại và máy chạy backend phải cùng Wi‑Fi. Chạy `npx expo start --lan`, quét QR bằng Expo Go và không đặt `EXPO_PUBLIC_API_BASE_URL` thành `localhost`; app sẽ tự lấy IP LAN từ Expo Go. Nếu mạng không cho phép LAN, đặt thủ công biến này trong file `.env` của `react_native_app`, ví dụ `EXPO_PUBLIC_API_BASE_URL=http://192.168.1.20:8000`.

Các lệnh khác: `npm run android`, `npm run ios`, `npm run typecheck`, `npm run build:web`.

Android emulator dùng `EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000`. Thiết bị thật dùng IP LAN của máy chạy backend. Expo SDK 56 được chọn để tương thích Node.js 20 hiện tại.

## Luồng dữ liệu

1. Admin tạo thể loại và sách.
2. Admin tải PDF lên để tạo chương.
3. Trong trang **Chương**, admin có thể chạy riêng bước **PDF → Text**, chọn một giọng đọc cho chương rồi chạy **Text → Audio**.
4. Backend trích text bằng `pypdf`, chia đoạn, tổng hợp từng đoạn với `Vieneu(mode="v3turbo")`, rồi ghép thành WAV.
5. Khi khách mở chi tiết sách, backend tự chuẩn bị text và audio chương 1. Khi khách mở chương hiện tại, backend tiếp tục chuẩn bị chương kế tiếp.
6. React Native/Expo hiển thị PDF của chương và phát audio trên Android, iOS và Web. Người dùng cuối không chọn giọng và không thấy nội dung text trung gian.

PDF upload không được public như static file. App chỉ nhận PDF qua endpoint `GET /api/v1/chapters/{id}/pdf`, với `Content-Disposition: inline` và `Cache-Control: private, no-store`; giao diện cũng ẩn thanh công cụ/nút tải. Đây là biện pháp hạn chế tải xuống ở mức ứng dụng — không thể ngăn tuyệt đối việc sao chép dữ liệu đã được gửi tới thiết bị để hiển thị.

Các API thao tác dành cho admin (HTTP Basic):

- `POST /api/v1/admin/chapters/{id}/extract-text`
- `POST /api/v1/admin/chapters/{id}/synthesize` với JSON `{ "voice_id": 1 }`
- `GET /api/v1/voices`

Endpoint public chỉ cho phép đọc. Web admin dùng màn hình đăng nhập và session cookie; API thao tác admin vẫn hỗ trợ HTTP Basic. Trước khi đưa lên Internet, bắt buộc đổi `ADMIN_PASSWORD`, `SESSION_SECRET`, đặt HTTPS và giới hạn `allow_origins` trong `backend/app/main.py` về domain thật.

Với production nhiều người dùng, nên tách `process_chapter` sang Celery/RQ + Redis; bản MVP hiện chạy background task ngay trong tiến trình API để cài đặt và vận hành đơn giản.

> Chỉ tải lên và chuyển đổi nội dung mà bạn có quyền sử dụng.
