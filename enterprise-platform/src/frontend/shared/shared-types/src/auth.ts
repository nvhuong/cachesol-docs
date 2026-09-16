/**
 * Auth/User Types
 */

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  roles?: string[];
  permissions?: string[];
}

export interface AuthState {
  token: string | null;
  refreshToken?: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: AuthUser;
}
