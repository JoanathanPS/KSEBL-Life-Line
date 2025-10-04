import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Zap, Gauge } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Substation } from "@shared/schema";

interface SubstationsResponse {
  substations: (Substation & { numFeeders?: number })[];
}

export default function SubstationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: substationsData, isLoading } = useQuery<SubstationsResponse>({
    queryKey: ["/api/substations"],
    refetchInterval: 30000,
  });

  const filteredSubstations = useMemo(() => {
    const substations = substationsData?.substations || [];
    if (!searchQuery) return substations;
    
    return substations.filter((substation) =>
      substation.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      substation.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [substationsData, searchQuery]);

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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[280px] w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubstations.map((substation) => (
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
                <Zap className={`w-5 h-5 ${substation.isActive ? 'text-severity-normal' : 'text-muted-foreground'}`} />
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{substation.address || "Kerala"}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Voltage Level</span>
                  <span className="font-medium font-mono text-xs">{substation.voltageLevel || "N/A"}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Capacity</span>
                  <div className="flex items-center gap-1">
                    <Gauge className="w-3 h-3" />
                    <span className="font-medium">{substation.capacityMva ? `${substation.capacityMva} MVA` : "N/A"}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Feeders</span>
                  <span className="font-medium">{substation.numFeeders || "N/A"}</span>
                </div>
                
                <div className="flex items-center justify-end pt-2">
                  <Badge variant="outline" className={`${substation.isActive ? 'bg-severity-normal/10 text-severity-normal border-severity-normal/20' : 'bg-muted text-muted-foreground'}`}>
                    {substation.isActive ? 'Operational' : 'Offline'}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
