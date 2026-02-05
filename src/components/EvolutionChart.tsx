import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";

const mockData = [
  { month: "Jan", frequency: 200 },
  { month: "Fev", frequency: 250 },
  { month: "Mar", frequency: 220 },
  { month: "Abr", frequency: 310 },
  { month: "Mai", frequency: 380 },
  { month: "Jun", frequency: 420 },
  { month: "Jul", frequency: 480 },
];

export const EvolutionChart = () => {
  const gradient = useMemo(() => (
    <defs>
      <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="hsl(43, 65%, 58%)" stopOpacity={0.4} />
        <stop offset="100%" stopColor="hsl(43, 65%, 58%)" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="hsl(43, 65%, 58%)" />
        <stop offset="100%" stopColor="hsl(43, 70%, 70%)" />
      </linearGradient>
    </defs>
  ), []);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Evolução Vibracional</h3>
          <p className="text-sm text-muted-foreground">Sua frequência ao longo do tempo</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">+42%</span>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            {gradient}
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(240, 5%, 55%)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(240, 5%, 55%)', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(240, 8%, 8%)',
                border: '1px solid hsl(240, 6%, 20%)',
                borderRadius: '8px',
                color: 'hsl(45, 30%, 96%)',
              }}
              labelStyle={{ color: 'hsl(43, 65%, 58%)' }}
            />
            <Area
              type="monotone"
              dataKey="frequency"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              fill="url(#goldGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
