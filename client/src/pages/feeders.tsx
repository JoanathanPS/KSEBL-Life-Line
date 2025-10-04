import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Activity, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Feeder } from "@shared/schema";

interface FeedersResponse {
  feeders: (Feeder & { substationName?: string })[];
}

export default function FeedersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: feedersData, isLoading } = useQuery<FeedersResponse>({
    queryKey: ["/api/feeders"],
    refetchInterval: 30000,
  });

  const areaTypeColors = {
    urban: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    rural: "bg-green-500/10 text-green-500 border-green-500/20",
    "semi-urban": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  };

  const filteredFeeders = useMemo(() => {
    const feeders = feedersData?.feeders || [];
    if (!searchQuery) return feeders;
    
    return feeders.filter((feeder) =>
      feeder.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feeder.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [feedersData, searchQuery]);

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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[280px] w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeeders.map((feeder) => (
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
                <Activity className={`w-5 h-5 ${feeder.isActive ? 'text-severity-normal' : 'text-muted-foreground'}`} />
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{feeder.substationName || "Unknown Substation"}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Length</span>
                  <span className="font-medium">{feeder.lengthKm ? `${feeder.lengthKm} km` : "N/A"}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Conductor</span>
                  <span className="font-medium font-mono text-xs">{feeder.conductorType || "N/A"}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Consumers</span>
                  <span className="font-medium">{feeder.numConsumers?.toLocaleString() || "N/A"}</span>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  {feeder.areaType && (
                    <Badge variant="outline" className={areaTypeColors[feeder.areaType as keyof typeof areaTypeColors]}>
                      {feeder.areaType}
                    </Badge>
                  )}
                  <Badge variant="outline" className={`${feeder.isActive ? 'bg-severity-normal/10 text-severity-normal border-severity-normal/20' : 'bg-muted text-muted-foreground'}`}>
                    {feeder.isActive ? 'Active' : 'Inactive'}
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
