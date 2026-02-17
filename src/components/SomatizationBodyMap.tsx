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
  cabeca: { cx: 200, cy: 55, label: "Cabeça" },
  garganta: { cx: 200, cy: 110, label: "Garganta" },
  ombros: { cx: 200, cy: 140, label: "Ombros" },
  peito: { cx: 200, cy: 190, label: "Peito / Coração" },
  estomago: { cx: 200, cy: 250, label: "Estômago" },
  ventre: { cx: 200, cy: 310, label: "Ventre / Útero" },
  coluna: { cx: 200, cy: 220, label: "Coluna" },
  maos: { cx: 200, cy: 340, label: "Mãos" },
  pernas: { cx: 200, cy: 440, label: "Pernas" },
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
          <svg viewBox="0 0 400 560" className="w-[220px] h-[310px] mx-auto" style={{ filter: "drop-shadow(0 0 20px hsl(175,70%,50%,0.3))" }}>
            <defs>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(175, 70%, 55%)" stopOpacity="0.95" />
                <stop offset="50%" stopColor="hsl(200, 65%, 50%)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="hsl(260, 60%, 60%)" stopOpacity="0.7" />
              </linearGradient>
              <radialGradient id="auraGlow" cx="50%" cy="40%" r="55%">
                <stop offset="0%" stopColor="hsl(175, 70%, 50%)" stopOpacity="0.12" />
                <stop offset="60%" stopColor="hsl(260, 60%, 50%)" stopOpacity="0.05" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
              <filter id="nodeGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="bodyGlow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="meridianGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(175, 80%, 60%)" stopOpacity="0.4" />
                <stop offset="50%" stopColor="hsl(200, 70%, 55%)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="hsl(260, 60%, 55%)" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Aura background */}
            <ellipse cx="200" cy="260" rx="160" ry="240" fill="url(#auraGlow)">
              <animate attributeName="rx" values="155;165;155" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
            </ellipse>

            {/* Realistic human silhouette */}
            {/* Head */}
            <ellipse cx="200" cy="48" rx="28" ry="34" fill="none" stroke="url(#bodyGrad)" strokeWidth="1.8" filter="url(#bodyGlow)" />
            <ellipse cx="200" cy="48" rx="28" ry="34" fill="hsl(175, 70%, 50%)" opacity="0.04" />

            {/* Neck */}
            <path d="M188,80 Q188,95 185,105 M212,80 Q212,95 215,105" fill="none" stroke="url(#bodyGrad)" strokeWidth="1.5" filter="url(#bodyGlow)" />

            {/* Shoulders & Torso */}
            <path d="M185,105 Q170,108 140,120 Q120,130 115,145 L110,180 Q108,210 112,240 Q115,265 120,285 Q128,310 140,325 L160,340 Q175,348 200,350 Q225,348 240,340 L260,325 Q272,310 280,285 Q285,265 288,240 Q292,210 290,180 L285,145 Q280,130 260,120 Q230,108 215,105" fill="none" stroke="url(#bodyGrad)" strokeWidth="1.8" filter="url(#bodyGlow)" />
            <path d="M185,105 Q170,108 140,120 Q120,130 115,145 L110,180 Q108,210 112,240 Q115,265 120,285 Q128,310 140,325 L160,340 Q175,348 200,350 Q225,348 240,340 L260,325 Q272,310 280,285 Q285,265 288,240 Q292,210 290,180 L285,145 Q280,130 260,120 Q230,108 215,105" fill="hsl(175, 70%, 50%)" opacity="0.03" />

            {/* Waist definition */}
            <path d="M120,285 Q160,275 200,278 Q240,275 280,285" fill="none" stroke="url(#bodyGrad)" strokeWidth="0.6" opacity="0.3" />

            {/* Chest line */}
            <path d="M140,175 Q170,185 200,188 Q230,185 260,175" fill="none" stroke="url(#bodyGrad)" strokeWidth="0.5" opacity="0.25" />

            {/* Left arm */}
            <path d="M140,120 Q118,128 105,145 Q90,170 80,200 Q72,230 68,260 Q65,280 62,300 Q60,315 58,325 Q55,335 50,345" fill="none" stroke="url(#bodyGrad)" strokeWidth="1.5" filter="url(#bodyGlow)" />
            {/* Left hand */}
            <path d="M50,345 Q47,352 44,358 M50,345 Q52,354 50,360 M50,345 Q55,353 58,358" fill="none" stroke="url(#bodyGrad)" strokeWidth="1" opacity="0.7" />

            {/* Right arm */}
            <path d="M260,120 Q282,128 295,145 Q310,170 320,200 Q328,230 332,260 Q335,280 338,300 Q340,315 342,325 Q345,335 350,345" fill="none" stroke="url(#bodyGrad)" strokeWidth="1.5" filter="url(#bodyGlow)" />
            {/* Right hand */}
            <path d="M350,345 Q353,352 356,358 M350,345 Q348,354 350,360 M350,345 Q345,353 342,358" fill="none" stroke="url(#bodyGrad)" strokeWidth="1" opacity="0.7" />

            {/* Left leg */}
            <path d="M160,340 Q155,370 152,400 Q150,430 148,460 Q146,480 145,500 Q144,520 145,535 Q143,545 138,555" fill="none" stroke="url(#bodyGrad)" strokeWidth="1.5" filter="url(#bodyGlow)" />

            {/* Right leg */}
            <path d="M240,340 Q245,370 248,400 Q250,430 252,460 Q254,480 255,500 Q256,520 255,535 Q257,545 262,555" fill="none" stroke="url(#bodyGrad)" strokeWidth="1.5" filter="url(#bodyGlow)" />

            {/* Inner gap between legs */}
            <path d="M160,340 Q180,355 200,350 Q220,355 240,340" fill="none" stroke="url(#bodyGrad)" strokeWidth="0.6" opacity="0.3" />

            {/* Energy meridian lines */}
            <path d="M200,80 L200,350" fill="none" stroke="url(#meridianGrad)" strokeWidth="0.8" strokeDasharray="4,8" opacity="0.5">
              <animate attributeName="strokeDashoffset" values="0;-24" dur="3s" repeatCount="indefinite" />
            </path>
            <path d="M140,180 Q170,195 200,200 Q230,195 260,180" fill="none" stroke="url(#meridianGrad)" strokeWidth="0.5" strokeDasharray="3,6" opacity="0.3">
              <animate attributeName="strokeDashoffset" values="0;-18" dur="2.5s" repeatCount="indefinite" />
            </path>

            {/* Chakra/energy points along spine */}
            {[110, 155, 200, 250, 305].map((y, i) => (
              <circle key={`chakra-${i}`} cx="200" cy={y} r="2" fill="hsl(175, 70%, 55%)" opacity="0.35">
                <animate attributeName="opacity" values="0.2;0.5;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            ))}

            {/* Somatization points */}
            {somatizationMap.map((point, i) => {
              const region = BODY_REGIONS[point.body_region];
              if (!region) return null;
              const color = getIntensityColor(point.intensity);
              const isSelected = selected === i;
              const radius = isSelected ? 18 : 13;

              let cx = region.cx;
              if (point.body_region === "maos") {
                cx = i % 2 === 0 ? 62 : 338;
              }
              if (point.body_region === "ombros") {
                cx = i % 2 === 0 ? 145 : 255;
              }

              return (
                <g key={i} onClick={() => setSelected(isSelected ? null : i)} className="cursor-pointer">
                  {/* Outer pulse */}
                  <circle cx={cx} cy={region.cy} r={radius + 14} fill={color} opacity={0.06}>
                    <animate attributeName="r" values={`${radius + 10};${radius + 20};${radius + 10}`} dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.04;0.12;0.04" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  {/* Glow ring */}
                  <circle cx={cx} cy={region.cy} r={radius} fill={color} opacity={0.15} stroke={color} strokeWidth={isSelected ? 2 : 1} strokeOpacity={0.5} />
                  {/* Core point */}
                  <circle cx={cx} cy={region.cy} r={5} fill={color} opacity={0.9} filter="url(#nodeGlow)">
                    <animate attributeName="r" values="4;6;4" dur="1.8s" repeatCount="indefinite" />
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
