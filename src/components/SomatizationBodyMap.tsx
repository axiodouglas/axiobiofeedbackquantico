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
  cabeca: { cx: 200, cy: 58, label: "CRANIANO", labelSide: "right" },
  garganta: { cx: 200, cy: 115, label: "CERVICAL", labelSide: "left" },
  ombros: { cx: 200, cy: 148, label: "DELTOIDE", labelSide: "right" },
  peito: { cx: 200, cy: 195, label: "TORÁCICO", labelSide: "left" },
  estomago: { cx: 200, cy: 260, label: "GÁSTRICO", labelSide: "right" },
  ventre: { cx: 200, cy: 320, label: "PÉLVICO", labelSide: "left" },
  coluna: { cx: 200, cy: 230, label: "ESPINHAL", labelSide: "right" },
  maos: { cx: 200, cy: 350, label: "CARPAL", labelSide: "left" },
  pernas: { cx: 200, cy: 450, label: "FEMORAL", labelSide: "right" },
};

function getIntensityColor(intensity: number): string {
  if (intensity >= 70) return "hsl(175, 80%, 50%)";
  if (intensity >= 40) return "hsl(195, 70%, 50%)";
  return "hsl(220, 60%, 55%)";
}

function getIntensityLabel(intensity: number): string {
  if (intensity >= 70) return "CRÍTICO";
  if (intensity >= 40) return "MODERADO";
  return "BAIXO";
}

export default function SomatizationBodyMap({ somatizationMap }: SomatizationBodyMapProps) {
  const [selected, setSelected] = useState<number | null>(null);

  if (!somatizationMap || somatizationMap.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between border-b border-primary/20 pb-2 mb-1">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-primary uppercase">
            Escaneamento Biométrico de Somatização
          </span>
        </div>
        <span className="text-[9px] font-mono text-muted-foreground tracking-wider">
          {somatizationMap.length} REGIÃO{somatizationMap.length > 1 ? "S" : ""} DETECTADA{somatizationMap.length > 1 ? "S" : ""}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-start">
        {/* Área do scanner corporal */}
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
                <stop offset="0%" stopColor="hsl(195, 50%, 30%)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="hsl(220, 45%, 25%)" stopOpacity="0.08" />
              </linearGradient>
              <linearGradient id="smSkinFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(195, 45%, 28%)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="hsl(210, 40%, 22%)" stopOpacity="0.12" />
              </linearGradient>
              <filter id="smGlow">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <pattern id="smGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(200, 40%, 30%)" strokeWidth="0.3" opacity="0.2" />
              </pattern>
            </defs>

            {/* Grade de fundo */}
            <rect width="400" height="580" fill="url(#smGrid)" opacity="0.5" />

            {/* Coordenadas da grade */}
            {[0, 1, 2, 3, 4, 5].map(i => (
              <text key={`gy-${i}`} x="4" y={i * 100 + 15} fill="hsl(200, 40%, 40%)" fontSize="6" fontFamily="monospace" opacity="0.35">
                {String.fromCharCode(65 + i)}0
              </text>
            ))}
            {[0, 1, 2, 3].map(i => (
              <text key={`gx-${i}`} x={i * 100 + 50} y="576" fill="hsl(200, 40%, 40%)" fontSize="6" fontFamily="monospace" opacity="0.35">
                X{i + 1}
              </text>
            ))}

            {/* === SILHUETA HUMANA ANATOMICAMENTE PROPORCIONAL === */}

            {/* Cabeça — forma craniana realista */}
            <ellipse cx="200" cy="45" rx="28" ry="34" fill="url(#smSkinFill)" stroke="url(#smBodyGrad)" strokeWidth="1.2" />
            {/* Maxilar */}
            <path d="M176,58 Q180,72 192,78 L200,80 L208,78 Q220,72 224,58" fill="url(#smSkinFill)" stroke="url(#smBodyGrad)" strokeWidth="0.8" />
            {/* Estrutura craniana sutil */}
            <path d="M178,32 Q188,16 200,13 Q212,16 222,32" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.4" opacity="0.2" />
            <ellipse cx="190" cy="42" rx="5" ry="3" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.3" opacity="0.15" />
            <ellipse cx="210" cy="42" rx="5" ry="3" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.3" opacity="0.15" />

            {/* Pescoço — músculos esternocleidomastóideos */}
            <path d="M190,80 Q188,92 184,108" fill="none" stroke="url(#smBodyGrad)" strokeWidth="1.2" />
            <path d="M210,80 Q212,92 216,108" fill="none" stroke="url(#smBodyGrad)" strokeWidth="1.2" />
            <rect x="188" y="82" width="24" height="28" rx="8" fill="url(#smSkinFill)" stroke="none" />

            {/* Trapézio */}
            <path d="M184,108 Q160,115 132,128 Q118,138 112,152" fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="1.2" />
            <path d="M216,108 Q240,115 268,128 Q282,138 288,152" fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="1.2" />

            {/* Torso — forma anatômica com volume muscular */}
            <path d="M112,152 Q108,180 110,215 Q112,255 118,290 Q126,322 145,342 Q168,358 200,360 Q232,358 255,342 Q274,322 282,290 Q288,255 290,215 Q292,180 288,152"
              fill="url(#smSkinFill)" stroke="url(#smBodyGrad)" strokeWidth="1.3" />

            {/* Peitorais */}
            <path d="M140,152 Q155,160 175,168 Q190,172 200,173 Q210,172 225,168 Q245,160 260,152"
              fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="0.5" opacity="0.5" />
            {/* Separação peitoral */}
            <line x1="200" y1="150" x2="200" y2="175" stroke="url(#smBodyGrad)" strokeWidth="0.4" opacity="0.25" />

            {/* Linhas abdominais */}
            <line x1="200" y1="178" x2="200" y2="330" stroke="url(#smBodyGrad)" strokeWidth="0.4" opacity="0.2" />
            {[195, 215, 235, 255, 275, 295].map((y, i) => (
              <path key={`ab-${i}`} d={`M175,${y} Q188,${y + 2} 200,${y + 3} Q212,${y + 2} 225,${y}`}
                fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.35" opacity="0.2" />
            ))}

            {/* Costelas sutis */}
            {[160, 172, 184].map((y, i) => (
              <path key={`rib-${i}`} d={`M150,${y} Q175,${y + 7} 200,${y + 9} Q225,${y + 7} 250,${y}`}
                fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.25" opacity="0.15" />
            ))}

            {/* Oblíquos */}
            <path d="M118,250 Q135,258 152,272" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.35" opacity="0.18" />
            <path d="M282,250 Q265,258 248,272" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.35" opacity="0.18" />

            {/* Órgãos internos (muito sutis) */}
            <path d="M192,186 Q187,181 189,176 Q193,173 197,177 L200,181 L203,177 Q207,173 211,176 Q213,181 208,186 L200,198 Z"
              fill="hsl(175, 60%, 40%)" opacity="0.08" stroke="hsl(175, 60%, 45%)" strokeWidth="0.4" strokeOpacity="0.2" />
            <ellipse cx="208" cy="255" rx="20" ry="14" fill="hsl(195, 50%, 35%)" opacity="0.06" stroke="hsl(195, 50%, 40%)" strokeWidth="0.3" strokeOpacity="0.18" />

            {/* Braço esquerdo — com volume de bíceps/antebraço */}
            {/* Deltoide */}
            <path d="M112,152 Q104,145 98,155 Q92,170 90,188 Q92,195 100,192 Q108,180 112,165"
              fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="0.9" />
            {/* Braço */}
            <path d="M96,190 Q88,215 82,240 Q78,260 74,280"
              fill="none" stroke="url(#smBodyGrad)" strokeWidth="1.3" />
            <path d="M100,190 Q94,215 88,240 Q84,260 80,280"
              fill="url(#smMuscleFill)" stroke="none" />
            {/* Antebraço */}
            <path d="M74,280 Q70,300 66,320 Q62,335 58,348"
              fill="none" stroke="url(#smBodyGrad)" strokeWidth="1.1" />
            {/* Mão */}
            <path d="M58,348 Q54,356 50,362 M58,348 Q58,358 56,364 M58,348 Q62,356 62,362 M58,348 Q56,354 52,358"
              fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.7" opacity="0.5" />

            {/* Braço direito */}
            <path d="M288,152 Q296,145 302,155 Q308,170 310,188 Q308,195 300,192 Q292,180 288,165"
              fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="0.9" />
            <path d="M304,190 Q312,215 318,240 Q322,260 326,280"
              fill="none" stroke="url(#smBodyGrad)" strokeWidth="1.3" />
            <path d="M300,190 Q306,215 312,240 Q316,260 320,280"
              fill="url(#smMuscleFill)" stroke="none" />
            <path d="M326,280 Q330,300 334,320 Q338,335 342,348"
              fill="none" stroke="url(#smBodyGrad)" strokeWidth="1.1" />
            <path d="M342,348 Q346,356 350,362 M342,348 Q342,358 344,364 M342,348 Q338,356 338,362 M342,348 Q344,354 348,358"
              fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.7" opacity="0.5" />

            {/* Pélvis */}
            <path d="M145,342 Q172,354 200,356 Q228,354 255,342" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.5" opacity="0.3" />

            {/* Perna esquerda — coxa e panturrilha com volume */}
            <path d="M158,342 Q154,370 152,400 Q150,430 149,460 Q148,490 148,515 Q147,540 145,555 Q142,562 137,568"
              fill="none" stroke="url(#smBodyGrad)" strokeWidth="1.3" />
            <path d="M172,348 Q168,378 165,405 Q163,435 162,458"
              fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.7" opacity="0.4" />
            {/* Quadríceps */}
            <path d="M158,358 Q150,390 149,415 Q152,418 162,413 Q164,388 168,358"
              fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="0.3" opacity="0.5" />
            {/* Panturrilha */}
            <path d="M150,470 Q147,490 148,510 Q150,514 154,508 Q152,490 152,475"
              fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="0.25" opacity="0.35" />
            {/* Pé */}
            <path d="M137,568 Q130,571 126,570 Q124,568 127,566" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.9" opacity="0.5" />

            {/* Perna direita */}
            <path d="M242,342 Q246,370 248,400 Q250,430 251,460 Q252,490 252,515 Q253,540 255,555 Q258,562 263,568"
              fill="none" stroke="url(#smBodyGrad)" strokeWidth="1.3" />
            <path d="M228,348 Q232,378 235,405 Q237,435 238,458"
              fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.7" opacity="0.4" />
            <path d="M242,358 Q250,390 251,415 Q248,418 238,413 Q236,388 232,358"
              fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="0.3" opacity="0.5" />
            <path d="M250,470 Q253,490 252,510 Q250,514 246,508 Q248,490 248,475"
              fill="url(#smMuscleFill)" stroke="url(#smBodyGrad)" strokeWidth="0.25" opacity="0.35" />
            <path d="M263,568 Q270,571 274,570 Q276,568 273,566" fill="none" stroke="url(#smBodyGrad)" strokeWidth="0.9" opacity="0.5" />

            {/* Coluna vertebral */}
            {Array.from({ length: 18 }, (_, i) => {
              const y = 90 + i * 16;
              if (y > 340) return null;
              return (
                <rect key={`vert-${i}`} x="197" y={y} width="6" height="3" rx="1"
                  fill="hsl(200, 45%, 35%)" opacity="0.1" stroke="hsl(200, 45%, 40%)" strokeWidth="0.2" strokeOpacity="0.15" />
              );
            })}

            {/* === PONTOS DE DETECÇÃO DE SOMATIZAÇÃO === */}
            {somatizationMap.map((point, i) => {
              const region = BODY_REGIONS[point.body_region];
              if (!region) return null;
              const color = getIntensityColor(point.intensity);
              const isSelected = selected === i;

              let cx = region.cx;
              if (point.body_region === "maos") cx = i % 2 === 0 ? 58 : 342;
              if (point.body_region === "ombros") cx = i % 2 === 0 ? 135 : 265;

              const labelX = region.labelSide === "left" ? 16 : 312;
              const lineEndX = region.labelSide === "left" ? 52 : 348;

              return (
                <g key={i} onClick={() => setSelected(isSelected ? null : i)} className="cursor-pointer">
                  {/* Assinatura térmica */}
                  <circle cx={cx} cy={region.cy} r={isSelected ? 26 : 20} fill={color} opacity={0.05}>
                    <animate attributeName="opacity" values="0.02;0.07;0.02" dur="3s" repeatCount="indefinite" />
                  </circle>

                  {/* Crosshair externo */}
                  <circle cx={cx} cy={region.cy} r={isSelected ? 13 : 9} fill="none"
                    stroke={color} strokeWidth={isSelected ? 1 : 0.6} strokeDasharray="2,3" strokeOpacity={0.5}>
                    <animate attributeName="stroke-dashoffset" values="0;-10" dur="2.5s" repeatCount="indefinite" />
                  </circle>

                  {/* Linhas de mira finas */}
                  <line x1={cx - 14} y1={region.cy} x2={cx - 6} y2={region.cy} stroke={color} strokeWidth="0.4" opacity="0.4" />
                  <line x1={cx + 6} y1={region.cy} x2={cx + 14} y2={region.cy} stroke={color} strokeWidth="0.4" opacity="0.4" />
                  <line x1={cx} y1={region.cy - 14} x2={cx} y2={region.cy - 6} stroke={color} strokeWidth="0.4" opacity="0.4" />
                  <line x1={cx} y1={region.cy + 6} x2={cx} y2={region.cy + 14} stroke={color} strokeWidth="0.4" opacity="0.4" />

                  {/* Ponto central pulsante */}
                  <circle cx={cx} cy={region.cy} r={2.5} fill={color} opacity={0.9} filter="url(#smGlow)">
                    <animate attributeName="r" values="2;3.5;2" dur="1.8s" repeatCount="indefinite" />
                  </circle>

                  {/* Linha de chamada elegante */}
                  <line x1={cx} y1={region.cy} x2={lineEndX} y2={region.cy}
                    stroke={color} strokeWidth="0.35" opacity={isSelected ? 0.5 : 0.2} strokeDasharray="1,2" />

                  {/* Rótulo */}
                  <text x={labelX} y={region.cy - 4} fill={color} fontSize="6.5" fontFamily="monospace"
                    fontWeight="bold" opacity={isSelected ? 0.85 : 0.45} letterSpacing="0.08em">
                    {region.label}
                  </text>
                  <text x={labelX} y={region.cy + 5} fill={color} fontSize="5" fontFamily="monospace"
                    opacity={isSelected ? 0.65 : 0.3}>
                    {point.intensity}% — {getIntensityLabel(point.intensity)}
                  </text>
                </g>
              );
            })}

            {/* Linha de varredura animada */}
            <line x1="60" y1="0" x2="340" y2="0" stroke="hsl(175, 70%, 50%)" strokeWidth="0.6" opacity="0.12">
              <animate attributeName="y1" values="0;580;0" dur="6s" repeatCount="indefinite" />
              <animate attributeName="y2" values="0;580;0" dur="6s" repeatCount="indefinite" />
            </line>
          </svg>

          {/* Barra de status */}
          <div className="flex items-center justify-between mt-1 px-1">
            <span className="text-[8px] font-mono text-muted-foreground tracking-wider">VARREDURA COMPLETA</span>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[8px] font-mono text-primary tracking-wider">AO VIVO</span>
            </div>
          </div>
        </div>

        {/* Painel de dados */}
        <div className="flex-1 space-y-1.5 w-full">
          <div className="text-[9px] font-mono text-muted-foreground tracking-wider mb-2 uppercase">
            Anomalias Detectadas
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
        Varredura biométrica · Neurociência · PNL · Física Quântica
      </p>
    </div>
  );
}
