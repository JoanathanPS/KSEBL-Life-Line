import { apiClient } from './client';
import { Event } from '../types';

export interface EventFilters {
  status?: string;
  severity?: string;
  type?: string;
  substationId?: string;
  feederId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface EventResponse {
  events: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const eventsApi = {
  getEvents: async (filters: EventFilters = {}): Promise<EventResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    return apiClient.get<EventResponse>(`/events?${params.toString()}`);
  },

  getEvent: async (id: string): Promise<Event> => {
    return apiClient.get<Event>(`/events/${id}`);
  },

  updateEvent: async (id: string, data: Partial<Event>): Promise<Event> => {
    return apiClient.put<Event>(`/events/${id}`, data);
  },

  assignEvent: async (id: string, assignedTo: string): Promise<Event> => {
    return apiClient.patch<Event>(`/events/${id}/assign`, { assignedTo });
  },

  resolveEvent: async (id: string, resolution: string): Promise<Event> => {
    return apiClient.patch<Event>(`/events/${id}/resolve`, { resolution });
  },

  createEvent: async (data: Omit<Event, 'id'>): Promise<Event> => {
    return apiClient.post<Event>('/events', data);
  },
};