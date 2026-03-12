import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

const VALID_AREAS = ["pai", "mae", "traumas", "relacionamento", "crencas_limitantes"];
const MAX_AUDIO_SIZE_BYTES = 10 * 1024 * 1024;

async function logAiUsage(supabaseUrl: string, serviceKey: string, userId: string, actionType: string, cost: number) {
  try {
    const client = createClient(supabaseUrl, serviceKey);
    const { error } = await client.from("ai_usage_logs").insert({
      user_id: userId,
      action_type: actionType,
      estimated_cost: cost,
    });
    if (error) { console.error("logAiUsage insert error:", JSON.stringify(error)); }
    else { console.log("logAiUsage success:", actionType, cost, userId); }
  } catch (e) {
    console.error("logAiUsage exception:", e);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: "Muitas requisições. Aguarde alguns minutos." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const area = formData.get("area") as string;

    let isPremium = false;
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (authHeader && supabaseUrl && supabaseAnonKey) {
      try {
        const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } },
        });
        const { data: { user } } = await userSupabase.auth.getUser();
        if (user) {
          userId = user.id;
          const { data: profile } = await userSupabase
            .from("profiles")
            .select("is_premium, subscription_expires_at")
            .eq("user_id", user.id)
            .single();
          isPremium = !!(profile?.is_premium && 
            (!profile.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date()));
        }
      } catch (e) {
        console.warn("Premium check failed, defaulting to free:", e);
      }
    }

    if (!audioFile) {
      return new Response(
        JSON.stringify({ error: "Arquivo de áudio é obrigatório" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (audioFile.size > MAX_AUDIO_SIZE_BYTES) {
      return new Response(
        JSON.stringify({ error: "Arquivo de áudio muito grande. Máximo 10MB." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!audioFile.type.startsWith("audio/")) {
      return new Response(
        JSON.stringify({ error: "Formato de arquivo inválido. Envie apenas áudio." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validatedArea = VALID_AREAS.includes(area) ? area : "pai";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Serviço de IA não configurado" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64Audio = base64Encode(uint8Array);

    // Use cheaper model for transcription
    const transcribeResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Transcreva este áudio em português brasileiro. Retorne APENAS o texto transcrito, sem formatação, sem aspas, sem explicações."
              },
              {
                type: "input_audio",
                input_audio: {
                  data: base64Audio,
                  format: "wav"
                }
              }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    // Log transcription cost
    if (userId && supabaseUrl && supabaseServiceKey) {
      await logAiUsage(supabaseUrl, supabaseServiceKey, userId, "transcription", 0.02);
    }

    if (!transcribeResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Não foi possível processar o áudio. Tente gravar novamente." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const transcribeResult = await transcribeResponse.json();
    const transcription = transcribeResult.choices?.[0]?.message?.content?.trim();

    if (!transcription) {
      return new Response(
        JSON.stringify({ error: "Áudio não audível. Tente gravar novamente com mais clareza." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const analyzeResponse = await fetch(`${supabaseUrl}/functions/v1/axio-analyze`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcription,
        area: validatedArea,
        is_premium: isPremium,
        user_id: userId,
      }),
    });

    if (!analyzeResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Não foi possível gerar o diagnóstico. Tente novamente." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const diagnosis = await analyzeResponse.json();

    return new Response(
      JSON.stringify({ transcription, diagnosis }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro inesperado. Tente gravar novamente." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
