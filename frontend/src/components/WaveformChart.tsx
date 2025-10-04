import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

interface WaveformData {
  timestamp: string;
  voltage: number;
  current: number;
  frequency: number;
}

interface WaveformChartProps {
  data: WaveformData[];
  title?: string;
  className?: string;
}

export const WaveformChart: React.FC<WaveformChartProps> = ({ 
  data, 
  title = 'Power Waveform Analysis',
  className 
}) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-medium">{formatTime(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} {entry.name === 'voltage' ? 'V' : entry.name === 'current' ? 'A' : 'Hz'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-primary-500" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTime}
                stroke="#666"
                fontSize={12}
              />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="voltage" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                name="Voltage"
              />
              <Line 
                type="monotone" 
                dataKey="current" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={false}
                name="Current"
              />
              <Line 
                type="monotone" 
                dataKey="frequency" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
                name="Frequency"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            <span>Voltage (V)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error-500 rounded-full"></div>
            <span>Current (A)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success-500 rounded-full"></div>
            <span>Frequency (Hz)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};