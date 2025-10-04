import StatCard from "@/components/StatCard";
import EventFeed from "@/components/EventFeed";
import WaveformChart from "@/components/WaveformChart";
import { Activity, AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function DashboardPage() {
  //todo: remove mock functionality
  const mockStats = {
    activeEvents: 12,
    healthyFeeders: 145,
    activeAlerts: 8,
    avgResponseTime: "12 min",
  };

  //todo: remove mock functionality
  const mockEvents = [
    {
      id: "1",
      feederName: "Thiruvananthapuram North Feeder",
      feederCode: "TVM-NF-001",
      detectedAt: "2 min ago",
      severity: "critical" as const,
      status: "detected" as const,
      location: "12.5 km",
      confidence: 94,
    },
    {
      id: "2",
      feederName: "Kochi Industrial Zone",
      feederCode: "KOC-IZ-042",
      detectedAt: "15 min ago",
      severity: "high" as const,
      status: "acknowledged" as const,
      location: "8.3 km",
      confidence: 87,
    },
    {
      id: "3",
      feederName: "Kozhikode Urban Area",
      feederCode: "KZD-UA-018",
      detectedAt: "1 hour ago",
      severity: "medium" as const,
      status: "crew_dispatched" as const,
      location: "15.2 km",
      confidence: 91,
    },
    {
      id: "4",
      feederName: "Palakkad Rural Zone",
      feederCode: "PKD-RZ-025",
      detectedAt: "2 hours ago",
      severity: "low" as const,
      status: "resolved" as const,
      location: "5.7 km",
      confidence: 88,
    },
  ];

  //todo: remove mock functionality
  const mockWaveformData = Array.from({ length: 50 }, (_, i) => ({
    time: i * 2,
    voltageR: 230 + Math.sin(i * 0.5) * 20 + (Math.random() - 0.5) * 10,
    voltageY: 230 + Math.sin(i * 0.5 + 2.09) * 20 + (Math.random() - 0.5) * 10,
    voltageB: 230 + Math.sin(i * 0.5 + 4.18) * 20 + (Math.random() - 0.5) * 10,
    currentR: 15 + Math.sin(i * 0.5) * 3 + (Math.random() - 0.5) * 2,
    currentY: 15 + Math.sin(i * 0.5 + 2.09) * 3 + (Math.random() - 0.5) * 2,
    currentB: 15 + Math.sin(i * 0.5 + 4.18) * 3 + (Math.random() - 0.5) * 2,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Grid Monitoring Dashboard</h1>
        <p className="text-muted-foreground mt-1">Real-time overview of Kerala's power distribution network</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Events"
          value={mockStats.activeEvents}
          icon={AlertCircle}
          severity="critical"
          trend={{ value: "3 from last hour", isPositive: false }}
        />
        <StatCard
          title="Healthy Feeders"
          value={mockStats.healthyFeeders}
          icon={CheckCircle}
          severity="normal"
          trend={{ value: "98.6% uptime", isPositive: true }}
        />
        <StatCard
          title="Active Alerts"
          value={mockStats.activeAlerts}
          icon={Activity}
          severity="high"
        />
        <StatCard
          title="Avg Response Time"
          value={mockStats.avgResponseTime}
          icon={Clock}
          severity="medium"
          trend={{ value: "2 min improvement", isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EventFeed
          events={mockEvents}
          onViewEvent={(id) => console.log("View event:", id)}
        />
        <WaveformChart
          data={mockWaveformData}
          title="Recent Waveform Analysis - TVM-NF-001"
          type="voltage"
        />
      </div>
    </div>
  );
}
