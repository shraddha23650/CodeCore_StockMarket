/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import baseApi from './base';
import { API_BASE_URLS } from './config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'staff';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private baseUrl = API_BASE_URLS.AUTH;

  /**
   * Register a new user
   */
  async register(data: RegisterData) {
    const response = await baseApi.post<AuthResponse>(
      `${this.baseUrl}/auth/register`,
      data
    );
    return response;
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials) {
    const response = await baseApi.post<AuthResponse>(
      `${this.baseUrl}/auth/login`,
      credentials
    );
    return response;
  }

  /**
   * Get user profile
   */
  async getProfile() {
    const response = await baseApi.get<User>(`${this.baseUrl}/auth/profile`);
    return response;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: { name?: string; email?: string }) {
    const response = await baseApi.put<User>(
      `${this.baseUrl}/auth/profile`,
      data
    );
    return response;
  }

  /**
   * Change password
   */
  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await baseApi.put(
      `${this.baseUrl}/auth/change-password`,
      data
    );
    return response;
  }

  /**
   * Forgot password - request OTP
   */
  async forgotPassword(email: string) {
    const response = await baseApi.post(`${this.baseUrl}/auth/forgot-password`, {
      email,
    });
    return response;
  }

  /**
   * Reset password with OTP
   */
  async resetPassword(data: { email: string; otp: string; newPassword: string }) {
    const response = await baseApi.post(`${this.baseUrl}/auth/reset-password`, data);
    return response;
  }
}

export default new AuthService();

