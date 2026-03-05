import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface PageView {
  page_path: string;
  device_type: string;
  browser: string;
  os: string;
  session_id: string;
  created_at: string;
}

const COLORS = ["hsl(263,70%,58%)", "hsl(270,60%,50%)", "hsl(240,5%,50%)", "hsl(45,20%,60%)", "hsl(0,70%,50%)"];

export function AnalyticsDashboard() {
  const [views, setViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"7d" | "30d" | "all">("30d");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let query = (supabase as any).from("page_views").select("page_path, device_type, browser, os, session_id, created_at").order("created_at", { ascending: false });

      if (range === "7d") {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        query = query.gte("created_at", d.toISOString());
      } else if (range === "30d") {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        query = query.gte("created_at", d.toISOString());
      }

      const { data } = await query.limit(1000);
      setViews(data || []);
      setLoading(false);
    };
    load();
  }, [range]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <RefreshCw className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  // Daily views chart
  const dailyMap: Record<string, number> = {};
  views.forEach((v) => {
    const day = v.created_at.slice(0, 10);
    dailyMap[day] = (dailyMap[day] || 0) + 1;
  });
  const dailyData = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date: date.slice(5), views: count }));

  // Device breakdown
  const deviceMap: Record<string, number> = {};
  views.forEach((v) => {
    deviceMap[v.device_type] = (deviceMap[v.device_type] || 0) + 1;
  });
  const deviceData = Object.entries(deviceMap).map(([name, value]) => ({ name, value }));

  // Browser breakdown
  const browserMap: Record<string, number> = {};
  views.forEach((v) => {
    browserMap[v.browser] = (browserMap[v.browser] || 0) + 1;
  });
  const browserData = Object.entries(browserMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // OS breakdown
  const osMap: Record<string, number> = {};
  views.forEach((v) => {
    osMap[v.os] = (osMap[v.os] || 0) + 1;
  });
  const osData = Object.entries(osMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  // Top pages
  const pageMap: Record<string, number> = {};
  views.forEach((v) => {
    pageMap[v.page_path] = (pageMap[v.page_path] || 0) + 1;
  });
  const topPages = Object.entries(pageMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const uniqueSessions = new Set(views.map((v) => v.session_id)).size;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-foreground">Analytics</h2>
        <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
          {(["7d", "30d", "all"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Views" value={views.length} />
        <StatCard label="Unique Visitors" value={uniqueSessions} />
        <StatCard label="Top Page" value={topPages[0]?.[0] || "—"} isText />
        <StatCard label="Avg Views/Day" value={dailyData.length ? Math.round(views.length / dailyData.length) : 0} />
      </div>

      {/* Daily views line chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-display font-semibold text-foreground mb-4">Daily Page Views</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,4%,18%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(240,5%,50%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(240,5%,50%)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(240,5%,10%)",
                  border: "1px solid hsl(240,4%,18%)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="views" stroke="hsl(263,70%,58%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Device + Browser + OS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PieCard title="Devices" data={deviceData} />
        <PieCard title="Browsers" data={browserData} />
        <PieCard title="OS" data={osData} />
      </div>

      {/* Top pages */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-display font-semibold text-foreground mb-4">Top Pages</h3>
        <div className="space-y-3">
          {topPages.map(([path, count], i) => (
            <div key={path} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-foreground font-medium">{path}</span>
                  <span className="text-xs text-muted-foreground">{count} views</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(count / (topPages[0]?.[1] || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
          {topPages.length === 0 && <p className="text-sm text-muted-foreground">No data yet</p>}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, isText }: { label: string; value: string | number; isText?: boolean }) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`font-display font-bold ${isText ? "text-sm truncate" : "text-xl"} text-foreground`}>
        {isText ? value : Number(value).toLocaleString()}
      </p>
    </div>
  );
}

function PieCard({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-display font-semibold text-foreground mb-3">{title}</h3>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No data</p>
      ) : (
        <>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" stroke="none">
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {data.map((d, i) => (
              <div key={d.name} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-foreground">{d.name}</span>
                </div>
                <span className="text-muted-foreground">{total ? Math.round((d.value / total) * 100) : 0}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
