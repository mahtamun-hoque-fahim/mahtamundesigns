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
    const body = await req.json();

    // Count today's messages
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString());

    const dailyCount = count || 0;

    if (dailyCount <= 5) {
      // Send individual email
      const dashboardUrl = `${Deno.env.get("SUPABASE_URL")?.replace(".supabase.co", "")}/admin`;

      const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 0;">
          <div style="background: #18181b; border-radius: 12px; padding: 32px; color: #fafafa;">
            <h2 style="margin: 0 0 4px; font-size: 20px; color: #fafafa;">📬 New Contact Message</h2>
            <p style="margin: 0 0 24px; font-size: 13px; color: #a1a1aa;">Someone reached out through your portfolio</p>
            
            <div style="background: #27272a; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #a1a1aa; font-size: 13px; width: 70px;">From</td>
                  <td style="padding: 6px 0; color: #fafafa; font-size: 14px; font-weight: 600;">${body.name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #a1a1aa; font-size: 13px;">Email</td>
                  <td style="padding: 6px 0; color: #fafafa; font-size: 14px;">
                    <a href="mailto:${body.email}" style="color: #a78bfa; text-decoration: none;">${body.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #a1a1aa; font-size: 13px;">Subject</td>
                  <td style="padding: 6px 0; color: #fafafa; font-size: 14px;">${body.subject || "(No subject)"}</td>
                </tr>
              </table>
            </div>

            <div style="background: #27272a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <p style="margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #a1a1aa;">Message</p>
              <p style="margin: 0; color: #d4d4d8; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${body.message || ""}</p>
            </div>

            <div style="text-align: center;">
              <a href="mailto:${body.email}?subject=Re: ${encodeURIComponent(body.subject || 'Your message')}" 
                 style="display: inline-block; background: #a78bfa; color: #18181b; padding: 10px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
                Reply to ${body.name}
              </a>
            </div>
          </div>
          <p style="text-align: center; margin-top: 16px; font-size: 12px; color: #71717a;">
            Message #${dailyCount} today · Sent from your portfolio contact form
          </p>
        </div>
      `;

      await sendEmail(adminEmail, `New message from ${body.name}: ${body.subject || "No subject"}`, html);

      // Mark as notified
      await supabase
        .from("contact_messages")
        .update({ email_notified: true })
        .eq("email", body.email)
        .eq("name", body.name)
        .order("created_at", { ascending: false })
        .limit(1);

      console.log(`[NOTIFY] Individual email sent to ${adminEmail} for message from ${body.name}`);
    } else {
      console.log(`[NOTIFY] Daily count is ${dailyCount}, deferring to batch summary.`);
    }

    return new Response(JSON.stringify({ success: true, dailyCount }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Notify error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
