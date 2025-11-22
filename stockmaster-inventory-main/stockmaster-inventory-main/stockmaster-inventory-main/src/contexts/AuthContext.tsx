/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User, LoginCredentials, RegisterData } from '../api/authService';
import { setAuthToken, getAuthToken, removeAuthToken, setUserData, getUserData, removeUserData } from '../api/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      const savedUser = getUserData();

      if (token && savedUser) {
        try {
          // Verify token by fetching profile
          const response = await authService.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
            setUserData(response.data);
          } else {
            // Token invalid, clear storage
            removeAuthToken();
            removeUserData();
          }
        } catch (error) {
          // Token invalid, clear storage
          removeAuthToken();
          removeUserData();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    if (response.success && response.data) {
      const { user: userData, token } = response.data;
      setAuthToken(token);
      setUserData(userData);
      setUser(userData);
    } else {
      throw new Error(response.message || 'Login failed');
    }
  };

  const register = async (data: RegisterData) => {
    const response = await authService.register(data);
    if (response.success && response.data) {
      const { user: userData, token } = response.data;
      setAuthToken(token);
      setUserData(userData);
      setUser(userData);
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  };

  const logout = () => {
    removeAuthToken();
    removeUserData();
    setUser(null);
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    setUserData(userData);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

