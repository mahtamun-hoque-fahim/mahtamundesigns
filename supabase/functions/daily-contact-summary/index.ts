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
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminEmail = Deno.env.get("ADMIN_USER_EMAIL") || Deno.env.get("MASTER_LOGIN_EMAIL");

    const supabase = createClient(supabaseUrl, serviceKey);

    // Get today's un-notified messages
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: unnotified, count } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact" })
      .gte("created_at", today.toISOString())
      .eq("email_notified", false);

    const pendingCount = count || 0;

    if (pendingCount === 0) {
      console.log("[DAILY SUMMARY] No pending messages to summarize.");
      return new Response(JSON.stringify({ success: true, message: "No pending messages" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log summary (email sending will be configured with provider)
    console.log(`[DAILY SUMMARY] Batch email would be sent to ${adminEmail}`);
    console.log(`[DAILY SUMMARY] You received ${pendingCount} new messages today.`);
    
    if (unnotified) {
      for (const msg of unnotified.slice(0, 10)) {
        console.log(`  - ${msg.name} <${msg.email}>: ${(msg.subject || msg.message).slice(0, 60)}`);
      }
    }

    // Mark all as notified
    await supabase
      .from("contact_messages")
      .update({ email_notified: true })
      .gte("created_at", today.toISOString())
      .eq("email_notified", false);

    return new Response(JSON.stringify({ success: true, summarized: pendingCount }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Daily summary error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
