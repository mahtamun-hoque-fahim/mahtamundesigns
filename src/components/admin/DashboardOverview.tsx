import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Users, MessageSquare, Building2, Image, Clock } from "lucide-react";

interface Stats {
  pageViews: number;
  uniqueVisitors: number;
  totalReviews: number;
  totalClients: number;
  totalMedia: number;
  lastUpdate: string;
}

export function DashboardOverview({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [stats, setStats] = useState<Stats>({
    pageViews: 0,
    uniqueVisitors: 0,
    totalReviews: 0,
    totalClients: 0,
    totalMedia: 0,
    lastUpdate: "—",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [pvRes, reviewRes, companyRes, mediaRes, contentRes] = await Promise.all([
        (supabase as any).from("page_views").select("session_id, id"),
        (supabase as any).from("reviews").select("id", { count: "exact", head: true }),
        (supabase as any).from("companies").select("id", { count: "exact", head: true }),
        supabase.from("media_assets").select("id", { count: "exact", head: true }),
        (supabase as any).from("site_content").select("updated_at").order("updated_at", { ascending: false }).limit(1),
      ]);

      const sessions = new Set((pvRes.data || []).map((r: any) => r.session_id));

      setStats({
        pageViews: pvRes.data?.length || 0,
        uniqueVisitors: sessions.size,
        totalReviews: reviewRes.count || 0,
        totalClients: companyRes.count || 0,
        totalMedia: mediaRes.count || 0,
        lastUpdate: contentRes.data?.[0]?.updated_at
          ? new Date(contentRes.data[0].updated_at).toLocaleDateString()
          : "—",
      });
      setLoading(false);
    };
    load();
  }, []);

  const cards = [
    { label: "Page Views", value: stats.pageViews, icon: Eye, tab: "analytics", color: "text-blue-400" },
    { label: "Unique Visitors", value: stats.uniqueVisitors, icon: Users, tab: "analytics", color: "text-green-400" },
    { label: "Reviews", value: stats.totalReviews, icon: MessageSquare, tab: "reviews", color: "text-yellow-400" },
    { label: "Clients", value: stats.totalClients, icon: Building2, tab: "clients", color: "text-purple-400" },
    { label: "Media Files", value: stats.totalMedia, icon: Image, tab: "media", color: "text-pink-400" },
    { label: "Last Update", value: stats.lastUpdate, icon: Clock, tab: "pages", color: "text-orange-400", isText: true },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-card border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-6">Welcome back</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <button
            key={card.label}
            onClick={() => onNavigate(card.tab)}
            className="text-left p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <card.icon className={`w-5 h-5 ${card.color}`} />
              <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">View →</span>
            </div>
            <p className={`font-display font-bold ${card.isText ? "text-lg" : "text-2xl"} text-foreground`}>
              {card.isText ? card.value : Number(card.value).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
