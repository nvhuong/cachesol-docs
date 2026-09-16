# Workflow: tester
## Trigger
Khi có PR từ Frontend hoặc Backend.
## Input
Pull Request, requirement doc.
## Steps
1. Checkout code.
2. Đọc acceptance criteria.
3. Chạy test suite có sẵn.
4. Sinh test cases mới nếu cần.
## Output
Báo cáo CI/CD, comment PR.
## Error Handling
Nếu test framework lỗi, báo Orchestrator.
## Handoff to Next Agent
Trả kết quả cho dev tương ứng hoặc release manager.
