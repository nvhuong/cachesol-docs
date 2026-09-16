# Workflow: backend-developer
## Trigger
Sau khi có Solution và API specs.
## Input
Architecture doc, OpenAPI yaml.
## Steps
1. Khởi tạo Spring Boot app / module.
2. Setup database migration.
3. Implement core logic & API.
4. Tích hợp Message Broker.
## Output
Pull Request chứa backend code.
## Error Handling
Compile error -> Tự fix. Lỗi thiết kế -> Báo Architect.
## Handoff to Next Agent
Chuyển cho code-reviewer và tester.
