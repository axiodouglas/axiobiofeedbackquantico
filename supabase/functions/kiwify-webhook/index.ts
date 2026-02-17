import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Kiwify webhook received:", JSON.stringify(body));

    const orderId = body.order_id || body.subscription_id || body.id;
    const status = body.order_status || body.subscription_status || body.status;
    const email = body.Customer?.email || body.customer?.email || body.email;
    const productName = body.offer_name || body.Product?.name || body.product?.name || body.product_name || "";

    if (!email) {
      return new Response(JSON.stringify({ error: "Email not found in payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Determine subscription type from product name
    let subscriptionType = "mensal";
    const lower = productName.toLowerCase();
    if (lower.includes("semestral") || lower.includes("180")) {
      subscriptionType = "semestral";
    } else if (lower.includes("trimestral") || lower.includes("90")) {
      subscriptionType = "trimestral";
    }

    // Calculate expiration
    const daysMap: Record<string, number> = { mensal: 30, trimestral: 90, semestral: 180 };
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (daysMap[subscriptionType] || 30));

    // Find user by email
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", email)
      .maybeSingle();

    if (status === "approved" || status === "paid") {
      if (!profile) {
        console.log("No profile found for email:", email);
        await supabase.from("assinaturas").upsert(
          {
            user_id: "00000000-0000-0000-0000-000000000000",
            email,
            status_pagamento: "pago",
            kiwify_order_id: orderId,
          },
          { onConflict: "kiwify_order_id" }
        );
        return new Response(JSON.stringify({ success: true, message: "Saved, user not found yet" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await supabase
        .from("profiles")
        .update({
          is_premium: true,
          subscription_type: subscriptionType,
          subscription_expires_at: expiresAt.toISOString(),
        })
        .eq("user_id", profile.user_id);

      await supabase.from("assinaturas").upsert(
        {
          user_id: profile.user_id,
          email,
          status_pagamento: "pago",
          kiwify_order_id: orderId,
        },
        { onConflict: "kiwify_order_id" }
      );

      console.log("User activated:", email, subscriptionType);
    } else if (status === "refunded") {
      if (profile) {
        await supabase
          .from("profiles")
          .update({
            is_premium: false,
            subscription_type: null,
            subscription_expires_at: null,
          })
          .eq("user_id", profile.user_id);

        await supabase
          .from("assinaturas")
          .update({ status_pagamento: "reembolsado" })
          .eq("user_id", profile.user_id)
          .eq("kiwify_order_id", orderId);

        console.log("User refunded:", email);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
