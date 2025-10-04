import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import StatusBadge from "./StatusBadge";
import SeverityBadge from "./SeverityBadge";
import { Clock, MapPin } from "lucide-react";

interface Event {
  id: string;
  feederName: string;
  feederCode: string;
  detectedAt: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "detected" | "acknowledged" | "crew_dispatched" | "resolved";
  location: string;
  confidence: number;
}

interface EventFeedProps {
  events: Event[];
  onViewEvent?: (id: string) => void;
}

export default function EventFeed({ events, onViewEvent }: EventFeedProps) {
  return (
    <Card className="h-[600px] flex flex-col" data-testid="card-event-feed">
      <div className="p-6 border-b border-card-border">
        <h3 className="text-lg font-semibold">Recent Events</h3>
        <p className="text-sm text-muted-foreground mt-1">Real-time line break detections</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className={`border-l-4 border-l-severity-${event.severity} bg-card p-4 rounded-md hover-elevate`}
              data-testid={`event-item-${event.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold font-mono text-sm">{event.feederCode}</h4>
                    <SeverityBadge severity={event.severity} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{event.feederName}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.detectedAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </span>
                    <span>Confidence: {event.confidence}%</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={event.status} />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewEvent?.(event.id)}
                    data-testid={`button-view-event-${event.id}`}
                  >
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
