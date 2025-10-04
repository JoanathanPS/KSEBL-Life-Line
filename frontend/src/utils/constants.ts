export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_EVENTS: '/dashboard/recent-events',
    EVENT_TRENDS: '/dashboard/event-trends',
    SUBSTATION_STATUS: '/dashboard/substation-status',
    FEEDER_STATUS: '/dashboard/feeder-status',
  },
  EVENTS: {
    LIST: '/events',
    DETAIL: '/events/:id',
    UPDATE: '/events/:id',
    ASSIGN: '/events/:id/assign',
    RESOLVE: '/events/:id/resolve',
    CREATE: '/events',
  },
  SUBSTATIONS: {
    LIST: '/substations',
    DETAIL: '/substations/:id',
    UPDATE: '/substations/:id',
    CREATE: '/substations',
    DELETE: '/substations/:id',
  },
  FEEDERS: {
    LIST: '/feeders',
    DETAIL: '/feeders/:id',
    UPDATE: '/feeders/:id',
    CREATE: '/feeders',
    DELETE: '/feeders/:id',
  },
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  FIELD_CREW: 'field_crew',
} as const;

export const EVENT_TYPES = {
  LINE_BREAK: 'line_break',
  VOLTAGE_DROP: 'voltage_drop',
  POWER_OUTAGE: 'power_outage',
  EQUIPMENT_FAILURE: 'equipment_failure',
} as const;

export const EVENT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const EVENT_STATUS = {
  ACTIVE: 'active',
  INVESTIGATING: 'investigating',
  RESOLVED: 'resolved',
  FALSE_ALARM: 'false_alarm',
} as const;

export const SUBSTATION_STATUS = {
  OPERATIONAL: 'operational',
  MAINTENANCE: 'maintenance',
  FAULT: 'fault',
} as const;

export const FEEDER_STATUS = {
  OPERATIONAL: 'operational',
  MAINTENANCE: 'maintenance',
  FAULT: 'fault',
} as const;

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export const DATE_FORMATS = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
} as const;

export const MAP_CONFIG = {
  DEFAULT_CENTER: [10.8505, 76.2711], // Kerala center
  DEFAULT_ZOOM: 8,
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
} as const;

export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#6366f1',
  GRAY: '#6b7280',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

export const DEBOUNCE_DELAY = 300;
export const THROTTLE_DELAY = 1000;

export const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  SPREADSHEET: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
} as const;