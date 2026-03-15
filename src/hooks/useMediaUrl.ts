import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MediaAsset {
  slot_key: string;
  public_url: string | null;
}

// Cache for media URLs
let mediaCache: Record<string, string> | null = null;
let cachePromise: Promise<Record<string, string>> | null = null;
// Version counter — increments on every invalidation, triggering re-fetches in all hooks
let cacheVersion = 0;
const versionListeners: Set<() => void> = new Set();

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
 * Automatically re-fetches when invalidateMediaCache() is called.
 */
export function useMediaUrl(slotKey: string, defaultUrl: string): string {
  const [url, setUrl] = useState(defaultUrl);
  const [version, setVersion] = useState(cacheVersion);

  // Subscribe to cache invalidation events
  useEffect(() => {
    const listener = () => setVersion(v => v + 1);
    versionListeners.add(listener);
    return () => { versionListeners.delete(listener); };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // Always re-fetch fresh data after invalidation
      if (!mediaCache) {
        cachePromise = fetchMediaMap();
        mediaCache = await cachePromise;
      }
      if (!cancelled) {
        const freshUrl = mediaCache[slotKey];
        setUrl(freshUrl || defaultUrl);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [slotKey, defaultUrl, version]);

  return url;
}

/**
 * Invalidate the media cache and notify all active useMediaUrl hooks to re-fetch.
 * Call this after any admin upload/delete.
 */
export function invalidateMediaCache() {
  mediaCache = null;
  cachePromise = null;
  cacheVersion += 1;
  // Notify all mounted hooks to re-fetch
  versionListeners.forEach(fn => fn());
}
