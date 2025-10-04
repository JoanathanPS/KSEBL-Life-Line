import WaveformChart from "../WaveformChart";

export default function WaveformChartExample() {
  const mockData = Array.from({ length: 50 }, (_, i) => ({
    time: i * 2,
    voltageR: 230 + Math.sin(i * 0.5) * 20 + (Math.random() - 0.5) * 10,
    voltageY: 230 + Math.sin(i * 0.5 + 2.09) * 20 + (Math.random() - 0.5) * 10,
    voltageB: 230 + Math.sin(i * 0.5 + 4.18) * 20 + (Math.random() - 0.5) * 10,
    currentR: 15 + Math.sin(i * 0.5) * 3 + (Math.random() - 0.5) * 2,
    currentY: 15 + Math.sin(i * 0.5 + 2.09) * 3 + (Math.random() - 0.5) * 2,
    currentB: 15 + Math.sin(i * 0.5 + 4.18) * 3 + (Math.random() - 0.5) * 2,
  }));

  return <WaveformChart data={mockData} title="Pre-Fault Waveform Analysis" type="voltage" />;
}
