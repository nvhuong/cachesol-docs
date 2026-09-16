# Workflow: code-reviewer
## Trigger
Khi một PR được mở hoặc cập nhật.
## Input
Pull request diff.
## Steps
1. Scan tĩnh mã nguồn.
2. Review logic kinh doanh và security.
3. Sinh comments.
## Output
Review decision.
## Error Handling
Nếu PR quá lớn, yêu cầu dev chia nhỏ.
## Handoff to Next Agent
Developer sửa code hoặc Orchestrator merge code.
