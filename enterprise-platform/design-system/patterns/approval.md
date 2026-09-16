# Pattern: Approval Workflow
## Mô tả
Giao diện dành cho các quy trình phê duyệt đa cấp.

## Use Cases
Duyệt nghỉ phép, mua sắm thiết bị, phát hành tài liệu.

## Anatomy (các phần cấu thành)
- Header: Thông tin chung của ticket.
- Status Badge: Đang chờ duyệt, Đã duyệt, Từ chối.
- Timeline: Lịch sử các bước duyệt.
- Action Panel: Nút Approve/Reject và ô nhập lý do.

## Flow / Interaction Design
1. Reviewer mở chi tiết ticket.
2. Xem timeline để biết ai đã duyệt.
3. Nhập comment và bấm Duyệt/Từ chối.
4. Ticket chuyển trạng thái, trigger thông báo.

## Components sử dụng
Steps/Timeline, Card, Button, Input.TextArea.

## Code Example
```jsx
<Row>
  <Col span={16}><TicketDetail /></Col>
  <Col span={8}>
    <Timeline items={approvalHistory} />
    <ApprovalActions onApprove={approve} onReject={reject} />
  </Col>
</Row>
```

## Variations
- Mass Approval (Duyệt hàng loạt từ bảng).

## Accessibility
Đảm bảo ô nhập lý do dễ dàng focus khi chọn Reject.
