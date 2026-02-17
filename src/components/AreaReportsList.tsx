import { useNavigate } from "react-router-dom";
import { FileText, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DiagnosisItem {
  id: string;
  area: string;
  created_at: string;
}

interface PerformanceItem {
  id: string;
  category: string;
  created_at: string;
}

export function AreaDiagnosisList({ diagnoses }: { diagnoses: DiagnosisItem[] }) {
  const navigate = useNavigate();
  if (diagnoses.length === 0) return null;

  return (
    <div className="mt-2 space-y-1">
      {diagnoses.slice(0, 5).map((d) => (
        <button
          key={d.id}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/diagnosis/${d.id}`);
          }}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors text-left"
        >
          <FileText className="h-3 w-3 text-primary shrink-0" />
          <span className="text-[11px] text-muted-foreground truncate">
            {format(new Date(d.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </span>
        </button>
      ))}
      {diagnoses.length > 5 && (
        <p className="text-[10px] text-muted-foreground text-center pt-1">
          +{diagnoses.length - 5} relatório(s)
        </p>
      )}
    </div>
  );
}

const categoryLabels: Record<string, string> = {
  trabalho: "Trabalho",
  relacionamentos: "Relacionamentos",
  outros: "Outros",
};

export function PerformanceAdviceList({ advices }: { advices: PerformanceItem[] }) {
  const navigate = useNavigate();
  if (advices.length === 0) return null;

  return (
    <div className="mt-2 space-y-1">
      {advices.slice(0, 5).map((a) => (
        <button
          key={a.id}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/conselheiro/${a.id}`);
          }}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors text-left"
        >
          <BarChart3 className="h-3 w-3 text-primary shrink-0" />
          <span className="text-[11px] text-muted-foreground truncate">
            {categoryLabels[a.category] || a.category} — {format(new Date(a.created_at), "dd/MM/yyyy", { locale: ptBR })}
          </span>
        </button>
      ))}
      {advices.length > 5 && (
        <p className="text-[10px] text-muted-foreground text-center pt-1">
          +{advices.length - 5} conselho(s)
        </p>
      )}
    </div>
  );
}
