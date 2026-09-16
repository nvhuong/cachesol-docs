/**
 * Employee Types - HRM Mini App specific
 */

export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'SUSPENDED' | 'RESIGNED' | 'TERMINATED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type MaritalStatus = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN' | 'PROBATION';

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  nationalId?: string;
  taxCode?: string;
  dateOfJoining: string;
  dateOfProbationEnd?: string;
  dateOfConfirmation?: string;
  dateOfResignation?: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  profileImageUrl?: string;
  currentAddress?: string;
  permanentAddress?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  department?: DepartmentSummary;
  position?: PositionSummary;
  workLocation?: WorkLocationSummary;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeSummary {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone?: string;
  status: EmployeeStatus;
  employmentType: EmploymentType;
  departmentName?: string;
  positionName?: string;
  profileImageUrl?: string;
}

export interface DepartmentSummary {
  id: string;
  departmentCode: string;
  departmentName: string;
}

export interface PositionSummary {
  id: string;
  positionCode: string;
  positionName: string;
  level?: string;
}

export interface WorkLocationSummary {
  id: string;
  locationCode: string;
  locationName: string;
  address?: string;
}

export interface CreateEmployeeRequest {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  nationalId?: string;
  taxCode?: string;
  dateOfJoining: string;
  dateOfProbationEnd?: string;
  employmentType: EmploymentType;
  currentAddress?: string;
  permanentAddress?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  departmentId?: string;
  positionId?: string;
  workLocationId?: string;
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  status?: EmployeeStatus;
  dateOfConfirmation?: string;
}

export interface ChangeStatusRequest {
  status: EmployeeStatus;
  reason?: string;
}
