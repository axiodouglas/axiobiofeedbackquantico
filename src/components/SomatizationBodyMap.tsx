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
  if (intensity >= 70) return "hsl(0, 70%, 55%)";
  if (intensity >= 40) return "hsl(30, 80%, 55%)";
  return "hsl(50, 70%, 55%)";
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
        {/* Human Body SVG */}
        <div className="relative flex-shrink-0">
          <svg viewBox="0 0 300 420" className="w-[200px] h-[280px] mx-auto" style={{ filter: "drop-shadow(0 0 12px hsl(175,70%,50%,0.15))" }}>
            {/* Head */}
            <ellipse cx="150" cy="40" rx="28" ry="32" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.4" />
            {/* Neck */}
            <line x1="150" y1="72" x2="150" y2="90" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.4" />
            {/* Torso */}
            <path d="M115,90 Q110,90 105,100 L95,180 Q92,200 100,240 L110,270 L150,280 L190,270 L200,240 Q208,200 205,180 L195,100 Q190,90 185,90 Z" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.4" />
            {/* Left arm */}
            <path d="M105,100 Q80,110 65,150 Q55,180 50,210 Q48,225 55,240 Q58,248 65,255" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.4" />
            {/* Right arm */}
            <path d="M195,100 Q220,110 235,150 Q245,180 250,210 Q252,225 245,240 Q242,248 235,255" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.4" />
            {/* Left leg */}
            <path d="M120,270 L115,320 Q112,350 110,380 Q108,400 115,410" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.4" />
            {/* Right leg */}
            <path d="M180,270 L185,320 Q188,350 190,380 Q192,400 185,410" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.4" />

            {/* Somatization points */}
            {somatizationMap.map((point, i) => {
              const region = BODY_REGIONS[point.body_region];
              if (!region) return null;
              const color = getIntensityColor(point.intensity);
              const isSelected = selected === i;
              const radius = isSelected ? 16 : 12;

              // Offset x for side regions
              let cx = region.cx;
              if (point.body_region === "maos") {
                cx = i % 2 === 0 ? 60 : 240;
              }

              return (
                <g key={i} onClick={() => setSelected(isSelected ? null : i)} className="cursor-pointer">
                  {/* Glow */}
                  <circle cx={cx} cy={region.cy} r={radius + 8} fill={color} opacity={0.15}>
                    <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2s" repeatCount="indefinite" />
                  </circle>
                  {/* Outer ring */}
                  <circle cx={cx} cy={region.cy} r={radius} fill={color} opacity={0.3} stroke={color} strokeWidth={isSelected ? 2 : 1} />
                  {/* Inner dot */}
                  <circle cx={cx} cy={region.cy} r={5} fill={color} opacity={0.9}>
                    <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" />
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
