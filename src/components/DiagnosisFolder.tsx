import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Brain, Sparkles, Mic, ChevronRight, AlertTriangle, DollarSign, Stethoscope, Users, Folder, FolderOpen, FileText } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

const areaLabels: Record<string, string> = {
  pai: "Pai",
  mae: "Mãe",
  traumas: "Traumas",
  relacionamentos: "Relacionamentos",
};

interface DiagnosisData {
  id: string;
  area: string;
  frequency_score: number | null;
  created_at: string;
  diagnosis_result: any;
}

interface QuantumCommand {
  id: string;
  command_text: string;
  command_type: string | null;
}

interface DiagnosisFolderProps {
  diagnosis: DiagnosisData;
  isPremium: boolean;
  userId: string;
}

export default function DiagnosisFolder({ diagnosis, isPremium, userId }: DiagnosisFolderProps) {
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState<string | null>(null);
  const [commands, setCommands] = useState<QuantumCommand[]>([]);
  const [commandsLoaded, setCommandsLoaded] = useState(false);

  const daysLeft = 90 - differenceInDays(new Date(), new Date(diagnosis.created_at));
  const expiresLabel = daysLeft <= 0 ? "expirado" : `expira em ${daysLeft}d`;
  const expiresUrgent = daysLeft <= 7;

  const handleOpen = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && isPremium && !commandsLoaded) {
      const { data } = await supabase
        .from("quantum_commands")
        .select("*")
        .eq("diagnosis_id", diagnosis.id)
        .eq("user_id", userId);
      if (data) setCommands(data as QuantumCommand[]);
      setCommandsLoaded(true);
    }
  };

  const toggleSub = (key: string) => setSubOpen(subOpen === key ? null : key);

  const dr = diagnosis.diagnosis_result;

  const commandsByType = {
    manha: commands.find((c) => c.command_type === "manha"),
    dia: commands.find((c) => c.command_type === "dia"),
    noite: commands.find((c) => c.command_type === "noite"),
  };

  return (
    <Collapsible open={open} onOpenChange={handleOpen}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-secondary/30 hover:border-primary/30 transition-colors cursor-pointer">
          {open ? <FolderOpen className="h-4 w-4 text-primary shrink-0" /> : <Folder className="h-4 w-4 text-muted-foreground shrink-0" />}
          <span className="text-sm font-medium text-foreground">
            {format(new Date(diagnosis.created_at), "dd/MM/yyyy", { locale: ptBR })}
          </span>
          <Badge variant="secondary" className="text-[10px]">
            {areaLabels[diagnosis.area] || diagnosis.area}
          </Badge>
          <span className={`text-[10px] ml-auto ${expiresUrgent ? "text-destructive" : "text-muted-foreground"}`}>
            {expiresLabel}
          </span>
          <ChevronRight className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="pl-6 mt-1 space-y-1">
        {/* Sub-folder: Relatório */}
        <SubFolder
          label="Relatório A.X.I.O."
          icon={<Brain className="h-3.5 w-3.5 text-primary" />}
          open={subOpen === "report"}
          onToggle={() => toggleSub("report")}
        >
          {dr ? <ReportContent diagnosis={dr} /> : <EmptyState text="Relatório não disponível." />}
        </SubFolder>

        {/* Sub-folder: Comandos */}
        <SubFolder
          label="Comandos Quânticos"
          icon={<Sparkles className="h-3.5 w-3.5 text-primary" />}
          open={subOpen === "commands"}
          onToggle={() => toggleSub("commands")}
          locked={!isPremium}
        >
          <CommandsContent commands={commandsByType} />
        </SubFolder>

        {/* Sub-folder: Meditação */}
        <SubFolder
          label="Meditação da Semana"
          icon={<Mic className="h-3.5 w-3.5 text-primary" />}
          open={subOpen === "meditation"}
          onToggle={() => toggleSub("meditation")}
          locked={!isPremium}
        >
          <MeditationContent />
        </SubFolder>
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ---- SubFolder ---- */
function SubFolder({
  label,
  icon,
  open,
  onToggle,
  locked,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  locked?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Collapsible open={open && !locked} onOpenChange={() => !locked && onToggle()}>
      <CollapsibleTrigger asChild>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary/50 transition-colors cursor-pointer ${locked ? "opacity-50" : ""}`}>
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          {icon}
          <span className="text-xs font-medium text-foreground">{label}</span>
          {locked && <Badge variant="secondary" className="text-[9px] ml-auto">Premium</Badge>}
          {!locked && <ChevronRight className={`h-3 w-3 text-muted-foreground ml-auto transition-transform ${open ? "rotate-90" : ""}`} />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 mt-1">
        <Card className="border-primary/10">
          <CardContent className="pt-4 pb-4 space-y-4">
            {children}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ---- Report ---- */
function ReportContent({ diagnosis }: { diagnosis: any }) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-sm font-bold text-foreground mb-1">{diagnosis.title}</h3>
        <p className="text-xs text-muted-foreground">{diagnosis.summary}</p>
      </div>

      {diagnosis.predominant_sentiments?.length > 0 && (
        <div className="bg-secondary/50 rounded-lg p-3">
          <p className="text-xs font-semibold text-foreground mb-2">Sentimento Predominante</p>
          {diagnosis.predominant_sentiments
            .sort((a: any, b: any) => b.intensity - a.intensity)
            .slice(0, 1)
            .map((s: any, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground whitespace-nowrap">{s.name}</span>
                <div className="flex-1 bg-muted rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-destructive via-yellow-500 to-primary h-2.5 rounded-full" style={{ width: `${s.intensity}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground">{s.intensity}%</span>
              </div>
            ))}
        </div>
      )}

      {diagnosis.blocks?.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-foreground flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-destructive" /> Bloqueios
          </p>
          {diagnosis.blocks.map((b: any, i: number) => (
            <div key={i} className="bg-secondary/30 border border-border rounded-lg p-2.5">
              <p className="text-xs font-semibold text-foreground">{i + 1}. {b.name}</p>
              <p className="text-[11px] text-muted-foreground">{b.description}</p>
            </div>
          ))}
        </div>
      )}

      {diagnosis.root_wound && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
          <p className="text-xs font-semibold text-foreground mb-0.5">🔍 Ferida Raiz</p>
          <p className="text-xs text-muted-foreground italic">"{diagnosis.root_wound}"</p>
        </div>
      )}

      {diagnosis.secondary_impacts && (
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-foreground">📊 Impacto nas 3 Áreas</p>
          {diagnosis.secondary_impacts.financeiro && (
            <ImpactRow icon={<DollarSign className="h-3 w-3 text-primary" />} label="💰 Financeiro" text={diagnosis.secondary_impacts.financeiro} />
          )}
          {diagnosis.secondary_impacts.saude && (
            <ImpactRow icon={<Stethoscope className="h-3 w-3 text-primary" />} label="🏥 Saúde" text={diagnosis.secondary_impacts.saude} />
          )}
          {diagnosis.secondary_impacts.relacionamentos && (
            <ImpactRow icon={<Users className="h-3 w-3 text-primary" />} label="❤️ Relacionamentos" text={diagnosis.secondary_impacts.relacionamentos} />
          )}
        </div>
      )}
    </div>
  );
}

function ImpactRow({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <div className="flex items-start gap-2 bg-secondary/20 border border-border rounded-lg p-2.5">
      <span className="shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="text-[10px] font-semibold text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

/* ---- Commands ---- */
const RITUAL_INTRO = `A cura AXIO exige que sua mente lógica se cale para que seu corpo aprenda. Siga este ritual antes de cada comando para induzir o estado de transe e alta sugestão:

1. Feche os olhos e, mesmo de olhos fechados, direcione seu olhar para o topo da cabeça (olhe para cima internamente, em direção à testa).
2. Faça 5 respirações profundas: inspire pelo nariz e solte pela boca suavemente.
3. Na 5ª vez que soltar o ar, esvazie os pulmões completamente e segure sem ar pelo máximo de tempo que conseguir, sentindo o silêncio absoluto do seu corpo.
4. Quando não aguentar mais e precisar respirar, deixe o ar entrar naturalmente, sinta a calma profunda e inicie a fala do comando abaixo.

✨ Instrução de Ouro: Se conseguir lembrar de cabeça, fale o comando de olhos fechados. Repita cada comando 3 vezes seguidas com convicção, conversando diretamente com seu corpo e sua mente.`;

function CommandsContent({ commands }: { commands: { manha?: QuantumCommand; dia?: QuantumCommand; noite?: QuantumCommand } }) {
  const periods = [
    { key: "manha", label: "🌅 Manhã — Identidade e Segurança", cmd: commands.manha },
    { key: "dia", label: "☀️ Tarde — Merecimento e Ação", cmd: commands.dia },
    { key: "noite", label: "🌙 Noite — Limpeza e Entrega", cmd: commands.noite },
  ];
  return (
    <div className="space-y-4">
      {/* Ritual Intro */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
        <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Protocolo de Preparo Fisiológico
        </p>
        <p className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-line">
          {RITUAL_INTRO}
        </p>
      </div>

      {/* Commands */}
      {periods.map((p) => (
        <div key={p.key} className="bg-secondary/30 border border-border rounded-lg p-3">
          <p className="text-xs font-semibold text-foreground mb-1.5">{p.label}</p>
          {p.cmd ? (
            <p className="text-xs text-muted-foreground leading-relaxed">{p.cmd.command_text}</p>
          ) : (
            <p className="text-[11px] text-muted-foreground italic">Comando será gerado após o diagnóstico.</p>
          )}
          {p.cmd && (
            <p className="text-[10px] text-primary/70 mt-2 italic">Repita 3 vezes com convicção.</p>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---- Meditation ---- */
function MeditationContent() {
  return (
    <div className="text-center py-4 space-y-2">
      <Mic className="h-8 w-8 text-muted-foreground/40 mx-auto" />
      <p className="text-xs text-muted-foreground">
        A meditação gravada com sua própria voz ficará disponível aqui após a geração dos comandos.
      </p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-xs text-muted-foreground italic text-center py-2">{text}</p>;
}
