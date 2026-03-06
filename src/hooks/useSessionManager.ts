import { supabase } from "@/integrations/supabase/client";

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return "Tablet";
  if (/mobile|iphone|android.*mobile/i.test(ua)) return "Mobile";
  return "Desktop";
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\//i.test(ua) || /opera/i.test(ua)) return "Opera";
  if (/chrome/i.test(ua) && !/edg/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  if (/firefox/i.test(ua)) return "Firefox";
  return "Unknown";
}

function getOS(): string {
  const ua = navigator.userAgent;
  if (/windows/i.test(ua)) return "Windows";
  if (/macintosh|mac os/i.test(ua)) return "macOS";
  if (/linux/i.test(ua) && !/android/i.test(ua)) return "Linux";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  return "Unknown";
}

async function fetchIP(): Promise<{ ip: string; location: string }> {
  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { ip: "", location: "" };
    const data = await res.json();
    return {
      ip: data.ip || "",
      location: [data.city, data.country_name].filter(Boolean).join(", "),
    };
  } catch {
    return { ip: "", location: "" };
  }
}

/** Generate a unique token for this browser session */
function getOrCreateSessionToken(): string {
  let token = sessionStorage.getItem("admin_session_token");
  if (!token) {
    token = crypto.randomUUID();
    sessionStorage.setItem("admin_session_token", token);
  }
  return token;
}

export function getSessionToken(): string {
  return sessionStorage.getItem("admin_session_token") || "";
}

/**
 * Called on successful admin login.
 * 1. Terminates all other active sessions (single-device enforcement)
 * 2. Creates a new session record
 * 3. Logs to login_history
 */
export async function recordLogin(userId: string) {
  const sessionToken = getOrCreateSessionToken();
  const { ip, location } = await fetchIP();
  const deviceInfo = {
    device_type: getDeviceType(),
    browser: getBrowser(),
    os: getOS(),
    ip_address: ip,
    location,
  };

  // Terminate all existing active sessions (single-device rule)
  await (supabase as any)
    .from("admin_sessions")
    .update({ is_active: false, terminated_at: new Date().toISOString(), terminated_reason: "new_device_login" })
    .eq("user_id", userId)
    .eq("is_active", true);

  // Create new session
  await (supabase as any).from("admin_sessions").insert({
    user_id: userId,
    session_token: sessionToken,
    ...deviceInfo,
  });

  // Log to login_history
  await (supabase as any).from("login_history").insert({
    user_id: userId,
    ...deviceInfo,
    success: true,
  });
}

/** Record a failed login attempt */
export async function recordFailedLogin(userId: string | null, reason: string) {
  const { ip, location } = await fetchIP();
  await (supabase as any).from("login_history").insert({
    user_id: userId || "00000000-0000-0000-0000-000000000000",
    device_type: getDeviceType(),
    browser: getBrowser(),
    os: getOS(),
    ip_address: ip,
    location,
    success: false,
    failure_reason: reason,
  });
}

/** Update last_active timestamp for current session */
export async function heartbeat(userId: string) {
  const token = getSessionToken();
  if (!token) return;
  await (supabase as any)
    .from("admin_sessions")
    .update({ last_active: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("session_token", token)
    .eq("is_active", true);
}

/** Check if the current session is still valid (not terminated by another device) */
export async function isSessionValid(userId: string): Promise<boolean> {
  const token = getSessionToken();
  if (!token) return false;
  const { data } = await (supabase as any)
    .from("admin_sessions")
    .select("is_active")
    .eq("user_id", userId)
    .eq("session_token", token)
    .eq("is_active", true)
    .maybeSingle();
  return !!data;
}

/** Terminate a specific session */
export async function terminateSession(sessionId: string) {
  await (supabase as any)
    .from("admin_sessions")
    .update({ is_active: false, terminated_at: new Date().toISOString(), terminated_reason: "manual_termination" })
    .eq("id", sessionId);
}

/** Terminate all sessions except current */
export async function terminateOtherSessions(userId: string) {
  const token = getSessionToken();
  await (supabase as any)
    .from("admin_sessions")
    .update({ is_active: false, terminated_at: new Date().toISOString(), terminated_reason: "manual_termination" })
    .eq("user_id", userId)
    .eq("is_active", true)
    .neq("session_token", token);
}

/** Terminate current session on logout */
export async function terminateCurrentSession(userId: string) {
  const token = getSessionToken();
  if (!token) return;
  await (supabase as any)
    .from("admin_sessions")
    .update({ is_active: false, terminated_at: new Date().toISOString(), terminated_reason: "logout" })
    .eq("user_id", userId)
    .eq("session_token", token);
  sessionStorage.removeItem("admin_session_token");
}
