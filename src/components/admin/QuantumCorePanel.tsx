import { useEffect, useRef, useState } from "react";
import { Play, Pause, Loader2, Atom, Repeat, Headphones, AlertTriangle } from "lucide-react";
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
  usage: {
    how: string;
    headphones: string;
    duration: string;
    warning?: string;
  };
}

const PROTOCOLS: Protocol[] = [
  {
    file: "01-reset-adrenal.wav",
    title: "Protocolo 1 — Reset Adrenal",
    subtitle: "Cortisol Killer · 174Hz + Pulso Isocrônico Delta 3Hz",
    math: "Base 174Hz · LFO ±0.03Hz/5s · Pulso isocrônico 3Hz · Pan 8D φ=1.618s",
    science:
      "A frequência 174Hz reduz a atividade do eixo HPA e desacelera a produção de cortisol pela suprarrenal. O pulso isocrônico de 3Hz arrasta o córtex para o estado Delta — onde o sistema nervoso autônomo entra em modo parassimpático profundo (rest & repair), reduzindo PCR, dor crônica e hiperatividade da amígdala associada ao trauma.",
    usage: {
      how: "Ouça em posição de repouso (sentado ou deitado). Feche os olhos.",
      headphones: "Obrigatórios.",
      duration: "10 a 20 minutos.",
      warning: "Não utilize enquanto dirige — induz estado Delta profundo (sonolência terapêutica).",
    },
  },
  {
    file: "02-escudo-confronto.wav",
    title: "Protocolo 2 — Escudo de Confronto",
    subtitle: "Vigor de Identidade · 417Hz + Binaural Gamma 40Hz",
    math: "Base 417Hz · Binaural 40Hz (Gamma) · LFO ±0.03Hz · Espacialização 8D φ",
    science:
      "417Hz dissolve padrões neurais de retraimento social (resposta tônica de imobilização). A batida binaural de 40Hz (Gamma) sincroniza córtex pré-frontal e ínsula — ativa autopercepção, coragem e integração da identidade fragmentada por experiências de humilhação ou rejeição.",
    usage: {
      how: "Pode ser ouvido durante o trabalho ou antes de situações sociais desafiadoras. Mantenha os olhos abertos se estiver em atividade.",
      headphones: "Obrigatórios (efeito EMDR/8D ativo).",
      duration: "10 a 15 minutos para blindagem imediata.",
    },
  },
  {
    file: "03-reparo-dna.wav",
    title: "Protocolo 3 — Reparo de DNA",
    subtitle: "Bio-Expansão · 528.01Hz com Modulação Áurea",
    math: "528.01Hz exata · AM modulada por φ · LFO ±0.03Hz · Pan 8D",
    science:
      "528Hz é descrita por Horowitz e Rein como a frequência de reparo da hélice do DNA. A modulação de amplitude em proporção áurea (φ) cria um padrão de coerência cardíaca-cerebral: a variabilidade da frequência cardíaca (HRV) entra em ressonância, reduzindo marcadores de inflamação sistêmica e doenças autoimunes ligadas ao estresse oxidativo.",
    usage: {
      how: "Ideal para o período pré-sono ou durante sessões de cura. Foque na respiração lenta.",
      headphones: "Recomendados para máxima eficácia da micro-oscilação quântica.",
      duration: "20 minutos ou em loop durante o sono.",
    },
  },
  {
    file: "04-desbloqueio-escassez.wav",
    title: "Protocolo 4 — Desbloqueio de Escassez",
    subtitle: "Aterramento · 852Hz + Schumann 7.83Hz",
    math: "852Hz + Schumann 7.83Hz contínua · LFO ±0.03Hz · Pan 8D φ",
    science:
      "852Hz dissolve crenças subconscientes de carência (programação parental de escassez). A Ressonância de Schumann 7.83Hz é a frequência eletromagnética da Terra: sincroniza os ritmos cerebrais Theta-Alpha, restaurando o senso de pertencimento e segurança existencial — pré-requisito neurobiológico para abertura à abundância.",
    usage: {
      how: "Ouça preferencialmente pela manhã, descalço ou com os pés tocando o chão, para potencializar a Ressonância de Schumann.",
      headphones: "Recomendados.",
      duration: "10 minutos para setar a frequência de abundância do dia.",
    },
  },
  {
    file: "05-ponto-zero.wav",
    title: "Protocolo 5 — Ponto Zero (Epsilon)",
    subtitle: "Ruído Rosa Quântico + Binaural 0.5Hz · Silêncio de Planck",
    math: "Pink noise (Voss-McCartney) · Binaural 0.5Hz · Gating Planck-derived · 8D φ",
    science:
      "O ruído rosa equilibra o EEG bilateralmente (1/f). A batida binaural de 0.5Hz induz Epsilon — o estado de consciência abaixo do Delta, onde ocorrem reorganizações profundas do campo informacional. Os intervalos de silêncio derivados da constante de Planck criam micro-pausas de coerência quântica que reseta o sistema límbico ao 'ponto zero' antes de qualquer crença ser instalada.",
    usage: {
      how: "Use apenas em estado de meditação absoluta. Quando a compulsão ou o pavor surgir, entre neste áudio para resetar a identidade.",
      headphones: "Estritamente obrigatórios (frequência Epsilon de 0.5Hz).",
      duration: "5 a 10 minutos (curto e intenso).",
    },
  },
];

interface PlayerState {
  loading: boolean;
  url: string | null;
  ready: boolean;
  playing: boolean;
  current: number;
  duration: number;
  loop: boolean;
}

const initialState = (): PlayerState => ({
  loading: false,
  url: null,
  ready: false,
  playing: false,
  current: 0,
  duration: 0,
  loop: true,
});

const QuantumCorePanel = () => {
  const [states, setStates] = useState<Record<string, PlayerState>>(
    () => Object.fromEntries(PROTOCOLS.map((p) => [p.file, initialState()])),
  );
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const update = (file: string, patch: Partial<PlayerState>) =>
    setStates((s) => ({ ...s, [file]: { ...s[file], ...patch } }));

  // Obtém apenas a URL assinada — o navegador faz streaming progressivo nativo
  const getSignedUrl = async (file: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("quantum-core-url", {
        body: { file },
      });
      if (error || !data?.url) throw new Error("Falha ao obter URL");
      return data.url as string;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao carregar áudio");
      return null;
    }
  };

  const ensureAudio = (file: string, src: string): HTMLAudioElement => {
    let audio = audioRefs.current[file];
    if (!audio) {
      audio = new Audio();
      audio.preload = "auto";
      audio.crossOrigin = "anonymous";
      audio.loop = states[file]?.loop ?? true;
      audio.addEventListener("loadedmetadata", () =>
        update(file, { duration: audio!.duration, ready: true }),
      );
      audio.addEventListener("canplay", () =>
        update(file, { ready: true, loading: false }),
      );
      audio.addEventListener("waiting", () => update(file, { loading: true }));
      audio.addEventListener("playing", () => update(file, { loading: false, playing: true }));
      audio.addEventListener("timeupdate", () =>
        update(file, { current: audio!.currentTime }),
      );
      audio.addEventListener("ended", () => {
        if (audio!.loop) {
          try {
            audio!.currentTime = 0;
            void audio!.play();
            return;
          } catch {
            /* ignore */
          }
        }
        update(file, { playing: false, current: 0 });
      });
      audio.addEventListener("pause", () => {
        if (!audio!.ended) update(file, { playing: false });
      });
      audio.addEventListener("play", () => update(file, { playing: true }));
      audioRefs.current[file] = audio;
    }
    if (audio.src !== src) audio.src = src;
    return audio;
  };

  const togglePlay = async (file: string) => {
    Object.entries(audioRefs.current).forEach(([k, a]) => {
      if (k !== file && !a.paused) {
        a.pause();
        update(k, { playing: false });
      }
    });

    let url = states[file].url;
    if (!url) {
      update(file, { loading: true });
      url = await getSignedUrl(file);
      if (!url) {
        update(file, { loading: false });
        return;
      }
      update(file, { url });
    }

    const audio = ensureAudio(file, url);

    if (audio.paused) {
      try {
        await audio.play();
        if ("mediaSession" in navigator) {
          const proto = PROTOCOLS.find((p) => p.file === file);
          navigator.mediaSession.metadata = new MediaMetadata({
            title: proto?.title ?? "AXIO Quantum-Core",
            artist: "AXIO Quantum-Core",
            album: proto?.subtitle ?? "",
          });
          navigator.mediaSession.setActionHandler("play", () => audio.play());
          navigator.mediaSession.setActionHandler("pause", () => audio.pause());
          navigator.mediaSession.setActionHandler("seekto", (d) => {
            if (d.seekTime != null) audio.currentTime = d.seekTime;
          });
        }
      } catch {
        update(file, { loading: false });
        toast.error("Não foi possível iniciar a reprodução");
      }
    } else {
      audio.pause();
    }
  };

  const toggleLoop = (file: string) => {
    const audio = audioRefs.current[file];
    const next = !states[file].loop;
    if (audio) audio.loop = next;
    update(file, { loop: next });
  };

  const seek = (file: string, val: number) => {
    const audio = audioRefs.current[file];
    if (audio) {
      audio.currentTime = val;
      update(file, { current: val });
    }
  };

  // Cleanup APENAS no unmount real do componente (não em troca de aba do SO)
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((a) => {
        a.pause();
        a.src = "";
      });
      audioRefs.current = {};
    };
  }, []);

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

      <Card className="p-4 border-primary/40 bg-primary/5">
        <div className="flex items-start gap-3">
          <Headphones className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-foreground mb-1">
              ⚠️ IMPORTANTE — Use fones de ouvido
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Para eficácia de 95% na recalibração do DNA e sistema nervoso, o uso de fones (over-ear ou in-ear) é{" "}
              <span className="text-primary font-medium">obrigatório</span>. As tecnologias Binaural e EMDR dependem
              da separação estéreo real para o processamento cerebral.
            </p>
          </div>
        </div>
      </Card>

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
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground">{p.title}</h3>
                      <p className="text-xs text-primary/80">{p.subtitle}</p>
                    </div>
                    <Button
                      size="icon"
                      variant={st.loop ? "cyan" : "ghost"}
                      onClick={() => toggleLoop(p.file)}
                      className="h-8 w-8 shrink-0"
                      title={st.loop ? "Repetição ativa" : "Repetir"}
                    >
                      <Repeat className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-1">
                    <Slider
                      value={[st.current]}
                      max={st.duration || 600}
                      step={0.1}
                      onValueChange={(v) => seek(p.file, v[0])}
                      disabled={!st.ready}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                      <span>{fmt(st.current)}</span>
                      <span>
                        {st.loading ? "Carregando…" : fmt(st.duration || 600)}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground/80 font-mono leading-relaxed">
                    {p.math}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.science}</p>

                  <div className="mt-3 rounded-md border border-primary/20 bg-primary/5 p-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                      <Headphones className="h-3.5 w-3.5" />
                      Protocolo de Uso
                    </div>
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      <span className="font-medium not-italic text-foreground/80">Como usar: </span>
                      {p.usage.how}
                    </p>
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      <span className="font-medium not-italic text-foreground/80">Fones: </span>
                      {p.usage.headphones}
                    </p>
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      <span className="font-medium not-italic text-foreground/80">Duração: </span>
                      {p.usage.duration}
                    </p>
                    {p.usage.warning && (
                      <p className="text-xs text-amber-400/90 italic leading-relaxed flex items-start gap-1.5 mt-1">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span>{p.usage.warning}</span>
                      </p>
                    )}
                  </div>
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
