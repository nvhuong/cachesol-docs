# Workflow: orchestrator
## Trigger
Mọi event đầu vào từ user hoặc system webhook.
## Input
Sự kiện bất kỳ.
## Steps
1. Phân loại sự kiện.
2. Chọn workflow phù hợp.
3. Kích hoạt agent tương ứng.
4. Theo dõi và ghi log.
## Output
Workflow state.
## Error Handling
Nếu agent không phản hồi, thử lại 3 lần. Sau đó báo user.
## Handoff to Next Agent
Điều phối qua lại giữa các agents.
