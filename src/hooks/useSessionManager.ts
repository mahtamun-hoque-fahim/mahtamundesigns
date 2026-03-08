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
 * Detect suspicious login activity by comparing against login history.
 * Returns array of alert objects if suspicious patterns found.
 */
async function detectSuspiciousLogin(
  userId: string,
  deviceInfo: { device_type: string; browser: string; os: string; ip_address: string; location: string }
): Promise<Array<{ alert_type: string; severity: string; title: string; details: string }>> {
  const alerts: Array<{ alert_type: string; severity: string; title: string; details: string }> = [];

  // Fetch recent successful logins
  const { data: history } = await (supabase as any)
    .from("login_history")
    .select("device_type, browser, os, ip_address, location, login_time")
    .eq("user_id", userId)
    .eq("success", true)
    .order("login_time", { ascending: false })
    .limit(50);

  if (!history || history.length === 0) {
    // First ever login — no alerts
    return alerts;
  }

  const knownDevices = new Set(history.map((h: any) => `${h.device_type}|${h.browser}|${h.os}`));
  const knownLocations = new Set(history.map((h: any) => h.location).filter(Boolean));
  const knownBrowsers = new Set(history.map((h: any) => h.browser).filter(Boolean));
  const knownIPs = new Set(history.map((h: any) => h.ip_address).filter(Boolean));

  const currentDeviceKey = `${deviceInfo.device_type}|${deviceInfo.browser}|${deviceInfo.os}`;

  // 1. New device detection
  if (!knownDevices.has(currentDeviceKey)) {
    alerts.push({
      alert_type: "new_device",
      severity: "high",
      title: "New Device Login Detected",
      details: `Login from a new device: ${deviceInfo.device_type} · ${deviceInfo.browser} · ${deviceInfo.os}`,
    });
  }

  // 2. New location detection
  if (deviceInfo.location && !knownLocations.has(deviceInfo.location)) {
    alerts.push({
      alert_type: "new_location",
      severity: "high",
      title: "Login From New Location",
      details: `Login from an unrecognized location: ${deviceInfo.location}`,
    });
  }

  // 3. New browser detection (only if device isn't already flagged)
  if (deviceInfo.browser && !knownBrowsers.has(deviceInfo.browser) && !alerts.find(a => a.alert_type === "new_device")) {
    alerts.push({
      alert_type: "new_browser",
      severity: "medium",
      title: "New Browser Detected",
      details: `Login using a new browser: ${deviceInfo.browser}`,
    });
  }

  // 4. New IP detection
  if (deviceInfo.ip_address && !knownIPs.has(deviceInfo.ip_address) && !alerts.find(a => a.alert_type === "new_location")) {
    alerts.push({
      alert_type: "new_ip",
      severity: "medium",
      title: "Login From New IP Address",
      details: `Login from an unrecognized IP: ${deviceInfo.ip_address}`,
    });
  }

  // 5. Multiple failed attempts detection (last 15 minutes)
  const { data: recentFails } = await (supabase as any)
    .from("login_history")
    .select("id")
    .eq("success", false)
    .gte("login_time", new Date(Date.now() - 15 * 60 * 1000).toISOString())
    .limit(10);

  if (recentFails && recentFails.length >= 3) {
    alerts.push({
      alert_type: "failed_attempts",
      severity: "high",
      title: "Multiple Failed Login Attempts",
      details: `${recentFails.length} failed login attempts detected in the last 15 minutes before this successful login.`,
    });
  }

  return alerts;
}

/**
 * Save security alerts to the database
 */
async function saveSecurityAlerts(
  userId: string,
  alerts: Array<{ alert_type: string; severity: string; title: string; details: string }>,
  deviceInfo: { device_type: string; browser: string; os: string; ip_address: string; location: string }
) {
  if (alerts.length === 0) return;

  const rows = alerts.map((a) => ({
    user_id: userId,
    alert_type: a.alert_type,
    severity: a.severity,
    title: a.title,
    details: a.details,
    device_type: deviceInfo.device_type,
    browser: deviceInfo.browser,
    os: deviceInfo.os,
    ip_address: deviceInfo.ip_address,
    location: deviceInfo.location,
  }));

  await (supabase as any).from("security_alerts").insert(rows);
}

/**
 * Called on successful admin login.
 * 1. Terminates all other active sessions (single-device enforcement)
 * 2. Creates a new session record
 * 3. Logs to login_history
 * 4. Detects suspicious login activity
 */
export async function recordLogin(userId: string, method: string = "email") {
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

  // Log to login_history with method
  await (supabase as any).from("login_history").insert({
    user_id: userId,
    ...deviceInfo,
    success: true,
    login_method: method,
  });

  // Detect and save suspicious login alerts
  const alerts = await detectSuspiciousLogin(userId, deviceInfo);

  // Always create an alert for emergency logins
  if (method === "emergency") {
    alerts.push({
      alert_type: "emergency_login",
      severity: "critical",
      title: "Emergency Master Credential Used",
      details: `The emergency master credential was used to access the dashboard from ${deviceInfo.device_type} · ${deviceInfo.browser} · ${deviceInfo.os} at ${deviceInfo.location || "unknown location"}`,
    });
  }

  await saveSecurityAlerts(userId, alerts, deviceInfo);
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
