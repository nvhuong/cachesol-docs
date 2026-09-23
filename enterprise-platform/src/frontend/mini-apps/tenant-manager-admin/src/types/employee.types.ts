/**
 * Employee domain types — shared giữa Tenant Manager Admin và HRM mini-app.
 */
export type EmployeeStatus =
  | 'active'
  | 'onboarding'
  | 'on-leave'
  | 'probation'
  | 'terminated';

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'intern' | 'temporary';

export interface Employee {
  id: string;
  employeeCode: string;
  email: string;
  fullName: string;
  status: EmployeeStatus;
  employmentType: EmploymentType;
  /** Foreign key: Organization.id */
  departmentId?: string;
  /** Foreign key: Organization.id (type='position'). */
  positionId?: string;
  managerId?: string;
  dateOfJoining: string;
  dateOfBirth?: string;
  phone?: string;
  /** Subset: 'active' trên Keycloak? dùng cho sync table. */
  keycloakSynced?: boolean;
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
}
