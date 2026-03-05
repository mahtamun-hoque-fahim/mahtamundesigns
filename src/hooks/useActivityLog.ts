import { supabase } from "@/integrations/supabase/client";

export async function logActivity(action: string, page: string = "", details: string = "") {
  try {
    await (supabase as any).from("activity_log").insert({ action, page, details });
  } catch {
    // silently fail
  }
}
