import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Plus } from "lucide-react";

interface ContentItem {
  id: string;
  page: string;
  section: string;
  content_key: string;
  content_value: string;
}

export function ContentEditor() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [newItem, setNewItem] = useState({ page: "", section: "", content_key: "", content_value: "" });
  const [showAdd, setShowAdd] = useState(false);
  const { toast } = useToast();

  const fetchAll = async () => {
    const { data } = await (supabase as any).from("site_content").select("*").order("page").order("section").order("content_key");
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (id: string, value: string) => {
    setEdited(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const entries = Object.entries(edited);
    for (const [id, value] of entries) {
      await (supabase as any).from("site_content").update({ content_value: value }).eq("id", id);
    }
    setEdited({});
    toast({ title: "Saved", description: `${entries.length} field(s) updated` });
    await fetchAll();
    setSaving(false);
  };

  const handleAdd = async () => {
    if (!newItem.page || !newItem.section || !newItem.content_key) return;
    await (supabase as any).from("site_content").insert(newItem);
    toast({ title: "Added" });
    setNewItem({ page: "", section: "", content_key: "", content_value: "" });
    setShowAdd(false);
    await fetchAll();
  };

  if (loading) return <div className="flex justify-center py-12"><RefreshCw className="w-5 h-5 animate-spin text-primary" /></div>;

  const grouped: Record<string, Record<string, ContentItem[]>> = {};
  items.forEach(item => {
    if (!grouped[item.page]) grouped[item.page] = {};
    if (!grouped[item.page][item.section]) grouped[item.page][item.section] = [];
    grouped[item.page][item.section].push(item);
  });

  const hasChanges = Object.keys(edited).length > 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-display font-bold">{items.length} Content Fields</h3>
        <div className="flex gap-2">
          {hasChanges && (
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 disabled:opacity-50">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save ({Object.keys(edited).length})
            </button>
          )}
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm font-semibold hover:bg-muted/50">
            <Plus className="w-4 h-4" /> Add Field
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="border border-primary/30 rounded-lg p-4 mb-6 bg-primary/5 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Page (e.g. home)" value={newItem.page} onChange={e => setNewItem(p => ({ ...p, page: e.target.value }))} className="px-3 py-2 text-sm bg-background border border-border rounded-md" />
            <input placeholder="Section (e.g. hero)" value={newItem.section} onChange={e => setNewItem(p => ({ ...p, section: e.target.value }))} className="px-3 py-2 text-sm bg-background border border-border rounded-md" />
            <input placeholder="Key (e.g. title)" value={newItem.content_key} onChange={e => setNewItem(p => ({ ...p, content_key: e.target.value }))} className="px-3 py-2 text-sm bg-background border border-border rounded-md" />
          </div>
          <textarea placeholder="Value" value={newItem.content_value} onChange={e => setNewItem(p => ({ ...p, content_value: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md min-h-[60px]" />
          <button onClick={handleAdd} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold">Add</button>
        </div>
      )}

      {Object.entries(grouped).map(([page, sections]) => (
        <div key={page} className="mb-8">
          <h3 className="text-lg font-display font-bold text-foreground capitalize mb-4 border-b border-border pb-2">{page}</h3>
          {Object.entries(sections).map(([section, fields]) => (
            <div key={section} className="mb-6 ml-4">
              <h4 className="text-sm font-display font-semibold text-primary uppercase tracking-wider mb-3">{section}</h4>
              <div className="space-y-3">
                {fields.map(field => {
                  const currentVal = edited[field.id] !== undefined ? edited[field.id] : field.content_value;
                  const isLong = field.content_value.length > 80;
                  return (
                    <div key={field.id} className="grid grid-cols-[160px_1fr] gap-3 items-start">
                      <label className="text-xs text-muted-foreground font-mono pt-2 truncate" title={field.content_key}>{field.content_key}</label>
                      {isLong ? (
                        <textarea value={currentVal} onChange={e => handleChange(field.id, e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:outline-none min-h-[80px] resize-y" />
                      ) : (
                        <input value={currentVal} onChange={e => handleChange(field.id, e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:outline-none" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
