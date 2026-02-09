import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const COMMAND_SYSTEM_PROMPT = `Você é o Gerador de Comandos Quânticos do Método A.X.I.O.
Sua função é criar 3 comandos de reprogramação neural personalizados (manhã, tarde e noite) baseados no diagnóstico do usuário.

REGRAS ABSOLUTAS:
- Use o nome do usuário (se fornecido) para tornar os comandos pessoais.
- Cada comando deve referenciar diretamente o trauma/ferida raiz identificada no diagnóstico.
- Use linguagem de PNL e Biohacking: fale diretamente com o corpo e a mente.
- Os comandos devem ser escritos em primeira pessoa, como se o usuário estivesse falando consigo mesmo.
- NUNCA use termos genéricos. Cada comando deve ser único para aquele diagnóstico.

ESTRUTURA DOS 3 COMANDOS:

🌅 MANHÃ (Foco em Identidade e Segurança):
Modelo base: "(Nome), diga ao seu corpo agora: Corpo, embora você tenha guardado a dor de [TRAUMA ESPECÍFICO DO RELATÓRIO] para me proteger, eu te aviso agora: o perigo passou. Aquela dor não é nossa, era do passado. Hoje, eu ocupo meu lugar no mundo com segurança. Eu te vejo, eu te amo e estamos protegidos. (Repetir 3x)."
- Adapte [TRAUMA ESPECÍFICO] com base na ferida raiz e bloqueios do diagnóstico.

☀️ TARDE (Foco em Merecimento e Ação):
Modelo base: "(Nome), sinta suas células e diga: Eu libero agora todo o peso e as lealdades que não me pertencem. [REFERÊNCIA AO BLOQUEIO ESPECÍFICO]. Eu sou a autoridade da minha vida e do meu destino. Eu me dou permissão total para prosperar e ser feliz hoje. (Repetir 3x)."
- Adapte com referência aos bloqueios e impactos secundários identificados.

🌙 NOITE (Foco em Limpeza e Entrega):
Modelo base: "(Nome), em relaxamento profundo, diga: Mente e corpo, descansem na verdade de que somos completos e dignos. [REFERÊNCIA À FERIDA DE ORIGEM]. O que foi vivido se dissolve agora em luz. Meu amanhã será livre e abundante. Gratidão por esse dia. (Repetir 3x)."
- Adapte com referência à ferida raiz e ao sentimento predominante.

Responda APENAS com um JSON válido no formato:
{
  "manha": "texto completo do comando da manhã",
  "dia": "texto completo do comando da tarde",
  "noite": "texto completo do comando da noite"
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { diagnosis_id, diagnosis_result, user_name } = await req.json();

    if (!diagnosis_id || !diagnosis_result) {
      throw new Error("Missing diagnosis_id or diagnosis_result");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Not authenticated");

    // Build the prompt with diagnosis context
    const dr = diagnosis_result;
    const contextParts = [
      `Nome do usuário: ${user_name || "Querido(a)"}`,
      `Título do diagnóstico: ${dr.title || "N/A"}`,
      `Resumo: ${dr.summary || "N/A"}`,
      `Ferida Raiz: ${dr.root_wound || "N/A"}`,
      `Bloqueios: ${(dr.blocks || []).map((b: any) => `${b.name}: ${b.description}`).join("; ")}`,
      `Sentimentos Predominantes: ${(dr.predominant_sentiments || []).map((s: any) => `${s.name} (${s.intensity}%)`).join(", ")}`,
    ];

    if (dr.secondary_impacts) {
      if (dr.secondary_impacts.financeiro) contextParts.push(`Impacto Financeiro: ${dr.secondary_impacts.financeiro}`);
      if (dr.secondary_impacts.saude) contextParts.push(`Impacto Saúde: ${dr.secondary_impacts.saude}`);
      if (dr.secondary_impacts.relacionamentos) contextParts.push(`Impacto Relacionamentos: ${dr.secondary_impacts.relacionamentos}`);
    }

    const userPrompt = `Com base neste diagnóstico A.X.I.O., gere os 3 comandos quânticos personalizados:\n\n${contextParts.join("\n")}\n\nResponda APENAS com o JSON válido.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: COMMAND_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", errorText);
      throw new Error("AI Gateway error: " + response.status);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content in AI response");

    let commands;
    try {
      const clean = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      commands = JSON.parse(clean);
    } catch {
      console.error("Failed to parse commands:", content);
      throw new Error("Failed to parse AI commands");
    }

    // Save to quantum_commands table
    const commandInserts = [
      { user_id: user.id, diagnosis_id, command_text: commands.manha, command_type: "manha" },
      { user_id: user.id, diagnosis_id, command_text: commands.dia, command_type: "dia" },
      { user_id: user.id, diagnosis_id, command_text: commands.noite, command_type: "noite" },
    ];

    const { error: insertError } = await supabase.from("quantum_commands").insert(commandInserts);
    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to save commands: " + insertError.message);
    }

    return new Response(JSON.stringify({ success: true, commands }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-quantum-commands:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
