import React, { useEffect, useState } from 'react';
import { StatsCard } from '../components/StatsCard';
import { AlertPanel } from '../components/AlertPanel';
import { LiveMap } from '../components/LiveMap';
import { EventTimeline } from '../components/EventTimeline';
import { WaveformChart } from '../components/WaveformChart';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  Activity, 
  AlertTriangle, 
  Building2, 
  Zap, 
  Users,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { DashboardStats, Event, Substation, Feeder } from '../types';
import { dashboardApi } from '../api/dashboard';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [substations, setSubstations] = useState<Substation[]>([]);
  const [feeders, setFeeders] = useState<Feeder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock waveform data
  const waveformData = [
    { timestamp: '2024-01-01T00:00:00Z', voltage: 220, current: 15, frequency: 50 },
    { timestamp: '2024-01-01T00:01:00Z', voltage: 218, current: 16, frequency: 49.8 },
    { timestamp: '2024-01-01T00:02:00Z', voltage: 222, current: 14, frequency: 50.1 },
    { timestamp: '2024-01-01T00:03:00Z', voltage: 219, current: 17, frequency: 49.9 },
    { timestamp: '2024-01-01T00:04:00Z', voltage: 221, current: 15, frequency: 50.0 },
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Mock data for now - replace with actual API calls
        setStats({
          totalEvents: 156,
          activeEvents: 12,
          resolvedEvents: 144,
          totalSubstations: 45,
          operationalSubstations: 42,
          totalFeeders: 180,
          operationalFeeders: 175,
          affectedCustomers: 1250,
        });

        setRecentEvents([
          {
            id: '1',
            timestamp: '2024-01-15T10:30:00Z',
            location: { latitude: 10.8505, longitude: 76.2711, address: 'Thiruvananthapuram' },
            severity: 'high',
            status: 'active',
            type: 'line_break',
            description: 'LT line break detected in residential area',
            affectedCustomers: 45,
            substationId: 'sub-1',
            feederId: 'feed-1',
          },
          {
            id: '2',
            timestamp: '2024-01-15T09:15:00Z',
            location: { latitude: 10.8505, longitude: 76.2711, address: 'Kochi' },
            severity: 'medium',
            status: 'investigating',
            type: 'voltage_drop',
            description: 'Voltage drop in commercial area',
            affectedCustomers: 23,
            substationId: 'sub-2',
            feederId: 'feed-2',
          },
        ]);

        setSubstations([
          {
            id: 'sub-1',
            name: 'Thiruvananthapuram SS',
            location: { latitude: 10.8505, longitude: 76.2711, address: 'Thiruvananthapuram' },
            capacity: 50,
            voltage: 11,
            status: 'operational',
            lastInspection: '2024-01-01',
            nextInspection: '2024-04-01',
            feeders: [],
          },
          {
            id: 'sub-2',
            name: 'Kochi SS',
            location: { latitude: 9.9312, longitude: 76.2673, address: 'Kochi' },
            capacity: 75,
            voltage: 11,
            status: 'operational',
            lastInspection: '2024-01-05',
            nextInspection: '2024-04-05',
            feeders: [],
          },
        ]);

        setFeeders([
          {
            id: 'feed-1',
            name: 'TVM-FEEDER-01',
            substationId: 'sub-1',
            capacity: 25,
            voltage: 0.4,
            status: 'operational',
            length: 5.2,
            customers: 150,
            lastMaintenance: '2024-01-10',
          },
          {
            id: 'feed-2',
            name: 'KOCHI-FEEDER-02',
            substationId: 'sub-2',
            capacity: 30,
            voltage: 0.4,
            status: 'operational',
            length: 6.8,
            customers: 200,
            lastMaintenance: '2024-01-12',
          },
        ]);

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of Kerala LT Line Break Detection System</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Events"
          value={stats?.totalEvents || 0}
          change={12}
          changeType="increase"
          icon={Activity}
        />
        <StatsCard
          title="Active Events"
          value={stats?.activeEvents || 0}
          change={-8}
          changeType="decrease"
          icon={AlertTriangle}
        />
        <StatsCard
          title="Substations"
          value={`${stats?.operationalSubstations || 0}/${stats?.totalSubstations || 0}`}
          icon={Building2}
        />
        <StatsCard
          title="Affected Customers"
          value={stats?.affectedCustomers || 0}
          change={-15}
          changeType="decrease"
          icon={Users}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Map */}
        <div className="lg:col-span-2">
          <Card className="h-96">
            <CardHeader>
              <CardTitle>Live System Map</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <LiveMap 
                events={recentEvents} 
                substations={substations} 
                feeders={feeders}
                className="h-80"
              />
            </CardContent>
          </Card>
        </div>

        {/* Alert Panel */}
        <div>
          <AlertPanel events={recentEvents} className="h-96" />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Timeline */}
        <EventTimeline events={recentEvents} className="h-96" />
        
        {/* Waveform Chart */}
        <WaveformChart data={waveformData} className="h-96" />
      </div>
    </div>
  );
};

export default DashboardPage;