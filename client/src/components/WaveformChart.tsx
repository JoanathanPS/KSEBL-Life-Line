import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface WaveformData {
  time: number;
  voltageR: number;
  voltageY: number;
  voltageB: number;
  currentR: number;
  currentY: number;
  currentB: number;
}

interface WaveformChartProps {
  data: WaveformData[];
  title?: string;
  type?: "voltage" | "current" | "both";
}

export default function WaveformChart({ data, title = "Waveform Analysis", type = "voltage" }: WaveformChartProps) {
  return (
    <Card className="p-6" data-testid="card-waveform-chart">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            label={{ value: "Time (ms)", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            label={{ value: type === "voltage" ? "Voltage (V)" : "Current (A)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--popover-border))",
              borderRadius: "6px",
              color: "hsl(var(--popover-foreground))",
            }}
          />
          <Legend />
          {(type === "voltage" || type === "both") && (
            <>
              <Line type="monotone" dataKey="voltageR" stroke="#ef4444" name="R Phase (V)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="voltageY" stroke="#eab308" name="Y Phase (V)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="voltageB" stroke="#3b82f6" name="B Phase (V)" strokeWidth={2} dot={false} />
            </>
          )}
          {(type === "current" || type === "both") && (
            <>
              <Line type="monotone" dataKey="currentR" stroke="#ef4444" name="R Phase (A)" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="currentY" stroke="#eab308" name="Y Phase (A)" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="currentB" stroke="#3b82f6" name="B Phase (A)" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
