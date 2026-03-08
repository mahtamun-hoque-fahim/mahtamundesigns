import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Upload, Search, Filter, Tag, FolderOpen, Trash2, RefreshCw,
  CheckSquare, Square, X, ChevronDown
} from "lucide-react";

interface MediaItem {
  id: string;
  file_path: string;
  public_url: string;
  filename: string;
  company_id: string | null;
  group_id: string | null;
  category: string;
  assigned: boolean;
  created_at: string;
  tags?: string[];
}

interface CompanyOption {
  id: string;
  name: string;
}

interface GroupOption {
  id: string;
  title: string;
  company_id: string;
}

export function MediaStoreManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [groups, setGroups] = useState<GroupOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [filterCompany, setFilterCompany] = useState<string>("all");
  const [filterAssigned, setFilterAssigned] = useState<string>("all");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [assignCompany, setAssignCompany] = useState("");
  const [assignGroup, setAssignGroup] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: media }, { data: comp }, { data: grps }, { data: tags }] = await Promise.all([
      supabase.from("media_store").select("*").order("created_at", { ascending: false }),
      supabase.from("companies").select("id, name").order("name"),
      supabase.from("project_groups").select("id, title, company_id").order("title"),
      supabase.from("media_tags").select("*"),
    ]);

    const tagMap: Record<string, string[]> = {};
    (tags || []).forEach((t: any) => {
      if (!tagMap[t.media_id]) tagMap[t.media_id] = [];
      tagMap[t.media_id].push(t.tag);
    });

    setItems((media || []).map((m: any) => ({ ...m, tags: tagMap[m.id] || [] })));
    setCompanies(comp || []);
    setGroups(grps || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleBulkUpload = async (files: FileList) => {
    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const ext = file.name.split(".").pop();
      const filePath = `media-store/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("site-media").upload(filePath, file, { upsert: true });
      if (error) return null;
      const { data } = supabase.storage.from("site-media").getPublicUrl(filePath);
      return {
        file_path: filePath,
        public_url: data.publicUrl,
        filename: file.name,
      };
    });

    const results = (await Promise.all(uploadPromises)).filter(Boolean);
    if (results.length > 0) {
      await supabase.from("media_store").insert(results);
      toast({ title: `${results.length} file(s) uploaded` });
    }
    await fetchAll();
    setUploading(false);
  };

  const handleDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} item(s)?`)) return;
    const ids = Array.from(selected);
    // Delete from storage
    const toDelete = items.filter(i => ids.includes(i.id));
    const paths = toDelete.map(i => i.file_path).filter(Boolean);
    if (paths.length) await supabase.storage.from("site-media").remove(paths);
    await supabase.from("media_store").delete().in("id", ids);
    setSelected(new Set());
    toast({ title: "Deleted" });
    await fetchAll();
  };

  const handleAssign = async () => {
    if (selected.size === 0 || !assignCompany) return;
    const ids = Array.from(selected);
    const selectedItems = items.filter(i => ids.includes(i.id));

    // Update media_store records
    await supabase.from("media_store").update({
      company_id: assignCompany,
      group_id: assignGroup || null,
      assigned: true,
    }).in("id", ids);

    // Also create project_images for them
    const inserts = selectedItems.map((item, idx) => ({
      company_id: assignCompany,
      group_id: assignGroup || null,
      image_url: item.public_url,
      sort_order: idx,
    }));
    await supabase.from("project_images").insert(inserts);

    toast({ title: `${ids.length} image(s) assigned` });
    setShowAssignModal(false);
    setSelected(new Set());
    setAssignCompany("");
    setAssignGroup("");
    await fetchAll();
  };

  const handleAddTags = async () => {
    if (selected.size === 0 || !tagInput.trim()) return;
    const ids = Array.from(selected);
    const tags = tagInput.split(",").map(t => t.trim()).filter(Boolean);
    const inserts = ids.flatMap(mediaId => tags.map(tag => ({ media_id: mediaId, tag })));
    await supabase.from("media_tags").insert(inserts);
    toast({ title: `Tags added to ${ids.length} item(s)` });
    setShowTagModal(false);
    setTagInput("");
    setSelected(new Set());
    await fetchAll();
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(i => i.id)));
  };

  const filtered = items.filter(item => {
    if (search && !item.filename.toLowerCase().includes(search.toLowerCase()) && !(item.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()))) return false;
    if (filterCompany !== "all" && item.company_id !== filterCompany) return false;
    if (filterAssigned === "unassigned" && item.assigned) return false;
    if (filterAssigned === "assigned" && !item.assigned) return false;
    return true;
  });

  const companyGroups = groups.filter(g => g.company_id === assignCompany);

  if (loading) return <div className="flex justify-center py-12"><RefreshCw className="w-5 h-5 animate-spin text-primary" /></div>;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50">
          {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading..." : "Bulk Upload"}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && handleBulkUpload(e.target.files)} />

        {selected.size > 0 && (
          <>
            <button onClick={() => setShowAssignModal(true)} className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-semibold hover:bg-accent/80">
              <FolderOpen className="w-4 h-4" /> Assign ({selected.size})
            </button>
            <button onClick={() => setShowTagModal(true)} className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-semibold hover:bg-accent/80">
              <Tag className="w-4 h-4" /> Tag ({selected.size})
            </button>
            <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 border border-destructive text-destructive rounded-lg text-sm font-semibold hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" /> Delete ({selected.size})
            </button>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by filename or tag..." className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none" />
        </div>
        <div className="relative">
          <select value={filterCompany} onChange={e => setFilterCompany(e.target.value)} className="appearance-none pl-3 pr-8 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none cursor-pointer">
            <option value="all">All Companies</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
        <div className="relative">
          <select value={filterAssigned} onChange={e => setFilterAssigned(e.target.value)} className="appearance-none pl-3 pr-8 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none cursor-pointer">
            <option value="all">All Status</option>
            <option value="unassigned">Uncategorized</option>
            <option value="assigned">Assigned</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-6 text-xs text-muted-foreground">
        <span>{items.length} total</span>
        <span>{items.filter(i => !i.assigned).length} uncategorized</span>
        <span>{selected.size} selected</span>
      </div>

      {/* Select All */}
      <button onClick={selectAll} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-4">
        {selected.size === filtered.length && filtered.length > 0 ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
        {selected.size === filtered.length && filtered.length > 0 ? "Deselect All" : "Select All"}
      </button>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filtered.map(item => {
          const isSelected = selected.has(item.id);
          const companyName = companies.find(c => c.id === item.company_id)?.name;
          return (
            <div
              key={item.id}
              onClick={() => toggleSelect(item.id)}
              className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/30"
              }`}
            >
              <div className="aspect-square bg-muted">
                <img src={item.public_url} alt={item.filename} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-2 bg-card">
                <p className="text-xs font-medium truncate">{item.filename}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.assigned && companyName && (
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{companyName}</span>
                  )}
                  {!item.assigned && (
                    <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">Uncategorized</span>
                  )}
                  {(item.tags || []).slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              {/* Selection indicator */}
              <div className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                isSelected ? "bg-primary border-primary" : "border-muted-foreground/40 bg-background/80"
              }`}>
                {isSelected && <span className="text-primary-foreground text-xs">✓</span>}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Upload className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No media found. Upload some images to get started.</p>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAssignModal(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-bold">Assign {selected.size} Image(s)</h3>
              <button onClick={() => setShowAssignModal(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Company *</label>
                <select value={assignCompany} onChange={e => { setAssignCompany(e.target.value); setAssignGroup(""); }} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none">
                  <option value="">Select company...</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {assignCompany && companyGroups.length > 0 && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Project Group (optional)</label>
                  <select value={assignGroup} onChange={e => setAssignGroup(e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none">
                    <option value="">No group (simple gallery)</option>
                    {companyGroups.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                  </select>
                </div>
              )}
              <button onClick={handleAssign} disabled={!assignCompany} className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50">
                Assign Images
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowTagModal(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-bold">Tag {selected.size} Image(s)</h3>
              <button onClick={() => setShowTagModal(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Tags (comma-separated)</label>
                <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="e.g. Instagram, Social Media, Campaign" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none" />
              </div>
              <button onClick={handleAddTags} disabled={!tagInput.trim()} className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50">
                Add Tags
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
