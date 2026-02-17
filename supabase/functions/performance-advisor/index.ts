import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BLOCKED_KEYWORDS = [
  "violência", "violencia", "matar", "assassinar", "droga", "cocaína", "cocaina",
  "maconha", "crack", "heroína", "heroina", "tráfico", "trafico", "roubo", "roubar",
  "furto", "assalto", "arma", "pistola", "revólver", "revolver", "explosivo",
  "bomba", "terrorismo", "suicídio", "suicidio", "automutilação", "automutilacao",
  "pornografia", "abuso sexual", "pedofilia", "estupro", "sequestro", "lavagem de dinheiro",
  "ilícito", "ilicito", "contrabando", "fraude", "golpe", "hackear", "invadir sistema",
];

function containsBlockedContent(text: string): boolean {
  const lower = text.toLowerCase();
  return BLOCKED_KEYWORDS.some((kw) => lower.includes(kw));
}

const VALID_CATEGORIES = ["trabalho", "reunioes", "relacionamentos"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user is premium
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user } } = await userSupabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Usuário não autenticado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: profile } = await userSupabase
      .from("profiles")
      .select("is_premium, subscription_expires_at")
      .eq("user_id", user.id)
      .single();

    const isPremium = !!(profile?.is_premium &&
      (!profile.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date()));

    // Also check admin role
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminSupabase = createClient(supabaseUrl, serviceKey);
    const { data: roleData } = await adminSupabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    const isAdmin = !!roleData;

    if (!isPremium && !isAdmin) {
      return new Response(JSON.stringify({ error: "Recurso exclusivo para Premium" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const category = formData.get("category") as string;

    if (!audioFile || !audioFile.type.startsWith("audio/")) {
      return new Response(JSON.stringify({ error: "Áudio inválido" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (audioFile.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "Áudio muito grande. Máximo 5MB." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const validCategory = VALID_CATEGORIES.includes(category) ? category : "trabalho";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Serviço de IA não configurado" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Transcribe audio
    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = base64Encode(new Uint8Array(arrayBuffer));

    const transcribeResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: "Transcreva este áudio em português brasileiro. Retorne APENAS o texto transcrito." },
            { type: "input_audio", input_audio: { data: base64Audio, format: "wav" } },
          ],
        }],
        temperature: 0.1,
        max_tokens: 500,
      }),
    });

    if (!transcribeResponse.ok) {
      return new Response(JSON.stringify({ error: "Falha ao processar áudio. Tente novamente." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const transcribeResult = await transcribeResponse.json();
    const transcription = transcribeResult.choices?.[0]?.message?.content?.trim();

    if (!transcription) {
      return new Response(JSON.stringify({ error: "Áudio não audível. Grave novamente." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Safety filter
    if (containsBlockedContent(transcription)) {
      return new Response(JSON.stringify({
        error: "Conteúdo bloqueado. O Conselheiro de Performance não aborda temas relacionados a violência, drogas ou atividades ilícitas.",
        blocked: true,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const categoryLabels: Record<string, string> = {
      trabalho: "Trabalho e Produtividade",
      reunioes: "Reuniões e Comunicação",
      relacionamentos: "Relacionamentos Interpessoais",
    };

    // Generate advice based on voice tone + content
    const adviceResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Você é o Conselheiro de Performance A.X.I.O., especialista em biofeedback vocal e neurociência aplicada à performance humana.

REGRAS ABSOLUTAS:
- NUNCA aborde temas de violência, drogas, atividades ilícitas ou qualquer conteúdo antiético.
- Se o conteúdo for inadequado, responda: "Não posso aconselhar sobre este tema."
- Foque EXCLUSIVAMENTE na categoria: ${categoryLabels[validCategory]}.

ANÁLISE:
1. Analise o tom emocional da fala (ansiedade, confiança, hesitação, entusiasmo, cansaço).
2. Identifique padrões de frequência vocal (tom agudo = estresse, tom grave = segurança, variações = incerteza).
3. Com base no conteúdo e tom, forneça um conselho prático e direto.

FORMATO DE RESPOSTA (JSON):
{
  "tone_analysis": {
    "dominant_emotion": "string",
    "confidence_level": number (1-10),
    "stress_indicator": number (1-10),
    "energy_level": number (1-10)
  },
  "frequency_score": number (1-100),
  "advice": "string com conselho prático de 3-5 parágrafos focado em ${categoryLabels[validCategory]}"
}

Retorne APENAS o JSON válido, sem markdown.`,
          },
          {
            role: "user",
            content: `Categoria: ${categoryLabels[validCategory]}\n\nTranscrição da fala do usuário:\n"${transcription}"`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!adviceResponse.ok) {
      return new Response(JSON.stringify({ error: "Falha ao gerar conselho. Tente novamente." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adviceResult = await adviceResponse.json();
    let rawContent = adviceResult.choices?.[0]?.message?.content?.trim() || "";

    // Clean markdown wrappers if present
    rawContent = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed = {
        tone_analysis: { dominant_emotion: "neutro", confidence_level: 5, stress_indicator: 5, energy_level: 5 },
        frequency_score: 50,
        advice: rawContent,
      };
    }

    // Safety check on the advice itself
    if (containsBlockedContent(parsed.advice || "")) {
      return new Response(JSON.stringify({
        error: "O conselho gerado contém conteúdo inadequado. Tente novamente com outro tema.",
        blocked: true,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save to database
    const { error: insertError } = await adminSupabase
      .from("performance_advices")
      .insert({
        user_id: user.id,
        category: validCategory,
        transcription,
        frequency_score: parsed.frequency_score || 50,
        advice_text: parsed.advice || rawContent,
        tone_analysis: parsed.tone_analysis || null,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
    }

    return new Response(JSON.stringify({
      transcription,
      tone_analysis: parsed.tone_analysis,
      frequency_score: parsed.frequency_score,
      advice: parsed.advice || rawContent,
      category: validCategory,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Performance advisor error:", error);
    return new Response(JSON.stringify({ error: "Erro inesperado. Tente novamente." }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
