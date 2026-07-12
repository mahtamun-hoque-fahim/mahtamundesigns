"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { createTimelineItem, deleteTimelineItem, updateTimelineItem } from "@/lib/actions/timeline";
import type { TimelineRow } from "@/lib/data/timeline";
import { useRouter } from "next/navigation";

const FIELD = "rounded-none border border-white/15 bg-white/5 px-3 py-2 font-mono text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-accent w-full";
const LABEL = "font-mono text-[11px] tracking-wider text-white/50 block mb-1";

function TimelineForm({ item, onDone }: { item?: TimelineRow; onDone: () => void }) {
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      if (item) {
        await updateTimelineItem(item.id, fd);
      } else {
        await createTimelineItem(fd);
        formRef.current?.reset();
      }
      router.refresh();
      onDone();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={LABEL}>YEAR *</label>
          <input name="year" required defaultValue={item?.year} className={FIELD} placeholder="2026" />
        </div>
        <div className="col-span-2">
          <label className={LABEL}>TITLE *</label>
          <input name="title" required defaultValue={item?.title} className={FIELD} placeholder="Milestone title" />
        </div>
      </div>
      <div>
        <label className={LABEL}>DESCRIPTION *</label>
        <textarea name="description" required rows={3} defaultValue={item?.description} className={FIELD} placeholder="What happened..." />
      </div>
      <div className="w-32">
        <label className={LABEL}>SORT ORDER</label>
        <input name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} className={FIELD} />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="rounded-none bg-accent px-5 py-2 font-mono text-xs font-bold text-black disabled:opacity-50">
          {saving ? "SAVING..." : item ? "UPDATE" : "ADD MILESTONE"}
        </button>
        {item && (
          <button type="button" onClick={onDone}
            className="rounded-none border border-white/15 px-5 py-2 font-mono text-xs text-white/60 hover:text-white">
            CANCEL
          </button>
        )}
      </div>
    </form>
  );
}

function TimelineItemRow({ item, onEdit }: { item: TimelineRow; onEdit: () => void }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${item.title}"?`)) return;
    setDeleting(true);
    try { await deleteTimelineItem(item.id); router.refresh(); }
    finally { setDeleting(false); }
  }

  return (
    <div className="flex items-start gap-4 border border-white/10 bg-white/[0.02] px-5 py-4">
      <GripVertical className="mt-1 h-4 w-4 shrink-0 text-white/20" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-accent">{item.year}</span>
          <p className="font-display text-sm font-bold text-white">{item.title}</p>
        </div>
        <p className="mt-1 font-mono text-xs text-white/50 line-clamp-2">{item.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onEdit}
          className="rounded-none border border-white/15 px-3 py-1.5 font-mono text-[11px] text-white/60 hover:border-white/30 hover:text-white">
          Edit
        </button>
        <button onClick={handleDelete} disabled={deleting}
          className="flex h-8 w-8 items-center justify-center text-white/30 hover:text-red-400 disabled:opacity-50">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function TimelineDashboard({ items }: { items: TimelineRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">About Timeline</h1>
          <p className="mt-1 font-mono text-xs text-white/40">
            {items.length} milestones · sorted by Sort Order asc
          </p>
        </div>
        <button onClick={() => setShowNew(!showNew)}
          className="inline-flex items-center gap-2 rounded-none bg-accent px-5 py-2.5 font-mono text-xs font-bold text-black">
          <Plus className="h-4 w-4" />
          ADD MILESTONE
        </button>
      </div>

      {showNew && (
        <div className="mb-8 border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-4 font-mono text-xs font-bold tracking-wider text-white/60">NEW MILESTONE</h2>
          <TimelineForm onDone={() => setShowNew(false)} />
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-white/10 py-24 text-center">
          <p className="font-mono text-sm text-white/30">No milestones yet. Add one above.</p>
          <p className="mt-2 font-mono text-xs text-white/20">Until you add entries here, the about page shows the hardcoded defaults.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            editingId === item.id ? (
              <div key={item.id} className="border border-accent/30 bg-white/[0.02] p-6">
                <h2 className="mb-4 font-mono text-xs font-bold tracking-wider text-white/60">EDITING</h2>
                <TimelineForm item={item} onDone={() => setEditingId(null)} />
              </div>
            ) : (
              <TimelineItemRow key={item.id} item={item} onEdit={() => setEditingId(item.id)} />
            )
          ))}
        </div>
      )}
    </div>
  );
}
