import { apiClient } from './client';
import { Feeder } from '../types';

export interface FeederFilters {
  substationId?: string;
  status?: string;
  voltage?: number;
  page?: number;
  limit?: number;
}

export interface FeederResponse {
  feeders: Feeder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const feedersApi = {
  getFeeders: async (filters: FeederFilters = {}): Promise<FeederResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    return apiClient.get<FeederResponse>(`/feeders?${params.toString()}`);
  },

  getFeeder: async (id: string): Promise<Feeder> => {
    return apiClient.get<Feeder>(`/feeders/${id}`);
  },

  updateFeeder: async (id: string, data: Partial<Feeder>): Promise<Feeder> => {
    return apiClient.put<Feeder>(`/feeders/${id}`, data);
  },

  createFeeder: async (data: Omit<Feeder, 'id'>): Promise<Feeder> => {
    return apiClient.post<Feeder>('/feeders', data);
  },

  deleteFeeder: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/feeders/${id}`);
  },
};