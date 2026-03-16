'use client'
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
const supabase = typeof window !== 'undefined' ? getSupabaseBrowserClient() : null as any;
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload } from "./ImageUpload";
import { Plus, Trash2, Save, RefreshCw, ChevronDown, ChevronUp, Star } from "lucide-react";

interface DbReview {
  id: string;
  client_name: string;
  role: string;
  company: string;
  avatar_url: string | null;
  expanded_image_url: string | null;
  review_text: string;
  short_text: string;
  rating: number;
  sort_order: number;
}

export function ReviewsEditor() {
  const [reviews, setReviews] = useState<DbReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchAll = async () => {
    const { data } = await (supabase as any).from("reviews").select("*").order("sort_order");
    setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleUpdate = async (id: string, updates: Partial<DbReview>) => {
    setSaving(true);
    await (supabase as any).from("reviews").update(updates).eq("id", id);
    toast({ title: "Review updated" });
    await fetchAll();
    setSaving(false);
  };

  const handleAdd = async () => {
    await (supabase as any).from("reviews").insert({ client_name: "New Client", role: "Role", company: "Company", review_text: "Review text here.", short_text: "Short text.", rating: 5, sort_order: reviews.length + 1 });
    toast({ title: "Review added" });
    await fetchAll();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await (supabase as any).from("reviews").delete().eq("id", id);
    toast({ title: "Deleted" });
    await fetchAll();
  };

  if (loading) return <div className="flex justify-center py-12"><RefreshCw className="w-5 h-5 animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-display font-bold">{reviews.length} Reviews</h3>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>
      <div className="space-y-4">
        {reviews.map(r => (
          <ReviewCard key={r.id} review={r} expanded={expandedId === r.id} onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)} onUpdate={u => handleUpdate(r.id, u)} onDelete={() => handleDelete(r.id)} saving={saving} />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review: r, expanded, onToggle, onUpdate, onDelete, saving }: {
  review: DbReview; expanded: boolean; onToggle: () => void; onUpdate: (u: Partial<DbReview>) => void; onDelete: () => void; saving: boolean;
}) {
  const [form, setForm] = useState(r);
  useEffect(() => { setForm(r); }, [r]);
  const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/30 transition-colors" onClick={onToggle}>
        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
          {r.avatar_url && <img src={r.avatar_url} alt="" className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-sm truncate">{r.client_name}</p>
          <p className="text-xs text-muted-foreground">{r.role}, {r.company}</p>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < r.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
          ))}
        </div>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {expanded && (
        <div className="border-t border-border p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="text-xs text-muted-foreground mb-1 block">Client Name</label><input value={form.client_name} onChange={e => set("client_name", e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:outline-none" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Role</label><input value={form.role} onChange={e => set("role", e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:outline-none" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Company</label><input value={form.company} onChange={e => set("company", e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:outline-none" /></div>
          </div>

          <div><label className="text-xs text-muted-foreground mb-1 block">Full Review</label><textarea value={form.review_text} onChange={e => set("review_text", e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:outline-none min-h-[100px] resize-y" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Short Text</label><input value={form.short_text} onChange={e => set("short_text", e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:outline-none" /></div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Rating (1-5)</label>
              <input type="number" min={1} max={5} value={form.rating} onChange={e => set("rating", parseInt(e.target.value) || 5)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => set("sort_order", parseInt(e.target.value) || 0)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-muted-foreground mb-2">Avatar</p><ImageUpload currentUrl={form.avatar_url} onUpload={url => set("avatar_url", url)} folder="reviews/avatars" className="h-24" /></div>
            <div><p className="text-xs text-muted-foreground mb-2">Expanded Image</p><ImageUpload currentUrl={form.expanded_image_url} onUpload={url => set("expanded_image_url", url)} folder="reviews/expanded" className="h-24" /></div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button onClick={() => onUpdate(form)} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 disabled:opacity-50">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </button>
            <button onClick={onDelete} className="flex items-center gap-2 px-4 py-2 border border-destructive text-destructive rounded-md text-sm font-semibold hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
