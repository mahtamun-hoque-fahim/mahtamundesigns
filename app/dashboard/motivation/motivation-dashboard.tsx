"use client";

import { useState } from "react";
import { upsertMotivationCard } from "@/lib/actions/motivation";
import { useRouter } from "next/navigation";

type CardData = { name: string | null; role: string | null; quote: string | null; avatar: string | null };

const FIELD = "rounded-none border border-white/15 bg-white/5 px-3 py-2 font-mono text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-accent w-full";
const LABEL = "font-mono text-[11px] tracking-wider text-white/50 block mb-1";

const PAGE_LABELS: Record<string, string> = {
  home:      "Homepage Secondary CTA",
  reviews:   "Reviews Page Secondary CTA",
  portfolio: "Portfolio Page Secondary CTA",
  about:     "About Page Secondary CTA",
};

function CardForm({ page, card }: { page: string; card?: CardData }) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    try {
      const fd = new FormData(e.currentTarget);
      await upsertMotivationCard(page, fd);
      setSuccess("Saved.");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const filled = !!(card?.name || card?.quote);

  return (
    <div className="border border-white/10 bg-white/[0.02] p-6">
      <div className="mb-5 flex items-center gap-3">
        <h2 className="font-mono text-xs font-bold tracking-wider text-white/70 uppercase">
          {PAGE_LABELS[page] ?? page}
        </h2>
        <span className={`font-mono text-[10px] px-1.5 py-0.5 border ${filled ? "border-green-500/40 text-green-400" : "border-white/15 text-white/30"}`}>
          {filled ? "FILLED" : "EMPTY"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>NAME</label>
            <input name="name" defaultValue={card?.name ?? ""} className={FIELD} placeholder="Client Name" />
          </div>
          <div>
            <label className={LABEL}>ROLE</label>
            <input name="role" defaultValue={card?.role ?? ""} className={FIELD} placeholder="CEO, Company" />
          </div>
        </div>

        <div>
          <label className={LABEL}>QUOTE</label>
          <textarea name="quote" rows={2} defaultValue={card?.quote ?? ""} className={FIELD} placeholder="Short testimonial shown in the CTA section..." />
        </div>

        <div>
          <label className={LABEL}>AVATAR (Cloudinary upload)</label>
          <input name="avatar" type="file" accept="image/*" className={FIELD + " py-1.5"} />
          {card?.avatar && (
            <p className="mt-1 font-mono text-[10px] text-white/30 truncate">Current: {card.avatar}</p>
          )}
        </div>

        {success && <p className="font-mono text-xs text-green-400">{success}</p>}

        <button type="submit" disabled={saving}
          className="rounded-none bg-accent px-5 py-2 font-mono text-xs font-bold text-black disabled:opacity-50 self-start">
          {saving ? "SAVING..." : "SAVE"}
        </button>
      </form>
    </div>
  );
}

export function MotivationDashboard({
  pages,
  cards,
}: {
  pages: string[];
  cards: Record<string, CardData>;
}) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Motivation Cards</h1>
        <p className="mt-1 font-mono text-xs text-white/40">
          One testimonial card per page — displayed in the right column of each page's Secondary CTA section.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {pages.map((page) => (
          <CardForm key={page} page={page} card={cards[page]} />
        ))}
      </div>
    </div>
  );
}
