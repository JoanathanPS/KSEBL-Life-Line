import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  severity?: "critical" | "high" | "medium" | "normal";
}

const severityColors = {
  critical: "border-l-severity-critical",
  high: "border-l-severity-high",
  medium: "border-l-severity-medium",
  normal: "border-l-severity-normal",
};

export default function StatCard({ title, value, icon: Icon, trend, severity = "normal" }: StatCardProps) {
  return (
    <Card className={`border-l-4 ${severityColors[severity]}`} data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {trend && (
              <p className={`text-xs mt-2 ${trend.isPositive ? "text-severity-normal" : "text-severity-critical"}`}>
                {trend.isPositive ? "↑" : "↓"} {trend.value}
              </p>
            )}
          </div>
          <div className="ml-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
