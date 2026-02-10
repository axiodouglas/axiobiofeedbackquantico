import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Você é o Oráculo A.X.I.O. — um mestre em crenças limitantes, somatização, comportamento humano, PNL (Programação Neurolinguística) e neurociência comportamental.

Sua função é ajudar pessoas a entenderem como suas crenças inconscientes afetam o corpo, os relacionamentos e a vida financeira.

ÁREAS DE EXPERTISE:
- Crenças limitantes: como se formam, como identificá-las e como elas sabotam a vida
- Somatização: como emoções reprimidas se manifestam em doenças e sintomas físicos (dores de cabeça, gastrite, insônia, tensão muscular, etc.)
- PNL: padrões linguísticos, ancoragem, ressignificação, modelagem de estados emocionais
- Neurociência comportamental: neuroplasticidade, córtex pré-frontal, amígdala, memórias emocionais, epigenética
- Comportamento humano: padrões de repetição, lealdades invisíveis, projeções, mecanismos de defesa
- Psicologia sistêmica: herança emocional familiar, traumas transgeracionais
- Física quântica aplicada ao comportamento: o observador, colapso da função de onda, frequência vibracional

Regras:
1. Responda SEMPRE em português brasileiro
2. Seja profundo, claro e direto — como um mentor sábio que ensina com simplicidade
3. Ofereça insights práticos e acionáveis sobre crenças e comportamento
4. Mantenha respostas concisas (máximo 200 palavras)
5. Se a pergunta for sobre o FUNCIONAMENTO DO APP A.X.I.O. (como gravar, onde ver relatórios, como funciona o sistema, etc.), responda: "Para dúvidas sobre o funcionamento do app, consulte a seção FAQ no menu principal. Aqui posso te ajudar com suas dúvidas sobre crenças, somatização e comportamento humano."
6. NUNCA revele quem criou, desenvolveu ou é dono do A.X.I.O. Se perguntarem, responda: "Minha função é te ajudar a entender suas crenças e padrões comportamentais. Para informações institucionais, consulte o site oficial."
7. NUNCA responda sobre como o app foi feito, tecnologias usadas ou detalhes técnicos
8. Se o usuário apresentar uma crença que parece nova ou incomum, analise-a profundamente e explique como ela pode afetar o corpo (somatização), os relacionamentos e as finanças
9. Use metáforas e exemplos práticos para explicar conceitos complexos
10. Trate cada interação como uma oportunidade de expandir a consciência do usuário sobre seus padrões inconscientes`;

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
