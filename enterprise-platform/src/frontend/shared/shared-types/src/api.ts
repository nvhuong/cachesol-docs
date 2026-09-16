/**
 * Generic API Response Types
 */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  traceId?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * RFC 7807 Problem Details
 */
export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
}
