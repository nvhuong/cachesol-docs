/**
 * Mock data cho Tenant Manager Admin.
 */
import type { Organization } from '../types/organization.types';
import type { Employee } from '../types/employee.types';
import type { ProvisioningJob, AuditEntry } from '../types/provisioning.types';

export const MOCK_ORGS: Organization[] = [
  { id: 'org_acme', type: 'company', name: 'ACME Corp', code: 'ACME', employeeCount: 156, active: true, createdAt: '2025-01-01', updatedAt: '2025-09-01' },
  { id: 'org_eng', type: 'department', name: 'Engineering', code: 'ENG', parentId: 'org_acme', employeeCount: 48, active: true, createdAt: '2025-01-01', updatedAt: '2025-09-15' },
  { id: 'org_sales', type: 'department', name: 'Sales', code: 'SALES', parentId: 'org_acme', employeeCount: 32, active: true, createdAt: '2025-01-01', updatedAt: '2025-09-10' },
  { id: 'org_hr', type: 'department', name: 'Human Resources', code: 'HR', parentId: 'org_acme', employeeCount: 8, active: true, createdAt: '2025-01-01', updatedAt: '2025-09-12' },
  { id: 'org_backend', type: 'team', name: 'Backend team', code: 'BACKEND', parentId: 'org_eng', employeeCount: 18, active: true, createdAt: '2025-02-01', updatedAt: '2025-09-15' },
  { id: 'org_frontend', type: 'team', name: 'Frontend team', code: 'FRONTEND', parentId: 'org_eng', employeeCount: 14, active: true, createdAt: '2025-02-01', updatedAt: '2025-09-15' },
  { id: 'org_qa', type: 'team', name: 'QA team', code: 'QA', parentId: 'org_eng', employeeCount: 8, active: true, createdAt: '2025-02-01', updatedAt: '2025-09-15' },
];

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'e1',
    employeeCode: 'EMP001',
    email: 'alice@acme.com',
    fullName: 'Alice Nguyễn',
    status: 'active',
    employmentType: 'full-time',
    departmentId: 'org_backend',
    positionId: undefined,
    dateOfJoining: '2024-06-01',
    phone: '+84 901 234 567',
    keycloakSynced: true,
    lastSyncedAt: '2025-09-20T10:00:00Z',
    createdAt: '2024-06-01',
    updatedAt: '2025-09-15',
  },
  {
    id: 'e2',
    employeeCode: 'EMP002',
    email: 'bob@acme.com',
    fullName: 'Bob Trần',
    status: 'probation',
    employmentType: 'full-time',
    departmentId: 'org_backend',
    dateOfJoining: '2025-08-01',
    keycloakSynced: true,
    lastSyncedAt: '2025-09-20T10:00:00Z',
    createdAt: '2025-08-01',
    updatedAt: '2025-09-15',
  },
  {
    id: 'e3',
    employeeCode: 'EMP003',
    email: 'carol@acme.com',
    fullName: 'Carol Lê',
    status: 'on-leave',
    employmentType: 'full-time',
    departmentId: 'org_frontend',
    dateOfJoining: '2023-03-15',
    keycloakSynced: true,
    lastSyncedAt: '2025-09-20T10:00:00Z',
    createdAt: '2023-03-15',
    updatedAt: '2025-09-10',
  },
  {
    id: 'e4',
    employeeCode: 'EMP004',
    email: 'dave@acme.com',
    fullName: 'Dave Phạm',
    status: 'active',
    employmentType: 'contract',
    departmentId: 'org_sales',
    dateOfJoining: '2025-01-10',
    keycloakSynced: false,
    lastSyncedAt: undefined,
    createdAt: '2025-01-10',
    updatedAt: '2025-09-01',
  },
  {
    id: 'e5',
    employeeCode: 'EMP005',
    email: 'eve@acme.com',
    fullName: 'Eve Hoàng',
    status: 'onboarding',
    employmentType: 'intern',
    departmentId: 'org_qa',
    dateOfJoining: '2025-09-15',
    keycloakSynced: false,
    createdAt: '2025-09-15',
    updatedAt: '2025-09-15',
  },
];

export const MOCK_PROVISIONING: ProvisioningJob[] = [
  { id: 'p1', tenantId: 'tnt_acme', miniAppId: 'hrm', state: 'completed', startedAt: '2025-09-20T10:00:00Z', finishedAt: '2025-09-20T10:05:00Z', attempts: 1, progress: 100 },
  { id: 'p2', tenantId: 'tnt_acme', miniAppId: 'sales', state: 'completed', startedAt: '2025-09-20T10:06:00Z', finishedAt: '2025-09-20T10:09:00Z', attempts: 1, progress: 100 },
  { id: 'p3', tenantId: 'tnt_globex', miniAppId: 'hrm', state: 'in-progress', startedAt: '2025-09-22T08:00:00Z', attempts: 1, progress: 45 },
  { id: 'p4', tenantId: 'tnt_globex', miniAppId: 'sales', state: 'requested', startedAt: '2025-09-22T08:01:00Z', attempts: 0 },
  { id: 'p5', tenantId: 'tnt_initech', miniAppId: 'finance', state: 'failed', startedAt: '2025-09-15T14:00:00Z', finishedAt: '2025-09-15T14:02:00Z', attempts: 2, errorMessage: 'Keycloak realm creation timeout' },
];

export const MOCK_AUDIT: AuditEntry[] = [
  {
    id: 'a1',
    actor: { id: 'u1', email: 'admin@acme.com', name: 'Alice (Admin)' },
    action: 'employee.update',
    entityType: 'employee',
    entityId: 'e2',
    description: 'Cập nhật employee E2: status active → probation',
    ip: '14.225.12.34',
    timestamp: '2025-09-15T10:00:00Z',
  },
  {
    id: 'a2',
    actor: { id: 'u1', email: 'admin@acme.com', name: 'Alice (Admin)' },
    action: 'employee.create',
    entityType: 'employee',
    entityId: 'e5',
    description: 'Tạo employee mới: Eve Hoàng (intern)',
    ip: '14.225.12.34',
    timestamp: '2025-09-15T09:30:00Z',
  },
  {
    id: 'a3',
    actor: { id: 'system', email: 'system@cachesol.io' },
    action: 'keycloak.sync',
    entityType: 'employee',
    entityId: 'e1',
    description: 'Đồng bộ user Keycloak: alice@acme.com',
    ip: '127.0.0.1',
    timestamp: '2025-09-20T10:00:00Z',
  },
];

export function fetchMockOrgs(): Promise<Organization[]> {
  return new Promise((r) => setTimeout(() => r(MOCK_ORGS), 250));
}

export function fetchMockEmployees(): Promise<Employee[]> {
  return new Promise((r) => setTimeout(() => r(MOCK_EMPLOYEES), 250));
}

export function fetchMockProvisioning(): Promise<ProvisioningJob[]> {
  return new Promise((r) => setTimeout(() => r(MOCK_PROVISIONING), 250));
}

export function fetchMockAudit(): Promise<AuditEntry[]> {
  return new Promise((r) => setTimeout(() => r(MOCK_AUDIT), 250));
}
