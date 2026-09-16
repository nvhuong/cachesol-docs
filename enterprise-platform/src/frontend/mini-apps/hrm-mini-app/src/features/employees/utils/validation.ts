import { z } from 'zod';

export const employeeFormSchema = z.object({
  employeeCode: z.string().min(1, 'Mã nhân viên là bắt buộc'),
  firstName: z.string().min(1, 'Họ là bắt buộc'),
  lastName: z.string().min(1, 'Tên là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']).optional(),
  nationalId: z.string().optional(),
  taxCode: z.string().optional(),
  dateOfJoining: z.string().min(1, 'Ngày vào làm là bắt buộc'),
  dateOfProbationEnd: z.string().optional(),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'PROBATION'], {
    required_error: 'Loại hợp đồng là bắt buộc',
  }),
  currentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
  bankBranch: z.string().optional(),
  departmentId: z.string().optional(),
  positionId: z.string().optional(),
  workLocationId: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export const defaultEmployeeFormValues: Partial<EmployeeFormValues> = {
  phone: '',
  nationalId: '',
  taxCode: '',
  currentAddress: '',
  permanentAddress: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelationship: '',
  bankAccountNumber: '',
  bankName: '',
  bankBranch: '',
};
