import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

interface ProjectGroup {
  id: string;
  company_id: string;
  title: string;
  sort_order: number;
}

interface ProjectImage {
  id: string;
  company_id: string;
  group_id: string | null;
  image_url: string;
  sort_order: number;
}

interface Props {
  companyId: string;
  layoutMode: "grouped" | "simple";
}

export function ProjectGroupsEditor({ companyId, layoutMode }: Props) {
  const [groups, setGroups] = useState<ProjectGroup[]>([]);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: g }, { data: img }] = await Promise.all([
      supabase.from("project_groups").select("*").eq("company_id", companyId).order("sort_order"),
      supabase.from("project_images").select("*").eq("company_id", companyId).order("sort_order"),
    ]);
    setGroups(g || []);
    setImages(img || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [companyId]);

  const addGroup = async () => {
    await supabase.from("project_groups").insert({
      company_id: companyId,
      title: "New Project",
      sort_order: groups.length,
    });
    toast({ title: "Group added" });
    await fetchAll();
  };

  const updateGroup = async (id: string, title: string) => {
    await supabase.from("project_groups").update({ title }).eq("id", id);
    toast({ title: "Group updated" });
    await fetchAll();
  };

  const deleteGroup = async (id: string) => {
    if (!confirm("Delete this project group and all its images?")) return;
    await supabase.from("project_groups").delete().eq("id", id);
    toast({ title: "Group deleted" });
    await fetchAll();
  };

  const moveGroup = async (id: string, direction: "up" | "down") => {
    const idx = groups.findIndex(g => g.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= groups.length) return;
    await Promise.all([
      supabase.from("project_groups").update({ sort_order: swapIdx }).eq("id", groups[idx].id),
      supabase.from("project_groups").update({ sort_order: idx }).eq("id", groups[swapIdx].id),
    ]);
    await fetchAll();
  };

  const addImage = async (groupId: string | null, url: string) => {
    const groupImages = images.filter(i => i.group_id === groupId);
    await supabase.from("project_images").insert({
      company_id: companyId,
      group_id: groupId,
      image_url: url,
      sort_order: groupImages.length,
    });
    toast({ title: "Image added" });
    await fetchAll();
  };

  const removeImage = async (id: string) => {
    await supabase.from("project_images").delete().eq("id", id);
    await fetchAll();
  };

  if (loading) return <div className="flex justify-center py-4"><RefreshCw className="w-4 h-4 animate-spin text-primary" /></div>;

  const ungroupedImages = images.filter(i => !i.group_id);

  if (layoutMode === "simple") {
    return (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground font-display font-semibold uppercase tracking-wider">Simple Image Gallery</p>
        <div className="flex gap-3 flex-wrap">
          {ungroupedImages.map(img => (
            <div key={img.id} className="relative">
              <div className="w-24 h-20 rounded-lg overflow-hidden border border-border">
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              </div>
              <button onClick={() => removeImage(img.id)} className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">×</button>
            </div>
          ))}
          <ImageUpload currentUrl={null} onUpload={url => addImage(null, url)} folder={`companies/${companyId}/designs`} className="w-24 h-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-display font-semibold uppercase tracking-wider">Project Groups</p>
        <button onClick={addGroup} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-semibold">
          <Plus className="w-3 h-3" /> Add Group
        </button>
      </div>

      {groups.length === 0 && (
        <p className="text-sm text-muted-foreground italic">No project groups yet. Add one to get started.</p>
      )}

      {groups.map((group, idx) => {
        const groupImages = images.filter(i => i.group_id === group.id);
        const isExpanded = expandedGroup === group.id;

        return (
          <div key={group.id} className="border border-border rounded-lg bg-background overflow-hidden">
            <div className="flex items-center gap-2 p-3 cursor-pointer hover:bg-muted/30" onClick={() => setExpandedGroup(isExpanded ? null : group.id)}>
              <GripVertical className="w-4 h-4 text-muted-foreground/50" />
              <input
                value={group.title}
                onChange={e => {
                  setGroups(prev => prev.map(g => g.id === group.id ? { ...g, title: e.target.value } : g));
                }}
                onBlur={e => updateGroup(group.id, e.target.value)}
                onClick={e => e.stopPropagation()}
                className="flex-1 text-sm font-semibold bg-transparent border-none outline-none focus:ring-0"
                placeholder="Project title"
              />
              <span className="text-xs text-muted-foreground">{groupImages.length} images</span>
              <div className="flex gap-1">
                <button onClick={e => { e.stopPropagation(); moveGroup(group.id, "up"); }} disabled={idx === 0} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronUp className="w-3 h-3" /></button>
                <button onClick={e => { e.stopPropagation(); moveGroup(group.id, "down"); }} disabled={idx === groups.length - 1} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronDown className="w-3 h-3" /></button>
                <button onClick={e => { e.stopPropagation(); deleteGroup(group.id); }} className="p-1 text-destructive hover:text-destructive/80"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-border p-4">
                <div className="flex gap-3 flex-wrap">
                  {groupImages.map(img => (
                    <div key={img.id} className="relative">
                      <div className="w-24 h-20 rounded-lg overflow-hidden border border-border">
                        <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <button onClick={() => removeImage(img.id)} className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">×</button>
                    </div>
                  ))}
                  <ImageUpload currentUrl={null} onUpload={url => addImage(group.id, url)} folder={`companies/${companyId}/designs`} className="w-24 h-20" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
