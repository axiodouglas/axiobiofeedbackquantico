import { cn } from "@/lib/utils";

const frequencies = [
  { level: 700, label: "Iluminação", color: "bg-violet-500/20 border-violet-500/30", textColor: "text-violet-400", locked: true },
  { level: 600, label: "Paz", color: "bg-indigo-500/20 border-indigo-500/30", textColor: "text-indigo-400", locked: true },
  { level: 540, label: "Alegria", color: "bg-blue-400/20 border-blue-400/30", textColor: "text-blue-400" },
  { level: 500, label: "Amor", color: "bg-pink-400/20 border-pink-400/30", textColor: "text-pink-400" },
  { level: 400, label: "Razão", color: "bg-cyan-400/20 border-cyan-400/30", textColor: "text-cyan-400" },
  { level: 350, label: "Aceitação", color: "bg-teal-400/20 border-teal-400/30", textColor: "text-teal-400" },
  { level: 310, label: "Vontade", color: "bg-green-400/20 border-green-400/30", textColor: "text-green-400" },
  { level: 250, label: "Neutralidade", color: "bg-lime-400/20 border-lime-400/30", textColor: "text-lime-400" },
  { level: 200, label: "Coragem", color: "bg-yellow-400/20 border-yellow-400/30", textColor: "text-yellow-400" },
  { level: 175, label: "Orgulho", color: "bg-amber-400/20 border-amber-400/30", textColor: "text-amber-400" },
  { level: 150, label: "Raiva", color: "bg-orange-400/20 border-orange-400/30", textColor: "text-orange-400" },
  { level: 125, label: "Desejo", color: "bg-orange-500/20 border-orange-500/30", textColor: "text-orange-500" },
  { level: 100, label: "Medo", color: "bg-red-400/20 border-red-400/30", textColor: "text-red-400" },
  { level: 75, label: "Sofrimento", color: "bg-red-500/20 border-red-500/30", textColor: "text-red-500" },
  { level: 50, label: "Apatia", color: "bg-red-600/20 border-red-600/30", textColor: "text-red-600" },
  { level: 30, label: "Culpa", color: "bg-red-700/20 border-red-700/30", textColor: "text-red-700" },
  { level: 20, label: "Vergonha", color: "bg-red-800/20 border-red-800/30", textColor: "text-red-800" },
];

interface HawkinsScaleProps {
  currentLevel?: number;
}

export const HawkinsScale = ({ currentLevel = 250 }: HawkinsScaleProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Escala de Hawkins</h3>
        <p className="text-sm text-muted-foreground">Mapa de frequências emocionais</p>
      </div>

      <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
        {frequencies.map((freq) => (
          <div
            key={freq.level}
            className={cn(
              "flex items-center justify-between rounded-lg border px-3 py-2 transition-all",
              freq.color,
              currentLevel >= freq.level && currentLevel < (frequencies[frequencies.indexOf(freq) - 1]?.level || 1000) && "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
          >
            <span className={cn("text-sm font-medium", freq.textColor)}>
              {freq.label}
              {freq.locked && <span className="ml-1 text-xs opacity-50">(inalcançável)</span>}
            </span>
            <span className={cn("text-xs font-mono", freq.textColor)}>{freq.level}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-muted/50 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Sua frequência atual</span>
          <span className="text-lg font-bold text-primary">{currentLevel}</span>
        </div>
      </div>
    </div>
  );
};
