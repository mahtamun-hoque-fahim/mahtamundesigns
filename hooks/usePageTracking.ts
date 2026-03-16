'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const BOT_PATTERNS = [/bot/i,/crawl/i,/spider/i,/googlebot/i,/bingbot/i,/chatgpt/i,/gptbot/i,/claudebot/i,/perplexitybot/i,/headlesschrome/i,/puppeteer/i,/selenium/i,/lighthouse/i]

function isBot() {
  const ua = navigator.userAgent
  if (BOT_PATTERNS.some((p) => p.test(ua))) return true
  if ((navigator as unknown as Record<string,unknown>).webdriver) return true
  return false
}

function getDeviceType() {
  const ua = navigator.userAgent
  if (/tablet|ipad/i.test(ua)) return 'tablet'
  if (/mobile|iphone|android/i.test(ua)) return 'mobile'
  return 'desktop'
}

function getBrowser() {
  const ua = navigator.userAgent
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Edg')) return 'Edge'
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Safari')) return 'Safari'
  return 'Other'
}

function getOS() {
  const ua = navigator.userAgent
  if (ua.includes('Win')) return 'Windows'
  if (ua.includes('Mac')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  if (ua.includes('Android')) return 'Android'
  if (/iPhone|iPad/.test(ua)) return 'iOS'
  return 'Other'
}

let sessionId = ''
function getSessionId() {
  if (!sessionId) sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  return sessionId
}

let lastRecordTime = 0

export function usePageTracking() {
  const pathname = usePathname()
  const humanVerified = useRef(false)

  useEffect(() => {
    if (humanVerified.current) return
    const mark = () => { humanVerified.current = true }
    const events = ['scroll','mousemove','touchstart','keydown','click'] as const
    events.forEach((e) => window.addEventListener(e, mark, { once: true, passive: true }))
    return () => events.forEach((e) => window.removeEventListener(e, mark))
  }, [])

  useEffect(() => {
    if (pathname.startsWith('/admin')) return
    if (typeof window === 'undefined') return
    if (isBot()) return

    const record = async () => {
      const start = Date.now()
      while (!humanVerified.current && Date.now() - start < 10000) {
        await new Promise((r) => setTimeout(r, 250))
      }
      if (!humanVerified.current) return
      const now = Date.now()
      if (now - lastRecordTime < 2000) return
      lastRecordTime = now
      try {
        const supabase = getSupabaseBrowserClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (session) return
        await (supabase as unknown as { from: (t: string) => { insert: (d: unknown) => Promise<unknown> } })
          .from('page_views').insert({
            page_path: pathname,
            referrer: document.referrer || '',
            user_agent: navigator.userAgent,
            device_type: getDeviceType(),
            browser: getBrowser(),
            os: getOS(),
            session_id: getSessionId(),
          })
      } catch { /* silent */ }
    }

    record()
  }, [pathname])
}
