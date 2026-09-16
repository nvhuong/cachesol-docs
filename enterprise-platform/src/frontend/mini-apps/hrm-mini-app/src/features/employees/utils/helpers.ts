import type { EmployeeStatus, Gender, EmploymentType } from '../types/employee.types';

export const STATUS_COLORS: Record<EmployeeStatus, string> = {
  ACTIVE: 'green',
  ON_LEAVE: 'blue',
  SUSPENDED: 'orange',
  RESIGNED: 'default',
  TERMINATED: 'red',
};

export const STATUS_LABELS: Record<EmployeeStatus, string> = {
  ACTIVE: 'Đang làm việc',
  ON_LEAVE: 'Nghỉ phép',
  SUSPENDED: 'Tạm ngưng',
  RESIGNED: 'Đã nghỉ việc',
  TERMINATED: 'Bị sa thải',
};

export const GENDER_LABELS: Record<Gender, string> = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
  OTHER: 'Khác',
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: 'Toàn thời gian',
  PART_TIME: 'Bán thời gian',
  CONTRACT: 'Hợp đồng',
  INTERN: 'Thực tập',
  PROBATION: 'Thử việc',
};

export function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
