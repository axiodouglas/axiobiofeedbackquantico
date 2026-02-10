import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import oracleBg from "@/assets/oracle-bg.jpg";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import UserMenu from "@/components/UserMenu";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/oracle-chat`;


const Oracle = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);
  const [userDiagnoses, setUserDiagnoses] = useState<any[]>([]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("diagnoses")
        .select("area, frequency_score, diagnosis_result")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) setUserDiagnoses(data);
    };
    fetchDiagnoses();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading || sendingRef.current) return;
    sendingRef.current = true;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    const allMessages = [...messages, userMsg];
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages, userDiagnoses }),
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
          const line = textBuffer.slice(0, newlineIndex).replace(/\r$/, "");
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (typeof content === "string" && content.length > 0) {
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
            // Skip malformed SSE lines instead of re-buffering (prevents infinite loop)
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
      sendingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={oracleBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
      </div>

      <nav className="sticky top-0 z-20 border-b border-border/40 bg-background/40 backdrop-blur-md py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
          <span className="text-gradient-cyan font-bold text-sm">Oráculo AXIO</span>
          <UserMenu />
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center overflow-hidden relative z-10">
        <div className={`oracle-supernova ${isLoading ? "oracle-supernova--active" : ""}`} />

        <div ref={scrollRef} className="flex-1 w-full max-w-2xl mx-auto overflow-y-auto px-4 pb-4 pt-6 space-y-4 flex flex-col">
          {messages.length === 0 && (
            <div className="text-center mt-auto mb-4 space-y-2">
              <p className="text-foreground font-semibold text-base">Tire suas dúvidas sobre crenças e comportamento</p>
              <p className="text-muted-foreground text-xs max-w-sm mx-auto leading-relaxed">
                Sou especialista em crenças limitantes, somatização, PNL e neurociência comportamental. Pergunte sobre como suas crenças afetam seu corpo, seus relacionamentos e sua vida. Para gerar diagnósticos, comandos e meditações, grave um áudio nos pilares.
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

        <div className="w-full max-w-2xl mx-auto px-4 pb-6 pt-2 shrink-0">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              placeholder="Pergunte sobre crenças, somatização, PNL..."
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
