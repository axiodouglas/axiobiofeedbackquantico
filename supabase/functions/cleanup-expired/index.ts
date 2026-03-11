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

    // Free users: 7 days, Premium users: 180 days (6 months)
    const freeCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const premiumCutoff = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString();

    // Get all premium user IDs
    const { data: premiumProfiles } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("is_premium", true);

    const premiumUserIds = (premiumProfiles || []).map((p) => p.user_id);

    // 1a. Find expired free user diagnoses (7 days)
    let freeQuery = supabase
      .from("diagnoses")
      .select("id, audio_url, user_id")
      .lt("created_at", freeCutoff);

    if (premiumUserIds.length > 0) {
      // Exclude premium users from the 7-day cleanup
      freeQuery = freeQuery.not("user_id", "in", `(${premiumUserIds.join(",")})`);
    }

    const { data: freeExpired, error: freeError } = await freeQuery;
    if (freeError) throw freeError;

    // 1b. Find expired premium user diagnoses (180 days)
    let premiumExpired: any[] = [];
    if (premiumUserIds.length > 0) {
      const { data, error } = await supabase
        .from("diagnoses")
        .select("id, audio_url, user_id")
        .lt("created_at", premiumCutoff)
        .in("user_id", premiumUserIds);
      if (error) throw error;
      premiumExpired = data || [];
    }

    const expiredDiagnoses = [...(freeExpired || []), ...premiumExpired];

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
