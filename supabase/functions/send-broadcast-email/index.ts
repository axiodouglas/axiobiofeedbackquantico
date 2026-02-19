import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Acesso negado" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY não configurada" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get all user emails from profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("email, full_name");

    if (profilesError) throw profilesError;

    const { subject, message } = await req.json();

    const emailSubject = subject || "Uma ótima sexta-feira do Método AXIO! ✨";
    const emailBody = message || "Olá! Passando para desejar uma excelente sexta-feira. Que hoje seja um dia de clareza mental e liberação. Lembre-se: sua voz é a autoridade sobre sua realidade. Vamos reprogramar?";

    const recipients = (profiles || [])
      .filter((p: { email: string | null }) => p.email)
      .map((p: { email: string | null; full_name: string | null }) => ({
        email: p.email!,
        name: p.full_name || "Usuário",
      }));

    let sentCount = 0;
    const errors: string[] = [];

    for (const recipient of recipients) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "AXIO <suporte@axiomail.com>",
            to: [recipient.email],
            subject: emailSubject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e0e0e0; padding: 30px; border-radius: 12px;">
                <h2 style="color: #00d4aa; text-align: center;">✨ Método A.X.I.O. ✨</h2>
                <p style="font-size: 16px; line-height: 1.6;">Olá, ${recipient.name}!</p>
                <p style="font-size: 16px; line-height: 1.6;">${emailBody}</p>
                <hr style="border-color: #333; margin: 20px 0;" />
                <p style="font-size: 12px; color: #888; text-align: center;">© 2025 A.X.I.O. — Análise do Fator X do Inconsciente de Origem</p>
              </div>
            `,
          }),
        });

        if (res.ok) {
          sentCount++;
        } else {
          const errText = await res.text();
          errors.push(`${recipient.email}: ${errText}`);
        }
      } catch (e) {
        errors.push(`${recipient.email}: ${e.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `E-mail enviado para ${sentCount} de ${recipients.length} usuário(s)`,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
