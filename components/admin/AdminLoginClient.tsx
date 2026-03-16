'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { Lock, Mail, ArrowLeft, AlertTriangle, ShieldAlert } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

function AdminLoginInner() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'forgot'>('login')
  const [resetSent, setResetSent] = useState(false)
  const [sessionMessage, setSessionMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const reason = searchParams.get('reason')
    if (reason === 'session_terminated') setSessionMessage('Your session was terminated because your account was logged in from another device.')
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError(authError.message); setLoading(false); return }
    if (data.session) router.push('/admin')
    setLoading(false)
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    })
    if (resetError) { setError(resetError.message); setLoading(false); return }
    setResetSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold">Admin Login</h1>
          <p className="text-muted-foreground text-sm mt-2">Access the dashboard</p>
        </div>

        {sessionMessage && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-3">
            <ShieldAlert className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{sessionMessage}</p>
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full h-11 pl-10 pr-4 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="admin@example.com" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full h-11 pl-10 pr-4 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="••••••••" />
              </div>
            </div>
            {error && <p className="text-sm text-destructive flex items-center gap-2"><AlertTriangle className="w-4 h-4" />{error}</p>}
            <button type="submit" disabled={loading} className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
            <button type="button" onClick={() => setMode('forgot')} className="w-full text-sm text-muted-foreground hover:text-primary transition-colors">
              Forgot password?
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgot} className="space-y-4">
            <button type="button" onClick={() => setMode('login')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </button>
            {resetSent ? (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-sm text-center">
                Reset link sent! Check your email.
              </div>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full h-11 px-4 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="admin@example.com" />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <button type="submit" disabled={loading} className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:bg-primary/90 disabled:opacity-50">
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

export function AdminLoginClient() {
  return <Suspense><AdminLoginInner /></Suspense>
}
