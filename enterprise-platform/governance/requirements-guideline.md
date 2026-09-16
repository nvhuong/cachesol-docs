# Hướng dẫn Quản lý Yêu cầu (Requirements Guideline)

## 1. Mục đích
Chuẩn hóa cách thu thập, lưu trữ và chuyển hóa yêu cầu nghiệp vụ thành tài liệu có thể triển khai (API, UI, code, test) trong Enterprise Platform.

## 2. Nguồn đầu vào
Mỗi tính năng miniapp **bắt buộc** có thư mục:

```text
applications/<miniapp>/requirement/<feature-id>/
├── requirement.txt     # Mô tả thô từ stakeholder
└── images/             # Wireframe, mockup, screenshot (png/jpg/webp)
```

## 3. Nội dung tối thiểu của `requirement.txt`

```text
FEATURE_ID: employee-profile
MINIAPP: hrm
TITLE: Quản lý hồ sơ nhân viên
OWNER: <tên / team>
PRIORITY: High | Medium | Low

## Mục tiêu
<1-3 câu>

## Người dùng
- Role A: ...
- Role B: ...

## Luồng chính (Happy path)
1. ...
2. ...

## Luồng phụ / Lỗi
- ...

## Màn hình / Ảnh tham chiếu
- images/01-list.png — Danh sách hồ sơ
- images/02-detail.png — Chi tiết hồ sơ

## Quy tắc nghiệp vụ
- BR-01: ...

## Ngoài phạm vi (Out of scope)
- ...

## Ghi chú
- ...
```

## 4. Quy tắc ảnh
- Đặt tên `NN-mô-tả-ngắn.ext` (vd: `01-list.png`, `02-create-form.png`).
- Mỗi ảnh được nhắc trong `requirement.txt`.
- Không nhúng base64 vào txt; chỉ đường dẫn tương đối.
- Định dạng ưu tiên: PNG hoặc WebP.

## 5. Output của Business Analyst
Từ `requirement.txt` + `images/`, BA sinh `requirement-doc.md` **cùng thư mục feature**, gồm:
- Epics / Features / User Stories
- Acceptance Criteria (Given-When-Then)
- NFR (performance, security, a11y)
- Traceability: map story → ảnh → màn hình UI

## 6. Checklist trước khi chuyển Architect
- [ ] `requirement.txt` đủ mục 3
- [ ] Có ít nhất 1 ảnh hoặc mô tả UI rõ nếu không có ảnh
- [ ] `requirement-doc.md` có ≥ 3 Acceptance Criteria
- [ ] Đã cập nhật `requirement/_index.md`
- [ ] Không còn điểm mơ hồ chưa hỏi lại stakeholder (hoặc đã ghi Assumptions)

## 7. Tham chiếu
- [FEATURE-LIFECYCLE.md](../FEATURE-LIFECYCLE.md)
- [skills/enterprise/requirement-analysis](../skills/enterprise/requirement-analysis/skill.md)
- [agents/business-analyst/system-prompt.md](../agents/business-analyst/system-prompt.md)
