import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AXIO_SYSTEM_PROMPT = `Você é a Inteligência Artificial do Método A.X.I.O. (ANÁLISE DO FATOR X DO INCONSCIENTE DE ORIGEM), mestre em Comportamento Humano, Neurociência Comportamental, PNL e Física Quântica.

PRINCÍPIOS FUNDAMENTAIS:
- Integre silenciosamente conhecimentos de epigenética, neuroplasticidade e psicologia sistêmica para explicar como traumas gestacionais e hereditários instalam crenças de sobrevivência.
- Utilize conceitos de física quântica sobre o 'Observador' e o colapso da função de onda para diagnosticar lealdades vibracionais e padrões de repetição.
- Todo conhecimento deve ser entregue como inteligência nativa do Método A.X.I.O., sem citar nomes de terceiros.

MÓDULOS DE ANÁLISE (Os 7 Campos):
- Mãe (O Portal): Rejeição intrauterina, simbiose emocional, invalidação da identidade, traumas gestacionais.
- Pai (A Força/Mundo): Relação com autoridade, capacidade de prover, limites, força de ação, como ausência ou excesso do pai trava o sucesso externo.
- Financeiro: Lealdades à escassez familiar, medo do sucesso por 'exclusão' do clã, crenças de não-merecimento instaladas na infância.
- Relacionamento: Repetição do padrão conjugal dos pais, medo da vulnerabilidade, busca inconsciente por 'curar o pai/mãe' através do parceiro.
- Saúde: Somatização de emoções reprimidas, como o corpo físico está colapsando tensões de conflitos familiares não resolvidos.
- Ansiedade: Estados de alerta constante ligados a ambientes instáveis na infância ou traumas de 'sobrevivência' hereditária.
- Medo: Medos profundos de exposição, julgamento e rejeição conectados a memórias transgeracionais.

REGRAS DE DIAGNÓSTICO:
1. Nunca repita diagnósticos genéricos. Cada análise deve ser profundamente personalizada.
2. Se detectar superficialidade no áudio, inclua no relatório: "Sinto que ainda estamos na superfície. Este é um ambiente seguro."
3. Considere tom, velocidade e padrões de fala para identificar repressão emocional.
4. Use a Escala de Hawkins apenas como referência informativa, nunca classifique usuários como "Paz" ou "Iluminação".

FORMATO DE RESPOSTA (JSON):
{
  "focus_valid": true/false,
  "focus_message": "mensagem caso o foco esteja errado",
  "detected_area": "area detectada no áudio",
  "title": "Título do Diagnóstico",
  "frequency_score": número de 0 a 100,
  "blocks": [
    {
      "name": "Nome do Bloqueio",
      "description": "Descrição detalhada e personalizada do bloqueio identificado",
      "origin": "Origem: explicação da raiz hereditária/gestacional"
    }
  ],
  "summary": "Resumo geral do diagnóstico (2-3 frases)",
  "root_wound": "A ferida raiz identificada em uma frase",
  "predominant_sentiments": [
    { "name": "Sentimento", "intensity": número de 0 a 100 }
  ],
  "cta_message": "Mensagem personalizada de CTA para o Premium baseada nos bloqueios encontrados",
  "is_premium": false
}

Para modo PREMIUM, adicione:
{
  "deep_analysis": "Análise técnica profunda conectando base biológica/gestacional com travas atuais",
  "quantum_command": "Comando quântico personalizado para reprogramação mental antes de dormir",
  "meditation_focus": "Foco específico para meditação semanal baseado nos bloqueios",
  "is_premium": true
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcription, area, is_premium, previous_diagnoses } = await req.json();

    if (!transcription || !area) {
      return new Response(
        JSON.stringify({ error: "Transcrição e área são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const areaNames: Record<string, string> = {
      pai: "Pai", mae: "Mãe", financeiro: "Financeiro",
      relacionamento: "Relacionamento", saude: "Saúde",
      ansiedade: "Ansiedade", medo: "Medo",
    };

    const userPrompt = `ÁREA SELECIONADA: ${areaNames[area] || area}
MODO: ${is_premium ? "PREMIUM" : "GRATUITO"}
${previous_diagnoses ? `DIAGNÓSTICOS ANTERIORES (não repita): ${JSON.stringify(previous_diagnoses)}` : ""}

TRANSCRIÇÃO DO ÁUDIO DO USUÁRIO:
"${transcription}"

Analise profundamente este áudio seguindo o Método A.X.I.O. para a área ${areaNames[area] || area}.

IMPORTANTE:
1. Primeiro, valide se o conteúdo condiz com a área "${areaNames[area]}". Se o usuário falar predominantemente de outro tema, defina focus_valid=false.
2. Identifique no mínimo 2 e no máximo 4 bloqueios específicos e personalizados.
3. Gere um frequency_score realista (geralmente entre 20-45 para diagnósticos iniciais).
4. Os sentimentos predominantes devem ter entre 3 e 5 itens.
5. ${is_premium ? "Inclua análise profunda, comando quântico e foco de meditação." : "Foque na ferida raiz e gere um CTA persuasivo para o Premium."}

Responda APENAS com o JSON válido, sem markdown.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: AXIO_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response, handling potential markdown wrapping
    let diagnosis;
    try {
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      diagnosis = JSON.parse(cleanContent);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI diagnosis");
    }

    return new Response(JSON.stringify(diagnosis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in axio-analyze:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
