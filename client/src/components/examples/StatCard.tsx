import StatCard from "../StatCard";
import { Activity, AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Active Events"
        value={12}
        icon={AlertCircle}
        severity="critical"
        trend={{ value: "3 from last hour", isPositive: false }}
      />
      <StatCard
        title="Healthy Feeders"
        value={145}
        icon={CheckCircle}
        severity="normal"
        trend={{ value: "98.6% uptime", isPositive: true }}
      />
      <StatCard
        title="Active Alerts"
        value={8}
        icon={Activity}
        severity="high"
      />
      <StatCard
        title="Avg Response Time"
        value="12 min"
        icon={Clock}
        severity="medium"
        trend={{ value: "2 min improvement", isPositive: true }}
      />
    </div>
  );
}
