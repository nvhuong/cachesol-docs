# Skill: Testing (tổng hợp)

## Alias
Gọi các skill testing chi tiết theo loại:

| Loại | Path |
|------|------|
| Unit | `skills/testing/unit-test` |
| Integration | `skills/testing/integration-test` |
| E2E | `skills/testing/e2e-test` |
| Visual | `skills/testing/visual-test` |

## Mục tiêu
Sinh test cases + script + `test-report.md` cho feature miniapp.

## Input
- `requirement-doc.md`
- `api-spec.yaml`
- Source `frontend/` + `backend/`

## Output
- `applications/<miniapp>/tests/<feature-id>/test-cases.md`
- `applications/<miniapp>/tests/<feature-id>/test-report.md`
- Code test tương ứng

## Checklist
- [ ] Cover toàn bộ Acceptance Criteria
- [ ] Coverage đạt `governance/quality/testing-standard.md`
- [ ] Báo cáo ghi đúng path feature

## Tham chiếu
- [FEATURE-LIFECYCLE.md](../../../FEATURE-LIFECYCLE.md)
- [testing-standard.md](../../../governance/quality/testing-standard.md)
