import WaveformChart from "@/components/WaveformChart";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";

export default function WaveformsPage() {
  const [selectedFeeder, setSelectedFeeder] = useState("TVM-NF-001");
  const [selectedType, setSelectedType] = useState<"voltage" | "current" | "both">("voltage");

  //todo: remove mock functionality
  const generateWaveformData = () => {
    return Array.from({ length: 100 }, (_, i) => ({
      time: i * 1,
      voltageR: 230 + Math.sin(i * 0.3) * 25 + (Math.random() - 0.5) * 15,
      voltageY: 230 + Math.sin(i * 0.3 + 2.09) * 25 + (Math.random() - 0.5) * 15,
      voltageB: 230 + Math.sin(i * 0.3 + 4.18) * 25 + (Math.random() - 0.5) * 15,
      currentR: 20 + Math.sin(i * 0.3) * 5 + (Math.random() - 0.5) * 3,
      currentY: 20 + Math.sin(i * 0.3 + 2.09) * 5 + (Math.random() - 0.5) * 3,
      currentB: 20 + Math.sin(i * 0.3 + 4.18) * 5 + (Math.random() - 0.5) * 3,
    }));
  };

  const [waveformData, setWaveformData] = useState(generateWaveformData());

  const handleRefresh = () => {
    console.log("Refreshing waveform data");
    setWaveformData(generateWaveformData());
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
            <Select value={selectedFeeder} onValueChange={setSelectedFeeder}>
              <SelectTrigger data-testid="select-feeder">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TVM-NF-001">TVM-NF-001 - Thiruvananthapuram North</SelectItem>
                <SelectItem value="KOC-IZ-042">KOC-IZ-042 - Kochi Industrial Zone</SelectItem>
                <SelectItem value="KZD-UA-018">KZD-UA-018 - Kozhikode Urban Area</SelectItem>
                <SelectItem value="PKD-RZ-025">PKD-RZ-025 - Palakkad Rural Zone</SelectItem>
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

        <WaveformChart data={waveformData} title={`Waveform - ${selectedFeeder}`} type={selectedType} />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Voltage Statistics</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">R Phase Avg</span>
              <span className="font-mono">232.5 V</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Y Phase Avg</span>
              <span className="font-mono">231.8 V</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">B Phase Avg</span>
              <span className="font-mono">233.1 V</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Current Statistics</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">R Phase Avg</span>
              <span className="font-mono">20.2 A</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Y Phase Avg</span>
              <span className="font-mono">19.8 A</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">B Phase Avg</span>
              <span className="font-mono">20.5 A</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Anomaly Detection</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="text-severity-normal font-medium">Normal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-mono">97.3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Check</span>
              <span className="font-mono">2s ago</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
