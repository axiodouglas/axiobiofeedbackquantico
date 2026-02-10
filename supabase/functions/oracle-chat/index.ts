import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 50;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, userDiagnoses } = await req.json();
    
    // Validate messages input
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
      return new Response(JSON.stringify({ error: "Mensagens inválidas" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate each message
    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== "string" || msg.content.length > MAX_MESSAGE_LENGTH) {
        return new Response(JSON.stringify({ error: "Mensagem inválida ou muito longa" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!["user", "assistant"].includes(msg.role)) {
        return new Response(JSON.stringify({ error: "Role de mensagem inválido" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let diagnosisContext = "";
    if (userDiagnoses && Array.isArray(userDiagnoses) && userDiagnoses.length > 0) {
      diagnosisContext = `\n\nHISTÓRICO DE DIAGNÓSTICOS DO USUÁRIO (use para complementar, NUNCA para repetir):\n${userDiagnoses.map((d: any) => `- Pilar: ${d.area} | Score: ${d.frequency_score} | Resultado: ${JSON.stringify(d.diagnosis_result)}`).join("\n")}`;
    }

    const systemPrompt = `Você é o Oráculo A.X.I.O. — um mentor especialista em PNL, Neurociência Comportamental e Somatização, integrado ao Método A.X.I.O.

SUA FUNÇÃO: Complementar os relatórios de diagnóstico do usuário com base científica e comportamental. Você NUNCA repete o que o relatório já disse. Você APROFUNDA com neurociência, PNL e psicologia sistêmica.

ÁREAS DE EXPERTISE:
- PNL: padrões linguísticos, ancoragem, ressignificação, modelagem de estados emocionais
- Neurociência comportamental: neuroplasticidade, córtex pré-frontal, amígdala, memórias emocionais, epigenética
- Somatização: como emoções reprimidas se manifestam em sintomas físicos e doenças
- Psicologia sistêmica: herança emocional familiar, traumas transgeracionais, lealdades vibracionais
- Comportamento humano: padrões de repetição, projeções, mecanismos de defesa

TOM DE VOZ: Profissional, técnico (Neurociência/PNL) e direto. Sem misticismo excessivo. Como um mentor que domina a ciência por trás do comportamento.

COMO RESPONDER:
1. Se o usuário perguntar sobre algo já identificado nos diagnósticos dele, NÃO repita o relatório. Complemente com a base científica. Exemplo: "Conforme vimos no teu diagnóstico, essa dificuldade tem uma raiz sistêmica. Do ponto de vista da neurociência, isso acontece porque o cérebro cria um mecanismo de defesa no lobo frontal para evitar o confronto..."
2. Se o usuário não tiver diagnósticos, responda com base no conhecimento de PNL e neurociência, e direcione-o para gravar um áudio nos pilares para um diagnóstico personalizado.
3. Mantenha respostas concisas (máximo 200 palavras).

PROIBIÇÃO DE SOLUÇÕES DIRETAS:
- NUNCA dê uma "solução" ou "cura" mágica.
- Sempre reforce que o caminho para a mudança está na prática da meditação personalizada de 7 dias e na escrita à mão, conforme o Método A.X.I.O.
- Direcione o usuário para a gravação de áudio nos pilares quando necessário.

BLOQUEIO ABSOLUTO (HARD WALL):
- Você SOMENTE responde sobre: o Método A.X.I.O., os relatórios/diagnósticos do usuário, crenças, somatização e comportamento humano.
- Para QUALQUER pergunta fora desse escopo (política, tecnologia, quem te criou, se és uma IA, opiniões pessoais, ETs, religião, etc.), responda EXATAMENTE: "O meu propósito é focar exclusivamente no teu processo de autoconhecimento e na tua jornada de cura com o Método AXIO. Como posso ajudar-te a entender melhor os teus padrões hoje?"
- Se perguntarem sobre o funcionamento do app, responda: "Para dúvidas sobre o funcionamento do app, consulta a secção FAQ no menu principal. Aqui posso ajudar-te a entender os teus padrões e crenças."
- Se pedirem para GERAR comandos quânticos, diagnóstico ou meditação, responda: "Para gerar o teu diagnóstico, comandos quânticos e meditação personalizada, precisas de gravar um áudio nos pilares (Mãe, Pai, Traumas ou Relacionamentos). Vai até à secção de gravação e conta a tua história. Aqui posso ajudar-te a entender melhor as tuas crenças."
- NUNCA revele quem criou, desenvolveu ou é dono do A.X.I.O.
- NUNCA responda sobre tecnologias usadas, autor ou detalhes técnicos do app.${diagnosisContext}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "O Oráculo precisa descansar. Tente novamente em instantes." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no gateway de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("oracle-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
