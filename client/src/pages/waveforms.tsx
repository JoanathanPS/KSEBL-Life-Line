import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import WaveformChart from "@/components/WaveformChart";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Feeder, WaveformData } from "@shared/schema";

interface FeedersResponse {
  feeders: Feeder[];
}

interface WaveformsResponse {
  waveforms: WaveformData[];
}

export default function WaveformsPage() {
  const [selectedFeederId, setSelectedFeederId] = useState<string>("");
  const [selectedType, setSelectedType] = useState<"voltage" | "current" | "both">("voltage");

  const { data: feedersData } = useQuery<FeedersResponse>({
    queryKey: ["/api/feeders"],
  });

  const feeders = feedersData?.feeders || [];
  const selectedFeeder = feeders.find(f => f.id === selectedFeederId) || feeders[0];
  
  if (!selectedFeederId && feeders.length > 0) {
    setSelectedFeederId(feeders[0].id);
  }

  const { data: waveformsData, isLoading, refetch } = useQuery<WaveformsResponse>({
    queryKey: ["/api/waveforms", selectedFeederId],
    enabled: !!selectedFeederId,
    refetchInterval: 10000,
  });

  const latestWaveform = waveformsData?.waveforms?.[0];

  const transformedWaveformData = useMemo(() => {
    if (!latestWaveform) {
      return Array.from({ length: 100 }, (_, i) => ({
        time: i * 1,
        voltageR: 230 + Math.sin(i * 0.3) * 25 + (Math.random() - 0.5) * 15,
        voltageY: 230 + Math.sin(i * 0.3 + 2.09) * 25 + (Math.random() - 0.5) * 15,
        voltageB: 230 + Math.sin(i * 0.3 + 4.18) * 25 + (Math.random() - 0.5) * 15,
        currentR: 20 + Math.sin(i * 0.3) * 5 + (Math.random() - 0.5) * 3,
        currentY: 20 + Math.sin(i * 0.3 + 2.09) * 5 + (Math.random() - 0.5) * 3,
        currentB: 20 + Math.sin(i * 0.3 + 4.18) * 5 + (Math.random() - 0.5) * 3,
      }));
    }

    const voltageR = latestWaveform.voltageR || [];
    const voltageY = latestWaveform.voltageY || [];
    const voltageB = latestWaveform.voltageB || [];
    const currentR = latestWaveform.currentR || [];
    const currentY = latestWaveform.currentY || [];
    const currentB = latestWaveform.currentB || [];

    const length = Math.max(voltageR.length, currentR.length, 100);

    return Array.from({ length }, (_, i) => ({
      time: i,
      voltageR: parseFloat(voltageR[i]) || 0,
      voltageY: parseFloat(voltageY[i]) || 0,
      voltageB: parseFloat(voltageB[i]) || 0,
      currentR: parseFloat(currentR[i]) || 0,
      currentY: parseFloat(currentY[i]) || 0,
      currentB: parseFloat(currentB[i]) || 0,
    }));
  }, [latestWaveform]);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Waveform Analysis</h1>
        <p className="text-muted-foreground mt-1">Real-time voltage and current waveform monitoring</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Feeder</label>
            <Select value={selectedFeederId} onValueChange={setSelectedFeederId}>
              <SelectTrigger data-testid="select-feeder">
                <SelectValue placeholder="Select a feeder" />
              </SelectTrigger>
              <SelectContent>
                {feeders.map((feeder) => (
                  <SelectItem key={feeder.id} value={feeder.id}>
                    {feeder.code} - {feeder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Display Type</label>
            <Select value={selectedType} onValueChange={(v) => setSelectedType(v as any)}>
              <SelectTrigger data-testid="select-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="voltage">Voltage Only</SelectItem>
                <SelectItem value="current">Current Only</SelectItem>
                <SelectItem value="both">Voltage & Current</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button variant="outline" onClick={handleRefresh} data-testid="button-refresh">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" data-testid="button-export">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <WaveformChart 
            data={transformedWaveformData} 
            title={`Waveform - ${selectedFeeder?.code || 'N/A'}`} 
            type={selectedType} 
          />
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Voltage Statistics</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">R Phase Avg</span>
              <span className="font-mono">
                {transformedWaveformData.length > 0
                  ? `${(transformedWaveformData.reduce((sum, d) => sum + d.voltageR, 0) / transformedWaveformData.length).toFixed(1)} V`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Y Phase Avg</span>
              <span className="font-mono">
                {transformedWaveformData.length > 0
                  ? `${(transformedWaveformData.reduce((sum, d) => sum + d.voltageY, 0) / transformedWaveformData.length).toFixed(1)} V`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">B Phase Avg</span>
              <span className="font-mono">
                {transformedWaveformData.length > 0
                  ? `${(transformedWaveformData.reduce((sum, d) => sum + d.voltageB, 0) / transformedWaveformData.length).toFixed(1)} V`
                  : "N/A"}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Current Statistics</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">R Phase Avg</span>
              <span className="font-mono">
                {transformedWaveformData.length > 0
                  ? `${(transformedWaveformData.reduce((sum, d) => sum + d.currentR, 0) / transformedWaveformData.length).toFixed(1)} A`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Y Phase Avg</span>
              <span className="font-mono">
                {transformedWaveformData.length > 0
                  ? `${(transformedWaveformData.reduce((sum, d) => sum + d.currentY, 0) / transformedWaveformData.length).toFixed(1)} A`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">B Phase Avg</span>
              <span className="font-mono">
                {transformedWaveformData.length > 0
                  ? `${(transformedWaveformData.reduce((sum, d) => sum + d.currentB, 0) / transformedWaveformData.length).toFixed(1)} A`
                  : "N/A"}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Anomaly Detection</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="text-severity-normal font-medium">{latestWaveform?.label || "Normal"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sample Rate</span>
              <span className="font-mono">{latestWaveform?.samplingRate ? `${latestWaveform.samplingRate} Hz` : "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-mono">{latestWaveform?.durationSeconds ? `${latestWaveform.durationSeconds}s` : "N/A"}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
