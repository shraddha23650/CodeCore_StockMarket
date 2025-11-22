/**
 * Base API Service
 * Handles common API request logic
 */

import { getAuthToken, removeAuthToken, removeUserData } from './config';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class BaseApiService {
  /**
   * Make an API request
   */
  async request<T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        removeAuthToken();
        removeUserData();
        window.location.href = '/login';
        throw new Error('Unauthorized. Please login again.');
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'An error occurred');
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return this.request<T>(url + queryString, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'DELETE' });
  }
}

export default new BaseApiService();

