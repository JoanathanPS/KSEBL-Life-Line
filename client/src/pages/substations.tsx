import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Zap, Gauge } from "lucide-react";
import { useState } from "react";

interface Substation {
  id: string;
  code: string;
  name: string;
  voltageLevel: string;
  capacityMva: number;
  numFeeders: number;
  location: string;
  isActive: boolean;
}

export default function SubstationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  //todo: remove mock functionality
  const mockSubstations: Substation[] = [
    {
      id: "1",
      code: "TVM-NORTH",
      name: "TVM North Substation",
      voltageLevel: "11/0.4 kV",
      capacityMva: 25.5,
      numFeeders: 8,
      location: "Thiruvananthapuram",
      isActive: true,
    },
    {
      id: "2",
      code: "KOC-CENTRAL",
      name: "Kochi Central",
      voltageLevel: "11/0.4 kV",
      capacityMva: 40.0,
      numFeeders: 12,
      location: "Kochi",
      isActive: true,
    },
    {
      id: "3",
      code: "KZD-MAIN",
      name: "Kozhikode Main",
      voltageLevel: "11/0.4 kV",
      capacityMva: 32.5,
      numFeeders: 10,
      location: "Kozhikode",
      isActive: true,
    },
    {
      id: "4",
      code: "PKD-DIST",
      name: "Palakkad District",
      voltageLevel: "11/0.4 kV",
      capacityMva: 20.0,
      numFeeders: 6,
      location: "Palakkad",
      isActive: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Substations</h1>
        <p className="text-muted-foreground mt-1">Monitor all substations in the Kerala grid</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search substations by code or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-substations"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSubstations.map((substation) => (
          <Card
            key={substation.id}
            className="p-6 hover-elevate cursor-pointer"
            onClick={() => console.log("View substation:", substation.id)}
            data-testid={`card-substation-${substation.id}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold font-mono text-sm text-primary">{substation.code}</h3>
                <p className="text-sm text-muted-foreground mt-1">{substation.name}</p>
              </div>
              <Zap className="w-5 h-5 text-severity-normal" />
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{substation.location}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Voltage Level</span>
                <span className="font-medium font-mono text-xs">{substation.voltageLevel}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Capacity</span>
                <div className="flex items-center gap-1">
                  <Gauge className="w-3 h-3" />
                  <span className="font-medium">{substation.capacityMva} MVA</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Feeders</span>
                <span className="font-medium">{substation.numFeeders}</span>
              </div>
              
              <div className="flex items-center justify-end pt-2">
                <Badge variant="outline" className="bg-severity-normal/10 text-severity-normal border-severity-normal/20">
                  Operational
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
