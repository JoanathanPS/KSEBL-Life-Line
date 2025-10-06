import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDevelopment 
  ? '/api/v1' 
  : process.env.REACT_APP_API_URL || 'https://your-api-domain.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        localStorage.setItem('accessToken', data.accessToken);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  message?: string;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiClient.post('/auth/login', { email, password });
  },
  
  register: async (userData: any) => {
    return apiClient.post('/auth/register', userData);
  },
  
  logout: async () => {
    return apiClient.post('/auth/logout');
  },
  
  refreshToken: async (refreshToken: string) => {
    return apiClient.post('/auth/refresh-token', { refreshToken });
  },
};

// Events API
export const eventsAPI = {
  getEvents: async (params?: any) => {
    return apiClient.get('/events', { params });
  },
  
  getEventById: async (id: string) => {
    return apiClient.get(`/events/${id}`);
  },
  
  getActiveEvents: async () => {
    return apiClient.get('/events/active');
  },
  
  acknowledgeEvent: async (id: string) => {
    return apiClient.post(`/events/${id}/acknowledge`);
  },
  
  resolveEvent: async (id: string, notes: string) => {
    return apiClient.post(`/events/${id}/resolve`, { resolutionNotes: notes });
  },
};

// Dashboard API
export const dashboardAPI = {
  getSummary: async () => {
    return apiClient.get('/dashboard/summary');
  },
  
  getMapData: async () => {
    return apiClient.get('/dashboard/map-data');
  },
};

// Substations API
export const substationsAPI = {
  getSubstations: async () => {
    return apiClient.get('/substations');
  },
  
  getSubstationById: async (id: string) => {
    return apiClient.get(`/substations/${id}`);
  },
};

// Feeders API
export const feedersAPI = {
  getFeeders: async () => {
    return apiClient.get('/feeders');
  },
  
  getFeederById: async (id: string) => {
    return apiClient.get(`/feeders/${id}`);
  },
};
