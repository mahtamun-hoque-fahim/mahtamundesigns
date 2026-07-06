"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Upload, ExternalLink } from "lucide-react";
import { updateClient, deleteClient, addGalleryItem, deleteGalleryItem, updateGalleryItemLabel } from "@/lib/actions/clients";
import type { ClientData } from "@/lib/clients";

const DESIGN_LABELS = ["logo", "cover", "thumbnail", "poster", "banner", "story"] as const;

export function ClientEditForm({ client }: { client: ClientData }) {
  const router = useRouter();
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const fd = new FormData(e.currentTarget);
      await updateClient(client.slug, fd);
      setSuccess("Saved.");
    } catch {
      setError("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete ${client.name}? This also removes all gallery items. This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteClient(client.slug);
    } catch {
      setDeleting(false);
      setError("Failed to delete.");
    }
  }

  async function handleAddGalleryItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    try {
      const fd = new FormData(e.currentTarget);
      await addGalleryItem(client.id, fd);
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteItem(id: string) {
    if (!confirm("Remove this design?")) return;
    await deleteGalleryItem(id);
    router.refresh();
  }

  async function handleLabelChange(id: string, label: string) {
    await updateGalleryItemLabel(id, label);
    router.refresh();
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{client.name}</h1>
          <p className="mt-1 font-mono text-xs text-white/40">/clients/{client.slug}</p>
        </div>
        <a
          href={`/clients/${client.slug}`}
          target="_blank"
          className="flex items-center gap-2 rounded-none border border-white/15 px-4 py-2 font-mono text-xs text-white/50 transition-colors hover:border-white/30 hover:text-white"
        >
          <ExternalLink className="h-3.5 w-3.5" /> View Page
        </a>
      </div>

      {/* ── Main form ──────────────────────────────────── */}
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field name="name"        label="Company Name"   defaultValue={client.name}       required />
          <Field name="label"       label="Card Label"     defaultValue={client.label}      />
          <Field name="tagline"     label="Brand Tagline"  defaultValue={client.tagline}    />
          <Field name="accentColor" label="Accent Color"   defaultValue={client.accentColor}/>
          <Field name="timeline"    label="Timeline"       defaultValue={client.timeline}   />
          <Field name="type"        label="Engagement Type"defaultValue={client.type}       />
        </div>

        {/* Role — comma-separated */}
        <Field
          name="role"
          label="Role(s) — comma-separated"
          defaultValue={client.role.join(", ")}
          placeholder="Intern Designer, Junior Designer"
        />

        {/* Contributions — comma-separated */}
        <Field
          name="contributions"
          label="Contributions — comma-separated"
          defaultValue={client.contributions.join(", ")}
          placeholder="Logo Design, Brand Identity, Poster Design"
        />

        {/* About */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[11px] tracking-wider text-white/50">ABOUT</label>
          <textarea
            name="about"
            defaultValue={client.about}
            rows={5}
            className="rounded-none border border-white/15 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-accent resize-none"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <NumberField name="statYears"    label="Years"    defaultValue={client.stats.years}    />
          <NumberField name="statDesigns"  label="Designs"  defaultValue={client.stats.designs}  />
          <NumberField name="statProjects" label="Projects" defaultValue={client.stats.projects}  />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field name="rating"    label="Rating (0–5)" defaultValue={String(client.rating)}   placeholder="3.5" />
          <NumberField name="sortOrder" label="Sort Order" defaultValue={0} />
        </div>

        {/* Logo upload */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[11px] tracking-wider text-white/50">
            LOGO — upload to replace {client.logo ? "(current: uploaded)" : "(none yet)"}
          </label>
          {client.logo && (
            <img src={client.logo} alt="logo" className="mb-2 h-14 w-14 rounded-full border border-white/10 object-cover" />
          )}
          <input
            type="file"
            name="logo"
            accept="image/*"
            className="rounded-none border border-white/15 bg-white/5 px-4 py-2.5 font-mono text-xs text-white/60 file:mr-3 file:rounded-none file:border-0 file:bg-accent file:px-3 file:py-1 file:font-mono file:text-[11px] file:font-bold file:text-black"
          />
        </div>

        {error   && <p className="font-mono text-xs text-red-400">{error}</p>}
        {success && <p className="font-mono text-xs text-green-400">{success}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-none bg-accent px-6 py-3 font-mono text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "SAVING..." : "SAVE CHANGES"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 rounded-none border border-red-900/50 px-4 py-3 font-mono text-sm text-red-400 transition-colors hover:border-red-500 hover:text-red-300 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "DELETING..." : "DELETE"}
          </button>
        </div>
      </form>

      {/* ── Gallery ─────────────────────────────────── */}
      <div className="mt-14">
        <div className="mb-6 border-t border-white/10 pt-8">
          <h2 className="font-display text-lg font-bold text-white">Gallery</h2>
          <p className="mt-1 font-mono text-xs text-white/40">
            Upload an image and pick a label — the grid sizes itself automatically
          </p>
        </div>

        {/* Upload form */}
        <form onSubmit={handleAddGalleryItem} className="mb-8 flex flex-col gap-4 border border-white/10 bg-white/[0.02] p-5">
          <p className="font-mono text-[11px] font-bold tracking-wider text-white/50">ADD DESIGN</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="font-mono text-[11px] tracking-wider text-white/40">IMAGE</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="rounded-none border border-white/15 bg-white/5 px-3 py-2 font-mono text-xs text-white/60 file:mr-3 file:rounded-none file:border-0 file:bg-white/10 file:px-3 file:py-1 file:font-mono file:text-[11px] file:text-white/60"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[11px] tracking-wider text-white/40">LABEL</label>
              <select
                name="label"
                defaultValue="cover"
                className="rounded-none border border-white/15 bg-[#0f0f0f] px-3 py-2.5 font-mono text-sm text-white outline-none focus:border-accent"
              >
                {DESIGN_LABELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center gap-2 rounded-none bg-white/10 px-5 py-2.5 font-mono text-xs font-bold text-white transition-colors hover:bg-white/20 disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" />
              {uploading ? "UPLOADING..." : "UPLOAD"}
            </button>
          </div>
        </form>

        {/* Gallery grid */}
        {client.gallery.length === 0 ? (
          <p className="font-mono text-xs text-white/20">No designs yet. Upload one above.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {client.gallery.map((item) => (
              <div key={item.id} className="group relative flex flex-col gap-2">
                {/* Thumbnail */}
                <div className="relative aspect-square overflow-hidden border border-white/10 bg-white/5">
                  {item.image ? (
                    <img src={item.image} alt={item.label} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-mono text-[10px] text-white/20">NO IMAGE</span>
                    </div>
                  )}
                  {/* Delete overlay */}
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center bg-black/70 text-red-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-300"
                    title="Remove"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>

                {/* Label selector */}
                <select
                  value={item.label}
                  onChange={(e) => handleLabelChange(item.id, e.target.value)}
                  className="rounded-none border border-white/10 bg-[#0f0f0f] px-2 py-1.5 font-mono text-[11px] text-white/60 outline-none focus:border-accent"
                >
                  {DESIGN_LABELS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                  {!DESIGN_LABELS.includes(item.label as typeof DESIGN_LABELS[number]) && (
                    <option value={item.label}>{item.label}</option>
                  )}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Shared field components ───────────────────────────────────────────────

function Field({ name, label, defaultValue, required, placeholder }: {
  name: string; label: string; defaultValue?: string;
  required?: boolean; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[11px] tracking-wider text-white/50">
        {label.toUpperCase()}{required && <span className="text-accent"> *</span>}
      </label>
      <input
        type="text"
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="rounded-none border border-white/15 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}

function NumberField({ name, label, defaultValue }: {
  name: string; label: string; defaultValue?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[11px] tracking-wider text-white/50">{label.toUpperCase()}</label>
      <input
        type="number"
        name={name}
        defaultValue={defaultValue ?? 0}
        min={0}
        className="rounded-none border border-white/15 bg-white/5 px-4 py-3 font-mono text-sm text-white outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}
