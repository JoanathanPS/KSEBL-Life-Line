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
  Clock,
  Shield
} from 'lucide-react';
import { 
  dashboardStats, 
  keralaOutages, 
  keralaSubstations, 
  keralaFeeders
} from '../utils/mockData';

const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Mock waveform data
  const waveformData = [
    { timestamp: '2024-01-25T00:00:00Z', voltage: 220, current: 15, frequency: 50 },
    { timestamp: '2024-01-25T00:01:00Z', voltage: 218, current: 16, frequency: 49.8 },
    { timestamp: '2024-01-25T00:02:00Z', voltage: 222, current: 14, frequency: 50.1 },
    { timestamp: '2024-01-25T00:03:00Z', voltage: 219, current: 17, frequency: 49.9 },
    { timestamp: '2024-01-25T00:04:00Z', voltage: 221, current: 15, frequency: 50.0 },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
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
        <h1 className="text-3xl font-bold text-gray-900">KSEBL Life Line Dashboard</h1>
        <p className="text-gray-600">Kerala State Electricity Board - Real-time Monitoring</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Events"
          value={dashboardStats.totalEvents}
          change={12}
          changeType="increase"
          icon={Activity}
        />
        <StatsCard
          title="Active Events"
          value={dashboardStats.activeEvents}
          change={-8}
          changeType="decrease"
          icon={AlertTriangle}
        />
        <StatsCard
          title="Substations"
          value={`${dashboardStats.operationalSubstations}/${dashboardStats.totalSubstations}`}
          icon={Building2}
        />
        <StatsCard
          title="Affected Customers"
          value={dashboardStats.affectedCustomers}
          change={-15}
          changeType="decrease"
          icon={Users}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Avg Response Time"
          value={`${dashboardStats.avgResponseTime} min`}
          icon={Clock}
        />
        <StatsCard
          title="System Uptime"
          value={`${dashboardStats.systemUptime}%`}
          icon={Shield}
        />
        <StatsCard
          title="Operational Feeders"
          value={`${dashboardStats.operationalFeeders}/${dashboardStats.totalFeeders}`}
          icon={Zap}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Map */}
        <div className="lg:col-span-2">
          <Card className="h-96">
            <CardHeader>
              <CardTitle>Kerala Power Grid Map</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <LiveMap 
                events={keralaOutages} 
                substations={keralaSubstations} 
                feeders={keralaFeeders}
                className="h-80"
              />
            </CardContent>
          </Card>
        </div>

        {/* Alert Panel */}
        <div>
          <AlertPanel events={keralaOutages} className="h-96" />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Timeline */}
        <EventTimeline events={keralaOutages} className="h-96" />
        
        {/* Waveform Chart */}
        <WaveformChart data={waveformData} className="h-96" />
      </div>
    </div>
  );
};

export default DashboardPage;