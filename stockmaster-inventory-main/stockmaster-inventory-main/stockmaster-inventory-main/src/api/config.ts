/**
 * API Configuration
 * Base URLs for all backend microservices
 */

export const API_BASE_URLS = {
  AUTH: import.meta.env.VITE_AUTH_URL || 'http://localhost:5000',
  PRODUCTS: import.meta.env.VITE_PRODUCTS_URL || 'http://localhost:5001',
  RECEIPTS: import.meta.env.VITE_RECEIPTS_URL || 'http://localhost:5002',
  DELIVERIES: import.meta.env.VITE_DELIVERIES_URL || 'http://localhost:5003',
  TRANSFERS: import.meta.env.VITE_TRANSFERS_URL || 'http://localhost:5004',
  ADJUSTMENTS: import.meta.env.VITE_ADJUSTMENTS_URL || 'http://localhost:5005',
  DASHBOARD: import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:5006',
};

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Set authentication token in localStorage
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

/**
 * Get user data from localStorage
 */
export const getUserData = (): any | null => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Set user data in localStorage
 */
export const setUserData = (userData: any): void => {
  localStorage.setItem('userData', JSON.stringify(userData));
};

/**
 * Remove user data from localStorage
 */
export const removeUserData = (): void => {
  localStorage.removeItem('userData');
};

