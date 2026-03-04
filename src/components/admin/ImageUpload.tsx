import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, RefreshCw } from "lucide-react";

interface Props {
  currentUrl: string | null;
  onUpload: (url: string) => void;
  folder?: string;
  className?: string;
}

export function ImageUpload({ currentUrl, onUpload, folder = "uploads", className = "" }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${folder}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("site-media").upload(filePath, file, { upsert: true });
    if (error) { setUploading(false); return; }

    const { data } = supabase.storage.from("site-media").getPublicUrl(filePath);
    onUpload(data.publicUrl);
    setUploading(false);
  };

  return (
    <label className={`group relative block cursor-pointer border border-dashed border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors ${className}`}>
      {currentUrl ? (
        <img src={currentUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="flex items-center justify-center h-full min-h-[80px] text-muted-foreground">
          <Upload className="w-5 h-5" />
        </div>
      )}
      <div className="absolute inset-0 bg-background/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {uploading ? <RefreshCw className="w-5 h-5 animate-spin text-primary" /> : <Upload className="w-5 h-5 text-primary" />}
      </div>
      <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} disabled={uploading} />
    </label>
  );
}
