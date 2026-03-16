'use client'
import { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
const supabase = typeof window !== 'undefined' ? getSupabaseBrowserClient() : null as any;
import { format } from "date-fns";
import { Mail, MailOpen, Trash2, ExternalLink, Search, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  source_page: string;
  is_read: boolean;
  created_at: string;
}

export function MessagesViewer() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setMessages(data as ContactMessage[]);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (msg: ContactMessage) => {
    const newStatus = !msg.is_read;
    await supabase.from("contact_messages").update({ is_read: newStatus }).eq("id", msg.id);
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: newStatus } : m)));
    if (selected?.id === msg.id) setSelected({ ...msg, is_read: newStatus });
  };

  const deleteMessage = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
    toast({ title: "Message deleted" });
  };

  const markSelectedAsRead = async (msg: ContactMessage) => {
    if (!msg.is_read) {
      await supabase.from("contact_messages").update({ is_read: true }).eq("id", msg.id);
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m)));
    }
    setSelected({ ...msg, is_read: true });
  };

  const filtered = messages.filter((m) => {
    if (filterRead === "unread" && m.is_read) return false;
    if (filterRead === "read" && !m.is_read) return false;
    if (search) {
      const q = search.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q);
    }
    return true;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* List */}
      <div className="w-96 flex-shrink-0 flex flex-col border border-border rounded-xl bg-card overflow-hidden">
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm">
              Messages {unreadCount > 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">{unreadCount}</span>}
            </h3>
            <Button variant="ghost" size="icon" onClick={fetchMessages} className="h-8 w-8">
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
          </div>
          <div className="flex gap-1">
            {(["all", "unread", "read"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterRead(f)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                  filterRead === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-12">No messages found</p>
          ) : (
            filtered.map((msg) => (
              <button
                key={msg.id}
                onClick={() => markSelectedAsRead(msg)}
                className={`w-full text-left p-4 border-b border-border/50 transition-colors hover:bg-accent/50 ${
                  selected?.id === msg.id ? "bg-accent" : ""
                } ${!msg.is_read ? "bg-primary/5" : ""}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {!msg.is_read ? (
                    <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  ) : (
                    <MailOpen className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={`text-sm truncate ${!msg.is_read ? "font-semibold" : ""}`}>{msg.name}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground flex-shrink-0">
                    {format(new Date(msg.created_at), "MMM d")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate pl-5.5">{msg.subject || "(No subject)"}</p>
                <p className="text-xs text-muted-foreground/60 truncate mt-0.5 pl-5.5">{msg.message.slice(0, 80)}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 border border-border rounded-xl bg-card overflow-hidden flex flex-col">
        {selected ? (
          <>
            <div className="p-6 border-b border-border flex items-start justify-between">
              <div>
                <h2 className="text-lg font-display font-bold">{selected.subject || "(No subject)"}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  From <span className="text-foreground font-medium">{selected.name}</span> &lt;{selected.email}&gt;
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{format(new Date(selected.created_at), "PPpp")}</span>
                  <span className="px-2 py-0.5 rounded bg-accent text-accent-foreground">{selected.source_page}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => toggleRead(selected)} title={selected.is_read ? "Mark unread" : "Mark read"}>
                  {selected.is_read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => window.open(`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`, "_blank")} title="Reply">
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMessage(selected.id)} className="text-destructive hover:text-destructive" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{selected.message}</p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a message to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
