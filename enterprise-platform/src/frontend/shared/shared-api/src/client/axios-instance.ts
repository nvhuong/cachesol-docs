import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

export interface ApiClientConfig {
  baseURL: string;
  getToken?: () => string | null;
  onUnauthorized?: () => void;
  onError?: (error: AxiosError) => void;
}

export function createApiClient(config: ApiClientConfig): AxiosInstance {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - thêm token
  instance.interceptors.request.use(
    (axiosConfig: InternalAxiosRequestConfig) => {
      const token = config.getToken?.();
      if (token) {
        axiosConfig.headers.Authorization = `Bearer ${token}`;
      }
      return axiosConfig;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - xử lý lỗi
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        config.onUnauthorized?.();
      }
      config.onError?.(error);
      return Promise.reject(error);
    }
  );

  return instance;
}

// Default instance (có thể override trong shell)
export const apiClient = createApiClient({
  baseURL: import.meta.env?.VITE_API_BASE_URL || '/api/v1',
});
