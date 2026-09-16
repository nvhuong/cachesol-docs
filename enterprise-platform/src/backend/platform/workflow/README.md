# Workflow Service

## Vai trò

`workflow` là BPMN-lite engine cho phép:

1. **Define** quy trình nghiệp vụ (process definition) qua BPMN 2.0 XML hoặc JSON DSL.
2. **Start** process instance và track state.
3. **Orchestrate** các bước: User Task, Service Task, Gateway, Timer, ...
4. **Tích hợp platform items** — các task riêng của nền tảng cachesol (gọi approval-service, social-integration, feature-flag, ...).
5. **Template mẫu** — seed 5 workflow phổ biến nhất qua Liquibase (Leave Request, Order Discount, Onboarding, Reimbursement, Resignation).

> **Quan trọng:** Workflow Service chỉ orchestrate. **Mọi logic nghiệp vụ** thực sự chạy ở các service khác (HRM, Sales, Approval, Social Integration). Workflow chỉ gọi qua service-api.

## Bounded Context

| # | BC | Vai trò |
|---|----|---------|
| 1 | **Process Definition** | BPMN XML + template registry (5 mặc định) |
| 2 | **Process Instance** | Runtime state — 1 instance của process definition |
| 3 | **Execution Log** | Audit trail từng bước (BPMN history) |
| 4 | **User Task** | Task chờ user (delegate sang approval-service) |
| 5 | **Service Task** | Task tự động gọi HTTP/gRPC/Java |
| 6 | **Timer** | Schedule, deadline, SLA timeout |
| 7 | **Template Library** | 5 template mẫu mặc định (Liquibase seed) |

## Platform-Specific Items (5 loại)

Ngoài BPMN cơ bản, workflow cachesol có 5 platform items đặc thù:

| # | Item | Mô tả | Gọi tới service |
|---|------|--------|------------------|
| 1 | **Approval Task** | Tạo approval request → chờ approver quyết | `approval-service` (`POST /service-api/v1/approval-requests`) |
| 2 | **Notification Task** | Gửi notification đa kênh | `social-integration-service` (`POST /service-api/v1/notifications/send`) |
| 3 | **Feature Flag Gate** | Branch dựa trên flag on/off + strategy | `feature-flag-service` (`POST /service-api/v1/feature-flags/{uid}/check`) |
| 4 | **Entity CRUD Task** | CRUD entity qua service-api (generic) | `*` service tương ứng |
| 5 | **Webhook Task** | HTTP call tới external endpoint | External URL |

## BPMN Cơ bản (giữ nguyên)

```
BPMN 2.0 elements được workflow cachesol hỗ trợ:

Flow Objects:
  - Start Event (None, Message, Timer, Signal)
  - End Event (None, Message, Signal, Error, Terminate)
  - Task (User, Service, Script, Business Rule, Send, Receive)
  - Subprocess (Embedded, Call Activity)
  - Gateway (Exclusive, Parallel, Inclusive, Event-based)

Connecting Objects:
  - Sequence Flow (with conditionExpression)
  - Message Flow
  - Association

Swimlanes:
  - Pool, Lane

Artifacts:
  - Data Object, Data Store
```

---

## Schema layout

```
cachesol_platform (1 PostgreSQL DB)
├── schema: public
│   └── process_definition_templates     ← catalog template mặc định (5 mẫu, Liquibase seed)
│
└── schema: tenant_<slug>_workflow
    ├── process_definitions              ← deployed BPMN definitions per tenant
    ├── process_instances                ← runtime instances
    ├── execution_logs                   ← audit trail
    ├── user_tasks                       ← user task (mirror từ approval khi delegate)
    ├── service_tasks                    ← service task execution log
    ├── timer_jobs                       ← scheduled jobs (deadline, SLA)
    └── flyway_schema_history
```

---

## 1. Process Definition (BC #1)

### 1.1 Templates (schema `public`)

Liquibase seed 5 templates mặc định:

```yaml
# Liquibase changeset: workflow/templates.yml
- LEAVE_REQUEST
- ORDER_DISCOUNT
- ONBOARDING
- REIMBURSEMENT
- RESIGNATION
```

```sql
CREATE TABLE process_definition_templates (
    id              UUID PRIMARY KEY,
    code            VARCHAR(100) UNIQUE NOT NULL,
    name            VARCHAR(255) NOT NULL,
    category        VARCHAR(50) NOT NULL,              -- 'HRM', 'SALES', 'GENERAL'
    bpmn_xml        TEXT NOT NULL,                     -- BPMN 2.0 XML
    description     TEXT NULL,
    icon_url        TEXT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL
);
```

### 1.2 Template mẫu (5 mặc định)

#### Template #1: LEAVE_REQUEST (HRM)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:cachesol="http://cachesol.io/schema/bpmn"
                  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="LEAVE_REQUEST" name="Đơn xin nghỉ phép" isExecutable="true">

    <bpmn:startEvent id="start"/>

    <bpmn:sequenceFlow id="flow1" sourceRef="start" targetRef="check_leave_balance"/>

    <!-- Feature flag gate: nếu flag on → dùng approval mới, off → legacy -->
    <bpmn:serviceTask id="check_leave_balance" name="Check balance"
                      implementation="##cachesol-platform:featureFlagCheck">
      <bpmn:extensionElements>
        <cachesol:featureFlag uid="GLOBAL.HRM.enable_leave_v2" expectedResult="true"/>
      </bpmn:extensionElements>
    </bpmn:serviceTask>

    <bpmn:exclusiveGateway id="gw1" name="V2 enabled?"/>

    <bpmn:sequenceFlow id="flow2" sourceRef="gw1" targetRef="approval_v2">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">
        ${featureFlagResult == 'true'}
      </bpmn:conditionExpression>
    </bpmn:sequenceFlow>

    <bpmn:sequenceFlow id="flow3" sourceRef="gw1" targetRef="approval_legacy">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">
        ${featureFlagResult != 'true'}
      </bpmn:conditionExpression>
    </bpmn:sequenceFlow>

    <!-- New approval flow (gọi approval-service) -->
    <bpmn:serviceTask id="approval_v2" name="Approval (v2)"
                      implementation="##cachesol-platform:approvalRequest">
      <bpmn:extensionElements>
        <cachesol:approval typeCode="LEAVE_REQUEST_V2" timeout="PT48H"/>
      </bpmn:extensionElements>
    </bpmn:serviceTask>

    <!-- Legacy approval -->
    <bpmn:userTask id="approval_legacy" name="Manager duyệt"/>

    <bpmn:sequenceFlow id="flow4" sourceRef="approval_v2" targetRef="notify"/>
    <bpmn:sequenceFlow id="flow5" sourceRef="approval_legacy" targetRef="notify"/>

    <!-- Notification khi approved -->
    <bpmn:serviceTask id="notify" name="Notify employee"
                      implementation="##cachesol-platform:notification">
      <bpmn:extensionElements>
        <cachesol:notification templateCode="LEAVE_APPROVED" channel="IN_APP"/>
      </bpmn:extensionElements>
    </bpmn:serviceTask>

    <bpmn:sequenceFlow id="flow6" sourceRef="notify" targetRef="end"/>
    <bpmn:endEvent id="end"/>
  </bpmn:process>
</bpmn:definitions>
```

#### Template #2: ORDER_DISCOUNT (Sales)

```xml
<bpmn:process id="ORDER_DISCOUNT" name="Đơn xin giảm giá">
  <bpmn:startEvent id="start"/>
  <bpmn:serviceTask id="check_amount" name="Check discount amount"
                    implementation="##cachesol-platform:featureFlagCheck">
    <bpmn:extensionElements>
      <cachesol:featureFlag uid="GLOBAL.SALES.require_approval_above_1m"
                            expectedResult="${order.amount > 1000000}"/>
    </bpmn:extensionElements>
  </bpmn:serviceTask>
  <bpmn:exclusiveGateway id="gw_amount" name="Amount > 1M?"/>
  <bpmn:sequenceFlow id="flow_skip" sourceRef="gw_amount" targetRef="apply_discount">
    <bpmn:conditionExpression>${order.amount &lt;= 1000000}</bpmn:conditionExpression>
  </bpmn:sequenceFlow>
  <bpmn:sequenceFlow id="flow_approve" sourceRef="gw_amount" targetRef="approval">
    <bpmn:conditionExpression>${order.amount &gt; 1000000}</bpmn:conditionExpression>
  </bpmn:sequenceFlow>

  <bpmn:serviceTask id="approval" name="Director approval"
                    implementation="##cachesol-platform:approvalRequest">
    <bpmn:extensionElements>
      <cachesol:approval typeCode="ORDER_DISCOUNT" timeout="PT24H"/>
    </bpmn:extensionElements>
  </bpmn:serviceTask>

  <bpmn:serviceTask id="apply_discount" name="Apply discount"
                    implementation="##WebService">
    <bpmn:extensionElements>
      <cachesol:webhook method="POST"
                        url="http://sales-service/service-api/v1/orders/${order.id}/apply-discount"/>
    </bpmn:extensionElements>
  </bpmn:serviceTask>

  <bpmn:endEvent id="end"/>
</bpmn:process>
```

#### Template #3: ONBOARDING (HRM)

Stages:
1. Create user account (call `tenant-manager` via `entityCRUD`)
2. Assign role `EMPLOYEE` (call `tenant-manager` via `entityCRUD`)
3. Create org assignment (call `tenant-manager` via `entityCRUD`)
4. Send welcome email (call `social-integration` via `notification`)
5. Manager approval (call `approval-service` via `approvalRequest`)

#### Template #4: REIMBURSEMENT (HRM/Finance)

Stages:
1. Submit reimbursement request
2. **Parallel**:
   - Manager approve
   - Finance check budget (call `feature-flag` to check policy)
3. If budget ok → Approval director (call `approval-service`)
4. Trigger payment (call `finance-service` via `webhook`)
5. Notify employee (call `notification`)

#### Template #5: RESIGNATION (HRM)

Sequential:
1. Employee submit
2. Manager approve
3. HR director approve (call `approval-service` với `RESIGNATION` type)
4. **Parallel**:
   - Revoke user access (call `tenant-manager` via `entityCRUD`)
   - Settle final payment (call `finance-service` via `webhook`)
   - Send farewell email (call `notification`)
5. Archive employee record (call `tenant-manager` via `entityCRUD`)

### 1.3 Per-tenant Deployment

```sql
CREATE TABLE process_definitions (
    id                  UUID PRIMARY KEY,
    key                 VARCHAR(100) NOT NULL,           -- 'LEAVE_REQUEST' (giống BPMN process id)
    name                VARCHAR(255) NOT NULL,
    version             INTEGER NOT NULL DEFAULT 1,
    bpmn_xml            TEXT NOT NULL,
    template_id         UUID NULL REFERENCES process_definition_templates(id),
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    metadata            JSONB NOT NULL DEFAULT '{}'::jsonb,
    deployed_at         TIMESTAMPTZ NOT NULL,
    deployed_by         UUID NOT NULL,
    UNIQUE (key, version)
);
```

> **Khi import template**: copy BPMN XML từ `process_definition_templates` → `process_definitions`, có thể override trước khi lưu.

### API

```
# CLIENT-API
GET    /client-api/v1/workflow-templates                           ← List 5 templates mặc định
GET    /client-api/v1/workflow-templates/{code}                    ← 1 template
POST   /client-api/v1/workflow-templates/{code}/import             ← Import template → per-tenant def

GET    /client-api/v1/workflow-definitions                         ← List deployed definitions
POST   /client-api/v1/workflow-definitions                         ← Deploy BPMN XML mới
GET    /client-api/v1/workflow-definitions/{id}
PATCH  /client-api/v1/workflow-definitions/{id}                    ← Update version mới
DELETE /client-api/v1/workflow-definitions/{id}

# BPMN Editor integration (bpmn.io)
GET    /client-api/v1/workflow-definitions/{id}/bpmn               ← Trả BPMN XML
PUT    /client-api/v1/workflow-definitions/{id}/bpmn               ← Update BPMN XML

# SERVICE-API
GET    /service-api/v1/workflow-definitions/{key}/active           ← Tra cứu def đang active (cho service khác gọi start)
```

---

## 2. Process Instance (BC #2)

```sql
CREATE TABLE process_instances (
    id                  UUID PRIMARY KEY,
    definition_id       UUID NOT NULL REFERENCES process_definitions(id),
    definition_key      VARCHAR(100) NOT NULL,           -- denormalized
    business_key        VARCHAR(100) NULL,               -- external ref (leave_id, order_id,...)
    status              VARCHAR(20) NOT NULL,            -- RUNNING | COMPLETED | FAILED | SUSPENDED | TERMINATED
    started_by          UUID NOT NULL,
    started_at          TIMESTAMPTZ NOT NULL,
    ended_at            TIMESTAMPTZ NULL,
    variables           JSONB NOT NULL DEFAULT '{}'::jsonb,
    current_activities  JSONB NOT NULL DEFAULT '[]'::jsonb,  -- active token positions
    metadata            JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at          TIMESTAMPTZ NOT NULL,
    updated_at          TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_pi_definition  ON process_instances(definition_id);
CREATE INDEX idx_pi_business    ON process_instances(business_key);
CREATE INDEX idx_pi_status      ON process_instances(status);
CREATE INDEX idx_pi_started     ON process_instances(started_at DESC);
```

### State Machine

```
START → RUNNING ─┬─→ COMPLETED (mọi end event đã fire)
                 ├─→ FAILED (error event, unhandled exception)
                 ├─→ SUSPENDED (admin pause)
                 └─→ TERMINATED (admin kill)
```

### API

```
# CLIENT-API
GET    /client-api/v1/workflow-instances                          ← List (filter: businessKey, status, definitionKey)
GET    /client-api/v1/workflow-instances/{id}
GET    /client-api/v1/workflow-instances/{id}/diagram             ← BPMN diagram với active tokens overlay
GET    /client-api/v1/workflow-instances/{id}/variables
POST   /client-api/v1/workflow-instances/{id}/suspend
POST   /client-api/v1/workflow-instances/{id}/resume
POST   /client-api/v1/workflow-instances/{id}/terminate

# SERVICE-API
POST   /service-api/v1/workflow-instances                         ← Service start process
   Body: { definitionKey: 'LEAVE_REQUEST', businessKey: 'leave_123', variables: {...} }
GET    /service-api/v1/workflow-instances/by-business-key/{key}   ← Tra cứu theo businessKey
POST   /service-api/v1/workflow-instances/{id}/signal              ← Signal/Send event vào instance
POST   /service-api/v1/workflow-instances/{id}/message             ← Message event
```

---

## 3. Execution Log (BC #3)

```sql
CREATE TABLE execution_logs (
    id              UUID PRIMARY KEY,
    instance_id     UUID NOT NULL REFERENCES process_instances(id) ON DELETE CASCADE,
    activity_id     VARCHAR(100) NOT NULL,            -- BPMN element id
    activity_name   VARCHAR(255) NULL,
    activity_type   VARCHAR(50) NOT NULL,             -- 'START_EVENT', 'USER_TASK', 'SERVICE_TASK', 'GATEWAY', 'END_EVENT'
    event_type      VARCHAR(30) NOT NULL,             -- 'STARTED', 'COMPLETED', 'FAILED', 'SKIPPED'
    started_at      TIMESTAMPTZ NOT NULL,
    ended_at        TIMESTAMPTZ NULL,
    duration_ms     INTEGER NULL,
    input_variables JSONB NULL,
    output_variables JSONB NULL,
    error_msg       TEXT NULL,
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX idx_el_instance ON execution_logs(instance_id);
CREATE INDEX idx_el_started  ON execution_logs(started_at DESC);
```

## 4. User Task (BC #4)

User Task = delegate sang `approval-service`. Khi workflow gặp UserTask node, nó gọi:

```java
POST /service-api/v1/approval-requests
{
  "approvalTypeCode": "<từ BPMN cachesol:approval typeCode>",
  "requesterUserId": "${process.starterUserId}",
  "title": "${process.definitionName}",
  "payload": ${process.variables},
  "metadata": {
    "workflowInstanceId": "${process.instanceId}",
    "activityId": "${activity.id}"
  }
}
```

Approval service xử lý → khi approved/rejected → publish event `ApprovalApprovedEvent` → workflow-service listen → continue BPMN execution.

```sql
CREATE TABLE user_tasks (
    id                  UUID PRIMARY KEY,
    instance_id         UUID NOT NULL REFERENCES process_instances(id),
    activity_id         VARCHAR(100) NOT NULL,
    activity_name       VARCHAR(255) NULL,
    approval_request_id UUID NULL,                    -- FK → approval-service (cross-service)
    status              VARCHAR(20) NOT NULL,         -- PENDING | COMPLETED | CANCELLED
    assigned_user_id    UUID NULL,
    completed_at        TIMESTAMPTZ NULL,
    created_at          TIMESTAMPTZ NOT NULL
);
```

## 5. Service Task (BC #5)

Service Task = task tự động, có 3 loại:

### 5.1 WebService (HTTP call)

```xml
<bpmn:serviceTask id="apply_discount" implementation="##WebService">
  <bpmn:extensionElements>
    <cachesol:webhook
      method="POST"
      url="http://sales-service/service-api/v1/orders/${order.id}/apply-discount"
      headers='{"Authorization":"Bearer ${serviceToken}"}'
      timeoutMs="30000"
      retryMax="3"
      retryBackoffMs="1000,5000,15000"/>
  </bpmn:extensionElements>
</bpmn:serviceTask>
```

### 5.2 Java Delegate (Spring bean)

```xml
<bpmn:serviceTask id="calc_leave_balance" implementation="##JavaDelegate">
  <bpmn:extensionElements>
    <cachesol:java class="io.cachesol.workflow.delegate.CalcLeaveBalanceDelegate"/>
  </bpmn:extensionElements>
</bpmn:serviceTask>
```

### 5.3 Kafka Send/Receive

```xml
<bpmn:serviceTask id="publish_event" implementation="##KafkaSend">
  <bpmn:extensionElements>
    <cachesol:kafka topic="order.discounted" key="${order.id}" payload="${variables}"/>
  </bpmn:extensionElements>
</bpmn:serviceTask>
```

```sql
CREATE TABLE service_tasks (
    id              UUID PRIMARY KEY,
    instance_id     UUID NOT NULL REFERENCES process_instances(id),
    activity_id     VARCHAR(100) NOT NULL,
    implementation  VARCHAR(50) NOT NULL,             -- 'WebService', 'JavaDelegate', 'KafkaSend', 'cachesol-platform:*'
    request_payload JSONB NULL,
    response_payload JSONB NULL,
    status          VARCHAR(20) NOT NULL,
    attempt_count   SMALLINT NOT NULL DEFAULT 0,
    last_error      TEXT NULL,
    started_at      TIMESTAMPTZ NOT NULL,
    ended_at        TIMESTAMPTZ NULL
);
```

## 6. Timer (BC #6)

```xml
<bpmn:intermediateCatchEvent id="wait_24h">
  <bpmn:timerEventDefinition>
    <bpmn:timeDuration>PT24H</bpmn:timeDuration>
  </bpmn:timerEventDefinition>
</bpmn:intermediateCatchEvent>
```

```sql
CREATE TABLE timer_jobs (
    id              UUID PRIMARY KEY,
    instance_id     UUID NOT NULL REFERENCES process_instances(id),
    activity_id     VARCHAR(100) NOT NULL,
    fire_at         TIMESTAMPTZ NOT NULL,
    status          VARCHAR(20) NOT NULL,             -- SCHEDULED | FIRED | CANCELLED
    timer_type      VARCHAR(20) NOT NULL,             -- 'DURATION', 'CYCLE', 'DATE'
    timer_value     VARCHAR(100) NOT NULL,            -- 'PT24H', 'R3/PT10S', '2026-12-31T23:59:59Z'
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_tj_fire ON timer_jobs(fire_at) WHERE status = 'SCHEDULED';
```

---

## Platform Items — Reference đầy đủ

### Approval Task

```xml
<bpmn:serviceTask id="manager_approval"
                  implementation="##cachesol-platform:approvalRequest">
  <bpmn:extensionElements>
    <cachesol:approval
      typeCode="LEAVE_REQUEST"
      timeout="PT48H"
      payloadMapping='{"days":"${leave.days}","fromDate":"${leave.fromDate}"}'/>
  </bpmn:extensionElements>
</bpmn:serviceTask>
```

→ Gọi `approval-service` POST `/service-api/v1/approval-requests`.

### Notification Task

```xml
<bpmn:serviceTask id="notify_employee"
                  implementation="##cachesol-platform:notification">
  <bpmn:extensionElements>
    <cachesol:notification
      templateCode="LEAVE_APPROVED"
      channel="IN_APP"
      recipient="${process.variables.employeeUserId}"/>
  </bpmn:extensionElements>
</bpmn:serviceTask>
```

→ Gọi `social-integration-service` POST `/service-api/v1/notifications/send`.

### Feature Flag Gate

```xml
<bpmn:serviceTask id="check_flag"
                  implementation="##cachesol-platform:featureFlagCheck">
  <bpmn:extensionElements>
    <cachesol:featureFlag
      uid="GLOBAL.HRM.enable_v2"
      expectedResult="true"
      attributes='{"role":"HRM","tenant":"${process.tenantSlug}"}'/>
  </bpmn:extensionElements>
</bpmn:serviceTask>
```

→ Gọi `feature-flag-service` POST `/service-api/v1/feature-flags/{uid}/check`. Kết quả lưu vào `process.variables.featureFlagResult`.

### Entity CRUD Task

```xml
<bpmn:serviceTask id="revoke_access"
                  implementation="##cachesol-platform:entityCRUD">
  <bpmn:extensionElements>
    <cachesol:entityCRUD
      service="tenant-manager"
      endpoint="/service-api/v1/users/${employee.userId}/deactivate"
      method="POST"/>
  </bpmn:extensionElements>
</bpmn:serviceTask>
```

→ Generic HTTP call tới service-api của service khác (qua service-to-service auth).

### Webhook Task

```xml
<bpmn:serviceTask id="external_callback"
                  implementation="##cachesol-platform:webhook">
  <bpmn:extensionElements>
    <cachesol:webhook
      method="POST"
      url="${process.variables.callbackUrl}"
      payload='{"status":"completed","ref":"${process.id}"}'/>
  </bpmn:extensionElements>
</bpmn:serviceTask>
```

→ Generic HTTP call external.

---

## BPMN Engine Implementation

> **Lựa chọn:**
> - **Camunda Platform 7** (mature, nhiều features) → nặng.
> - **Flowable** (lightweight, fork Camunda) → moderate.
> - **Custom engine** (BPMN-lite) → siêu nhẹ, chỉ support subset.
>
> **Khuyến nghị:** Custom engine hỗ trợ subset BPMN + 5 platform items trên. Lý do: Camunda/Flowable đều quá nặng cho 5 loại task cần thiết, khó tích hợp sâu với approval-service / social-integration / feature-flag-service.

```java
// Custom BPMN-lite engine — load BPMN XML → parse → execute
@Service
public class WorkflowEngine {

    public void startProcess(String definitionKey, UUID starterUserId, Map<String, Object> variables) {
        ProcessDefinition def = defRepo.findActiveByKey(definitionKey);
        ProcessInstance instance = new ProcessInstance(def, starterUserId, variables);
        instanceRepo.save(instance);

        // Fire start event → tìm outgoing sequence flow → execute activity
        ExecutionContext ctx = new ExecutionContext(instance);
        executor.executeStartEvent(ctx);
    }

    public void onApprovalEvent(UUID approvalRequestId, String decision) {
        UserTask task = userTaskRepo.findByApprovalRequestId(approvalRequestId);
        ExecutionContext ctx = new ExecutionContext(task.getInstance());
        ctx.setVariable("approvalDecision", decision);
        executor.completeActivity(task.getActivityId(), ctx);
    }
}
```

---

## Dependencies

| Dependency | Vai trò |
|------------|---------|
| **PostgreSQL** | State machine persistence |
| **Kafka** | Publish events, async execution |
| **approval-service** | User Task delegate |
| **social-integration-service** | Notification Task |
| **feature-flag-service** | Feature Flag Gate |
| **tenant-manager-service** | Entity CRUD Task |
| **Keycloak** | JWT verify (qua iam-service) |
| **Redis** | Cache BPMN definitions |

## Domain Events Published

```
ProcessStartedEvent
ProcessActivityStartedEvent       (activityId, activityType)
ProcessActivityCompletedEvent
ProcessActivityFailedEvent
ProcessCompletedEvent
ProcessFailedEvent
ProcessTerminatedEvent
ProcessSuspendedEvent
ProcessResumedEvent
UserTaskCreatedEvent               ← approval-service listen
TimerScheduledEvent
TimerFiredEvent
```

## Domain Events Consumed

```
ApprovalApprovedEvent              ← approval-service
ApprovalRejectedEvent              ← approval-service
ApprovalCancelledEvent
FeatureFlagChangedEvent            ← feature-flag-service (invalidate cache)
```

---

## API tổng quan (4 prefix pattern)

```
# CLIENT-API — Web/Mobile (user JWT)
/client-api/v1/workflow-templates
/client-api/v1/workflow-templates/{code}/import

/client-api/v1/workflow-definitions
/client-api/v1/workflow-definitions/{id}
/client-api/v1/workflow-definitions/{id}/bpmn
/client-api/v1/workflow-definitions/{id}/deploy

/client-api/v1/workflow-instances
/client-api/v1/workflow-instances/{id}
/client-api/v1/workflow-instances/{id}/diagram
/client-api/v1/workflow-instances/{id}/variables
/client-api/v1/workflow-instances/{id}/suspend
/client-api/v1/workflow-instances/{id}/resume
/client-api/v1/workflow-instances/{id}/terminate

# SERVICE-API — service-to-service (service JWT)
/service-api/v1/workflow-definitions/{key}/active
/service-api/v1/workflow-instances                    ← Service start process
/service-api/v1/workflow-instances/by-business-key/{key}
/service-api/v1/workflow-instances/{id}/signal
/service-api/v1/workflow-instances/{id}/message

# INTEGRATION-API — không có (workflow không nhận external webhook)

# PUBLIC-API
/public-api/v1/health
```

## Quy tắc quan trọng

1. **Workflow orchestrate, KHÔNG xử lý logic** — mọi task delegate sang service khác qua service-api. Workflow chỉ điều phối.
2. **5 templates mặc định** (LEAVE_REQUEST, ORDER_DISCOUNT, ONBOARDING, REIMBURSEMENT, RESIGNATION) seed qua Liquibase ở schema `public.process_definition_templates`.
3. **Templates CRUD qua API**: GET list, POST import. Không edit BPMN XML trực tiếp trong template — edit ở per-tenant `process_definitions`.
4. **BPMN XML version**: mỗi lần deploy → version++, KHÔNG update cũ (giữ audit trail).
5. **User Task luôn delegate sang approval-service** — KHÔNG tự xử lý user task trong workflow engine.
6. **Platform items dùng `##cachesol-platform:*` namespace** để custom engine nhận diện.
7. **Timer dùng DB scheduler** (không Quartz) — scan `timer_jobs WHERE fire_at < now() AND status='SCHEDULED'` mỗi 5s.
8. **Diagram overlay**: API trả BPMN XML + `current_activities` để FE (bpmn.io) highlight active tokens.

## Xem thêm

- Approval Service (delegate User Task): [`../approval/README.md`](../approval/README.md)
- Feature Flag Service (gate): [`../feature-flag/README.md`](../feature-flag/README.md)
- Social Integration (notification task): [`../social-integration/README.md`](../social-integration/README.md)
- IAM JWT verify: [`../iam/README.md`](../iam/README.md)
- Multi-tenant: [`../../../governance/architecture/multi-tenant.md`](../../../governance/architecture/multi-tenant.md)
- API patterns: [`../../../governance/architecture/api-patterns.md`](../../../governance/architecture/api-patterns.md)
