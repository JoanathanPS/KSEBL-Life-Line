import StatusBadge from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="detected" />
      <StatusBadge status="acknowledged" />
      <StatusBadge status="crew_dispatched" />
      <StatusBadge status="resolved" />
    </div>
  );
}
