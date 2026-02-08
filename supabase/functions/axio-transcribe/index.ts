import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const area = formData.get("area") as string;
    const isPremium = formData.get("is_premium") === "true";

    if (!audioFile) {
      return new Response(
        JSON.stringify({ error: "Arquivo de áudio é obrigatório" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Serviço de IA não configurado" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Convert audio to base64 safely using Deno's standard library
    const arrayBuffer = await audioFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64Audio = base64Encode(uint8Array);

    // Use Gemini for audio transcription
    const transcribeResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
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

    if (!transcribeResponse.ok) {
      // Graceful failure — return as normal JSON, not a 500 error
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

    // Now call the analysis function
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const analyzeResponse = await fetch(`${supabaseUrl}/functions/v1/axio-analyze`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcription,
        area: area || "pai",
        is_premium: isPremium,
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
    // Silent catch — return graceful error, never a 500
    return new Response(
      JSON.stringify({ error: "Erro inesperado. Tente gravar novamente." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
