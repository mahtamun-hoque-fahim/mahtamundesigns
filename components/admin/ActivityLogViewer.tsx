'use client'
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
const supabase = typeof window !== 'undefined' ? getSupabaseBrowserClient() : null as any;
import { RefreshCw, Clock } from "lucide-react";

interface LogEntry {
  id: string;
  action: string;
  page: string;
  details: string;
  created_at: string;
}

export function ActivityLogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await (supabase as any)
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      setLogs(data || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <RefreshCw className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-display font-bold text-foreground mb-6">Activity Log</h2>

      {logs.length === 0 ? (
        <div className="text-center py-16">
          <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No activity logged yet</p>
          <p className="text-muted-foreground/60 text-xs mt-1">Actions will appear here as you edit content</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => {
            const date = new Date(log.created_at);
            return (
              <div key={log.id} className="flex items-start gap-4 p-4 bg-card border border-border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium">{log.action}</p>
                  {log.page && <p className="text-xs text-muted-foreground mt-0.5">Page: {log.page}</p>}
                  {log.details && <p className="text-xs text-muted-foreground/70 mt-0.5">{log.details}</p>}
                </div>
                <div className="text-xs text-muted-foreground flex-shrink-0">
                  <p>{date.toLocaleDateString()}</p>
                  <p className="text-right">{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
