import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LogoStripItem {
  id: string;
  name: string;
  logo_url: string;
  sort_order: number;
  active: boolean;
}

let _cache: LogoStripItem[] | null = null;
let _promise: Promise<LogoStripItem[]> | null = null;
let _version = 0;
const _listeners: Set<() => void> = new Set();

async function fetchLogoStrip(): Promise<LogoStripItem[]> {
  const { data } = await supabase
    .from("logo_strip_items")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  return (data || []) as LogoStripItem[];
}

export function useLogoStrip(): LogoStripItem[] {
  const [items, setItems] = useState<LogoStripItem[]>([]);
  const [version, setVersion] = useState(_version);

  useEffect(() => {
    const listener = () => setVersion(v => v + 1);
    _listeners.add(listener);
    return () => { _listeners.delete(listener); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!_cache) {
        _promise = fetchLogoStrip();
        _cache = await _promise;
      }
      if (!cancelled) setItems(_cache);
    };
    load();
    return () => { cancelled = true; };
  }, [version]);

  return items;
}

export function invalidateLogoStripCache() {
  _cache = null;
  _promise = null;
  _version += 1;
  _listeners.forEach(fn => fn());
}
