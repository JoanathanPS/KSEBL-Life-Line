export * from './auth';
export * from './notification';

export interface Event {
  id: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'investigating' | 'resolved' | 'false_alarm';
  type: 'line_break' | 'voltage_drop' | 'power_outage' | 'equipment_failure';
  description: string;
  affectedCustomers: number;
  estimatedRestorationTime?: string;
  assignedTo?: string;
  substationId: string;
  feederId: string;
}

export interface Substation {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  capacity: number;
  voltage: number;
  status: 'operational' | 'maintenance' | 'fault';
  lastInspection: string;
  nextInspection: string;
  feeders: Feeder[];
}

export interface Feeder {
  id: string;
  name: string;
  substationId: string;
  capacity: number;
  voltage: number;
  status: 'operational' | 'maintenance' | 'fault';
  length: number;
  customers: number;
  lastMaintenance: string;
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
}

export interface ChartData {
  name: string;
  value: number;
  timestamp?: string;
}

export interface MapMarker {
  id: string;
  position: [number, number];
  type: 'event' | 'substation' | 'feeder';
  data: Event | Substation | Feeder;
}