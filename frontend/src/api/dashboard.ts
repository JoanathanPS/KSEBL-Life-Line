import { apiClient } from './client';
import { DashboardStats, Event, ChartData } from '../types';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    return apiClient.get<DashboardStats>('/dashboard/stats');
  },

  getRecentEvents: async (limit: number = 10): Promise<Event[]> => {
    return apiClient.get<Event[]>(`/dashboard/recent-events?limit=${limit}`);
  },

  getEventTrends: async (days: number = 7): Promise<ChartData[]> => {
    return apiClient.get<ChartData[]>(`/dashboard/event-trends?days=${days}`);
  },

  getSubstationStatus: async (): Promise<ChartData[]> => {
    return apiClient.get<ChartData[]>('/dashboard/substation-status');
  },

  getFeederStatus: async (): Promise<ChartData[]> => {
    return apiClient.get<ChartData[]>('/dashboard/feeder-status');
  },
};