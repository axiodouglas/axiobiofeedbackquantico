import { useState } from "react";

interface SomatizationPoint {
  body_region: string;
  organ_or_area: string;
  emotion: string;
  description: string;
  intensity: number;
}

interface SomatizationBodyMapProps {
  somatizationMap: SomatizationPoint[];
}

const BODY_REGIONS: Record<string, { cx: number; cy: number; label: string }> = {
  cabeca: { cx: 150, cy: 45, label: "Cabeça" },
  garganta: { cx: 150, cy: 95, label: "Garganta" },
  ombros: { cx: 150, cy: 120, label: "Ombros" },
  peito: { cx: 150, cy: 155, label: "Peito / Coração" },
  estomago: { cx: 150, cy: 200, label: "Estômago" },
  ventre: { cx: 150, cy: 240, label: "Ventre / Útero" },
  coluna: { cx: 150, cy: 180, label: "Coluna" },
  maos: { cx: 150, cy: 260, label: "Mãos" },
  pernas: { cx: 150, cy: 340, label: "Pernas" },
};

function getIntensityColor(intensity: number): string {
  if (intensity >= 70) return "hsl(175, 70%, 45%)";
  if (intensity >= 40) return "hsl(200, 65%, 55%)";
  return "hsl(260, 55%, 60%)";
}

export default function SomatizationBodyMap({ somatizationMap }: SomatizationBodyMapProps) {
  const [selected, setSelected] = useState<number | null>(null);

  if (!somatizationMap || somatizationMap.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h3 className="text-sm font-bold text-foreground mb-1">🧬 Mapa de Somatização</h3>
        <p className="text-xs text-muted-foreground">Regiões do corpo onde emoções reprimidas podem se manifestar</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Wireframe Human Body SVG */}
        <div className="relative flex-shrink-0">
          <svg viewBox="0 0 300 420" className="w-[200px] h-[280px] mx-auto" style={{ filter: "drop-shadow(0 0 16px hsl(175,70%,50%,0.25))" }}>
            <defs>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(175, 70%, 55%)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="hsl(260, 60%, 65%)" stopOpacity="0.6" />
              </linearGradient>
              <filter id="nodeGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Wireframe geometric body - head */}
            <polygon points="150,10 170,25 175,50 165,65 135,65 125,50 130,25" fill="none" stroke="url(#bodyGrad)" strokeWidth="1.2" opacity="0.7" />
            {/* Inner head lines */}
            <line x1="150" y1="10" x2="150" y2="65" stroke="url(#bodyGrad)" strokeWidth="0.5" opacity="0.3" />
            <line x1="130" y1="25" x2="170" y2="25" stroke="url(#bodyGrad)" strokeWidth="0.5" opacity="0.3" />
            <line x1="125" y1="50" x2="175" y2="50" stroke="url(#bodyGrad)" strokeWidth="0.5" opacity="0.3" />

            {/* Neck */}
            <line x1="140" y1="65" x2="135" y2="85" stroke="url(#bodyGrad)" strokeWidth="1.2" opacity="0.7" />
            <line x1="160" y1="65" x2="165" y2="85" stroke="url(#bodyGrad)" strokeWidth="1.2" opacity="0.7" />

            {/* Torso wireframe */}
            <polygon points="110,85 190,85 200,120 205,180 195,240 185,270 150,280 115,270 105,240 95,180 100,120" fill="none" stroke="url(#bodyGrad)" strokeWidth="1.2" opacity="0.7" />
            {/* Torso inner structure */}
            <line x1="150" y1="85" x2="150" y2="280" stroke="url(#bodyGrad)" strokeWidth="0.5" opacity="0.2" />
            <line x1="100" y1="120" x2="200" y2="120" stroke="url(#bodyGrad)" strokeWidth="0.5" opacity="0.2" />
            <line x1="95" y1="180" x2="205" y2="180" stroke="url(#bodyGrad)" strokeWidth="0.5" opacity="0.2" />
            <line x1="105" y1="240" x2="195" y2="240" stroke="url(#bodyGrad)" strokeWidth="0.5" opacity="0.2" />
            {/* Cross braces */}
            <line x1="110" y1="85" x2="195" y2="240" stroke="url(#bodyGrad)" strokeWidth="0.3" opacity="0.15" />
            <line x1="190" y1="85" x2="105" y2="240" stroke="url(#bodyGrad)" strokeWidth="0.3" opacity="0.15" />

            {/* Left arm wireframe */}
            <polyline points="110,85 90,100 70,140 55,190 48,220 55,245 65,260" fill="none" stroke="url(#bodyGrad)" strokeWidth="1.2" opacity="0.7" />
            <line x1="90" y1="100" x2="100" y2="120" stroke="url(#bodyGrad)" strokeWidth="0.5" opacity="0.3" />
            <line x1="70" y1="140" x2="95" y2="155" stroke="url(#bodyGrad)" strokeWidth="0.5" opacity="0.3" />
            {/* Left hand */}
            <polyline points="65,260 58,268 52,275" fill="none" stroke="url(#bodyGrad)" strokeWidth="0.8" opacity="0.5" />
            <polyline points="65,260 68,270 65,278" fill="none" stroke="url(#bodyGrad)" strokeWidth="0.8" opacity="0.5" />

            {/* Right arm wireframe */}
            <polyline points="190,85 210,100 230,140 245,190 252,220 245,245 235,260" fill="none" stroke="url(#bodyGrad)" strokeWidth="1.2" opacity="0.7" />
            <line x1="210" y1="100" x2="200" y2="120" stroke="url(#bodyGrad)" strokeWidth="0.5" opacity="0.3" />
            <line x1="230" y1="140" x2="205" y2="155" stroke="url(#bodyGrad)" strokeWidth="0.5" opacity="0.3" />
            {/* Right hand */}
            <polyline points="235,260 242,268 248,275" fill="none" stroke="url(#bodyGrad)" strokeWidth="0.8" opacity="0.5" />
            <polyline points="235,260 232,270 235,278" fill="none" stroke="url(#bodyGrad)" strokeWidth="0.8" opacity="0.5" />

            {/* Left leg wireframe */}
            <polyline points="125,270 120,300 115,340 112,370 110,390 115,410" fill="none" stroke="url(#bodyGrad)" strokeWidth="1.2" opacity="0.7" />
            <line x1="150" y1="280" x2="120" y2="300" stroke="url(#bodyGrad)" strokeWidth="0.5" opacity="0.3" />
            <line x1="115" y1="340" x2="130" y2="320" stroke="url(#bodyGrad)" strokeWidth="0.5" opacity="0.2" />

            {/* Right leg wireframe */}
            <polyline points="175,270 180,300 185,340 188,370 190,390 185,410" fill="none" stroke="url(#bodyGrad)" strokeWidth="1.2" opacity="0.7" />
            <line x1="150" y1="280" x2="180" y2="300" stroke="url(#bodyGrad)" strokeWidth="0.5" opacity="0.3" />
            <line x1="185" y1="340" x2="170" y2="320" stroke="url(#bodyGrad)" strokeWidth="0.5" opacity="0.2" />

            {/* Nodes at joints */}
            {[
              [150, 10], [130, 25], [170, 25], [125, 50], [175, 50],
              [110, 85], [190, 85], [100, 120], [200, 120],
              [55, 190], [245, 190], [115, 340], [185, 340],
              [150, 280], [115, 410], [185, 410],
            ].map(([x, y], i) => (
              <circle key={`node-${i}`} cx={x} cy={y} r="1.5" fill="hsl(175, 70%, 55%)" opacity="0.6" />
            ))}

            {/* Somatization points */}
            {somatizationMap.map((point, i) => {
              const region = BODY_REGIONS[point.body_region];
              if (!region) return null;
              const color = getIntensityColor(point.intensity);
              const isSelected = selected === i;
              const radius = isSelected ? 16 : 12;

              let cx = region.cx;
              if (point.body_region === "maos") {
                cx = i % 2 === 0 ? 60 : 240;
              }

              return (
                <g key={i} onClick={() => setSelected(isSelected ? null : i)} className="cursor-pointer">
                  {/* Glow */}
                  <circle cx={cx} cy={region.cy} r={radius + 10} fill={color} opacity={0.12}>
                    <animate attributeName="opacity" values="0.08;0.2;0.08" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  {/* Outer ring */}
                  <circle cx={cx} cy={region.cy} r={radius} fill={color} opacity={0.25} stroke={color} strokeWidth={isSelected ? 2 : 1} />
                  {/* Inner dot */}
                  <circle cx={cx} cy={region.cy} r={4} fill={color} opacity={0.9} filter="url(#nodeGlow)">
                    <animate attributeName="r" values="3;5;3" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Details panel */}
        <div className="flex-1 space-y-2 w-full">
          {somatizationMap.map((point, i) => {
            const region = BODY_REGIONS[point.body_region];
            const color = getIntensityColor(point.intensity);
            const isSelected = selected === i;

            return (
              <div
                key={i}
                onClick={() => setSelected(isSelected ? null : i)}
                className={`rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-primary/40 bg-primary/5 shadow-sm"
                    : "border-border bg-secondary/20 hover:border-primary/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs font-semibold text-foreground">
                    {region?.label || point.body_region} — {point.organ_or_area}
                  </span>
                </div>
                <p className="text-[11px] text-primary/80 font-medium mb-0.5">{point.emotion}</p>
                {isSelected && (
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-1 animate-in fade-in-50 duration-200">
                    {point.description}
                  </p>
                )}
                <div className="mt-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${point.intensity}%`, backgroundColor: color }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{point.intensity}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground italic text-center">
        Mapeamento baseado em Neurociência, PNL e Física Quântica. Toque em um ponto para mais detalhes.
      </p>
    </div>
  );
}
