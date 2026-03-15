import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MediaAsset {
  slot_key: string;
  public_url: string | null;
}

// Cache for media URLs
let mediaCache: Record<string, string> | null = null;
let cachePromise: Promise<Record<string, string>> | null = null;
// Version counter — increments on every invalidation, triggering re-fetches
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
 * Starts with null (no flash), resolves to Supabase URL or defaultUrl.
 * Automatically re-fetches when invalidateMediaCache() is called.
 */
export function useMediaUrl(slotKey: string, defaultUrl: string): string {
  // Start null — prevents flash of old/default image before real URL loads
  const [url, setUrl] = useState<string | null>(null);
  const [version, setVersion] = useState(cacheVersion);

  // Subscribe to cache invalidation so all hooks re-fetch after uploads
  useEffect(() => {
    const listener = () => setVersion(v => v + 1);
    versionListeners.add(listener);
    return () => { versionListeners.delete(listener); };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!mediaCache) {
        cachePromise = fetchMediaMap();
        mediaCache = await cachePromise;
      }
      if (!cancelled) {
        // Use Supabase URL if exists, otherwise the local default
        setUrl(mediaCache[slotKey] || defaultUrl);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [slotKey, defaultUrl, version]);

  // Return empty string while loading — image won't render, no flash
  return url ?? "";
}

/**
 * Invalidate the media cache and notify all active useMediaUrl hooks to re-fetch.
 * Call this after any admin upload/delete.
 */
export function invalidateMediaCache() {
  mediaCache = null;
  cachePromise = null;
  cacheVersion += 1;
  versionListeners.forEach(fn => fn());
}
