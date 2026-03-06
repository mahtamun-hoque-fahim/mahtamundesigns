import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const BOT_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /slurp/i, /mediapartners/i,
  /googlebot/i, /bingbot/i, /duckduckbot/i, /baiduspider/i, /yandexbot/i,
  /applebot/i, /semrushbot/i, /ahrefsbot/i, /mj12bot/i, /dotbot/i,
  /chatgpt/i, /gptbot/i, /claudebot/i, /perplexitybot/i, /ccbot/i,
  /bytespider/i, /amazonbot/i, /meta-externalagent/i,
  /uptimerobot/i, /pingdom/i, /statuscake/i, /newrelic/i, /datadog/i,
  /phantomjs/i, /headlesschrome/i, /puppeteer/i, /playwright/i, /selenium/i,
  /lighthouse/i, /pagespeed/i, /gtmetrix/i,
];

function isBot(): boolean {
  const ua = navigator.userAgent;
  if (BOT_PATTERNS.some((p) => p.test(ua))) return true;
  // Headless browser signals
  if ((navigator as any).webdriver) return true;
  if (!window.outerWidth && !window.outerHeight) return true;
  return false;
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|iphone|android/i.test(ua) && !/tablet/i.test(ua)) return "mobile";
  return "desktop";
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  return "Other";
}

function getOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (/iPhone|iPad/.test(ua)) return "iOS";
  return "Other";
}

let sessionId = "";
function getSessionId() {
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  return sessionId;
}

// Rate-limit: track last record time per session
let lastRecordTime = 0;
const MIN_INTERVAL_MS = 2000; // at least 2s between page views

export function usePageTracking() {
  const location = useLocation();
  const humanVerified = useRef(false);

  // Wait for a real human interaction before allowing tracking
  useEffect(() => {
    if (humanVerified.current) return;
    const mark = () => { humanVerified.current = true; };
    const events = ["scroll", "mousemove", "touchstart", "keydown", "click"] as const;
    events.forEach((e) => window.addEventListener(e, mark, { once: true, passive: true }));
    return () => { events.forEach((e) => window.removeEventListener(e, mark)); };
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;
    if (isBot()) return;

    const record = async () => {
      // Wait up to 10s for a human interaction signal
      const start = Date.now();
      while (!humanVerified.current && Date.now() - start < 10000) {
        await new Promise((r) => setTimeout(r, 250));
      }
      if (!humanVerified.current) return;

      // Rate-limit rapid page loads
      const now = Date.now();
      if (now - lastRecordTime < MIN_INTERVAL_MS) return;
      lastRecordTime = now;

      // Exclude logged-in admins
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) return;
      } catch { /* continue */ }

      try {
        await (supabase as any).from("page_views").insert({
          page_path: location.pathname,
          referrer: document.referrer || "",
          user_agent: navigator.userAgent,
          device_type: getDeviceType(),
          browser: getBrowser(),
          os: getOS(),
          session_id: getSessionId(),
        });
      } catch {
        // silently fail
      }
    };

    record();
  }, [location.pathname]);
}
