import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Activity, CheckCircle, Zap, MapPin, Clock } from 'lucide-react';
import { dashboardAPI, eventsAPI } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import KeralaMap from '../components/live-map';

interface DashboardSummary {
  overview: {
    totalSubstations: number;
    activeFeeders: number;
    totalEventsToday: number;
    activeEvents: number;
    resolvedEvents: number;
    modelAccuracy: number;
  };
  recentEvents: Array<{
    id: string;
    feederName: string;
    detectedAt: string;
    status: string;
    severity: string;
    estimatedLocationKm: number;
  }>;
  alerts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  performance: {
    avgDetectionTimeMs: number;
    avgResponseTimeMinutes: number;
    falsePositiveRate: number;
  };
}

const StatCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  color 
}: {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: any;
  color: string;
}) => {
  const colorClasses = {
    red: 'text-red-600 bg-red-100',
    green: 'text-green-600 bg-green-100',
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{change}</p>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EventCard = ({ event }: { event: any }) => {
  const severityColors = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  };

  const statusColors = {
    detected: 'bg-red-100 text-red-800',
    acknowledged: 'bg-yellow-100 text-yellow-800',
    crew_dispatched: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">{event.feederName}</h3>
              <Badge className={severityColors[event.severity as keyof typeof severityColors]}>
                {event.severity}
              </Badge>
              <Badge className={statusColors[event.status as keyof typeof statusColors]}>
                {event.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.estimatedLocationKm.toFixed(2)} km
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(event.detectedAt).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              View
            </Button>
            {event.status === 'detected' && (
              <Button size="sm">
                Acknowledge
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getSummary();
      setSummary(data.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Line Break Detection Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.fullName} • Kerala State Electricity Board
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={
              summary.overview.activeEvents > 0
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }
          >
            <span className="w-2 h-2 mr-2 rounded-full bg-current animate-pulse" />
            {summary.overview.activeEvents > 0
              ? `${summary.overview.activeEvents} Active Alerts`
              : 'All Systems Normal'}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Events"
          value={summary.overview.activeEvents}
          change={
            summary.overview.activeEvents > 0
              ? `${summary.overview.activeEvents} requiring attention`
              : 'No active events'
          }
          trend={summary.overview.activeEvents > 0 ? 'up' : 'neutral'}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Events Today"
          value={summary.overview.totalEventsToday}
          change={`${summary.overview.resolvedEvents} resolved`}
          trend="neutral"
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Model Accuracy"
          value={`${(summary.overview.modelAccuracy * 100).toFixed(1)}%`}
          change={`${(summary.performance.falsePositiveRate * 100).toFixed(2)}% false positive`}
          trend="up"
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Avg Detection Time"
          value={`${summary.performance.avgDetectionTimeMs}ms`}
          change={`${summary.performance.avgResponseTimeMinutes.toFixed(1)}min response`}
          trend="down"
          icon={Zap}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Map */}
        <KeralaMap />

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.recentEvents.length > 0 ? (
                summary.recentEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent events</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Critical</span>
              <Badge className="bg-red-100 text-red-800">{summary.alerts.critical}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">High</span>
              <Badge className="bg-orange-100 text-orange-800">{summary.alerts.high}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Medium</span>
              <Badge className="bg-yellow-100 text-yellow-800">{summary.alerts.medium}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Low</span>
              <Badge className="bg-green-100 text-green-800">{summary.alerts.low}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{summary.overview.totalSubstations}</div>
              <div className="text-sm text-gray-600">Total Substations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary.overview.activeFeeders}</div>
              <div className="text-sm text-gray-600">Active Feeders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {summary.overview.modelAccuracy * 100}%
              </div>
              <div className="text-sm text-gray-600">Model Accuracy</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}