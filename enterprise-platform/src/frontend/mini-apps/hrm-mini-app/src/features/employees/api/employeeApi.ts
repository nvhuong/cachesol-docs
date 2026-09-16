import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@cachesol/shared-api';
import type { ApiResponse, PageResponse } from '@cachesol/shared-types';
import type {
  Employee,
  EmployeeSummary,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  ChangeStatusRequest,
} from '../types/employee.types';

const BASE_URL = '/employees';

interface GetEmployeesParams {
  page?: number;
  size?: number;
  keyword?: string;
  status?: string;
  departmentId?: string;
}

export function useGetEmployees(params: GetEmployeesParams = {}) {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<PageResponse<EmployeeSummary>>>(BASE_URL, {
        params: {
          page: params.page ?? 0,
          size: params.size ?? 20,
          ...(params.keyword && { keyword: params.keyword }),
          ...(params.status && { status: params.status }),
          ...(params.departmentId && { departmentId: params.departmentId }),
        },
      });
      return response.data;
    },
  });
}

export function useGetEmployee(id: string) {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Employee>>(`${BASE_URL}/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useSearchEmployees(keyword: string, params: { page?: number; size?: number } = {}) {
  return useQuery({
    queryKey: ['employees', 'search', keyword, params],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<PageResponse<EmployeeSummary>>>(
        `${BASE_URL}/search`,
        { params: { keyword, ...params } }
      );
      return response.data;
    },
    enabled: !!keyword,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateEmployeeRequest) => {
      const response = await apiClient.post<ApiResponse<Employee>>(BASE_URL, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEmployeeRequest }) => {
      const response = await apiClient.put<ApiResponse<Employee>>(`${BASE_URL}/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<ApiResponse<void>>(`${BASE_URL}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useChangeEmployeeStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ChangeStatusRequest }) => {
      const response = await apiClient.patch<ApiResponse<Employee>>(
        `${BASE_URL}/${id}/status`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
    },
  });
}
