# File Service
## Mô tả & Trách nhiệm
Quản lý upload, download, metadata và phân quyền file. Cung cấp S3-compatible interface hoặc wrapper.

## Bounded Context
File Metadata, Folder, Storage Provider Config.

## Domain Events
### Published Events
- `FileUploadedEvent`
- `FileDeletedEvent`
### Consumed Events
- -

## API Overview
- `POST /api/v1/files/upload`
- `GET /api/v1/files/download/{id}`
- `GET /api/v1/files/presigned-url`

## Dependencies
- PostgreSQL (Lưu metadata).
- AWS S3, MinIO, hoặc FileSystem local.

## Database Schema (overview)
- `files`, `folders`

## Configuration
- `storage.provider`: s3 / minio / local
- S3 Bucket Name, Access Key.

## Getting Started
Dùng MinIO container (`docker-compose up minio`) cho môi trường dev.
