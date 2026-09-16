# Approval Service

## Vai trò

`approval` là service **phê duyệt tập trung** (centralized approval engine) cho mọi nghiệp vụ của platform. Hỗ trợ:

- **Sequential** — duyệt tuần tự (step 1 → step 2 → step 3).
- **Parallel** — duyệt song song nhiều người trong 1 step (any/all/quorum).
- **Mixed (nested)** — parallel step có thể chứa sequential sub-steps, hoặc sequential chain có thể chứa parallel group.

Mỗi **approval type** có cấu hình **callback API (service-api)** riêng — khi approval cuối cùng **APPROVED**, approval service gọi service-api đó (async) để service nghiệp vụ thực thi hành động (ví dụ: SalesService.completeOrder, HRMService.activateLeave).

## Bounded Context

| # | BC | Vai trò |
|---|----|---------|
| 1 | **Approval Types** | Định nghĩa loại duyệt (LEAVE_REQUEST, ORDER_DISCOUNT, ...) — gắn schema steps (sequential/parallel/mixed) + callback URL |
| 2 | **Approval Requests** | Một phiên duyệt cụ thể (1 nhân viên xin nghỉ phép → request #123) |
| 3 | **Approval Steps** | Steps trong request, có state machine (PENDING → APPROVED/REJECTED/SKIPPED) |
| 4 | **Approval Histories** | Audit trail toàn bộ hành động (ai duyệt, lúc nào, comment) |
| 5 | **Approval Callbacks** | Log callback đã fire (URL, request body, response, retry count) |
| 6 | **Approver Rules** | Engine rule xác định ai là approver (org manager, role, dynamic expression) |

## Schema layout

```
cachesol_platform (1 PostgreSQL DB)
├── schema: public
│   └── approval_type_templates   ← catalog approval type mặc định (cross-tenant, có sẵn)
│
└── schema: tenant_<slug>_approval
    ├── approval_types                  ← cấu hình per-tenant (override hoặc custom)
    ├── approval_type_steps             ← definition steps cho mỗi approval type (tree structure)
    ├── approval_type_callbacks         ← callback config per approval type
    ├── approval_requests               ← 1 instance phiên duyệt
    ├── approval_steps                  ← runtime state của từng step trong request
    ├── approval_histories              ← audit trail
    ├── approval_callbacks              ← log callback đã fire (retry, success/fail)
    └── flyway_schema_history
```

---

## 1. Approval Types (BC #1)

### 1.1 Template catalog (schema `public`)

```sql
CREATE TABLE approval_type_templates (
    id            UUID PRIMARY KEY,
    code          VARCHAR(100) UNIQUE NOT NULL,       -- 'LEAVE_REQUEST', 'ORDER_DISCOUNT'
    name          VARCHAR(255) NOT NULL,
    description   TEXT NULL,
    default_steps JSONB NOT NULL,                     -- definition mặc định (sequence tree)
    category      VARCHAR(50) NULL,                   -- 'HRM', 'SALES', 'ERP'
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL
);
```

Seed mặc định:

```sql
INSERT INTO approval_type_templates (code, name, default_steps, category) VALUES
('LEAVE_REQUEST', 'Đơn xin nghỉ phép',
 '{
   "type": "sequential",
   "steps": [
     {"type":"single","approverRule":"DIRECT_MANAGER","slaHours":48},
     {"type":"parallel","rule":"any","approversRule":"ROLE_HR_MANAGER","slaHours":24}
   ]
 }'::jsonb, 'HRM'),

('ORDER_DISCOUNT', 'Đơn xin giảm giá đơn hàng',
 '{
   "type": "mixed",
   "steps": [
     {"type":"single","approverRule":"DIRECT_MANAGER","slaHours":24},
     {"type":"parallel","rule":"all","approvers":[
        {"approverRule":"SALES_DIRECTOR"},
        {"approverRule":"FINANCE_CONTROLLER"}
     ],"slaHours":48}
   ]
 }'::jsonb, 'SALES'),

('RESIGNATION', 'Đơn xin nghỉ việc',
 '{
   "type": "sequential",
   "steps": [
     {"type":"single","approverRule":"DIRECT_MANAGER","slaHours":48},
     {"type":"single","approverRule":"DEPARTMENT_HEAD","slaHours":48},
     {"type":"single","approverRule":"HR_DIRECTOR","slaHours":72}
   ]
 }'::jsonb, 'HRM');
```

### 1.2 Per-tenant approval type (schema `tenant_<slug>_approval`)

```sql
CREATE TABLE approval_types (
    id              UUID PRIMARY KEY,
    code            VARCHAR(100) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    template_id     UUID NULL REFERENCES public.approval_type_templates(id),
    steps_definition JSONB NOT NULL,                  -- copy + có thể override từ template
    callback_config JSONB NULL,                        -- { successUrl, failureUrl, method, headers, ... }
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL,
    UNIQUE (code)
);

CREATE TABLE approval_type_callbacks (
    id                  UUID PRIMARY KEY,
    approval_type_id    UUID NOT NULL REFERENCES approval_types(id) ON DELETE CASCADE,
    callback_name       VARCHAR(100) NOT NULL,         -- 'onApproved', 'onRejected'
    http_method         VARCHAR(10) NOT NULL DEFAULT 'POST',
    target_url          TEXT NOT NULL,                 -- 'http://sales-service/service-api/v1/orders/{orderId}/complete'
    headers             JSONB NOT NULL DEFAULT '{}'::jsonb,
    payload_template    JSONB NOT NULL DEFAULT '{}'::jsonb,  -- template với placeholder {{request.id}}, {{request.payload}},...
    retry_max           SMALLINT NOT NULL DEFAULT 5,
    retry_backoff_ms    INTEGER[] NOT NULL DEFAULT '{1000,5000,30000,60000,300000}',
    timeout_ms          INTEGER NOT NULL DEFAULT 30000,
    sign_secret         TEXT NULL,                     -- HMAC secret để ký request (verify ở callee)
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (approval_type_id, callback_name)
);
```

### 1.3 Steps Definition (JSONB tree structure)

Mỗi approval type có 1 **steps_definition** là JSONB tree. 3 node types:

```typescript
type StepNode =
  | { type: "single", approverRule: string, slaHours: number, label?: string }
  | { type: "parallel", rule: "any" | "all" | "quorum", quorumCount?: number,
      approversRule?: string, approvers?: { approverRule: string }[],
      slaHours: number, label?: string }
  | { type: "sequential", steps: StepNode[], slaHours?: number, label?: string };
```

**Ví dụ mixed (phức tạp):**

```json
{
  "type": "sequential",
  "label": "Quy trình duyệt ngân sách Q4",
  "steps": [
    {
      "type": "single",
      "label": "Trưởng phòng duyệt",
      "approverRule": "DIRECT_MANAGER",
      "slaHours": 24
    },
    {
      "type": "parallel",
      "label": "Ban giám đốc + Tài chính duyệt song song",
      "rule": "all",
      "approvers": [
        { "approverRule": "GENERAL_DIRECTOR" },
        { "approverRule": "FINANCE_DIRECTOR" }
      ],
      "slaHours": 48
    },
    {
      "type": "sequential",
      "label": "Sau CFO duyệt, CEO phải ký",
      "steps": [
        { "type": "single", "approverRule": "CFO", "slaHours": 24 },
        { "type": "single", "approverRule": "CEO", "slaHours": 48 }
      ]
    }
  ]
}
```

### API

```
# CLIENT-API
GET    /client-api/v1/approval-types                          ← List approval types
POST   /client-api/v1/approval-types                          ← Tạo mới (hoặc import từ template)
GET    /client-api/v1/approval-types/{id}
PATCH  /client-api/v1/approval-types/{id}                     ← Update steps / callback config
DELETE /client-api/v1/approval-types/{id}

GET    /client-api/v1/approval-types/{id}/callbacks
POST   /client-api/v1/approval-types/{id}/callbacks
PATCH  /client-api/v1/approval-types/{id}/callbacks/{cbId}
DELETE /client-api/v1/approval-types/{id}/callbacks/{cbId}

GET    /client-api/v1/approval-types/templates                ← List public templates
POST   /client-api/v1/approval-types/import/{templateId}      ← Import từ template

# SERVICE-API (service khác tạo approval)
POST   /service-api/v1/approval-types/{code}/resolve-approvers ← Test rule resolve approvers
GET    /service-api/v1/approval-types/{code}/schema           ← Lấy steps_definition schema (FE render)
```

---

## 2. Approval Requests (BC #2)

Một instance phiên duyệt (1 đơn nghỉ phép, 1 đơn giảm giá, ...). Được tạo bởi service khác hoặc user trực tiếp.

```sql
CREATE TABLE approval_requests (
    id                  UUID PRIMARY KEY,
    approval_type_id    UUID NOT NULL REFERENCES approval_types(id),
    requester_user_id   UUID NOT NULL,                       -- keycloak_user_id của người tạo
    title               VARCHAR(255) NOT NULL,
    payload             JSONB NOT NULL DEFAULT '{}'::jsonb,  -- business payload (leave_days, order_id,...)
    current_step_index  SMALLINT NOT NULL DEFAULT 0,        -- step hiện tại trong steps_definition
    status              VARCHAR(20) NOT NULL,                -- PENDING | APPROVED | REJECTED | CANCELLED | EXPIRED
    final_decision_at   TIMESTAMPTZ NULL,
    final_decision_by   UUID NULL,
    metadata            JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at          TIMESTAMPTZ NOT NULL,
    updated_at          TIMESTAMPTZ NOT NULL,
    expires_at          TIMESTAMPTZ NULL
);
CREATE INDEX idx_ar_type      ON approval_requests(approval_type_id);
CREATE INDEX idx_ar_requester ON approval_requests(requester_user_id);
CREATE INDEX idx_ar_status    ON approval_requests(status);
CREATE INDEX idx_ar_created   ON approval_requests(created_at DESC);
```

### API

```
# CLIENT-API
GET    /client-api/v1/approval-requests                      ← List (filter theo requester/approver/status/type)
GET    /client-api/v1/approval-requests/{id}
POST   /client-api/v1/approval-requests/{id}/cancel          ← Requester tự huỷ (chỉ khi PENDING)
GET    /client-api/v1/approval-requests/{id}/histories       ← Audit trail
GET    /client-api/v1/approval-requests/{id}/steps           ← State tree hiện tại

# INBOX — Approver
GET    /client-api/v1/approval-inbox                          ← Tất cả approval chờ mình duyệt
GET    /client-api/v1/approval-inbox/count                    ← Badge count (header FE)

# SERVICE-API
POST   /service-api/v1/approval-requests                      ← Service tạo approval (HRM, Sales,...)
GET    /service-api/v1/approval-requests/{id}
GET    /service-api/v1/approval-requests?externalRef=xxx     ← Tra cứu theo externalRef
```

### Tạo approval từ service khác

```java
// HRM service gọi khi user tạo đơn nghỉ phép
@PostMapping("/leaves")
public LeaveDto create(@RequestBody CreateLeaveRequest req) {
    Leave leave = leaveService.create(req);

    approvalClient.post(
        "/service-api/v1/approval-requests",
        new CreateApprovalRequest()
            .approvalTypeCode("LEAVE_REQUEST")
            .requesterUserId(SecurityContext.getCurrentUserId())
            .title("Đơn nghỉ phép " + req.days + " ngày")
            .payload(Map.of(
                "leaveId", leave.getId(),
                "days", req.days,
                "fromDate", req.fromDate,
                "toDate", req.toDate
            ))
            .metadata(Map.of("externalRef", "leave_" + leave.getId()))
    );
    return toDto(leave);
}
```

---

## 3. Approval Steps (BC #3) — Runtime State

```sql
CREATE TABLE approval_steps (
    id                  UUID PRIMARY KEY,
    request_id          UUID NOT NULL REFERENCES approval_requests(id) ON DELETE CASCADE,
    step_path           VARCHAR(100) NOT NULL,                -- '0.1.0' (sequential.step.parallel.substep)
    step_index          INTEGER NOT NULL,                    -- thứ tự trong flat list (cho query)
    step_type           VARCHAR(20) NOT NULL,                 -- SINGLE | PARALLEL | SEQUENTIAL_GROUP
    step_label          VARCHAR(255) NULL,
    approver_rule       VARCHAR(100) NULL,                    -- 'DIRECT_MANAGER', 'ROLE_HR_MANAGER'
    resolved_approvers  JSONB NOT NULL DEFAULT '[]'::jsonb,   -- [{userId, fullName, email}, ...]
    parallel_rule       VARCHAR(20) NULL,                     -- 'any' | 'all' | 'quorum'
    quorum_count        SMALLINT NULL,                        -- M (cho quorum)
    sla_hours           INTEGER NULL,
    status              VARCHAR(20) NOT NULL,                 -- PENDING | IN_PROGRESS | APPROVED | REJECTED | SKIPPED | EXPIRED
    decision_at         TIMESTAMPTZ NULL,
    decision_by         UUID NULL,
    decision_comment    TEXT NULL,
    deadline_at         TIMESTAMPTZ NULL,                     -- now() + sla_hours (tính lúc start)
    started_at          TIMESTAMPTZ NULL,
    metadata            JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at          TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_as_request ON approval_steps(request_id);
CREATE INDEX idx_as_status  ON approval_steps(status);
CREATE INDEX idx_as_deadline ON approval_steps(deadline_at) WHERE status = 'IN_PROGRESS';
```

### Step State Machine

```
                    ┌──────────┐
                    │ PENDING  │ (mới tạo, chưa có approver resolve)
                    └─────┬────┘
                          │ approvers resolved, gửi notification
                          ▼
                    ┌────────────┐
                    │IN_PROGRESS │ (1+ approver chưa quyết định)
                    └─┬──────┬───┘
                      │      │
        ┌─────────────┘      └─────────────┐
        ▼                                  ▼
   ┌──────────┐                       ┌──────────┐
   │APPROVED  │                       │ REJECTED │
   └──────────┘                       └──────────┘
        │                                  │
        │ (PARALLEL any/all/quorum)        │
        ▼                                  ▼
   next step                            final REJECTED
```

### Parallel Rule Resolution

| Rule | Ý nghĩa |
|------|---------|
| **any** | 1 approver approve → step APPROVED, các approver còn lại SKIPPED |
| **all** | Tất cả approver approve → step APPROVED |
| **quorum(M)** | M approver approve → step APPROVED |

### Sequential + Parallel Combination (Mixed)

```
Request steps_definition:
[
  single(manager),                      ← index 0
  parallel(any, [director, cfo]),       ← index 1
  single(ceo)                           ← index 2
]

Flow:
- tạo request → start step 0
- step 0 APPROVED → start step 1
- step 1 mở 2 sub-task (director, cfo)
  - director APPROVED → any → step 1 APPROVED → SKIPPED cfo
- step 2 mở
- step 2 APPROVED → final APPROVED → FIRE callback
```

Nested case:

```
Request steps_definition:
[
  parallel(all, [hr_director, finance_director]),   ← index 0
  sequential([                                        ← index 1
    single(cfo),
    single(ceo)
  ])
]

Flow:
- step 0: cả 2 phải approve (all)
- step 0 APPROVED → start step 1
- step 1.0 single(cfo) → APPROVED
- step 1.1 single(ceo) → APPROVED → final
```

### API

```
# CLIENT-API — Approver actions
POST   /client-api/v1/approval-steps/{stepId}/approve        ← Approve
POST   /client-api/v1/approval-steps/{stepId}/reject         ← Reject (kèm lý do)
POST   /client-api/v1/approval-steps/{stepId}/delegate       ← Uỷ quyền cho người khác
POST   /client-api/v1/approval-steps/{stepId}/add-comment    ← Thêm comment (kèm file đính kèm)

# CLIENT-API — Requester actions
POST   /client-api/v1/approval-steps/{stepId}/cancel         ← Huỷ step (chỉ requester, khi PENDING/IN_PROGRESS)
POST   /client-api/v1/approval-steps/{stepId}/recall         ← Requester recall (chỉ khi step chưa có ai quyết định)

# SERVICE-API
POST   /service-api/v1/approval-steps/{stepId}/force-decision  ← Admin force (audit log)
```

---

## 4. Approval Histories (BC #4) — Audit Trail

```sql
CREATE TABLE approval_histories (
    id              UUID PRIMARY KEY,
    request_id      UUID NOT NULL REFERENCES approval_requests(id) ON DELETE CASCADE,
    step_id         UUID NULL REFERENCES approval_steps(id),
    actor_user_id   UUID NOT NULL,
    action          VARCHAR(30) NOT NULL,        -- 'CREATED', 'APPROVED', 'REJECTED', 'DELEGATED', 'COMMENT', 'CANCELLED', 'EXPIRED', 'RECALLED', 'FORCED'
    comment         TEXT NULL,
    from_status     VARCHAR(20) NULL,
    to_status       VARCHAR(20) NULL,
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_ah_request ON approval_histories(request_id);
CREATE INDEX idx_ah_actor   ON approval_histories(actor_user_id);
CREATE INDEX idx_ah_action  ON approval_histories(action);
```

---

## 5. Approval Callbacks (BC #5) — Outbound Webhook

Khi request đạt **APPROVED** (final), approval service gọi callback config trong `approval_type_callbacks`.

```sql
CREATE TABLE approval_callbacks (
    id                  UUID PRIMARY KEY,
    request_id          UUID NOT NULL REFERENCES approval_requests(id),
    callback_id         UUID NOT NULL REFERENCES approval_type_callbacks(id),
    callback_name       VARCHAR(100) NOT NULL,
    http_method         VARCHAR(10) NOT NULL,
    target_url          TEXT NOT NULL,
    request_payload     JSONB NOT NULL,
    response_status     INTEGER NULL,
    response_body       TEXT NULL,
    status              VARCHAR(20) NOT NULL,                 -- PENDING | SUCCESS | FAILED | EXHAUSTED
    attempt_count       SMALLINT NOT NULL DEFAULT 0,
    next_retry_at       TIMESTAMPTZ NULL,
    last_error          TEXT NULL,
    completed_at        TIMESTAMPTZ NULL,
    created_at          TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_ac_request     ON approval_callbacks(request_id);
CREATE INDEX idx_ac_status      ON approval_callbacks(status);
CREATE INDEX idx_ac_next_retry  ON approval_callbacks(next_retry_at) WHERE status = 'FAILED';
```

### Callback Payload (gửi đi)

```json
{
  "requestId": "uuid",
  "approvalTypeCode": "LEAVE_REQUEST",
  "decision": "APPROVED",
  "finalDecisionBy": "uuid",
  "finalDecisionAt": "2026-09-17T10:00:00Z",
  "payload": {                          -- payload từ request ban đầu
    "leaveId": "uuid",
    "days": 3,
    "fromDate": "2026-09-20",
    "toDate": "2026-09-22"
  },
  "approvalChain": [                    -- lịch sử duyệt
    {"step":0,"approver":"uuid","decision":"APPROVED","at":"..."},
    {"step":1,"approver":"uuid","decision":"APPROVED","at":"..."}
  ],
  "metadata": {}
}
```

### Security (HMAC Signature)

Approval service ký mỗi callback request:

```
Headers:
  X-Approval-Signature: sha256=<HMAC-SHA256(secret, body)>
  X-Approval-Timestamp: <unix_ts>
  X-Approval-Request-Id: <requestId>
  X-Approval-Retry-Count: <attempt>
```

Callee verify:
```java
boolean valid = hmacSha256(secret, body).equals(receivedSignature)
                && Math.abs(now - timestamp) < 300_000;  // tránh replay
```

### Retry Policy

- Default: 5 lần với backoff `[1s, 5s, 30s, 1min, 5min]`.
- Retry khi: timeout, 5xx, connection refused.
- Không retry khi: 4xx (client error — fix trong code).
- Sau khi exhausted → publish `ApprovalCallbackExhaustedEvent` để admin xử lý.

### API

```
# CLIENT-API
GET    /client-api/v1/approval-callbacks?requestId=xxx         ← Xem log callback của 1 request
POST   /client-api/v1/approval-callbacks/{id}/retry            ← Manual retry (admin)

# INTEGRATION-API (callee return)
# (callee nhận callback ở service-api của họ, KHÔNG có callback ngược về approval)
```

---

## 6. Approver Rules (BC #6)

Engine xác định approvers cho step. Có nhiều loại:

| Rule | Ý nghĩa | Ví dụ |
|------|---------|-------|
| `DIRECT_MANAGER` | Manager trực tiếp của requester (qua tenant-manager `employee_assignments.reports_to`) | |
| `DEPARTMENT_HEAD` | Head của org department requester | |
| `ROLE_X` | Tất cả user có role X (qua tenant-manager `user_app_roles`) | `ROLE_HR_MANAGER` |
| `USER_X` | User cụ thể | UUID |
| `DYNAMIC_EXPRESSION` | Expression SpEL/JEXL | `${payload.amount > 1000000 ? 'CFO' : 'MANAGER'}` |
| `FIXED_LIST` | List approver cứng | `[uuid1, uuid2]` |

### Resolution

```java
@Service
public class ApproverRuleResolver {

    public List<UUID> resolve(String rule, ApprovalRequest req) {
        return switch (rule) {
            case "DIRECT_MANAGER" -> tenantManagerClient
                .get("/service-api/v1/employees/" + req.getRequesterUserId() + "/manager", UserDto.class)
                .map(UserDto::getId).stream().toList();
            case "ROLE_HR_MANAGER" -> tenantManagerClient
                .get("/service-api/v1/users/by-role/ROLE_HR_MANAGER", UserListDto.class)
                .users().stream().map(UserDto::getId).toList();
            case "DYNAMIC_EXPRESSION" -> expressionEngine.evaluate(rule, req);
            // ...
        };
    }
}
```

Resolution cached trong `approval_steps.resolved_approvers` (JSONB) để tránh resolve lại.

---

## Approval Engine — Orchestration

```java
@Service
public class ApprovalOrchestrator {

    public void onStepDecision(UUID stepId, Decision decision) {
        ApprovalStep step = stepRepo.findById(stepId);
        ApprovalRequest request = requestRepo.findById(step.getRequestId());

        // 1. Apply decision vào step
        step.apply(decision);    // PENDING → IN_PROGRESS → APPROVED/REJECTED

        // 2. Nếu step REJECTED → request REJECTED
        if (step.getStatus() == REJECTED) {
            request.setStatus(REJECTED);
            request.finalize();
            historyRepo.log(REJECTED, ...);
            kafka.publish("ApprovalRejectedEvent", ...);
            return;
        }

        // 3. Nếu step APPROVED → check parallel rule
        if (step.getStatus() == APPROVED) {
            if (step.isParallel()) {
                List<ApprovalStep> siblings = stepRepo.findParallelSiblings(step);
                if (!allSiblingsDone(siblings)) return;
                // Parallel group done
                markParallelGroupComplete(step);
            }

            // 4. Move to next step trong steps_definition
            StepNode nextNode = nextStepNode(request.getStepsDefinition(), step.getStepIndex());
            if (nextNode == null) {
                // 5. Final approved
                request.setStatus(APPROVED);
                request.finalize();
                historyRepo.log(APPROVED, ...);
                kafka.publish("ApprovalApprovedEvent", ...);

                // 6. FIRE CALLBACK
                fireCallbacks(request);
            } else {
                startStep(request, nextNode);
            }
        }
    }

    private void fireCallbacks(ApprovalRequest request) {
        List<ApprovalTypeCallback> callbacks = callbackRepo
            .findByApprovalTypeIdAndCallbackName(request.getApprovalTypeId(), "onApproved");
        for (ApprovalTypeCallback cb : callbacks) {
            if (!cb.getIsActive()) continue;
            ApprovalCallback log = new ApprovalCallback();
            log.setRequestId(request.getId());
            log.setCallbackId(cb.getId());
            log.setHttpMethod(cb.getHttpMethod());
            log.setTargetUrl(cb.getTargetUrl());
            log.setRequestPayload(buildPayload(request, cb));
            log.setStatus(PENDING);
            callbackLogRepo.save(log);

            // Async send via Kafka → callback-worker
            kafka.publish("ApprovalCallbackRequested", log);
        }
    }
}
```

---

## Dependencies

| Dependency | Vai trò |
|------------|---------|
| **Keycloak** | Verify JWT (qua iam-service) |
| **tenant-manager** | Resolve approver rules (DIRECT_MANAGER, ROLE_X) |
| **workflow-service** | Listen `UserTaskCreatedEvent` (nếu workflow dùng approval) |
| **Kafka** | Publish events, async callback retry |
| **Redis** | Cache approval type definitions, approver resolution |
| **social-integration** | Gửi notification cho approver (email/push/in-app) |

## Domain Events Published

```
ApprovalRequestedEvent          (request mới tạo)
ApprovalStepActivatedEvent      (step mới active → approver nhận notification)
ApprovalStepApprovedEvent
ApprovalStepRejectedEvent
ApprovalStepDelegatedEvent
ApprovalApprovedEvent           (FINAL)
ApprovalRejectedEvent           (FINAL)
ApprovalCancelledEvent          (requester huỷ)
ApprovalExpiredEvent            (SLA timeout)
ApprovalCommentAddedEvent
ApprovalCallbackRequestedEvent
ApprovalCallbackSucceededEvent
ApprovalCallbackFailedEvent
ApprovalCallbackExhaustedEvent
```

## Domain Events Consumed

```
UserTaskCreatedEvent            (từ workflow-service — nếu workflow có user-task = approval)
```

## API tổng quan (4 prefix pattern)

```
# CLIENT-API — Web/Mobile (user JWT)
/client-api/v1/approval-types
/client-api/v1/approval-types/{id}
/client-api/v1/approval-types/{id}/callbacks
/client-api/v1/approval-types/templates
/client-api/v1/approval-types/import/{templateId}

/client-api/v1/approval-requests
/client-api/v1/approval-requests/{id}
/client-api/v1/approval-requests/{id}/cancel
/client-api/v1/approval-requests/{id}/histories
/client-api/v1/approval-requests/{id}/steps

/client-api/v1/approval-inbox              ← Approver xem việc cần duyệt
/client-api/v1/approval-inbox/count

/client-api/v1/approval-steps/{stepId}/approve
/client-api/v1/approval-steps/{stepId}/reject
/client-api/v1/approval-steps/{stepId}/delegate
/client-api/v1/approval-steps/{stepId}/add-comment

/client-api/v1/approval-callbacks?requestId=xxx
/client-api/v1/approval-callbacks/{id}/retry

# SERVICE-API — service-to-service (service JWT)
/service-api/v1/approval-types/{code}/resolve-approvers
/service-api/v1/approval-types/{code}/schema
/service-api/v1/approval-requests          ← Service tạo approval
/service-api/v1/approval-requests/{id}
/service-api/v1/approval-steps/{stepId}/force-decision

# INTEGRATION-API — (callback nhận từ approval service gọi đến, không phải gọi tới approval)
# (callee expose service-api của riêng họ, ví dụ:
#   POST /service-api/v1/orders/{id}/complete  ← Sales service nhận callback từ approval)

# PUBLIC-API
/public-api/v1/health
```

## Quy tắc quan trọng

1. **Steps definition = tree JSONB**, lưu immutable trong `approval_types.steps_definition`. Runtime expand thành flat list các `approval_steps` records.
2. **Approver resolve 1 lần**, cache trong `approval_steps.resolved_approvers` (tránh thay đổi manager giữa chừng gây inconsistency).
3. **SLA timeout**: scheduler scan `approval_steps WHERE status='IN_PROGRESS' AND deadline_at < now()` → auto REJECTED + log EXPIRED.
4. **Callback HMAC**: mọi callback gửi đi PHẢI ký HMAC-SHA256 với `sign_secret` của callback config. Callee PHẢI verify trước khi xử lý.
5. **Idempotency**: callback payload chứa `requestId` → callee check đã xử lý chưa trước khi thực thi (tránh retry double-fire).
6. **Reject = final**: 1 step REJECTED → toàn bộ request REJECTED. Không có "vòng lại".
7. **Delegate = chuyển approver**: tạo step mới với approver mới, giữ step cũ SKIPPED. Audit đầy đủ.
8. **Force decision**: chỉ admin mới force được, audit log bắt buộc.

## Xem thêm

- Workflow Service (BPMN-lite engine): [`../workflow/README.md`](../workflow/README.md)
- Tenant Manager (resolve approver): [`../tenant-manager/README.md`](../tenant-manager/README.md)
- IAM JWT verify: [`../iam/README.md`](../iam/README.md)
- Social Integration (gửi notification cho approver): [`../social-integration/README.md`](../social-integration/README.md)
- Multi-tenant: [`../../../governance/architecture/multi-tenant.md`](../../../governance/architecture/multi-tenant.md)
- API patterns: [`../../../governance/architecture/api-patterns.md`](../../../governance/architecture/api-patterns.md)
