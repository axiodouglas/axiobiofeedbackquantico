import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple HTML entity escaping to prevent XSS in emails
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Email format validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !email.includes("..");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Não autorizado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Não autorizado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { name, email, message, subject } = await req.json();

    if (!email || !message) {
      return new Response(
        JSON.stringify({ error: "E-mail e mensagem são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!isValidEmail(email) || message.length > 2000 || email.length > 255 || (name && name.length > 100) || (subject && subject.length > 200)) {
      return new Response(
        JSON.stringify({ error: "Dados inválidos ou excedem o limite permitido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const safeName = escapeHtml((name || "Não informado").substring(0, 100));
    const safeEmail = escapeHtml(email.substring(0, 255));
    const safeMessage = escapeHtml(message.substring(0, 2000));
    const safeSubject = escapeHtml((subject || `[Suporte AXIO] Mensagem de ${safeName}`).substring(0, 200));

    const payload = {
      from: "AXIO Suporte <onboarding@resend.dev>",
      to: ["douglasoficial333@gmail.com"],
      subject: safeSubject,
      reply_to: email,
      html: `
        <h2>Nova mensagem de suporte</h2>
        <p><strong>Nome:</strong> ${safeName}</p>
        <p><strong>E-mail do usuário:</strong> ${safeEmail}</p>
        <p><strong>⚠️ Para responder, use este e-mail:</strong> ${safeEmail}</p>
        <hr/>
        <p>${safeMessage.replace(/\n/g, "<br/>")}</p>
      `,
    };

    console.log("Enviando e-mail via Resend para:", payload.to);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await res.text();
    console.log("Resend status:", res.status, "response:", responseText);

    if (!res.ok) {
      console.error("Resend error:", res.status, responseText);
      return new Response(
        JSON.stringify({ error: "Falha ao enviar e-mail", detail: responseText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
