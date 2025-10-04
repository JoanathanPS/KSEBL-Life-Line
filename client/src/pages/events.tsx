import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { LineBreakEvent } from "@shared/schema";
import { format } from "date-fns";

interface EventsResponse {
  events: (LineBreakEvent & { feederName?: string; feederCode?: string })[];
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const { toast } = useToast();

  const { data: eventsData, isLoading } = useQuery<EventsResponse>({
    queryKey: ["/api/events"],
    refetchInterval: 15000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/events/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Success",
        description: "Event status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update event status",
      });
    },
  });

  const transformedEvents = useMemo(() => {
    return (eventsData?.events || []).map((event) => ({
      id: event.id,
      feederCode: event.feederCode || "N/A",
      feederName: event.feederName || "Unknown Feeder",
      detectedAt: event.detectedAt ? format(new Date(event.detectedAt), "yyyy-MM-dd HH:mm:ss") : "Unknown",
      severity: (event.severity || "low") as "critical" | "high" | "medium" | "low",
      status: (event.status || "detected") as "detected" | "acknowledged" | "crew_dispatched" | "resolved",
      location: event.estimatedLocationKm ? `${event.estimatedLocationKm} km` : "Unknown",
      confidence: event.confidenceScore ? Math.round(Number(event.confidenceScore) * 100) : 0,
    }));
  }, [eventsData]);

  const filteredEvents = useMemo(() => {
    return transformedEvents.filter((event) => {
      const matchesSearch = searchQuery
        ? event.feederCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.feederName.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesStatus = statusFilter === "all" || event.status === statusFilter;
      const matchesSeverity = severityFilter === "all" || event.severity === severityFilter;
      return matchesSearch && matchesStatus && matchesSeverity;
    });
  }, [transformedEvents, searchQuery, statusFilter, severityFilter]);

  const handleAssignCrew = (id: string) => {
    updateStatusMutation.mutate({ id, status: "crew_dispatched" });
  };

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
      </div>

      {isLoading ? (
        <Skeleton className="h-[400px] w-full" />
      ) : (
        <EventsTable
          events={filteredEvents}
          onViewEvent={(id) => console.log("View event:", id)}
          onAssignCrew={handleAssignCrew}
        />
      )}
    </div>
  );
}
