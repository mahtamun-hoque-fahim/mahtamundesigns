'use client'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function getSupabaseBrowserClient() {
  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client
}

// Named export matching old import pattern: import { supabase } from "..."
export const supabase = typeof window !== 'undefined'
  ? getSupabaseBrowserClient()
  : null as unknown as ReturnType<typeof createBrowserClient<Database>>
