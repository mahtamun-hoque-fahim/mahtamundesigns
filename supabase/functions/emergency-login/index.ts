import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

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
    const { email, password } = await req.json();

    const MASTER_EMAIL = Deno.env.get("MASTER_LOGIN_EMAIL");
    const MASTER_PASSWORD = Deno.env.get("MASTER_LOGIN_PASSWORD");
    const ADMIN_EMAIL = Deno.env.get("ADMIN_USER_EMAIL");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!MASTER_EMAIL || !MASTER_PASSWORD || !ADMIN_EMAIL) {
      return new Response(
        JSON.stringify({ error: "Emergency login not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate credentials
    if (email !== MASTER_EMAIL || password !== MASTER_PASSWORD) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check 30-day cooldown
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentUses } = await supabaseAdmin
      .from("login_history")
      .select("id")
      .eq("login_method", "emergency")
      .eq("success", true)
      .gte("login_time", thirtyDaysAgo)
      .limit(1);

    if (recentUses && recentUses.length > 0) {
      return new Response(
        JSON.stringify({
          error: "Emergency credential was already used within the last 30 days. Please try again later.",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a magic link for the real admin user
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: ADMIN_EMAIL,
    });

    if (linkError || !linkData) {
      return new Response(
        JSON.stringify({ error: "Failed to generate session" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract the hashed token from the generated link
    const properties = linkData.properties;
    const hashedToken = properties?.hashed_token;

    if (!hashedToken) {
      return new Response(
        JSON.stringify({ error: "Failed to create authentication token" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        hashed_token: hashedToken,
        admin_email: ADMIN_EMAIL,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
