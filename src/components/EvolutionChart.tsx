import { useMemo } from "react";

interface SentimentWeek {
  week: string;
  sentiment: string;
  intensity: number;
  color: string;
}

const mockWeeklyData: SentimentWeek[] = [
  { week: "01/01 - 07/01", sentiment: "Medo", intensity: 75, color: "hsl(260, 60%, 65%)" },
  { week: "08/01 - 14/01", sentiment: "Ansiedade", intensity: 60, color: "hsl(175, 70%, 50%)" },
  { week: "15/01 - 21/01", sentiment: "Esperança", intensity: 50, color: "hsl(260, 60%, 65%)" },
  { week: "22/01 - 28/01", sentiment: "Coragem", intensity: 65, color: "hsl(175, 70%, 50%)" },
];

const predominant = mockWeeklyData.reduce((prev, curr) =>
  curr.intensity > prev.intensity ? curr : prev
);

export const EvolutionChart = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Sentimentos Predominantes</h3>
          <p className="text-sm text-muted-foreground">Análise semanal baseada nos seus áudios</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: predominant.color }} />
          <span className="text-sm font-semibold" style={{ color: predominant.color }}>
            {predominant.sentiment}
          </span>
        </div>
      </div>

      {/* Sentiment bars */}
      <div className="space-y-4">
        {mockWeeklyData.map((week) => (
          <div key={week.week} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{week.week}</span>
              <span
                className={`font-medium ${week.sentiment === predominant.sentiment ? "text-base font-bold" : ""}`}
                style={{ color: week.color }}
              >
                {week.sentiment}
                {week.sentiment === predominant.sentiment && " ★"}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${week.intensity}%`,
                  backgroundColor: week.color,
                  opacity: week.sentiment === predominant.sentiment ? 1 : 0.6,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground italic">
        Atualizado semanalmente com base na análise dos seus áudios e relatórios.
      </p>
    </div>
  );
};
