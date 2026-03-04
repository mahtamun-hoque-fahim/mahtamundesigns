import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";
import { Plus, Trash2, Save, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

interface DbCompany {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  short_description: string;
  full_description: string;
  role: string;
  contributions: string[];
  impact: string;
  logo_url: string | null;
  cover_url: string | null;
  design_urls: string[];
  featured: boolean;
  featured_image_url: string | null;
  category: string;
  sort_order: number;
}

export function CompaniesEditor() {
  const [companies, setCompanies] = useState<DbCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchAll = async () => {
    const { data } = await (supabase as any).from("companies").select("*").order("sort_order");
    setCompanies(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleUpdate = async (id: string, updates: Partial<DbCompany>) => {
    setSaving(true);
    const { design_urls, ...rest } = updates as any;
    const cleanUpdates = { ...rest };
    if (design_urls) cleanUpdates.design_urls = design_urls.filter(Boolean);
    await (supabase as any).from("companies").update(cleanUpdates).eq("id", id);
    toast({ title: "Company updated" });
    await fetchAll();
    setSaving(false);
  };

  const handleAdd = async () => {
    const slug = `company-${Date.now()}`;
    await (supabase as any).from("companies").insert({ slug, name: "New Company", sort_order: companies.length + 1 });
    toast({ title: "Company added" });
    await fetchAll();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this company?")) return;
    await (supabase as any).from("companies").delete().eq("id", id);
    toast({ title: "Deleted" });
    await fetchAll();
  };

  if (loading) return <div className="flex justify-center py-12"><RefreshCw className="w-5 h-5 animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-display font-bold">{companies.length} Companies</h3>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Company
        </button>
      </div>
      <div className="space-y-4">
        {companies.map(c => (
          <CompanyCard key={c.id} company={c} expanded={expandedId === c.id} onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)} onUpdate={u => handleUpdate(c.id, u)} onDelete={() => handleDelete(c.id)} saving={saving} />
        ))}
      </div>
    </div>
  );
}

function CompanyCard({ company: c, expanded, onToggle, onUpdate, onDelete, saving }: {
  company: DbCompany; expanded: boolean; onToggle: () => void; onUpdate: (u: Partial<DbCompany>) => void; onDelete: () => void; saving: boolean;
}) {
  const [form, setForm] = useState(c);
  useEffect(() => { setForm(c); }, [c]);
  const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/30 transition-colors" onClick={onToggle}>
        <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
          {c.logo_url && <img src={c.logo_url} alt="" className="w-full h-full object-contain p-1 brightness-0 invert" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-sm truncate">{c.name}</p>
          <p className="text-xs text-muted-foreground">{c.category} · {c.slug}</p>
        </div>
        {c.featured && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Featured</span>}
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {expanded && (
        <div className="border-t border-border p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name" value={form.name} onChange={v => set("name", v)} />
            <Field label="Slug" value={form.slug} onChange={v => set("slug", v)} />
            <Field label="Tagline" value={form.tagline} onChange={v => set("tagline", v)} />
            <Field label="Category" value={form.category} onChange={v => set("category", v)} />
            <Field label="Role" value={form.role} onChange={v => set("role", v)} />
            <Field label="Sort Order" value={String(form.sort_order)} onChange={v => set("sort_order", parseInt(v) || 0)} type="number" />
          </div>
          <Field label="Short Description" value={form.short_description} onChange={v => set("short_description", v)} multiline />
          <Field label="Full Description" value={form.full_description} onChange={v => set("full_description", v)} multiline />
          <Field label="Impact" value={form.impact} onChange={v => set("impact", v)} multiline />
          <Field label="Contributions (comma-separated)" value={(form.contributions || []).join(", ")} onChange={v => set("contributions", v.split(",").map(s => s.trim()).filter(Boolean))} />

          <div className="flex items-center gap-3">
            <label className="text-xs text-muted-foreground">Featured</label>
            <input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} className="accent-primary" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><p className="text-xs text-muted-foreground mb-2">Logo</p><ImageUpload currentUrl={form.logo_url} onUpload={url => set("logo_url", url)} folder="companies/logos" className="h-20" /></div>
            <div><p className="text-xs text-muted-foreground mb-2">Cover</p><ImageUpload currentUrl={form.cover_url} onUpload={url => set("cover_url", url)} folder="companies/covers" className="h-20" /></div>
            <div><p className="text-xs text-muted-foreground mb-2">Featured Image</p><ImageUpload currentUrl={form.featured_image_url} onUpload={url => set("featured_image_url", url)} folder="companies/featured" className="h-20" /></div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Design Images</p>
            <div className="flex gap-3 flex-wrap">
              {(form.design_urls || []).map((url, i) => (
                <div key={i} className="relative">
                  <ImageUpload currentUrl={url || null} onUpload={newUrl => { const u = [...form.design_urls]; u[i] = newUrl; set("design_urls", u); }} folder="companies/designs" className="w-24 h-20" />
                  <button onClick={() => set("design_urls", form.design_urls.filter((_, j) => j !== i))} className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">×</button>
                </div>
              ))}
              <button onClick={() => set("design_urls", [...(form.design_urls || []), ""])} className="w-24 h-20 border border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
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

function Field({ label, value, onChange, multiline, type = "text" }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; type?: string; }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:outline-none min-h-[80px] resize-y" />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:outline-none" />
      )}
    </div>
  );
}
