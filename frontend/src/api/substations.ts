import { apiClient } from './client';
import { Substation } from '../types';

export interface SubstationFilters {
  status?: string;
  voltage?: number;
  page?: number;
  limit?: number;
}

export interface SubstationResponse {
  substations: Substation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const substationsApi = {
  getSubstations: async (filters: SubstationFilters = {}): Promise<SubstationResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    return apiClient.get<SubstationResponse>(`/substations?${params.toString()}`);
  },

  getSubstation: async (id: string): Promise<Substation> => {
    return apiClient.get<Substation>(`/substations/${id}`);
  },

  updateSubstation: async (id: string, data: Partial<Substation>): Promise<Substation> => {
    return apiClient.put<Substation>(`/substations/${id}`, data);
  },

  createSubstation: async (data: Omit<Substation, 'id'>): Promise<Substation> => {
    return apiClient.post<Substation>('/substations', data);
  },

  deleteSubstation: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/substations/${id}`);
  },
};