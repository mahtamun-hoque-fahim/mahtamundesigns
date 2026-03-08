import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendEmail(to: string, subject: string, html: string) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Resend error [${res.status}]: ${JSON.stringify(data)}`);
  return data;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminEmail = Deno.env.get("ADMIN_USER_EMAIL") || Deno.env.get("MASTER_LOGIN_EMAIL");

    if (!adminEmail) {
      console.error("No admin email configured");
      return new Response(JSON.stringify({ error: "No admin email" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

    // Build message list HTML
    const messageRows = (unnotified || []).slice(0, 20).map((msg: any) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #3f3f46;">
          <div style="font-size: 14px; font-weight: 600; color: #fafafa;">${msg.name}</div>
          <div style="font-size: 12px; color: #a1a1aa; margin-top: 2px;">
            <a href="mailto:${msg.email}" style="color: #a78bfa; text-decoration: none;">${msg.email}</a>
          </div>
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #3f3f46; vertical-align: top;">
          <div style="font-size: 13px; color: #d4d4d8;">${msg.subject || "(No subject)"}</div>
          <div style="font-size: 12px; color: #71717a; margin-top: 4px;">${(msg.message || "").slice(0, 100)}${(msg.message || "").length > 100 ? "…" : ""}</div>
        </td>
      </tr>
    `).join("");

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 0;">
        <div style="background: #18181b; border-radius: 12px; padding: 32px; color: #fafafa;">
          <h2 style="margin: 0 0 4px; font-size: 22px; color: #fafafa;">📊 Daily Message Summary</h2>
          <p style="margin: 0 0 24px; font-size: 14px; color: #a1a1aa;">
            You received <strong style="color: #a78bfa;">${pendingCount} new message${pendingCount > 1 ? "s" : ""}</strong> today
          </p>

          <table style="width: 100%; border-collapse: collapse; background: #27272a; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background: #3f3f46;">
                <th style="padding: 10px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #a1a1aa;">Sender</th>
                <th style="padding: 10px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #a1a1aa;">Message</th>
              </tr>
            </thead>
            <tbody>
              ${messageRows}
            </tbody>
          </table>

          ${pendingCount > 20 ? `<p style="text-align: center; margin-top: 16px; font-size: 13px; color: #a1a1aa;">…and ${pendingCount - 20} more messages</p>` : ""}

          <div style="text-align: center; margin-top: 24px;">
            <a href="https://mahtamundesigns.lovable.app/admin" 
               style="display: inline-block; background: #a78bfa; color: #18181b; padding: 10px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
              View All Messages
            </a>
          </div>
        </div>
        <p style="text-align: center; margin-top: 16px; font-size: 12px; color: #71717a;">
          Daily summary · ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
    `;

    await sendEmail(adminEmail, `📬 ${pendingCount} new message${pendingCount > 1 ? "s" : ""} today`, html);

    // Mark all as notified
    await supabase
      .from("contact_messages")
      .update({ email_notified: true })
      .gte("created_at", today.toISOString())
      .eq("email_notified", false);

    console.log(`[DAILY SUMMARY] Batch email sent to ${adminEmail} with ${pendingCount} messages.`);

    return new Response(JSON.stringify({ success: true, summarized: pendingCount }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Daily summary error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
