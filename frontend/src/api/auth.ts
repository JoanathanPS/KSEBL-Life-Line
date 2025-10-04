import { apiClient } from './client';
import { LoginCredentials, LoginResponse, RefreshTokenResponse, User } from '../types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  logout: async (): Promise<void> => {
    return apiClient.post<void>('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    return apiClient.post<RefreshTokenResponse>('/auth/refresh', { refreshToken });
  },

  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/auth/me');
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    return apiClient.post<void>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
};