'use client'
import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

let mediaCache: Record<string, string> | null = null
let cachePromise: Promise<Record<string, string>> | null = null
let cacheVersion = 0
const versionListeners: Set<() => void> = new Set()

async function fetchMediaMap(): Promise<Record<string, string>> {
  const supabase = getSupabaseBrowserClient()
  const { data } = await supabase.from('media_assets').select('slot_key, public_url')
  const map: Record<string, string> = {}
  data?.forEach((item: { slot_key: string; public_url: string | null }) => {
    if (item.public_url) map[item.slot_key] = item.public_url
  })
  return map
}

export function useMediaUrl(slotKey: string, defaultUrl: string): string {
  const [url, setUrl] = useState<string | null>(null)
  const [version, setVersion] = useState(cacheVersion)
  useEffect(() => {
    const listener = () => setVersion(v => v + 1)
    versionListeners.add(listener)
    return () => { versionListeners.delete(listener) }
  }, [])
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!mediaCache) { cachePromise = fetchMediaMap(); mediaCache = await cachePromise }
      if (!cancelled) setUrl(mediaCache[slotKey] || defaultUrl)
    }
    load()
    return () => { cancelled = true }
  }, [slotKey, defaultUrl, version])
  return url ?? ''
}

export function invalidateMediaCache() {
  mediaCache = null; cachePromise = null; cacheVersion += 1
  versionListeners.forEach(fn => fn())
}
