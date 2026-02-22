import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MediaAsset {
  slot_key: string;
  public_url: string | null;
}

// Cache for media URLs
let mediaCache: Record<string, string> | null = null;
let cachePromise: Promise<Record<string, string>> | null = null;

async function fetchMediaMap(): Promise<Record<string, string>> {
  const { data } = await supabase
    .from("media_assets")
    .select("slot_key, public_url");

  const map: Record<string, string> = {};
  data?.forEach((item: MediaAsset) => {
    if (item.public_url) {
      map[item.slot_key] = item.public_url;
    }
  });
  return map;
}

/**
 * Hook to get the URL for a media asset by its slot key.
 * Falls back to the provided default URL if no override exists.
 */
export function useMediaUrl(slotKey: string, defaultUrl: string): string {
  const [url, setUrl] = useState(defaultUrl);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!mediaCache) {
        if (!cachePromise) {
          cachePromise = fetchMediaMap();
        }
        mediaCache = await cachePromise;
      }
      if (!cancelled && mediaCache[slotKey]) {
        setUrl(mediaCache[slotKey]);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [slotKey, defaultUrl]);

  return url;
}

/**
 * Invalidate the media cache (call after admin uploads)
 */
export function invalidateMediaCache() {
  mediaCache = null;
  cachePromise = null;
}
