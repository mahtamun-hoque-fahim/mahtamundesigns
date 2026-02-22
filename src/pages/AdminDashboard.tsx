import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Upload, Image, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaAsset {
  id: string;
  slot_key: string;
  label: string;
  category: string;
  file_path: string | null;
  public_url: string | null;
  updated_at: string;
}

const CATEGORIES = ["all", "hero", "portfolio", "reviews", "logos"];

const AdminDashboard = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchAssets();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin/login");
    }
  };

  const fetchAssets = async () => {
    const { data, error } = await supabase
      .from("media_assets")
      .select("*")
      .order("category")
      .order("label");

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setAssets(data || []);
    }
    setLoading(false);
  };

  const handleUpload = async (asset: MediaAsset, file: File) => {
    setUploading(asset.id);

    const ext = file.name.split(".").pop();
    const filePath = `${asset.slot_key}.${ext}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("site-media")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(null);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("site-media")
      .getPublicUrl(filePath);

    // Update media_assets record
    const { error: updateError } = await supabase
      .from("media_assets")
      .update({
        file_path: filePath,
        public_url: urlData.publicUrl,
      })
      .eq("id", asset.id);

    if (updateError) {
      toast({ title: "Update failed", description: updateError.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `${asset.label} updated` });
      fetchAssets();
    }

    setUploading(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const filtered = filter === "all" ? assets : assets.filter((a) => a.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="font-display text-lg font-bold text-foreground">
            Media <span className="text-primary">Dashboard</span>
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-display font-semibold uppercase tracking-wider transition-colors ${
                filter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="group border border-border rounded-xl bg-card overflow-hidden"
            >
              {/* Preview */}
              <div className="aspect-video bg-muted relative overflow-hidden">
                {asset.public_url ? (
                  <img
                    src={asset.public_url}
                    alt={asset.label}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                )}

                {/* Upload Overlay */}
                <label
                  className={`absolute inset-0 bg-background/80 flex flex-col items-center justify-center cursor-pointer transition-opacity ${
                    uploading === asset.id
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {uploading === asset.id ? (
                    <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-primary mb-1" />
                      <span className="text-xs text-muted-foreground">Replace</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(asset, file);
                    }}
                    disabled={uploading === asset.id}
                  />
                </label>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-sm font-display font-semibold text-foreground truncate">
                  {asset.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {asset.category} · {asset.slot_key}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
