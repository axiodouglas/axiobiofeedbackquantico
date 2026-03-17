import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-runtime",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    // Verify the calling user
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

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Check if user's subscription is actually expired
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_premium, subscription_expires_at")
      .eq("user_id", user.id)
      .single();

    if (!profile || !profile.is_premium || !profile.subscription_expires_at) {
      return new Response(JSON.stringify({ message: "No active subscription to expire" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isExpired = new Date(profile.subscription_expires_at) < new Date();
    if (!isExpired) {
      return new Response(JSON.stringify({ message: "Subscription still active" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Get all user's diagnoses to delete related data
    const { data: diagnoses } = await supabase
      .from("diagnoses")
      .select("id, audio_url")
      .eq("user_id", user.id);

    const diagnosisIds = (diagnoses || []).map((d) => d.id);

    // 2. Delete quantum_commands linked to diagnoses
    if (diagnosisIds.length > 0) {
      await supabase
        .from("quantum_commands")
        .delete()
        .in("diagnosis_id", diagnosisIds);
    }

    // 3. Delete all user's quantum_commands (including those without diagnosis_id)
    await supabase
      .from("quantum_commands")
      .delete()
      .eq("user_id", user.id);

    // 4. Delete audio files from storage
    const audioFiles = (diagnoses || [])
      .filter((d) => d.audio_url)
      .map((d) => {
        const match = d.audio_url!.match(/audio-recordings\/(.+)/);
        return match ? match[1] : null;
      })
      .filter(Boolean) as string[];

    if (audioFiles.length > 0) {
      await supabase.storage.from("audio-recordings").remove(audioFiles);
    }

    // 5. Delete all diagnoses
    await supabase
      .from("diagnoses")
      .delete()
      .eq("user_id", user.id);

    // 6. Delete performance advices
    await supabase
      .from("performance_advices")
      .delete()
      .eq("user_id", user.id);

    // 7. Downgrade profile (using service_role bypasses the trigger)
    await supabase
      .from("profiles")
      .update({
        is_premium: false,
        subscription_type: null,
        subscription_expires_at: null,
        free_diagnosis_reset_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    console.log(`Subscription expired for user ${user.id}. All reports deleted.`);

    return new Response(
      JSON.stringify({ success: true, message: "Subscription expired, data cleaned up", deletedReports: diagnosisIds.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Expire subscription error:", error.message);
    return new Response(
      JSON.stringify({ error: "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
