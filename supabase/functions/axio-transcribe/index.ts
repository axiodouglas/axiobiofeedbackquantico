import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use Lovable AI Gateway for transcription via Gemini (supports audio)
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Convert audio to base64
    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

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
      const errorText = await transcribeResponse.text();
      console.error("Transcription error:", errorText);
      throw new Error(`Transcription failed: ${transcribeResponse.status}`);
    }

    const transcribeResult = await transcribeResponse.json();
    const transcription = transcribeResult.choices?.[0]?.message?.content?.trim();

    if (!transcription) {
      throw new Error("No transcription generated");
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
      const errorText = await analyzeResponse.text();
      console.error("Analysis error:", errorText);
      throw new Error(`Analysis failed: ${analyzeResponse.status}`);
    }

    const diagnosis = await analyzeResponse.json();

    return new Response(
      JSON.stringify({ transcription, diagnosis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in axio-transcribe:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
