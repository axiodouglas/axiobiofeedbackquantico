import { useEffect, useRef, useState } from "react";
import { Play, Pause, Loader2, Atom } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Protocol {
  file: string;
  title: string;
  subtitle: string;
  math: string;
  science: string;
}

const PROTOCOLS: Protocol[] = [
  {
    file: "01-reset-adrenal.wav",
    title: "Protocolo 1 — Reset Adrenal",
    subtitle: "Cortisol Killer · 174Hz + Pulso Isocrônico Delta 3Hz",
    math: "Base 174Hz · LFO ±0.03Hz/5s · Pulso isocrônico 3Hz · Pan 8D φ=1.618s",
    science:
      "A frequência 174Hz reduz a atividade do eixo HPA e desacelera a produção de cortisol pela suprarrenal. O pulso isocrônico de 3Hz arrasta o córtex para o estado Delta — onde o sistema nervoso autônomo entra em modo parassimpático profundo (rest & repair), reduzindo PCR, dor crônica e hiperatividade da amígdala associada ao trauma.",
  },
  {
    file: "02-escudo-confronto.wav",
    title: "Protocolo 2 — Escudo de Confronto",
    subtitle: "Vigor de Identidade · 417Hz + Binaural Gamma 40Hz",
    math: "Base 417Hz · Binaural 40Hz (Gamma) · LFO ±0.03Hz · Espacialização 8D φ",
    science:
      "417Hz dissolve padrões neurais de retraimento social (resposta tônica de imobilização). A batida binaural de 40Hz (Gamma) sincroniza córtex pré-frontal e ínsula — ativa autopercepção, coragem e integração da identidade fragmentada por experiências de humilhação ou rejeição.",
  },
  {
    file: "03-reparo-dna.wav",
    title: "Protocolo 3 — Reparo de DNA",
    subtitle: "Bio-Expansão · 528.01Hz com Modulação Áurea",
    math: "528.01Hz exata · AM modulada por φ · LFO ±0.03Hz · Pan 8D",
    science:
      "528Hz é descrita por Horowitz e Rein como a frequência de reparo da hélice do DNA. A modulação de amplitude em proporção áurea (φ) cria um padrão de coerência cardíaca-cerebral: a variabilidade da frequência cardíaca (HRV) entra em ressonância, reduzindo marcadores de inflamação sistêmica e doenças autoimunes ligadas ao estresse oxidativo.",
  },
  {
    file: "04-desbloqueio-escassez.wav",
    title: "Protocolo 4 — Desbloqueio de Escassez",
    subtitle: "Aterramento · 852Hz + Schumann 7.83Hz",
    math: "852Hz + Schumann 7.83Hz contínua · LFO ±0.03Hz · Pan 8D φ",
    science:
      "852Hz dissolve crenças subconscientes de carência (programação parental de escassez). A Ressonância de Schumann 7.83Hz é a frequência eletromagnética da Terra: sincroniza os ritmos cerebrais Theta-Alpha, restaurando o senso de pertencimento e segurança existencial — pré-requisito neurobiológico para abertura à abundância.",
  },
  {
    file: "05-ponto-zero.wav",
    title: "Protocolo 5 — Ponto Zero (Epsilon)",
    subtitle: "Ruído Rosa Quântico + Binaural 0.5Hz · Silêncio de Planck",
    math: "Pink noise (Voss-McCartney) · Binaural 0.5Hz · Gating Planck-derived · 8D φ",
    science:
      "O ruído rosa equilibra o EEG bilateralmente (1/f). A batida binaural de 0.5Hz induz Epsilon — o estado de consciência abaixo do Delta, onde ocorrem reorganizações profundas do campo informacional. Os intervalos de silêncio derivados da constante de Planck criam micro-pausas de coerência quântica que reseta o sistema límbico ao 'ponto zero' antes de qualquer crença ser instalada.",
  },
];

interface PlayerState {
  loading: boolean;
  url: string | null;
  playing: boolean;
  current: number;
  duration: number;
}

const initialState = (): PlayerState => ({
  loading: false,
  url: null,
  playing: false,
  current: 0,
  duration: 0,
});

const QuantumCorePanel = () => {
  const [states, setStates] = useState<Record<string, PlayerState>>(
    () => Object.fromEntries(PROTOCOLS.map((p) => [p.file, initialState()])),
  );
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((a) => {
        a.pause();
        a.src = "";
      });
    };
  }, []);

  const update = (file: string, patch: Partial<PlayerState>) =>
    setStates((s) => ({ ...s, [file]: { ...s[file], ...patch } }));

  const ensureUrl = async (file: string): Promise<string | null> => {
    const cur = states[file];
    if (cur.url) return cur.url;
    update(file, { loading: true });
    try {
      const { data, error } = await supabase.functions.invoke("quantum-core-url", {
        body: { file },
      });
      if (error || !data?.url) throw new Error(error?.message ?? "Falha ao carregar áudio");
      update(file, { url: data.url, loading: false });
      return data.url;
    } catch (e) {
      update(file, { loading: false });
      toast.error(e instanceof Error ? e.message : "Erro ao carregar áudio");
      return null;
    }
  };

  const togglePlay = async (file: string) => {
    // Pause others
    Object.entries(audioRefs.current).forEach(([k, a]) => {
      if (k !== file) {
        a.pause();
        update(k, { playing: false });
      }
    });

    let audio = audioRefs.current[file];
    if (!audio) {
      const url = await ensureUrl(file);
      if (!url) return;
      audio = new Audio(url);
      audio.preload = "metadata";
      audio.addEventListener("loadedmetadata", () =>
        update(file, { duration: audio.duration }),
      );
      audio.addEventListener("timeupdate", () =>
        update(file, { current: audio.currentTime }),
      );
      audio.addEventListener("ended", () =>
        update(file, { playing: false, current: 0 }),
      );
      audioRefs.current[file] = audio;
    }

    if (audio.paused) {
      try {
        await audio.play();
        update(file, { playing: true });
      } catch {
        toast.error("Não foi possível iniciar a reprodução");
      }
    } else {
      audio.pause();
      update(file, { playing: false });
    }
  };

  const seek = (file: string, val: number) => {
    const audio = audioRefs.current[file];
    if (audio) {
      audio.currentTime = val;
      update(file, { current: val });
    }
  };

  const fmt = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Atom className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-gradient-cyan">AXIO Quantum-Core</h2>
          <p className="text-sm text-muted-foreground">
            5 protocolos sintetizados em WAV lossless · 44.1kHz · 16-bit estéreo · 10min cada
            <br />
            LFO ±0.03Hz/5s · Espacialização 8D na proporção áurea (φ=1.618s)
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {PROTOCOLS.map((p) => {
          const st = states[p.file];
          return (
            <Card key={p.file} className="p-5 border-border/60 bg-card/50 backdrop-blur">
              <div className="flex items-start gap-4">
                <Button
                  size="icon"
                  variant="cyan"
                  onClick={() => togglePlay(p.file)}
                  disabled={st.loading}
                  className="h-12 w-12 rounded-full shrink-0"
                >
                  {st.loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : st.playing ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>

                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{p.title}</h3>
                    <p className="text-xs text-primary/80">{p.subtitle}</p>
                  </div>

                  <div className="space-y-1">
                    <Slider
                      value={[st.current]}
                      max={st.duration || 600}
                      step={0.1}
                      onValueChange={(v) => seek(p.file, v[0])}
                      disabled={!st.url}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                      <span>{fmt(st.current)}</span>
                      <span>{fmt(st.duration || 600)}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground/80 font-mono leading-relaxed">
                    {p.math}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.science}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuantumCorePanel;
