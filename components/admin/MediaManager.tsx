'use client'
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
const supabase = typeof window !== 'undefined' ? getSupabaseBrowserClient() : null as any;
import { useToast } from "@/components/ui/use-toast";
import { invalidateMediaCache } from "@/components/admin/useMediaUrlAdmin";
import { Upload, Image, RefreshCw, AlertTriangle, Globe, Eye } from "lucide-react";

interface MediaAsset {
  id: string;
  slot_key: string;
  label: string;
  category: string;
  file_path: string | null;
  public_url: string | null;
}

// Map slot_key prefixes/names to page and section info
function getUsageInfo(slotKey: string): { page: string; section: string } | null {
  if (slotKey.startsWith("hero-")) return { page: "Homepage", section: "Hero" };
  if (slotKey.startsWith("process-step-")) return { page: "Homepage", section: "How It Works" };
  if (slotKey.startsWith("selected-works-")) return { page: "Homepage", section: "Selected Works" };
  if (slotKey.startsWith("logo-")) return { page: "Homepage", section: "Logo Strip" };
  if (slotKey.startsWith("review-client-")) return { page: "Homepage / Reviews", section: "Reviews" };
  if (slotKey.includes("-cover") || slotKey.includes("-design") || slotKey.includes("-logo"))
    return { page: "Clients", section: "Portfolio" };
  return null;
}

const CATEGORIES = ["all", "hero", "portfolio", "reviews", "logos"];

export function MediaManager() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAssets = async () => {
    const { data } = await supabase.from("media_assets").select("*").order("category").order("label");
    setAssets(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAssets(); }, []);

  const handleUpload = async (asset: MediaAsset, file: File) => {
    setUploading(asset.id);
    const ext = file.name.split(".").pop();
    const filePath = `${asset.slot_key}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("site-media").upload(filePath, file, { upsert: true });
    if (uploadError) { toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" }); setUploading(null); return; }

    const { data: urlData } = supabase.storage.from("site-media").getPublicUrl(filePath);
    await supabase.from("media_assets").update({ file_path: filePath, public_url: urlData.publicUrl }).eq("id", asset.id);
    invalidateMediaCache();
    toast({ title: "Success", description: `${asset.label} updated` });
    await fetchAssets();
    setUploading(null);
  };

  const handleRemoveImage = async (asset: MediaAsset) => {
    const usage = getUsageInfo(asset.slot_key);
    if (usage && deleteConfirm !== asset.id) {
      setDeleteConfirm(asset.id);
      return;
    }

    // Reset to no image (keep the slot)
    if (asset.file_path) {
      await supabase.storage.from("site-media").remove([asset.file_path]);
    }
    await supabase.from("media_assets").update({ file_path: null, public_url: null }).eq("id", asset.id);
    invalidateMediaCache();
    setDeleteConfirm(null);
    toast({ title: "Image removed", description: `${asset.label} has been cleared` });
    await fetchAssets();
  };

  const filtered = filter === "all" ? assets : assets.filter(a => a.category === filter);

  if (loading) return <div className="flex justify-center py-12"><RefreshCw className="w-5 h-5 animate-spin text-primary" /></div>;

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-full text-xs font-display font-semibold uppercase tracking-wider transition-colors ${filter === cat ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Usage legend */}
      <div className="flex flex-wrap gap-3 mb-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary" /> Used on Homepage
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-foreground/60" /> Used on Clients Page
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-muted-foreground/40" /> Unused
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(asset => {
          const usage = getUsageInfo(asset.slot_key);
          const isConfirmingDelete = deleteConfirm === asset.id;

          return (
            <div key={asset.id} className="group border border-border rounded-xl bg-card overflow-hidden">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {asset.public_url ? (
                  <img src={asset.public_url} alt={asset.label} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Image className="w-8 h-8 text-muted-foreground/30" /></div>
                )}
                <label className={`absolute inset-0 bg-background/80 flex flex-col items-center justify-center cursor-pointer transition-opacity ${uploading === asset.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                  {uploading === asset.id ? <RefreshCw className="w-6 h-6 animate-spin text-primary" /> : <><Upload className="w-6 h-6 text-primary mb-1" /><span className="text-xs text-muted-foreground">Replace</span></>}
                  <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(asset, f); }} disabled={uploading === asset.id} />
                </label>
              </div>
              <div className="p-4">
                <p className="text-sm font-display font-semibold text-foreground truncate">{asset.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{asset.category} · {asset.slot_key}</p>

                {/* Usage indicator */}
                {usage && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px]">
                    <Globe className="w-3 h-3 text-primary" />
                    <span className="text-primary font-medium">Used in: {usage.page}</span>
                    <span className="text-muted-foreground">· {usage.section}</span>
                  </div>
                )}
                {!usage && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Eye className="w-3 h-3" />
                    <span>Unused media</span>
                  </div>
                )}

                {/* Remove / Delete confirmation */}
                {asset.public_url && (
                  <div className="mt-3">
                    {isConfirmingDelete ? (
                      <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                        <div className="flex items-start gap-2 mb-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" />
                          <p className="text-[10px] text-destructive leading-tight">
                            This media is currently used on the <strong>{usage?.page}</strong>.
                            Removing it may affect the layout.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleRemoveImage(asset)} className="flex-1 py-1 text-[10px] font-semibold bg-destructive text-destructive-foreground rounded hover:bg-destructive/90">
                            Yes, Remove
                          </button>
                          <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-1 text-[10px] font-semibold border border-border rounded hover:bg-muted">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => handleRemoveImage(asset)} className="text-[10px] text-muted-foreground hover:text-destructive transition-colors">
                        Remove image
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
