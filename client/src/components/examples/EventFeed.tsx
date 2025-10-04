import EventFeed from "../EventFeed";

export default function EventFeedExample() {
  const mockEvents = [
    {
      id: "1",
      feederName: "Thiruvananthapuram North Feeder",
      feederCode: "TVM-NF-001",
      detectedAt: "2 min ago",
      severity: "critical" as const,
      status: "detected" as const,
      location: "12.5 km",
      confidence: 94,
    },
    {
      id: "2",
      feederName: "Kochi Industrial Zone",
      feederCode: "KOC-IZ-042",
      detectedAt: "15 min ago",
      severity: "high" as const,
      status: "acknowledged" as const,
      location: "8.3 km",
      confidence: 87,
    },
    {
      id: "3",
      feederName: "Kozhikode Urban Area",
      feederCode: "KZD-UA-018",
      detectedAt: "1 hour ago",
      severity: "medium" as const,
      status: "crew_dispatched" as const,
      location: "15.2 km",
      confidence: 91,
    },
  ];

  return (
    <EventFeed
      events={mockEvents}
      onViewEvent={(id) => console.log("View event:", id)}
    />
  );
}
