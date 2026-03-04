import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image, RefreshCw } from "lucide-react";

interface MediaAsset {
  id: string;
  slot_key: string;
  label: string;
  category: string;
  file_path: string | null;
  public_url: string | null;
}

const CATEGORIES = ["all", "hero", "portfolio", "reviews", "logos"];

export function MediaManager() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
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
    toast({ title: "Success", description: `${asset.label} updated` });
    await fetchAssets();
    setUploading(null);
  };

  const filtered = filter === "all" ? assets : assets.filter(a => a.category === filter);

  if (loading) return <div className="flex justify-center py-12"><RefreshCw className="w-5 h-5 animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-full text-xs font-display font-semibold uppercase tracking-wider transition-colors ${filter === cat ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(asset => (
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
