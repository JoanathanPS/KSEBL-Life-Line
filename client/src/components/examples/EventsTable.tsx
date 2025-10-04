import EventsTable from "../EventsTable";

export default function EventsTableExample() {
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
  ];

  return (
    <EventsTable
      events={mockEvents}
      onViewEvent={(id) => console.log("View event:", id)}
      onAssignCrew={(id) => console.log("Assign crew to event:", id)}
    />
  );
}
