/**
 * Authentication API service
 * Handles login, signup, logout, and related auth operations
 */

import { apiClient } from '../client';
import type { ApiResponse } from '../types';

// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  confirm_password?: string; // Usually not sent to backend
  profession: string;
  full_name: string;
}

// Response types
export interface AuthResponse {
    id: string;
    email: string;
    full_name?: string;
    profession: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

/**
 * Login user
 */
export const login = async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
  
  // Store token if login successful
  if (response.data?.data && typeof window !== 'undefined') {
    localStorage.setItem('auth_token', response.data.data.accessToken);
  }
  
  return response.data;
};

/**
 * Signup user
 */
export const signup = async (data: SignupRequest): Promise<ApiResponse<AuthResponse>> => {
  // Remove confirmPassword before sending
  const { confirm_password, ...signupData } = data;
  
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', signupData);
  
  // Store token if signup successful
  if (response.data.data?.accessToken && typeof window !== 'undefined') {
    localStorage.setItem('auth_token', response.data.data.accessToken);
  }
  
  return response.data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear token regardless of API call success
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>('/auth/me');
  return response.data;
};

/**
 * Refresh auth token
 */
export const refreshToken = async (): Promise<ApiResponse<{ token: string }>> => {
  const response = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh');
  
  if (response.data.data?.token && typeof window !== 'undefined') {
    localStorage.setItem('auth_token', response.data.data.token);
  }
  
  return response.data;
};

