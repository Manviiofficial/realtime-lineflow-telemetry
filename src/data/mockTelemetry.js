// Generates mock telemetry data for a given date range and line
// Each day: 288 data points (every 5 minutes)
export function generateMockTelemetry(fromDate, toDate, line) {
  // For simplicity, only generate for one day
  const data = [];
  const start = new Date(fromDate);
  const end = new Date(toDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    // Randomize base and amplitude per day and per line
    const base = 400 + Math.random() * 300 + (line ? line.length * 7 : 0);
    const amplitude = 100 + Math.random() * 200;
    for (let i = 0; i < 288; i++) {
      const hour = Math.floor(i * 5 / 60).toString().padStart(2, '0');
      const min = ((i * 5) % 60).toString().padStart(2, '0');
      // T1: Sine wave, high base, high amplitude, random noise
      const baseT1 = base + 200;
      const ampT1 = amplitude + 100;
      const noiseT1 = Math.random() * 60 - 30;
      const trendT1 = Math.sin(i / 288 * 2 * Math.PI) * ampT1;
      const spikeT1 = Math.random() > 0.98 ? Math.random() * 200 : 0;
      // T2: Cosine wave, low base, low amplitude, different random noise
      const baseT2 = base - 150;
      const ampT2 = amplitude * 0.5;
      const noiseT2 = Math.random() * 60 - 30;
      const trendT2 = Math.cos(i / 288 * 4 * Math.PI) * ampT2;
      const spikeT2 = Math.random() > 0.97 ? Math.random() * 150 : 0;
      const t1Value = Math.round(baseT1 + trendT1 + noiseT1 + spikeT1);
      const t2Value = Math.round(baseT2 + trendT2 + noiseT2 + spikeT2);
      // Ensure values are always numbers
      data.push({
        time: `${d.toISOString().slice(0, 10)} ${hour}:${min}`,
        T1: Number.isFinite(t1Value) ? t1Value : 0,
        T2: Number.isFinite(t2Value) ? t2Value : 0,
      });
    }
  }
  // Defensive: if no data, return at least one dummy point
  if (data.length === 0) {
    data.push({ time: 'N/A', T1: 0, T2: 0 });
  }
  return data;
}

export default generateMockTelemetry;
