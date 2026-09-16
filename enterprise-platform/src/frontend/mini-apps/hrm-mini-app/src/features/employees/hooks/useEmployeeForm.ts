import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateEmployee, useUpdateEmployee } from '../api/employeeApi';
import { employeeFormSchema, defaultEmployeeFormValues, type EmployeeFormValues } from '../utils/validation';
import type { Employee } from '../types/employee.types';

export function useEmployeeForm(employee?: Employee) {
  const isEditMode = !!employee?.id;
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: employee
      ? {
          employeeCode: employee.employeeCode,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone || '',
          dateOfBirth: employee.dateOfBirth || '',
          gender: employee.gender,
          maritalStatus: employee.maritalStatus,
          nationalId: employee.nationalId || '',
          taxCode: employee.taxCode || '',
          dateOfJoining: employee.dateOfJoining,
          dateOfProbationEnd: employee.dateOfProbationEnd || '',
          employmentType: employee.employmentType,
          currentAddress: employee.currentAddress || '',
          permanentAddress: employee.permanentAddress || '',
          emergencyContactName: employee.emergencyContactName || '',
          emergencyContactPhone: employee.emergencyContactPhone || '',
          emergencyContactRelationship: employee.emergencyContactRelationship || '',
          bankAccountNumber: employee.bankAccountNumber || '',
          bankName: employee.bankName || '',
          bankBranch: employee.bankBranch || '',
          departmentId: employee.department?.id,
          positionId: employee.position?.id,
          workLocationId: employee.workLocation?.id,
        }
      : defaultEmployeeFormValues,
  });

  const isLoading = useMemo(() => 
    createMutation.isPending || updateMutation.isPending,
    [createMutation.isPending, updateMutation.isPending]
  );

  const onSubmit = async (data: EmployeeFormValues) => {
    setError(null);
    try {
      if (isEditMode && employee?.id) {
        await updateMutation.mutateAsync({ id: employee.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      return true;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      setError(error.response?.data?.detail || error.message || 'Có lỗi xảy ra');
      return false;
    }
  };

  return {
    form,
    isLoading,
    error,
    isEditMode,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
