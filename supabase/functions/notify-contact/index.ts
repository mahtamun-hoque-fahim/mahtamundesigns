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

    // Count today's messages
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString());

    const dailyCount = count || 0;

    // If ≤5, this message gets individual notification (mark as notified)
    // If >5, skip individual — the daily cron will handle batch
    const body = await req.json();

    if (dailyCount <= 5) {
      // For now, log the notification intent
      // Email sending will be configured once an email provider is set up
      console.log(`[NOTIFY] Individual email would be sent to ${adminEmail}`);
      console.log(`[NOTIFY] From: ${body.name} <${body.email}> | Subject: ${body.subject}`);
      
      // Mark as notified
      await supabase
        .from("contact_messages")
        .update({ email_notified: true })
        .eq("email", body.email)
        .eq("name", body.name)
        .order("created_at", { ascending: false })
        .limit(1);
    } else {
      console.log(`[NOTIFY] Daily count is ${dailyCount}, skipping individual email. Batch summary will be sent.`);
    }

    return new Response(JSON.stringify({ success: true, dailyCount }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Notify error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
