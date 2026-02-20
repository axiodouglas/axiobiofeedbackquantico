import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require admin authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is admin
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Acesso negado" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // 1. Find expired diagnoses
    const { data: expiredDiagnoses, error: fetchError } = await supabase
      .from("diagnoses")
      .select("id, audio_url, user_id")
      .lt("created_at", cutoffDate);

    if (fetchError) throw fetchError;

    if (!expiredDiagnoses || expiredDiagnoses.length === 0) {
      return new Response(
        JSON.stringify({ message: "No expired records found", deleted: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const diagnosisIds = expiredDiagnoses.map((d) => d.id);

    // 2. Delete linked quantum_commands
    const { error: cmdError } = await supabase
      .from("quantum_commands")
      .delete()
      .in("diagnosis_id", diagnosisIds);

    if (cmdError) console.error("Error deleting commands:", cmdError);

    // 3. Delete audio files from storage
    const audioFiles = expiredDiagnoses
      .filter((d) => d.audio_url)
      .map((d) => {
        // Extract path from URL
        const url = d.audio_url!;
        const match = url.match(/audio-recordings\/(.+)/);
        return match ? match[1] : null;
      })
      .filter(Boolean) as string[];

    if (audioFiles.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("audio-recordings")
        .remove(audioFiles);
      if (storageError) console.error("Error deleting audio files:", storageError);
    }

    // 4. Delete expired diagnoses
    const { error: deleteError } = await supabase
      .from("diagnoses")
      .delete()
      .in("id", diagnosisIds);

    if (deleteError) throw deleteError;

    const result = {
      message: "Cleanup completed",
      deleted: diagnosisIds.length,
      audioFilesRemoved: audioFiles.length,
    };

    console.log(result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Cleanup error:", error.message);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
