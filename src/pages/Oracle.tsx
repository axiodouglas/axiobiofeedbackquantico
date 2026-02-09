import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import UserMenu from "@/components/UserMenu";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/oracle-chat`;

/* Starfield canvas */
const Starfield = ({ active }: { active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.0003 + 0.0001, flicker: Math.random() * Math.PI * 2,
    }));

    const planets = [
      { x: 0.15, y: 0.3, r: 18, color: "270,50%,45%", orbitR: 0.08, angle: 0, orbitSpeed: 0.0004 },
      { x: 0.8, y: 0.25, r: 12, color: "220,60%,50%", orbitR: 0.06, angle: 2, orbitSpeed: 0.0006 },
      { x: 0.6, y: 0.7, r: 10, color: "175,70%,50%", orbitR: 0.05, angle: 4, orbitSpeed: 0.0005 },
    ];

    // Giant moon
    const moon = { x: 0.5, y: 0.35, baseR: 60, angle: 0, orbitR: 0.12, orbitSpeed: 0.00015 };

    const draw = (t: number) => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const speedMul = activeRef.current ? 4 : 1;

      // stars
      stars.forEach(s => {
        s.flicker += 0.02 * speedMul;
        const alpha = 0.4 + Math.sin(s.flicker) * 0.3;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(200,80%,90%,${alpha})`;
        ctx.fill();
      });

      // planets
      planets.forEach(p => {
        p.angle += p.orbitSpeed * speedMul;
        const cx = (p.x + Math.cos(p.angle) * p.orbitR) * w;
        const cy = (p.y + Math.sin(p.angle) * p.orbitR) * h;
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, p.r * 1.8);
        grd.addColorStop(0, `hsla(${p.color},0.8)`);
        grd.addColorStop(0.6, `hsla(${p.color},0.25)`);
        grd.addColorStop(1, `hsla(${p.color},0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, p.r * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.color},0.9)`;
        ctx.fill();
      });

      // Draw giant moon
      moon.angle += moon.orbitSpeed * speedMul;
      const mx = (moon.x + Math.cos(moon.angle) * moon.orbitR) * w;
      const my = (moon.y + Math.sin(moon.angle) * moon.orbitR * 0.4) * h;
      const mr = moon.baseR + Math.sin(t * 0.001) * 4;

      // Moon glow
      const moonGlow = ctx.createRadialGradient(mx, my, mr * 0.5, mx, my, mr * 2.5);
      moonGlow.addColorStop(0, "hsla(210,30%,85%,0.15)");
      moonGlow.addColorStop(0.5, "hsla(220,40%,70%,0.06)");
      moonGlow.addColorStop(1, "hsla(220,40%,60%,0)");
      ctx.beginPath();
      ctx.arc(mx, my, mr * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = moonGlow;
      ctx.fill();

      // Moon body
      const moonBody = ctx.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, 0, mx, my, mr);
      moonBody.addColorStop(0, "hsla(210,20%,92%,0.95)");
      moonBody.addColorStop(0.6, "hsla(220,15%,75%,0.85)");
      moonBody.addColorStop(1, "hsla(230,20%,55%,0.7)");
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.fillStyle = moonBody;
      ctx.fill();

      // Moon craters
      const craters = [
        { ox: -0.2, oy: -0.15, r: 0.12 },
        { ox: 0.25, oy: 0.1, r: 0.08 },
        { ox: -0.05, oy: 0.3, r: 0.1 },
      ];
      craters.forEach(c => {
        ctx.beginPath();
        ctx.arc(mx + c.ox * mr, my + c.oy * mr, c.r * mr, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(220,15%,65%,0.3)";
        ctx.fill();
      });

      // supernova center glow when active
      if (activeRef.current) {
        const pulse = Math.sin(t * 0.004) * 0.3 + 0.7;
        const g = ctx.createRadialGradient(w / 2, h * 0.32, 0, w / 2, h * 0.32, 120 * pulse);
        g.addColorStop(0, `hsla(175,70%,60%,${0.4 * pulse})`);
        g.addColorStop(0.4, `hsla(220,60%,50%,${0.15 * pulse})`);
        g.addColorStop(1, "hsla(270,50%,40%,0)");
        ctx.beginPath();
        ctx.arc(w / 2, h * 0.32, 120 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

const Oracle = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg];

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Erro ao conectar com o Oráculo");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              const snapshot = assistantSoFar;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: snapshot } : m));
                }
                return [...prev, { role: "assistant", content: snapshot }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: e.message || "O Oráculo está indisponível no momento." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Deep-space background */}
      <div className="absolute inset-0 z-0">
        {/* Nebula layers */}
        <div className="absolute inset-0 oracle-nebula oracle-nebula--purple" />
        <div className="absolute inset-0 oracle-nebula oracle-nebula--blue" />
        <div className="absolute inset-0 oracle-nebula oracle-nebula--cyan" />
        <Starfield active={isLoading} />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-20 border-b border-border/40 bg-background/40 backdrop-blur-md py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
          <span className="text-gradient-cyan font-bold text-sm">Oráculo AXIO</span>
          <UserMenu />
        </div>
      </nav>

      {/* Chat area */}
      <div className="flex-1 flex flex-col items-center overflow-hidden relative z-10">
        {/* Supernova center indicator */}
        <div className={`oracle-supernova ${isLoading ? "oracle-supernova--active" : ""}`} />

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 w-full max-w-2xl mx-auto overflow-y-auto px-4 pb-4 pt-6 space-y-4 flex flex-col">
          {messages.length === 0 && (
            <div className="text-center mt-auto mb-4 space-y-2">
              <p className="text-foreground font-semibold text-base">Qual sua dúvida sobre o A.X.I.O.?</p>
              <p className="text-muted-foreground text-xs max-w-sm mx-auto leading-relaxed">
                Posso te ajudar com: Biofeedback vocal, os 4 pilares (Mãe, Pai, Traumas, Relacionamentos), PNL, Neurociência e Comandos Quânticos.
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-primary/20 text-foreground backdrop-blur-sm"
                    : "bg-card/60 backdrop-blur-md border border-primary/20 text-foreground"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-card/60 backdrop-blur-md border border-primary/20 rounded-2xl px-4 py-3 text-sm text-muted-foreground animate-pulse">
                O Oráculo está processando...
              </div>
            </div>
          )}
        </div>

        {/* Input — glassmorphism */}
        <div className="w-full max-w-2xl mx-auto px-4 pb-6 pt-2 shrink-0">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              placeholder="Digite sua dúvida sobre o A.X.I.O..."
              className="min-h-[48px] max-h-[120px] resize-none bg-card/40 backdrop-blur-md border-border/50 focus:border-primary/50 text-sm placeholder:text-muted-foreground/60"
              rows={1}
            />
            <Button
              variant="cyan"
              size="icon"
              onClick={send}
              disabled={isLoading || !input.trim()}
              className="shrink-0 h-12 w-12 animate-glow"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Oracle;
