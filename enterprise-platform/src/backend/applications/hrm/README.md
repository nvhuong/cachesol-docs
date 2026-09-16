# HRM Service - Backend Microservice

Backend microservice với package gốc `com.cachesol.platform.hrm`.

## Owned Bounded Contexts (chỉ nghiệp vụ HR)

HRM service chỉ giữ **nghiệp vụ HR** sau (tất cả master data về employee/org/job_title đã chuyển sang `tenant-manager`):

- `attendance` — Chấm công, lịch làm việc, ca kíp
- `leave` — Đơn nghỉ phép, lịch nghỉ, duyệt
- `payroll` — Tính lương, phiếu lương, bảo hiểm, thuế TNCN
- `recruitment` — Tuyển dụng, hồ sơ ứng viên, job posting
- `performance` — Đánh giá KPI, review cycles
- `training` — Đào tạo, chứng chỉ

→ HRM ĐỌC org/employee qua **service-api** của [`tenant-manager`](../../platform/tenant-manager/README.md):
- `GET /service-api/v1/employees` — Danh sách nhân viên
- `GET /service-api/v1/employees/{id}/assignments` — Org + chức danh
- `GET /service-api/v1/organizations/{id}/descendants` — Cây đơn vị
- `GET /service-api/v1/organizations/tree` — Toàn bộ cây
- ...

HRM KHÔNG tự quản lý organizations/employees/job_titles nữa (đã chuyển sang `tenant-manager` để đồng nhất với user/role).

## Quick Start

```bash
mvn spring-boot:run
```

App chạy ở `http://localhost:8080/api/v1`.

## Cấu trúc

```
src/main/java/com/cachesol/platform/hrm/
├── HrmServiceApplication.java
├── application/
│   ├── controller/
│   │   ├── AttendanceController.java
│   │   ├── LeaveController.java          ← kết nối workflow-service + approval-service
│   │   ├── PayrollController.java
│   │   ├── RecruitmentController.java
│   │   ├── PerformanceController.java
│   │   └── TrainingController.java
│   ├── dto/
│   └── service/
│       ├── EmployeeLookupService.java    ← FEIGN/sync tới tenant-manager service-api
│       └── OrganizationTreeService.java ← FEIGN/sync tới tenant-manager service-api
├── domain/                               ← Chỉ chứa entities nghiệp vụ HR
│   ├── entity/
│   │   ├── AttendanceRecord.java
│   │   ├── LeaveRequest.java
│   │   ├── PayrollSlip.java
│   │   ├── JobPosting.java
│   │   ├── PerformanceReview.java
│   │   └── TrainingCourse.java
│   └── repository/
└── infrastructure/
    ├── persistence/
    └── integration/
        └── TenantManagerClient.java      ← gọi tenant-manager service-api
```

## Org/Employee Lookup (qua tenant-manager service-api)

```java
@Service
public class EmployeeLookupService {
    private final TenantManagerClient tenantManagerClient;

    public EmployeeDto getEmployee(UUID id) {
        // Gọi service-api của tenant-manager
        return tenantManagerClient.get("/service-api/v1/employees/" + id, EmployeeDto.class);
    }

    public OrganizationTreeDto getOrgTree() {
        // Cache trong Redis 30 phút
        return cache.get("org_tree", k -> tenantManagerClient.get("/service-api/v1/organizations/tree", OrganizationTreeDto.class));
    }
}
```

## API Endpoints (HR nghiệp vụ)

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST   | /attendance/clock-in            | Chấm công vào |
| GET    | /attendance/today               | Chấm công hôm nay |
| POST   | /leaves                         | Tạo đơn nghỉ phép |
| POST   | /leaves/{id}/approve            | Duyệt (qua workflow-service) |
| POST   | /payrolls/run                   | Chạy bảng lương tháng |
| GET    | /payrolls/{id}                  | Chi tiết phiếu lương |
| POST   | /recruitments/jobs              | Tạo job posting |
| GET    | /recruitments/candidates        | List ứng viên |
| POST   | /performance/reviews            | Tạo đợt đánh giá |
| POST   | /trainings/courses              | Tạo khóa đào tạo |

Xem chi tiết cấu trúc: [SOURCE-CODE-STRUCTURE.md](../../SOURCE-CODE-STRUCTURE.md)

## Lưu ý quan trọng

> **HRM KHÔNG tự quản lý:**
> - `organizations` — lấy từ `tenant-manager /service-api/v1/organizations/...`
> - `employees`, `employee_assignments`, `job_titles` — lấy từ `tenant-manager /service-api/v1/employees/...`
>
> Lý do: đồng nhất với user/role management, dễ phân quyền theo org-scope, tránh trùng lặp data.
