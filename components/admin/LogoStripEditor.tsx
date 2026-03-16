'use client'
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
const supabase = typeof window !== 'undefined' ? getSupabaseBrowserClient() : null as any;
import { useToast } from "@/components/ui/use-toast";
import { invalidateLogoStripCache } from "@/components/admin/useLogoStripAdmin";
import { Upload, RefreshCw, Plus, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";

interface LogoItem {
  id: string;
  name: string;
  logo_url: string;
  sort_order: number;
  active: boolean;
}

export function LogoStripEditor() {
  const [items, setItems] = useState<LogoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase
      .from("logo_strip_items")
      .select("*")
      .order("sort_order");
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleUpload = async (item: LogoItem, file: File) => {
    setUploading(item.id);
    const ext = file.name.split(".").pop();
    const filePath = `logos/${item.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("site-media")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(null);
      return;
    }

    const { data: urlData } = supabase.storage.from("site-media").getPublicUrl(filePath);
    await supabase
      .from("logo_strip_items")
      .update({ logo_url: urlData.publicUrl })
      .eq("id", item.id);

    invalidateLogoStripCache();
    toast({ title: "Logo updated", description: `${item.name} logo replaced` });
    await fetchItems();
    setUploading(null);
  };

  const handleNameChange = async (item: LogoItem, name: string) => {
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, name } : i));
  };

  const handleNameBlur = async (item: LogoItem) => {
    setSaving(item.id);
    await supabase.from("logo_strip_items").update({ name: item.name }).eq("id", item.id);
    invalidateLogoStripCache();
    setSaving(null);
  };

  const handleToggleActive = async (item: LogoItem) => {
    await supabase.from("logo_strip_items").update({ active: !item.active }).eq("id", item.id);
    invalidateLogoStripCache();
    await fetchItems();
  };

  const handleDelete = async (item: LogoItem) => {
    if (!confirm(`Remove "${item.name}" from the logo strip?`)) return;
    if (item.logo_url) {
      const path = item.logo_url.split("/site-media/")[1];
      if (path) await supabase.storage.from("site-media").remove([path]);
    }
    await supabase.from("logo_strip_items").delete().eq("id", item.id);
    invalidateLogoStripCache();
    await fetchItems();
    toast({ title: "Removed", description: `${item.name} removed from logo strip` });
  };

  const handleAdd = async () => {
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order)) : 0;
    const { data } = await supabase
      .from("logo_strip_items")
      .insert({ name: `Brand ${items.length + 1}`, logo_url: "", sort_order: maxOrder + 1, active: true })
      .select()
      .single();
    if (data) {
      await fetchItems();
      toast({ title: "Slot added", description: "Upload a logo to fill it" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <RefreshCw className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-muted-foreground mt-1">
            These logos appear in the scrolling carousel on the Homepage and Contact page.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Logo
        </button>
      </div>

      {/* Logo grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`border rounded-xl bg-card overflow-hidden transition-opacity ${!item.active ? "opacity-50" : ""}`}
          >
            {/* Logo upload area */}
            <div className="aspect-video bg-muted relative overflow-hidden group">
              {item.logo_url ? (
                <img
                  src={item.logo_url}
                  alt={item.name}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-2">
                  <Upload className="w-6 h-6" />
                  <span className="text-xs">No logo yet</span>
                </div>
              )}

              {/* Upload overlay */}
              <label className={`absolute inset-0 bg-background/80 flex flex-col items-center justify-center cursor-pointer transition-opacity ${uploading === item.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                {uploading === item.id
                  ? <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                  : <>
                      <Upload className="w-5 h-5 text-primary mb-1" />
                      <span className="text-xs text-muted-foreground">
                        {item.logo_url ? "Replace" : "Upload"}
                      </span>
                    </>
                }
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(item, f); }}
                  disabled={uploading === item.id}
                />
              </label>
            </div>

            {/* Info */}
            <div className="p-3">
              <div className="flex items-center gap-2">
                <GripVertical className="w-3.5 h-3.5 text-muted-foreground/30 flex-shrink-0" />
                <input
                  type="text"
                  value={item.name}
                  onChange={e => handleNameChange(item, e.target.value)}
                  onBlur={() => handleNameBlur(item)}
                  className="flex-1 text-sm font-semibold bg-transparent border-none outline-none focus:ring-1 focus:ring-primary/30 rounded px-1 text-foreground"
                  placeholder="Brand name"
                />
                {saving === item.id && <RefreshCw className="w-3 h-3 animate-spin text-muted-foreground" />}
              </div>

              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={() => handleToggleActive(item)}
                  className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors ${item.active ? "text-primary" : "text-muted-foreground"}`}
                >
                  {item.active
                    ? <><Eye className="w-3 h-3" /> Visible</>
                    : <><EyeOff className="w-3 h-3" /> Hidden</>
                  }
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-[10px] text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add new slot card */}
        <button
          onClick={handleAdd}
          className="border border-dashed border-border rounded-xl aspect-video flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
        >
          <Plus className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Add Logo</span>
        </button>
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">No logos yet. Click "Add Logo" to get started.</p>
        </div>
      )}
    </div>
  );
}
