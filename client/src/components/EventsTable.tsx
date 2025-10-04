import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import SeverityBadge from "./SeverityBadge";
import { Eye, UserPlus } from "lucide-react";

interface Event {
  id: string;
  feederCode: string;
  feederName: string;
  detectedAt: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "detected" | "acknowledged" | "crew_dispatched" | "resolved";
  location: string;
  confidence: number;
}

interface EventsTableProps {
  events: Event[];
  onViewEvent?: (id: string) => void;
  onAssignCrew?: (id: string) => void;
}

export default function EventsTable({ events, onViewEvent, onAssignCrew }: EventsTableProps) {
  return (
    <div className="border border-card-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Feeder Code</TableHead>
            <TableHead className="font-semibold">Feeder Name</TableHead>
            <TableHead className="font-semibold">Detected At</TableHead>
            <TableHead className="font-semibold">Location</TableHead>
            <TableHead className="font-semibold">Severity</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Confidence</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id} data-testid={`row-event-${event.id}`}>
              <TableCell className="font-mono text-sm font-medium">{event.feederCode}</TableCell>
              <TableCell>{event.feederName}</TableCell>
              <TableCell className="text-muted-foreground">{event.detectedAt}</TableCell>
              <TableCell className="text-muted-foreground">{event.location}</TableCell>
              <TableCell>
                <SeverityBadge severity={event.severity} />
              </TableCell>
              <TableCell>
                <StatusBadge status={event.status} />
              </TableCell>
              <TableCell>
                <span className="font-mono text-sm">{event.confidence}%</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewEvent?.(event.id)}
                    data-testid={`button-view-${event.id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {event.status === "detected" && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => onAssignCrew?.(event.id)}
                      data-testid={`button-assign-${event.id}`}
                    >
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
