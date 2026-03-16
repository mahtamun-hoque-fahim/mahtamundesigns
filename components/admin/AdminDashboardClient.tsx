'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { RefreshCw, Menu } from 'lucide-react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { isSessionValid, heartbeat } from '@/components/admin/useSessionManager'
import { DashboardOverview } from '@/components/admin/DashboardOverview'
import { ContentEditor } from '@/components/admin/ContentEditor'
import { CompaniesEditor } from '@/components/admin/CompaniesEditor'
import { ReviewsEditor } from '@/components/admin/ReviewsEditor'
import { MediaManager } from '@/components/admin/MediaManager'
import { MediaStoreManager } from '@/components/admin/MediaStoreManager'
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard'
import { ActivityLogViewer } from '@/components/admin/ActivityLogViewer'
import { AdminSettings } from '@/components/admin/AdminSettings'
import { MessagesViewer } from '@/components/admin/MessagesViewer'
import { LogoStripEditor } from '@/components/admin/LogoStripEditor'

const PAGE_TITLES: Record<string, string> = {
  overview: 'Dashboard Overview', messages: 'Contact Messages', pages: 'Page Content Manager',
  media: 'Media Library', 'logo-strip': 'Logo Strip', 'media-store': 'Media Store',
  reviews: 'Reviews Manager', clients: 'Clients Manager',
  analytics: 'Visitor Analytics', activity: 'Activity Log', settings: 'Account & Security',
}

export function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const heartbeatRef = useRef<ReturnType<typeof setInterval>>()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/admin/login'); return }
      const valid = await isSessionValid(session.user.id)
      if (!valid) {
        await supabase.auth.signOut()
        router.push('/admin/login?reason=session_terminated')
        return
      }
      setLoading(false)
      heartbeatRef.current = setInterval(() => heartbeat(session.user.id), 60000)
    })
    return () => { if (heartbeatRef.current) clearInterval(heartbeatRef.current) }
  }, [router, supabase])

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }, [supabase, router])

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <RefreshCw className="w-6 h-6 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(c => !c)}
      />
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        <div className="sticky top-0 z-30 h-14 bg-background/80 backdrop-blur-md border-b border-border flex items-center px-6 gap-4">
          <button onClick={() => setCollapsed(c => !c)} className="md:hidden p-2 text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-display font-semibold text-sm">{PAGE_TITLES[activeTab] || activeTab}</h1>
        </div>
        <div className="p-6">
          {activeTab === 'overview' && <DashboardOverview onNavigate={setActiveTab} />}
          {activeTab === 'messages' && <MessagesViewer />}
          {activeTab === 'pages' && <ContentEditor />}
          {activeTab === 'media' && <MediaManager />}
          {activeTab === 'logo-strip' && <LogoStripEditor />}
          {activeTab === 'media-store' && <MediaStoreManager />}
          {activeTab === 'reviews' && <ReviewsEditor />}
          {activeTab === 'clients' && <CompaniesEditor />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'activity' && <ActivityLogViewer />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </div>
    </div>
  )
}
