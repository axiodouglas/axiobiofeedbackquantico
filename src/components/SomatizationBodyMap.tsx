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

const BODY_REGIONS: Record<string, { cx: number; cy: number; label: string; labelSide: "left" | "right" }> = {
  cabeca: { cx: 200, cy: 58, label: "CRANIAL", labelSide: "right" },
  garganta: { cx: 200, cy: 115, label: "CERVICAL", labelSide: "left" },
  ombros: { cx: 200, cy: 148, label: "DELTOID", labelSide: "right" },
  peito: { cx: 200, cy: 195, label: "THORACIC", labelSide: "left" },
  estomago: { cx: 200, cy: 260, label: "GASTRIC", labelSide: "right" },
  ventre: { cx: 200, cy: 320, label: "PELVIC", labelSide: "left" },
  coluna: { cx: 200, cy: 230, label: "SPINAL", labelSide: "right" },
  maos: { cx: 200, cy: 350, label: "CARPAL", labelSide: "left" },
  pernas: { cx: 200, cy: 450, label: "FEMORAL", labelSide: "right" },
};

function getIntensityColor(intensity: number): string {
  if (intensity >= 70) return "hsl(175, 80%, 50%)";
  if (intensity >= 40) return "hsl(195, 70%, 50%)";
  return "hsl(220, 60%, 55%)";
}

function getIntensityLabel(intensity: number): string {
  if (intensity >= 70) return "CRITICAL";
  if (intensity >= 40) return "MODERATE";
  return "LOW";
}

export default function SomatizationBodyMap({ somatizationMap }: SomatizationBodyMapProps) {
  const [selected, setSelected] = useState<number | null>(null);

  if (!somatizationMap || somatizationMap.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Header - medical tech style */}
      <div className="flex items-center justify-between border-b border-primary/20 pb-2 mb-1">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-primary uppercase">
            Biometric Somatization Scan
          </span>
        </div>
        <span className="text-[9px] font-mono text-muted-foreground tracking-wider">
          {somatizationMap.length} REGION{somatizationMap.length > 1 ? "S" : ""} DETECTED
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-start">
        {/* Body scan area */}
        <div className="relative flex-shrink-0 rounded-lg border border-border bg-background/80 p-2"
          style={{ boxShadow: "inset 0 0 40px hsl(175,70%,50%,0.03)" }}>
          <svg viewBox="0 0 400 580" className="w-[230px] h-[340px] mx-auto">
            <defs>
              <linearGradient id="smBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(175, 60%, 45%)" stopOpacity="0.7" />
                <stop offset="50%" stopColor="hsl(200, 55%, 40%)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(220, 50%, 35%)" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="smMuscleFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(195, 50%, 30%)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="hsl(220, 45%, 25%)" stopOpacity="0.08" />
              </linearGradient>
              <filter id="smGlow">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="smSoftGlow">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <pattern id="smGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(200, 40%, 30%)" strokeWidth="0.3" opacity="0.25" />
              </pattern>
            </defs>

            {/* Background grid */}
            <rect width="400" height="580" fill="url(#smGrid)" opacity="0.5" />

            {/* Grid coordinate labels */}
            {[0, 1, 2, 3, 4, 5].map(i => (
              <text key={`gy-${i}`} x="4" y={i * 100 + 15} fill="hsl(200, 40%, 40%)" fontSize="6" fontFamily="monospace" opacity="0.4">
                {String.fromCharCode(65 + i)}0
              </text>
            ))}
            {[0, 1, 2, 3].map(i => (
              <text key={`gx-${i}`} x={i * 100 + 50} y="576" fill="hsl(200, 40%, 40%)" fontSize="6" fontFamily="monospace" opacity="0.4">
                X{i + 1}
              </text>
            ))}

            {/* === REALISTIC HUMAN ANATOMY === */}

            {/* Head - cranium with detail */}
            <ellipse cx="200" cy="48" rx="30" ry="36" fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="1.4" />
            {/* Skull structure lines */}
            <path d="M175,35 Q185,20 200,16 Q215,20 225,35" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.5" opacity="0.3" />
            <path d="M178,55 Q190,68 200,70 Q210,68 222,55" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.4" opacity="0.25" />
            {/* Temporal lines */}
            <path d="M170,42 Q172,30 180,22" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.4" opacity="0.2" />
            <path d="M230,42 Q228,30 220,22" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.4" opacity="0.2" />

            {/* Neck - sternocleidomastoid muscles */}
            <path d="M186,82 Q184,95 180,108" fill="none" stroke="url(#smBodyGrad)" strokeWidth="1.3" />
            <path d="M214,82 Q216,95 220,108" fill="none" stroke="url(#smBodyGrad)" strokeWidth="1.3" />
            <path d="M192,84 L192,105" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.4" opacity="0.3" />
            <path d="M208,84 L208,105" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.4" opacity="0.3" />

            {/* Trapezius / Shoulders */}
            <path d="M180,108 Q160,112 130,125 Q115,135 110,150" fill="none" stroke="url(#smBodyGrad)" strokeWidth="1.5" />
            <path d="M220,108 Q240,112 270,125 Q285,135 290,150" fill="none" stroke="url(#smBodyGrad)" strokeWidth="1.5" />
            {/* Deltoid muscle shape */}
            <path d="M130,125 Q120,135 112,155 Q110,165 115,175" fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="0.8" />
            <path d="M270,125 Q280,135 288,155 Q290,165 285,175" fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="0.8" />

            {/* Torso - pectorals & abs */}
            <path d="M110,150 Q108,185 112,220 Q115,260 120,290 Q128,320 145,340 Q165,355 200,358 Q235,355 255,340 Q272,320 280,290 Q285,260 288,220 Q292,185 290,150"
              fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="1.5" />

            {/* Pectoral muscles */}
            <path d="M145,150 Q170,165 200,168 Q230,165 255,150" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.6" opacity="0.4" />
            <path d="M150,155 Q170,170 200,173 Q230,170 250,155" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.4" opacity="0.25" />

            {/* Abdominal lines (six-pack structure) */}
            <line x1="200" y1="175" x2="200" y2="330" stroke="url(#smBodyGrad)" strokeWidth="0.5" opacity="0.3" />
            {[195, 220, 245, 270, 295].map((y, i) => (
              <path key={`ab-${i}`} d={`M170,${y} Q185,${y + 3} 200,${y + 4} Q215,${y + 3} 230,${y}`} fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.4" opacity="0.25" />
            ))}

            {/* Ribcage subtle lines */}
            {[165, 178, 191].map((y, i) => (
              <g key={`rib-${i}`}>
                <path d={`M155,${y} Q175,${y + 8} 200,${y + 10} Q225,${y + 8} 245,${y}`} fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.3" opacity="0.2" />
              </g>
            ))}

            {/* Oblique lines */}
            <path d="M120,250 Q140,255 155,270" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.4" opacity="0.2" />
            <path d="M280,250 Q260,255 245,270" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.4" opacity="0.2" />

            {/* Internal organs (subtle) */}
            {/* Heart */}
            <path d="M190,185 Q185,180 188,175 Q192,172 196,176 L200,180 L204,176 Q208,172 212,175 Q215,180 210,185 L200,198 Z"
              fill="hsl(175, 60%, 40%)" opacity="0.12" stroke="hsl(175, 60%, 45%)" strokeWidth="0.5" strokeOpacity="0.3" />
            {/* Stomach */}
            <ellipse cx="208" cy="252" rx="22" ry="16" fill="hsl(195, 50%, 35%)" opacity="0.08" stroke="hsl(195, 50%, 40%)" strokeWidth="0.4" strokeOpacity="0.25" />
            {/* Intestines hint */}
            <path d="M180,290 Q190,295 200,290 Q210,285 220,290 Q230,295 220,300 Q210,305 200,300 Q190,295 180,300"
              fill="none" stroke="hsl(200, 45%, 40%)" strokeWidth="0.4" opacity="0.15" />

            {/* Left arm with muscle definition */}
            <path d="M112,155 Q100,170 88,200 Q78,230 72,260 Q68,285 65,310 Q62,325 58,338 Q55,348 50,355"
              fill="none" stroke="url(#smBodyGrad)" strokeWidth="1.4" />
            {/* Bicep */}
            <path d="M108,160 Q98,175 92,195 Q90,205 95,210" fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="0.5" opacity="0.6" />
            {/* Forearm */}
            <path d="M88,210 Q82,235 76,255" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.5" opacity="0.3" />
            {/* Hand */}
            <path d="M50,355 Q46,362 43,368 M50,355 Q52,363 50,370 M50,355 Q55,362 57,367 M50,355 Q48,360 44,362"
              fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.8" opacity="0.5" />

            {/* Right arm */}
            <path d="M288,155 Q300,170 312,200 Q322,230 328,260 Q332,285 335,310 Q338,325 342,338 Q345,348 350,355"
              fill="none" stroke="url(#smBodyGrad)" strokeWidth="1.4" />
            <path d="M292,160 Q302,175 308,195 Q310,205 305,210" fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="0.5" opacity="0.6" />
            <path d="M312,210 Q318,235 324,255" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.5" opacity="0.3" />
            <path d="M350,355 Q354,362 357,368 M350,355 Q348,363 350,370 M350,355 Q345,362 343,367 M350,355 Q352,360 356,362"
              fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.8" opacity="0.5" />

            {/* Pelvis */}
            <path d="M145,340 Q170,350 200,352 Q230,350 255,340" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.6" opacity="0.35" />
            <path d="M155,335 Q175,342 200,344 Q225,342 245,335" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.4" opacity="0.2" />

            {/* Left leg with quad/calf */}
            <path d="M155,340 Q152,370 150,400 Q148,435 147,460 Q146,490 146,510 Q145,535 143,550 Q140,558 135,565"
              fill="none" stroke="url(#smBodyGrad)" strokeWidth="1.4" />
            <path d="M170,345 Q165,375 162,400 Q160,430 160,455" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.8" opacity="0.5" />
            {/* Quad muscle */}
            <path d="M155,355 Q148,385 147,410 Q150,415 160,410 Q162,385 165,355" fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="0.4" opacity="0.5" />
            {/* Calf */}
            <path d="M148,465 Q145,485 146,505 Q148,510 152,505 Q150,485 150,470" fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="0.3" opacity="0.4" />
            {/* Foot */}
            <path d="M135,565 Q128,568 124,567 Q122,565 125,563" fill="none" stroke="url(#smBodyGrad)" strokeWidth="1" opacity="0.6" />

            {/* Right leg */}
            <path d="M245,340 Q248,370 250,400 Q252,435 253,460 Q254,490 254,510 Q255,535 257,550 Q260,558 265,565"
              fill="none" stroke="url(#smBodyGrad)" strokeWidth="1.4" />
            <path d="M230,345 Q235,375 238,400 Q240,430 240,455" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.8" opacity="0.5" />
            <path d="M245,355 Q252,385 253,410 Q250,415 240,410 Q238,385 235,355" fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="0.4" opacity="0.5" />
            <path d="M252,465 Q255,485 254,505 Q252,510 248,505 Q250,485 250,470" fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="0.3" opacity="0.4" />
            <path d="M265,565 Q272,568 276,567 Q278,565 275,563" fill="none" stroke="url(#smBodyGrad)" strokeWidth="1" opacity="0.6" />

            {/* Spinal column */}
            {Array.from({ length: 18 }, (_, i) => {
              const y = 90 + i * 16;
              if (y > 340) return null;
              return (
                <rect key={`vert-${i}`} x="197" y={y} width="6" height="3" rx="1"
                  fill="hsl(200, 45%, 35%)" opacity="0.12" stroke="hsl(200, 45%, 40%)" strokeWidth="0.3" strokeOpacity="0.2" />
              );
            })}

            {/* === SOMATIZATION DETECTION POINTS === */}
            {somatizationMap.map((point, i) => {
              const region = BODY_REGIONS[point.body_region];
              if (!region) return null;
              const color = getIntensityColor(point.intensity);
              const isSelected = selected === i;

              let cx = region.cx;
              if (point.body_region === "maos") cx = i % 2 === 0 ? 58 : 342;
              if (point.body_region === "ombros") cx = i % 2 === 0 ? 135 : 265;

              const labelX = region.labelSide === "left" ? 18 : 310;
              const lineEndX = region.labelSide === "left" ? 55 : 345;

              return (
                <g key={i} onClick={() => setSelected(isSelected ? null : i)} className="cursor-pointer">
                  {/* Thermal heat signature */}
                  <circle cx={cx} cy={region.cy} r={isSelected ? 28 : 22} fill={color} opacity={0.06}>
                    <animate attributeName="opacity" values="0.03;0.09;0.03" dur="3s" repeatCount="indefinite" />
                  </circle>

                  {/* Crosshair outer */}
                  <circle cx={cx} cy={region.cy} r={isSelected ? 14 : 10} fill="none"
                    stroke={color} strokeWidth={isSelected ? 1.2 : 0.8} strokeDasharray="3,3" strokeOpacity={0.6}>
                    <animate attributeName="stroke-dashoffset" values="0;-12" dur="2s" repeatCount="indefinite" />
                  </circle>

                  {/* Crosshair lines */}
                  <line x1={cx - 16} y1={region.cy} x2={cx - 7} y2={region.cy} stroke={color} strokeWidth="0.6" opacity="0.5" />
                  <line x1={cx + 7} y1={region.cy} x2={cx + 16} y2={region.cy} stroke={color} strokeWidth="0.6" opacity="0.5" />
                  <line x1={cx} y1={region.cy - 16} x2={cx} y2={region.cy - 7} stroke={color} strokeWidth="0.6" opacity="0.5" />
                  <line x1={cx} y1={region.cy + 7} x2={cx} y2={region.cy + 16} stroke={color} strokeWidth="0.6" opacity="0.5" />

                  {/* Core pulse point */}
                  <circle cx={cx} cy={region.cy} r={3} fill={color} opacity={0.95} filter="url(#smGlow)">
                    <animate attributeName="r" values="2.5;4;2.5" dur="1.5s" repeatCount="indefinite" />
                  </circle>

                  {/* Label callout line */}
                  <line x1={cx} y1={region.cy} x2={lineEndX} y2={region.cy}
                    stroke={color} strokeWidth="0.5" opacity={isSelected ? 0.6 : 0.3} strokeDasharray="2,2" />

                  {/* Label text */}
                  <text x={labelX} y={region.cy - 4} fill={color} fontSize="7" fontFamily="monospace"
                    fontWeight="bold" opacity={isSelected ? 0.9 : 0.5} letterSpacing="0.1em">
                    {region.label}
                  </text>
                  <text x={labelX} y={region.cy + 6} fill={color} fontSize="5.5" fontFamily="monospace"
                    opacity={isSelected ? 0.7 : 0.35}>
                    {point.intensity}% — {getIntensityLabel(point.intensity)}
                  </text>
                </g>
              );
            })}

            {/* Scan line animation */}
            <line x1="60" y1="0" x2="340" y2="0" stroke="hsl(175, 70%, 50%)" strokeWidth="0.8" opacity="0.15">
              <animate attributeName="y1" values="0;580;0" dur="6s" repeatCount="indefinite" />
              <animate attributeName="y2" values="0;580;0" dur="6s" repeatCount="indefinite" />
            </line>
          </svg>

          {/* Status bar */}
          <div className="flex items-center justify-between mt-1 px-1">
            <span className="text-[8px] font-mono text-muted-foreground tracking-wider">SCAN COMPLETE</span>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[8px] font-mono text-primary tracking-wider">LIVE</span>
            </div>
          </div>
        </div>

        {/* Data panel */}
        <div className="flex-1 space-y-1.5 w-full">
          <div className="text-[9px] font-mono text-muted-foreground tracking-wider mb-2 uppercase">
            Detected Anomalies
          </div>
          {somatizationMap.map((point, i) => {
            const region = BODY_REGIONS[point.body_region];
            const color = getIntensityColor(point.intensity);
            const isSelected = selected === i;

            return (
              <div
                key={i}
                onClick={() => setSelected(isSelected ? null : i)}
                className={`rounded border p-2.5 cursor-pointer transition-all duration-200 font-mono ${
                  isSelected
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/60 bg-secondary/10 hover:border-primary/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="relative">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                    {point.intensity >= 70 && (
                      <div className="absolute inset-0 h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: color, opacity: 0.4 }} />
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-foreground tracking-wide">
                    {region?.label || point.body_region}
                  </span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded border ml-auto tracking-wider"
                    style={{ color, borderColor: color, opacity: 0.7 }}>
                    {getIntensityLabel(point.intensity)}
                  </span>
                </div>
                <p className="text-[9px] text-muted-foreground mb-0.5">
                  <span className="text-primary/70">{point.organ_or_area}</span>
                  {" · "}
                  <span className="italic">{point.emotion}</span>
                </p>
                {isSelected && (
                  <p className="text-[9px] text-muted-foreground leading-relaxed mt-1.5 border-t border-border/40 pt-1.5 animate-in fade-in-50 duration-200">
                    {point.description}
                  </p>
                )}
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 bg-muted/50 rounded-full h-1">
                    <div className="h-1 rounded-full transition-all duration-700" style={{ width: `${point.intensity}%`, backgroundColor: color }} />
                  </div>
                  <span className="text-[8px] text-muted-foreground tabular-nums">{point.intensity}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[8px] font-mono text-muted-foreground tracking-wider text-center uppercase opacity-60">
        Biometric scan · Neurociência · PNL · Física Quântica
      </p>
    </div>
  );
}
