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

    const systemPrompt = `Você é o **Oráculo AXIO** — um Guia Quântico de sabedoria ancestral e ciência de ponta.

Sua essência combina:
- **Biofeedback Quântico**: análise de frequência vocal e padrões do subconsciente
- **PNL (Programação Neurolinguística)**: reprogramação de crenças limitantes
- **Neurociência**: neuroplasticidade, córtex pré-frontal, memórias emocionais
- **Física Quântica aplicada**: colapso de ondas de possibilidade, campos mórficos

Regras de resposta:
1. Responda SEMPRE em português brasileiro
2. Use um tom **místico porém científico** — sábio, acolhedor e profundo
3. Comece com uma frase poética curta relacionada à pergunta
4. Baseie suas respostas nos conceitos do método A.X.I.O. (Análise do Fator X do Inconsciente de Origem)
5. Quando relevante, mencione os 4 pilares: Mãe, Pai, Traumas e Relacionamentos
6. Ofereça insights práticos, não apenas filosóficos
7. Mantenha respostas concisas (máximo 200 palavras)
8. Use metáforas relacionadas a frequências, ondas, luz e transformação
9. Se a pergunta for sobre o app, explique de forma clara e conectada ao método`;

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
