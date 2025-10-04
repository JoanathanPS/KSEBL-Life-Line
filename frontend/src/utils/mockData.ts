// Kerala State Electricity Board Mock Data

export interface KeralaDistrict {
  id: string;
  name: string;
  coordinates: [number, number];
  population: number;
  area: number;
}

export interface Substation {
  id: string;
  name: string;
  district: string;
  coordinates: [number, number];
  capacity: number;
  voltage: number;
  status: 'operational' | 'maintenance' | 'fault';
  lastInspection: string;
  nextInspection: string;
  feeders: number;
}

export interface Feeder {
  id: string;
  name: string;
  substationId: string;
  district: string;
  capacity: number;
  voltage: number;
  status: 'operational' | 'maintenance' | 'fault';
  length: number;
  customers: number;
  lastMaintenance: string;
}

export interface OutageEvent {
  id: string;
  timestamp: string;
  district: string;
  substation: string;
  feeder: string;
  coordinates: [number, number];
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'investigating' | 'resolved' | 'false_alarm';
  type: 'line_break' | 'voltage_drop' | 'power_outage' | 'equipment_failure';
  description: string;
  affectedCustomers: number;
  estimatedRestorationTime?: string;
  assignedTo?: string;
}

export interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  resolvedEvents: number;
  totalSubstations: number;
  operationalSubstations: number;
  totalFeeders: number;
  operationalFeeders: number;
  affectedCustomers: number;
  avgResponseTime: number;
  systemUptime: number;
}

// Kerala Districts Data
export const keralaDistricts: KeralaDistrict[] = [
  { id: 'tvm', name: 'Thiruvananthapuram', coordinates: [8.5241, 76.9366], population: 3301427, area: 2192 },
  { id: 'klm', name: 'Kollam', coordinates: [8.8932, 76.6141], population: 2635375, area: 2498 },
  { id: 'ptm', name: 'Pathanamthitta', coordinates: [9.2648, 76.7870], population: 1197412, area: 2642 },
  { id: 'alp', name: 'Alappuzha', coordinates: [9.4981, 76.3388], population: 2127789, area: 1414 },
  { id: 'ktm', name: 'Kottayam', coordinates: [9.5947, 76.5289], population: 1979384, area: 2203 },
  { id: 'idk', name: 'Idukki', coordinates: [9.8497, 76.9370], population: 1108974, area: 4358 },
  { id: 'ern', name: 'Ernakulam', coordinates: [9.9816, 76.2999], population: 3282388, area: 3068 },
  { id: 'tsr', name: 'Thrissur', coordinates: [10.5276, 76.2144], population: 3121200, area: 3032 },
  { id: 'plk', name: 'Palakkad', coordinates: [10.7867, 76.6548], population: 2810892, area: 4480 },
  { id: 'mlp', name: 'Malappuram', coordinates: [11.0509, 76.0711], population: 4112920, area: 3550 },
  { id: 'koz', name: 'Kozhikode', coordinates: [11.2588, 75.7804], population: 3086293, area: 2344 },
  { id: 'wnd', name: 'Wayanad', coordinates: [11.6850, 76.1319], population: 816558, area: 2131 },
  { id: 'knr', name: 'Kannur', coordinates: [11.8745, 75.3704], population: 2523003, area: 2966 },
  { id: 'ksd', name: 'Kasaragod', coordinates: [12.4984, 74.9899], population: 1307375, area: 1992 },
];

// Substations Data
export const keralaSubstations: Substation[] = [
  {
    id: 'tvm-ss-001',
    name: 'Thiruvananthapuram 220kV SS',
    district: 'Thiruvananthapuram',
    coordinates: [8.5241, 76.9366],
    capacity: 100,
    voltage: 220,
    status: 'operational',
    lastInspection: '2024-01-15',
    nextInspection: '2024-04-15',
    feeders: 8
  },
  {
    id: 'klm-ss-001',
    name: 'Kollam 110kV SS',
    district: 'Kollam',
    coordinates: [8.8932, 76.6141],
    capacity: 75,
    voltage: 110,
    status: 'operational',
    lastInspection: '2024-01-10',
    nextInspection: '2024-04-10',
    feeders: 6
  },
  {
    id: 'ern-ss-001',
    name: 'Ernakulam 400kV SS',
    district: 'Ernakulam',
    coordinates: [9.9816, 76.2999],
    capacity: 200,
    voltage: 400,
    status: 'operational',
    lastInspection: '2024-01-20',
    nextInspection: '2024-04-20',
    feeders: 12
  },
  {
    id: 'tsr-ss-001',
    name: 'Thrissur 110kV SS',
    district: 'Thrissur',
    coordinates: [10.5276, 76.2144],
    capacity: 80,
    voltage: 110,
    status: 'maintenance',
    lastInspection: '2024-01-05',
    nextInspection: '2024-04-05',
    feeders: 7
  },
  {
    id: 'koz-ss-001',
    name: 'Kozhikode 220kV SS',
    district: 'Kozhikode',
    coordinates: [11.2588, 75.7804],
    capacity: 120,
    voltage: 220,
    status: 'operational',
    lastInspection: '2024-01-18',
    nextInspection: '2024-04-18',
    feeders: 9
  },
  {
    id: 'knr-ss-001',
    name: 'Kannur 110kV SS',
    district: 'Kannur',
    coordinates: [11.8745, 75.3704],
    capacity: 65,
    voltage: 110,
    status: 'fault',
    lastInspection: '2024-01-12',
    nextInspection: '2024-04-12',
    feeders: 5
  }
];

// Feeders Data
export const keralaFeeders: Feeder[] = [
  {
    id: 'tvm-fd-001',
    name: 'TVM-City-Feeder-01',
    substationId: 'tvm-ss-001',
    district: 'Thiruvananthapuram',
    capacity: 25,
    voltage: 11,
    status: 'operational',
    length: 8.5,
    customers: 1250,
    lastMaintenance: '2024-01-10'
  },
  {
    id: 'tvm-fd-002',
    name: 'TVM-Residential-Feeder-02',
    substationId: 'tvm-ss-001',
    district: 'Thiruvananthapuram',
    capacity: 30,
    voltage: 11,
    status: 'operational',
    length: 12.3,
    customers: 1800,
    lastMaintenance: '2024-01-15'
  },
  {
    id: 'klm-fd-001',
    name: 'KLM-Industrial-Feeder-01',
    substationId: 'klm-ss-001',
    district: 'Kollam',
    capacity: 40,
    voltage: 11,
    status: 'operational',
    length: 15.2,
    customers: 2200,
    lastMaintenance: '2024-01-08'
  },
  {
    id: 'ern-fd-001',
    name: 'ERN-Commercial-Feeder-01',
    substationId: 'ern-ss-001',
    district: 'Ernakulam',
    capacity: 50,
    voltage: 11,
    status: 'operational',
    length: 18.7,
    customers: 3200,
    lastMaintenance: '2024-01-20'
  },
  {
    id: 'tsr-fd-001',
    name: 'TSR-Agricultural-Feeder-01',
    substationId: 'tsr-ss-001',
    district: 'Thrissur',
    capacity: 35,
    voltage: 11,
    status: 'maintenance',
    length: 22.1,
    customers: 2800,
    lastMaintenance: '2024-01-05'
  },
  {
    id: 'koz-fd-001',
    name: 'KOZ-Tourist-Feeder-01',
    substationId: 'koz-ss-001',
    district: 'Kozhikode',
    capacity: 28,
    voltage: 11,
    status: 'operational',
    length: 9.8,
    customers: 1500,
    lastMaintenance: '2024-01-18'
  }
];

// Outage Events Data
export const keralaOutages: OutageEvent[] = [
  {
    id: 'out-001',
    timestamp: '2024-01-25T10:30:00Z',
    district: 'Thiruvananthapuram',
    substation: 'Thiruvananthapuram 220kV SS',
    feeder: 'TVM-City-Feeder-01',
    coordinates: [8.5241, 76.9366],
    severity: 'high',
    status: 'active',
    type: 'line_break',
    description: 'LT line break detected in city center due to tree fall',
    affectedCustomers: 450,
    estimatedRestorationTime: '2024-01-25T14:00:00Z',
    assignedTo: 'Field Crew Alpha'
  },
  {
    id: 'out-002',
    timestamp: '2024-01-25T09:15:00Z',
    district: 'Ernakulam',
    substation: 'Ernakulam 400kV SS',
    feeder: 'ERN-Commercial-Feeder-01',
    coordinates: [9.9816, 76.2999],
    severity: 'medium',
    status: 'investigating',
    type: 'voltage_drop',
    description: 'Voltage drop in commercial area affecting businesses',
    affectedCustomers: 280,
    estimatedRestorationTime: '2024-01-25T12:30:00Z',
    assignedTo: 'Field Crew Beta'
  },
  {
    id: 'out-003',
    timestamp: '2024-01-25T08:45:00Z',
    district: 'Kozhikode',
    substation: 'Kozhikode 220kV SS',
    feeder: 'KOZ-Tourist-Feeder-01',
    coordinates: [11.2588, 75.7804],
    severity: 'critical',
    status: 'resolved',
    type: 'power_outage',
    description: 'Complete power outage in tourist area resolved',
    affectedCustomers: 1200,
    estimatedRestorationTime: '2024-01-25T11:00:00Z',
    assignedTo: 'Field Crew Gamma'
  },
  {
    id: 'out-004',
    timestamp: '2024-01-25T07:20:00Z',
    district: 'Thrissur',
    substation: 'Thrissur 110kV SS',
    feeder: 'TSR-Agricultural-Feeder-01',
    coordinates: [10.5276, 76.2144],
    severity: 'low',
    status: 'active',
    type: 'equipment_failure',
    description: 'Transformer failure in agricultural zone',
    affectedCustomers: 150,
    estimatedRestorationTime: '2024-01-25T16:00:00Z',
    assignedTo: 'Field Crew Delta'
  },
  {
    id: 'out-005',
    timestamp: '2024-01-24T22:10:00Z',
    district: 'Kannur',
    substation: 'Kannur 110kV SS',
    feeder: 'KNR-Industrial-Feeder-01',
    coordinates: [11.8745, 75.3704],
    severity: 'high',
    status: 'investigating',
    type: 'line_break',
    description: 'High voltage line break near industrial area',
    affectedCustomers: 800,
    estimatedRestorationTime: '2024-01-25T18:00:00Z',
    assignedTo: 'Field Crew Epsilon'
  }
];

// Dashboard Statistics
export const dashboardStats: DashboardStats = {
  totalEvents: 156,
  activeEvents: 12,
  resolvedEvents: 144,
  totalSubstations: 45,
  operationalSubstations: 42,
  totalFeeders: 180,
  operationalFeeders: 175,
  affectedCustomers: 1250,
  avgResponseTime: 45, // minutes
  systemUptime: 98.5 // percentage
};

// Chart Data for Analytics
export const eventTrendsData = [
  { name: 'Mon', value: 12 },
  { name: 'Tue', value: 8 },
  { name: 'Wed', value: 15 },
  { name: 'Thu', value: 6 },
  { name: 'Fri', value: 18 },
  { name: 'Sat', value: 10 },
  { name: 'Sun', value: 7 },
];

export const severityDistributionData = [
  { name: 'Critical', value: 5, color: '#dc2626' },
  { name: 'High', value: 12, color: '#f59e0b' },
  { name: 'Medium', value: 25, color: '#3b82f6' },
  { name: 'Low', value: 8, color: '#22c55e' },
];

export const districtOutageData = [
  { name: 'Thiruvananthapuram', outages: 25 },
  { name: 'Ernakulam', outages: 18 },
  { name: 'Kozhikode', outages: 22 },
  { name: 'Thrissur', outages: 15 },
  { name: 'Kollam', outages: 12 },
  { name: 'Kannur', outages: 8 },
];

export const monthlyEventsData = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 38 },
  { name: 'Mar', value: 52 },
  { name: 'Apr', value: 41 },
  { name: 'May', value: 48 },
  { name: 'Jun', value: 55 },
];