import { useState } from "react";
import EventsTable from "@/components/EventsTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  //todo: remove mock functionality
  const mockEvents = [
    {
      id: "1",
      feederCode: "TVM-NF-001",
      feederName: "Thiruvananthapuram North Feeder",
      detectedAt: "2024-10-04 14:23:15",
      severity: "critical" as const,
      status: "detected" as const,
      location: "12.5 km",
      confidence: 94,
    },
    {
      id: "2",
      feederCode: "KOC-IZ-042",
      feederName: "Kochi Industrial Zone",
      detectedAt: "2024-10-04 14:08:42",
      severity: "high" as const,
      status: "acknowledged" as const,
      location: "8.3 km",
      confidence: 87,
    },
    {
      id: "3",
      feederCode: "KZD-UA-018",
      feederName: "Kozhikode Urban Area",
      detectedAt: "2024-10-04 13:15:30",
      severity: "medium" as const,
      status: "crew_dispatched" as const,
      location: "15.2 km",
      confidence: 91,
    },
    {
      id: "4",
      feederCode: "PKD-RZ-025",
      feederName: "Palakkad Rural Zone",
      detectedAt: "2024-10-04 12:45:18",
      severity: "low" as const,
      status: "resolved" as const,
      location: "5.7 km",
      confidence: 88,
    },
    {
      id: "5",
      feederCode: "MLM-CT-033",
      feederName: "Malappuram City Center",
      detectedAt: "2024-10-04 11:30:05",
      severity: "high" as const,
      status: "crew_dispatched" as const,
      location: "9.2 km",
      confidence: 92,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Line Break Events</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage all detected line break events</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by feeder code or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-events"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="detected">Detected</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
            <SelectItem value="crew_dispatched">Crew Dispatched</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-severity-filter">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" data-testid="button-filter">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <EventsTable
        events={mockEvents}
        onViewEvent={(id) => console.log("View event:", id)}
        onAssignCrew={(id) => console.log("Assign crew to event:", id)}
      />
    </div>
  );
}
