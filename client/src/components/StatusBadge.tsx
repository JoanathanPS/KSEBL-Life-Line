import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

interface StatusBadgeProps {
  status: "detected" | "acknowledged" | "crew_dispatched" | "resolved";
  className?: string;
}

const statusConfig = {
  detected: {
    label: "Detected",
    variant: "destructive" as const,
    icon: AlertCircle,
  },
  acknowledged: {
    label: "Acknowledged",
    variant: "secondary" as const,
    icon: Info,
  },
  crew_dispatched: {
    label: "Crew Dispatched",
    variant: "default" as const,
    icon: AlertTriangle,
  },
  resolved: {
    label: "Resolved",
    variant: "outline" as const,
    icon: CheckCircle,
  },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={className} data-testid={`badge-status-${status}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}
