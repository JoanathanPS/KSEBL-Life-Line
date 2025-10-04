import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Activity, MapPin } from "lucide-react";
import { useState } from "react";

interface Feeder {
  id: string;
  code: string;
  name: string;
  substationName: string;
  lengthKm: number;
  conductorType: string;
  areaType: "urban" | "rural" | "semi-urban";
  numConsumers: number;
  isActive: boolean;
}

export default function FeedersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  //todo: remove mock functionality
  const mockFeeders: Feeder[] = [
    {
      id: "1",
      code: "TVM-NF-001",
      name: "Thiruvananthapuram North Feeder",
      substationName: "TVM North Substation",
      lengthKm: 25.5,
      conductorType: "ACSR Rabbit",
      areaType: "urban",
      numConsumers: 1250,
      isActive: true,
    },
    {
      id: "2",
      code: "KOC-IZ-042",
      name: "Kochi Industrial Zone",
      substationName: "Kochi Central",
      lengthKm: 18.3,
      conductorType: "ACSR Dog",
      areaType: "urban",
      numConsumers: 850,
      isActive: true,
    },
    {
      id: "3",
      code: "KZD-UA-018",
      name: "Kozhikode Urban Area",
      substationName: "Kozhikode Main",
      lengthKm: 32.8,
      conductorType: "ACSR Rabbit",
      areaType: "semi-urban",
      numConsumers: 2100,
      isActive: true,
    },
    {
      id: "4",
      code: "PKD-RZ-025",
      name: "Palakkad Rural Zone",
      substationName: "Palakkad District",
      lengthKm: 45.2,
      conductorType: "AAC Squirrel",
      areaType: "rural",
      numConsumers: 680,
      isActive: true,
    },
  ];

  const areaTypeColors = {
    urban: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    rural: "bg-green-500/10 text-green-500 border-green-500/20",
    "semi-urban": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Feeders</h1>
        <p className="text-muted-foreground mt-1">Monitor all distribution feeders in the network</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search feeders by code or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-feeders"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFeeders.map((feeder) => (
          <Card
            key={feeder.id}
            className="p-6 hover-elevate cursor-pointer"
            onClick={() => console.log("View feeder:", feeder.id)}
            data-testid={`card-feeder-${feeder.id}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold font-mono text-sm text-primary">{feeder.code}</h3>
                <p className="text-sm text-muted-foreground mt-1">{feeder.name}</p>
              </div>
              <Activity className="w-5 h-5 text-severity-normal" />
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{feeder.substationName}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Length</span>
                <span className="font-medium">{feeder.lengthKm} km</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Conductor</span>
                <span className="font-medium font-mono text-xs">{feeder.conductorType}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Consumers</span>
                <span className="font-medium">{feeder.numConsumers.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <Badge variant="outline" className={areaTypeColors[feeder.areaType]}>
                  {feeder.areaType}
                </Badge>
                <Badge variant="outline" className="bg-severity-normal/10 text-severity-normal border-severity-normal/20">
                  Active
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
