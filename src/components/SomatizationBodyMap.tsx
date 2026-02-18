import { useState } from "react";
import somatizationBody from "@/assets/somatization-body.jpeg";

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

// Percentages relative to image dimensions for dot placement
const BODY_REGIONS: Record<string, { label: string; x: number; y: number }> = {
  cabeca: { label: "CRANIANO", x: 50, y: 10 },
  garganta: { label: "CERVICAL", x: 50, y: 18 },
  ombros: { label: "DELTOIDE", x: 28, y: 24 },
  peito: { label: "TORÁCICO", x: 50, y: 32 },
  coluna: { label: "ESPINHAL", x: 50, y: 40 },
  estomago: { label: "GÁSTRICO", x: 50, y: 45 },
  ventre: { label: "PÉLVICO", x: 50, y: 52 },
  maos: { label: "CARPAL", x: 20, y: 55 },
  pernas: { label: "FEMORAL", x: 42, y: 72 },
  joelhos: { label: "PATELAR", x: 42, y: 80 },
  pes: { label: "PODAL", x: 42, y: 92 },
};

function getIntensityColor(intensity: number): string {
  if (intensity >= 70) return "hsl(260, 60%, 65%)";
  if (intensity >= 40) return "hsl(175, 70%, 50%)";
  return "hsl(210, 50%, 55%)";
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
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            Escaneamento Biométrico de Somatização
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground tracking-wider">
          {somatizationMap.length} REGIÃO{somatizationMap.length > 1 ? "S" : ""} DETECTADA{somatizationMap.length > 1 ? "S" : ""}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Imagem do corpo centralizada com pontos */}
        <div className="relative flex-shrink-0 rounded-xl overflow-hidden border border-border bg-background/80 mx-auto">
          <div className="relative animate-[pulse_4s_ease-in-out_infinite]" style={{ animationTimingFunction: "ease-in-out" }}>
            <img
              src={somatizationBody}
              alt="Mapa de somatização corporal"
              className="w-[220px] h-auto object-contain"
            />
            {/* Glowing dots on body regions */}
            {somatizationMap.map((point, i) => {
              const region = BODY_REGIONS[point.body_region];
              if (!region) return null;
              const color = getIntensityColor(point.intensity);
              const isCritical = point.intensity >= 70;
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${region.x}%`,
                    top: `${region.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="h-3.5 w-3.5 rounded-full"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.85)",
                      boxShadow: `0 0 12px 6px ${color}, 0 0 24px 10px ${color}, 0 0 4px 2px rgba(255,255,255,0.9)`,
                    }}
                  />
                  {isCritical && (
                    <div
                      className="absolute inset-0 h-3 w-3 rounded-full animate-ping"
                      style={{ backgroundColor: color, opacity: 0.5 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {/* Barra de status */}
          <div className="flex items-center justify-center px-2 py-1 bg-background/90 border-t border-border">
            <span className="text-[9px] text-muted-foreground tracking-wider">VARREDURA COMPLETA</span>
          </div>
        </div>

        {/* Painel de dados */}
        <div className="flex-1 space-y-2 w-full">
          <div className="text-[10px] text-muted-foreground tracking-wider mb-2 uppercase">
            Anomalias Detectadas
          </div>
          {somatizationMap.map((point, i) => {
            const region = BODY_REGIONS[point.body_region];
            const isSelected = selected === i;
            const isCritical = point.intensity >= 70;
            // Gradient: cyan for moderate/low, lilac for critical
            const barColorFrom = isCritical ? "hsl(260, 60%, 65%)" : "hsl(175, 70%, 50%)";
            const barColorTo = isCritical ? "hsl(290, 55%, 55%)" : "hsl(200, 60%, 50%)";
            const badgeColor = getIntensityColor(point.intensity);

            return (
              <div
                key={i}
                onClick={() => setSelected(isSelected ? null : i)}
                className={`rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/60 bg-secondary/10 hover:border-primary/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="relative">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: badgeColor }} />
                    {isCritical && (
                      <div className="absolute inset-0 h-2.5 w-2.5 rounded-full animate-ping" style={{ backgroundColor: badgeColor, opacity: 0.4 }} />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-foreground tracking-wide">
                    {region?.label || point.body_region}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded border ml-auto tracking-wider font-medium"
                    style={{ color: badgeColor, borderColor: badgeColor, opacity: 0.8 }}>
                    {getIntensityLabel(point.intensity)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  <span className="text-primary/70 font-medium">{point.organ_or_area}</span>
                  {" · "}
                  <span className="italic">{point.emotion}</span>
                </p>
                {isSelected && (
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2 border-t border-border/40 pt-2 animate-in fade-in-50 duration-200">
                    {point.description}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-muted/50 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-700"
                      style={{
                        width: `${point.intensity}%`,
                        background: `linear-gradient(90deg, ${barColorFrom}, ${barColorTo})`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground tabular-nums">{point.intensity}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[9px] text-muted-foreground tracking-wider text-center uppercase opacity-60">
        Varredura biométrica · Neurociência · PNL · Física Quântica
      </p>
    </div>
  );
}
