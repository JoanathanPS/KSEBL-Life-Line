import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Upload, Play, Pause, Download, Zap, Activity } from 'lucide-react';

interface WaveformData {
  id: string;
  feederId: string;
  timestamp: string;
  currentR: number[];
  currentY: number[];
  currentB: number[];
  voltageR: number[];
  voltageY: number[];
  voltageB: number[];
  samplingRate: number;
  durationSeconds: number;
  label: string;
}

const WaveformChart = ({ data, title, color }: { data: number[]; title: string; color: string }) => {
  const chartData = data.map((value, index) => ({
    time: index / 100, // Convert to time in seconds
    value: value,
  }));

  return (
    <div className="h-64">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const AnalysisPanel = ({ waveform }: { waveform: WaveformData }) => {
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    // Simulate analysis
    const rmsCurrent = Math.sqrt(waveform.currentR.reduce((sum, val) => sum + val * val, 0) / waveform.currentR.length);
    const rmsVoltage = Math.sqrt(waveform.voltageR.reduce((sum, val) => sum + val * val, 0) / waveform.voltageR.length);
    
    setAnalysis({
      rmsCurrent: rmsCurrent.toFixed(2),
      rmsVoltage: rmsVoltage.toFixed(2),
      peakCurrent: Math.max(...waveform.currentR.map(Math.abs)).toFixed(2),
      peakVoltage: Math.max(...waveform.voltageR.map(Math.abs)).toFixed(2),
      frequency: 50, // Simulated
      thd: (Math.random() * 5).toFixed(2),
      powerFactor: (Math.random() * 0.2 + 0.8).toFixed(2),
    });
  }, [waveform]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-600">RMS Current</div>
          <div className="text-2xl font-bold">{analysis?.rmsCurrent} A</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-600">RMS Voltage</div>
          <div className="text-2xl font-bold">{analysis?.rmsVoltage} V</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-600">Peak Current</div>
          <div className="text-2xl font-bold">{analysis?.peakCurrent} A</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-600">Peak Voltage</div>
          <div className="text-2xl font-bold">{analysis?.peakVoltage} V</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-600">Frequency</div>
          <div className="text-2xl font-bold">{analysis?.frequency} Hz</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-600">THD</div>
          <div className="text-2xl font-bold">{analysis?.thd}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-600">Power Factor</div>
          <div className="text-2xl font-bold">{analysis?.powerFactor}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-600">Duration</div>
          <div className="text-2xl font-bold">{waveform.durationSeconds}s</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function WaveformsPage() {
  const [waveforms, setWaveforms] = useState<WaveformData[]>([]);
  const [selectedWaveform, setSelectedWaveform] = useState<WaveformData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    feederId: '',
    label: '',
    dateRange: '7d',
  });

  useEffect(() => {
    loadWaveforms();
  }, [filters]);

  const loadWaveforms = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual API
      const mockWaveforms: WaveformData[] = Array.from({ length: 20 }, (_, i) => ({
        id: `waveform-${i}`,
        feederId: `feeder-${i % 5}`,
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        currentR: Array.from({ length: 400 }, () => Math.sin(Date.now() / 1000 + i) * 50 + Math.random() * 10),
        currentY: Array.from({ length: 400 }, () => Math.sin(Date.now() / 1000 + i + 2.09) * 50 + Math.random() * 10),
        currentB: Array.from({ length: 400 }, () => Math.sin(Date.now() / 1000 + i + 4.18) * 50 + Math.random() * 10),
        voltageR: Array.from({ length: 400 }, () => Math.sin(Date.now() / 1000 + i) * 230 + Math.random() * 5),
        voltageY: Array.from({ length: 400 }, () => Math.sin(Date.now() / 1000 + i + 2.09) * 230 + Math.random() * 5),
        voltageB: Array.from({ length: 400 }, () => Math.sin(Date.now() / 1000 + i + 4.18) * 230 + Math.random() * 5),
        samplingRate: 10000,
        durationSeconds: 4.0,
        label: ['NORMAL', 'LINE_BREAK', 'SHORT_CIRCUIT', 'OVERLOAD'][i % 4],
      }));
      
      setWaveforms(mockWaveforms);
      if (mockWaveforms.length > 0) {
        setSelectedWaveform(mockWaveforms[0]);
      }
    } catch (error) {
      console.error('Failed to load waveforms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate file processing
      console.log('Uploading file:', file.name);
      // Add to waveforms list
    }
  };

  const generateSampleData = () => {
    const sampleData: WaveformData = {
      id: 'sample-' + Date.now(),
      feederId: 'sample-feeder',
      timestamp: new Date().toISOString(),
      currentR: Array.from({ length: 400 }, () => Math.sin(Date.now() / 1000) * 50 + Math.random() * 10),
      currentY: Array.from({ length: 400 }, () => Math.sin(Date.now() / 1000 + 2.09) * 50 + Math.random() * 10),
      currentB: Array.from({ length: 400 }, () => Math.sin(Date.now() / 1000 + 4.18) * 50 + Math.random() * 10),
      voltageR: Array.from({ length: 400 }, () => Math.sin(Date.now() / 1000) * 230 + Math.random() * 5),
      voltageY: Array.from({ length: 400 }, () => Math.sin(Date.now() / 1000 + 2.09) * 230 + Math.random() * 5),
      voltageB: Array.from({ length: 400 }, () => Math.sin(Date.now() / 1000 + 4.18) * 230 + Math.random() * 5),
      samplingRate: 10000,
      durationSeconds: 4.0,
      label: 'NORMAL',
    };
    
    setWaveforms(prev => [sampleData, ...prev]);
    setSelectedWaveform(sampleData);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Waveform Analysis</h1>
          <p className="text-gray-600 mt-1">
            Analyze electrical waveforms and detect line break conditions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={generateSampleData} variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            Generate Sample
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Data
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Waveform Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="file-upload">Select File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleFileUpload}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="feeder-select">Feeder</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select feeder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feeder-1">Feeder 1</SelectItem>
                  <SelectItem value="feeder-2">Feeder 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Analyze
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waveform List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Waveforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {waveforms.map((waveform) => (
                <div
                  key={waveform.id}
                  className={`p-3 border rounded cursor-pointer transition-colors ${
                    selectedWaveform?.id === waveform.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedWaveform(waveform)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{waveform.feederId}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(waveform.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xs">
                      <span className={`px-2 py-1 rounded ${
                        waveform.label === 'NORMAL' ? 'bg-green-100 text-green-800' :
                        waveform.label === 'LINE_BREAK' ? 'bg-red-100 text-red-800' :
                        waveform.label === 'SHORT_CIRCUIT' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {waveform.label}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Waveform Visualization */}
        <div className="lg:col-span-2">
          {selectedWaveform ? (
            <Tabs defaultValue="current" className="space-y-4">
              <TabsList>
                <TabsTrigger value="current">Current</TabsTrigger>
                <TabsTrigger value="voltage">Voltage</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="current">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Waveforms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <WaveformChart 
                        data={selectedWaveform.currentR} 
                        title="Phase R Current" 
                        color="#ef4444" 
                      />
                      <WaveformChart 
                        data={selectedWaveform.currentY} 
                        title="Phase Y Current" 
                        color="#22c55e" 
                      />
                      <WaveformChart 
                        data={selectedWaveform.currentB} 
                        title="Phase B Current" 
                        color="#3b82f6" 
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="voltage">
                <Card>
                  <CardHeader>
                    <CardTitle>Voltage Waveforms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <WaveformChart 
                        data={selectedWaveform.voltageR} 
                        title="Phase R Voltage" 
                        color="#ef4444" 
                      />
                      <WaveformChart 
                        data={selectedWaveform.voltageY} 
                        title="Phase Y Voltage" 
                        color="#22c55e" 
                      />
                      <WaveformChart 
                        data={selectedWaveform.voltageB} 
                        title="Phase B Voltage" 
                        color="#3b82f6" 
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analysis">
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnalysisPanel waveform={selectedWaveform} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a waveform to view analysis</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}