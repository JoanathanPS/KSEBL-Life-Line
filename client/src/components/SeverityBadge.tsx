import { Badge } from "@/components/ui/badge";

interface SeverityBadgeProps {
  severity: "critical" | "high" | "medium" | "low";
  className?: string;
}

const severityConfig = {
  critical: {
    label: "Critical",
    className: "bg-severity-critical text-white border-severity-critical",
  },
  high: {
    label: "High",
    className: "bg-severity-high text-white border-severity-high",
  },
  medium: {
    label: "Medium",
    className: "bg-severity-medium text-black border-severity-medium",
  },
  low: {
    label: "Low",
    className: "bg-severity-low text-white border-severity-low",
  },
};

export default function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = severityConfig[severity];

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${className || ""}`}
      data-testid={`badge-severity-${severity}`}
    >
      {config.label}
    </Badge>
  );
}
