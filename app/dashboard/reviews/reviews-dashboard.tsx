"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Star } from "lucide-react";
import { createReview, deleteReview, updateReview } from "@/lib/actions/reviews";
import type { ReviewRow } from "@/lib/data/reviews";
import { useRouter } from "next/navigation";

const FIELD = "rounded-none border border-white/15 bg-white/5 px-3 py-2 font-mono text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-accent w-full";
const LABEL = "font-mono text-[11px] tracking-wider text-white/50 block mb-1";

function ReviewForm({
  review,
  onDone,
}: {
  review?: ReviewRow;
  onDone: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      if (review) {
        await updateReview(review.id, fd);
      } else {
        await createReview(fd);
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>NAME *</label>
          <input name="name" required defaultValue={review?.name} className={FIELD} placeholder="Client Name" />
        </div>
        <div>
          <label className={LABEL}>ROLE</label>
          <input name="role" defaultValue={review?.role} className={FIELD} placeholder="CEO, Company Name" />
        </div>
      </div>

      <div>
        <label className={LABEL}>QUOTE *</label>
        <textarea name="quote" required rows={3} defaultValue={review?.quote} className={FIELD} placeholder="What they said about your work..." />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={LABEL}>RATING (1-5)</label>
          <input name="rating" type="number" min={1} max={5} defaultValue={review?.rating ?? 5} className={FIELD} />
        </div>
        <div>
          <label className={LABEL}>SORT ORDER</label>
          <input name="sortOrder" type="number" defaultValue={review?.sortOrder ?? 0} className={FIELD} />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input name="isFeatured" type="checkbox" defaultChecked={review?.isFeatured} className="h-4 w-4 accent-[#bb7cff]" />
            <span className="font-mono text-xs text-white/60">Homepage</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>AVATAR (Cloudinary upload)</label>
          <input name="avatar" type="file" accept="image/*" className={FIELD + " py-1.5"} />
        </div>
        <div>
          <label className={LABEL}>MODAL IMAGE (optional)</label>
          <input name="image" type="file" accept="image/*" className={FIELD + " py-1.5"} />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="rounded-none bg-accent px-5 py-2 font-mono text-xs font-bold text-black disabled:opacity-50">
          {saving ? "SAVING..." : review ? "UPDATE" : "ADD REVIEW"}
        </button>
        {review && (
          <button type="button" onClick={onDone}
            className="rounded-none border border-white/15 px-5 py-2 font-mono text-xs text-white/60 hover:text-white">
            CANCEL
          </button>
        )}
      </div>
    </form>
  );
}

function ReviewRow_({ review, onEdit }: { review: ReviewRow; onEdit: () => void }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete review from "${review.name}"?`)) return;
    setDeleting(true);
    try { await deleteReview(review.id); router.refresh(); }
    finally { setDeleting(false); }
  }

  return (
    <div className="flex items-start gap-4 border border-white/10 bg-white/[0.02] px-5 py-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <p className="font-display text-sm font-bold text-white">{review.name}</p>
          <p className="font-mono text-[11px] text-white/40">{review.role}</p>
          {review.isFeatured && (
            <span className="font-mono text-[10px] text-accent border border-accent/30 px-1.5 py-0.5">HOMEPAGE</span>
          )}
        </div>
        <div className="mt-1 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3 w-3" fill={i < review.rating ? "#bb7cff" : "none"} stroke="#bb7cff" />
          ))}
        </div>
        <p className="mt-2 font-mono text-xs text-white/50 line-clamp-2">{review.quote}</p>
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

export function ReviewsDashboard({ reviews }: { reviews: ReviewRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Reviews</h1>
          <p className="mt-1 font-mono text-xs text-white/40">
            {reviews.length} total · homepage shows entries marked "Homepage"
          </p>
        </div>
        <button onClick={() => setShowNew(!showNew)}
          className="inline-flex items-center gap-2 rounded-none bg-accent px-5 py-2.5 font-mono text-xs font-bold text-black">
          <Plus className="h-4 w-4" />
          ADD REVIEW
        </button>
      </div>

      {showNew && (
        <div className="mb-8 border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-4 font-mono text-xs font-bold tracking-wider text-white/60">NEW REVIEW</h2>
          <ReviewForm onDone={() => setShowNew(false)} />
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-white/10 py-24 text-center">
          <p className="font-mono text-sm text-white/30">No reviews yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {reviews.map((review) => (
            editingId === review.id ? (
              <div key={review.id} className="border border-accent/30 bg-white/[0.02] p-6">
                <h2 className="mb-4 font-mono text-xs font-bold tracking-wider text-white/60">EDITING</h2>
                <ReviewForm review={review} onDone={() => setEditingId(null)} />
              </div>
            ) : (
              <ReviewRow_ key={review.id} review={review} onEdit={() => setEditingId(review.id)} />
            )
          ))}
        </div>
      )}
    </div>
  );
}
