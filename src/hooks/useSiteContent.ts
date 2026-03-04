import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ContentRow {
  page: string;
  section: string;
  content_key: string;
  content_value: string;
}

let _cache: Record<string, string> | null = null;
let _promise: Promise<Record<string, string>> | null = null;

async function fetchAllContent(): Promise<Record<string, string>> {
  const { data } = await (supabase as any).from("site_content").select("page, section, content_key, content_value");
  const map: Record<string, string> = {};
  ((data as ContentRow[]) || []).forEach((r) => {
    map[`${r.page}.${r.section}.${r.content_key}`] = r.content_value;
  });
  return map;
}

export function useCms(): (page: string, section: string, key: string, fallback: string) => string {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!_cache) {
        if (!_promise) _promise = fetchAllContent();
        _cache = await _promise;
      }
      if (!cancelled) setContent(_cache);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return (page, section, key, fallback) => content[`${page}.${section}.${key}`] ?? fallback;
}

export function invalidateContentCache() {
  _cache = null;
  _promise = null;
}
