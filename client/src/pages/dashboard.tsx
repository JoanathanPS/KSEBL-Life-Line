import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/StatCard";
import EventFeed from "@/components/EventFeed";
import WaveformChart from "@/components/WaveformChart";
import { Activity, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { LineBreakEvent } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface DashboardStats {
  activeEvents: number;
  healthyFeeders: number;
  totalFeeders: number;
  activeAlerts: number;
  avgResponseTime: string;
  totalSubstations: number;
}

interface DashboardEventsResponse {
  events: (LineBreakEvent & { feederName?: string; feederCode?: string })[];
}

export default function DashboardPage() {
  const { toast } = useToast();

  const { data: statsData, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000,
  });

  const { data: eventsData, isLoading: isLoadingEvents } = useQuery<DashboardEventsResponse>({
    queryKey: ["/api/dashboard/recent-events"],
    refetchInterval: 30000,
  });

  const mockWaveformData = Array.from({ length: 50 }, (_, i) => ({
    time: i * 2,
    voltageR: 230 + Math.sin(i * 0.5) * 20 + (Math.random() - 0.5) * 10,
    voltageY: 230 + Math.sin(i * 0.5 + 2.09) * 20 + (Math.random() - 0.5) * 10,
    voltageB: 230 + Math.sin(i * 0.5 + 4.18) * 20 + (Math.random() - 0.5) * 10,
    currentR: 15 + Math.sin(i * 0.5) * 3 + (Math.random() - 0.5) * 2,
    currentY: 15 + Math.sin(i * 0.5 + 2.09) * 3 + (Math.random() - 0.5) * 2,
    currentB: 15 + Math.sin(i * 0.5 + 4.18) * 3 + (Math.random() - 0.5) * 2,
  }));

  const transformedEvents = eventsData?.events.map((event) => ({
    id: event.id,
    feederName: event.feederName || "Unknown Feeder",
    feederCode: event.feederCode || "N/A",
    detectedAt: event.detectedAt ? formatDistanceToNow(new Date(event.detectedAt), { addSuffix: true }) : "Unknown",
    severity: (event.severity || "low") as "critical" | "high" | "medium" | "low",
    status: (event.status || "detected") as "detected" | "acknowledged" | "crew_dispatched" | "resolved",
    location: event.estimatedLocationKm ? `${event.estimatedLocationKm} km` : "Unknown",
    confidence: event.confidenceScore ? Math.round(Number(event.confidenceScore) * 100) : 0,
  })) || [];

  const uptimePercentage = statsData?.totalFeeders && statsData?.healthyFeeders
    ? ((statsData.healthyFeeders / statsData.totalFeeders) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Grid Monitoring Dashboard</h1>
        <p className="text-muted-foreground mt-1">Real-time overview of Kerala's power distribution network</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoadingStats ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-32 w-full" />
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard
              title="Active Events"
              value={statsData?.activeEvents || 0}
              icon={AlertCircle}
              severity="critical"
              data-testid="stat-active-events"
            />
            <StatCard
              title="Healthy Feeders"
              value={statsData?.healthyFeeders || 0}
              icon={CheckCircle}
              severity="normal"
              trend={{ value: `${uptimePercentage}% uptime`, isPositive: true }}
              data-testid="stat-healthy-feeders"
            />
            <StatCard
              title="Active Alerts"
              value={statsData?.activeAlerts || 0}
              icon={Activity}
              severity="high"
              data-testid="stat-active-alerts"
            />
            <StatCard
              title="Avg Response Time"
              value={statsData?.avgResponseTime || "N/A"}
              icon={Clock}
              severity="medium"
              data-testid="stat-response-time"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoadingEvents ? (
          <Skeleton className="h-[600px] w-full" />
        ) : (
          <EventFeed
            events={transformedEvents}
            onViewEvent={(id) => console.log("View event:", id)}
          />
        )}
        <WaveformChart
          data={mockWaveformData}
          title="Recent Waveform Analysis - TVM-NF-001"
          type="voltage"
        />
      </div>
    </div>
  );
}
